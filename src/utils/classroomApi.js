import { requestApi } from './workerAuth.js';

const call = async (path, options = {}) => {
  try {
    const timeout = AbortSignal.timeout(20000);
    return await requestApi(path, {
      ...options, signal: options.signal ? AbortSignal.any([options.signal, timeout]) : timeout,
    });
  } catch (error) {
    if (error.name === 'TimeoutError') throw new Error('请求超时，请检查网络后重试。');
    throw error;
  }
};

export const loadClassroom = (signal) => call('/classroom', { signal });
export const saveClassroomProfile = (profile) => call('/classroom/profile', { method: 'POST', body: profile });
export const createClassroom = (name) => call('/classes', { method: 'POST', body: { name } });
export const joinClassroom = (inviteCode) => call('/classes/join', { method: 'POST', body: { inviteCode } });
export const loadClassStudents = (id, page, signal) => call(`/classes/${encodeURIComponent(id)}/students?page=${page}`, { signal });
export const loadStudentProgress = (classId, studentId, signal) => call(`/classes/${encodeURIComponent(classId)}/students/${encodeURIComponent(studentId)}/progress`, { signal });
export const removeClassStudent = (classId, studentId) => call(`/classes/${encodeURIComponent(classId)}/students/${encodeURIComponent(studentId)}`, { method: 'DELETE' });
export const leaveClassroom = (id) => call(`/classes/${encodeURIComponent(id)}/membership`, { method: 'DELETE' });
export const rotateClassInvite = (id) => call(`/classes/${encodeURIComponent(id)}/invite-code`, { method: 'POST', body: {} });
