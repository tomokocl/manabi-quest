// ========================================
// まなびクエスト - GAS バックエンド
// ========================================

const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

// --- Web API ---

function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case 'getQuestions':
        result = getQuestions(e.parameter.subject);
        break;
      case 'getAnalysis':
        result = getAnalysis();
        break;
      case 'getSubjects':
        result = getSubjects();
        break;
      case 'saveAnswers':
        var answers = JSON.parse(e.parameter.data);
        result = saveAnswers(answers);
        break;
      default:
        result = { error: 'Unknown action' };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  let result;

  try {
    switch (action) {
      case 'saveAnswer':
        result = saveAnswer(data);
        break;
      case 'saveAnswers':
        result = saveAnswers(data.answers);
        break;
      default:
        result = { error: 'Unknown action' };
    }
  } catch (err) {
    result = { error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- 科目一覧 ---

function getSubjects() {
  return {
    subjects: [
      { id: 'kokugo', name: '国語', icon: '📖' },
      { id: 'sansu', name: '算数', icon: '🔢' },
      { id: 'rika', name: '理科', icon: '🔬' },
      { id: 'shakai', name: '社会', icon: '🌍' },
      { id: 'eigo', name: '英語', icon: '🔤' }
    ]
  };
}

// --- 問題取得 ---

function getQuestions(subject) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('questions');
  if (!sheet) return { questions: [] };

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const questions = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[1] === subject) {
      questions.push({
        id: row[0],
        subject: row[1].toString().trim(),
        unit: row[2].toString().trim(),
        question: row[3].toString().trim(),
        choices: JSON.parse(row[4]).map(function(c) { return c.trim(); }),
        answer: row[5].toString().trim(),
        explanation: row[6].toString().trim()
      });
    }
  }

  // シャッフルして最大10問返す
  const shuffled = questions.sort(() => Math.random() - 0.5);
  return { questions: shuffled.slice(0, 10) };
}

// --- 回答保存 ---

function saveAnswer(data) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('answers');
  if (!sheet) {
    ss.insertSheet('answers');
    ss.getSheetByName('answers').appendRow([
      'timestamp', 'questionId', 'subject', 'unit', 'userAnswer', 'correctAnswer', 'isCorrect'
    ]);
  }

  const answersSheet = ss.getSheetByName('answers');
  answersSheet.appendRow([
    new Date().toISOString(),
    data.questionId,
    data.subject,
    data.unit,
    data.userAnswer,
    data.correctAnswer,
    data.isCorrect
  ]);

  updateAnalysis(data.subject, data.unit, data.isCorrect);

  return { success: true };
}

function saveAnswers(answers) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName('answers');
  if (!sheet) {
    sheet = ss.insertSheet('answers');
    sheet.appendRow([
      'timestamp', 'questionId', 'subject', 'unit', 'userAnswer', 'correctAnswer', 'isCorrect'
    ]);
  }

  const now = new Date().toISOString();
  const rows = answers.map(a => [
    now, a.questionId, a.subject, a.unit, a.userAnswer, a.correctAnswer, a.isCorrect
  ]);

  if (rows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, 7).setValues(rows);
  }

  // 分析を更新
  answers.forEach(a => updateAnalysis(a.subject, a.unit, a.isCorrect));

  return { success: true };
}

// --- 苦手分析 ---

function updateAnalysis(subject, unit, isCorrect) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName('analysis');
  if (!sheet) {
    sheet = ss.insertSheet('analysis');
    sheet.appendRow(['subject', 'unit', 'totalCount', 'correctCount', 'accuracy']);
  }

  const data = sheet.getDataRange().getValues();
  let found = false;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === subject && data[i][1] === unit) {
      const total = data[i][2] + 1;
      const correct = data[i][3] + (isCorrect ? 1 : 0);
      const accuracy = Math.round((correct / total) * 100);
      sheet.getRange(i + 1, 3, 1, 3).setValues([[total, correct, accuracy]]);
      found = true;
      break;
    }
  }

  if (!found) {
    const total = 1;
    const correct = isCorrect ? 1 : 0;
    const accuracy = Math.round((correct / total) * 100);
    sheet.appendRow([subject, unit, total, correct, accuracy]);
  }
}

function getAnalysis() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('analysis');
  if (!sheet) return { analysis: [], weakPoints: [] };

  const data = sheet.getDataRange().getValues();
  const analysis = [];

  for (let i = 1; i < data.length; i++) {
    analysis.push({
      subject: data[i][0],
      unit: data[i][1],
      totalCount: data[i][2],
      correctCount: data[i][3],
      accuracy: data[i][4]
    });
  }

  // 苦手判定: 正答率60%未満 & 回答3回以上
  const weakPoints = analysis
    .filter(a => a.accuracy < 60 && a.totalCount >= 3)
    .sort((a, b) => a.accuracy - b.accuracy);

  // 科目別の平均正答率
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
    totalCount: stats.total
  }));

  // 苦手傾向メッセージ生成
  const tendencies = detectTendencies(weakPoints);

  return { analysis, weakPoints, subjectAccuracy, tendencies };
}

function detectTendencies(weakPoints) {
  const tendencies = [];
  const subjectGroups = {};

  weakPoints.forEach(wp => {
    if (!subjectGroups[wp.subject]) {
      subjectGroups[wp.subject] = [];
    }
    subjectGroups[wp.subject].push(wp);
  });

  const subjectNames = {
    kokugo: '国語', sansu: '算数', rika: '理科', shakai: '社会', eigo: '英語'
  };

  Object.entries(subjectGroups).forEach(([subject, units]) => {
    const name = subjectNames[subject] || subject;
    if (units.length >= 2) {
      const unitNames = units.map(u => u.unit).join('、');
      tendencies.push({
        subject,
        message: `${name}の「${unitNames}」で間違いが多い傾向があります。似たタイプの問題が苦手かもしれません。`,
        severity: 'high'
      });
    } else if (units.length === 1) {
      tendencies.push({
        subject,
        message: `${name}の「${units[0].unit}」がちょっと苦手みたいです（正答率${units[0].accuracy}%）。`,
        severity: 'medium'
      });
    }
  });

  return tendencies;
}

// --- 初期セットアップ ---

function setupSpreadsheet() {
  const ss = getSpreadsheet();

  // questions シート
  let qSheet = ss.getSheetByName('questions');
  if (!qSheet) {
    qSheet = ss.insertSheet('questions');
  }
  qSheet.clear();
  qSheet.appendRow(['id', 'subject', 'unit', 'question', 'choices', 'answer', 'explanation']);

  // サンプル問題を追加
  const sampleQuestions = getSampleQuestions();
  sampleQuestions.forEach(q => {
    qSheet.appendRow([q.id, q.subject, q.unit, q.question, JSON.stringify(q.choices), q.answer, q.explanation]);
  });

  // answers シート
  let aSheet = ss.getSheetByName('answers');
  if (!aSheet) {
    aSheet = ss.insertSheet('answers');
  }
  aSheet.clear();
  aSheet.appendRow(['timestamp', 'questionId', 'subject', 'unit', 'userAnswer', 'correctAnswer', 'isCorrect']);

  // analysis シート
  let anSheet = ss.getSheetByName('analysis');
  if (!anSheet) {
    anSheet = ss.insertSheet('analysis');
  }
  anSheet.clear();
  anSheet.appendRow(['subject', 'unit', 'totalCount', 'correctCount', 'accuracy']);

  return 'セットアップ完了！';
}
