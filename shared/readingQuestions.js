export const normalizeReadingQuestions = (questions) => (Array.isArray(questions) ? questions : [])
  .map((question, index) => ({
    id: String(question?.id || `q-${index + 1}`),
    prompt: String(question?.prompt || question?.question || '').trim(),
    options: (Array.isArray(question?.options) ? question.options : []).map((option, position) => ({
      id: String(option?.id || option?.key || option?.value || String.fromCharCode(65 + position)),
      label: String(typeof option === 'string' ? option : option?.label || option?.text || option?.value || '').trim(),
    })).filter((option) => option.label),
    answer: String(question?.answer || question?.correctAnswer || '').trim(),
    explanation: String(question?.explanation || '').trim(),
  })).filter((question) => question.prompt && question.options.length);

export const validateReadingAnswers = (article, value) => {
  const answers = {};
  const questions = normalizeReadingQuestions(article?.questions);
  questions.forEach((question) => {
    const selected = value?.[question.id];
    if (question.options.some((option) => option.id === selected)) answers[question.id] = selected;
  });
  return answers;
};

export const gradeReadingAnswers = (article, value) => {
  const questions = normalizeReadingQuestions(article?.questions);
  const answers = validateReadingAnswers(article, value);
  return { answers, questionsAnswered: Object.keys(answers).length, questionsTotal: questions.length,
    questionsCorrect: questions.filter((question) => answers[question.id]?.toLowerCase() === question.answer.toLowerCase()).length };
};
