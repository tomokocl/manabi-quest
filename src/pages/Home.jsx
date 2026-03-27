import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const subjects = [
  { id: 'kokugo', name: 'こくご', icon: '📖' },
  { id: 'sansu', name: 'さんすう', icon: '🔢' },
  { id: 'rika', name: 'りか', icon: '🔬' },
  { id: 'shakai', name: 'しゃかい', icon: '🌍' },
  { id: 'eigo', name: 'えいご', icon: '🔤' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <Header title="まなびクエスト" subtitle="きょうも がんばろう！" />
      <div className="page-content">
        <div className="subject-grid">
          {subjects.map(s => (
            <button
              key={s.id}
              className="subject-card"
              onClick={() => navigate(`/quiz/${s.id}`)}
            >
              <div className="subject-icon">{s.icon}</div>
              <div className="subject-name">{s.name}</div>
            </button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
