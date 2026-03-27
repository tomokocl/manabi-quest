// サンプル問題データ（フロントエンドデモ用）

export function getSampleQuestions() {
  return [
    // --- 国語 ---
    { id: 'ko-01', subject: 'kokugo', unit: '漢字の読み', question: '「森林」の読みがなは？', choices: ['しんりん', 'もりばやし', 'もりりん', 'しんばやし'], answer: 'しんりん', explanation: '「森」は「しん」、「林」は「りん」と読みます。' },
    { id: 'ko-02', subject: 'kokugo', unit: '漢字の読み', question: '「畑」の読みがなは？', choices: ['はたけ', 'はた', 'たけ', 'のはら'], answer: 'はたけ', explanation: '「畑」は「はたけ」と読みます。日本で作られた漢字です。' },
    { id: 'ko-03', subject: 'kokugo', unit: '漢字の書き', question: '「あたたかい」を漢字で書くと？', choices: ['温かい', '暖かい', '熱かい', '暑かい'], answer: '温かい', explanation: '気持ちや飲み物などには「温かい」を使います。' },
    { id: 'ko-04', subject: 'kokugo', unit: '文の組み立て', question: '「犬が　ほえる。」の主語はどれ？', choices: ['犬が', 'ほえる', '犬', 'ほえる。'], answer: '犬が', explanation: '「〜が」がついている言葉が主語です。' },
    { id: 'ko-05', subject: 'kokugo', unit: '文の組み立て', question: '次の文の述語はどれ？「花が きれいに さく。」', choices: ['さく', '花が', 'きれいに', '花'], answer: 'さく', explanation: '述語は「どうする」にあたる部分です。' },

    // --- 算数 ---
    { id: 'sa-01', subject: 'sansu', unit: 'かけ算', question: '7 × 8 = ?', choices: ['56', '54', '58', '63'], answer: '56', explanation: '7 × 8 = 56 です。7の段をおぼえましょう。' },
    { id: 'sa-02', subject: 'sansu', unit: 'かけ算', question: '9 × 6 = ?', choices: ['54', '56', '48', '63'], answer: '54', explanation: '9 × 6 = 54 です。' },
    { id: 'sa-03', subject: 'sansu', unit: 'わり算', question: '24 ÷ 6 = ?', choices: ['4', '3', '5', '6'], answer: '4', explanation: '6 × 4 = 24 なので、24 ÷ 6 = 4 です。' },
    { id: 'sa-04', subject: 'sansu', unit: 'わり算', question: '35 ÷ 5 = ?', choices: ['7', '6', '8', '5'], answer: '7', explanation: '5 × 7 = 35 なので、35 ÷ 5 = 7 です。' },
    { id: 'sa-05', subject: 'sansu', unit: '大きな数', question: '1000 が 5 こ あつまると いくつ？', choices: ['5000', '500', '50000', '5100'], answer: '5000', explanation: '1000 × 5 = 5000 です。' },
    { id: 'sa-06', subject: 'sansu', unit: '長さ', question: '1km は 何m？', choices: ['1000m', '100m', '10000m', '10m'], answer: '1000m', explanation: '1km = 1000m です。' },

    // --- 理科 ---
    { id: 'ri-01', subject: 'rika', unit: '植物', question: 'たねから 最初に 出てくるのは？', choices: ['根（ね）', '葉（は）', '花（はな）', '実（み）'], answer: '根（ね）', explanation: 'たねからは最初に根が出てきます。' },
    { id: 'ri-02', subject: 'rika', unit: '植物', question: 'ヒマワリの花は どちらを 向く？', choices: ['太陽のほう', '月のほう', '北のほう', 'どこも向かない'], answer: '太陽のほう', explanation: 'ヒマワリは太陽の方を向いて咲きます。' },
    { id: 'ri-03', subject: 'rika', unit: '昆虫', question: 'チョウの体は いくつの部分に 分かれている？', choices: ['3つ', '2つ', '4つ', '5つ'], answer: '3つ', explanation: '昆虫の体は「頭・むね・はら」の3つに分かれています。' },
    { id: 'ri-04', subject: 'rika', unit: '太陽と影', question: '影（かげ）は 太陽の どちら側に できる？', choices: ['反対側', '同じ側', '横', '上'], answer: '反対側', explanation: '影は太陽の反対側にできます。' },
    { id: 'ri-05', subject: 'rika', unit: '磁石', question: '磁石（じしゃく）に つくのは どれ？', choices: ['鉄（てつ）', '木（き）', 'ガラス', 'プラスチック'], answer: '鉄（てつ）', explanation: '磁石は鉄を引きつけます。' },

    // --- 社会 ---
    { id: 'sh-01', subject: 'shakai', unit: '地図', question: '地図で 上は どの方角？', choices: ['北', '南', '東', '西'], answer: '北', explanation: '地図では上が北になります。' },
    { id: 'sh-02', subject: 'shakai', unit: '地図', question: '地図記号「〒」は何をあらわす？', choices: ['郵便局', '学校', '病院', '交番'], answer: '郵便局', explanation: '〒マークは郵便局をあらわします。' },
    { id: 'sh-03', subject: 'shakai', unit: 'くらし', question: 'スーパーで 売っている 食べものは どこから 来る？', choices: ['いろいろな場所から', '全部お店で作る', '全部外国から', '全部近くの畑から'], answer: 'いろいろな場所から', explanation: 'スーパーの商品は地元や他の県、外国などいろいろな場所から届きます。' },
    { id: 'sh-04', subject: 'shakai', unit: 'くらし', question: '消防署（しょうぼうしょ）の 電話番号は？', choices: ['119', '110', '117', '104'], answer: '119', explanation: '火事や救急のときは119番に電話します。' },
    { id: 'sh-05', subject: 'shakai', unit: '地いき', question: '市役所（しやくしょ）は 何をする ところ？', choices: ['まちの仕事をする', '買い物をする', '電車に乗る', '本を読む'], answer: 'まちの仕事をする', explanation: '市役所はまちの人たちのくらしを助ける仕事をするところです。' },

    // --- 英語（英検3級レベル） ---
    { id: 'ei-01', subject: 'eigo', unit: '基本文法', question: 'I ___ a student.', choices: ['am', 'is', 'are', 'be'], answer: 'am', explanation: '「I」のときは「am」を使います。I am a student.（わたしは生徒です）' },
    { id: 'ei-02', subject: 'eigo', unit: '基本文法', question: 'She ___ to school every day.', choices: ['goes', 'go', 'going', 'went'], answer: 'goes', explanation: '「She」のときは動詞に「s」をつけます。She goes to school.（彼女は毎日学校に行きます）' },
    { id: 'ei-03', subject: 'eigo', unit: '過去形', question: 'I ___ breakfast this morning.', choices: ['had', 'have', 'has', 'having'], answer: 'had', explanation: '「this morning（今朝）」は過去のことなので「had」を使います。' },
    { id: 'ei-04', subject: 'eigo', unit: '単語', question: '「library」の意味は？', choices: ['図書館', '病院', '公園', '学校'], answer: '図書館', explanation: 'library = 図書館 です。' },
    { id: 'ei-05', subject: 'eigo', unit: '単語', question: '「Wednesday」は何曜日？', choices: ['水曜日', '月曜日', '金曜日', '木曜日'], answer: '水曜日', explanation: 'Wednesday = 水曜日 です。' },
    { id: 'ei-06', subject: 'eigo', unit: '読解', question: '"I like to play soccer after school." — この人が好きなことは？', choices: ['放課後にサッカーをすること', '学校に行くこと', '朝走ること', '本を読むこと'], answer: '放課後にサッカーをすること', explanation: 'play soccer = サッカーをする、after school = 放課後 です。' },
    { id: 'ei-07', subject: 'eigo', unit: '会話表現', question: '"How are you?" と聞かれたら？', choices: ["I'm fine, thank you.", "I'm ten years old.", "I like sushi.", "Yes, I can."], answer: "I'm fine, thank you.", explanation: '「調子はどう？」と聞かれたら「元気です、ありがとう」と答えます。' },
  ];
}
