import '../styles/classroom.css';

export default function AccountRoleChoice({ value, onChange, disabled = false, locked = false }) {
  return (
    <fieldset className="classroom-role-field">
      <legend>账号身份</legend>
      <div className="classroom-role-options">
        {[{ value: 'student', label: '学生', helper: '加入班级，记录学习' }, { value: 'teacher', label: '老师', helper: '创建班级，查看进度' }].map((option) => (
          <button key={option.value} type="button" aria-pressed={value === option.value}
            className={value === option.value ? 'is-active' : ''}
            disabled={disabled || (locked && value !== option.value)} onClick={() => onChange(option.value)}>
            <strong>{option.label}</strong><span>{option.helper}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
