export default function ReadingQuestions({ questions, questionAnswers, disabled, onSelectOption }) {
  return (
    <section className="reading-question-section" aria-label="阅读题">
      <div className="reading-question-head">
        <h2 className="reading-question-title">阅读题</h2>
        <p className="reading-question-sub">根据文章选择最合适的答案。</p>
      </div>

      <div className="reading-question-list">
        {questions.map((question, questionIndex) => {
          const answerState = questionAnswers[question.id];

          return (
            <article key={question.id} className="reading-question-card">
              <p className="reading-question-prompt">
                {questionIndex + 1}. {question.prompt}
              </p>
              <div className="reading-question-options">
                {question.options.map((option) => {
                  const isSelected = answerState?.selected === option.id;
                  const isCorrectAnswer =
                    Boolean(question.answer) &&
                    option.id.toLowerCase() === question.answer.toLowerCase();

                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={isSelected}
                      disabled={disabled}
                      className={[
                        'reading-question-option',
                        isSelected ? 'is-selected' : '',
                        isSelected && answerState?.isCorrect === true ? 'is-correct' : '',
                        isSelected && answerState?.isCorrect === false ? 'is-wrong' : '',
                        answerState && isCorrectAnswer ? 'is-answer' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() =>
                        onSelectOption(question.id, option.id)
                      }
                    >
                      <span className="reading-question-option-key">{option.id}</span>
                      <span className="reading-question-option-label">{option.label}</span>
                      <span className="reading-question-option-mark" aria-hidden="true">
                        {isSelected && <svg viewBox="0 0 20 20"><path d={answerState?.isCorrect === false ? 'm6 6 8 8M14 6l-8 8' : 'm5 10 3 3 7-7'} /></svg>}
                      </span>
                    </button>
                  );
                })}
              </div>
              {answerState && question.answer && (
                <p className="reading-question-feedback">
                  {answerState.isCorrect ? '回答正确' : `正确答案：${question.answer}`}
                  {question.explanation ? `。${question.explanation}` : ''}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
