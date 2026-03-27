// ========================================
// GAS API 通信
// ========================================

// GASデプロイ後にここにURLを設定
const GAS_URL = import.meta.env.VITE_GAS_URL || '';

// デモモード（GAS未接続時はローカルデータで動作）
const DEMO_MODE = !GAS_URL;

// --- ローカルストレージキー ---
const STORAGE_KEYS = {
  ANSWERS: 'manabi_answers',
  ANALYSIS: 'manabi_analysis',
  SESSIONS: 'manabi_sessions',
};

// --- サンプル問題データ（デモ用） ---
import { getSampleQuestions } from './sampleData';

// --- キャッシュ（1時間有効） ---
const CACHE_TTL = 60 * 60 * 1000;
const CACHE_KEY_QUESTIONS = 'manabi_cache_questions';

function getCachedQuestions(subject) {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY_QUESTIONS) || '{}');
    if (cached[subject] && Date.now() - cached[subject].timestamp < CACHE_TTL) {
      return cached[subject].data;
    }
  } catch {}
  return null;
}

function setCachedQuestions(subject, questions) {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY_QUESTIONS) || '{}');
    cached[subject] = { data: questions, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY_QUESTIONS, JSON.stringify(cached));
  } catch {}
}

// --- API呼び出し ---

export async function fetchQuestions(subject) {
  // まずローカルデータで即表示
  const local = getSampleQuestions().filter(q => q.subject === subject);

  if (DEMO_MODE) {
    return local.sort(() => Math.random() - 0.5).slice(0, 10);
  }

  // キャッシュがあればそこから
  const cached = getCachedQuestions(subject);
  if (cached && cached.length > 0) {
    return cached.sort(() => Math.random() - 0.5).slice(0, 10);
  }

  // GASから取得（バックグラウンドでキャッシュ更新）
  // まずローカルを返しつつ、GASも取りに行く
  try {
    const res = await fetch(`${GAS_URL}?action=getQuestions&subject=${subject}`);
    const data = await res.json();
    if (data.questions && data.questions.length > 0) {
      setCachedQuestions(subject, data.questions);
      return data.questions;
    }
  } catch {}

  // GAS失敗時はローカルデータで
  return local.sort(() => Math.random() - 0.5).slice(0, 10);
}

export async function submitAnswers(answers) {
  // 常にローカルにも保存
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANSWERS) || '[]');
  stored.push(...answers);
  localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(stored));
  updateLocalAnalysis(answers);

  if (DEMO_MODE) {
    return { success: true };
  }

  // GASにもバックグラウンドで送信（GETで送る＝リダイレクト問題回避）
  try {
    const params = new URLSearchParams({
      action: 'saveAnswers',
      data: JSON.stringify(answers),
    });
    fetch(`${GAS_URL}?${params}`);
  } catch {}
  return { success: true };
}

export async function fetchAnalysis() {
  // まずローカルデータで即表示
  const localData = getLocalAnalysis();

  if (DEMO_MODE) {
    return localData;
  }

  // GASからも取得を試みる
  try {
    const res = await fetch(`${GAS_URL}?action=getAnalysis`);
    const data = await res.json();
    if (data.subjectAccuracy && data.subjectAccuracy.length > 0) {
      return data;
    }
  } catch {}

  return localData;
}

// --- ローカル分析（デモ用） ---

function updateLocalAnalysis(answers) {
  const analysis = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYSIS) || '{}');

  answers.forEach(a => {
    const key = `${a.subject}__${a.unit}`;
    if (!analysis[key]) {
      analysis[key] = { subject: a.subject, unit: a.unit, totalCount: 0, correctCount: 0 };
    }
    analysis[key].totalCount += 1;
    if (a.isCorrect) analysis[key].correctCount += 1;
  });

  localStorage.setItem(STORAGE_KEYS.ANALYSIS, JSON.stringify(analysis));
}

function getLocalAnalysis() {
  const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYSIS) || '{}');
  const analysis = Object.values(raw).map(a => ({
    ...a,
    accuracy: a.totalCount > 0 ? Math.round((a.correctCount / a.totalCount) * 100) : 0,
  }));

  const weakPoints = analysis
    .filter(a => a.accuracy < 60 && a.totalCount >= 3)
    .sort((a, b) => a.accuracy - b.accuracy);

  const subjectMap = {};
  analysis.forEach(a => {
    if (!subjectMap[a.subject]) {
      subjectMap[a.subject] = { total: 0, correct: 0 };
    }
    subjectMap[a.subject].total += a.totalCount;
    subjectMap[a.subject].correct += a.correctCount;
  });

  const subjectAccuracy = Object.entries(subjectMap).map(([subject, stats]) => ({
    subject,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    totalCount: stats.total,
  }));

  const subjectNames = {
    kokugo: '国語', sansu: '算数', rika: '理科', shakai: '社会', eigo: '英語'
  };

  const tendencies = [];
  const subjectGroups = {};
  weakPoints.forEach(wp => {
    if (!subjectGroups[wp.subject]) subjectGroups[wp.subject] = [];
    subjectGroups[wp.subject].push(wp);
  });

  Object.entries(subjectGroups).forEach(([subject, units]) => {
    const name = subjectNames[subject] || subject;
    if (units.length >= 2) {
      const unitNames = units.map(u => u.unit).join('、');
      tendencies.push({
        subject,
        message: `${name}の「${unitNames}」で間違いが多い傾向があります。似たタイプの問題が苦手かもしれません。`,
        severity: 'high',
      });
    } else if (units.length === 1) {
      tendencies.push({
        subject,
        message: `${name}の「${units[0].unit}」がちょっと苦手みたいです（正答率${units[0].accuracy}%）。`,
        severity: 'medium',
      });
    }
  });

  return { analysis, weakPoints, subjectAccuracy, tendencies };
}

// --- 学習セッション履歴 ---

export function saveSession(session) {
  const sessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
  sessions.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    subject: session.subject,
    correctCount: session.correctCount,
    totalCount: session.totalCount,
    details: session.details,
  });
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function getSessions() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]');
}

export function getSession(id) {
  const sessions = getSessions();
  return sessions.find(s => s.id === Number(id));
}
