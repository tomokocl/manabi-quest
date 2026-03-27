import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import HistoryDetail from './pages/HistoryDetail';
import './styles/theme.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:subject" element={<Quiz />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<HistoryDetail />} />
      </Routes>
    </HashRouter>
  );
}
