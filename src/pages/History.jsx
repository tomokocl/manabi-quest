import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { getSessions } from '../utils/api';

const subjectNames = {
  kokugo: '国語', sansu: '算数', rika: '理科', shakai: '社会', eigo: '英語'
};
const subjectIcons = {
  kokugo: '📖', sansu: '🔢', rika: '🔬', shakai: '🌍', eigo: '🔤'
};

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatTime(iso) {
  const d = new Date(iso);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function History() {
  const navigate = useNavigate();
  const sessions = getSessions();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? sessions
    : sessions.filter(s => s.subject === filter);

  return (
    <div className="app">
      <Header title="がくしゅう りれき" subtitle="これまでの チャレンジ" />
      <div className="page-content">

        {/* フィルター */}
        <div style={{ display: 'flex', gap: 6, padding: '12px 16px', flexWrap: 'wrap' }}>
          <button
            className={`choice-btn ${filter === 'all' ? 'selected' : ''}`}
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            onClick={() => setFilter('all')}
          >
            ぜんぶ
          </button>
          {Object.entries(subjectNames).map(([id, name]) => (
            <button
              key={id}
              className={`choice-btn ${filter === id ? 'selected' : ''}`}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              onClick={() => setFilter(id)}
            >
              {subjectIcons[id]} {name}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-text">
              まだ りれきが ないよ<br />
              もんだいを といてみよう！
            </div>
            <button className="btn-primary" onClick={() => navigate('/')}>
              もんだいを とく
            </button>
          </div>
        ) : (
          <div style={{ padding: '0 16px' }}>
            {filtered.map(session => {
              const pct = Math.round((session.correctCount / session.totalCount) * 100);
              return (
                <button
                  key={session.id}
                  className="stat-card"
                  style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', border: '2px solid var(--pink-100)' }}
                  onClick={() => navigate(`/history/${session.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {formatDate(session.date)} {formatTime(session.date)}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: 2 }}>
                        {subjectIcons[session.subject]} {subjectNames[session.subject]}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        color: pct >= 80 ? 'var(--green-500)' : pct >= 60 ? '#eab308' : 'var(--red-500)'
                      }}>
                        {session.correctCount}/{session.totalCount}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        せいとう率 {pct}%
                      </div>
                    </div>
                  </div>
                  <div className="accuracy-bar" style={{ marginTop: 8 }}>
                    <div
                      className={`accuracy-fill ${pct >= 80 ? 'high' : pct >= 60 ? 'medium' : 'low'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  );
}
