// ========================================
// Gemini API 問題自動生成（月次トリガー）
// ========================================

function generateMonthlyQuestions() {
  const subjects = [
    { id: 'kokugo', name: '国語', units: ['漢字の読み', '漢字の書き', '文の組み立て', 'ことわざ・慣用句'] },
    { id: 'sansu', name: '算数', units: ['かけ算', 'わり算', '大きな数', '長さ', '重さ', '時間と時刻', '図形'] },
    { id: 'rika', name: '理科', units: ['植物', '昆虫', '太陽と影', '磁石', '光', '風とゴム'] },
    { id: 'shakai', name: '社会', units: ['地図', 'くらし', '地いき', '工場', '農家'] },
    { id: 'eigo', name: '英語（英検3級）', units: ['基本文法', '過去形', '単語', '読解', '会話表現', '未来形'] }
  ];

  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName('questions');
  if (!sheet) {
    sheet = ss.insertSheet('questions');
    sheet.appendRow(['id', 'subject', 'unit', 'question', 'choices', 'answer', 'explanation']);
  }

  // 既存の問題IDを取得（重複防止）
  const existingData = sheet.getDataRange().getValues();
  const existingIds = new Set(existingData.slice(1).map(row => row[0]));

  let newQuestionCount = 0;

  subjects.forEach(subject => {
    const prompt = buildPrompt(subject);
    const questions = callGeminiAPI(prompt);

    if (questions && questions.length > 0) {
      questions.forEach(q => {
        const id = `${subject.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        if (!existingIds.has(id)) {
          sheet.appendRow([
            id,
            subject.id,
            q.unit,
            q.question,
            JSON.stringify(q.choices),
            q.answer,
            q.explanation
          ]);
          newQuestionCount++;
        }
      });
    }
  });

  Logger.log(`${newQuestionCount}問を追加しました`);
  return `${newQuestionCount}問を追加しました`;
}

function buildPrompt(subject) {
  return `あなたは小学3年生向けの学習教材の作成者です。
日本の学習指導要領に沿って、${subject.name}の問題を作成してください。

【条件】
- 対象: 小学3年生
- 科目: ${subject.name}
- 単元: ${subject.units.join('、')}
- 各単元から2問ずつ、合計${subject.units.length * 2}問
- 4択問題
- 小学3年生にわかりやすい日本語で書く
${subject.id === 'eigo' ? '- 英語は英検3級レベルの内容にする\n- 問題文は英語、選択肢と解説は日本語でもOK' : ''}

【出力形式】
以下のJSON配列で出力してください。JSON以外のテキストは含めないでください。
[
  {
    "unit": "単元名",
    "question": "問題文",
    "choices": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
    "answer": "正解の選択肢",
    "explanation": "解説（やさしい言葉で）"
  }
]`;
}

function callGeminiAPI(prompt) {
  const apiKey = GEMINI_API_KEY;
  if (!apiKey) {
    Logger.log('Gemini API キーが設定されていません');
    return [];
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json'
    }
  };

  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const json = JSON.parse(response.getContentText());
    const text = json.candidates[0].content.parts[0].text;
    return JSON.parse(text);
  } catch (err) {
    Logger.log('Gemini API エラー: ' + err.message);
    return [];
  }
}

// --- 月次トリガー設定 ---

function createMonthlyTrigger() {
  // 既存トリガーを削除
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'generateMonthlyQuestions') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // 毎月1日の朝9時に実行
  ScriptApp.newTrigger('generateMonthlyQuestions')
    .timeBased()
    .onMonthDay(1)
    .atHour(9)
    .create();

  Logger.log('月次トリガーを設定しました（毎月1日 9:00）');
}
