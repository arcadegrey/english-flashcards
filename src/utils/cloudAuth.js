import cloudbase from '@cloudbase/js-sdk'

const CLOUDBASE_ENV_ID = String(import.meta.env.VITE_CLOUDBASE_ENV_ID || '').trim()
const CLOUDBASE_REGION = String(import.meta.env.VITE_CLOUDBASE_REGION || 'ap-shanghai').trim()
const CLOUDBASE_PUBLISHABLE_KEY = String(
  import.meta.env.VITE_CLOUDBASE_PUBLISHABLE_KEY || import.meta.env.VITE_CLOUDBASE_ACCESS_KEY || ''
).trim()
const CLOUDBASE_PROGRESS_COLLECTION = String(
  import.meta.env.VITE_CLOUDBASE_PROGRESS_COLLECTION || 'user_progress'
).trim()

const SIGNUP_VERIFY_TIMEOUT = 10 * 60 * 1000
const EMPTY_PROGRESS = {
  learnedWords: [],
  masteredWords: [],
  customWords: [],
}

let appInstance = null
const pendingSignUpVerifications = new Map()

const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isCloudAuthConfigured = () => Boolean(CLOUDBASE_ENV_ID)

const throwIfNotConfigured = () => {
  if (isCloudAuthConfigured()) return
  throw new Error('CloudBase 未配置，请设置 VITE_CLOUDBASE_ENV_ID。')
}

const getApp = () => {
  throwIfNotConfigured()

  if (appInstance) return appInstance

  const initOptions = {
    env: CLOUDBASE_ENV_ID,
    region: CLOUDBASE_REGION || 'ap-shanghai',
    auth: {
      detectSessionInUrl: true,
    },
  }

  // CloudBase Web SDK init field is `accessKey`; here we accept publishable key from env.
  if (CLOUDBASE_PUBLISHABLE_KEY) {
    initOptions.accessKey = CLOUDBASE_PUBLISHABLE_KEY
  }

  appInstance = cloudbase.init(initOptions)
  return appInstance
}

const getAuth = () => {
  const app = getApp()
  const auth = typeof app.auth === 'function' ? app.auth() : app.auth
  if (!auth) {
    throw new Error('CloudBase Auth 初始化失败。')
  }
  return auth
}

const getDatabase = () => {
  const app = getApp()
  const database = typeof app.database === 'function' ? app.database() : app.database
  if (!database) {
    throw new Error('CloudBase 数据库初始化失败。')
  }
  return database
}

const normalizeArrayIds = (list) => {
  const safeList = Array.isArray(list) ? list : []
  const seen = new Set()
  const result = []

  safeList.forEach((item) => {
    if (item == null) return
    const key = String(item)
    if (!key || seen.has(key)) return
    seen.add(key)
    result.push(item)
  })

  return result
}

const normalizeCustomWords = (list) => {
  const safeList = Array.isArray(list) ? list : []
  return safeList.filter((word) => isObject(word) && String(word.word || '').trim())
}

const normalizeProgressPayload = (progress) => ({
  learnedWords: normalizeArrayIds(progress?.learnedWords),
  masteredWords: normalizeArrayIds(progress?.masteredWords),
  customWords: normalizeCustomWords(progress?.customWords),
})

const getErrorMessage = (error, fallback = '请求失败，请稍后重试。') => {
  if (!error) return fallback
  if (typeof error === 'string') return error
  return error.message || error.code || fallback
}

const ensureNoAuthError = (response, fallback) => {
  if (response?.error) {
    throw new Error(getErrorMessage(response.error, fallback))
  }
  return response?.data
}

const sanitizeUserId = (userId) => String(userId || '').trim()

const toBase64Url = (text) => {
  try {
    return btoa(unescape(encodeURIComponent(text)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '')
  } catch {
    return ''
  }
}

const toProgressDocId = (rawUserId) => {
  const userId = sanitizeUserId(rawUserId)
  if (!userId) return ''

  // Keep simple IDs unchanged for backward compatibility.
  if (/^[A-Za-z0-9_-]{1,64}$/.test(userId)) {
    return userId
  }

  // Fallback for provider UIDs containing reserved chars.
  const encoded = toBase64Url(userId)
  if (encoded) {
    return `uid_${encoded}`.slice(0, 120)
  }

  return `uid_${Date.now()}`
}

const getProgressDocCandidates = (rawUserId) => {
  const safeUserId = sanitizeUserId(rawUserId)
  const primaryDocId = toProgressDocId(safeUserId)
  return Array.from(new Set([primaryDocId, safeUserId])).filter(Boolean)
}

const getDocId = (doc) =>
  String(doc?._id || doc?.id || doc?.docId || doc?._docId || '').trim()

const loadByDocId = async (collection, docId) => {
  if (!docId) return null
  const response = await collection.doc(docId).get()
  return extractDocFromResponse(response)
}

const loadByUserId = async (collection, userId) => {
  if (!userId) return null
  const response = await collection.where({ userId }).limit(1).get()
  const data = Array.isArray(response?.data) ? response.data : []
  if (data.length > 0) return data[0]
  return extractDocFromResponse(response)
}

const isPermissionError = (error) => {
  const text = getErrorMessage(error, '').toLowerCase()
  return (
    text.includes('permission') ||
    text.includes('unauthorized') ||
    text.includes('forbidden') ||
    text.includes('auth failed') ||
    text.includes('no auth') ||
    text.includes('权限')
  )
}

const findExistingProgressDoc = async (collection, userId) => {
  // Prefer deterministic doc id lookup, avoids list/query permission issues.
  const docCandidates = getProgressDocCandidates(userId)
  for (const docId of docCandidates) {
    try {
      const directDoc = await loadByDocId(collection, docId)
      if (directDoc) return directDoc
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error
      }
    }
  }

  // Fallback: query by userId for historical docs created with random _id.
  try {
    const byUserId = await loadByUserId(collection, userId)
    if (byUserId) return byUserId
  } catch (error) {
    if (!isPermissionError(error) && !isNotFoundError(error)) {
      throw error
    }
    // Ignore permission errors here; write path will use deterministic doc id.
  }

  return null
}

const normalizeSession = (session) => {
  if (!isObject(session)) return null

  const nextSession = { ...session }
  if (!nextSession.access_token && nextSession.accessToken) {
    nextSession.access_token = nextSession.accessToken
  }
  if (!nextSession.refresh_token && nextSession.refreshToken) {
    nextSession.refresh_token = nextSession.refreshToken
  }
  if (!nextSession.expires_in && nextSession.expiresIn) {
    nextSession.expires_in = nextSession.expiresIn
  }

  if (!nextSession.expires_at && Number.isFinite(Number(nextSession.expires_in))) {
    const expiresInSeconds = Number(nextSession.expires_in)
    if (expiresInSeconds > 0) {
      nextSession.expires_at = Math.floor(Date.now() / 1000) + expiresInSeconds
    }
  }

  return nextSession
}

const decodeJwtPayload = (token) => {
  try {
    const parts = String(token || '').split('.')
    if (parts.length < 2) return null
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const normalizedPayload = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')
    const decoded = atob(normalizedPayload)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

const normalizeUser = (user, fallbackToken = '') => {
  const source = isObject(user) ? { ...user } : {}
  const jwtPayload = fallbackToken ? decodeJwtPayload(fallbackToken) : null

  const id =
    source.id ||
    source.uid ||
    source.ID ||
    source.user_id ||
    source.uuid ||
    source.sub ||
    source._id ||
    jwtPayload?.sub ||
    jwtPayload?.uid ||
    jwtPayload?.user_id ||
    ''

  if (!id) return null

  const email =
    source.email ||
    source.email_address ||
    source.username ||
    jwtPayload?.email ||
    jwtPayload?.username ||
    ''

  return {
    ...source,
    id: String(id),
    email: email ? String(email) : '',
  }
}

const extractSessionAndUser = (data) => {
  const session = normalizeSession(data?.session)
  const userFromSession = session?.user
  const user = normalizeUser(data?.user || userFromSession, session?.access_token || '')

  return {
    session,
    user,
  }
}

const isNotFoundError = (error) => {
  const text = getErrorMessage(error, '').toLowerCase()
  return (
    text.includes('not found') ||
    text.includes('not exist') ||
    text.includes('no record') ||
    text.includes('record not found')
  )
}

const extractDocFromResponse = (response) => {
  const candidates = []

  if (isObject(response)) {
    candidates.push(response.data)
    candidates.push(response.result)
  }

  while (candidates.length > 0) {
    const candidate = candidates.shift()
    if (!candidate) continue

    if (Array.isArray(candidate)) {
      if (candidate.length > 0 && isObject(candidate[0])) {
        return candidate[0]
      }
      continue
    }

    if (isObject(candidate)) {
      if (Array.isArray(candidate.data)) {
        candidates.push(candidate.data)
        continue
      }
      if (isObject(candidate.data)) {
        candidates.push(candidate.data)
        continue
      }
      return candidate
    }
  }

  return null
}

const ensureSdkSession = async ({ accessToken, refreshToken }) => {
  const auth = getAuth()
  const current = ensureNoAuthError(await auth.getSession(), '读取当前会话失败')
  const currentAccessToken = String(current?.session?.access_token || '')

  if (!accessToken || currentAccessToken === accessToken) {
    return
  }

  if (!refreshToken) {
    return
  }

  ensureNoAuthError(
    await auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }),
    '恢复会话失败'
  )
}

const pruneExpiredSignUpSessions = () => {
  const now = Date.now()
  pendingSignUpVerifications.forEach((entry, key) => {
    if (!entry || now > entry.expiresAt) {
      pendingSignUpVerifications.delete(key)
    }
  })
}

const normalizeSignupKey = (email) => String(email || '').trim().toLowerCase()

const suggestUsernameFromEmail = (email) => {
  const raw = String(email || '').split('@')[0] || 'user'
  const cleaned = raw.replace(/[^a-zA-Z0-9\-_.:+@]/g, '').slice(0, 24)
  if (!cleaned) return `user${Date.now().toString().slice(-6)}`
  if (/^\d+$/.test(cleaned)) return `u${cleaned}`
  return cleaned
}

export { isCloudAuthConfigured }

export const signInWithEmail = async ({ email, password }) => {
  const auth = getAuth()

  const data = ensureNoAuthError(
    await auth.signInWithPassword({
      email: String(email || '').trim(),
      password: String(password || ''),
    }),
    '登录失败'
  )

  const { session, user } = extractSessionAndUser(data)
  if (!session?.access_token || !user?.id) {
    throw new Error('登录成功但未获取会话，请重试。')
  }

  return { session, user }
}

export const signUpWithEmail = async ({ email, password, verificationCode }) => {
  const safeEmail = String(email || '').trim()
  const safePassword = String(password || '')
  const safeCode = String(verificationCode || '').trim()
  const signUpKey = normalizeSignupKey(safeEmail)
  const auth = getAuth()

  if (!safeEmail || !safePassword) {
    throw new Error('请填写邮箱和密码。')
  }

  pruneExpiredSignUpSessions()

  if (!safeCode) {
    const data = ensureNoAuthError(
      await auth.signUp({
        email: safeEmail,
        password: safePassword,
        username: suggestUsernameFromEmail(safeEmail),
      }),
      '发送验证码失败'
    )

    if (typeof data?.verifyOtp === 'function') {
      pendingSignUpVerifications.set(signUpKey, {
        verifyOtp: data.verifyOtp,
        expiresAt: Date.now() + SIGNUP_VERIFY_TIMEOUT,
      })
      return {
        session: null,
        user: null,
        emailConfirmationRequired: true,
        pendingVerification: true,
        message: '验证码已发送到邮箱，请输入验证码完成注册。',
      }
    }

    const { session, user } = extractSessionAndUser(data)
    if (session?.access_token && user?.id) {
      return {
        session,
        user,
        emailConfirmationRequired: false,
        pendingVerification: false,
        message: '注册并登录成功。',
      }
    }

    return {
      session: null,
      user: null,
      emailConfirmationRequired: true,
      pendingVerification: true,
      message: '注册请求已提交，请完成邮箱验证后继续。',
    }
  }

  const pendingSession = pendingSignUpVerifications.get(signUpKey)
  if (!pendingSession?.verifyOtp) {
    throw new Error('验证码会话已失效，请先点击“注册账号”重新发送验证码。')
  }
  if (Date.now() > pendingSession.expiresAt) {
    pendingSignUpVerifications.delete(signUpKey)
    throw new Error('验证码已过期，请重新发送。')
  }

  const verifyData = ensureNoAuthError(
    await pendingSession.verifyOtp({ token: safeCode }),
    '验证码校验失败'
  )

  const { session, user } = extractSessionAndUser(verifyData)
  if (!session?.access_token || !user?.id) {
    throw new Error('验证码通过，但未建立会话，请直接登录。')
  }

  pendingSignUpVerifications.delete(signUpKey)
  return {
    session,
    user,
    emailConfirmationRequired: false,
    pendingVerification: false,
    message: '注册并登录成功。',
  }
}

export const signOut = async () => {
  const auth = getAuth()
  const response = await auth.signOut()
  if (response?.error) {
    const message = getErrorMessage(response.error, '退出登录失败')
    const lower = message.toLowerCase()
    if (!lower.includes('not logged in') && !lower.includes('session not found')) {
      throw new Error(message)
    }
  }
}

export const refreshSession = async (refreshToken) => {
  const auth = getAuth()
  const safeRefreshToken = String(refreshToken || '').trim()

  const data = ensureNoAuthError(
    await auth.refreshSession(safeRefreshToken || undefined),
    '刷新登录会话失败'
  )

  const { session, user } = extractSessionAndUser(data)
  if (!session?.access_token || !user?.id) {
    throw new Error('登录会话已失效，请重新登录。')
  }

  return { session, user }
}

export const fetchCurrentUser = async (accessToken, refreshToken) => {
  const auth = getAuth()
  await ensureSdkSession({ accessToken, refreshToken })

  const sessionData = ensureNoAuthError(await auth.getSession(), '获取会话失败')
  const session = normalizeSession(sessionData?.session)
  const sessionUser = normalizeUser(session?.user, accessToken)
  if (sessionUser?.id) return sessionUser

  const userData = ensureNoAuthError(await auth.getUser(), '获取用户信息失败')
  const user = normalizeUser(userData?.user, accessToken)
  if (user?.id) return user

  const jwtUser = normalizeUser({}, accessToken)
  if (jwtUser?.id) return jwtUser

  throw new Error('无法获取当前登录用户。')
}

export const loadCloudProgress = async ({ userId, accessToken, refreshToken }) => {
  const safeUserId = sanitizeUserId(userId)
  if (!safeUserId) return { ...EMPTY_PROGRESS }

  await ensureSdkSession({ accessToken, refreshToken })
  const collection = getDatabase().collection(CLOUDBASE_PROGRESS_COLLECTION)

  try {
    const doc = await findExistingProgressDoc(collection, safeUserId)
    if (!doc) return { ...EMPTY_PROGRESS }

    return normalizeProgressPayload(doc)
  } catch (error) {
    if (isNotFoundError(error)) {
      return { ...EMPTY_PROGRESS }
    }
    throw new Error(getErrorMessage(error, '读取云端进度失败'))
  }
}

export const upsertCloudProgress = async ({ userId, accessToken, refreshToken, progress }) => {
  const safeUserId = sanitizeUserId(userId)
  const fallbackDocId = toProgressDocId(safeUserId)
  if (!safeUserId) {
    throw new Error('同步失败：缺少用户 ID。')
  }
  if (!fallbackDocId) {
    throw new Error('同步失败：用户 ID 格式无效。')
  }

  await ensureSdkSession({ accessToken, refreshToken })
  const collection = getDatabase().collection(CLOUDBASE_PROGRESS_COLLECTION)
  const normalized = normalizeProgressPayload(progress)
  const updatedAt = new Date().toISOString()

  try {
    const existingDoc = await findExistingProgressDoc(collection, safeUserId)
    const existingDocId = getDocId(existingDoc) || fallbackDocId
    const payload = {
      userId: safeUserId,
      ...normalized,
      updatedAt,
    }

    if (existingDocId) {
      await collection.doc(existingDocId).set(payload)
    } else {
      await collection.add(payload)
    }
  } catch (error) {
    throw new Error(getErrorMessage(error, '写入云端进度失败'))
  }

  return updatedAt
}
