PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  last_login_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS login_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  mode TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  consumed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_login_codes_email_mode_created
  ON login_codes(email, mode, created_at DESC);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id INTEGER PRIMARY KEY,
  learned_words TEXT NOT NULL,
  mastered_words TEXT NOT NULL,
  custom_words TEXT NOT NULL,
  word_progress TEXT NOT NULL DEFAULT '{}',
  wrong_words TEXT NOT NULL DEFAULT '[]',
  study_history TEXT NOT NULL DEFAULT '[]',
  preferences TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS account_profiles (
  user_id INTEGER PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
  display_name TEXT NOT NULL CHECK (length(display_name) BETWEEN 1 AND 40),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  teacher_id INTEGER NOT NULL,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 60),
  invite_code TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);

CREATE TABLE IF NOT EXISTS class_memberships (
  class_id TEXT NOT NULL,
  student_id INTEGER NOT NULL,
  joined_at TEXT NOT NULL,
  PRIMARY KEY (class_id, student_id),
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_class_memberships_student ON class_memberships(student_id);

CREATE TABLE IF NOT EXISTS reading_sessions (
  user_id INTEGER NOT NULL,
  session_key TEXT NOT NULL,
  answers_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, session_key),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reading_assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  article_json TEXT NOT NULL,
  due_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_reading_assignments_class ON reading_assignments(class_id, created_at);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  assignment_id TEXT NOT NULL,
  student_id INTEGER NOT NULL,
  answers_json TEXT NOT NULL,
  questions_answered INTEGER NOT NULL,
  questions_correct INTEGER NOT NULL,
  submitted_at TEXT NOT NULL,
  PRIMARY KEY (assignment_id, student_id),
  FOREIGN KEY (assignment_id) REFERENCES reading_assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Additive P1 tables; existing reading assignments and learning progress are retained.
CREATE TABLE IF NOT EXISTS word_assignments (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  scope_json TEXT NOT NULL,
  words_json TEXT NOT NULL,
  due_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_word_assignments_class ON word_assignments(class_id, created_at);
CREATE TABLE IF NOT EXISTS word_assignment_submissions (
  assignment_id TEXT NOT NULL REFERENCES word_assignments(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  answers_json TEXT NOT NULL,
  questions_answered INTEGER NOT NULL,
  questions_correct INTEGER NOT NULL,
  submitted_at TEXT NOT NULL,
  PRIMARY KEY (assignment_id, student_id)
);
CREATE TABLE IF NOT EXISTS word_assignment_sessions (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id TEXT NOT NULL REFERENCES word_assignments(id) ON DELETE CASCADE,
  answers_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, assignment_id)
);
CREATE TABLE IF NOT EXISTS reading_attempts (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  attempt_json TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  PRIMARY KEY (user_id, id)
);
CREATE INDEX IF NOT EXISTS idx_reading_attempts_user_date ON reading_attempts(user_id, completed_at DESC);

-- Additive P2 personal test history, independent of assignment grades and daily totals.
CREATE TABLE IF NOT EXISTS exam_attempts (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  id TEXT NOT NULL,
  attempt_json TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  PRIMARY KEY (user_id, id)
);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_date ON exam_attempts(user_id, completed_at DESC);
