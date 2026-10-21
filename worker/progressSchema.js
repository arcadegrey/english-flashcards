export const progressColumnMigrations = [
  { name: 'word_progress', sql: "ALTER TABLE user_progress ADD COLUMN word_progress TEXT NOT NULL DEFAULT '{}';" },
  { name: 'wrong_words', sql: "ALTER TABLE user_progress ADD COLUMN wrong_words TEXT NOT NULL DEFAULT '[]';" },
  { name: 'study_history', sql: "ALTER TABLE user_progress ADD COLUMN study_history TEXT NOT NULL DEFAULT '[]';" },
  { name: 'preferences', sql: "ALTER TABLE user_progress ADD COLUMN preferences TEXT NOT NULL DEFAULT '{}';" },
];
