import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, HistoryIcon, DashboardIcon } from './Icons';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { path: '/', Icon: HomeIcon, label: 'ホーム' },
    { path: '/history', Icon: HistoryIcon, label: 'りれき' },
    { path: '/dashboard', Icon: DashboardIcon, label: 'せいせき' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span className="nav-item-icon">
              <item.Icon size={22} color={isActive ? '#ec4899' : '#737373'} />
            </span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
