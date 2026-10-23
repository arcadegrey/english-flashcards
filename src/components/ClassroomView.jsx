import { TeacherReadingAssignments, StudentReadingAssignments } from './classroom/ReadingAssignments';
import { useEffect, useState } from 'react';
import AppLayout from './layout/AppLayout';
import { BaseCard } from './ui/Cards';
import { PrimaryButton, SecondaryButton } from './ui/Buttons';
import AccountRoleChoice from './AccountRoleChoice';
import StudentProgressPanel from './classroom/StudentProgressPanel';
import ClassWeeklyReport from './classroom/ClassWeeklyReport';
import { createClassroom, joinClassroom, leaveClassroom, loadClassroom, loadClassStudents, removeClassStudent, rotateClassInvite, saveClassroomProfile } from '../utils/classroomApi';
import { formatClassroomDate, getAccountRoleLabel } from '../utils/classroom';
import '../styles/classroom.css';

function ProfileEditor({ profile, locked, busy, onSave }) {
  const [role, setRole] = useState(profile.role || 'student');
  const [name, setName] = useState(profile.displayName || '');
  return (
    <form className="classroom-profile-form" onSubmit={(event) => { event.preventDefault(); onSave({ role, displayName: name.trim() }); }}>
      <AccountRoleChoice value={role} onChange={setRole} disabled={busy} locked={locked} />
      <label className="classroom-field">姓名 / 昵称
        <input className="classroom-input" value={name} onChange={(event) => setName(event.target.value)} required maxLength={40} />
      </label>
      <p className="classroom-helper">{locked ? '已有班级关联时身份不可切换，姓名仍可修改。' : '学生通过邀请码加入班级，老师仅能查看自己班级的学生。'}</p>
      <PrimaryButton type="submit" disabled={busy || !name.trim()}>{busy ? '正在保存…' : '保存身份资料'}</PrimaryButton>
    </form>
  );
}

function StudentRoster({ classroom, refreshKey, onSelectStudent, onChanged }) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError('');
      try {
        const result = await loadClassStudents(classroom.id, page, controller.signal);
        if (!controller.signal.aborted) {
          setData(result);
          if (result.total > 0 && (page - 1) * result.pageSize >= result.total) setPage(Math.ceil(result.total / result.pageSize));
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(err.message);
      } finally { if (!controller.signal.aborted) setLoading(false); }
    };
    load();
    return () => controller.abort();
  }, [classroom.id, page, refreshKey, retry]);

  const remove = async (student) => {
    setBusy(true); setError('');
    try { await removeClassStudent(classroom.id, student.id); onChanged(); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  return (
    <section aria-label="班级学生" className="classroom-roster">
      <div className="classroom-heading"><div><h3>学生学习进度</h3><p>共 {data?.total ?? classroom.studentCount} 位学生 · 点击学生查看单词与阅读记录</p></div>
        <SecondaryButton disabled={loading} onClick={onChanged}>刷新进度</SecondaryButton>
      </div>
      {error && <div className="classroom-alert" role="alert">{error}<SecondaryButton onClick={() => setRetry((value) => value + 1)}>重试</SecondaryButton></div>}
      {loading ? <p className="classroom-empty" role="status">正在读取学生进度…</p> : !error && data?.students.length === 0 ? (
        <div className="classroom-empty"><img src="/images/ui-assets/category-all-words-blue-v1.png" alt="" /><h3>等待学生加入</h3><p>把班级邀请码发给学生，加入后即可在这里查看学习记录。</p></div>
      ) : !error && (
        <>
          <div className="classroom-roster-labels" aria-hidden="true"><span>学生</span><span>今日练词</span><span>已学习</span><span>标记认识</span><span>今日阅读</span><span>最近同步</span><span /></div>
          <ul className="classroom-student-list">
            {data?.students.map((student) => (
              <li key={student.id}>
                <button type="button" className="classroom-student-row" onClick={() => onSelectStudent(student)} aria-label={`查看${student.displayName}的学习记录`}>
                  <span className="classroom-student-name"><strong>{student.displayName}</strong><small>{student.email}</small></span>
                  <span data-label="今日练词">{student.todayStudied} 次</span>
                  <span data-label="已学习">{student.learnedCount} 词</span>
                  <span data-label="标记认识">{student.masteredCount} 词</span>
                  <span data-label="今日阅读">{student.todayReadingsCompleted ?? 0} 篇<small className="classroom-reading-meta">{student.todayReadingQuestionsAnswered ?? 0} 题已答</small></span>
                  <span data-label="最近同步">{formatClassroomDate(student.lastSyncedAt)}</span>
                </button>
                <button type="button" className="classroom-text-button" disabled={busy} onClick={() => remove(student)} aria-label={`移除${student.displayName}`}>移除</button>
              </li>
            ))}
          </ul>
          {data && data.total > data.pageSize && <div className="classroom-pagination"><SecondaryButton disabled={page <= 1} onClick={() => setPage(page - 1)}>上一页</SecondaryButton><span>第 {page} / {Math.ceil(data.total / data.pageSize)} 页</span><SecondaryButton disabled={page * data.pageSize >= data.total} onClick={() => setPage(page + 1)}>下一页</SecondaryButton></div>}
        </>
      )}
    </section>
  );
}

export default function ClassroomView({ user, navItems, topbarProps, onAuthOpen, onProfileUpdated, onSync, onStartAssignment, initialVocabulary = [] }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [student, setStudent] = useState(null);
  const [className, setClassName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const userId = user?.id;
  const selectStudent = value => {
    setStudent(value);
    requestAnimationFrame(() => document.querySelector('.classroom-student-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError('');
      try {
        const result = await loadClassroom(controller.signal, userId);
        if (controller.signal.aborted) return;
        setData(result);
        setSelectedClassId((current) => result.classes.some((item) => item.id === current) ? current : result.classes[0]?.id || '');
        onProfileUpdated(result.profile);
      } catch (err) { if (!controller.signal.aborted) setError(err.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    };
    load();
    return () => controller.abort();
  }, [userId, refresh, onProfileUpdated]);

  const perform = async (action, message) => {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const result = await action();
      setNotice(result?.notice || message); setRefresh((value) => value + 1);
      return result;
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const profile = data?.profile;
  const teacher = profile?.role === 'teacher';
  const selectedClass = data?.classes.find((item) => item.id === selectedClassId);
  const title = profile?.profileConfigured ? teacher ? '教学班级' : '我的班级' : '师生班级';

  return (
    <AppLayout active="profile" navItems={navItems} title={title} subtitle="通过班级连接老师和学生，跟进真实学习记录。" topbarProps={topbarProps}>
      <div className="ds-stack classroom-page">
        {!userId ? <BaseCard className="classroom-panel classroom-empty"><h2>登录后使用班级功能</h2><p>老师可以创建班级，学生可以通过邀请码加入。</p><PrimaryButton onClick={onAuthOpen}>登录 / 注册</PrimaryButton></BaseCard> : (
          <>
            {error && <div className="classroom-alert" role="alert">{error}<SecondaryButton onClick={() => setRefresh((value) => value + 1)}>重新加载</SecondaryButton></div>}
            {notice && <p className="classroom-notice" role="status">{notice}</p>}
            {!data && loading && <BaseCard className="classroom-panel" role="status">正在加载班级…</BaseCard>}
            {profile && <BaseCard className="classroom-panel">
              <div className="classroom-heading"><div><span className="exam-section-pill">{getAccountRoleLabel(profile)}</span><h2>{profile.displayName}，{teacher ? '查看班级的学习情况' : '和老师一起保持学习节奏'}</h2><p>{profile.email}</p></div></div>
              {profile.profileConfigured ? <details className="classroom-profile-details"><summary>修改身份资料</summary><ProfileEditor key={`${profile.role}:${profile.displayName}:${data.classes.length > 0}`} profile={profile} locked={data.classes.length > 0} busy={busy} onSave={(values) => perform(async () => { const result = await saveClassroomProfile(values); onProfileUpdated(result.user); }, '资料已保存。')} /></details>
                : <ProfileEditor profile={profile} busy={busy} onSave={(values) => perform(async () => { const result = await saveClassroomProfile(values); onProfileUpdated(result.user); }, '身份设置完成。')} />}
            </BaseCard>}

            {profile?.profileConfigured && teacher && (
              <>
                <BaseCard className="classroom-panel"><div className="classroom-heading"><div><h2>我的班级</h2><p>创建班级后，把邀请码分享给学生。</p></div><span className="exam-section-pill">{data.classes.length} 个班级</span></div>
                  <form className="classroom-inline-form" onSubmit={(event) => { event.preventDefault(); perform(async () => { const result = await createClassroom(className.trim()); setSelectedClassId(result.classroom.id); setClassName(''); setStudent(null); }, '班级已创建，可以分享邀请码了。'); }}>
                    <label className="classroom-field">班级名称<input className="classroom-input" placeholder="例如：托福冲刺一班" value={className} required maxLength={60} onChange={(event) => setClassName(event.target.value)} /></label>
                    <PrimaryButton type="submit" disabled={busy || !className.trim()}>创建班级</PrimaryButton>
                  </form>
                </BaseCard>
                {selectedClass && <BaseCard className="classroom-panel">
                  <div className="classroom-heading"><label className="classroom-field">当前班级<select className="classroom-input" value={selectedClassId} onChange={(event) => { setSelectedClassId(event.target.value); setStudent(null); }}>{data.classes.map((item) => <option value={item.id} key={item.id}>{item.name} · {item.studentCount} 人</option>)}</select></label>
                    <div className="classroom-invite"><span>班级邀请码 <strong>{selectedClass.inviteCode}</strong></span><div className="classroom-actions">
                      <SecondaryButton onClick={async () => { try { await navigator.clipboard.writeText(selectedClass.inviteCode); setNotice('邀请码已复制。'); } catch { setNotice('可选中邀请码手动复制。'); } }}>复制邀请码</SecondaryButton>
                      <SecondaryButton disabled={busy} onClick={() => perform(() => rotateClassInvite(selectedClass.id), '邀请码已更换，旧码不能再加入，现有学生保持不变。')}>更换邀请码</SecondaryButton>
                    </div></div>
                  </div>
                  <ClassWeeklyReport key={`weekly:${selectedClass.id}`} classId={selectedClass.id} userId={userId} refreshKey={refresh} onSelectStudent={selectStudent} onPublished={() => setRefresh(value => value + 1)} />
                  <TeacherReadingAssignments key={`assignments:${selectedClass.id}:${refresh}`} classId={selectedClass.id} userId={userId} />
                  {student ? <StudentProgressPanel key={`student:${selectedClass.id}:${student.id}`} classId={selectedClass.id} student={student} initialVocabulary={initialVocabulary} onBack={() => setStudent(null)} />
                    : <StudentRoster key={`roster:${selectedClass.id}`} classroom={selectedClass} refreshKey={refresh} onSelectStudent={selectStudent} onChanged={() => setRefresh((value) => value + 1)} />}
                </BaseCard>}
              </>
            )}

            {profile?.profileConfigured && !teacher && (
              <>
                <StudentReadingAssignments userId={userId} onStart={onStartAssignment} />
                <BaseCard className="classroom-panel"><div className="classroom-heading"><div><h2>加入老师的班级</h2><p>加入后，该班老师可以查看你已同步的单词与复习状态、阅读完成记录、自主测试成绩及班级周报中的答题薄弱点；未提交草稿不共享，退出后停止共享。</p></div></div>
                  <form className="classroom-inline-form" onSubmit={(event) => { event.preventDefault(); perform(async () => { await joinClassroom(inviteCode); setInviteCode(''); try { await onSync?.(); } catch { return { notice: '已加入班级，进度暂未同步，请稍后点击同步学习进度。' }; } }, '已加入班级。老师可以查看你的云端学习记录。'); }}>
                    <label className="classroom-field">班级邀请码<input className="classroom-input classroom-code-input" placeholder="输入老师的 10 位邀请码" value={inviteCode} onChange={(event) => setInviteCode(event.target.value.toUpperCase().replace(/\s/g, ''))} required maxLength={10} pattern="[A-HJ-NP-Z2-9]{10}" /></label>
                    <PrimaryButton type="submit" disabled={busy || inviteCode.length !== 10}>加入班级</PrimaryButton>
                  </form>
                </BaseCard>
                <BaseCard className="classroom-panel"><div className="classroom-heading"><div><h2>已加入的班级</h2><p>老师看到的是最近一次成功同步的记录。</p></div><SecondaryButton disabled={busy} onClick={() => perform(() => onSync?.(), '学习进度已同步。')}>同步学习进度</SecondaryButton></div>
                  {data.classes.length ? <ul className="classroom-memberships">{data.classes.map((item) => <li key={item.id}><div><h3>{item.name}</h3><p>老师：{item.teacherName} · 加入于 {formatClassroomDate(item.joinedAt)}</p></div><SecondaryButton disabled={busy} onClick={() => perform(() => leaveClassroom(item.id), '已退出班级，老师无法再查看你的记录。')}>退出班级</SecondaryButton></li>)}</ul>
                    : <div className="classroom-empty"><img src="/images/ui-assets/category-all-words-blue-v1.png" alt="" /><h3>还没有加入班级</h3><p>向老师获取邀请码，在上方输入即可加入。</p></div>}
                </BaseCard>
              </>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
