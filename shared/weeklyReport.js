import { mergeStudyHistory } from './studyHistory.js';

const DAY = 86400000;
const activeDay = day => day.wordsLearned + day.wordsMastered + day.readingsCompleted + day.readingQuestionsAnswered + day.examQuestionsAnswered > 0;
export function weekRange(value = new Date()) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error('周日期无效。');
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
  const start = date.toISOString().slice(0, 10);
  const end = new Date(date.getTime() + 7 * DAY).toISOString().slice(0, 10);
  return { start, end, last: new Date(date.getTime() + 6 * DAY).toISOString().slice(0, 10) };
}

const accuracy = (correct, answered) => answered ? Math.round(correct / answered * 100) : null;
const inWeek = (date, range) => date >= range.start && date < range.end;
const read = (text, fallback = []) => { try { return JSON.parse(text) || fallback; } catch { return fallback; } };

// Only pass the current roster and records selected through its membership relation.
export function buildWeeklyReport({ students, exams, readings, assignments, submissions, range, catalog, articles, now = new Date() }) {
  const members = new Set(students.map(student => String(student.id)));
  const wordLookup = new Map(catalog.map(word => [String(word.id), word]));
  const articleLookup = new Map(articles.map(article => [String(article.id), article]));
  const mistakes = new Map(), readingLatest = new Map();
  const examList = exams.filter(row => members.has(String(row.user_id))).map(row => ({ userId: String(row.user_id), ...read(row.attempt_json, {}) }));
  const readingList = readings.filter(row => members.has(String(row.user_id))).map(row => ({ userId: String(row.user_id), ...read(row.attempt_json, {}) }));
  const tasks = new Map(assignments.map(task => [`${task.type}:${task.id}`, task]));
  const currentSubmissions = submissions.filter(row => members.has(String(row.student_id)));
  const addWord = (wordId, userId) => {
    const word = wordLookup.get(String(wordId));
    if (!word) return; // Unshared custom words are never included in class recommendations.
    const current = mistakes.get(String(wordId)) || { wordId: String(wordId), word: word.word, meaning: word.meaning, errors: 0, students: new Set() };
    current.errors += 1; current.students.add(userId); mistakes.set(String(wordId), current);
  };
  const addReading = (userId, article, answers, completedAt) => {
    for (const question of article?.questions || []) {
      const key = `${userId}:${article.id}:${question.id}:${question.prompt}:${question.answer}`;
      const previous = readingLatest.get(key);
      if (!previous || completedAt > previous.completedAt) readingLatest.set(key, { userId, article, question, completedAt,
        correct: String(answers?.[question.id] || '').toLowerCase() === String(question.answer).toLowerCase() });
    }
  };
  for (const exam of examList) for (const answer of exam.answers || []) if (!answer.correct) addWord(answer.wordId, exam.userId);
  for (const attempt of readingList) addReading(attempt.userId, attempt.article, attempt.answers, attempt.completedAt);
  for (const submission of currentSubmissions) {
    if (!inWeek(submission.submitted_at, range)) continue;
    const task = tasks.get(`${submission.type}:${submission.assignment_id}`);
    if (!task) continue;
    const answers = read(submission.answers_json, {});
    if (submission.type === 'words') {
      for (const word of read(task.words_json)) if (answers[word.id] !== word.answer) addWord(word.id, String(submission.student_id));
    } else if (!readingList.some(attempt => attempt.userId === String(submission.student_id) && attempt.assignmentId === task.id)) {
      addReading(String(submission.student_id), read(task.article_json, {}), answers, submission.submitted_at);
    }
  }
  const dueTasks = assignments.filter(task => inWeek(task.due_at, range));
  const dueKeys = new Set(dueTasks.map(task => `${task.type}:${task.id}`));
  const dueSubmissions = currentSubmissions.filter(row => dueKeys.has(`${row.type}:${row.assignment_id}`));
  const rows = students.map(student => {
    const id = String(student.id);
    const days = mergeStudyHistory([], read(student.study_history)).filter(day => inWeek(day.date, range));
    const dates = new Set(days.filter(activeDay).map(day => day.date));
    const tests = examList.filter(attempt => attempt.userId === id);
    tests.forEach(attempt => dates.add(attempt.completedAt.slice(0, 10)));
    currentSubmissions.filter(row => String(row.student_id) === id && inWeek(row.submitted_at, range)).forEach(row => dates.add(row.submitted_at.slice(0, 10)));
    readingList.filter(attempt => attempt.userId === id).forEach(attempt => dates.add(attempt.completedAt.slice(0, 10)));
    const sum = key => days.reduce((total, day) => total + day[key], 0);
    const answered = sum('examQuestionsAnswered'), correct = sum('examQuestionsCorrect');
    return { id, displayName: student.display_name || '学生', email: student.email, activeDays: dates.size,
      wordsStudied: sum('wordsLearned') + sum('wordsMastered'), readingsCompleted: sum('readingsCompleted'),
      readingAnswered: sum('readingQuestionsAnswered'), readingCorrect: sum('readingQuestionsCorrect'),
      examAnswered: answered, examCorrect: correct, examAccuracy: accuracy(correct, answered), savedTests: tests.length,
      assignmentsSubmitted: dueSubmissions.filter(row => String(row.student_id) === id).length,
      assignmentsExpected: dueTasks.length, lastSyncedAt: student.updated_at || '' };
  });
  const readingGroups = new Map();
  for (const item of readingLatest.values()) {
    const article = articleLookup.get(String(item.article.id));
    const key = `${item.article.id}:${item.question.id}:${item.question.prompt}:${item.question.answer}`;
    const group = readingGroups.get(key) || { key, articleId: String(item.article.id), title: item.article.title,
      level: item.article.level, question: item.question.prompt, answered: 0, correct: 0, assignable: Boolean(article?.questions?.length) };
    group.answered += 1; group.correct += Number(item.correct); readingGroups.set(key, group);
  }
  const weakReadings = [...readingGroups.values()].filter(item => item.correct < item.answered)
    .map(item => ({ ...item, accuracy: accuracy(item.correct, item.answered) }))
    .sort((a, b) => a.accuracy - b.accuracy || b.answered - a.answered).slice(0, 8);
  const commonWords = [...mistakes.values()].map(item => ({ ...item, students: item.students.size }))
    .sort((a, b) => b.students - a.students || b.errors - a.errors || a.word.localeCompare(b.word)).slice(0, 15);
  const recommended = commonWords.map(item => wordLookup.get(item.wordId));
  if (recommended.length && (recommended.length < 5 || new Set(recommended.map(word => word.meaning)).size < 4)) {
    for (const word of catalog) {
      if (!recommended.some(item => String(item.id) === String(word.id)) && !recommended.some(item => item.meaning === word.meaning)) recommended.push(word);
      if (recommended.length >= 5 && new Set(recommended.map(word => word.meaning)).size >= 4) break;
    }
  }
  const sum = key => rows.reduce((total, row) => total + row[key], 0);
  return { range, generatedAt: now.toISOString(), students: rows,
    totals: { studentCount: rows.length, activeStudents: rows.filter(row => row.activeDays > 0).length,
      wordsStudied: sum('wordsStudied'), readingsCompleted: sum('readingsCompleted'), savedTests: examList.length,
      examAnswered: sum('examAnswered'), examAccuracy: accuracy(sum('examCorrect'), sum('examAnswered')),
      readingAccuracy: accuracy(sum('readingCorrect'), sum('readingAnswered')) },
    assignments: { total: dueTasks.length, expected: dueTasks.length * members.size, submitted: dueSubmissions.length,
      late: dueSubmissions.filter(row => row.submitted_at > tasks.get(`${row.type}:${row.assignment_id}`).due_at).length,
      overdue: dueTasks.reduce((total, task) => total + (task.due_at < now.toISOString() ? members.size - dueSubmissions.filter(row => row.type === task.type && row.assignment_id === task.id).length : 0), 0) },
    commonWords, weakReadings, suggestedWords: recommended.slice(0, 15).map(word => ({ id: String(word.id), word: word.word, meaning: word.meaning })) };
}
