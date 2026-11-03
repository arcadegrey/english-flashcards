import { handleClassroomApi } from './classroom.js';
import { handleReadingApi } from './readingAssignments.js';
import { handleWordAssignments } from './wordAssignments.js';
import { handleReadingAttempts } from './readingAttempts.js';
import { handleExamAttempts } from './examAttempts.js';
import { handleWeeklyReport } from './weeklyReport.js';
import { serveStaticAsset } from './staticAssets.js';
import { handlePasswordAuth } from './passwordAuth.js';
import { errorJson } from './http.js';
import { getUserByEmail, getSessionUser, issueSession, handleAuthMe, handleLogout } from './authSession.js';
import { sendCodeEmail, handleSendCode, handleVerifyCode } from './emailAuth.js';
import { handleGetProgress, handlePutProgress } from './progressRoutes.js';
export { PasswordHasher } from './passwordHasher.js';
export { mergeProgress } from './progressModel.js';

const handleApi = async (request, env, context) => {
  const url = new URL(request.url);
  const { pathname } = url;
  if (request.method === 'POST' && pathname.startsWith('/api/auth/')) {
    const origin = request.headers.get('origin');
    if (request.headers.get('sec-fetch-site') === 'cross-site' || origin && origin !== url.origin) return errorJson('不允许跨站操作。', 403, 'CROSS_SITE');
    if (!request.headers.get('content-type')?.startsWith('application/json')) return errorJson('请使用 JSON 提交。', 415);
  }
  const expectedUserId = request.headers.get('x-flashcards-user');
  if (expectedUserId) {
    const currentUser = await getSessionUser(env, request);
    if (!currentUser) return errorJson('请重新登录账号。', 401, 'UNAUTHORIZED');
    if (expectedUserId !== currentUser.id) return errorJson('账号已切换，请刷新页面后重试。', 409, 'ACCOUNT_CHANGED');
  }

  if (/^\/api\/classes\/[\w-]+\/weekly-report$/.test(pathname)) return handleWeeklyReport(request, env, await getSessionUser(env, request));
  if (pathname === '/api/exam-attempts') return handleExamAttempts(request, env, await getSessionUser(env, request));
  if (pathname === '/api/reading-attempts') return handleReadingAttempts(request, env, await getSessionUser(env, request));
  if (pathname === '/api/word-assignments' || pathname.startsWith('/api/word-assignments/') || /^\/api\/classes\/[\w-]+\/word-assignments$/.test(pathname)) {
    return handleWordAssignments(request, env, await getSessionUser(env, request));
  }

  if (pathname.startsWith('/api/reading-sessions/') || pathname === '/api/assignments' || pathname.startsWith('/api/assignments/') || /^\/api\/classes\/[\w-]+\/assignments$/.test(pathname)) {
    return handleReadingApi(request, env, await getSessionUser(env, request));
  }

  if (pathname === '/api/classroom' || pathname.startsWith('/api/classroom/') || pathname === '/api/classes' || pathname.startsWith('/api/classes/')) {
    return handleClassroomApi(request, env, await getSessionUser(env, request));
  }

  if (pathname.startsWith('/api/auth/password/')) {
    try {
      return await handlePasswordAuth(request, env, { getUserByEmail, getSessionUser, issueSession, sendCodeEmail }, context);
    } catch {
      return errorJson('账号服务暂不可用，请稍后重试。', 503, 'AUTH_UNAVAILABLE');
    }
  }

  if (request.method === 'POST' && pathname === '/api/auth/send-code') {
    return handleSendCode(request, env);
  }
  if (request.method === 'POST' && pathname === '/api/auth/verify-code') {
    return handleVerifyCode(request, env);
  }
  if (request.method === 'GET' && pathname === '/api/auth/me') {
    return handleAuthMe(request, env);
  }
  if (request.method === 'POST' && pathname === '/api/auth/logout-all') {
    return handleLogout(request, env, true);
  }
  if (request.method === 'POST' && pathname === '/api/auth/logout') {
    return handleLogout(request, env);
  }
  if (request.method === 'GET' && pathname === '/api/progress') {
    return handleGetProgress(request, env);
  }
  if (request.method === 'PUT' && pathname === '/api/progress') {
    return handlePutProgress(request, env);
  }

  return errorJson('接口不存在。', 404, 'NOT_FOUND');
};

export default {
  async fetch(request, env, context) {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api/')) {
        return await handleApi(request, env, context);
      }

      if (env?.ASSETS?.fetch) {
        return await serveStaticAsset(request, env.ASSETS);
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      return errorJson(error?.message || '服务器内部错误。', 500, 'INTERNAL_ERROR');
    }
  },
};
