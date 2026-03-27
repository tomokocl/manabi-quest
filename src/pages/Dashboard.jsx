import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { fetchAnalysis } from '../utils/api';

const subjectNames = {
  kokugo: '国語', sansu: '算数', rika: '理科', shakai: '社会', eigo: '英語'
};

const subjectOrder = ['kokugo', 'sansu', 'rika', 'shakai', 'eigo'];

function getBarColor(accuracy) {
  if (accuracy >= 80) return '#4ade80';
  if (accuracy >= 60) return '#facc15';
  return '#f87171';
}

function getAccuracyClass(accuracy) {
  if (accuracy >= 80) return 'high';
  if (accuracy >= 60) return 'medium';
  return 'low';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const result = await fetchAnalysis();
    setData(result);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="app">
        <Header title="せいせき" subtitle="保護者ダッシュボード" />
        <div className="loading">
          <div className="loading-spinner" />
        </div>
        <BottomNav />
      </div>
    );
  }

  const hasData = data && data.subjectAccuracy && data.subjectAccuracy.length > 0;

  if (!hasData) {
    return (
      <div className="app">
        <Header title="せいせき" subtitle="保護者ダッシュボード" />
        <div className="page-content">
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div className="empty-state-text">
              まだ データが ないよ<br />
              もんだいを といてみよう！
            </div>
            <button className="btn-primary" onClick={() => navigate('/')}>
              もんだいを とく
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // チャート用データ整形
  const chartData = subjectOrder
    .map(id => {
      const found = data.subjectAccuracy.find(s => s.subject === id);
      return found ? {
        name: subjectNames[id],
        accuracy: found.accuracy,
        totalCount: found.totalCount,
      } : null;
    })
    .filter(Boolean);

  return (
    <div className="app">
      <Header title="せいせき" subtitle="保護者ダッシュボード" />
      <div className="page-content">
        <div className="dashboard">

          {/* 科目別正答率チャート */}
          <div className="stat-card">
            <div className="dashboard-title">科目べつ せいとう率</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value, name) => [`${value}%`, '正答率']}
                    contentStyle={{ borderRadius: 10, border: '1px solid #fbcfe8' }}
                  />
                  <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={getBarColor(entry.accuracy)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 科目別詳細 */}
          <div className="dashboard-title">科目べつ くわしく</div>
          {data.subjectAccuracy
            .sort((a, b) => subjectOrder.indexOf(a.subject) - subjectOrder.indexOf(b.subject))
            .map(s => (
              <div key={s.subject} className="stat-card">
                <div className="stat-header">
                  <span className="stat-label">{subjectNames[s.subject]}</span>
                  <span className="stat-value">{s.accuracy}%</span>
                </div>
                <div className="accuracy-bar">
                  <div
                    className={`accuracy-fill ${getAccuracyClass(s.accuracy)}`}
                    style={{ width: `${s.accuracy}%` }}
                  />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#737373', marginTop: 6 }}>
                  {s.totalCount}もん チャレンジ
                </div>
              </div>
            ))}

          {/* 苦手傾向 */}
          {data.tendencies && data.tendencies.length > 0 && (
            <>
              <div className="dashboard-title" style={{ marginTop: 8 }}>
                にがて ポイント
              </div>
              {data.tendencies.map((t, i) => (
                <div key={i} className={`weak-point ${t.severity}`}>
                  <div className="weak-point-text">{t.message}</div>
                </div>
              ))}
            </>
          )}

          {/* 単元別詳細 */}
          {data.weakPoints && data.weakPoints.length > 0 && (
            <>
              <div className="dashboard-title" style={{ marginTop: 8 }}>
                にがて たんげん（せいとう率60%いか）
              </div>
              {data.weakPoints.map((wp, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-header">
                    <span className="stat-label">
                      {subjectNames[wp.subject]} - {wp.unit}
                    </span>
                    <span className="stat-value" style={{ color: '#ef4444' }}>
                      {wp.accuracy}%
                    </span>
                  </div>
                  <div className="accuracy-bar">
                    <div
                      className="accuracy-fill low"
                      style={{ width: `${wp.accuracy}%` }}
                    />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#737373', marginTop: 6 }}>
                    {wp.correctCount}/{wp.totalCount} せいかい
                  </div>
                </div>
              ))}
            </>
          )}

        </div>
      </div>
      <BottomNav />
    </div>
  );
}
