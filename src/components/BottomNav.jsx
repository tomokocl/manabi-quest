import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { path: '/', icon: '🏠', label: 'ホーム' },
    { path: '/history', icon: '📚', label: 'りれき' },
    { path: '/dashboard', icon: '📊', label: 'せいせき' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <button
          key={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="nav-item-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
