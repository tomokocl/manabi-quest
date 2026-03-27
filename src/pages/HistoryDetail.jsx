import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getSession } from '../utils/api';
import { CorrectIcon, WrongIcon } from '../components/Icons';

const subjectNames = {
  kokugo: '国語', sansu: '算数', rika: '理科', shakai: '社会', eigo: '英語'
};

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession(id);

  if (!session) {
    return (
      <div className="app">
        <Header title="りれき" onBack={() => navigate('/history')} />
        <div className="empty-state">
          <div className="empty-state-icon">❓</div>
          <div className="empty-state-text">データが みつかりません</div>
        </div>
      </div>
    );
  }

  const pct = Math.round((session.correctCount / session.totalCount) * 100);

  let message = '';
  if (pct === 100) message = 'パーフェクト！すごい！🎉';
  else if (pct >= 80) message = 'とっても よくできたね！✨';
  else if (pct >= 60) message = 'がんばったね！💪';
  else message = 'つぎは もっと できるよ！🌸';

  return (
    <div className="app">
      <Header
        title={`${subjectNames[session.subject]} りれき`}
        subtitle={formatDate(session.date)}
        onBack={() => navigate('/history')}
      />
      <div className="page-content">
        <div className="result-score">
          <div className="result-number">{session.correctCount}/{session.totalCount}</div>
          <div className="result-label">せいとう率 {pct}%</div>
        </div>
        <div className="result-message">{message}</div>

        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 12 }}>こたえ あわせ</div>
          <div className="result-details">
            {session.details.map((r, i) => (
              <div key={i} className="result-item">
                <span className="result-item-icon">
                  {r.isCorrect ? <CorrectIcon size={22} /> : <WrongIcon size={22} />}
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

        <button className="btn-primary" onClick={() => navigate('/history')}>
          りれきに もどる
        </button>
      </div>
    </div>
  );
}
