import { BaseCard } from '../ui/Cards';
import { PrimaryButton, SecondaryButton } from '../ui/Buttons';
import '../../styles/account-progress-summary.css';

export default function AccountProgressSummary({
  authUser,
  onAuthOpen,
  syncStatusText,
  accountNotice,
  todayWordsMastered,
  todayReadingsCompleted,
  readingCount,
  todayExamQuestionsAnswered,
  wrongCount,
}) {
  const signedIn = Boolean(authUser?.email);
  const ActionButton = signedIn ? SecondaryButton : PrimaryButton;
  const metrics = [
    { label: '今日标记认识', value: todayWordsMastered, unit: '词' },
    { label: '今日阅读', value: todayReadingsCompleted, unit: `/ ${readingCount} 篇` },
    { label: '今日巩固', value: todayExamQuestionsAnswered, unit: '题' },
    { label: '错词', value: wrongCount, unit: '个' },
  ];

  return <BaseCard className="study-hub-account-summary" aria-label="账号与学习记录">
    <div className="study-account-identity">
      <span className="study-account-mark" aria-hidden="true">Aa</span>
      <div className="study-account-copy">
        <div className="study-account-heading">
          <h2>学习记录</h2>
          <span className="study-account-status" role="status">{syncStatusText || (signedIn ? '已登录' : '未登录')}</span>
        </div>
        <p className="study-account-detail">{signedIn ? authUser.email : '进度保存在当前设备'}</p>
      </div>
    </div>
    <dl className="study-account-metrics">
      {metrics.map(metric => <div key={metric.label}>
        <dt>{metric.label}</dt>
        <dd><strong>{metric.value}</strong><span>{metric.unit}</span></dd>
      </div>)}
    </dl>
    <ActionButton className="study-account-action" onClick={onAuthOpen}>
      {signedIn ? '查看账号' : '登录 / 注册'}
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
    </ActionButton>
    {accountNotice && <p className={`study-account-notice is-${accountNotice.type || 'info'}`}
      role={accountNotice.type === 'error' ? 'alert' : 'status'}>{accountNotice.message}</p>}
  </BaseCard>;
}
