import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { subjectIcons } from '../components/Icons';

const subjects = [
  { id: 'kokugo', name: 'こくご' },
  { id: 'sansu', name: 'さんすう' },
  { id: 'rika', name: 'りか' },
  { id: 'shakai', name: 'しゃかい' },
  { id: 'eigo', name: 'えいご' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <Header title="まなびクエスト" subtitle="きょうも がんばろう！" />
      <div className="page-content">
        <div className="subject-grid">
          {subjects.map(s => {
            const Icon = subjectIcons[s.id];
            return (
              <button
                key={s.id}
                className="subject-card"
                onClick={() => navigate(`/quiz/${s.id}`)}
              >
                <div className="subject-icon"><Icon size={48} /></div>
                <div className="subject-name">{s.name}</div>
              </button>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
