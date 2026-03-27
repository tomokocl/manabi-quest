import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { fetchQuestions, submitAnswers, saveSession } from '../utils/api';

const subjectNames = {
  kokugo: 'こくご', sansu: 'さんすう', rika: 'りか', shakai: 'しゃかい', eigo: 'えいご'
};

export default function Quiz() {
  const { subject } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [results, setResults] = useState([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [subject]);

  async function loadQuestions() {
    setLoading(true);
    const qs = await fetchQuestions(subject);
    setQuestions(qs);
    setLoading(false);
  }

  const current = questions[currentIndex];
  const isCorrect = selected === current?.answer;

  function handleSelect(choice) {
    if (showFeedback) return;
    setSelected(choice);
    setShowFeedback(true);

    const correct = choice === current.answer;
    setResults(prev => [...prev, {
      questionId: current.id,
      subject: current.subject,
      unit: current.unit,
      question: current.question,
      userAnswer: choice,
      correctAnswer: current.answer,
      isCorrect: correct,
      explanation: current.explanation,
    }]);
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      const allResults = results.concat({
        questionId: current.id,
        subject: current.subject,
        unit: current.unit,
        question: current.question,
        userAnswer: selected,
        correctAnswer: current.answer,
        isCorrect,
        explanation: current.explanation,
      }).slice(-questions.length);

      setFinished(true);
      submitAnswers(allResults);

      // セッション履歴を保存
      const correctCount = allResults.filter(r => r.isCorrect).length;
      saveSession({
        subject,
        correctCount,
        totalCount: allResults.length,
        details: allResults,
      });
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setSelected(null);
    setShowFeedback(false);
  }

  if (loading) {
    return (
      <div className="app">
        <Header title={subjectNames[subject]} onBack={() => navigate('/')} />
        <div className="loading">
          <div className="loading-spinner" />
          <p style={{ marginTop: 12 }}>もんだいを よみこみちゅう...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="app">
        <Header title={subjectNames[subject]} onBack={() => navigate('/')} />
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <div className="empty-state-text">もんだいが まだ ないよ</div>
        </div>
      </div>
    );
  }

  if (finished) {
    const correctCount = results.filter(r => r.isCorrect).length;
    const total = results.length;
    const percentage = Math.round((correctCount / total) * 100);

    let message = '';
    if (percentage === 100) message = 'パーフェクト！すごい！🎉';
    else if (percentage >= 80) message = 'とっても よくできたね！✨';
    else if (percentage >= 60) message = 'がんばったね！💪';
    else message = 'つぎは もっと できるよ！🌸';

    return (
      <div className="app">
        <Header title="けっか" onBack={() => navigate('/')} />
        <div className="page-content">
          <div className="result-score">
            <div className="result-number">{correctCount}/{total}</div>
            <div className="result-label">せいかい</div>
          </div>
          <div className="result-message">{message}</div>

          <div className="card">
            <div style={{ fontWeight: 700, marginBottom: 12 }}>こたえ あわせ</div>
            <div className="result-details">
              {results.map((r, i) => (
                <div key={i} className="result-item">
                  <span className="result-item-icon">
                    {r.isCorrect ? '⭕' : '❌'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{r.question}</div>
                    {!r.isCorrect && (
                      <div style={{ fontSize: '0.85rem', color: '#ef4444' }}>
                        きみの こたえ: {r.userAnswer} → せいかい: {r.correctAnswer}
                      </div>
                    )}
                    <div style={{ fontSize: '0.8rem', color: '#737373', marginTop: 2 }}>
                      {r.explanation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={() => navigate('/')}>
            ホームに もどる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        title={subjectNames[subject]}
        subtitle={`${currentIndex + 1} / ${questions.length} もん`}
        onBack={() => navigate('/')}
      />
      <div className="page-content">
        {/* Progress dots */}
        <div className="quiz-progress">
          {questions.map((_, i) => {
            let cls = 'quiz-dot';
            if (i === currentIndex) cls += ' active';
            else if (i < results.length) {
              cls += results[i]?.isCorrect ? ' correct' : ' wrong';
            }
            return <div key={i} className={cls} />;
          })}
        </div>

        {/* Question */}
        <div className="card">
          <div className="question-text">{current.question}</div>
        </div>

        {/* Choices */}
        <div className="choices">
          {current.choices.map((choice, i) => {
            let cls = 'choice-btn';
            if (showFeedback) {
              if (choice === current.answer) cls += ' correct';
              else if (choice === selected) cls += ' wrong';
            } else if (choice === selected) {
              cls += ' selected';
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleSelect(choice)}
                disabled={showFeedback}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`feedback ${isCorrect ? 'correct' : 'wrong'}`}>
            <div className="feedback-title">
              {isCorrect ? '⭕ せいかい！' : '❌ ざんねん…'}
            </div>
            <div className="feedback-text">{current.explanation}</div>
          </div>
        )}

        {showFeedback && (
          <button className="btn-primary" onClick={handleNext}>
            {currentIndex + 1 >= questions.length ? 'けっかを みる' : 'つぎの もんだい →'}
          </button>
        )}
      </div>
    </div>
  );
}
