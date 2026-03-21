import { useState, useEffect } from 'react';
import { speak } from '../utils/speech';

function FillBlank({ vocabulary }) {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sentence, setSentence] = useState('');
  const [hiddenWord, setHiddenWord] = useState('');

  const generateQuestion = () => {
    const randomIndex = Math.floor(Math.random() * vocabulary.length);
    const word = vocabulary[randomIndex];

    const sentence = word.example;
    const wordInSentence = word.word;
    
    const regex = new RegExp(`\\b${wordInSentence}\\b`, 'i');
    const hiddenSentence = sentence.replace(regex, '______');

    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      const randomIndex = Math.floor(Math.random() * vocabulary.length);
      const wrongWord = vocabulary[randomIndex];
      if (
        wrongWord.id !== word.id &&
        !wrongOptions.find((w) => w.id === wrongWord.id)
      ) {
        wrongOptions.push(wrongWord);
      }
    }

    const allOptions = [word, ...wrongOptions].sort(() => Math.random() - 0.5);

    setCurrentQuestion(word);
    setOptions(allOptions);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setSentence(hiddenSentence);
    setHiddenWord(wordInSentence);
  };

  useEffect(() => {
    if (vocabulary.length > 0) {
      generateQuestion();
    }
  }, []);

  const handleAnswer = (word) => {
    if (selectedAnswer) return;

    setSelectedAnswer(word);
    const correct = word.id === currentQuestion.id;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    setQuestionCount(questionCount + 1);

    setTimeout(() => {
      generateQuestion();
    }, 2000);
  };

  const handleSpeakSentence = () => {
    if (currentQuestion) {
      speak(currentQuestion.example, { rate: 0.9 });
    }
  };

  if (!currentQuestion || !sentence) {
    return (
      <div className="text-gray-500 text-center py-12">
        <p className="text-xl">加载中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-300 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📊</span>
            <span className="text-gray-700 font-bold text-lg">得分</span>
          </div>
          <p className="text-4xl font-black text-blue-600">{score}</p>
          <p className="text-gray-600 font-bold text-xs mt-1">/ {questionCount} 题</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border-2 border-orange-300 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔥</span>
            <span className="text-gray-700 font-bold text-lg">连击</span>
          </div>
          <p className={`text-4xl font-black ${streak >= 5 ? 'text-yellow-600' : 'text-orange-600'}`}>
            {streak} 连对
          </p>
          <p className="text-gray-600 font-bold text-xs mt-1">
            {streak >= 10 ? '🔥🔥🔥 太厉害了！' : streak >= 5 ? '🔥 继续加油！' : '再接再厉！'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-300 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎯</span>
            <span className="text-gray-700 font-bold text-lg">正确率</span>
          </div>
          <p className="text-4xl font-black text-green-600">
            {questionCount > 0 ? Math.round((score / questionCount) * 100) : 0}%
          </p>
          <p className="text-gray-600 font-bold text-xs mt-1">
            {questionCount > 0 ? (score / questionCount >= 0.8 ? '太棒了！' : '继续练习！') : '开始答题吧！'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
        <p className="text-gray-500 text-center mb-6 text-3xl font-bold">
          用正确的单词填空
        </p>
        
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-10 border-2 border-purple-200 mb-8">
          <p className="text-4xl md:text-5xl font-bold text-gray-800 leading-relaxed text-center">
            "{sentence}"
          </p>
          <p className="text-gray-500 text-center mt-4 text-2xl">
            {currentQuestion.meaning}
          </p>
        </div>

        <button
          onClick={handleSpeakSentence}
          className="mx-auto block px-12 py-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all shadow-xl hover:shadow-2xl font-bold text-2xl flex items-center gap-3"
        >
          <span className="text-3xl">🔊</span>
          <span>听例句</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {options.map((option, index) => {
          let buttonClass = 'bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-purple-300';

          if (selectedAnswer) {
            if (option.id === currentQuestion.id) {
              buttonClass = 'bg-green-500 text-white border-green-400 shadow-xl';
            } else if (option.id === selectedAnswer.id) {
              buttonClass = 'bg-red-500 text-white border-red-400 shadow-xl';
            } else {
              buttonClass = 'bg-gray-100 text-gray-400';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`px-8 py-12 rounded-2xl font-bold text-2xl transition-colors duration-200 text-center shadow-xl ${buttonClass} ${
                !selectedAnswer ? 'hover:-translate-y-1 active:translate-y-0' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <span className={`inline-flex w-20 h-20 rounded-full font-black text-4xl items-center justify-center ${
                  selectedAnswer ? 'bg-white/20' : 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <div>
                  <p className="text-5xl font-bold">{option.word}</p>
                  <p className="text-gray-500 text-2xl mt-2">{option.phonetic}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedAnswer && (
        <div className={`text-center p-6 rounded-2xl border ${
          isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'
        }`}>
          <p className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '🎉 回答正确！' : '❌ 回答错误'}
          </p>
          {!isCorrect && (
            <p className="text-gray-600 text-lg">
              <span className="opacity-70">正确答案：</span>{' '}
              <span className="font-bold">{currentQuestion.word}</span>
            </p>
          )}
          <p className="text-gray-500 text-sm mt-2">{currentQuestion.example}</p>
        </div>
      )}
    </div>
  );
}

export default FillBlank;