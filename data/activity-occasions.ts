import type { ActivityOccasionSeoPage } from '@/types/seo-pages'

const now = new Date().toISOString()

export const activityOccasionPages: ActivityOccasionSeoPage[] = [
  {
    id: 'act-1',
    page_type: 'activity_occasion',
    slug: 'rainy-day-activities-bangkok',
    title: 'Best Rainy Day Activities in Bangkok | Indoor Things to Do',
    meta_description:
      'Looking for rainy day activities in Bangkok? From indoor golf simulators to escape rooms and cooking classes, here are the best things to do when it rains in Bangkok.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'weather',
    locale: 'en',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/weekend-activities-bangkok', '/activities/family-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'rainy-day',
      intro:
        'Bangkok receives heavy rain from May through October, often with sudden downpours that can last hours. When outdoor plans get washed out, the city has plenty of air-conditioned indoor activities — from golf simulators and escape rooms to cooking classes and bowling alleys. Here are the best options for a rainy day in Bangkok.',
      why_lengolf:
        'LENGOLF is an indoor golf simulator bar at Mercury Ville, BTS Chidlom. With premium Bravo golf simulators, a full bar, and air-conditioning, it\'s one of Bangkok\'s best rainy day options — whether you\'re a golfer or have never picked up a club. Bay rental starts at ~550 THB/hour for up to 5 people, making it just ~110 THB per person for a group.',
      other_activities: [
        { name: 'Escape Room Bangkok', description: 'Solve puzzles and clues in themed rooms. Great for groups of 3-6. Multiple locations across Bangkok.', type: 'entertainment' },
        { name: 'Thai Cooking Class', description: 'Learn to make pad thai, green curry, and mango sticky rice. Most classes run 3 hours and include market tours when weather permits.', type: 'culinary' },
        { name: 'Bowling at Blu-O', description: 'Modern bowling alleys with glow-in-the-dark lanes, located in major shopping malls including Siam Paragon.', type: 'entertainment' },
        { name: 'Art in Paradise', description: '3D interactive art museum where you become part of the artwork. Fun for families and social media photos.', type: 'museum' },
        { name: 'Spa & Thai Massage', description: 'Bangkok has world-class spas at every price point. Perfect for relaxing while it pours outside.', type: 'wellness' },
        { name: 'Shopping Mall Exploration', description: 'CentralWorld, Siam Paragon, and EmQuartier are massive entertainment complexes with cinemas, restaurants, and activities beyond shopping.', type: 'shopping' },
      ],
      seasonal_relevance: [5, 6, 7, 8, 9, 10],
      target_audience: 'Tourists and locals during May-Oct monsoon season',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'Group friendly (5+ people)', lengolf: 'Yes — up to 5 per bay', alternative: 'Varies by activity' },
        { feature: 'No booking required', lengolf: 'Walk-ins welcome', alternative: 'Often needs reservation' },
        { feature: 'Food & drinks on-site', lengolf: 'Full bar + food menu', alternative: 'Usually separate' },
        { feature: 'Beginner friendly', lengolf: 'No experience needed', alternative: 'Depends on activity' },
        { feature: 'Near BTS station', lengolf: 'BTS Chidlom (Exit 4)', alternative: 'Varies' },
        { feature: 'Price per person (group of 5)', lengolf: 'From ~110 THB/person/hour', alternative: '200-800 THB/person' },
      ],
    },
  },

  // ─── TH: rainy-day-activities-bangkok ───
  // Title/meta rewritten as a Thai local would search (กิจกรรมวันฝนตก /
  // ที่เที่ยวในร่ม) rather than as a translation of the EN tourist framing.
  // Every figure traces to the EN entry: 550 บาท/ชม. (why_lengolf), ~110 บาท/คน
  // and 200-800 บาท/คน (comparison_table). As-of marker carried in why_lengolf.
  {
    id: 'act-1-th',
    page_type: 'activity_occasion',
    slug: 'rainy-day-activities-bangkok',
    title: 'กิจกรรมวันฝนตกในกรุงเทพฯ | ที่เที่ยวในร่มหนีฝนที่น่าไป',
    meta_description:
      'หาที่เที่ยวในร่มวันฝนตกในกรุงเทพฯ อยู่ใช่ไหม รวมกิจกรรมหนีฝนที่ทำได้ทั้งวัน ตั้งแต่กอล์ฟซิมูเลเตอร์ในร่ม ห้องปริศนา ไปจนถึงคลาสทำอาหารไทยและโบว์ลิ่ง',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'weather',
    locale: 'th',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/weekend-activities-bangkok', '/activities/family-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'rainy-day',
      intro:
        'กรุงเทพฯ มีฝนตกหนักตั้งแต่เดือนพฤษภาคมถึงตุลาคม และหลายครั้งเป็นฝนที่เทลงมากะทันหันแล้วตกยาวหลายชั่วโมง เมื่อแผนกลางแจ้งต้องล้มไป เมืองนี้ยังมีกิจกรรมในร่มติดแอร์ให้เลือกอีกมาก ตั้งแต่กอล์ฟซิมูเลเตอร์และห้องปริศนา ไปจนถึงคลาสทำอาหารและลานโบว์ลิ่ง นี่คือตัวเลือกที่ดีที่สุดสำหรับวันฝนตกในกรุงเทพฯ',
      why_lengolf:
        'LENGOLF คือบาร์กอล์ฟซิมูเลเตอร์ในร่ม ตั้งอยู่ใน The Mercury Ville ที่ BTS ชิดลม มีซิมูเลเตอร์ Bravo Golf ระดับพรีเมียม บาร์ครบวงจร และห้องแอร์เย็นสบาย จึงเป็นหนึ่งในตัวเลือกที่ดีที่สุดสำหรับวันฝนตกในกรุงเทพฯ ไม่ว่าคุณจะเล่นกอล์ฟเป็นอยู่แล้วหรือไม่เคยจับไม้มาก่อน ค่าเช่าเบย์เริ่มต้นประมาณ 550 บาท/ชั่วโมง สำหรับผู้เล่นสูงสุด 5 คน เมื่อมากันเป็นกลุ่มจึงเฉลี่ยแล้วตกประมาณคนละ 110 บาท (ข้อมูล ณ กรกฎาคม 2026)',
      other_activities: [
        { name: 'Escape Room Bangkok', description: 'ไขปริศนาและตามหาเบาะแสในห้องธีมต่างๆ เหมาะกับกลุ่ม 3-6 คน มีหลายสาขาทั่วกรุงเทพฯ', type: 'entertainment' },
        { name: 'Thai Cooking Class', description: 'เรียนทำผัดไทย แกงเขียวหวาน และข้าวเหนียวมะม่วง คลาสส่วนใหญ่ใช้เวลา 3 ชั่วโมง และมีทัวร์ตลาดรวมอยู่ด้วยเมื่ออากาศเอื้ออำนวย', type: 'culinary' },
        { name: 'Bowling at Blu-O', description: 'ลานโบว์ลิ่งสมัยใหม่พร้อมเลนเรืองแสง ตั้งอยู่ในห้างใหญ่หลายแห่ง รวมถึงสยามพารากอน', type: 'entertainment' },
        { name: 'Art in Paradise', description: 'พิพิธภัณฑ์ภาพวาด 3 มิติที่ให้คุณเข้าไปเป็นส่วนหนึ่งของภาพ สนุกสำหรับครอบครัวและถ่ายรูปลงโซเชียล', type: 'museum' },
        { name: 'Spa & Thai Massage', description: 'กรุงเทพฯ มีสปาระดับโลกในทุกช่วงราคา เหมาะกับการพักผ่อนขณะที่ฝนกำลังเทอยู่ข้างนอก', type: 'wellness' },
        { name: 'Shopping Mall Exploration', description: 'เซ็นทรัลเวิลด์ สยามพารากอน และ EmQuartier เป็นศูนย์รวมความบันเทิงขนาดใหญ่ ทั้งโรงภาพยนตร์ ร้านอาหาร และกิจกรรมอื่นๆ นอกเหนือจากการช้อปปิ้ง', type: 'shopping' },
      ],
      seasonal_relevance: [5, 6, 7, 8, 9, 10],
      target_audience: 'นักท่องเที่ยวและคนกรุงเทพฯ ในช่วงฤดูฝนเดือนพฤษภาคม-ตุลาคม',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'เหมาะกับกลุ่ม (5 คนขึ้นไป)', lengolf: 'ได้ สูงสุด 5 คนต่อเบย์', alternative: 'แล้วแต่กิจกรรม' },
        { feature: 'ไม่ต้องจองล่วงหน้า', lengolf: 'วอล์กอินได้', alternative: 'ส่วนใหญ่ต้องจองก่อน' },
        { feature: 'มีอาหารและเครื่องดื่มในสถานที่', lengolf: 'บาร์ครบวงจรพร้อมเมนูอาหาร', alternative: 'ปกติต้องแยกร้าน' },
        { feature: 'เป็นมิตรกับมือใหม่', lengolf: 'ไม่ต้องมีประสบการณ์', alternative: 'ขึ้นอยู่กับกิจกรรม' },
        { feature: 'ใกล้สถานี BTS', lengolf: 'BTS ชิดลม (ทางออก 4)', alternative: 'แล้วแต่สถานที่' },
        { feature: 'ราคาต่อคน (กลุ่ม 5 คน)', lengolf: 'เริ่มต้นประมาณ 110 บาท/คน/ชั่วโมง', alternative: '200-800 บาท/คน' },
      ],
    },
  },

  // ─── JA: rainy-day-activities-bangkok ───
  // Title/meta front-load the JA query (バンコク 雨の日) rather than rendering the
  // EN headline literally. Every figure traces to the EN entry (約550THB/時、最大5名、
  // 1人約110THB、200〜800THB) and carries EN's "~" hedge as 約; the JA currency
  // ruling applies (half-width digits + THB, 〜 ranges, （2026年7月現在）).
  // Venue names in other_activities are verbatim; mall names inside descriptions
  // use their established JA renderings. related_slugs unchanged — all three are
  // in the ja allowlist.
  {
    id: 'act-1-ja',
    page_type: 'activity_occasion',
    slug: 'rainy-day-activities-bangkok',
    title: 'バンコクの雨の日にできること — 屋内で楽しめるおすすめの過ごし方',
    meta_description:
      'バンコクで雨の日にできることをお探しですか。インドアゴルフシミュレーターから脱出ゲーム、タイ料理教室まで、雨が降っても楽しめるバンコクの屋内アクティビティをまとめました。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'weather',
    locale: 'ja',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/weekend-activities-bangkok', '/activities/family-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'rainy-day',
      intro:
        'バンコクでは5月から10月にかけてまとまった雨が降り、数時間続く突然のスコールも珍しくありません。屋外の予定が流れてしまっても、この街には冷房の効いた屋内アクティビティが揃っています。ゴルフシミュレーターや脱出ゲームから、料理教室、ボウリングまで。雨の日のバンコクにおすすめの過ごし方をご紹介します。',
      why_lengolf:
        'LENGOLFは、BTSチットロム駅直結のザ・マーキュリービルにあるインドアゴルフシミュレーターバーです。ハイグレードなBravo Golfシミュレーター、フルバー、そして効いた冷房。ゴルフ経験の有無を問わず楽しめるので、雨の日のバンコクでは有力な選択肢になります。ベイのレンタルは最大5名まで1時間約550THBからで、グループで分ければ1人あたり約110THB（2026年7月現在）。',
      other_activities: [
        { name: 'Escape Room Bangkok', description: 'テーマ別の部屋で謎とヒントを解いていく体験型ゲーム。3〜6名のグループに向いており、バンコク市内の複数箇所にあります。', type: 'entertainment' },
        { name: 'Thai Cooking Class', description: 'パッタイ、グリーンカレー、マンゴースティッキーライスの作り方を学べます。多くの教室は3時間ほどで、天候が許せば市場の見学も付きます。', type: 'culinary' },
        { name: 'Bowling at Blu-O', description: 'サイアムパラゴンをはじめとする大型ショッピングモールに入っている、暗闇で光るレーンが特徴のモダンなボウリング場。', type: 'entertainment' },
        { name: 'Art in Paradise', description: '自分が作品の一部になれる3Dトリックアート美術館。家族連れにも、写真をSNSに上げたい方にも向いています。', type: 'museum' },
        { name: 'Spa & Thai Massage', description: 'バンコクにはどの価格帯にも世界水準のスパがあります。外が土砂降りのときにこそ、ゆっくり過ごすのに最適です。', type: 'wellness' },
        { name: 'Shopping Mall Exploration', description: 'セントラルワールド、サイアムパラゴン、エムクオーティエは、映画館やレストラン、各種アクティビティまで揃う巨大な複合施設。買い物だけの場所ではありません。', type: 'shopping' },
      ],
      seasonal_relevance: [5, 6, 7, 8, 9, 10],
      target_audience: '雨季（5〜10月）のバンコクで過ごす旅行者と在住者',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'グループ向き（5名以上）', lengolf: '対応可 — 1ベイ最大5名', alternative: 'アクティビティごとに異なる' },
        { feature: '予約なしで利用できるか', lengolf: '当日の飛び込みも歓迎', alternative: '要予約のことが多い' },
        { feature: '館内での飲食', lengolf: 'フルバーとフードメニューあり', alternative: '別の店に移動するのが一般的' },
        { feature: '初心者でも楽しめるか', lengolf: '経験は不要', alternative: '内容によって異なる' },
        { feature: 'BTS駅からの近さ', lengolf: 'BTSチットロム駅（4番出口）', alternative: '場所による' },
        { feature: '1人あたりの料金（5名の場合）', lengolf: '1人1時間あたり約110THBから', alternative: '1人あたり200〜800THB' },
      ],
    },
  },

  // ─── KO: rainy-day-activities-bangkok ───
  // Title/meta front-load the KO query shape (방콕 비 오는 날) rather than a
  // literal rendering of the EN headline. Prices follow the KO ruling (바트
  // spelled, digits attached, ~ ranges) and carry the as-of marker once; every
  // figure traces to the EN entry (550바트/시간, 110바트/인, 200~800바트).
  // occasion_type / seasonal_relevance / show_aqi_widget copied byte-identical.
  // Generic English category labels in other_activities are localized; real
  // business names (Escape Room Bangkok, Blu-O, Art in Paradise, CentralWorld,
  // Siam Paragon, EmQuartier) stay verbatim Latin.
  {
    id: 'act-1-ko',
    page_type: 'activity_occasion',
    slug: 'rainy-day-activities-bangkok',
    title: '방콕 비 오는 날 할 것 — 실내 액티비티 추천',
    meta_description:
      '방콕에서 비 오는 날 뭐 하지 고민이라면, 실내 골프 시뮬레이터부터 방탈출, 쿠킹 클래스까지 에어컨 나오는 놀거리를 모았어요. 5~10월 우기에 특히 유용해요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'weather',
    locale: 'ko',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/weekend-activities-bangkok', '/activities/family-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'rainy-day',
      intro:
        '방콕은 5월부터 10월까지 비가 많이 내려요. 갑자기 쏟아져 몇 시간씩 이어지는 날도 흔해요. 야외 일정이 어그러졌을 때 기댈 수 있는 실내 놀거리는 방콕에 꽤 많아요. 골프 시뮬레이터와 방탈출부터 쿠킹 클래스, 볼링장까지 전부 에어컨이 나오는 곳이에요. 방콕에서 비 오는 날 가기 좋은 곳을 정리했어요.',
      why_lengolf:
        'LENGOLF는 BTS 칫롬역 The Mercury Ville에 있는 실내 골프 시뮬레이터 바예요. 프리미엄 Bravo 골프 시뮬레이터와 바, 에어컨까지 갖춰져 있어서, 골프를 쳐 본 적이 있든 클럽을 한 번도 잡아 본 적이 없든 비 오는 날 시간을 보내기 좋아요. 베이 이용료는 최대 5명까지 시간당 약 550바트부터라, 다섯 명이 모이면 1인당 약 110바트 정도예요 (2026년 7월 기준).',
      other_activities: [
        { name: 'Escape Room Bangkok', description: '테마별로 꾸민 방에서 단서를 풀어 나가요. 3~6명 그룹에 잘 맞고, 방콕 곳곳에 지점이 있어요.', type: 'entertainment' },
        { name: '태국 쿠킹 클래스', description: '팟타이, 그린 커리, 망고 찰밥 만드는 법을 배워요. 대부분 3시간짜리이고, 날씨가 괜찮으면 시장 투어도 함께 진행해요.', type: 'culinary' },
        { name: 'Blu-O 볼링', description: '야광 레인을 갖춘 현대식 볼링장이에요. Siam Paragon을 비롯한 주요 쇼핑몰 안에 있어요.', type: 'entertainment' },
        { name: 'Art in Paradise', description: '작품 속으로 들어가 한 장면이 되는 3D 트릭아트 미술관이에요. 가족 나들이나 SNS 사진용으로 인기가 많아요.', type: 'museum' },
        { name: '스파와 타이 마사지', description: '방콕에는 가격대별로 수준 높은 스파가 많아요. 밖에 비가 쏟아지는 동안 쉬어 가기 좋아요.', type: 'wellness' },
        { name: '쇼핑몰 둘러보기', description: 'CentralWorld, Siam Paragon, EmQuartier는 쇼핑만 하는 곳이 아니라 영화관과 식당, 각종 체험까지 들어찬 대형 복합 공간이에요.', type: 'shopping' },
      ],
      seasonal_relevance: [5, 6, 7, 8, 9, 10],
      target_audience: '5~10월 우기에 방콕에 머무는 여행자와 현지 거주자',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '단체 이용 (5명 이상)', lengolf: '가능 — 베이당 최대 5명', alternative: '액티비티마다 달라요' },
        { feature: '예약 없이 방문', lengolf: '워크인 환영', alternative: '예약이 필요한 곳이 많아요' },
        { feature: '현장 식음료', lengolf: '바와 음식 메뉴 완비', alternative: '보통 따로 해결' },
        { feature: '초보자 친화', lengolf: '경험 없어도 가능', alternative: '액티비티에 따라 달라요' },
        { feature: 'BTS 역 접근성', lengolf: 'BTS 칫롬역(4번 출구)', alternative: '제각각이에요' },
        { feature: '1인당 요금 (5명 그룹)', lengolf: '시간당 1인 약 110바트부터', alternative: '1인 200~800바트' },
      ],
    },
  },

  // ─── ZH: rainy-day-activities-bangkok ───
  // Title/meta front-load the Mainland search shape 曼谷 雨天 去哪玩 rather than
  // rendering the EN headline literally. Every figure traces to EN act-1
  // (5–10月降雨, 每小时约550泰铢, 最多5人, 人均约110泰铢, 每人200–800泰铢,
  // 4号出口); the LENGOLF bay price carries the ZH as-of marker 截至2026年7月 per
  // the shipped ZH FAQ corpus. occasion_type / seasonal_relevance /
  // show_aqi_widget copied byte-identical. other_activities[].name kept verbatim;
  // only established Chinese renderings glossed (暹罗百丽宫, 尚泰世界).
  {
    id: 'act-1-zh',
    page_type: 'activity_occasion',
    slug: 'rainy-day-activities-bangkok',
    title: '曼谷雨天去哪玩 — 室内高尔夫、密室逃脱与更多好去处',
    meta_description:
      '曼谷5–10月常有暴雨，户外计划泡汤时怎么办。从室内高尔夫模拟器到密室逃脱、泰餐烹饪课与保龄球，这里整理了曼谷雨天最值得去的室内活动。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'weather',
    locale: 'zh',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/weekend-activities-bangkok', '/activities/family-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'rainy-day',
      intro:
        '曼谷从5月到10月雨量很大，经常突然下起持续数小时的暴雨。户外计划被浇灭的时候，这座城市有大量开着空调的室内活动可选——从高尔夫模拟器、密室逃脱，到烹饪课和保龄球馆。以下是曼谷雨天最值得考虑的几个选择。',
      why_lengolf:
        'LENGOLF是一家位于Mercury Ville、BTS Chidlom旁的室内高尔夫模拟器酒吧。这里配备高规格的Bravo高尔夫模拟器、一整套吧台和空调，是曼谷最好的雨天去处之一——不管你是球友，还是从来没碰过球杆。球位租用每小时约550泰铢起，最多可容纳5人，团体分摊下来人均只要约110泰铢，截至2026年7月。',
      other_activities: [
        { name: 'Escape Room Bangkok', description: '在主题房间里解谜、找线索。很适合3–6人的小团体，曼谷多处设有分店。', type: 'entertainment' },
        { name: 'Thai Cooking Class', description: '学做泰式炒河粉、绿咖喱和芒果糯米饭。多数课程约3小时，天气允许时还包含市场导览。', type: 'culinary' },
        { name: 'Bowling at Blu-O', description: '现代化保龄球馆，有夜光球道，开在包括Siam Paragon（暹罗百丽宫）在内的大型商场里。', type: 'entertainment' },
        { name: 'Art in Paradise', description: '3D互动艺术馆，你本人会成为作品的一部分。适合亲子同游，也很好出片。', type: 'museum' },
        { name: 'Spa & Thai Massage', description: '曼谷各个价位都有世界级水准的水疗馆。外面下着大雨时，正好进来放松。', type: 'wellness' },
        { name: 'Shopping Mall Exploration', description: 'CentralWorld（尚泰世界）、Siam Paragon和EmQuartier都是超大型综合体，除了购物还有影院、餐厅和各种活动。', type: 'shopping' },
      ],
      seasonal_relevance: [5, 6, 7, 8, 9, 10],
      target_audience: '5–10月雨季期间身在曼谷的游客与本地居民',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '适合团体（5人以上）', lengolf: '可以——每个球位最多5人', alternative: '因活动而异' },
        { feature: '无需预订', lengolf: '欢迎直接到店', alternative: '通常需要提前预约' },
        { feature: '现场餐饮', lengolf: '全套吧台与餐点菜单', alternative: '一般得另找地方' },
        { feature: '新手友好', lengolf: '零基础也能玩', alternative: '视活动而定' },
        { feature: '邻近BTS车站', lengolf: 'BTS Chidlom（4号出口）', alternative: '因地点而异' },
        { feature: '人均价格（5人同行）', lengolf: '每人每小时约110泰铢起', alternative: '每人200–800泰铢' },
      ],
    },
  },
  {
    id: 'act-2',
    page_type: 'activity_occasion',
    slug: 'date-night-ideas-bangkok',
    title: 'Date Night Ideas in Bangkok | Unique Romantic Things to Do',
    meta_description:
      'Planning a date night in Bangkok? Discover unique ideas beyond dinner — from indoor golf with cocktails to rooftop bars and cooking classes.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'en',
    related_slugs: ['/activities/things-to-do-bangkok-at-night', '/activities/golf-simulator-for-non-golfers', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'date-night',
      intro:
        'The best date nights in Bangkok go beyond dinner. The city has no shortage of unique experiences — from cocktail bars with Bravo golf simulators to rooftop dining with skyline views. Here are the most memorable date night ideas in Bangkok for 2026.',
      why_lengolf:
        'LENGOLF combines indoor golf simulators with a premium bar in a moody, upscale setting at Mercury Ville, BTS Chidlom. It\'s a date that\'s interactive, fun, and different — even if neither of you has golfed before. Share a bay (~550 THB/hour for two), order cocktails, and compete on virtual courses. The relaxed atmosphere makes it easy to talk and laugh without the pressure of a formal dinner.',
      other_activities: [
        { name: 'Rooftop Bar at Banyan Tree', description: 'Vertigo rooftop bar offers 360-degree skyline views at 61 floors up. Ideal for a special occasion.', type: 'bar' },
        { name: 'Dinner Cruise on the Chao Phraya', description: 'Floating dinner along the river with views of Wat Arun and the Grand Palace illuminated at night.', type: 'dining' },
        { name: 'Couples Cooking Class', description: 'Learn Thai cooking together and enjoy the meal you made. Several options in Silom and Sukhumvit.', type: 'culinary' },
        { name: 'Jazz Bar at Bamboo Bar', description: 'Live jazz in the intimate setting of the Mandarin Oriental. A Bangkok institution since 1953.', type: 'bar' },
        { name: 'Night Market Stroll at Jodd Fairs', description: 'Casual, vibrant atmosphere with street food, vintage shopping, and live music.', type: 'market' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'Couples looking for unique date experiences',
      show_aqi_widget: false,
      comparison_table: [
        { feature: 'Interactive / active', lengolf: 'Yes — play together', alternative: 'Mostly passive (dining, views)' },
        { feature: 'Budget for two', lengolf: 'From ~550 THB + drinks', alternative: '1,500-5,000+ THB' },
        { feature: 'Conversation-friendly', lengolf: 'Private bay, relaxed', alternative: 'Loud music at some bars' },
        { feature: 'No golf experience needed', lengolf: 'Yes — it\'s the fun part', alternative: 'N/A' },
        { feature: 'Rain-proof', lengolf: 'Yes — fully indoor', alternative: 'Rooftops affected by rain' },
      ],
    },
  },

  // ─── TH: date-night-ideas-bangkok ───
  // Thai date-night search framing (ไอเดียเดต / ที่เที่ยวคู่รัก) instead of a
  // literal rendering of the EN title. Figures from the EN entry: 550 บาท/ชม.
  // สำหรับสองคน, 1,500-5,000 บาทขึ้นไป, Vertigo ชั้น 61, Bamboo Bar ตั้งแต่ปี 1953.
  // The EN 'N/A' comparison cell becomes 'ไม่มีตัวเปรียบเทียบ'.
  {
    id: 'act-2-th',
    page_type: 'activity_occasion',
    slug: 'date-night-ideas-bangkok',
    title: 'ไอเดียเดตในกรุงเทพฯ | ที่เที่ยวคู่รักแบบไม่ซ้ำใคร',
    meta_description:
      'กำลังวางแผนเดตในกรุงเทพฯ อยู่ใช่ไหม รวมไอเดียที่มากกว่าแค่ไปกินข้าว ตั้งแต่กอล์ฟในร่มพร้อมค็อกเทล ไปจนถึงรูฟท็อปบาร์ ล่องเรือมื้อค่ำ และคลาสทำอาหารคู่',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'th',
    related_slugs: ['/activities/things-to-do-bangkok-at-night', '/activities/golf-simulator-for-non-golfers', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'date-night',
      intro:
        'เดตที่ดีที่สุดในกรุงเทพฯ ไม่ได้จบแค่มื้อเย็น เมืองนี้มีประสบการณ์แปลกใหม่ให้เลือกไม่ขาด ตั้งแต่บาร์ค็อกเทลที่มีกอล์ฟซิมูเลเตอร์ Bravo Golf ไปจนถึงร้านอาหารรูฟท็อปที่มองเห็นเส้นขอบฟ้าของเมือง นี่คือไอเดียเดตในกรุงเทพฯ ที่น่าจดจำที่สุดสำหรับปี 2026',
      why_lengolf:
        'LENGOLF ผสมกอล์ฟซิมูเลเตอร์ในร่มเข้ากับบาร์ระดับพรีเมียม ในบรรยากาศแสงสลัวและดูดี ที่ The Mercury Ville, BTS ชิดลม เป็นเดตที่ได้ลงมือทำจริง สนุก และไม่เหมือนใคร แม้ทั้งคู่จะไม่เคยเล่นกอล์ฟมาก่อน แชร์เบย์กันสองคน (ประมาณ 550 บาท/ชั่วโมง) สั่งค็อกเทล แล้วแข่งกันบนสนามเสมือนจริง บรรยากาศสบายๆ ทำให้คุยและหัวเราะกันได้ง่าย โดยไม่ต้องเกร็งเหมือนมื้อค่ำที่เป็นทางการ (ข้อมูล ณ กรกฎาคม 2026)',
      other_activities: [
        { name: 'Rooftop Bar at Banyan Tree', description: 'บาร์รูฟท็อป Vertigo บนชั้น 61 มองเห็นวิวเมือง 360 องศา เหมาะกับโอกาสพิเศษ', type: 'bar' },
        { name: 'Dinner Cruise on the Chao Phraya', description: 'มื้อค่ำบนเรือล่องแม่น้ำเจ้าพระยา พร้อมวิววัดอรุณและพระบรมมหาราชวังที่เปิดไฟยามค่ำคืน', type: 'dining' },
        { name: 'Couples Cooking Class', description: 'เรียนทำอาหารไทยด้วยกันแล้วนั่งกินฝีมือตัวเอง มีให้เลือกหลายแห่งย่านสีลมและสุขุมวิท', type: 'culinary' },
        { name: 'Jazz Bar at Bamboo Bar', description: 'ดนตรีแจ๊สสดในบรรยากาศเป็นกันเองที่โรงแรม Mandarin Oriental เป็นสถาบันคู่กรุงเทพฯ มาตั้งแต่ปี 1953', type: 'bar' },
        { name: 'Night Market Stroll at Jodd Fairs', description: 'บรรยากาศสบายๆ และคึกคัก ทั้งสตรีทฟู้ด เสื้อผ้าวินเทจ และดนตรีสด', type: 'market' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'คู่รักที่มองหาประสบการณ์เดตแบบไม่ซ้ำใคร',
      show_aqi_widget: false,
      comparison_table: [
        { feature: 'ได้ลงมือทำร่วมกัน', lengolf: 'ได้ เล่นด้วยกันทั้งคู่', alternative: 'ส่วนใหญ่เป็นการนั่งดูหรือนั่งกิน' },
        { feature: 'งบสำหรับสองคน', lengolf: 'เริ่มต้นประมาณ 550 บาท บวกค่าเครื่องดื่ม', alternative: '1,500-5,000 บาทขึ้นไป' },
        { feature: 'คุยกันได้สบาย', lengolf: 'เบย์ส่วนตัว บรรยากาศผ่อนคลาย', alternative: 'บางบาร์เปิดเพลงดัง' },
        { feature: 'ไม่ต้องมีประสบการณ์กอล์ฟ', lengolf: 'ไม่ต้อง ตรงนั้นแหละคือความสนุก', alternative: 'ไม่มีตัวเปรียบเทียบ' },
        { feature: 'กันฝนได้', lengolf: 'ได้ อยู่ในร่มทั้งหมด', alternative: 'รูฟท็อปได้รับผลกระทบเมื่อฝนตก' },
      ],
    },
  },

  // ─── JA: date-night-ideas-bangkok ───
  // Title/meta front-load バンコク デート rather than translating "Date Night
  // Ideas" literally. EN's 約550THB（2名）, 1,500〜5,000THB以上 and the "2026" framing
  // in the intro all carry across; "~" is rendered 約. The comparison row
  // alternative 'N/A' becomes 該当なし (display prose, not a machine value).
  // related_slugs unchanged — all three are in the ja allowlist.
  {
    id: 'act-2-ja',
    page_type: 'activity_occasion',
    slug: 'date-night-ideas-bangkok',
    title: 'バンコクのデートプラン — 食事だけで終わらない過ごし方',
    meta_description:
      'バンコクでのデートを計画中ですか。カクテル片手に楽しめるインドアゴルフから、ルーフトップバー、二人で通える料理教室まで、ディナーだけで終わらないデートプランをご紹介します。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'ja',
    related_slugs: ['/activities/things-to-do-bangkok-at-night', '/activities/golf-simulator-for-non-golfers', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'date-night',
      intro:
        'バンコクで印象に残るデートは、たいてい食事のその先にあります。この街には、Bravo Golfシミュレーターを備えたカクテルバーから、スカイラインを望むルーフトップダイニングまで、ほかにない体験が揃っています。2026年版として、バンコクでおすすめのデートプランをまとめました。',
      why_lengolf:
        'LENGOLFは、BTSチットロム駅直結のザ・マーキュリービルにある、落ち着いた大人の雰囲気のインドアゴルフシミュレーターバーです。二人で体を動かしながら楽しめて、どちらもゴルフ未経験でも問題ありません。ベイをシェアして（2名で1時間約550THB）、カクテルを頼み、バーチャルコースで競い合う。かしこまったディナーのような緊張感がないぶん、自然に会話が弾みます（2026年7月現在）。',
      other_activities: [
        { name: 'Rooftop Bar at Banyan Tree', description: 'バンヤンツリー最上階のルーフトップバー、Vertigo。61階から360度のスカイラインを見渡せ、特別な日にふさわしい一軒です。', type: 'bar' },
        { name: 'Dinner Cruise on the Chao Phraya', description: 'チャオプラヤー川を進みながらのディナー。ライトアップされたワット・アルンや王宮を船上から眺められます。', type: 'dining' },
        { name: 'Couples Cooking Class', description: '二人でタイ料理を習い、作った料理をその場でいただけます。シーロムとスクンビットに複数の教室があります。', type: 'culinary' },
        { name: 'Jazz Bar at Bamboo Bar', description: 'マンダリン オリエンタルの親密な空間で聴くライブジャズ。1953年から続くバンコクの名店です。', type: 'bar' },
        { name: 'Night Market Stroll at Jodd Fairs', description: '肩の力を抜いて歩ける、活気のあるナイトマーケット。屋台の食べ物、古着、ライブ音楽が楽しめます。', type: 'market' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'ほかにないデート体験を探しているカップル',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '体を動かす体験かどうか', lengolf: '該当 — 二人で一緒にプレー', alternative: 'ほぼ受け身（食事や眺めが中心）' },
        { feature: '2名あたりの予算', lengolf: '約550THBから（ドリンク代は別）', alternative: '1,500〜5,000THB以上' },
        { feature: '会話のしやすさ', lengolf: '専用ベイで落ち着いて過ごせる', alternative: '音楽が大きい店もある' },
        { feature: 'ゴルフ経験の要否', lengolf: '不要 — むしろそこが面白いところ', alternative: '該当なし' },
        { feature: '雨でも大丈夫か', lengolf: '完全屋内なので影響なし', alternative: 'ルーフトップは雨の影響を受ける' },
      ],
    },
  },

  // ─── KO: date-night-ideas-bangkok ───
  // Title/meta lead with 방콕 데이트 코스, the way a Korean reader searches, not
  // a literal "date night ideas". The EN "~550 THB/hour for two" is carried as
  // 시간당 약 550바트 with the 부터/약 hedges intact. No language claim is added
  // anywhere — the EN entry makes none. related_slugs all KO-translated.
  {
    id: 'act-2-ko',
    page_type: 'activity_occasion',
    slug: 'date-night-ideas-bangkok',
    title: '방콕 데이트 코스 — 색다른 데이트 아이디어',
    meta_description:
      '방콕 데이트, 저녁 식사 말고 뭐가 있을까요. 칵테일과 함께 치는 실내 골프부터 루프톱 바, 쿠킹 클래스까지 색다른 데이트 아이디어를 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'ko',
    related_slugs: ['/activities/things-to-do-bangkok-at-night', '/activities/golf-simulator-for-non-golfers', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'date-night',
      intro:
        '방콕에서 기억에 남는 데이트는 저녁 식사에서 끝나지 않아요. 칵테일 바에 Bravo 골프 시뮬레이터가 놓인 곳부터 스카이라인이 내려다보이는 루프톱 다이닝까지, 특별한 경험을 고르기 좋은 도시예요. 2026년 방콕에서 가장 기억에 남을 데이트 아이디어를 모았어요.',
      why_lengolf:
        'LENGOLF는 BTS 칫롬역 The Mercury Ville에서 실내 골프 시뮬레이터와 프리미엄 바를 한 공간에 담았어요. 조명이 차분하고 분위기가 있어서, 둘 다 골프를 쳐 본 적이 없어도 함께 움직이며 즐기는 데이트가 돼요. 베이 하나를 둘이 쓰면 시간당 약 550바트고, 칵테일을 주문해 가상 코스에서 겨뤄 볼 수 있어요 (2026년 7월 기준). 격식 있는 저녁 식사처럼 부담스럽지 않아서 편하게 이야기하고 웃기 좋아요.',
      other_activities: [
        { name: 'Banyan Tree 루프톱 바', description: '61층에서 360도로 펼쳐지는 스카이라인을 볼 수 있는 Vertigo 루프톱 바예요. 특별한 날에 잘 어울려요.', type: 'bar' },
        { name: '차오프라야강 디너 크루즈', description: '강을 따라 저녁을 즐기면서 밤에 조명이 켜진 왓아룬 사원과 왕궁을 바라볼 수 있어요.', type: 'dining' },
        { name: '커플 쿠킹 클래스', description: '둘이서 태국 요리를 배우고 직접 만든 음식을 함께 먹어요. Silom과 Sukhumvit에 여러 곳이 있어요.', type: 'culinary' },
        { name: 'Bamboo Bar 재즈 바', description: 'Mandarin Oriental 안의 아담한 공간에서 라이브 재즈를 들어요. 1953년부터 이어져 온 방콕의 명소예요.', type: 'bar' },
        { name: 'Jodd Fairs 야시장 산책', description: '길거리 음식과 빈티지 쇼핑, 라이브 음악이 어우러진 편안하고 활기찬 분위기예요.', type: 'market' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '색다른 데이트를 찾는 커플',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '함께 참여하는 활동', lengolf: '가능 — 둘이 같이 플레이', alternative: '대부분 보고 먹는 쪽 (식사, 전망)' },
        { feature: '2인 예산', lengolf: '약 550바트부터 + 음료', alternative: '1,500~5,000바트 이상' },
        { feature: '대화하기 좋은가', lengolf: '독립된 베이, 편안한 분위기', alternative: '음악이 큰 바도 있어요' },
        { feature: '골프 경험 필요 여부', lengolf: '없어도 돼요 — 그게 재미있는 부분이에요', alternative: '해당 없음' },
        { feature: '비가 와도 괜찮은가', lengolf: '괜찮아요 — 완전 실내', alternative: '루프톱은 비에 영향을 받아요' },
      ],
    },
  },

  // ─── ZH: date-night-ideas-bangkok ───
  // 曼谷约会去哪 front-loaded; the EN "for 2026" framing is kept as 2026年.
  // Figures trace to EN act-2 (两人约550泰铢, 1,500–5,000泰铢以上, Vertigo 61层,
  // Bamboo Bar自1953年); LENGOLF price carries 截至2026年7月. Chao Phraya /
  // Wat Arun / Grand Palace / Mandarin Oriental glossed with their established
  // Chinese names on first use; venue names in other_activities untouched.
  // The EN "N/A" alternative cells are display prose and render as 不适用.
  {
    id: 'act-2-zh',
    page_type: 'activity_occasion',
    slug: 'date-night-ideas-bangkok',
    title: '曼谷约会去哪好 — 不只吃饭的浪漫约会提案',
    meta_description:
      '在曼谷约会不想又是吃饭看电影。从能一起挥杆的室内高尔夫配鸡尾酒，到高空酒吧、湄南河游船与双人烹饪课，这里有几个更值得记住的约会点子。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'zh',
    related_slugs: ['/activities/things-to-do-bangkok-at-night', '/activities/golf-simulator-for-non-golfers', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'date-night',
      intro:
        '曼谷最好的约会通常不止于一顿晚餐。这座城市从不缺特别的体验——从配备Bravo高尔夫模拟器的鸡尾酒吧，到能俯瞰城市天际线的高空餐厅都有。以下是2026年曼谷最值得一试的约会点子。',
      why_lengolf:
        'LENGOLF把室内高尔夫模拟器和高品质吧台放在同一个空间里，位于Mercury Ville、BTS Chidlom旁，灯光和氛围偏沉稳精致。这是一场有互动、有意思又不落俗套的约会——哪怕你们两个都没打过高尔夫。两人合用一个球位（每小时约550泰铢，截至2026年7月），点两杯鸡尾酒，在虚拟球场上一决高下。氛围放松，聊天和笑场都很自然，没有正式晚餐那种拘束感。',
      other_activities: [
        { name: 'Rooftop Bar at Banyan Tree', description: 'Vertigo高空酒吧位于61层，能360度俯瞰城市天际线，适合特别的日子。', type: 'bar' },
        { name: 'Dinner Cruise on the Chao Phraya', description: '在湄南河上边航行边用餐，夜色中经过点亮的Wat Arun（郑王庙）与大皇宫。', type: 'dining' },
        { name: 'Couples Cooking Class', description: '两个人一起学做泰餐，再一起把成果吃掉。Silom和Sukhumvit一带有多家可选。', type: 'culinary' },
        { name: 'Jazz Bar at Bamboo Bar', description: '在Mandarin Oriental（文华东方酒店）小而私密的空间里听现场爵士，自1953年起就是曼谷的一块招牌。', type: 'bar' },
        { name: 'Night Market Stroll at Jodd Fairs', description: '气氛热闹随性，有街头小吃、二手好物和现场音乐。', type: 'market' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '想找特别约会体验的情侣',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '互动性与参与感', lengolf: '有——两个人一起打', alternative: '多为被动体验（用餐、看景）' },
        { feature: '两人预算', lengolf: '约550泰铢起，酒水另计', alternative: '1,500–5,000泰铢以上' },
        { feature: '方便聊天', lengolf: '独立球位，气氛轻松', alternative: '部分酒吧音乐偏吵' },
        { feature: '需要高尔夫经验吗', lengolf: '不需要——不会打才是乐趣所在', alternative: '不适用' },
        { feature: '不受下雨影响', lengolf: '是——完全在室内', alternative: '露台与高空酒吧受雨天影响' },
      ],
    },
  },
  {
    id: 'act-3',
    page_type: 'activity_occasion',
    slug: 'bachelor-party-ideas-bangkok',
    title: 'Bachelor Party Ideas Bangkok | Stag Do Activities',
    meta_description:
      'Planning a bachelor party in Bangkok? From golf simulator competitions to go-karts and rooftop bars — the best stag do ideas for groups.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'en',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'bachelor-party',
      intro:
        'Bangkok is one of the world\'s top bachelor party destinations. The best stag dos combine group activities with nightlife — and the city delivers both in spades. Here are the best bachelor party ideas in Bangkok that go beyond the obvious.',
      why_lengolf:
        'Start the night at LENGOLF with a group golf competition. Our bays fit up to 5 people each, and the Bravo golf simulators track every shot — perfect for friendly rivalries. With a full bar, cocktails, and craft beer on tap, it sets the tone for the rest of the night. Located at BTS Chidlom, you\'re minutes from Bangkok\'s best nightlife areas. Bay rental is ~550 THB/hour for up to 5 people.',
      other_activities: [
        { name: 'Go-Kart Bangkok (EasyKart)', description: 'Indoor karting at RCA. Competitive and adrenaline-filled, great for groups.', type: 'entertainment' },
        { name: 'Muay Thai Class', description: 'Group muay thai sessions available at multiple gyms. A unique Bangkok experience.', type: 'sport' },
        { name: 'Rooftop Bar Crawl', description: 'Hit Sukhumvit\'s rooftop bars — Octave, Cielo, and Above Eleven — with skyline views.', type: 'nightlife' },
        { name: 'River Cruise Party', description: 'Private boat charter on the Chao Phraya with drinks and food. Prices start from 15,000 THB for groups.', type: 'nightlife' },
        { name: 'Paintball / Laser Tag', description: 'Group combat games at various locations around Bangkok. Fun for competitive groups.', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'Groups planning bachelor parties and stag dos',
      show_aqi_widget: false,
      comparison_table: [
        { feature: 'Group size', lengolf: 'Up to 5 per bay (book multiple)', alternative: 'Varies — some cap at 10' },
        { feature: 'Drinks included', lengolf: 'Full bar on-site', alternative: 'Usually separate venue' },
        { feature: 'Competition element', lengolf: 'Shot tracking, leaderboards', alternative: 'Some (go-karts, paintball)' },
        { feature: 'Night-friendly', lengolf: 'Open until 11pm', alternative: 'Some close early' },
        { feature: 'Near nightlife', lengolf: 'BTS Chidlom — central', alternative: 'Varies by location' },
      ],
    },
  },

  // ─── TH: bachelor-party-ideas-bangkok ───
  // 'งานเลี้ยงสละโสด' is the settled Thai term for both bachelor party and
  // stag do, so the EN title's two-term split collapses to one in TH and the
  // tail carries the group angle instead. Figures: 550 บาท/ชม. สูงสุด 5 คน,
  // เรือเหมาเริ่ม 15,000 บาท, เปิดถึง 23:00 น. — all from the EN entry.
  {
    id: 'act-3-th',
    page_type: 'activity_occasion',
    slug: 'bachelor-party-ideas-bangkok',
    title: 'ไอเดียงานเลี้ยงสละโสดในกรุงเทพฯ | กิจกรรมสำหรับกลุ่มเพื่อน',
    meta_description:
      'วางแผนงานเลี้ยงสละโสดในกรุงเทพฯ อยู่ใช่ไหม ตั้งแต่แข่งกอล์ฟซิมูเลเตอร์ โกคาร์ต ไปจนถึงตระเวนรูฟท็อปบาร์ รวมไอเดียที่เหมาะกับกลุ่มใหญ่',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'th',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'bachelor-party',
      intro:
        'กรุงเทพฯ เป็นหนึ่งในจุดหมายยอดนิยมของงานเลี้ยงสละโสดจากทั่วโลก งานที่สนุกที่สุดมักผสมกิจกรรมกลุ่มเข้ากับไนต์ไลฟ์ และเมืองนี้มีให้ครบทั้งสองอย่าง นี่คือไอเดียงานเลี้ยงสละโสดในกรุงเทพฯ ที่ไปไกลกว่าตัวเลือกเดิมๆ',
      why_lengolf:
        'เริ่มค่ำคืนที่ LENGOLF ด้วยการแข่งกอล์ฟกันในกลุ่ม เบย์แต่ละห้องรองรับได้สูงสุด 5 คน และซิมูเลเตอร์ Bravo Golf บันทึกทุกช็อต จึงเหมาะกับการแข่งกันแบบเป็นกันเองระหว่างเพื่อน มีบาร์ครบวงจร ทั้งค็อกเทลและคราฟต์เบียร์สด ช่วยตั้งอารมณ์ให้กับค่ำคืนที่เหลือ ตั้งอยู่ที่ BTS ชิดลม จึงห่างจากย่านไนต์ไลฟ์ชั้นนำของกรุงเทพฯ เพียงไม่กี่นาที ค่าเช่าเบย์ประมาณ 550 บาท/ชั่วโมง สำหรับผู้เล่นสูงสุด 5 คน (ข้อมูล ณ กรกฎาคม 2026)',
      other_activities: [
        { name: 'Go-Kart Bangkok (EasyKart)', description: 'สนามโกคาร์ตในร่มที่ RCA ได้ทั้งการแข่งขันและความตื่นเต้น เหมาะกับกลุ่มใหญ่', type: 'entertainment' },
        { name: 'Muay Thai Class', description: 'คลาสมวยไทยแบบกลุ่มมีให้เลือกหลายค่าย เป็นประสบการณ์แบบกรุงเทพฯ ที่หาที่อื่นไม่ได้', type: 'sport' },
        { name: 'Rooftop Bar Crawl', description: 'ตระเวนรูฟท็อปบาร์ย่านสุขุมวิท ทั้ง Octave, Cielo และ Above Eleven พร้อมวิวเมือง', type: 'nightlife' },
        { name: 'River Cruise Party', description: 'เหมาเรือส่วนตัวล่องแม่น้ำเจ้าพระยา พร้อมเครื่องดื่มและอาหาร ราคาสำหรับกลุ่มเริ่มต้นที่ 15,000 บาท', type: 'nightlife' },
        { name: 'Paintball / Laser Tag', description: 'เกมยิงต่อสู้แบบทีมมีให้เล่นหลายจุดรอบกรุงเทพฯ สนุกสำหรับกลุ่มที่ชอบแข่งขัน', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'กลุ่มที่กำลังวางแผนงานเลี้ยงสละโสด',
      show_aqi_widget: false,
      comparison_table: [
        { feature: 'ขนาดกลุ่ม', lengolf: 'สูงสุด 5 คนต่อเบย์ (จองหลายเบย์ได้)', alternative: 'แล้วแต่ที่ บางแห่งจำกัดที่ 10 คน' },
        { feature: 'เครื่องดื่ม', lengolf: 'บาร์ครบวงจรในสถานที่', alternative: 'ปกติต้องย้ายไปอีกร้าน' },
        { feature: 'มีการแข่งขัน', lengolf: 'บันทึกช็อตและจัดอันดับคะแนน', alternative: 'มีบ้าง เช่น โกคาร์ตและเพนต์บอล' },
        { feature: 'เหมาะกับช่วงกลางคืน', lengolf: 'เปิดถึง 23:00 น.', alternative: 'บางแห่งปิดเร็ว' },
        { feature: 'ใกล้ย่านไนต์ไลฟ์', lengolf: 'BTS ชิดลม ใจกลางเมือง', alternative: 'แล้วแต่ทำเล' },
      ],
    },
  },

  // ─── JA: bachelor-party-ideas-bangkok ───
  // バチェラーパーティー is the JA search term for a stag do; "stag do" has no
  // separate JA query, so the title carries one head term instead of two.
  // Figures from EN: 最大5名/ベイ, 約550THB/時, 15,000THB from (river cruise),
  // 23時まで営業 (EN "until 11pm"). related_slugs unchanged — all in allowlist.
  {
    id: 'act-3-ja',
    page_type: 'activity_occasion',
    slug: 'bachelor-party-ideas-bangkok',
    title: 'バンコクのバチェラーパーティー — 大人数で楽しめる過ごし方',
    meta_description:
      'バンコクでバチェラーパーティーを計画中ですか。ゴルフシミュレーターでの対決からゴーカート、ルーフトップバーまで、グループで盛り上がれるおすすめのプランをご紹介します。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'ja',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'bachelor-party',
      intro:
        'バンコクは、世界でも有数のバチェラーパーティー向けの街です。盛り上がる会は、たいていグループで遊べるアクティビティとナイトライフを組み合わせたもの。この街はその両方を高い水準で備えています。ありきたりで終わらない、バンコクのバチェラーパーティーの過ごし方をまとめました。',
      why_lengolf:
        '夜の始まりは、LENGOLFでのグループ対抗ゴルフから。各ベイは最大5名まで入れて、Bravo Golfシミュレーターが1打ごとの結果を計測するので、仲間内の競争が自然に盛り上がります。フルバーにはカクテルと樽生のクラフトビールも。BTSチットロム駅にあるため、バンコク屈指のナイトスポットまで数分です。ベイのレンタルは最大5名まで1時間約550THB（2026年7月現在）。',
      other_activities: [
        { name: 'Go-Kart Bangkok (EasyKart)', description: 'RCAにある屋内カートコース。競争心をあおるスリルがあり、グループ向きです。', type: 'entertainment' },
        { name: 'Muay Thai Class', description: '複数のジムでグループ向けのムエタイ体験を受けられます。バンコクならではの体験です。', type: 'sport' },
        { name: 'Rooftop Bar Crawl', description: 'スクンビットのルーフトップバーをはしご。Octave、Cielo、Above Elevenなどからスカイラインを一望できます。', type: 'nightlife' },
        { name: 'River Cruise Party', description: 'チャオプラヤー川を貸切ボートで進むパーティー。ドリンクと食事付きで、グループ向けは15,000THBからが目安です。', type: 'nightlife' },
        { name: 'Paintball / Laser Tag', description: 'バンコク各所にあるグループ向けのサバイバルゲーム。競い合うのが好きなメンバーに向いています。', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'バチェラーパーティーを企画するグループ',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '人数', lengolf: '1ベイ最大5名（複数ベイの予約可）', alternative: 'まちまち。10名程度が上限の施設もあり' },
        { feature: 'ドリンク', lengolf: '館内にフルバーあり', alternative: '別の店に移動するのが一般的' },
        { feature: '対戦要素', lengolf: 'ショットの計測とリーダーボード', alternative: 'ゴーカートやペイントボールなど一部にあり' },
        { feature: '夜の利用', lengolf: '23時まで営業', alternative: '早く閉まる施設もあり' },
        { feature: 'ナイトスポットへの近さ', lengolf: 'BTSチットロム駅で中心部', alternative: '場所によって異なる' },
      ],
    },
  },

  // ─── KO: bachelor-party-ideas-bangkok ───
  // 총각 파티 is the settled KO term for a stag do; the title keeps it up front
  // with 단체 액티비티 as the descriptive tail. Figures carried: 최대 5명,
  // 시간당 약 550바트, 15,000바트(River Cruise Party), 밤 11시. The EN
  // "craft beer on tap" is kept as 수제 생맥주 — no product claim added.
  {
    id: 'act-3-ko',
    page_type: 'activity_occasion',
    slug: 'bachelor-party-ideas-bangkok',
    title: '방콕 총각 파티 아이디어 — 단체 액티비티와 나이트라이프',
    meta_description:
      '방콕에서 총각 파티를 준비한다면, 골프 시뮬레이터 대결부터 실내 카트, 루프톱 바까지 단체로 즐기기 좋은 아이디어를 모았어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'ko',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'bachelor-party',
      intro:
        '방콕은 세계에서 손꼽히는 총각 파티 목적지예요. 잘 짜인 총각 파티는 단체 액티비티와 나이트라이프를 함께 엮는데, 방콕은 두 가지 모두 넉넉해요. 뻔한 코스에서 한 발 더 나간 방콕 총각 파티 아이디어를 정리했어요.',
      why_lengolf:
        'LENGOLF에서 단체 골프 대결로 밤을 시작해 보세요. 베이 하나에 최대 5명까지 들어가고, Bravo 골프 시뮬레이터가 모든 샷을 기록해서 서로 겨루기 좋아요. 바에는 칵테일과 수제 생맥주가 준비돼 있어 분위기를 끌어올리기에 알맞아요. BTS 칫롬역에 있어서 방콕의 주요 나이트라이프 구역까지 금방 이동할 수 있어요. 베이 이용료는 최대 5명까지 시간당 약 550바트예요 (2026년 7월 기준).',
      other_activities: [
        { name: 'Go-Kart Bangkok (EasyKart)', description: 'RCA에 있는 실내 카트장이에요. 승부가 붙기 좋고 아드레날린이 확 올라와서 단체에 잘 맞아요.', type: 'entertainment' },
        { name: '무에타이 클래스', description: '여러 체육관에서 단체 무에타이 수업을 진행해요. 방콕에서만 할 수 있는 경험이에요.', type: 'sport' },
        { name: '루프톱 바 크롤', description: 'Octave, Cielo, Above Eleven 같은 Sukhumvit 루프톱 바를 돌며 스카이라인을 감상해요.', type: 'nightlife' },
        { name: '리버 크루즈 파티', description: '차오프라야강에서 음료와 음식을 갖춘 전용 보트를 빌려요. 단체 요금은 15,000바트부터 시작해요.', type: 'nightlife' },
        { name: '페인트볼 / 레이저 태그', description: '방콕 곳곳에서 단체 서바이벌 게임을 할 수 있어요. 승부욕 있는 그룹에 잘 맞아요.', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '총각 파티를 준비하는 그룹',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '인원', lengolf: '베이당 최대 5명 (여러 베이 예약 가능)', alternative: '제각각 — 10명까지만 받는 곳도 있어요' },
        { feature: '음료 해결', lengolf: '현장에 바 완비', alternative: '보통 다른 곳으로 이동' },
        { feature: '경쟁 요소', lengolf: '샷 기록과 순위표', alternative: '일부만 (카트, 페인트볼)' },
        { feature: '밤 시간대', lengolf: '밤 11시까지 영업', alternative: '일찍 닫는 곳도 있어요' },
        { feature: '나이트라이프 접근성', lengolf: 'BTS 칫롬역 — 도심 한복판', alternative: '위치에 따라 달라요' },
      ],
    },
  },

  // ─── ZH: bachelor-party-ideas-bangkok ───
  // Title uses 单身派对 (Mainland norm for a stag do; 告别单身派对 as the gloss in
  // the meta) rather than a literal rendering of "stag do". Figures trace to EN
  // act-3 (每个球位最多5人, 每小时约550泰铢, 包船15,000泰铢起, 营业至23:00);
  // LENGOLF price carries 截至2026年7月. Muay Thai rendered 泰拳 (standard, not a
  // coined name); RCA / Octave / Cielo / Above Eleven kept Latin.
  {
    id: 'act-3-zh',
    page_type: 'activity_occasion',
    slug: 'bachelor-party-ideas-bangkok',
    title: '曼谷单身派对怎么办 — 团体玩法与夜生活路线',
    meta_description:
      '在曼谷筹备单身派对（告别单身派对）该玩什么。从高尔夫模拟器比拼到卡丁车、泰拳、高空酒吧与包船派对，这里整理了适合一整群人的玩法。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'zh',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'bachelor-party',
      intro:
        '曼谷是全球最热门的单身派对目的地之一。一场好的单身派对，通常是团体活动加上夜生活的组合——而这两样这座城市都不缺。以下是曼谷单身派对里几个跳出老套路的选择。',
      why_lengolf:
        '这一晚可以从LENGOLF的团体高尔夫比拼开始。每个球位最多可容纳5人，Bravo高尔夫模拟器会记录每一杆的数据，很适合朋友之间互相较劲。现场有全套吧台、鸡尾酒和精酿生啤，正好为接下来的行程定下节奏。场馆就在BTS Chidlom，离曼谷几个主要夜生活区都只要几分钟。球位租用每小时约550泰铢，最多5人，截至2026年7月。',
      other_activities: [
        { name: 'Go-Kart Bangkok (EasyKart)', description: '位于RCA的室内卡丁车场，竞争感强、肾上腺素拉满，很适合一群人。', type: 'entertainment' },
        { name: 'Muay Thai Class', description: '多家拳馆都能安排团体泰拳课程，是很有曼谷特色的体验。', type: 'sport' },
        { name: 'Rooftop Bar Crawl', description: '把Sukhumvit一带的高空酒吧串起来喝一轮——Octave、Cielo和Above Eleven，都能看到城市天际线。', type: 'nightlife' },
        { name: 'River Cruise Party', description: '在湄南河上包一艘私人船，含酒水与餐食。团体价格15,000泰铢起。', type: 'nightlife' },
        { name: 'Paintball / Laser Tag', description: '曼谷多处都有彩弹与镭射对战场地，适合好胜心强的队伍。', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '正在筹办单身派对的团体',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '团体人数', lengolf: '每个球位最多5人（可订多个球位）', alternative: '各家不同——有些上限10人' },
        { feature: '含酒水', lengolf: '现场设有全套吧台', alternative: '通常要另外找场地' },
        { feature: '竞赛元素', lengolf: '击球数据追踪与排行榜', alternative: '部分有（卡丁车、彩弹）' },
        { feature: '适合晚上', lengolf: '营业至23:00', alternative: '有些打烊较早' },
        { feature: '靠近夜生活区', lengolf: 'BTS Chidlom——位置居中', alternative: '因地点而异' },
      ],
    },
  },
  {
    id: 'act-4',
    page_type: 'activity_occasion',
    slug: 'birthday-party-venues-bangkok',
    title: 'Birthday Party Venues in Bangkok | Unique Ideas for Adults',
    meta_description:
      'Birthday party venues in Bangkok compared: capacity, real package prices, and what each one includes. Indoor golf bar at BTS Chidlom hosts 10 to 25 guests from 9,999 THB.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'en',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/bachelor-party-ideas-bangkok', '/activities/private-party-venues-bangkok', '/events', '/menu'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'birthday-party',
      intro:
        'The best birthday party venues in Bangkok for adults pair a real activity with food and drinks, so the night keeps momentum instead of stalling over a long dinner. What you can actually book comes down to headcount: under 10 and almost any bar will take the reservation, 10 to 25 is where all-inclusive packages and exclusive hire start to matter, and past 30 you are into function rooms and full buyouts. LENGOLF sits in that middle band, with birthday packages from 9,999 THB covering simulator bays, catered food, drinks, and 3 hours at BTS Chidlom. This page covers what a birthday party costs, what the package includes, how to book it, and the other Bangkok venues worth comparing, with honest notes on capacity and vibe.',
      why_lengolf:
        'LENGOLF runs event packages built for birthdays. The Small Package (9,999 THB) covers 10–15 guests across 2 bays for 3 hours with 10 beers, 5 cocktails, unlimited soft drinks, and a catered food spread. The Medium Package (21,999 THB) steps up to 15–25 guests, all 4 bays, and an exclusive full-venue rental: the whole room is yours. Both centre on Bravo golf simulators that anyone can play, so the group has something to do together rather than just eat; games like closest to the pin keep non-golfers laughing. Food, drinks, decorations, music, and a DJ setup can be customised to the party, and for a bigger celebration the venue hosts 50+ guests on a custom package. It is inside The Mercury Ville at BTS Chidlom, so guests arrive straight off the BTS.',
      other_activities: [
        { name: 'Private Karaoke Room', description: 'KTV venues across Sukhumvit and Silom rent private rooms by the hour, where everyone joins in and the energy builds over the night. Best for groups that want music and drinks over an activity.', type: 'entertainment' },
        { name: 'Rooftop Private Dining', description: 'Rooftop restaurants and bars will reserve a private section for a birthday group, trading an activity for skyline views and photos. The open-air setting is weather-dependent in Bangkok.', type: 'dining' },
        { name: 'Cooking Class Party', description: 'Some cooking schools run private group sessions where the party cooks together then eats the result. Interactive and inclusive, with a relaxed pace that suits smaller birthdays.', type: 'culinary' },
        { name: 'Bowling Party at Blu-O', description: 'Private lane bookings with food and drinks service make bowling an easy, active birthday for casual groups. Located in major malls, so it is central and budget-friendly.', type: 'entertainment' },
        { name: 'Escape Room Group Booking', description: 'Booking several rooms lets a birthday group split into competing teams. Fun for puzzle-minded crowds, though the format is short and does not include food or drinks.', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'Individuals planning birthday parties for 10+ adults',
      show_aqi_widget: false,
      comparison_table: [
        { feature: 'All-inclusive package', lengolf: 'From ~9,999 THB (food, drinks, activity)', alternative: 'Usually food/venue separate' },
        { feature: 'Interactive activity', lengolf: 'Golf simulators for all levels', alternative: 'Karaoke, bowling, dining' },
        { feature: 'Capacity', lengolf: 'Up to 25 (full venue rental)', alternative: 'Varies: rooftops often 10-15' },
        { feature: 'Customizable', lengolf: 'Decorations, music, menu', alternative: 'Depends on venue' },
        { feature: 'Cost per person (15 guests)', lengolf: '~667 THB all-in (est.)', alternative: '1,000-3,000 THB' },
      ],
      sections: [
        {
          heading: 'Birthday Party Packages, Capacity and Cost',
          body: "A birthday party at LENGOLF is priced as a package, not a per-head cover charge, so the total is known before the night starts. Two standard packages cover most adult birthdays, and anything larger is quoted custom.\n\n| Package | Guests | Bays | Duration | Drinks included | Price |\n|---|---|---|---|---|---|\n| Small Package | 10 to 15 | 2 of 4 bays | 3 hours | 10 beers, 5 cocktails, unlimited soft drinks | 9,999 THB |\n| Medium Package | 15 to 25 | All 4 bays, exclusive venue | 3 hours | 20 beers, 10 cocktails, unlimited soft drinks | 21,999 THB |\n| Custom | 50+ | Full venue | Flexible | Quoted to the party | On request |\n\n**What that works out at per person.** The Small Package lands at roughly 667 THB a head across 15 guests, and the Medium Package at roughly 880 THB a head across 25 guests, with food, drinks, and three hours of golf all inside that number. Most Bangkok party venues bill the room, the catering, and the bar tab separately, so a like for like comparison usually ends up higher than it first looks.\n\n**Smaller birthdays do not need a package.** If the group is eight friends rather than eighteen, book bays on a normal reservation instead. Each simulator bay holds up to 5 players, so two bays cover a small birthday, and Play & Food group sets start from 240 THB NET per person if you want the food sorted at the same time.\n\n**Capacity in plain terms.** Four bays, five players per bay, plus bar and lounge seating. Fifteen to 25 guests is the comfortable range for the whole venue at once; 50 or more is possible on a custom package with a different flow through the space.",
        },
        {
          heading: 'What Is Included in a Birthday Party Booking',
          body: "**The bays.** Four Bravo golf simulators with club sets provided, so no guest has to bring anything. Five players fit in a bay, which is what makes a party of 20 workable: the group splits across bays and rotates rather than queueing behind one screen.\n\n**The food.** A catered spread from Smith & Co, served straight to the bay. The Small Package covers burgers, sliders, calamari, toast, crab or shrimp ebiko, crispy chicken, BBQ brisket, fries, and a salad. The Medium Package roughly doubles that and adds large pizzas.\n\n**The drinks.** Bottled beer and cocktails come with the package (10 and 5 on the Small, 20 and 10 on the Medium), unlimited soft drinks run throughout, and the full bar stays open for anything beyond the allocation.\n\n**The room.** The Medium Package is an exclusive full-venue rental: no other customers in the space for those three hours. Decorations, a sound system, and a DJ setup can be added on.\n\n**The staff.** Staff set up the simulators and run the games, so the person whose birthday it is (or the friend organising it) is not the one explaining the software to 20 people.",
        },
        {
          heading: 'Food and Drinks for a Birthday Party',
          body: "Food comes from Smith & Co and is served to the bay, so the party never has to relocate to a table. The package spreads are a starting point rather than a fixed menu: the events team will swap items for dietary requirements, vegetarian guests, or a theme.\n\nBeyond the package allocation the full bar is open for the whole booking: cocktails, Japanese highballs, bottled beer, wine by the glass or bottle, prosecco, and soft drinks. Unlimited soft drinks are included in both packages, which matters when part of the group is not drinking.\n\nOutside food and drinks are not permitted, so anything special for the birthday is arranged with the events team in advance rather than carried in. The full food and drinks menu is published with prices if you want to see what the kitchen and bar run day to day.",
        },
        {
          heading: 'Why an Indoor Golf Bar Suits a Birthday',
          body: "A birthday needs something for people to do. A long dinner pins everyone into fixed seats for two hours and the guest of honour only ever talks to four people; a normal bar leaves the group standing in a circle. A simulator bay does the opposite: people rotate, watch, heckle, sit down to eat, and get up again, and the room reshuffles itself all night.\n\n**No golf experience needed.** Closest to the pin and longest drive are the games that work for a mixed group, and the simulator does the scoring. First-timers usually enjoy it more than the golfers, because nobody expects them to be good.\n\n**Weather is irrelevant.** The venue is indoors and air-conditioned. Rooftop birthdays in Bangkok are a gamble from May to October, and a hot-season afternoon is its own problem.\n\n**It is genuinely central.** Inside The Mercury Ville at BTS Chidlom, so guests arrive on the BTS instead of sitting in traffic in a taxi. Open 9am to 11pm daily, which means an afternoon birthday works as well as an evening one.\n\n**One venue, not three.** Activity, food, and bar are in the same room, so there is no moving a group of 20 between a restaurant and a bar halfway through the night.",
        },
        {
          heading: 'How to Book a Birthday Party at LENGOLF',
          body: "**Groups of 10 or more.** Send the enquiry form on the event packages page, or message LINE @lengolf, with the date, the headcount, and roughly what you want to spend. The events team confirms availability, adjusts the package (food swaps, decorations, sound system, DJ), and holds the slot.\n\n**Groups under 10.** No events team needed. Book simulator bays directly at booking.len.golf and order food and drinks at the bay on the night.\n\n**What to have ready.** Date and start time, guest count (a range is fine), any dietary requirements, and whether you want the venue exclusively. Weekend evenings are the first slots to go, so the earlier the enquiry, the more choice of times.\n\n**Paying.** Packages are quoted as a total, so there is no splitting a bar tab at midnight. Anything ordered beyond the package is billed at menu prices at the end.",
        },
        {
          heading: 'How to Choose a Birthday Party Venue in Bangkok',
          body: "**Start with the headcount, not the venue.** Under 10 guests, most restaurants and bars will take a reservation and no package is needed. Between 10 and 25 is the awkward band where standard tables stop working and you want a group package. Over 30, you are looking at function rooms, event spaces, or a full buyout.\n\n**Decide whether you need the place to yourselves.** A private section of a busy bar is not the same as exclusive hire. If speeches, a playlist, or a cake moment matter, ask specifically whether the whole space is yours or whether other customers stay in the room.\n\n**Check what the quoted price actually covers.** Venue-only quotes tend to land cheap and then grow: catering, bar tab, service charge, and minimum spend get added later. An all-inclusive package that names the food and the drink count is easier to compare and harder to be surprised by.\n\n**Weigh activity against atmosphere.** Rooftops and private dining rooms deliver views and photos. Bowling, karaoke, and simulator bays deliver something for guests to do, which matters more when the group does not all know each other.\n\n**Check how guests get there.** A venue on the BTS or MRT gets everyone there on time. A venue that needs a taxi at 7pm on a Friday does not, and late arrivals kill the first hour of a party.",
        },
      ],
      faqs: [
        {
          question: 'How much does a birthday party cost in Bangkok at LENGOLF?',
          answer: 'Birthday event packages start at 9,999 THB for 10 to 15 guests, which covers 2 simulator bays for 3 hours, 10 beers, 5 cocktails, unlimited soft drinks, and a catered food spread. The Medium Package is 21,999 THB for 15 to 25 guests and adds all 4 bays plus exclusive use of the venue. Across a full group that is roughly 667 to 880 THB per person, all in.',
        },
        {
          question: 'How many guests can you host for a birthday party?',
          answer: 'The venue has 4 simulator bays holding up to 5 players each, plus bar and lounge seating. Standard packages cover 10 to 25 guests, and larger birthdays of 50 or more are quoted as a custom package.',
        },
        {
          question: 'Can we book the whole venue exclusively for a private party?',
          answer: 'Yes. The Medium Package (21,999 THB, 15 to 25 guests) is an exclusive full-venue rental for 3 hours, so no other customers are in the space. Custom buyouts for larger groups and longer durations are arranged through the events team.',
        },
        {
          question: 'Is food and drink included in the birthday package?',
          answer: 'Yes. Both packages include a catered spread from Smith & Co served to the bay, bottled beer, cocktails, and unlimited soft drinks. The full bar stays open for anything beyond the included allocation, billed at menu prices.',
        },
        {
          question: 'Can we customise the food and decorations?',
          answer: 'Food and drink selections can be fully customised for dietary requirements, vegetarian guests, or an event theme. Decorations, a sound system, and a DJ setup are available as add-ons. Outside food and drinks are not permitted, so anything special is arranged with the events team in advance.',
        },
        {
          question: 'Do birthday guests need golf experience?',
          answer: 'No. The simulators are built for beginners as much as golfers, clubs are provided, and staff set up games like closest to the pin and longest drive that anyone can play. Most first-timers enjoy it more than the golfers in the group.',
        },
        {
          question: 'How do I book a birthday party?',
          answer: 'For 10 guests or more, send the enquiry form on the event packages page or message LINE @lengolf with your date, headcount, and budget, and the events team will confirm availability and tailor the package. For smaller birthdays under 10 people, book simulator bays directly at booking.len.golf and order at the bay.',
        },
        {
          question: 'Where is the venue and what are the opening hours?',
          answer: 'LENGOLF is on Floor 4 of The Mercury Ville at BTS Chidlom, 540 Ploenchit Road, Pathumwan, Bangkok, directly connected to the BTS station. It is open 9am to 11pm daily, so afternoon and evening birthdays both work.',
        },
      ],
    },
  },

  // ─── TH: birthday-party-venues-bangkok ───
  // The largest entry: 6 sections + 8 FAQs. Package figures carried verbatim
  // (9,999 / 21,999 บาท, 10-15 และ 15-25 คน, 4 เบย์ × 5 คน, ~667 และ ~880 บาท/คน,
  // Play & Food เริ่ม 240 บาทสุทธิ/คน). EN en-dashes in 10–15 / 15–25 become the
  // TH range separator '-'. Package names (Small/Medium/Custom) and Smith & Co
  // stay Latin as product/brand names. As-of marker sits in section 1.
  {
    id: 'act-4-th',
    page_type: 'activity_occasion',
    slug: 'birthday-party-venues-bangkok',
    title: 'สถานที่จัดงานวันเกิดในกรุงเทพฯ | ไอเดียปาร์ตี้สำหรับผู้ใหญ่',
    meta_description:
      'เทียบสถานที่จัดงานวันเกิดในกรุงเทพฯ ทั้งจำนวนแขกที่รับได้ ราคาแพ็กเกจจริง และสิ่งที่รวมอยู่ในแต่ละที่ บาร์กอล์ฟในร่มที่ BTS ชิดลม รับ 10-25 คน เริ่มต้น 9,999 บาท',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'th',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/bachelor-party-ideas-bangkok', '/activities/private-party-venues-bangkok', '/events', '/menu'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'birthday-party',
      intro:
        'สถานที่จัดงานวันเกิดสำหรับผู้ใหญ่ที่ดีที่สุดในกรุงเทพฯ มักจับคู่กิจกรรมที่ได้ลงมือทำจริงเข้ากับอาหารและเครื่องดื่ม ค่ำคืนจึงเดินหน้าต่อได้เรื่อยๆ แทนที่จะหยุดนิ่งอยู่กับมื้อค่ำยาวๆ สิ่งที่จองได้จริงขึ้นอยู่กับจำนวนแขก ต่ำกว่า 10 คน บาร์แทบทุกแห่งรับจองให้ ช่วง 10-25 คนคือจุดที่แพ็กเกจรวมทุกอย่างและการเหมาพื้นที่เริ่มมีความหมาย และเกิน 30 คนขึ้นไปคุณกำลังเข้าสู่ห้องจัดเลี้ยงและการเหมาทั้งร้าน LENGOLF อยู่ในช่วงกลางนั้นพอดี โดยมีแพ็กเกจงานวันเกิดเริ่มต้น 9,999 บาท ครอบคลุมเบย์ซิมูเลเตอร์ อาหารจัดเลี้ยง เครื่องดื่ม และเวลา 3 ชั่วโมง ที่ BTS ชิดลม หน้านี้รวมเรื่องค่าใช้จ่ายของงานวันเกิด สิ่งที่รวมอยู่ในแพ็กเกจ วิธีจอง และสถานที่อื่นในกรุงเทพฯ ที่ควรนำมาเทียบ พร้อมข้อสังเกตตรงไปตรงมาเรื่องจำนวนแขกที่รับได้และบรรยากาศ',
      why_lengolf:
        'LENGOLF มีแพ็กเกจอีเวนต์ที่ออกแบบมาสำหรับงานวันเกิดโดยเฉพาะ Small Package (9,999 บาท) ครอบคลุมแขก 10-15 คน ใช้ 2 เบย์ เป็นเวลา 3 ชั่วโมง พร้อมเบียร์ 10 ขวด ค็อกเทล 5 แก้ว น้ำอัดลมไม่อั้น และอาหารจัดเลี้ยงชุดใหญ่ ส่วน Medium Package (21,999 บาท) ขยับขึ้นเป็นแขก 15-25 คน ได้ครบทั้ง 4 เบย์ และเหมาพื้นที่ทั้งหมดแบบส่วนตัว พื้นที่ทั้งร้านเป็นของคุณ ทั้งสองแพ็กเกจมีซิมูเลเตอร์ Bravo Golf เป็นแกนกลาง ซึ่งใครก็เล่นได้ กลุ่มจึงมีอะไรทำร่วมกันมากกว่าแค่นั่งกิน เกมอย่างตีเข้าใกล้ธงทำให้คนที่ไม่เล่นกอล์ฟหัวเราะกันได้ทั้งคืน อาหาร เครื่องดื่ม ของตกแต่ง เพลง และชุดดีเจปรับให้เข้ากับงานได้ และสำหรับงานฉลองที่ใหญ่กว่านั้น สถานที่รองรับแขก 50 คนขึ้นไปด้วยแพ็กเกจแบบกำหนดเอง ที่นี่อยู่ใน The Mercury Ville ที่ BTS ชิดลม แขกจึงเดินลงจาก BTS มาถึงงานได้เลย',
      other_activities: [
        { name: 'Private Karaoke Room', description: 'ห้องคาราโอเกะย่านสุขุมวิทและสีลมให้เช่าเป็นรายชั่วโมง ทุกคนได้ร่วมสนุกและบรรยากาศค่อยๆ คึกคักขึ้นตลอดคืน เหมาะที่สุดกับกลุ่มที่อยากได้ดนตรีและเครื่องดื่มมากกว่ากิจกรรม', type: 'entertainment' },
        { name: 'Rooftop Private Dining', description: 'ร้านอาหารและบาร์รูฟท็อปกันโซนส่วนตัวไว้ให้กลุ่มงานวันเกิดได้ โดยแลกกิจกรรมกับวิวเมืองและรูปถ่ายสวยๆ ทั้งนี้พื้นที่กลางแจ้งในกรุงเทพฯ ขึ้นอยู่กับสภาพอากาศ', type: 'dining' },
        { name: 'Cooking Class Party', description: 'โรงเรียนสอนทำอาหารบางแห่งจัดคลาสแบบกลุ่มส่วนตัว ให้ทุกคนทำอาหารด้วยกันแล้วนั่งกินผลงานของตัวเอง ได้ลงมือทำและทุกคนมีส่วนร่วม ในจังหวะสบายๆ ที่เหมาะกับงานวันเกิดกลุ่มเล็ก', type: 'culinary' },
        { name: 'Bowling Party at Blu-O', description: 'การจองเลนส่วนตัวพร้อมบริการอาหารและเครื่องดื่มทำให้โบว์ลิ่งเป็นงานวันเกิดที่ง่ายและได้ขยับตัว สำหรับกลุ่มที่อยากได้อะไรสบายๆ ตั้งอยู่ในห้างใหญ่ จึงอยู่ใจกลางเมืองและราคาไม่แรง', type: 'entertainment' },
        { name: 'Escape Room Group Booking', description: 'การจองหลายห้องพร้อมกันทำให้กลุ่มงานวันเกิดแบ่งเป็นทีมแข่งกันได้ สนุกสำหรับคนชอบไขปริศนา แม้รูปแบบจะใช้เวลาสั้นและไม่มีอาหารหรือเครื่องดื่มรวมอยู่ด้วย', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'คนที่กำลังวางแผนงานวันเกิดสำหรับผู้ใหญ่ตั้งแต่ 10 คนขึ้นไป',
      show_aqi_widget: false,
      comparison_table: [
        { feature: 'แพ็กเกจรวมทุกอย่าง', lengolf: 'เริ่มต้นประมาณ 9,999 บาท (อาหาร เครื่องดื่ม กิจกรรม)', alternative: 'ปกติคิดค่าอาหารและค่าสถานที่แยกกัน' },
        { feature: 'กิจกรรมที่ได้ลงมือทำ', lengolf: 'กอล์ฟซิมูเลเตอร์สำหรับทุกระดับ', alternative: 'คาราโอเกะ โบว์ลิ่ง หรือมื้ออาหาร' },
        { feature: 'จำนวนแขกที่รับได้', lengolf: 'สูงสุด 25 คน (เหมาทั้งร้าน)', alternative: 'แล้วแต่ที่ รูฟท็อปมักรับ 10-15 คน' },
        { feature: 'ปรับแต่งได้', lengolf: 'ของตกแต่ง เพลง เมนูอาหาร', alternative: 'ขึ้นอยู่กับสถานที่' },
        { feature: 'ค่าใช้จ่ายต่อคน (แขก 15 คน)', lengolf: 'ประมาณ 667 บาทรวมทุกอย่าง (ประมาณการ)', alternative: '1,000-3,000 บาท' },
      ],
      sections: [
        {
          heading: 'แพ็กเกจปาร์ตี้วันเกิด จำนวนแขก และค่าใช้จ่าย',
          body: 'ปาร์ตี้วันเกิดที่ LENGOLF คิดราคาเป็นแพ็กเกจ ไม่ใช่ค่าเข้าต่อหัว คุณจึงรู้ยอดรวมก่อนงานจะเริ่ม แพ็กเกจมาตรฐาน 2 แบบครอบคลุมงานวันเกิดของผู้ใหญ่ส่วนใหญ่ ส่วนงานที่ใหญ่กว่านั้นเสนอราคาเป็นรายกรณี\n\n| แพ็กเกจ | จำนวนแขก | เบย์ | ระยะเวลา | เครื่องดื่มที่รวม | ราคา |\n|---|---|---|---|---|---|\n| Small Package | 10-15 คน | 2 จาก 4 เบย์ | 3 ชั่วโมง | เบียร์ 10 ขวด ค็อกเทล 5 แก้ว น้ำอัดลมไม่อั้น | 9,999 บาท |\n| Medium Package | 15-25 คน | ครบ 4 เบย์ เหมาพื้นที่ทั้งหมด | 3 ชั่วโมง | เบียร์ 20 ขวด ค็อกเทล 10 แก้ว น้ำอัดลมไม่อั้น | 21,999 บาท |\n| Custom | 50 คนขึ้นไป | เหมาทั้งร้าน | ยืดหยุ่น | เสนอราคาตามงาน | สอบถาม |\n\n**คิดเป็นต่อคนแล้วเท่าไหร่** Small Package ตกราวคนละ 667 บาทเมื่อมาครบ 15 คน ส่วน Medium Package ตกราวคนละ 880 บาทเมื่อมาครบ 25 คน โดยมีทั้งอาหาร เครื่องดื่ม และเวลาเล่นกอล์ฟ 3 ชั่วโมงรวมอยู่ในตัวเลขนั้นแล้ว สถานที่จัดงานส่วนใหญ่ในกรุงเทพฯ คิดค่าห้อง ค่าอาหาร และบิลบาร์แยกกัน การเทียบแบบต่อแบบจึงมักจบที่ราคาสูงกว่าที่เห็นตอนแรก (ข้อมูล ณ กรกฎาคม 2026)\n\n**งานเล็กไม่จำเป็นต้องใช้แพ็กเกจ** ถ้ากลุ่มมีแค่ 8 คนไม่ใช่ 18 คน จองเบย์แบบปกติได้เลย แต่ละเบย์ซิมูเลเตอร์รองรับผู้เล่นได้สูงสุด 5 คน สองเบย์จึงพอสำหรับงานวันเกิดกลุ่มเล็ก และถ้าอยากให้เรื่องอาหารจบไปพร้อมกัน เซ็ต Play & Food สำหรับกลุ่มเริ่มต้นที่ 240 บาทสุทธิต่อคน\n\n**จำนวนที่รับได้แบบตรงไปตรงมา** มี 4 เบย์ เบย์ละ 5 คน บวกที่นั่งบริเวณบาร์และเลานจ์ ช่วง 15-25 คนคือจำนวนที่สบายที่สุดสำหรับการใช้พื้นที่ทั้งหมดพร้อมกัน ส่วน 50 คนขึ้นไปทำได้ด้วยแพ็กเกจแบบกำหนดเอง ซึ่งจะจัดการการไหลเวียนของแขกในพื้นที่ต่างออกไป',
        },
        {
          heading: 'สิ่งที่รวมอยู่ในการจองปาร์ตี้วันเกิด',
          body: '**เบย์** ซิมูเลเตอร์ Bravo Golf 4 เบย์ พร้อมชุดไม้กอล์ฟให้ใช้ แขกจึงไม่ต้องเตรียมอะไรมาเอง เบย์หนึ่งรองรับผู้เล่นได้ 5 คน ซึ่งเป็นเหตุผลที่งาน 20 คนจัดได้จริง กลุ่มจะกระจายกันไปตามเบย์และสลับกันเล่น แทนที่จะต้องต่อแถวรอหน้าจอเดียว\n\n**อาหาร** อาหารจัดเลี้ยงจาก Smith & Co เสิร์ฟถึงเบย์ Small Package มีเบอร์เกอร์ สไลเดอร์ ปลาหมึกทอด ขนมปังปิ้ง ปูหรือกุ้งเอบิโกะ ไก่ทอดกรอบ บริสเกตบาร์บีคิว เฟรนช์ฟรายส์ และสลัด ส่วน Medium Package เพิ่มปริมาณขึ้นราวเท่าตัวและเพิ่มพิซซ่าถาดใหญ่\n\n**เครื่องดื่ม** เบียร์ขวดและค็อกเทลรวมอยู่ในแพ็กเกจ (10 ขวดกับ 5 แก้วสำหรับ Small และ 20 ขวดกับ 10 แก้วสำหรับ Medium) น้ำอัดลมไม่อั้นตลอดงาน และบาร์เปิดให้สั่งเพิ่มได้ตลอดสำหรับส่วนที่เกินจากแพ็กเกจ\n\n**พื้นที่** Medium Package เป็นการเหมาทั้งร้านแบบส่วนตัว ไม่มีลูกค้ากลุ่มอื่นในพื้นที่ตลอด 3 ชั่วโมงนั้น ของตกแต่ง ระบบเสียง และชุดดีเจสั่งเพิ่มได้\n\n**ทีมงาน** ทีมงานเป็นคนตั้งค่าซิมูเลเตอร์และดำเนินเกมให้ เจ้าของวันเกิด (หรือเพื่อนที่รับหน้าที่จัดงาน) จึงไม่ต้องมาคอยอธิบายวิธีใช้โปรแกรมให้คน 20 คนฟัง',
        },
        {
          heading: 'อาหารและเครื่องดื่มสำหรับปาร์ตี้วันเกิด',
          body: 'อาหารมาจาก Smith & Co และเสิร์ฟถึงเบย์ กลุ่มจึงไม่ต้องย้ายไปนั่งโต๊ะที่อื่น รายการอาหารในแพ็กเกจเป็นจุดตั้งต้น ไม่ใช่เมนูตายตัว ทีมอีเวนต์เปลี่ยนรายการให้ได้ตามข้อจำกัดด้านอาหาร แขกที่ทานมังสวิรัติ หรือธีมของงาน\n\nนอกเหนือจากส่วนที่รวมในแพ็กเกจ บาร์เปิดตลอดการจอง ทั้งค็อกเทล ไฮบอลสไตล์ญี่ปุ่น เบียร์ขวด ไวน์แบบแก้วหรือขวด พรอเซกโก และน้ำอัดลม โดยน้ำอัดลมไม่อั้นรวมอยู่ในทั้งสองแพ็กเกจ ซึ่งเป็นเรื่องสำคัญเมื่อแขกบางส่วนไม่ดื่มแอลกอฮอล์\n\nไม่อนุญาตให้นำอาหารและเครื่องดื่มจากภายนอกเข้ามา สิ่งพิเศษสำหรับงานวันเกิดจึงต้องแจ้งทีมอีเวนต์ล่วงหน้าแทนการหิ้วเข้ามาเอง เมนูอาหารและเครื่องดื่มทั้งหมดมีประกาศราคาไว้ หากอยากดูว่าครัวและบาร์มีอะไรบ้างในวันปกติ',
        },
        {
          heading: 'ทำไมบาร์กอล์ฟในร่มถึงเหมาะกับงานวันเกิด',
          body: 'งานวันเกิดต้องมีอะไรให้คนทำ มื้อค่ำยาวๆ ตรึงทุกคนไว้กับที่นั่งเดิมสองชั่วโมง และเจ้าของวันเกิดก็ได้คุยกับคนแค่สี่คน ส่วนบาร์ธรรมดาก็ทำให้ทั้งกลุ่มยืนล้อมวงกันเฉยๆ เบย์ซิมูเลเตอร์ทำตรงกันข้าม คนหมุนเวียนกันเล่น ยืนดู เชียร์ นั่งลงกินข้าว แล้วลุกขึ้นใหม่ พื้นที่จึงสลับสับเปลี่ยนตัวเองไปตลอดทั้งคืน\n\n**ไม่ต้องมีประสบการณ์กอล์ฟ** เกมตีเข้าใกล้ธงและไดรฟ์ไกลคือเกมที่ใช้ได้กับกลุ่มที่มีทั้งคนเล่นเป็นและไม่เป็น และซิมูเลเตอร์คิดคะแนนให้เอง คนที่เล่นครั้งแรกมักสนุกกว่าคนที่เล่นกอล์ฟอยู่แล้ว เพราะไม่มีใครคาดหวังว่าเขาจะตีเก่ง\n\n**สภาพอากาศไม่เกี่ยว** สถานที่อยู่ในร่มและมีเครื่องปรับอากาศ งานวันเกิดบนรูฟท็อปในกรุงเทพฯ เป็นการเสี่ยงดวงในช่วงพฤษภาคมถึงตุลาคม ส่วนช่วงบ่ายหน้าร้อนก็มีปัญหาของมันเอง\n\n**อยู่ใจกลางเมืองจริงๆ** อยู่ใน The Mercury Ville ที่ BTS ชิดลม แขกจึงนั่ง BTS มาได้โดยไม่ต้องไปติดอยู่ในแท็กซี่ เปิดทุกวัน 9:00-23:00 น. งานวันเกิดช่วงบ่ายจึงจัดได้ดีพอๆ กับช่วงเย็น\n\n**จบในที่เดียว ไม่ต้องย้ายสามที่** กิจกรรม อาหาร และบาร์อยู่ในห้องเดียวกัน จึงไม่ต้องพากลุ่ม 20 คนย้ายจากร้านอาหารไปบาร์กลางคัน',
        },
        {
          heading: 'วิธีจองปาร์ตี้วันเกิดที่ LENGOLF',
          body: '**กลุ่ม 10 คนขึ้นไป** ส่งแบบฟอร์มสอบถามในหน้าแพ็กเกจอีเวนต์ หรือทักมาที่ LINE @lengolf พร้อมระบุวันที่ จำนวนแขก และงบประมาณคร่าวๆ ทีมอีเวนต์จะยืนยันคิวว่าง ปรับแพ็กเกจให้ (เปลี่ยนรายการอาหาร ของตกแต่ง ระบบเสียง ดีเจ) และกันเวลาไว้ให้\n\n**กลุ่มต่ำกว่า 10 คน** ไม่ต้องผ่านทีมอีเวนต์ จองเบย์ซิมูเลเตอร์ได้โดยตรงที่ booking.len.golf แล้วสั่งอาหารและเครื่องดื่มที่เบย์ในวันงาน\n\n**สิ่งที่ควรเตรียมไว้** วันที่และเวลาเริ่ม จำนวนแขก (บอกเป็นช่วงได้) ข้อจำกัดด้านอาหาร และต้องการเหมาพื้นที่ทั้งหมดหรือไม่ ช่วงเย็นวันสุดสัปดาห์เต็มเร็วที่สุด ยิ่งสอบถามเร็วเท่าไหร่ ยิ่งมีเวลาให้เลือกมากเท่านั้น\n\n**การชำระเงิน** แพ็กเกจเสนอราคาเป็นยอดรวม จึงไม่ต้องมานั่งหารบิลบาร์ตอนเที่ยงคืน ส่วนที่สั่งเพิ่มนอกแพ็กเกจคิดตามราคาเมนูตอนจบงาน',
        },
        {
          heading: 'วิธีเลือกสถานที่จัดงานวันเกิดในกรุงเทพฯ',
          body: '**เริ่มจากจำนวนแขก ไม่ใช่จากสถานที่** ต่ำกว่า 10 คน ร้านอาหารและบาร์ส่วนใหญ่รับจองโต๊ะให้อยู่แล้ว ไม่ต้องใช้แพ็กเกจ ช่วง 10-25 คนคือช่วงที่กลืนไม่เข้าคายไม่ออก โต๊ะปกติเริ่มไม่พอ และคุณจะเริ่มอยากได้แพ็กเกจสำหรับกลุ่ม เกิน 30 คนขึ้นไป คุณกำลังมองหาห้องจัดเลี้ยง พื้นที่อีเวนต์ หรือการเหมาทั้งร้าน\n\n**ตัดสินใจว่าต้องการพื้นที่เป็นของกลุ่มเองหรือไม่** การกันโซนหนึ่งในบาร์ที่คนแน่นไม่เหมือนกับการเหมาทั้งร้าน ถ้าการกล่าวอวยพร เพลย์ลิสต์ หรือช่วงเป่าเค้กเป็นเรื่องสำคัญ ให้ถามให้ชัดว่าได้พื้นที่ทั้งหมดหรือยังมีลูกค้าคนอื่นอยู่ในห้องด้วย\n\n**ดูให้ดีว่าราคาที่เสนอครอบคลุมอะไรบ้าง** ราคาที่คิดเฉพาะค่าสถานที่มักดูถูกตอนแรกแล้วค่อยๆ งอกขึ้น ทั้งค่าอาหาร บิลบาร์ ค่าบริการ และยอดใช้จ่ายขั้นต่ำจะตามมาทีหลัง แพ็กเกจรวมทุกอย่างที่ระบุรายการอาหารและจำนวนเครื่องดื่มไว้ชัดเจนเทียบง่ายกว่าและเซอร์ไพรส์น้อยกว่า\n\n**ชั่งน้ำหนักระหว่างกิจกรรมกับบรรยากาศ** รูฟท็อปและห้องอาหารส่วนตัวให้วิวและรูปถ่าย ส่วนโบว์ลิ่ง คาราโอเกะ และเบย์ซิมูเลเตอร์ให้สิ่งที่แขกได้ลงมือทำ ซึ่งสำคัญกว่าเมื่อแขกในงานไม่ได้รู้จักกันทั้งหมด\n\n**ดูว่าแขกเดินทางมาอย่างไร** สถานที่ที่อยู่ติด BTS หรือ MRT ทำให้ทุกคนมาถึงตรงเวลา ส่วนสถานที่ที่ต้องนั่งแท็กซี่ตอนหนึ่งทุ่มวันศุกร์ไม่เป็นแบบนั้น และแขกที่มาสายทำให้ชั่วโมงแรกของงานหายไปเลย',
        },
      ],
      faqs: [
        {
          question: 'จัดปาร์ตี้วันเกิดที่ LENGOLF ในกรุงเทพฯ ราคาเท่าไหร่',
          answer: 'แพ็กเกจงานวันเกิดเริ่มต้นที่ 9,999 บาท สำหรับแขก 10-15 คน ครอบคลุมเบย์ซิมูเลเตอร์ 2 เบย์ เป็นเวลา 3 ชั่วโมง เบียร์ 10 ขวด ค็อกเทล 5 แก้ว น้ำอัดลมไม่อั้น และอาหารจัดเลี้ยงชุดใหญ่ ส่วน Medium Package ราคา 21,999 บาท สำหรับแขก 15-25 คน เพิ่มเป็นครบ 4 เบย์ พร้อมเหมาพื้นที่ทั้งหมด เมื่อคิดเฉลี่ยทั้งกลุ่มจะตกราวคนละ 667-880 บาท รวมทุกอย่างแล้ว',
        },
        {
          question: 'รับจัดงานวันเกิดได้กี่คน',
          answer: 'สถานที่มีเบย์ซิมูเลเตอร์ 4 เบย์ รองรับเบย์ละไม่เกิน 5 คน บวกที่นั่งบริเวณบาร์และเลานจ์ แพ็กเกจมาตรฐานครอบคลุมแขก 10-25 คน ส่วนงานวันเกิดที่ใหญ่กว่านั้นตั้งแต่ 50 คนขึ้นไป เสนอราคาเป็นแพ็กเกจแบบกำหนดเอง',
        },
        {
          question: 'เหมาพื้นที่ทั้งหมดสำหรับปาร์ตี้ส่วนตัวได้ไหม',
          answer: 'ได้ Medium Package (21,999 บาท สำหรับแขก 15-25 คน) เป็นการเหมาพื้นที่ทั้งหมดแบบส่วนตัวเป็นเวลา 3 ชั่วโมง จึงไม่มีลูกค้ากลุ่มอื่นอยู่ในพื้นที่ ส่วนการเหมาสำหรับกลุ่มที่ใหญ่กว่านั้นหรือระยะเวลานานกว่านั้น จัดผ่านทีมอีเวนต์',
        },
        {
          question: 'อาหารและเครื่องดื่มรวมอยู่ในแพ็กเกจวันเกิดไหม',
          answer: 'รวมอยู่แล้ว ทั้งสองแพ็กเกจมีอาหารจัดเลี้ยงจาก Smith & Co เสิร์ฟถึงเบย์ พร้อมเบียร์ขวด ค็อกเทล และน้ำอัดลมไม่อั้น บาร์เปิดให้สั่งเพิ่มได้ตลอดสำหรับส่วนที่เกินจากที่รวมไว้ โดยคิดตามราคาเมนู',
        },
        {
          question: 'ปรับเมนูอาหารและของตกแต่งได้ไหม',
          answer: 'รายการอาหารและเครื่องดื่มปรับได้เต็มที่ตามข้อจำกัดด้านอาหาร แขกที่ทานมังสวิรัติ หรือธีมของงาน ส่วนของตกแต่ง ระบบเสียง และชุดดีเจมีให้สั่งเพิ่ม ทั้งนี้ไม่อนุญาตให้นำอาหารและเครื่องดื่มจากภายนอกเข้ามา สิ่งพิเศษสำหรับงานจึงต้องแจ้งทีมอีเวนต์ล่วงหน้า',
        },
        {
          question: 'แขกที่มางานวันเกิดต้องเล่นกอล์ฟเป็นไหม',
          answer: 'ไม่ต้อง ซิมูเลเตอร์ออกแบบมาสำหรับมือใหม่พอๆ กับนักกอล์ฟ มีไม้กอล์ฟให้ใช้ และทีมงานจะตั้งเกมอย่างตีเข้าใกล้ธงและไดรฟ์ไกลที่ใครก็เล่นได้ คนที่เล่นครั้งแรกส่วนใหญ่สนุกกว่าคนที่เล่นกอล์ฟเป็นอยู่แล้วในกลุ่มด้วยซ้ำ',
        },
        {
          question: 'จองปาร์ตี้วันเกิดอย่างไร',
          answer: 'สำหรับแขก 10 คนขึ้นไป ส่งแบบฟอร์มสอบถามในหน้าแพ็กเกจอีเวนต์ หรือทักมาที่ LINE @lengolf พร้อมระบุวันที่ จำนวนแขก และงบประมาณ ทีมอีเวนต์จะยืนยันคิวว่างและปรับแพ็กเกจให้เหมาะกับงาน ส่วนงานวันเกิดกลุ่มเล็กที่ต่ำกว่า 10 คน จองเบย์ซิมูเลเตอร์ได้โดยตรงที่ booking.len.golf แล้วสั่งอาหารและเครื่องดื่มที่เบย์ได้เลย',
        },
        {
          question: 'สถานที่อยู่ที่ไหน และเปิดกี่โมง',
          answer: 'LENGOLF อยู่ชั้น 4 ของ The Mercury Ville ที่ BTS ชิดลม เลขที่ 540 ถนนเพลินจิต เขตปทุมวัน กรุงเทพฯ เชื่อมต่อกับสถานี BTS โดยตรง เปิดทุกวัน 9:00-23:00 น. งานวันเกิดช่วงบ่ายและช่วงเย็นจึงจัดได้ทั้งคู่',
        },
      ],
    },
  },

  // ─── JA: birthday-party-venues-bangkok ───
  // The長編 entry: 6 sections + 8 FAQs. Package figures (9,999THB / 21,999THB,
  // 10〜15名 / 15〜25名, 2ベイ / 4ベイ, 3時間, ビール10・20杯, カクテル5・10杯,
  // 約667〜880THB/人, 240THB NET, 50名以上) all trace to the EN entry, as do the
  // Smith & Co menu items and the 9時〜23時 / 4階 / プルンチット通り540 address.
  // The section-1 markdown table keeps 6 columns so isMarkdownTableBlock still
  // fires. "NET" is left verbatim — it is a Thai pricing term, not prose.
  // related_slugs unchanged — /events and /menu are both in the ja allowlist.
  {
    id: 'act-4-ja',
    page_type: 'activity_occasion',
    slug: 'birthday-party-venues-bangkok',
    title: 'バンコクの誕生日パーティー会場 — 大人向けの貸切と料金',
    meta_description:
      'バンコクの誕生日パーティー会場を、収容人数・実際のパッケージ料金・含まれる内容で比較。BTSチットロム駅のインドアゴルフバーは10〜25名を9,999THBから受け入れています（2026年7月現在）。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'ja',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/bachelor-party-ideas-bangkok', '/activities/private-party-venues-bangkok', '/events', '/menu'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'birthday-party',
      intro:
        '大人の誕生日パーティーをバンコクで開くなら、食事とドリンクに加えて「やること」がある会場を選ぶと、長いディナーで場が止まらず最後まで流れが続きます。実際に押さえられる会場は、結局のところ人数で決まります。10名未満ならたいていのバーが予約を受けてくれますし、10〜25名になるとオールインクルーシブのパッケージや貸切が効いてきます。30名を超えると、バンケットルームや全館貸切の話になります。LENGOLFはちょうどその中間の帯にあり、誕生日パッケージは9,999THBから。シミュレーターベイ、ケータリングの料理、ドリンク、そしてBTSチットロム駅での3時間が含まれます。このページでは、誕生日パーティーの費用、パッケージの中身、予約の進め方、そして比較検討したいバンコクの他の会場を、収容人数と雰囲気の実情を添えてご紹介します。',
      why_lengolf:
        'LENGOLFには誕生日向けに組んだイベントパッケージがあります。Smallパッケージ（9,999THB）は10〜15名で2ベイを3時間、ビール10杯、カクテル5杯、ソフトドリンク飲み放題、ケータリングの料理付き。Mediumパッケージ（21,999THB）は15〜25名で4ベイすべてを使う全館貸切となり、フロア全体がグループだけの空間になります。どちらもどなたでもプレーできるBravo Golfシミュレーターが中心にあるので、食べるだけで終わらず、みんなで一緒に何かをする時間ができます。ニアピン対決のようなゲームなら、ゴルフをしない方ほど笑って盛り上がるはずです。料理、ドリンク、装飾、音楽、DJ機材はパーティーに合わせて調整でき、より大きなお祝いなら50名以上のカスタムパッケージにも対応します。会場はBTSチットロム駅のザ・マーキュリービル内にあり、ゲストはBTSを降りてそのまま来られます（2026年7月現在）。',
      other_activities: [
        { name: 'Private Karaoke Room', description: 'スクンビットやシーロムのKTVでは、個室を時間単位で借りられます。全員が参加でき、夜が進むほど熱量が上がるのが特徴。アクティビティよりも音楽とお酒で過ごしたいグループ向きです。', type: 'entertainment' },
        { name: 'Rooftop Private Dining', description: 'ルーフトップのレストランやバーは、誕生日のグループのために一角を確保してくれます。アクティビティの代わりに、スカイラインの眺めと写真が手に入る形です。屋外なので、バンコクでは天候に左右されます。', type: 'dining' },
        { name: 'Cooking Class Party', description: '料理学校のなかには、グループ貸切のクラスを開いているところもあります。みんなで作ってその場で食べる形式で、参加型かつ全員が加わりやすく、少人数の誕生日に合うゆったりしたペースです。', type: 'culinary' },
        { name: 'Bowling Party at Blu-O', description: 'レーンを貸し切って予約でき、食事とドリンクのサービスも受けられるので、気楽で体を動かせる誕生日になります。大型モール内にあり、立地も予算も手が届きやすいのが利点です。', type: 'entertainment' },
        { name: 'Escape Room Group Booking', description: '複数の部屋を押さえれば、誕生日のグループをチームに分けて対戦できます。謎解き好きの集まりには楽しい一方、所要時間は短く、飲食は含まれません。', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '大人10名以上の誕生日パーティーを企画する方',
      show_aqi_widget: false,
      comparison_table: [
        { feature: 'オールインクルーシブのパッケージ', lengolf: '約9,999THBから（料理・ドリンク・アクティビティ込み）', alternative: '料理と会場は別会計が一般的' },
        { feature: '参加型のアクティビティ', lengolf: 'レベルを問わず遊べるゴルフシミュレーター', alternative: 'カラオケ、ボウリング、食事など' },
        { feature: '収容人数', lengolf: '最大25名（全館貸切）', alternative: 'まちまち。ルーフトップは10〜15名程度が多い' },
        { feature: 'カスタマイズ', lengolf: '装飾、音楽、メニュー', alternative: '会場による' },
        { feature: '1人あたりの費用（15名の場合）', lengolf: '約667THB（概算、すべて込み）', alternative: '1,000〜3,000THB' },
      ],
      sections: [
        {
          heading: '誕生日パッケージの内容・人数・費用',
          body: 'LENGOLFの誕生日パーティーは、1人いくらのチャージではなくパッケージ料金です。始まる前に総額が分かります。大人の誕生日の多くは標準の2プランで足り、それより大きな会は個別のお見積もりになります。\n\n| パッケージ | 人数 | ベイ | 時間 | 含まれるドリンク | 料金 |\n|---|---|---|---|---|---|\n| Smallパッケージ | 10〜15名 | 4ベイ中2ベイ | 3時間 | ビール10杯、カクテル5杯、ソフトドリンク飲み放題 | 9,999THB |\n| Mediumパッケージ | 15〜25名 | 4ベイすべて、全館貸切 | 3時間 | ビール20杯、カクテル10杯、ソフトドリンク飲み放題 | 21,999THB |\n| カスタム | 50名以上 | 全館 | 相談に応じて | 内容に合わせてご提案 | 要問い合わせ |\n\n**1人あたりに直すと。** Smallパッケージは15名で割るとおよそ667THB、Mediumパッケージは25名で割るとおよそ880THB。料理もドリンクも3時間のゴルフも、この金額に収まっています。バンコクのパーティー会場の多くは会場費、ケータリング、バー代を別々に請求するため、条件をそろえて比べると最初の印象より高くつくのが普通です。\n\n**少人数の誕生日にパッケージは要りません。** 18名ではなく8名の集まりなら、通常の予約でベイだけを押さえるほうが向いています。シミュレーターベイは1つあたり最大5名までなので、2ベイあれば小さな誕生日には十分。食事もまとめて済ませたい場合は、Play & Foodのグループセットが1人240THB NETからあります。\n\n**収容人数を具体的に言うと。** ベイが4つ、1ベイに5名、これにバーとラウンジの席が加わります。会場全体を同時に使うなら15〜25名が無理のない範囲で、50名以上も、空間の使い方を変えたカスタムパッケージなら可能です。',
        },
        {
          heading: '誕生日パーティーの予約に含まれるもの',
          body: '**ベイ。** Bravo Golfシミュレーターが4台、クラブセットもご用意しているので、ゲストは手ぶらで来られます。1ベイに5名入れるため、20名規模でも成立します。1画面の後ろに全員が並ぶのではなく、グループがベイに分かれて交代していく形です。\n\n**料理。** Smith & Coのケータリングを、ベイまで直接お運びします。Smallパッケージはバーガー、スライダー、カラマリ、トースト、クラブまたはシュリンプのエビコ、クリスピーチキン、BBQブリスケット、フライドポテト、サラダ。Mediumパッケージはこれをおよそ倍にし、ラージピザが加わります。\n\n**ドリンク。** 瓶ビールとカクテルがパッケージに含まれ（Smallは10杯と5杯、Mediumは20杯と10杯）、ソフトドリンクは時間内飲み放題。含まれる分を超えたご注文にも、フルバーが最後まで開いています。\n\n**空間。** Mediumパッケージは全館貸切で、その3時間はほかのお客様が入りません。装飾、音響設備、DJ機材はオプションで追加できます。\n\n**スタッフ。** シミュレーターの設定とゲームの進行はスタッフが担当します。主役の方も、幹事の方も、20名にソフトの使い方を説明する係にはなりません。',
        },
        {
          heading: '誕生日パーティーの料理とドリンク',
          body: '料理はSmith & Coが手がけ、ベイまでお運びするので、パーティーの途中でテーブル席へ移動する必要はありません。パッケージの内容は出発点であって固定メニューではなく、食事制限やベジタリアンのゲスト、テーマに合わせて、イベント担当が品目を入れ替えます。\n\nパッケージの杯数を超えても、ご予約の間はフルバーが開いています。カクテル、ジャパニーズハイボール、瓶ビール、グラスまたはボトルのワイン、プロセッコ、ソフトドリンクまで。ソフトドリンクの飲み放題はどちらのパッケージにも含まれるので、お酒を飲まない方が混ざるときにも安心です。\n\n外部からの飲食物の持ち込みはお断りしています。誕生日ならではの特別な品は、当日持ち込むのではなく、事前にイベント担当とご相談ください。厨房とバーの通常のラインナップは、料金入りのフードとドリンクのメニューで公開しています。',
        },
        {
          heading: 'インドアゴルフバーが誕生日に向く理由',
          body: '誕生日には、みんなで何かをする時間が要ります。長いディナーは2時間ほど全員を席に固定してしまい、主役は結局4人としか話せません。ふつうのバーでは、グループが輪になって立ったままになりがちです。シミュレーターベイはその逆で、打つ人が交代し、それを見て、野次を飛ばし、座って食べ、また立ち上がる。夜のあいだ、部屋の並びが何度も組み替わります。\n\n**ゴルフの経験は要りません。** ニアピンとドラコンは、経験がまちまちなグループでも成立するゲームで、採点はシミュレーターがやってくれます。初めての方のほうが、たいていゴルファーより楽しんでいます。うまくて当たり前という目で見られないからです。\n\n**天気に左右されません。** 会場は屋内で冷房が効いています。バンコクのルーフトップは5月から10月にかけては賭けのようなものですし、暑季の昼間にも別の問題があります。\n\n**立地が本当に中心部です。** BTSチットロム駅のザ・マーキュリービル内なので、ゲストはタクシーで渋滞にはまらず、BTSで来られます。営業は毎日9時から23時まで。昼の誕生日会も、夜の誕生日会も成り立ちます。\n\n**会場は1か所で済みます。** アクティビティ、料理、バーが同じ部屋にあるため、20名を途中でレストランからバーへ移動させる必要がありません。',
        },
        {
          heading: 'LENGOLFで誕生日パーティーを予約する方法',
          body: '**10名以上のグループ。** イベントパッケージのページにある問い合わせフォーム、またはLINE @lengolfから、日程、人数、おおよそのご予算をお知らせください。イベント担当が空き状況を確認し、パッケージを調整したうえで（料理の入れ替え、装飾、音響設備、DJ）枠をお押さえします。\n\n**10名未満のグループ。** イベント担当を通す必要はありません。booking.len.golfからシミュレーターベイを直接ご予約いただき、当日ベイで料理とドリンクをご注文ください。\n\n**事前に決めておくこと。** 日付と開始時刻、人数（幅があっても構いません）、食事制限の有無、そして貸切にするかどうか。週末の夜から埋まっていくので、早めにご相談いただくほど時間帯の選択肢が広がります。\n\n**お支払い。** パッケージは総額でご案内するため、深夜にバーの伝票を割り勘する場面はありません。パッケージを超えたご注文は、最後にメニュー料金で精算します。',
        },
        {
          heading: 'バンコクで誕生日パーティー会場を選ぶには',
          body: '**会場より先に人数を決める。** 10名未満なら、たいていのレストランやバーが予約を受けてくれるので、パッケージは不要です。10〜25名は、通常のテーブル席では収まらず、かといって大箱でもないという中途半端な帯で、グループ向けパッケージが欲しくなるところ。30名を超えると、バンケットルーム、イベントスペース、全館貸切が視野に入ります。\n\n**貸切が必要かどうかを決める。** 混んだバーの一角を確保するのと、貸切とは別物です。スピーチ、プレイリスト、ケーキを出す瞬間が大事なら、空間全体が自分たちのものになるのか、それともほかのお客様が同じ部屋に残るのかを、はっきり確認しておきましょう。\n\n**提示された金額に何が含まれるかを確かめる。** 会場費だけの見積もりは安く見えて、あとからケータリング、バー代、サービス料、ミニマムチャージが積み上がりがちです。料理の内容とドリンクの杯数まで書かれたオールインクルーシブのパッケージのほうが、比較しやすく、想定外も起きにくくなります。\n\n**アクティビティと雰囲気を天秤にかける。** ルーフトップや個室のダイニングは、眺めと写真が魅力です。ボウリング、カラオケ、シミュレーターベイは、ゲストにやることを用意してくれます。全員が知り合いというわけではない集まりほど、後者が効いてきます。\n\n**ゲストの来やすさを見る。** BTSやMRT沿いの会場なら、全員が時間どおりに集まれます。金曜の19時にタクシーが必要な場所ではそうはいかず、遅れて来る人が出ると最初の1時間が潰れます。',
        },
      ],
      faqs: [
        {
          question: 'バンコクのLENGOLFで誕生日パーティーを開くといくらかかりますか',
          answer: '誕生日向けのイベントパッケージは、10〜15名で9,999THBから。シミュレーターベイ2つを3時間、ビール10杯、カクテル5杯、ソフトドリンク飲み放題、ケータリングの料理が含まれます。Mediumパッケージは15〜25名で21,999THB、4ベイすべてと会場の貸切が加わります。人数いっぱいで割ると、すべて込みで1人あたりおよそ667〜880THBです（2026年7月現在）。',
        },
        {
          question: '誕生日パーティーは何名まで対応できますか',
          answer: '会場にはシミュレーターベイが4つあり、1ベイあたり最大5名。これにバーとラウンジの席が加わります。標準パッケージは10〜25名が対象で、50名以上の大きな誕生日会はカスタムパッケージとして個別にお見積もりします。',
        },
        {
          question: '会場を貸切にしてプライベートなパーティーはできますか',
          answer: 'できます。Mediumパッケージ（21,999THB、15〜25名）は3時間の全館貸切で、その間ほかのお客様は入りません。より大人数や長時間の貸切は、イベント担当が個別に手配します。',
        },
        {
          question: '誕生日パッケージに料理とドリンクは含まれますか',
          answer: '含まれます。どちらのパッケージにも、Smith & Coのケータリングをベイまでお運びする料理と、瓶ビール、カクテル、ソフトドリンク飲み放題が付きます。含まれる分を超えたご注文にもフルバーが対応し、メニュー料金で精算します。',
        },
        {
          question: '料理や装飾はカスタマイズできますか',
          answer: '料理とドリンクの内容は、食事制限、ベジタリアンのゲスト、イベントのテーマに合わせて自由に変更できます。装飾、音響設備、DJ機材はオプションとしてご用意しています。外部からの飲食物の持ち込みはお断りしているため、特別な品は事前にイベント担当とご相談ください。',
        },
        {
          question: 'ゲストにゴルフの経験は必要ですか',
          answer: '必要ありません。シミュレーターはゴルファーだけでなく初心者にも合わせて作られており、クラブもご用意します。スタッフがニアピンやドラコンなど、どなたでも遊べるゲームを設定します。初めての方のほうが、グループのゴルファーより楽しんでいることがほとんどです。',
        },
        {
          question: '誕生日パーティーはどう予約すればよいですか',
          answer: '10名以上なら、イベントパッケージのページの問い合わせフォームか、LINE @lengolfから日程、人数、ご予算をお知らせください。イベント担当が空き状況を確認し、パッケージを調整します。10名未満の小さな誕生日会は、booking.len.golfからシミュレーターベイを直接ご予約いただき、当日ベイでご注文ください。',
        },
        {
          question: '場所と営業時間を教えてください',
          answer: 'LENGOLFは、バンコク・パトゥムワン区プルンチット通り540、BTSチットロム駅直結のザ・マーキュリービル4階にあります。営業は毎日9時から23時まで。昼の誕生日会も、夜の誕生日会も承ります。',
        },
      ],
    },
  },

  // ─── KO: birthday-party-venues-bangkok ───
  // The long entry: 6 sections + 8 FAQs, all carried. EN en-dashes in ranges
  // (10–15, 15–25) become the KO ASCII ~ form; every package figure (9,999 /
  // 21,999 / 667 / 880 / 240 NET / 50+) traces to the EN entry. The markdown
  // table keeps its column count and pipe shape so the all-pipe paragraph still
  // renders. 올인클루시브 written closed per glossary. Address, opening hours
  // and Exit 4 match the repo wayfinding (The Mercury Ville 4층, BTS 칫롬역).
  {
    id: 'act-4-ko',
    page_type: 'activity_occasion',
    slug: 'birthday-party-venues-bangkok',
    title: '방콕 생일 파티 장소 — 인원별 패키지 가격 비교',
    meta_description:
      '방콕 생일 파티 장소를 수용 인원과 실제 패키지 가격, 포함 내역으로 비교했어요. BTS 칫롬역 실내 골프 바는 10~25명을 9,999바트부터 받아요 (2026년 7월 기준).',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'ko',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/bachelor-party-ideas-bangkok', '/activities/private-party-venues-bangkok', '/events', '/menu'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'birthday-party',
      intro:
        '성인 생일 파티에 어울리는 방콕 장소는 제대로 된 활동과 음식, 음료가 한자리에 있어요. 긴 저녁 식사만 이어지면 흐름이 끊기지만, 할 거리가 있으면 밤 내내 분위기가 이어져요. 실제로 예약할 수 있는 선택지는 인원수가 갈라요. 10명 미만이면 웬만한 바에서 예약을 받아 주고, 10~25명부터 올인클루시브 패키지와 단독 대관이 의미를 갖기 시작하며, 30명을 넘어가면 연회장이나 전체 대관을 알아봐야 해요. LENGOLF는 그 중간 구간에 있는 곳으로, BTS 칫롬역에서 시뮬레이터 베이와 케이터링 음식, 음료, 3시간 이용을 묶은 생일 패키지를 9,999바트부터 운영해요. 이 페이지에서는 생일 파티 비용과 패키지 구성, 예약 방법, 그리고 함께 비교해 볼 만한 방콕의 다른 장소들을 수용 인원과 분위기까지 솔직하게 정리했어요.',
      why_lengolf:
        'LENGOLF에는 생일 파티에 맞춘 이벤트 패키지가 있어요. 스몰 패키지(9,999바트)는 10~15명이 베이 2개를 3시간 쓰면서 맥주 10병, 칵테일 5잔, 무제한 소프트드링크, 케이터링 음식 세팅까지 포함해요. 미디엄 패키지(21,999바트)는 15~25명으로 늘어나고 베이 4개 전부와 단독 대관이 붙어서 공간 전체를 쓰게 돼요. 두 패키지 모두 누구나 칠 수 있는 Bravo 골프 시뮬레이터를 중심에 두기 때문에, 먹기만 하는 모임이 아니라 다 같이 할 거리가 생겨요. 홀에 가장 가까이 붙이기 같은 게임은 골프를 안 치는 분들이 오히려 더 재미있어해요. 음식과 음료, 데코레이션, 음악, DJ 세팅은 파티에 맞춰 조정할 수 있고, 규모가 더 큰 자리라면 50명 이상도 커스텀 패키지로 받아요 (2026년 7월 기준). BTS 칫롬역 The Mercury Ville 안에 있어서 손님들이 BTS에서 내려 바로 올 수 있어요.',
      other_activities: [
        { name: '프라이빗 노래방', description: 'Sukhumvit과 Silom 일대의 KTV는 시간 단위로 룸을 빌려줘요. 다 같이 부르다 보면 밤이 갈수록 분위기가 올라가요. 액티비티보다 음악과 술을 원하는 그룹에 잘 맞아요.', type: 'entertainment' },
        { name: '루프톱 프라이빗 다이닝', description: '루프톱 레스토랑과 바에서는 생일 그룹을 위해 한 구역을 따로 잡아 줘요. 활동 대신 스카이라인 전망과 사진을 얻는 선택이에요. 다만 야외라서 방콕 날씨의 영향을 받아요.', type: 'dining' },
        { name: '쿠킹 클래스 파티', description: '일부 요리 학원은 단체 전용 수업을 열어 함께 요리하고 그 자리에서 먹어요. 참여도가 높고 다 같이 어울리기 좋으며, 진행이 여유로워 소규모 생일에 잘 맞아요.', type: 'culinary' },
        { name: 'Blu-O 볼링 파티', description: '레인을 통째로 예약하고 음식과 음료 서비스를 받으면 편하게 움직이는 생일 자리가 돼요. 주요 쇼핑몰 안에 있어서 접근성이 좋고 예산 부담도 적어요.', type: 'entertainment' },
        { name: '방탈출 단체 예약', description: '방을 여러 개 잡으면 생일 그룹을 팀으로 나눠 겨룰 수 있어요. 퍼즐을 좋아하는 무리에게 재미있지만, 진행 시간이 짧고 음식이나 음료는 포함되지 않아요.', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '성인 10명 이상 생일 파티를 준비하는 분',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '올인클루시브 패키지', lengolf: '약 9,999바트부터 (음식·음료·활동 포함)', alternative: '보통 음식과 공간이 별도 청구' },
        { feature: '함께하는 활동', lengolf: '수준 상관없이 즐기는 골프 시뮬레이터', alternative: '노래방, 볼링, 식사' },
        { feature: '수용 인원', lengolf: '최대 25명 (단독 대관)', alternative: '제각각 — 루프톱은 보통 10~15명' },
        { feature: '커스터마이즈', lengolf: '데코레이션, 음악, 메뉴', alternative: '장소에 따라 달라요' },
        { feature: '1인당 비용 (15명)', lengolf: '올인 약 667바트 (추정)', alternative: '1,000~3,000바트' },
      ],
      sections: [
        {
          heading: '생일 파티 패키지, 수용 인원, 비용',
          body: 'LENGOLF의 생일 파티는 인원당 커버차지가 아니라 패키지 총액으로 계산해요. 그래서 시작 전에 총 비용을 알 수 있어요. 성인 생일 대부분은 표준 패키지 두 가지로 해결되고, 그보다 큰 자리는 별도 견적을 내요.\n\n| 패키지 | 인원 | 베이 | 이용 시간 | 포함 음료 | 가격 |\n|---|---|---|---|---|---|\n| 스몰 패키지 | 10~15명 | 4개 중 2개 | 3시간 | 맥주 10병, 칵테일 5잔, 무제한 소프트드링크 | 9,999바트 |\n| 미디엄 패키지 | 15~25명 | 4개 전부, 단독 대관 | 3시간 | 맥주 20병, 칵테일 10잔, 무제한 소프트드링크 | 21,999바트 |\n| 커스텀 | 50명 이상 | 전체 대관 | 협의 | 파티에 맞춰 견적 | 문의 |\n\n**1인당으로 따져 보면.** 스몰 패키지는 15명이 나눠 낼 때 1인당 약 667바트, 미디엄 패키지는 25명이 나눠 낼 때 1인당 약 880바트예요. 음식과 음료, 3시간의 골프가 모두 그 안에 들어 있어요. 방콕의 파티 장소는 대부분 공간 사용료와 케이터링, 바 계산서를 따로 청구하기 때문에, 같은 조건으로 맞춰 비교하면 처음 보이던 금액보다 올라가는 경우가 많아요.\n\n**소규모 생일에는 패키지가 필요 없어요.** 열여덟 명이 아니라 여덟 명 정도의 모임이라면 패키지 대신 일반 예약으로 베이만 잡으면 돼요. 시뮬레이터 베이 하나에 최대 5명까지 들어가니 베이 2개면 작은 생일 모임은 충분하고, 음식까지 한 번에 해결하고 싶다면 Play & Food 단체 세트가 1인당 240바트 NET부터 있어요.\n\n**수용 인원을 쉽게 말하면.** 베이 4개에 베이당 5명, 여기에 바와 라운지 좌석이 더해져요. 한 번에 공간 전체를 쓸 때 편안한 규모는 15~25명이고, 50명 이상은 동선을 다르게 짜는 커스텀 패키지로 가능해요.',
        },
        {
          heading: '생일 파티 예약에 포함되는 것',
          body: '**베이.** Bravo 골프 시뮬레이터 4대에 클럽 세트가 함께 제공돼서 손님이 따로 챙겨 올 게 없어요. 베이 하나에 5명이 들어가는데, 20명 파티가 굴러가는 이유가 여기 있어요. 화면 하나 뒤에 줄을 서는 대신 여러 베이로 나뉘어 돌아가며 치거든요.\n\n**음식.** Smith & Co에서 케이터링한 음식을 베이까지 가져다줘요. 스몰 패키지에는 버거, 슬라이더, 칼라마리, 토스트, 크랩 또는 새우 에비코, 크리스피 치킨, BBQ 브리스킷, 감자튀김, 샐러드가 들어가요. 미디엄 패키지는 그 구성을 대략 두 배로 늘리고 라지 피자가 추가돼요.\n\n**음료.** 병맥주와 칵테일이 패키지에 포함되고(스몰은 10병과 5잔, 미디엄은 20병과 10잔), 소프트드링크는 내내 무제한이며, 포함량을 넘어서는 주문은 바에서 계속 받아요.\n\n**공간.** 미디엄 패키지는 단독 대관이라 그 3시간 동안 다른 손님이 들어오지 않아요. 데코레이션과 사운드 시스템, DJ 세팅은 추가로 붙일 수 있어요.\n\n**스태프.** 시뮬레이터 세팅과 게임 진행을 스태프가 맡아요. 생일 주인공이나 자리를 준비한 친구가 스무 명에게 조작법을 설명하고 있을 일은 없어요.',
        },
        {
          heading: '생일 파티 음식과 음료',
          body: '음식은 Smith & Co에서 만들어 베이로 바로 가져다주기 때문에, 파티 중간에 테이블로 자리를 옮길 일이 없어요. 패키지 구성은 고정 메뉴가 아니라 출발점이에요. 식단 제한이나 채식 손님, 파티 테마에 맞춰 이벤트 팀이 항목을 바꿔 줘요.\n\n패키지에 포함된 양을 넘어서도 예약 시간 내내 바는 열려 있어요. 칵테일, 재패니즈 하이볼, 병맥주, 잔이나 병으로 주문하는 와인, 프로세코, 소프트드링크까지 있어요. 소프트드링크는 두 패키지 모두 무제한이라, 술을 마시지 않는 분이 섞여 있을 때 특히 도움이 돼요.\n\n외부 음식과 음료는 반입할 수 없어서, 생일을 위한 특별한 준비물이 있다면 들고 오는 대신 이벤트 팀과 미리 상의하시면 돼요. 주방과 바가 평소에 어떤 메뉴를 내는지 궁금하다면 가격이 표기된 전체 음식·음료 메뉴를 확인할 수 있어요.',
        },
        {
          heading: '실내 골프 바가 생일 모임에 맞는 이유',
          body: '생일 모임에는 사람들이 할 게 있어야 해요. 긴 저녁 식사는 두 시간 동안 모두를 자리에 붙잡아 두고, 주인공은 결국 옆자리 네 명하고만 이야기하게 돼요. 평범한 바에서는 다 같이 서서 원을 그리고 있게 되고요. 시뮬레이터 베이는 반대예요. 돌아가며 치고, 구경하고, 놀리고, 앉아서 먹다가 다시 일어나면서 자리가 밤새 계속 섞여요.\n\n**골프를 안 쳐도 돼요.** 홀에 가장 가까이 붙이기와 최장 비거리는 섞여 있는 그룹에서 잘 굴러가는 게임이고, 점수는 시뮬레이터가 알아서 매겨요. 처음 쳐 보는 분들이 오히려 골퍼보다 더 즐거워하는데, 잘할 거라고 아무도 기대하지 않기 때문이에요.\n\n**날씨와 상관없어요.** 실내에 에어컨이 나와요. 방콕에서 5월부터 10월 사이의 루프톱 생일은 도박에 가깝고, 더운 시즌의 한낮도 나름의 문제가 있어요.\n\n**위치가 정말 중심이에요.** BTS 칫롬역 The Mercury Ville 안에 있어서, 택시로 막히는 길을 뚫는 대신 BTS를 타고 오면 돼요. 매일 오전 9시부터 밤 11시까지 열어서 낮 생일 모임도 저녁만큼 잘 굴러가요.\n\n**한 곳에서 다 끝나요.** 활동과 음식, 바가 같은 공간에 있어서 스무 명을 데리고 중간에 식당에서 바로 옮겨 다닐 필요가 없어요.',
        },
        {
          heading: 'LENGOLF 생일 파티 예약 방법',
          body: '**10명 이상이라면.** 이벤트 패키지 페이지의 문의 양식을 보내거나 LINE @lengolf로 날짜, 인원, 대략적인 예산을 알려 주세요. 이벤트 팀이 가능 여부를 확인하고 음식 변경, 데코레이션, 사운드 시스템, DJ 같은 부분을 조정한 뒤 시간을 잡아 둬요.\n\n**10명 미만이라면.** 이벤트 팀을 거칠 필요가 없어요. booking.len.golf에서 시뮬레이터 베이를 직접 예약하고, 당일 베이에서 음식과 음료를 주문하시면 돼요.\n\n**미리 준비해 두면 좋은 것.** 날짜와 시작 시간, 인원(대략적인 범위도 괜찮아요), 식단 제한 사항, 그리고 단독 대관을 원하는지 여부예요. 주말 저녁이 가장 먼저 차기 때문에 문의가 이를수록 고를 수 있는 시간대가 많아요.\n\n**결제.** 패키지는 총액으로 안내되기 때문에 자정에 바 계산서를 나누는 일이 없어요. 패키지를 넘어선 주문은 마지막에 메뉴 가격으로 정산돼요.',
        },
        {
          heading: '방콕에서 생일 파티 장소 고르는 법',
          body: '**장소보다 인원부터 정하세요.** 10명 미만이면 대부분의 레스토랑과 바가 예약을 받아 주고 패키지도 필요 없어요. 10~25명은 일반 테이블로는 감당이 안 되기 시작하는 애매한 구간이라 단체 패키지가 필요해요. 30명을 넘으면 연회장이나 이벤트 공간, 전체 대관을 봐야 해요.\n\n**공간을 통째로 써야 하는지 판단하세요.** 붐비는 바의 한쪽 구역을 잡는 것과 단독 대관은 달라요. 축사나 플레이리스트, 케이크 세리머니가 중요하다면 공간 전체가 우리 것인지, 다른 손님이 함께 있는지 정확히 물어보세요.\n\n**견적에 실제로 무엇이 포함되는지 확인하세요.** 공간 사용료만 뽑은 견적은 처음엔 싸 보이지만 케이터링, 바 계산서, 서비스 차지, 최소 주문 금액이 뒤에 붙으면서 불어나요. 음식과 음료 수량이 명시된 올인클루시브 패키지가 비교하기 쉽고 나중에 놀랄 일도 적어요.\n\n**활동과 분위기 중 무엇이 중요한지 저울질하세요.** 루프톱과 프라이빗 다이닝 룸은 전망과 사진을 줘요. 볼링, 노래방, 시뮬레이터 베이는 손님들에게 할 거리를 주는데, 서로 다 아는 사이가 아닐수록 이쪽이 더 중요해져요.\n\n**손님들이 어떻게 오는지 확인하세요.** BTS나 MRT 옆에 있는 장소는 모두를 제시간에 도착시켜요. 금요일 저녁 7시에 택시를 타야 하는 장소는 그렇지 않고, 늦게 도착한 사람들 때문에 파티의 첫 한 시간이 날아가요.',
        },
      ],
      faqs: [
        {
          question: 'LENGOLF에서 생일 파티를 하면 비용이 얼마인가요?',
          answer: '생일 이벤트 패키지는 10~15명에 9,999바트부터 시작해요. 시뮬레이터 베이 2개를 3시간 쓰고 맥주 10병, 칵테일 5잔, 무제한 소프트드링크, 케이터링 음식 세팅이 포함돼요. 미디엄 패키지는 15~25명에 21,999바트로, 베이 4개 전부와 단독 대관이 더해져요. 인원을 다 채우면 1인당 약 667~880바트 정도예요 (2026년 7월 기준).',
        },
        {
          question: '생일 파티는 몇 명까지 가능한가요?',
          answer: '시뮬레이터 베이 4개에 베이당 최대 5명이 들어가고, 여기에 바와 라운지 좌석이 있어요. 표준 패키지는 10~25명을 받고, 50명 이상의 큰 생일 모임은 커스텀 패키지로 견적을 내요.',
        },
        {
          question: '단독 대관으로 공간 전체를 빌릴 수 있나요?',
          answer: '가능해요. 미디엄 패키지(21,999바트, 15~25명)는 3시간 동안 공간 전체를 쓰는 단독 대관이라 다른 손님이 들어오지 않아요. 더 큰 그룹이나 더 긴 시간의 대관은 이벤트 팀을 통해 따로 조율해요.',
        },
        {
          question: '생일 패키지에 음식과 음료가 포함되나요?',
          answer: '포함돼요. 두 패키지 모두 Smith & Co에서 케이터링해 베이로 가져다주는 음식과 병맥주, 칵테일, 무제한 소프트드링크가 들어가요. 포함량을 넘어서는 주문은 바에서 계속 받고, 메뉴 가격으로 정산돼요.',
        },
        {
          question: '음식과 데코레이션을 원하는 대로 바꿀 수 있나요?',
          answer: '음식과 음료 구성은 식단 제한, 채식 손님, 이벤트 테마에 맞춰 전부 조정할 수 있어요. 데코레이션과 사운드 시스템, DJ 세팅은 추가 옵션으로 준비돼 있어요. 외부 음식과 음료는 반입할 수 없어서, 특별한 준비가 있다면 이벤트 팀과 미리 상의해 주세요.',
        },
        {
          question: '생일 파티 손님들이 골프를 칠 줄 알아야 하나요?',
          answer: '아니요. 시뮬레이터는 골퍼만큼이나 초보자를 염두에 두고 만들어졌고, 클럽도 제공돼요. 스태프가 홀에 가장 가까이 붙이기나 최장 비거리처럼 누구나 할 수 있는 게임을 세팅해 줘요. 처음 쳐 보는 분들이 그룹 안의 골퍼보다 더 즐거워하는 경우가 많아요.',
        },
        {
          question: '생일 파티는 어떻게 예약하나요?',
          answer: '10명 이상이라면 이벤트 패키지 페이지의 문의 양식을 보내거나 LINE @lengolf로 날짜, 인원, 예산을 알려 주세요. 이벤트 팀이 가능 여부를 확인하고 패키지를 맞춰 드려요. 10명 미만의 작은 생일이라면 booking.len.golf에서 시뮬레이터 베이를 직접 예약하고 당일 베이에서 주문하시면 돼요.',
        },
        {
          question: '위치와 영업시간이 어떻게 되나요?',
          answer: 'LENGOLF는 방콕 Pathumwan, 540 Ploenchit Road에 있는 The Mercury Ville 4층에 있고, BTS 칫롬역과 바로 연결돼 있어요. 매일 오전 9시부터 밤 11시까지 영업해서 낮 생일도 저녁 생일도 모두 가능해요.',
        },
      ],
    },
  },

  // ─── ZH: birthday-party-venues-bangkok ───
  // The long one. Every figure traces to EN act-4: 9,999／21,999泰铢两档套餐及其
  // 全部内容（10–15／15–25人, 2／4个球位, 3小时, 10+5／20+10杯酒水）, 人均约667／
  // 约880泰铢, 50人以上定制, 4个球位×每位5人, Play & Food人均240泰铢NET起,
  // Floor 4 The Mercury Ville / 540 Ploenchit Road / Pathumwan, 9:00–23:00.
  // Markdown table pipes preserved. booking.len.golf and LINE @lengolf kept
  // verbatim (booking.len.golf is the only FAQ auto-link key that survives
  // translation — the others are English-phrase-keyed; flagged in the report).
  {
    id: 'act-4-zh',
    page_type: 'activity_occasion',
    slug: 'birthday-party-venues-bangkok',
    title: '曼谷生日派对场地推荐 — 人数、套餐价格与包场对比',
    meta_description:
      '曼谷生日派对场地怎么选：可容纳人数、真实套餐价格与各家包含的内容一次看清。BTS Chidlom的室内高尔夫酒吧可接待10–25人，套餐9,999泰铢起。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'zh',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/bachelor-party-ideas-bangkok', '/activities/private-party-venues-bangkok', '/events', '/menu'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'birthday-party',
      intro:
        '曼谷适合成年人的生日派对场地，最好的那一类都会把一项真正的活动和餐饮放在一起，让整晚保持节奏，而不是卡在一顿漫长的晚餐上。真正能订到什么，取决于人数：10人以内几乎任何一家酒吧都能接受订位；10到25人是全包套餐和包场开始变得重要的区间；超过30人就要考虑宴会厅和整场买断了。LENGOLF正处在中间这一段，生日套餐9,999泰铢起，包含模拟器球位、餐饮、酒水和BTS Chidlom场馆的3小时使用时间。这一页会讲清楚一场生日派对要花多少钱、套餐包含什么、怎么预订，以及曼谷还有哪些场地值得一起比较，并如实说明各自的容纳人数与氛围。',
      why_lengolf:
        'LENGOLF有专为生日设计的活动套餐。小型套餐（9,999泰铢）可容纳10–15人，使用2个球位3小时，含10瓶啤酒、5杯鸡尾酒、软饮无限畅饮以及一桌自助餐点。中型套餐（21,999泰铢）升级到15–25人、4个球位全开，并且是整场包场：整个空间都归你们。两档套餐都以人人都能上手的Bravo高尔夫模拟器为核心，让这群人有事可做，而不只是坐着吃；像最接近旗杆（closest to the pin）这样的游戏，不会打球的人反而笑得最多。餐食、酒水、装饰、音乐和DJ设备都能按派对需求调整，规模更大的庆祝活动可走定制套餐，接待50人以上。场馆位于The Mercury Ville内、紧邻BTS Chidlom，客人下了BTS就能直接到场。',
      other_activities: [
        { name: 'Private Karaoke Room', description: 'Sukhumvit和Silom一带的KTV按小时出租包厢，所有人都能参与，气氛会一路往上走。适合更想要音乐与酒水、而不是一项活动的团体。', type: 'entertainment' },
        { name: 'Rooftop Private Dining', description: '高空餐厅和酒吧可以为生日团体保留一个独立区域，用天际线景观和照片换掉活动这一环。不过露天场地在曼谷要看天气。', type: 'dining' },
        { name: 'Cooking Class Party', description: '有些烹饪学校提供私人团体课，大家一起做菜再一起吃掉。互动性强、人人都能参与，节奏轻松，适合规模较小的生日。', type: 'culinary' },
        { name: 'Bowling Party at Blu-O', description: '包下球道并附餐饮服务，保龄球是一种省心又有参与感的生日玩法，适合随性的团体。场馆开在大型商场里，位置方便、价格也亲民。', type: 'entertainment' },
        { name: 'Escape Room Group Booking', description: '一次订下好几间密室，生日团体就能分组对抗。喜欢解谜的人会玩得很尽兴，但流程较短，也不含餐食与酒水。', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '为10人以上成年人筹办生日派对的组织者',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '全包套餐', lengolf: '约9,999泰铢起（含餐食、酒水与活动）', alternative: '通常餐饮与场地分开计费' },
        { feature: '互动活动', lengolf: '高尔夫模拟器，各种水平都能玩', alternative: '卡拉OK、保龄球、聚餐' },
        { feature: '可容纳人数', lengolf: '最多25人（整场包场）', alternative: '各家不同：高空酒吧多为10–15人' },
        { feature: '可定制', lengolf: '装饰、音乐、菜单', alternative: '视场地而定' },
        { feature: '人均费用（15人）', lengolf: '全包约667泰铢（估算）', alternative: '1,000–3,000泰铢' },
      ],
      sections: [
        {
          heading: '生日派对套餐、可容纳人数与费用',
          body: '在LENGOLF办生日派对是按套餐计价的，不是按人头收开台费，所以还没开场，总价就已经确定。两档标准套餐可以覆盖大多数成年人的生日，规模更大的则单独报价。\n\n| 套餐 | 人数 | 球位 | 时长 | 含酒水 | 价格 |\n|---|---|---|---|---|---|\n| 小型套餐 | 10–15人 | 4个球位中的2个 | 3小时 | 10瓶啤酒、5杯鸡尾酒、软饮无限畅饮 | 9,999泰铢 |\n| 中型套餐 | 15–25人 | 全部4个球位，整场包场 | 3小时 | 20瓶啤酒、10杯鸡尾酒、软饮无限畅饮 | 21,999泰铢 |\n| 定制套餐 | 50人以上 | 整场包场 | 时间灵活 | 按派对需求报价 | 需询价 |\n\n**换算成人均是多少。** 小型套餐按15人分摊，人均约667泰铢；中型套餐按25人分摊，人均约880泰铢——餐食、酒水和3小时高尔夫全都已经包含在这个数字里，截至2026年7月。曼谷多数派对场地会把场地、餐饮和吧台账单分开计算，所以同口径比下来，最后往往比第一眼看到的价格更高。\n\n**规模小的生日不需要套餐。** 如果来的是八个朋友而不是十八个，按普通预订订球位就行。每个模拟器球位最多可容纳5人，两个球位就够一场小型生日；想顺便把吃的一起安排好，Play & Food团体套餐人均240泰铢NET起。\n\n**容纳人数说明。** 4个球位、每个球位5人，另外还有吧台与休闲座位。整场同时接待15到25人是比较舒服的规模；50人以上也可以，通过定制套餐调整场内的动线安排。',
        },
        {
          heading: '生日派对预订包含哪些内容',
          body: '**球位。** 4个Bravo高尔夫模拟器，现场提供球杆套装，客人什么都不用带。一个球位可容纳5人，这也是20人的派对能顺利进行的关键：人群分散到各个球位轮流上场，而不是全部排在同一块屏幕后面。\n\n**餐食。** 由Smith & Co出品的自助式餐点，直接送到球位。小型套餐包含汉堡、迷你汉堡、炸鱿鱼、吐司、蟹肉或鲜虾ebiko、香脆炸鸡、BBQ牛胸肉、薯条和一份沙拉。中型套餐的分量大致翻倍，并增加大号披萨。\n\n**酒水。** 套餐含瓶装啤酒与鸡尾酒（小型10瓶加5杯，中型20瓶加10杯），软饮全程无限畅饮，超出配额的部分可以继续在吧台点单，吧台全程开放。\n\n**场地。** 中型套餐是整场包场：这3小时里场内不会有其他客人。装饰、音响系统和DJ设备可以另行加购。\n\n**服务人员。** 由店员负责设置模拟器并主持游戏，所以寿星本人（或者那位负责张罗的朋友）不必再向20个人讲解软件怎么用。',
        },
        {
          heading: '生日派对的餐食与酒水',
          body: '餐点来自Smith & Co，直接送到球位，派对全程不必换到餐桌那边去。套餐里的菜单是起点而不是定案：活动团队可以为饮食需求、素食客人或某个主题替换菜品。\n\n套餐配额之外，吧台在整个预订时段都开放：鸡尾酒、日式highball、瓶装啤酒、单杯或整瓶葡萄酒、普罗塞克气泡酒和各种软饮。两档套餐都含软饮无限畅饮，团体里有人不喝酒时这一点很实用。\n\n场馆不允许自带食物与饮料，所以生日当天想准备的特别东西，请提前和活动团队约定，而不是自己带进来。完整的餐点与酒水菜单都有公开标价，想先看看厨房和吧台平时的水准可以直接查阅。',
        },
        {
          heading: '为什么室内高尔夫酒吧适合办生日',
          body: '一场生日需要有事可做。一顿长晚餐会把所有人钉在固定座位上两个小时，寿星整晚只能和身边四个人说上话；普通酒吧则是让大家围成一圈站着。模拟器球位正好相反：人们轮流上场、在旁边看、起哄、坐下吃点东西再站起来，整个场子一晚上会自己重新洗牌好几次。\n\n**不需要高尔夫经验。** 最接近旗杆和最远开球（longest drive）这两个游戏最适合水平参差的团体，计分由模拟器完成。第一次打的人通常比球友玩得更开心，因为没人指望他们打得好。\n\n**天气完全不影响。** 场馆在室内且有空调。在曼谷办露天生日，5到10月本来就是赌运气，热季的下午则是另一种麻烦。\n\n**位置是真的方便。** 场馆位于The Mercury Ville内、紧邻BTS Chidlom，客人搭BTS就能到，不用打车堵在路上。每天9:00至23:00营业，所以下午办和晚上办都行。\n\n**一个场地搞定，不用跑三处。** 活动、餐食和吧台都在同一个空间里，不必在中途把20个人从餐厅挪到酒吧。',
        },
        {
          heading: '如何在LENGOLF预订生日派对',
          body: '**10人以上的团体。** 在活动套餐页面提交咨询表单，或通过LINE @lengolf留言，写清日期、人数和大致预算。活动团队会确认可预订时段、调整套餐内容（换菜、装饰、音响、DJ）并把时段保留下来。\n\n**10人以内的团体。** 不需要走活动团队。直接在booking.len.golf上预订模拟器球位，当晚在球位点餐点酒即可。\n\n**需要准备好的信息。** 日期与开始时间、人数（给一个区间也行）、有没有饮食禁忌，以及是否需要整场包场。周末晚上的时段最先被订走，所以咨询越早，可选时间越多。\n\n**付款方式。** 套餐按总价报价，不必等到半夜再分摊吧台账单。套餐之外另点的部分，会在结束时按菜单标价一并结算。',
        },
        {
          heading: '在曼谷怎么挑生日派对场地',
          body: '**先看人数，再看场地。** 10人以内，多数餐厅和酒吧都能接受订位，不需要套餐。10到25人是最尴尬的一段：普通餐桌不够用，但又还没到宴会厅的规模，这时候你需要的是团体套餐。超过30人，就该看宴会厅、活动空间或整场买断了。\n\n**想清楚是否需要独享整个空间。** 在热闹的酒吧里划出一块区域，和真正的包场不是一回事。如果有致辞、指定歌单或切蛋糕的环节，一定要明确问清楚：整个空间是你们的，还是其他客人依然在场。\n\n**确认报价到底包含什么。** 只报场地费的价格往往看起来便宜，之后才慢慢长大：餐饮、吧台账单、服务费和最低消费会陆续加上来。写明了菜品和酒水杯数的全包套餐更容易横向比较，也更不容易出现意外。\n\n**在活动和氛围之间权衡。** 高空酒吧和私人包厢给的是景观与照片。保龄球、卡拉OK和模拟器球位给的是让客人有事可做，当这群人彼此并不熟悉时，后者更重要。\n\n**看看客人怎么过来。** 在BTS或MRT沿线的场地，大家能准时到齐。周五晚上7点还要打车才能到的场地做不到这一点，而迟到会毁掉派对的第一个小时。',
        },
      ],
      faqs: [
        {
          question: '在曼谷的LENGOLF办一场生日派对要多少钱？',
          answer: '生日活动套餐9,999泰铢起，适合10到15人，包含2个模拟器球位3小时、10瓶啤酒、5杯鸡尾酒、软饮无限畅饮以及一桌自助餐点。中型套餐21,999泰铢，适合15到25人，升级为4个球位全开并整场包场。按整团人数分摊，人均大约667到880泰铢，全部包含在内，截至2026年7月。',
        },
        {
          question: '生日派对最多可以接待多少位客人？',
          answer: '场馆有4个模拟器球位，每个最多容纳5人，另有吧台与休闲座位。标准套餐覆盖10到25人，50人以上的大型生日会以定制套餐报价。',
        },
        {
          question: '可以把整个场馆包下来办私人派对吗？',
          answer: '可以。中型套餐（21,999泰铢，15到25人）是3小时的整场包场，期间场内不会有其他客人。人数更多、时间更长的定制包场可以通过活动团队安排。',
        },
        {
          question: '生日套餐里含餐食和酒水吗？',
          answer: '含。两档套餐都包含由Smith & Co出品、直接送到球位的自助餐点，以及瓶装啤酒、鸡尾酒和无限畅饮的软饮。超出配额的部分，吧台全程开放，按菜单标价结算。',
        },
        {
          question: '餐食和装饰可以定制吗？',
          answer: '餐食与酒水的选择可以完全按饮食需求、素食客人或活动主题调整。装饰、音响系统和DJ设备可作为加购项目。场馆不允许自带食物与饮料，所以有什么特别安排请提前与活动团队约定。',
        },
        {
          question: '来参加生日的客人需要有高尔夫经验吗？',
          answer: '不需要。模拟器既适合球友也适合新手，球杆现场提供，店员还会设置像最接近旗杆、最远开球这类人人都能玩的游戏。第一次上手的人通常比同行的球友玩得更开心。',
        },
        {
          question: '生日派对怎么预订？',
          answer: '10人以上，请在活动套餐页面提交咨询表单，或通过LINE @lengolf发送日期、人数与预算，活动团队会确认可预订时段并为你调整套餐。10人以内的小型生日，直接在booking.len.golf预订模拟器球位，当天在球位点单即可。',
        },
        {
          question: '场馆在哪里，营业时间是几点到几点？',
          answer: 'LENGOLF位于The Mercury Ville 4楼，紧邻BTS Chidlom，地址为540 Ploenchit Road, Pathumwan, Bangkok，与BTS站直接连通。每天9:00至23:00营业，所以下午和晚上的生日都办得成。',
        },
      ],
    },
  },
  {
    id: 'act-5',
    page_type: 'activity_occasion',
    slug: 'things-to-do-bangkok-at-night',
    title: 'Fun Things to Do in Bangkok at Night | Evening Activities',
    meta_description:
      'What to do in Bangkok at night beyond bars and clubs? Indoor golf, night markets, rooftop dining, and more — the best evening activities in Bangkok.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'general',
    locale: 'en',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/indoor-activities-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'nightlife',
      intro:
        'Bangkok comes alive at night, and the best evening activities go well beyond Khao San Road. From indoor golf with cocktails to night markets and rooftop bars, here\'s what to do in Bangkok after dark — whether you\'re looking for action, relaxation, or something different.',
      why_lengolf:
        'LENGOLF is open until 11pm daily, making it one of Bangkok\'s best evening activities. Located at Mercury Ville, BTS Chidlom (Exit 4), it combines Bravo golf simulators with a full cocktail bar. It\'s a genuine activity — not just drinking — which makes it ideal for groups, dates, or solo visitors looking for something to do at night. ~550 THB/hour for up to 5 people.',
      other_activities: [
        { name: 'Rooftop Bars', description: 'Bangkok\'s skyline views are world-famous. Try Octave (Marriott), Vertigo (Banyan Tree), or Sky Bar (Lebua).', type: 'bar' },
        { name: 'Jodd Fairs Night Market', description: 'Open-air night market with street food, craft stalls, and live music. Free entry, MRT Phra Ram 9.', type: 'market' },
        { name: 'Muay Thai at Rajadamnern Stadium', description: 'Watch live muay thai fights at Bangkok\'s most prestigious stadium. Matches run Tuesday, Wednesday, and Thursday evenings.', type: 'sport' },
        { name: 'Chinatown (Yaowarat) Food Crawl', description: 'Walk down Yaowarat Road and eat your way through seafood, noodles, and desserts. Best after 6pm.', type: 'food' },
        { name: 'Live Jazz at Bamboo Bar', description: 'Live jazz from 9pm nightly at the Mandarin Oriental\'s legendary bar. Smart casual dress code.', type: 'music' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'Tourists and locals seeking evening activities',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'Active vs. passive', lengolf: 'Active — play golf, compete', alternative: 'Mostly passive (watching, eating)' },
        { feature: 'Weather-proof', lengolf: 'Fully indoor, air-conditioned', alternative: 'Rooftops/markets weather-dependent' },
        { feature: 'Good for groups', lengolf: 'Up to 5 per bay', alternative: 'Varies' },
        { feature: 'Budget-friendly', lengolf: 'From ~110 THB/person/hour', alternative: '200-2,000 THB per person' },
        { feature: 'Open late', lengolf: 'Until 11pm daily', alternative: 'Bars until late; markets until 11pm' },
      ],
    },
  },

  // ─── TH: things-to-do-bangkok-at-night ───
  // Title framed as ที่เที่ยวกลางคืน, the query a Bangkok resident actually types.
  // Times localized to the Thai 24-hour form (23:00 น., 21:00 น., หลัง 18:00 น.)
  // from the EN 11pm / 9pm / after 6pm. Prices: 550 บาท/ชม., ~110 บาท/คน/ชม.,
  // 200-2,000 บาท/คน — all from the EN entry. Exit 4 preserved.
  {
    id: 'act-5-th',
    page_type: 'activity_occasion',
    slug: 'things-to-do-bangkok-at-night',
    title: 'ที่เที่ยวกลางคืนในกรุงเทพฯ | กิจกรรมยามค่ำคืนที่น่าไป',
    meta_description:
      'กรุงเทพฯ ตอนกลางคืนมีอะไรทำนอกจากบาร์และผับ ทั้งกอล์ฟในร่ม ตลาดกลางคืน มวยไทย และรูฟท็อป รวมกิจกรรมยามค่ำคืนที่น่าสนใจที่สุดในกรุงเทพฯ',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'general',
    locale: 'th',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/indoor-activities-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'nightlife',
      intro:
        'กรุงเทพฯ มีชีวิตชีวาที่สุดตอนกลางคืน และกิจกรรมยามค่ำคืนที่ดีที่สุดก็ไปไกลกว่าถนนข้าวสารมาก ตั้งแต่กอล์ฟในร่มพร้อมค็อกเทล ไปจนถึงตลาดกลางคืนและรูฟท็อปบาร์ นี่คือสิ่งที่ทำได้ในกรุงเทพฯ หลังพระอาทิตย์ตก ไม่ว่าคุณจะมองหาความคึกคัก ความผ่อนคลาย หรืออะไรที่ไม่เหมือนเดิม',
      why_lengolf:
        'LENGOLF เปิดถึง 23:00 น. ทุกวัน จึงเป็นหนึ่งในกิจกรรมยามค่ำคืนที่ดีที่สุดของกรุงเทพฯ ตั้งอยู่ที่ The Mercury Ville, BTS ชิดลม (ทางออก 4) ผสมซิมูเลเตอร์ Bravo Golf เข้ากับบาร์ค็อกเทลครบวงจร ถือเป็นกิจกรรมที่ได้ลงมือทำจริง ไม่ใช่แค่การนั่งดื่ม จึงเหมาะทั้งกับกลุ่มเพื่อน คู่เดต หรือคนที่มาคนเดียวและอยากหาอะไรทำตอนกลางคืน ราคาประมาณ 550 บาท/ชั่วโมง สำหรับผู้เล่นสูงสุด 5 คน (ข้อมูล ณ กรกฎาคม 2026)',
      other_activities: [
        { name: 'Rooftop Bars', description: 'วิวเส้นขอบฟ้าของกรุงเทพฯ มีชื่อเสียงระดับโลก ลอง Octave (Marriott), Vertigo (Banyan Tree) หรือ Sky Bar (Lebua)', type: 'bar' },
        { name: 'Jodd Fairs Night Market', description: 'ตลาดกลางคืนกลางแจ้ง มีทั้งสตรีทฟู้ด ร้านงานคราฟต์ และดนตรีสด เข้าฟรี ลง MRT พระราม 9', type: 'market' },
        { name: 'Muay Thai at Rajadamnern Stadium', description: 'ดูมวยไทยสดที่สนามมวยที่มีเกียรติที่สุดของกรุงเทพฯ มีการแข่งขันในเย็นวันอังคาร วันพุธ และวันพฤหัสบดี', type: 'sport' },
        { name: 'Chinatown (Yaowarat) Food Crawl', description: 'เดินกินไปตลอดถนนเยาวราช ทั้งอาหารทะเล ก๋วยเตี๋ยว และของหวาน ช่วงที่ดีที่สุดคือหลัง 18:00 น.', type: 'food' },
        { name: 'Live Jazz at Bamboo Bar', description: 'ดนตรีแจ๊สสดตั้งแต่ 21:00 น. ทุกคืน ที่บาร์ในตำนานของโรงแรม Mandarin Oriental แต่งกายแบบสมาร์ทแคชวล', type: 'music' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'นักท่องเที่ยวและคนกรุงเทพฯ ที่มองหากิจกรรมยามค่ำคืน',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'ได้ลงมือทำหรือแค่นั่งดู', lengolf: 'ได้ลงมือทำ เล่นกอล์ฟและแข่งกัน', alternative: 'ส่วนใหญ่เป็นการนั่งดูหรือนั่งกิน' },
        { feature: 'กันฝนกันแดด', lengolf: 'อยู่ในร่มทั้งหมด มีเครื่องปรับอากาศ', alternative: 'รูฟท็อปและตลาดขึ้นอยู่กับสภาพอากาศ' },
        { feature: 'เหมาะกับกลุ่ม', lengolf: 'สูงสุด 5 คนต่อเบย์', alternative: 'แล้วแต่ที่' },
        { feature: 'ราคาเป็นมิตร', lengolf: 'เริ่มต้นประมาณ 110 บาท/คน/ชั่วโมง', alternative: '200-2,000 บาทต่อคน' },
        { feature: 'เปิดดึก', lengolf: 'ถึง 23:00 น. ทุกวัน', alternative: 'บาร์เปิดถึงดึก ตลาดถึงประมาณ 23:00 น.' },
      ],
    },
  },

  // ─── JA: things-to-do-bangkok-at-night ───
  // Title/meta target バンコク 夜 rather than rendering "Fun Things to Do" literally.
  // 23時まで営業, 約550THB/時（最大5名）, 約110THB/人・時, 200〜2,000THB and the
  // Exit 4 wayfinding all trace to the EN entry. MRT Phra Ram 9 is left in Latin
  // (no settled JA exonym; the glossary only licenses coined katakana for the
  // listed transliterations). related_slugs unchanged — all in allowlist.
  {
    id: 'act-5-ja',
    page_type: 'activity_occasion',
    slug: 'things-to-do-bangkok-at-night',
    title: 'バンコクの夜の楽しみ方 — バー以外のおすすめアクティビティ',
    meta_description:
      'バンコクの夜はバーやクラブだけではありません。インドアゴルフ、ナイトマーケット、ルーフトップダイニングまで、日が暮れてから楽しめるおすすめの過ごし方をまとめました。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'general',
    locale: 'ja',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/indoor-activities-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'nightlife',
      intro:
        'バンコクの夜は街全体が動き出します。しかも見どころはカオサン通りだけではありません。カクテル片手のインドアゴルフから、ナイトマーケット、ルーフトップバーまで。アクティブに過ごしたい方にも、のんびりしたい方にも、いつもと違う何かを探している方にも合う、日が暮れてからのバンコクの過ごし方をご紹介します。',
      why_lengolf:
        'LENGOLFは毎日23時まで営業しており、バンコクの夜の選択肢として有力です。BTSチットロム駅（4番出口）直結のザ・マーキュリービルにあり、Bravo Golfシミュレーターとフルバーのカクテルが同じ空間に揃っています。飲むだけで終わらず体を動かす時間があるので、グループにも、デートにも、一人で立ち寄る方にも向いています。料金は最大5名まで1時間約550THB（2026年7月現在）。',
      other_activities: [
        { name: 'Rooftop Bars', description: 'バンコクのスカイラインの眺めは世界的に有名です。Octave（マリオット）、Vertigo（バンヤンツリー）、Sky Bar（ルブア）などが定番。', type: 'bar' },
        { name: 'Jodd Fairs Night Market', description: '屋台の食べ物、雑貨、ライブ音楽が並ぶ屋外のナイトマーケット。入場無料、MRT Phra Ram 9駅からすぐです。', type: 'market' },
        { name: 'Muay Thai at Rajadamnern Stadium', description: 'バンコクで最も格式のあるスタジアムで観るムエタイの試合。開催は火曜・水曜・木曜の夜です。', type: 'sport' },
        { name: 'Chinatown (Yaowarat) Food Crawl', description: 'ヤワラー通りを歩きながら、シーフード、麺類、デザートを食べ歩き。18時以降が狙い目です。', type: 'food' },
        { name: 'Live Jazz at Bamboo Bar', description: 'マンダリン オリエンタルの伝説的なバーで、毎晩21時からライブジャズ。ドレスコードはスマートカジュアルです。', type: 'music' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '夜のアクティビティを探している旅行者と在住者',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '能動的か受動的か', lengolf: '能動的 — 自分で打って競える', alternative: 'ほぼ受け身（観る、食べる）' },
        { feature: '天候の影響', lengolf: '完全屋内で冷房完備', alternative: 'ルーフトップやマーケットは天候次第' },
        { feature: 'グループ向き', lengolf: '1ベイ最大5名', alternative: 'まちまち' },
        { feature: '予算のやさしさ', lengolf: '1人1時間あたり約110THBから', alternative: '1人あたり200〜2,000THB' },
        { feature: '遅い時間の営業', lengolf: '毎日23時まで', alternative: 'バーは深夜まで、マーケットは23時ごろまで' },
      ],
    },
  },

  // ─── KO: things-to-do-bangkok-at-night ───
  // Title front-loads 방콕 밤에 할 것. Exit 4 is carried here because the EN
  // why_lengolf states it (BTS 칫롬역 4번 출구). Figures: 밤 11시, 시간당 약
  // 550바트, 1인 약 110바트부터, 1인 200~2,000바트 — all from this EN entry.
  // Latin place names in descriptions (Octave, Vertigo, Sky Bar, Yaowarat Road,
  // Rajadamnern Stadium, MRT Phra Ram 9) kept verbatim.
  {
    id: 'act-5-ko',
    page_type: 'activity_occasion',
    slug: 'things-to-do-bangkok-at-night',
    title: '방콕 밤에 할 것 — 저녁 액티비티와 나이트라이프',
    meta_description:
      '방콕에서 밤에 뭐 할지 고민이라면 바와 클럽 말고도 선택지가 많아요. 실내 골프, 야시장, 루프톱 다이닝까지 저녁 액티비티를 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'general',
    locale: 'ko',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/indoor-activities-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'nightlife',
      intro:
        '방콕은 밤에 더 살아나고, 괜찮은 저녁 액티비티는 Khao San Road 훨씬 바깥에 있어요. 칵테일과 함께 치는 실내 골프부터 야시장과 루프톱 바까지, 해가 진 뒤 방콕에서 할 수 있는 것들을 모았어요. 활동적인 밤이든, 느긋한 밤이든, 조금 색다른 밤이든 골라 보세요.',
      why_lengolf:
        'LENGOLF는 매일 밤 11시까지 열어서 방콕의 저녁 시간을 보내기 좋은 곳이에요. BTS 칫롬역(4번 출구)과 이어지는 The Mercury Ville에 있고, Bravo 골프 시뮬레이터와 칵테일 바를 함께 갖췄어요. 마시기만 하는 게 아니라 실제로 몸을 쓰는 활동이라 단체, 데이트, 혼자 온 여행자 모두에게 잘 맞아요. 최대 5명까지 시간당 약 550바트예요 (2026년 7월 기준).',
      other_activities: [
        { name: '루프톱 바', description: '방콕의 스카이라인 전망은 세계적으로 유명해요. Octave(Marriott), Vertigo(Banyan Tree), Sky Bar(Lebua)를 추천해요.', type: 'bar' },
        { name: 'Jodd Fairs 야시장', description: '길거리 음식과 수공예 가판, 라이브 음악이 있는 야외 야시장이에요. 입장은 무료이고 MRT Phra Ram 9역에서 내려요.', type: 'market' },
        { name: 'Rajadamnern Stadium 무에타이', description: '방콕에서 가장 권위 있는 경기장에서 무에타이 경기를 직접 봐요. 화요일, 수요일, 목요일 저녁에 열려요.', type: 'sport' },
        { name: '차이나타운(Yaowarat) 먹거리 투어', description: 'Yaowarat Road를 걸으며 해산물과 국수, 디저트를 차례로 먹어요. 저녁 6시 이후가 가장 좋아요.', type: 'food' },
        { name: 'Bamboo Bar 라이브 재즈', description: 'Mandarin Oriental의 전설적인 바에서 매일 밤 9시부터 라이브 재즈가 흘러요. 스마트 캐주얼 드레스 코드가 있어요.', type: 'music' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '저녁 시간에 즐길 거리를 찾는 여행자와 현지 거주자',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '직접 참여 vs 관람', lengolf: '참여형 — 직접 치고 겨뤄요', alternative: '대부분 관람형 (보고 먹기)' },
        { feature: '날씨 영향', lengolf: '완전 실내, 에어컨', alternative: '루프톱과 시장은 날씨를 타요' },
        { feature: '단체 적합', lengolf: '베이당 최대 5명', alternative: '제각각이에요' },
        { feature: '가격 부담', lengolf: '시간당 1인 약 110바트부터', alternative: '1인 200~2,000바트' },
        { feature: '늦게까지 영업', lengolf: '매일 밤 11시까지', alternative: '바는 늦게까지, 시장은 밤 11시까지' },
      ],
    },
  },

  // ─── ZH: things-to-do-bangkok-at-night ───
  // 曼谷晚上去哪玩 front-loaded. Figures trace to EN act-5 (营业至23:00,
  // 4号出口, 每小时约550泰铢／最多5人, 人均约110泰铢, 每人200–2,000泰铢,
  // Rajadamnern 周二三四晚间, Bamboo Bar 21:00起, Jodd Fairs 免费入场 MRT
  // Phra Ram 9); LENGOLF price carries 截至2026年7月. 考山路 / 唐人街 /
  // 耀华力路 use their established Chinese names; stadium and bar names Latin.
  {
    id: 'act-5-zh',
    page_type: 'activity_occasion',
    slug: 'things-to-do-bangkok-at-night',
    title: '曼谷晚上去哪玩 — 夜市、高空酒吧与室内高尔夫',
    meta_description:
      '曼谷晚上除了酒吧和夜店还能做什么。室内高尔夫、夜市、高空餐厅、泰拳与唐人街小吃——这里整理了曼谷入夜后最值得安排的活动。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'general',
    locale: 'zh',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/indoor-activities-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'nightlife',
      intro:
        '曼谷一到晚上才真正热闹起来，而最好的夜间活动远不止考山路那一带。从配鸡尾酒的室内高尔夫，到夜市和高空酒吧，以下是曼谷天黑之后可以做的事——不管你想要的是刺激、放松，还是一点不一样的东西。',
      why_lengolf:
        'LENGOLF每天营业至23:00，是曼谷夜间活动里很值得考虑的一个选择。场馆位于Mercury Ville、BTS Chidlom（4号出口）旁，把Bravo高尔夫模拟器和一整套鸡尾酒吧放在同一个空间里。这里是一项真正的活动，而不只是喝酒，所以无论是一群朋友、一对情侣还是独自出门想找点事做的人都合适。每小时约550泰铢，最多5人，截至2026年7月。',
      other_activities: [
        { name: 'Rooftop Bars', description: '曼谷的天际线景观闻名世界。可以试试Octave（Marriott）、Vertigo（Banyan Tree）或Sky Bar（Lebua）。', type: 'bar' },
        { name: 'Jodd Fairs Night Market', description: '露天夜市，有街头小吃、手作摊位和现场音乐。免费入场，MRT Phra Ram 9站。', type: 'market' },
        { name: 'Muay Thai at Rajadamnern Stadium', description: '在曼谷最负盛名的拳场观看现场泰拳比赛。赛事在每周二、周三和周四晚间进行。', type: 'sport' },
        { name: 'Chinatown (Yaowarat) Food Crawl', description: '沿着唐人街的耀华力路一路吃过去，海鲜、面食和甜品都不会落下。18:00之后最热闹。', type: 'food' },
        { name: 'Live Jazz at Bamboo Bar', description: '每晚21:00起，在Mandarin Oriental这家传奇酒吧听现场爵士。着装要求为商务休闲。', type: 'music' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '想找夜间活动的游客与本地居民',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '主动参与还是被动观赏', lengolf: '主动——亲自挥杆、互相比拼', alternative: '多为被动（观看、用餐）' },
        { feature: '不受天气影响', lengolf: '完全室内，有空调', alternative: '高空酒吧与夜市都看天气' },
        { feature: '适合团体', lengolf: '每个球位最多5人', alternative: '各家不同' },
        { feature: '价格亲民', lengolf: '人均每小时约110泰铢起', alternative: '每人200–2,000泰铢' },
        { feature: '营业到很晚', lengolf: '每天营业至23:00', alternative: '酒吧到深夜，夜市多到23:00' },
      ],
    },
  },
  {
    id: 'act-6',
    page_type: 'activity_occasion',
    slug: 'group-activities-bangkok',
    title: 'Group Activities in Bangkok for 10+ People',
    meta_description:
      'Planning group activities in Bangkok for 10 or more people? From golf simulator competitions to escape rooms and cooking classes — the best group-friendly options.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'en',
    related_slugs: ['/activities/bachelor-party-ideas-bangkok', '/activities/birthday-party-venues-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'group-activity',
      intro:
        'Finding group activities in Bangkok for 10 or more people is harder than it sounds — most venues cap at small groups or require expensive private bookings. Here are the best options that genuinely accommodate larger groups with a shared, interactive experience.',
      why_lengolf:
        'LENGOLF handles groups of 10-25 people easily. With multiple bays available (up to 5 people per bay), groups can compete across bays with leaderboards and scoring. Our event packages start at ~9,999 THB for 10-15 guests (includes food, drinks, and 3 hours of play) or ~21,999 THB for 15-25 guests with full venue rental. Located at Mercury Ville, BTS Chidlom — easy for everyone to reach.',
      other_activities: [
        { name: 'Escape Room (Multiple Rooms)', description: 'Book multiple escape rooms and compete between teams. Several venues in Sukhumvit and Silom.', type: 'entertainment' },
        { name: 'Group Cooking Class', description: 'Some schools accommodate 15-20 people. Everyone cooks and eats together. Usually 1,500-2,500 THB per person.', type: 'culinary' },
        { name: 'Go-Karting (EasyKart)', description: 'Indoor karting at RCA accommodates groups. Race format with qualifying and finals.', type: 'sport' },
        { name: 'Private Karaoke Suite', description: 'Large KTV rooms in Sukhumvit and Silom fit 15-20 people. All-you-can-drink packages available.', type: 'entertainment' },
        { name: 'Bowling Tournament', description: 'Lane packages at Blu-O for organized competitions. Located in Siam Paragon and other malls.', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'Friend groups, informal teams, social organizers',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'Capacity', lengolf: '10-25 people (full venue)', alternative: 'Usually 6-15 per session' },
        { feature: 'Competition format', lengolf: 'Cross-bay leaderboards', alternative: 'Team vs. team (escape rooms)' },
        { feature: 'All-inclusive option', lengolf: 'From ~9,999 THB (food + drinks + play)', alternative: 'Usually activity fee only' },
        { feature: 'BTS accessible', lengolf: 'BTS Chidlom (Exit 4)', alternative: 'Varies' },
        { feature: 'No experience needed', lengolf: 'Yes — everyone can play', alternative: 'Some need coordination' },
      ],
    },
  },

  // ─── TH: group-activities-bangkok ───
  // Title keeps the 10+ headcount qualifier because that is the whole search
  // intent. Package figures (9,999 / 21,999 บาท, 10-15 และ 15-25 คน) and the
  // third-party ranges (1,500-2,500 บาท/คน, 15-20 คน) come from the EN entry.
  {
    id: 'act-6-th',
    page_type: 'activity_occasion',
    slug: 'group-activities-bangkok',
    title: 'กิจกรรมกลุ่มในกรุงเทพฯ สำหรับ 10 คนขึ้นไป',
    meta_description:
      'วางแผนกิจกรรมกลุ่มในกรุงเทพฯ สำหรับ 10 คนขึ้นไปอยู่ใช่ไหม ตั้งแต่แข่งกอล์ฟซิมูเลเตอร์ ห้องปริศนา ไปจนถึงคลาสทำอาหาร รวมตัวเลือกที่รองรับกลุ่มใหญ่ได้จริง',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'th',
    related_slugs: ['/activities/bachelor-party-ideas-bangkok', '/activities/birthday-party-venues-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'group-activity',
      intro:
        'การหากิจกรรมกลุ่มในกรุงเทพฯ สำหรับ 10 คนขึ้นไปยากกว่าที่คิด สถานที่ส่วนใหญ่รับได้แค่กลุ่มเล็ก หรือไม่ก็ต้องจองแบบเหมาซึ่งราคาสูง นี่คือตัวเลือกที่ดีที่สุดที่รองรับกลุ่มใหญ่ได้จริง พร้อมประสบการณ์ที่ทุกคนมีส่วนร่วมไปด้วยกัน',
      why_lengolf:
        'LENGOLF รองรับกลุ่ม 10-25 คนได้สบาย มีหลายเบย์ให้ใช้ (เบย์ละไม่เกิน 5 คน) กลุ่มจึงแข่งกันข้ามเบย์พร้อมกระดานคะแนนได้ แพ็กเกจอีเวนต์ของเราเริ่มต้นประมาณ 9,999 บาท สำหรับแขก 10-15 คน (รวมอาหาร เครื่องดื่ม และเวลาเล่น 3 ชั่วโมง) หรือประมาณ 21,999 บาท สำหรับ 15-25 คน พร้อมเหมาพื้นที่ทั้งหมด ตั้งอยู่ที่ The Mercury Ville, BTS ชิดลม ทุกคนจึงเดินทางมาได้ง่าย (ข้อมูล ณ กรกฎาคม 2026)',
      other_activities: [
        { name: 'Escape Room (Multiple Rooms)', description: 'จองหลายห้องพร้อมกันแล้วแข่งกันระหว่างทีม มีหลายแห่งย่านสุขุมวิทและสีลม', type: 'entertainment' },
        { name: 'Group Cooking Class', description: 'บางโรงเรียนรับได้ 15-20 คน ทุกคนได้ลงมือทำและกินด้วยกัน ราคาโดยทั่วไป 1,500-2,500 บาทต่อคน', type: 'culinary' },
        { name: 'Go-Karting (EasyKart)', description: 'สนามโกคาร์ตในร่มที่ RCA รองรับกลุ่มได้ จัดเป็นรูปแบบการแข่งขันทั้งรอบคัดเลือกและรอบชิง', type: 'sport' },
        { name: 'Private Karaoke Suite', description: 'ห้องคาราโอเกะขนาดใหญ่ย่านสุขุมวิทและสีลมจุได้ 15-20 คน มีแพ็กเกจดื่มไม่อั้นให้เลือก', type: 'entertainment' },
        { name: 'Bowling Tournament', description: 'แพ็กเกจเลนที่ Blu-O สำหรับจัดการแข่งขันอย่างเป็นระบบ มีสาขาที่สยามพารากอนและห้างอื่นๆ', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'กลุ่มเพื่อน ทีมแบบไม่เป็นทางการ และผู้จัดงานสังสรรค์',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'จำนวนที่รองรับ', lengolf: '10-25 คน (เหมาพื้นที่ทั้งหมด)', alternative: 'ปกติ 6-15 คนต่อรอบ' },
        { feature: 'รูปแบบการแข่งขัน', lengolf: 'กระดานคะแนนข้ามเบย์', alternative: 'ทีมแข่งกับทีม (ห้องปริศนา)' },
        { feature: 'ตัวเลือกแบบรวมทุกอย่าง', lengolf: 'เริ่มต้นประมาณ 9,999 บาท (อาหาร เครื่องดื่ม และเวลาเล่น)', alternative: 'ปกติคิดเฉพาะค่ากิจกรรม' },
        { feature: 'เดินทางด้วย BTS ได้', lengolf: 'BTS ชิดลม (ทางออก 4)', alternative: 'แล้วแต่ที่' },
        { feature: 'ไม่ต้องมีประสบการณ์', lengolf: 'ไม่ต้อง ทุกคนเล่นได้', alternative: 'บางกิจกรรมต้องอาศัยการประสานงาน' },
      ],
    },
  },

  // ─── JA: group-activities-bangkok ───
  // Title front-loads バンコク グループアクティビティ and keeps EN's 10-person
  // threshold in the tail. 10〜25名, 1ベイ最大5名, 約9,999THB（10〜15名）,
  // 約21,999THB（15〜25名）, 1,500〜2,500THB/人 (cooking class), 15〜20名 (KTV) all
  // trace to the EN entry; EN's "~" is carried as 約. related_slugs unchanged.
  {
    id: 'act-6-ja',
    page_type: 'activity_occasion',
    slug: 'group-activities-bangkok',
    title: 'バンコクのグループアクティビティ — 10名以上で楽しめる場所',
    meta_description:
      'バンコクで10名以上のグループアクティビティをお探しですか。ゴルフシミュレーターでの対決から脱出ゲーム、料理教室まで、大人数に本当に対応できる選択肢をまとめました。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'ja',
    related_slugs: ['/activities/bachelor-party-ideas-bangkok', '/activities/birthday-party-venues-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'group-activity',
      intro:
        'バンコクで10名以上のグループアクティビティを探すのは、思っているより大変です。多くの会場は少人数までしか受けられないか、高額な貸切が条件になります。ここでは、大人数でも実際に受け入れてくれて、全員が同じ体験を共有できる選択肢をご紹介します。',
      why_lengolf:
        'LENGOLFは10〜25名のグループにも無理なく対応します。複数のベイ（1ベイ最大5名）を使えば、ベイをまたいだリーダーボードとスコアで競い合えます。イベントパッケージは、10〜15名で約9,999THBから（料理、ドリンク、3時間のプレー込み）、15〜25名なら全館貸切付きで約21,999THB。BTSチットロム駅直結のザ・マーキュリービルにあるので、全員が集まりやすい立地です（2026年7月現在）。',
      other_activities: [
        { name: 'Escape Room (Multiple Rooms)', description: '複数の部屋を押さえてチーム対抗にできます。スクンビットとシーロムに何軒かあります。', type: 'entertainment' },
        { name: 'Group Cooking Class', description: '15〜20名を受け入れる教室もあります。全員で作って一緒に食べる形式で、料金は1人1,500〜2,500THBが一般的です。', type: 'culinary' },
        { name: 'Go-Karting (EasyKart)', description: 'RCAの屋内カートコースはグループにも対応。予選と決勝を組んだレース形式で走れます。', type: 'sport' },
        { name: 'Private Karaoke Suite', description: 'スクンビットやシーロムの大型KTVルームなら15〜20名が入ります。飲み放題パッケージもあります。', type: 'entertainment' },
        { name: 'Bowling Tournament', description: 'Blu-Oのレーンパッケージなら大会形式で楽しめます。サイアムパラゴンほか各モールに入っています。', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '友人グループ、気の置けないチーム、集まりの幹事の方',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '収容人数', lengolf: '10〜25名（全館貸切）', alternative: '1回あたり6〜15名が一般的' },
        { feature: '対戦の形式', lengolf: 'ベイをまたいだリーダーボード', alternative: 'チーム対抗（脱出ゲームなど）' },
        { feature: 'オールインクルーシブの有無', lengolf: '約9,999THBから（料理・ドリンク・プレー込み）', alternative: 'アクティビティ料金のみのことが多い' },
        { feature: 'BTSでのアクセス', lengolf: 'BTSチットロム駅（4番出口）', alternative: '場所による' },
        { feature: '経験の要否', lengolf: '不要 — 全員がプレーできる', alternative: '連携が必要なものもある' },
      ],
    },
  },

  // ─── KO: group-activities-bangkok ───
  // Title keeps the 10명 이상 qualifier from the EN headline, which is the
  // search-defining detail. Package figures (약 9,999바트 / 약 21,999바트) and
  // the third-party figure (1인 1,500~2,500바트) carry the EN hedges. Exit 4
  // appears in the comparison table exactly where the EN has it.
  {
    id: 'act-6-ko',
    page_type: 'activity_occasion',
    slug: 'group-activities-bangkok',
    title: '방콕 단체 액티비티 — 10명 이상 모임 장소',
    meta_description:
      '방콕에서 10명 이상 단체 액티비티를 찾는다면, 골프 시뮬레이터 대결부터 방탈출, 쿠킹 클래스까지 큰 그룹을 실제로 받아 주는 곳을 모았어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'ko',
    related_slugs: ['/activities/bachelor-party-ideas-bangkok', '/activities/birthday-party-venues-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'group-activity',
      intro:
        '방콕에서 10명 넘는 단체 액티비티를 찾는 일은 생각보다 어려워요. 대부분의 장소가 소규모까지만 받거나 비싼 단독 예약을 요구하거든요. 큰 그룹을 실제로 감당하면서 다 같이 참여할 수 있는 선택지를 골라 봤어요.',
      why_lengolf:
        'LENGOLF는 10~25명 규모를 무리 없이 받아요. 베이가 여러 개 있어서(베이당 최대 5명) 베이끼리 순위표를 놓고 겨룰 수 있어요. 이벤트 패키지는 10~15명에 약 9,999바트부터(음식, 음료, 3시간 플레이 포함), 15~25명은 약 21,999바트에 단독 대관까지 붙어요 (2026년 7월 기준). BTS 칫롬역 The Mercury Ville에 있어서 다들 모이기 편해요.',
      other_activities: [
        { name: '방탈출 (여러 룸 예약)', description: '방탈출 룸을 여러 개 잡아 팀끼리 겨뤄요. Sukhumvit과 Silom에 여러 곳이 있어요.', type: 'entertainment' },
        { name: '단체 쿠킹 클래스', description: '15~20명까지 받는 학원도 있어요. 다 같이 요리하고 함께 먹어요. 보통 1인당 1,500~2,500바트예요.', type: 'culinary' },
        { name: '고카트 (EasyKart)', description: 'RCA의 실내 카트장은 단체를 받아요. 예선과 결승으로 이어지는 레이스 형식이에요.', type: 'sport' },
        { name: '프라이빗 노래방 룸', description: 'Sukhumvit과 Silom의 큰 KTV 룸은 15~20명이 들어가요. 무제한 음주 패키지도 있어요.', type: 'entertainment' },
        { name: '볼링 토너먼트', description: 'Blu-O의 레인 패키지로 제대로 된 대회를 열 수 있어요. Siam Paragon을 비롯한 쇼핑몰 안에 있어요.', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '친구 모임, 동호회, 모임을 주최하는 분들',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '수용 인원', lengolf: '10~25명 (단독 대관)', alternative: '보통 회차당 6~15명' },
        { feature: '경쟁 방식', lengolf: '베이 간 순위표', alternative: '팀 대 팀 (방탈출)' },
        { feature: '올인클루시브 옵션', lengolf: '약 9,999바트부터 (음식 + 음료 + 플레이)', alternative: '보통 액티비티 요금만' },
        { feature: 'BTS 접근성', lengolf: 'BTS 칫롬역(4번 출구)', alternative: '제각각이에요' },
        { feature: '경험 필요 여부', lengolf: '필요 없어요 — 누구나 가능', alternative: '손발이 맞아야 하는 것도 있어요' },
      ],
    },
  },

  // ─── ZH: group-activities-bangkok ───
  // Title keeps the 10人以上 qualifier from the EN headline because that is the
  // query intent. Figures trace to EN act-6 (10–25人, 每个球位最多5人,
  // 约9,999泰铢／10–15人, 约21,999泰铢／15–25人含整场包场, 烹饪课人均
  // 1,500–2,500泰铢, KTV包厢15–20人, 4号出口); LENGOLF prices carry 截至2026年7月.
  {
    id: 'act-6-zh',
    page_type: 'activity_occasion',
    slug: 'group-activities-bangkok',
    title: '曼谷10人以上团体活动 — 一群人能一起玩的选择',
    meta_description:
      '在曼谷替10人以上的团体安排活动并不容易。从高尔夫模拟器比拼到密室逃脱、团体烹饪课与卡丁车，这里整理了真正能容纳大团体的选择。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'zh',
    related_slugs: ['/activities/bachelor-party-ideas-bangkok', '/activities/birthday-party-venues-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'group-activity',
      intro:
        '在曼谷替10人以上的团体找活动，比想象中难——多数场地要么只接待小团体，要么就得走价格不菲的包场。以下这些选择是真正能容纳较大团体、并且让大家一起参与同一件事的。',
      why_lengolf:
        'LENGOLF可以轻松接待10到25人的团体。场内有多个球位（每个球位最多5人），团队之间可以跨球位比拼，配合排行榜和计分。活动套餐约9,999泰铢起，适合10到15人（含餐食、酒水与3小时场次），或约21,999泰铢，适合15到25人并整场包场，截至2026年7月。场馆位于Mercury Ville、BTS Chidlom旁，每个人都很好到达。',
      other_activities: [
        { name: 'Escape Room (Multiple Rooms)', description: '一次订下多个密室，让队伍之间互相比拼。Sukhumvit和Silom一带有多家可选。', type: 'entertainment' },
        { name: 'Group Cooking Class', description: '有些学校能接待15到20人，大家一起做菜、一起开饭。通常人均1,500–2,500泰铢。', type: 'culinary' },
        { name: 'Go-Karting (EasyKart)', description: '位于RCA的室内卡丁车场可接待团体，采用排位赛加决赛的比赛形式。', type: 'sport' },
        { name: 'Private Karaoke Suite', description: 'Sukhumvit和Silom的大型KTV包厢可容纳15到20人，也有畅饮套餐可选。', type: 'entertainment' },
        { name: 'Bowling Tournament', description: 'Blu-O的球道套餐可以办成正式比赛。场馆开在Siam Paragon等大型商场里。', type: 'entertainment' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '朋友团体、非正式球队与聚会组织者',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '可容纳人数', lengolf: '10–25人（整场包场）', alternative: '通常每场6–15人' },
        { feature: '竞赛形式', lengolf: '跨球位排行榜', alternative: '队伍对抗（密室逃脱）' },
        { feature: '全包方案', lengolf: '约9,999泰铢起（含餐食、酒水与场次）', alternative: '通常只含活动费用' },
        { feature: 'BTS可达', lengolf: 'BTS Chidlom（4号出口）', alternative: '因地点而异' },
        { feature: '无需经验', lengolf: '可以——人人都能上手', alternative: '有些需要事先协调' },
      ],
    },
  },
  {
    id: 'act-7',
    page_type: 'activity_occasion',
    slug: 'indoor-activities-bangkok',
    title: 'Indoor Activities in Bangkok | Air-Conditioned Fun',
    meta_description:
      'Escape Bangkok\'s heat and rain with the best indoor activities — golf simulators, escape rooms, bowling, museums, and more. All air-conditioned.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'weather',
    locale: 'en',
    related_slugs: ['/activities/rainy-day-activities-bangkok', '/activities/weekend-activities-bangkok', '/activities/family-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'indoor',
      intro:
        'Bangkok\'s heat (35°C+) and rain (May-October monsoon) make indoor activities essential. Whether you\'re escaping a downpour or the midday sun, these are the best air-conditioned things to do in Bangkok — from golf simulators and escape rooms to museums and bowling.',
      why_lengolf:
        'LENGOLF is a premium indoor golf simulator bar at Mercury Ville, BTS Chidlom. Fully air-conditioned with Bravo golf simulators, a cocktail bar, and food menu. No golf experience needed — it\'s designed to be fun for everyone. Bay rental starts at ~550 THB/hour for up to 5 people. Open 9am-11pm daily, it\'s the perfect escape from Bangkok\'s weather any time of day.',
      other_activities: [
        { name: 'Escape Room Bangkok', description: 'Themed puzzle rooms for groups of 2-6. Air-conditioned, brain-teasing, and fun. 500-800 THB per person.', type: 'entertainment' },
        { name: 'Bowling at Blu-O', description: 'Modern bowling in major malls. Glow lanes, music, and food. Affordable for families and groups.', type: 'entertainment' },
        { name: 'Jim Thompson House Museum', description: 'Beautiful Thai traditional house museum near BTS National Stadium. Air-conditioned galleries with guided tours.', type: 'museum' },
        { name: 'VR Gaming (Zero Latency)', description: 'Full-body virtual reality experiences for groups. Futuristic and immersive. In Sukhumvit area.', type: 'entertainment' },
        { name: 'SEA LIFE Bangkok Ocean World', description: 'Massive aquarium under Siam Paragon. Great for families and rainy days. Open 10am-9pm.', type: 'attraction' },
        { name: 'Bangkok Art and Culture Centre (BACC)', description: 'Free contemporary art galleries across multiple floors. Near BTS National Stadium.', type: 'museum' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'Anyone seeking air-conditioned activities in Bangkok',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'Air-conditioned', lengolf: 'Yes — fully indoor', alternative: 'Yes — all listed are indoor' },
        { feature: 'Group friendly', lengolf: 'Up to 5 per bay, event packages for 25', alternative: 'Varies — escape rooms cap at 6' },
        { feature: 'Food & drinks', lengolf: 'Full bar + food menu', alternative: 'Mall food courts nearby' },
        { feature: 'Activity duration', lengolf: '1-3 hours', alternative: '1-2 hours typical' },
        { feature: 'Near BTS', lengolf: 'BTS Chidlom (Exit 4)', alternative: 'Most are mall-based (BTS accessible)' },
        { feature: 'Starting price', lengolf: '~110 THB/person/hour (group of 5)', alternative: '200-800 THB/person' },
      ],
    },
  },

  // ─── TH: indoor-activities-bangkok ───
  // 35°C+ rendered as 35 องศาเซลเซียสขึ้นไป (Thai prose spells the unit).
  // Opening hours localized to 10:00-21:00 น. (SEA LIFE) and 9:00-23:00 น.
  // Prices 500-800 บาท/คน, ~110 บาท/คน/ชม., 200-800 บาท/คน all from EN.
  {
    id: 'act-7-th',
    page_type: 'activity_occasion',
    slug: 'indoor-activities-bangkok',
    title: 'กิจกรรมในร่มในกรุงเทพฯ | ที่เที่ยวติดแอร์หนีร้อนหนีฝน',
    meta_description:
      'หนีร้อนและหนีฝนในกรุงเทพฯ ด้วยกิจกรรมในร่มที่ดีที่สุด ทั้งกอล์ฟซิมูเลเตอร์ ห้องปริศนา โบว์ลิ่ง พิพิธภัณฑ์ และพิพิธภัณฑ์สัตว์น้ำ ติดแอร์ทุกที่',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'weather',
    locale: 'th',
    related_slugs: ['/activities/rainy-day-activities-bangkok', '/activities/weekend-activities-bangkok', '/activities/family-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'indoor',
      intro:
        'อากาศร้อนของกรุงเทพฯ (35 องศาเซลเซียสขึ้นไป) และฝนช่วงเดือนพฤษภาคมถึงตุลาคม ทำให้กิจกรรมในร่มเป็นเรื่องจำเป็น ไม่ว่าคุณจะหนีฝนที่เทลงมาหรือหนีแดดกลางวัน นี่คือกิจกรรมติดแอร์ที่ดีที่สุดในกรุงเทพฯ ตั้งแต่กอล์ฟซิมูเลเตอร์และห้องปริศนา ไปจนถึงพิพิธภัณฑ์และโบว์ลิ่ง',
      why_lengolf:
        'LENGOLF คือบาร์กอล์ฟซิมูเลเตอร์ในร่มระดับพรีเมียม ที่ The Mercury Ville, BTS ชิดลม ติดแอร์ทั้งพื้นที่ มีซิมูเลเตอร์ Bravo Golf บาร์ค็อกเทล และเมนูอาหาร ไม่ต้องมีประสบการณ์กอล์ฟมาก่อน เพราะออกแบบมาให้สนุกสำหรับทุกคน ค่าเช่าเบย์เริ่มต้นประมาณ 550 บาท/ชั่วโมง สำหรับผู้เล่นสูงสุด 5 คน เปิดทุกวัน 9:00-23:00 น. จึงเป็นที่หลบอากาศของกรุงเทพฯ ได้ทุกช่วงเวลา (ข้อมูล ณ กรกฎาคม 2026)',
      other_activities: [
        { name: 'Escape Room Bangkok', description: 'ห้องปริศนาตามธีมสำหรับกลุ่ม 2-6 คน ติดแอร์ ได้ใช้ความคิด และสนุก ราคา 500-800 บาทต่อคน', type: 'entertainment' },
        { name: 'Bowling at Blu-O', description: 'โบว์ลิ่งสมัยใหม่ในห้างใหญ่ มีเลนเรืองแสง เพลง และอาหาร ราคาเข้าถึงได้สำหรับครอบครัวและกลุ่มเพื่อน', type: 'entertainment' },
        { name: 'Jim Thompson House Museum', description: 'พิพิธภัณฑ์บ้านไทยโบราณที่สวยงาม ใกล้ BTS สนามกีฬาแห่งชาติ ห้องจัดแสดงติดแอร์ พร้อมทัวร์พาชม', type: 'museum' },
        { name: 'VR Gaming (Zero Latency)', description: 'ประสบการณ์เสมือนจริงแบบเคลื่อนไหวเต็มตัวสำหรับกลุ่ม ล้ำสมัยและสมจริง อยู่ย่านสุขุมวิท', type: 'entertainment' },
        { name: 'SEA LIFE Bangkok Ocean World', description: 'พิพิธภัณฑ์สัตว์น้ำขนาดใหญ่ใต้สยามพารากอน เหมาะกับครอบครัวและวันฝนตก เปิด 10:00-21:00 น.', type: 'attraction' },
        { name: 'Bangkok Art and Culture Centre (BACC)', description: 'หอศิลป์ร่วมสมัยเข้าชมฟรีหลายชั้น ใกล้ BTS สนามกีฬาแห่งชาติ', type: 'museum' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'ทุกคนที่มองหากิจกรรมติดแอร์ในกรุงเทพฯ',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'ติดแอร์', lengolf: 'ใช่ อยู่ในร่มทั้งหมด', alternative: 'ใช่ ทุกที่ในรายการอยู่ในร่ม' },
        { feature: 'เหมาะกับกลุ่ม', lengolf: 'สูงสุด 5 คนต่อเบย์ และมีแพ็กเกจอีเวนต์รองรับ 25 คน', alternative: 'แล้วแต่ที่ ห้องปริศนาจำกัดที่ 6 คน' },
        { feature: 'อาหารและเครื่องดื่ม', lengolf: 'บาร์ครบวงจรพร้อมเมนูอาหาร', alternative: 'มีศูนย์อาหารในห้างใกล้เคียง' },
        { feature: 'ระยะเวลากิจกรรม', lengolf: '1-3 ชั่วโมง', alternative: 'ปกติ 1-2 ชั่วโมง' },
        { feature: 'ใกล้ BTS', lengolf: 'BTS ชิดลม (ทางออก 4)', alternative: 'ส่วนใหญ่อยู่ในห้าง เดินทางด้วย BTS ได้' },
        { feature: 'ราคาเริ่มต้น', lengolf: 'ประมาณ 110 บาท/คน/ชั่วโมง (กลุ่ม 5 คน)', alternative: '200-800 บาทต่อคน' },
      ],
    },
  },

  // ─── JA: indoor-activities-bangkok ───
  // 35℃以上, 5〜10月の雨季, 約550THB/時（最大5名）, 9時〜23時, 500〜800THB（脱出ゲーム）,
  // 10時〜21時（SEA LIFE）, 25名までのイベントパッケージ and the 200〜800THB
  // alternative band all trace to the EN entry. related_slugs unchanged.
  {
    id: 'act-7-ja',
    page_type: 'activity_occasion',
    slug: 'indoor-activities-bangkok',
    title: 'バンコクの屋内アクティビティ — 冷房の効いた過ごし方',
    meta_description:
      'バンコクの暑さと雨をしのげる屋内アクティビティを厳選。ゴルフシミュレーター、脱出ゲーム、ボウリング、美術館まで、いずれも冷房が効いた場所ばかりです。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'weather',
    locale: 'ja',
    related_slugs: ['/activities/rainy-day-activities-bangkok', '/activities/weekend-activities-bangkok', '/activities/family-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'indoor',
      intro:
        'バンコクの暑さ（35℃以上）と雨（5〜10月の雨季）を考えると、屋内アクティビティは欠かせません。スコールをしのぐときも、日中の強い日差しを避けるときも同じです。ゴルフシミュレーターや脱出ゲームから、美術館、ボウリングまで、冷房の効いたバンコクの過ごし方をまとめました。',
      why_lengolf:
        'LENGOLFは、BTSチットロム駅直結のザ・マーキュリービルにある本格的なインドアゴルフシミュレーターバーです。全館冷房完備で、Bravo Golfシミュレーター、カクテルバー、フードメニューが揃っています。ゴルフの経験は不要で、どなたでも楽しめる設計です。ベイのレンタルは最大5名まで1時間約550THBから。営業は毎日9時から23時までなので、時間帯を問わずバンコクの天気から逃げ込めます（2026年7月現在）。',
      other_activities: [
        { name: 'Escape Room Bangkok', description: '2〜6名向けのテーマ別の謎解きルーム。冷房が効いていて頭を使う楽しさがあり、料金は1人500〜800THBです。', type: 'entertainment' },
        { name: 'Bowling at Blu-O', description: '大型モール内のモダンなボウリング場。光るレーンと音楽、食事も揃い、家族連れにもグループにも手頃です。', type: 'entertainment' },
        { name: 'Jim Thompson House Museum', description: 'BTSナショナルスタジアム駅近くにある、美しいタイ伝統家屋の博物館。冷房の効いた展示室とガイドツアーがあります。', type: 'museum' },
        { name: 'VR Gaming (Zero Latency)', description: 'グループで体を使って遊ぶVR体験。近未来的で没入感があり、スクンビットエリアにあります。', type: 'entertainment' },
        { name: 'SEA LIFE Bangkok Ocean World', description: 'サイアムパラゴンの地下にある大型水族館。家族連れにも雨の日にも向いています。営業は10時から21時までです。', type: 'attraction' },
        { name: 'Bangkok Art and Culture Centre (BACC)', description: '複数フロアにわたる現代アートのギャラリーを無料で見られます。BTSナショナルスタジアム駅の近くです。', type: 'museum' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'バンコクで冷房の効いた過ごし方を探している方',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '冷房', lengolf: '完全屋内で完備', alternative: '掲載しているものはすべて屋内' },
        { feature: 'グループ対応', lengolf: '1ベイ最大5名、25名までのイベントパッケージあり', alternative: 'まちまち。脱出ゲームは6名まで' },
        { feature: '飲食', lengolf: 'フルバーとフードメニュー', alternative: '近くのモール内フードコートを利用' },
        { feature: '所要時間', lengolf: '1〜3時間', alternative: '1〜2時間が目安' },
        { feature: 'BTSからの近さ', lengolf: 'BTSチットロム駅（4番出口）', alternative: '多くはモール内（BTSで行ける）' },
        { feature: '料金の下限', lengolf: '1人1時間あたり約110THB（5名の場合）', alternative: '1人あたり200〜800THB' },
      ],
    },
  },

  // ─── KO: indoor-activities-bangkok ───
  // 에어컨 나오는 놀거리 in the title is the KO framing of "air-conditioned fun".
  // Carried figures: 35°C 이상, 5~10월 우기, 시간당 약 550바트부터, 오전 9시~밤
  // 11시, 1인 500~800바트(방탈출), 오전 10시~밤 9시(SEA LIFE), 1~3시간.
  // 스크린골프 is not used here — the EN frames LENGOLF as a simulator bar.
  {
    id: 'act-7-ko',
    page_type: 'activity_occasion',
    slug: 'indoor-activities-bangkok',
    title: '방콕 실내 액티비티 — 에어컨 나오는 놀거리',
    meta_description:
      '방콕의 더위와 비를 피할 실내 액티비티를 모았어요. 골프 시뮬레이터, 방탈출, 볼링, 박물관까지 전부 에어컨이 나오는 곳이에요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'weather',
    locale: 'ko',
    related_slugs: ['/activities/rainy-day-activities-bangkok', '/activities/weekend-activities-bangkok', '/activities/family-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'indoor',
      intro:
        '방콕의 더위(35°C 이상)와 비(5~10월 우기) 때문에 실내 액티비티는 선택이 아니라 필수예요. 쏟아지는 비를 피하든 한낮의 뙤약볕을 피하든, 에어컨이 나오는 방콕의 놀거리를 골프 시뮬레이터와 방탈출부터 박물관과 볼링까지 정리했어요.',
      why_lengolf:
        'LENGOLF는 BTS 칫롬역 The Mercury Ville에 있는 프리미엄 실내 골프 시뮬레이터 바예요. 공간 전체에 에어컨이 나오고 Bravo 골프 시뮬레이터와 칵테일 바, 음식 메뉴를 갖췄어요. 골프 경험이 없어도 누구나 즐길 수 있도록 만들어진 곳이에요. 베이 이용료는 최대 5명까지 시간당 약 550바트부터고, 매일 오전 9시부터 밤 11시까지 열어서 하루 중 어느 시간대든 방콕 날씨를 피하기 좋아요 (2026년 7월 기준).',
      other_activities: [
        { name: 'Escape Room Bangkok', description: '2~6명이 들어가는 테마 퍼즐 룸이에요. 에어컨이 나오고 머리를 쓰는 재미가 있어요. 1인당 500~800바트예요.', type: 'entertainment' },
        { name: 'Blu-O 볼링', description: '주요 쇼핑몰 안의 현대식 볼링장이에요. 야광 레인과 음악, 음식이 있고 가족이나 단체에게 부담 없는 가격이에요.', type: 'entertainment' },
        { name: 'Jim Thompson House Museum', description: 'BTS National Stadium역 근처의 태국 전통 가옥 박물관이에요. 에어컨이 나오는 전시실에서 가이드 투어도 받을 수 있어요.', type: 'museum' },
        { name: 'VR 게임 (Zero Latency)', description: '온몸을 쓰는 가상현실 체험을 단체로 즐겨요. 미래적이고 몰입감이 커요. Sukhumvit 지역에 있어요.', type: 'entertainment' },
        { name: 'SEA LIFE Bangkok Ocean World', description: 'Siam Paragon 지하의 대형 수족관이에요. 가족 나들이와 비 오는 날에 좋아요. 오전 10시부터 밤 9시까지 열어요.', type: 'attraction' },
        { name: 'Bangkok Art and Culture Centre (BACC)', description: '여러 층에 걸친 현대 미술 전시를 무료로 볼 수 있어요. BTS National Stadium역 근처예요.', type: 'museum' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '방콕에서 에어컨 나오는 실내 놀거리를 찾는 모든 분',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '에어컨', lengolf: '완비 — 완전 실내', alternative: '완비 — 위 목록 모두 실내' },
        { feature: '단체 적합', lengolf: '베이당 최대 5명, 25명까지 이벤트 패키지', alternative: '제각각 — 방탈출은 6명까지' },
        { feature: '식음료', lengolf: '바와 음식 메뉴 완비', alternative: '근처 몰 푸드코트 이용' },
        { feature: '소요 시간', lengolf: '1~3시간', alternative: '보통 1~2시간' },
        { feature: 'BTS 접근성', lengolf: 'BTS 칫롬역(4번 출구)', alternative: '대부분 쇼핑몰 안 (BTS로 접근 가능)' },
        { feature: '시작 요금', lengolf: '시간당 1인 약 110바트 (5명 그룹)', alternative: '1인 200~800바트' },
      ],
    },
  },

  // ─── ZH: indoor-activities-bangkok ───
  // Figures trace to EN act-7 (35°C以上, 5–10月雨季, 每小时约550泰铢／最多5人,
  // 9:00–23:00, 密室逃脱每人500–800泰铢, SEA LIFE 10:00–21:00, 1–3小时,
  // 人均约110泰铢, 每人200–800泰铢, 4号出口); LENGOLF price carries 截至2026年7月.
  // 暹罗海洋世界 and 吉姆·汤普森故居 are the established Chinese renderings and
  // are glossed once each; BACC kept as its Latin acronym.
  {
    id: 'act-7-zh',
    page_type: 'activity_occasion',
    slug: 'indoor-activities-bangkok',
    title: '曼谷室内活动推荐 — 有空调的避暑与避雨去处',
    meta_description:
      '曼谷高温加上5–10月雨季，室内活动几乎是必需品。高尔夫模拟器、密室逃脱、保龄球、博物馆与水族馆——全都有空调，随时能去。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'weather',
    locale: 'zh',
    related_slugs: ['/activities/rainy-day-activities-bangkok', '/activities/weekend-activities-bangkok', '/activities/family-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'indoor',
      intro:
        '曼谷的高温（35°C以上）和降雨（5到10月雨季）让室内活动几乎成了必需品。不管你是在躲一场暴雨还是躲正午的太阳，以下都是曼谷最值得去的空调场所——从高尔夫模拟器、密室逃脱，到博物馆和保龄球馆。',
      why_lengolf:
        'LENGOLF是位于Mercury Ville、BTS Chidlom旁的高品质室内高尔夫模拟器酒吧。全场空调，配备Bravo高尔夫模拟器、鸡尾酒吧和餐点菜单。不需要高尔夫经验——这里本来就是为让所有人都玩得开心而设计的。球位租用每小时约550泰铢起，最多5人，截至2026年7月。每天9:00至23:00营业，任何时段都能用来躲开曼谷的天气。',
      other_activities: [
        { name: 'Escape Room Bangkok', description: '主题解谜房间，适合2到6人。有空调、烧脑又好玩，每人500–800泰铢。', type: 'entertainment' },
        { name: 'Bowling at Blu-O', description: '开在大型商场里的现代化保龄球馆，有夜光球道、音乐和餐点，家庭和团体都负担得起。', type: 'entertainment' },
        { name: 'Jim Thompson House Museum', description: '吉姆·汤普森故居博物馆，是一座漂亮的泰式传统住宅，靠近BTS National Stadium站。展厅有空调，并提供导览。', type: 'museum' },
        { name: 'VR Gaming (Zero Latency)', description: '面向团体的全身式虚拟现实体验，科技感和沉浸感都很强。位于Sukhumvit一带。', type: 'entertainment' },
        { name: 'SEA LIFE Bangkok Ocean World', description: '位于Siam Paragon地下的大型水族馆（暹罗海洋世界），很适合家庭和雨天，10:00至21:00开放。', type: 'attraction' },
        { name: 'Bangkok Art and Culture Centre (BACC)', description: '免费开放的当代艺术展馆，展览分布在多个楼层。靠近BTS National Stadium站。', type: 'museum' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '任何想在曼谷找有空调场所活动的人',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '有空调', lengolf: '有——完全在室内', alternative: '有——列出的都是室内场所' },
        { feature: '适合团体', lengolf: '每个球位最多5人，活动套餐可容纳25人', alternative: '各家不同——密室逃脱上限6人' },
        { feature: '餐饮', lengolf: '全套吧台与餐点菜单', alternative: '附近有商场美食广场' },
        { feature: '活动时长', lengolf: '1–3小时', alternative: '通常1–2小时' },
        { feature: '邻近BTS', lengolf: 'BTS Chidlom（4号出口）', alternative: '多数开在商场里（BTS可达）' },
        { feature: '起步价格', lengolf: '人均每小时约110泰铢（5人同行）', alternative: '每人200–800泰铢' },
      ],
    },
  },
  {
    id: 'act-8',
    page_type: 'activity_occasion',
    slug: 'weekend-activities-bangkok',
    title: 'Weekend Activities in Bangkok | Markets, Golf & Dining',
    meta_description:
      'The best weekend activities in Bangkok: Chatuchak market mornings, golf simulators, and riverside dining. How to plan a full Saturday or Sunday without melting.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'general',
    locale: 'en',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/family-activities-bangkok', '/activities/things-to-do-bangkok-at-night'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'weekend',
      intro:
        'Bangkok weekends are for exploring — but the heat means you need a mix of outdoor mornings and indoor afternoons. Here are the best weekend activities in Bangkok, organized from morning to evening, so you can plan a full day without melting.',
      why_lengolf:
        'LENGOLF is ideal for a weekend afternoon or evening activity. Open 9am-11pm on weekends, with bay rates starting at ~750 THB/hour (up to 5 people) on Saturdays and Sundays. Located at Mercury Ville, BTS Chidlom, it\'s easy to combine with lunch or dinner nearby. The air-conditioned venue is a welcome break from Bangkok\'s weekend heat.',
      other_activities: [
        { name: 'Chatuchak Weekend Market', description: 'The world\'s largest weekend market with 15,000+ stalls. Open Saturday and Sunday 8am-6pm. BTS Mo Chit.', type: 'market' },
        { name: 'Lumphini Park Morning Run', description: 'Bangkok\'s central park is best before 8am when it\'s cool. Monitor lizards, paddle boats, and tai chi groups.', type: 'outdoor' },
        { name: 'Brunch at The Commons', description: 'Popular weekend brunch spot in Thong Lo with multiple restaurants and a chill atmosphere.', type: 'dining' },
        { name: 'ICONSIAM Riverside', description: 'Massive riverside mall with the floating market inside. Weekend performances and events. BTS to Gold Line.', type: 'shopping' },
        { name: 'Spa Day', description: 'Book a weekend spa package. Let\'s Relax, Divana, and COMO Shambhala are popular choices at various price points.', type: 'wellness' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'Weekend planners looking for activities',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'Weather-proof', lengolf: 'Fully indoor, air-conditioned', alternative: 'Markets and parks are outdoor' },
        { feature: 'Afternoon-friendly', lengolf: 'Perfect 2-5pm (escape the heat)', alternative: 'Chatuchak best before noon' },
        { feature: 'Group-friendly', lengolf: 'Great for weekend catch-ups', alternative: 'Markets/parks are go-at-your-pace' },
        { feature: 'Weekend pricing', lengolf: '~750 THB/hour (up to 5 people)', alternative: 'Free-2,000 THB depending on activity' },
        { feature: 'Easy to reach', lengolf: 'BTS Chidlom (2 min walk)', alternative: 'Chatuchak is 30 min by BTS' },
      ],
    },
  },

  // ─── TH: weekend-activities-bangkok ───
  // Weekend bay rate is 750 บาท/ชม. here, NOT the 550 used on the other pages —
  // carried from this entry's own why_lengolf and comparison_table, not
  // harmonized. Chatuchak 15,000+ ร้าน / 8:00-18:00 น. and the 2-นาที walk and
  // 30-นาที BTS ride are all this entry's own figures.
  {
    id: 'act-8-th',
    page_type: 'activity_occasion',
    slug: 'weekend-activities-bangkok',
    title: 'กิจกรรมวันหยุดสุดสัปดาห์ในกรุงเทพฯ | ตลาด กอล์ฟ และร้านอาหาร',
    meta_description:
      'กิจกรรมสุดสัปดาห์ในกรุงเทพฯ ที่น่าไป ทั้งตลาดนัดจตุจักรตอนเช้า กอล์ฟซิมูเลเตอร์ และร้านอาหารริมน้ำ พร้อมวิธีจัดแผนเสาร์อาทิตย์ทั้งวันโดยไม่ต้องทนร้อน',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'general',
    locale: 'th',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/family-activities-bangkok', '/activities/things-to-do-bangkok-at-night'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'weekend',
      intro:
        'วันหยุดสุดสัปดาห์ในกรุงเทพฯ เป็นเวลาสำหรับออกไปสำรวจเมือง แต่ด้วยอากาศร้อน คุณควรผสมกิจกรรมกลางแจ้งช่วงเช้าเข้ากับกิจกรรมในร่มช่วงบ่าย นี่คือกิจกรรมสุดสัปดาห์ที่ดีที่สุดในกรุงเทพฯ เรียงจากเช้าจรดค่ำ เพื่อให้คุณวางแผนได้ทั้งวันโดยไม่ต้องทนร้อนจนหมดแรง',
      why_lengolf:
        'LENGOLF เหมาะกับกิจกรรมช่วงบ่ายหรือช่วงค่ำของวันหยุดสุดสัปดาห์ เปิด 9:00-23:00 น. ในวันเสาร์และวันอาทิตย์ โดยค่าเช่าเบย์วันเสาร์และวันอาทิตย์เริ่มต้นประมาณ 750 บาท/ชั่วโมง (ผู้เล่นสูงสุด 5 คน) ตั้งอยู่ที่ The Mercury Ville, BTS ชิดลม จึงจับคู่กับมื้อกลางวันหรือมื้อค่ำแถวนั้นได้ง่าย พื้นที่ติดแอร์ยังเป็นการพักจากอากาศร้อนของกรุงเทพฯ ช่วงสุดสัปดาห์ (ข้อมูล ณ กรกฎาคม 2026)',
      other_activities: [
        { name: 'Chatuchak Weekend Market', description: 'ตลาดนัดสุดสัปดาห์ที่ใหญ่ที่สุดในโลก มีร้านค้ากว่า 15,000 ร้าน เปิดวันเสาร์และวันอาทิตย์ 8:00-18:00 น. ลง BTS หมอชิต', type: 'market' },
        { name: 'Lumphini Park Morning Run', description: 'สวนสาธารณะใจกลางกรุงเทพฯ ดีที่สุดก่อน 8:00 น. ตอนอากาศยังเย็น มีทั้งตัวเงินตัวทอง เรือถีบ และกลุ่มรำไทเก๊ก', type: 'outdoor' },
        { name: 'Brunch at The Commons', description: 'จุดบรันช์ยอดนิยมช่วงสุดสัปดาห์ย่านทองหล่อ มีร้านอาหารหลายร้านและบรรยากาศสบายๆ', type: 'dining' },
        { name: 'ICONSIAM Riverside', description: 'ห้างริมแม่น้ำขนาดใหญ่ที่มีตลาดน้ำอยู่ข้างใน มีการแสดงและอีเวนต์ช่วงสุดสัปดาห์ นั่ง BTS ต่อรถไฟฟ้าสายสีทอง', type: 'shopping' },
        { name: 'Spa Day', description: 'จองแพ็กเกจสปาช่วงสุดสัปดาห์ ตัวเลือกยอดนิยมมีทั้ง Let\'s Relax, Divana และ COMO Shambhala ในหลายระดับราคา', type: 'wellness' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'คนที่กำลังวางแผนกิจกรรมช่วงวันหยุดสุดสัปดาห์',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'กันฝนกันแดด', lengolf: 'อยู่ในร่มทั้งหมด มีเครื่องปรับอากาศ', alternative: 'ตลาดและสวนสาธารณะอยู่กลางแจ้ง' },
        { feature: 'เหมาะกับช่วงบ่าย', lengolf: 'ดีที่สุดช่วง 14:00-17:00 น. (หนีแดด)', alternative: 'จตุจักรดีที่สุดก่อนเที่ยง' },
        { feature: 'เหมาะกับกลุ่ม', lengolf: 'ดีสำหรับนัดเจอเพื่อนช่วงสุดสัปดาห์', alternative: 'ตลาดและสวนเดินตามจังหวะของตัวเอง' },
        { feature: 'ราคาช่วงสุดสัปดาห์', lengolf: 'ประมาณ 750 บาท/ชั่วโมง (ผู้เล่นสูงสุด 5 คน)', alternative: 'ตั้งแต่ฟรีถึง 2,000 บาท แล้วแต่กิจกรรม' },
        { feature: 'เดินทางง่าย', lengolf: 'BTS ชิดลม (เดิน 2 นาที)', alternative: 'จตุจักรใช้เวลา 30 นาทีโดย BTS' },
      ],
    },
  },

  // ─── JA: weekend-activities-bangkok ───
  // Note the WEEKEND bay rate: EN gives 約750THB/時 here, not the 550 used on the
  // other pages — carried as-is, not harmonized. 15,000以上の店, 土日8時〜18時,
  // 8時前, 14〜17時, 徒歩2分, BTSで30分, 無料〜2,000THB all trace to EN.
  // Let\'s Relax / Divana / COMO Shambhala kept verbatim. related_slugs unchanged.
  {
    id: 'act-8-ja',
    page_type: 'activity_occasion',
    slug: 'weekend-activities-bangkok',
    title: 'バンコクの週末の過ごし方 — 市場・ゴルフ・川沿いの食事',
    meta_description:
      'バンコクの週末におすすめの過ごし方。チャトゥチャック市場の朝、ゴルフシミュレーター、川沿いのダイニングまで、暑さで消耗しない土日のプランをご提案します。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'general',
    locale: 'ja',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/family-activities-bangkok', '/activities/things-to-do-bangkok-at-night'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'weekend',
      intro:
        'バンコクの週末は街歩きの時間ですが、暑さを考えると、朝は屋外、午後は屋内という組み合わせが現実的です。ここでは、朝から夜までの流れに沿って、バンコクの週末におすすめの過ごし方をまとめました。バテずに1日を使いきるための順番です。',
      why_lengolf:
        'LENGOLFは、週末の午後や夜の過ごし方に向いています。土日も9時から23時まで営業し、ベイの料金は最大5名まで1時間約750THBから。BTSチットロム駅直結のザ・マーキュリービルにあるので、近くでのランチやディナーと組み合わせやすい立地です。冷房の効いた館内は、週末のバンコクの暑さからの避難場所になります（2026年7月現在）。',
      other_activities: [
        { name: 'Chatuchak Weekend Market', description: '15,000以上の店が集まる世界最大級のウィークエンドマーケット。土曜と日曜の8時から18時まで、BTSモーチット駅が最寄りです。', type: 'market' },
        { name: 'Lumphini Park Morning Run', description: 'バンコク中心部の公園は、涼しい8時前がいちばん快適です。ミズオオトカゲ、足こぎボート、太極拳のグループが見られます。', type: 'outdoor' },
        { name: 'Brunch at The Commons', description: 'トンローにある週末ブランチの人気スポット。複数のレストランが入り、のんびりした雰囲気です。', type: 'dining' },
        { name: 'ICONSIAM Riverside', description: '館内に水上マーケットを再現した、川沿いの巨大モール。週末はパフォーマンスやイベントもあります。BTSからゴールドラインで行けます。', type: 'shopping' },
        { name: 'Spa Day', description: '週末のスパパッケージを予約するのも手です。Let\'s Relax、Divana、COMO Shambhalaなど、価格帯もさまざまです。', type: 'wellness' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '週末の予定を立てている方',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '天候の影響', lengolf: '完全屋内で冷房完備', alternative: 'マーケットや公園は屋外' },
        { feature: '午後の向き不向き', lengolf: '14〜17時に最適（暑さを避けられる）', alternative: 'チャトゥチャックは正午前がおすすめ' },
        { feature: 'グループ向き', lengolf: '週末に集まるのにちょうどよい', alternative: 'マーケットや公園は各自のペース' },
        { feature: '週末の料金', lengolf: '1時間約750THB（最大5名）', alternative: '無料〜2,000THB（内容による）' },
        { feature: 'アクセスのしやすさ', lengolf: 'BTSチットロム駅から徒歩2分', alternative: 'チャトゥチャックはBTSで30分' },
      ],
    },
  },

  // ─── KO: weekend-activities-bangkok ───
  // NOTE the weekend rate: this EN entry quotes ~750 THB/hour, not the 550 the
  // other activity pages quote — a deliberate per-page divergence (weekend
  // pricing), carried as 시간당 약 750바트부터 and not harmonized.
  // Chatuchak / Lumphini Park / The Commons / ICONSIAM / Let\'s Relax / Divana /
  // COMO Shambhala kept verbatim Latin.
  {
    id: 'act-8-ko',
    page_type: 'activity_occasion',
    slug: 'weekend-activities-bangkok',
    title: '방콕 주말 액티비티 — 시장, 골프, 리버사이드',
    meta_description:
      '방콕 주말 액티비티를 오전 Chatuchak 시장, 오후 골프 시뮬레이터, 저녁 강변으로 정리했어요. 더위에 지치지 않고 토요일과 일요일을 채우는 방법이에요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'general',
    locale: 'ko',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/family-activities-bangkok', '/activities/things-to-do-bangkok-at-night'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'weekend',
      intro:
        '방콕의 주말은 돌아다니기 좋은 시간이지만, 더위 때문에 오전은 야외, 오후는 실내로 섞어야 버틸 수 있어요. 아침부터 저녁까지 순서대로 정리한 방콕 주말 액티비티예요. 이대로 따라가면 지치지 않고 하루를 꽉 채울 수 있어요.',
      why_lengolf:
        'LENGOLF는 주말 오후나 저녁 일정으로 잘 맞아요. 주말에도 오전 9시부터 밤 11시까지 열고, 토요일과 일요일 베이 요금은 최대 5명까지 시간당 약 750바트부터예요 (2026년 7월 기준). BTS 칫롬역 The Mercury Ville에 있어서 근처에서 점심이나 저녁을 붙이기 편해요. 에어컨이 나오는 실내라 방콕 주말의 더위를 피하기에도 좋아요.',
      other_activities: [
        { name: 'Chatuchak 주말 시장', description: '15,000개가 넘는 가판이 늘어선 세계 최대 규모의 주말 시장이에요. 토요일과 일요일 오전 8시부터 오후 6시까지 열고, BTS Mo Chit역에서 내려요.', type: 'market' },
        { name: 'Lumphini Park 아침 조깅', description: '방콕 도심 공원은 시원한 오전 8시 이전이 가장 좋아요. 물왕도마뱀과 오리배, 태극권 하는 분들을 볼 수 있어요.', type: 'outdoor' },
        { name: 'The Commons 브런치', description: 'Thong Lo에 있는 인기 주말 브런치 장소예요. 여러 레스토랑이 모여 있고 분위기가 느긋해요.', type: 'dining' },
        { name: 'ICONSIAM Riverside', description: '강변에 자리한 대형 쇼핑몰로 안에 수상시장이 들어와 있어요. 주말에는 공연과 이벤트가 열려요. BTS를 타고 Gold Line으로 갈아타면 돼요.', type: 'shopping' },
        { name: '스파 데이', description: '주말 스파 패키지를 예약해 보세요. Let\'s Relax, Divana, COMO Shambhala가 가격대별로 인기 있어요.', type: 'wellness' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '주말 일정을 짜는 분들',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '날씨 영향', lengolf: '완전 실내, 에어컨', alternative: '시장과 공원은 야외' },
        { feature: '오후 시간대', lengolf: '오후 2~5시에 딱 좋아요 (더위 피하기)', alternative: 'Chatuchak은 정오 이전이 좋아요' },
        { feature: '단체 적합', lengolf: '주말 모임에 잘 맞아요', alternative: '시장과 공원은 각자 속도대로' },
        { feature: '주말 요금', lengolf: '시간당 약 750바트 (최대 5명)', alternative: '무료~2,000바트, 액티비티에 따라' },
        { feature: '접근성', lengolf: 'BTS 칫롬역에서 도보 2분', alternative: 'Chatuchak은 BTS로 30분' },
      ],
    },
  },

  // ─── ZH: weekend-activities-bangkok ───
  // Figures trace to EN act-8 (周末9:00–23:00, 周六日每小时约750泰铢／最多5人,
  // Chatuchak 15,000个以上摊位、周六日8:00–18:00、BTS Mo Chit、搭BTS约30分钟,
  // Lumphini 8:00前, 14:00–17:00, 免费至2,000泰铢, BTS Chidlom步行2分钟);
  // LENGOLF weekend price carries 截至2026年7月. 恰图恰周末市场 / 伦披尼公园 /
  // 暹罗天地 are established Chinese renderings, glossed once each.
  // FLAGGED in the report: the EN pairs "~750 THB/hour" with "perfect 2-5pm",
  // which the published weekend rate card does not support — carried verbatim.
  {
    id: 'act-8-zh',
    page_type: 'activity_occasion',
    slug: 'weekend-activities-bangkok',
    title: '曼谷周末去哪玩 — 市集、室内高尔夫与河畔美食',
    meta_description:
      '曼谷周末怎么安排才不会被晒垮：上午逛恰图恰市场，下午躲进室内高尔夫，傍晚到河畔吃饭。一份从早到晚的周六日行程建议。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'general',
    locale: 'zh',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/family-activities-bangkok', '/activities/things-to-do-bangkok-at-night'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'weekend',
      intro:
        '曼谷的周末适合到处逛，但天气热意味着你得把户外的上午和室内的下午搭配着安排。以下是曼谷最值得一试的周末活动，按从早到晚的顺序排列，让你规划出完整的一天而不会被晒垮。',
      why_lengolf:
        'LENGOLF很适合安排在周末的下午或晚上。周末9:00至23:00营业，周六和周日的球位价格每小时约750泰铢起（最多5人），截至2026年7月。场馆位于Mercury Ville、BTS Chidlom旁，很容易和附近的午餐或晚餐串在一起。有空调的场地，正好从曼谷周末的高温里缓一口气。',
      other_activities: [
        { name: 'Chatuchak Weekend Market', description: '恰图恰周末市场，全球最大的周末市集，摊位超过15,000个。周六和周日8:00至18:00营业，BTS Mo Chit站。', type: 'market' },
        { name: 'Lumphini Park Morning Run', description: '伦披尼公园是曼谷的中央公园，8:00前最凉快。园内有巨蜥、脚踏船和打太极的人群。', type: 'outdoor' },
        { name: 'Brunch at The Commons', description: 'Thong Lo一带很受欢迎的周末早午餐去处，聚集多家餐厅，氛围轻松。', type: 'dining' },
        { name: 'ICONSIAM Riverside', description: '暹罗天地是一座临河的大型商场，内部还有一个室内水上市场。周末有演出与活动，搭BTS转Gold Line可达。', type: 'shopping' },
        { name: 'Spa Day', description: '订一份周末水疗套餐。Let\'s Relax、Divana和COMO Shambhala都是常见选择，价位覆盖面很广。', type: 'wellness' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '正在安排周末行程的人',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '不受天气影响', lengolf: '完全室内，有空调', alternative: '市集和公园都在户外' },
        { feature: '适合下午', lengolf: '14:00–17:00最合适（避开高温）', alternative: '恰图恰市场最好中午前去' },
        { feature: '适合团体', lengolf: '很适合周末聚会', alternative: '市集与公园可自己掌握节奏' },
        { feature: '周末价格', lengolf: '每小时约750泰铢（最多5人）', alternative: '免费至2,000泰铢，视活动而定' },
        { feature: '交通方便', lengolf: 'BTS Chidlom（步行2分钟）', alternative: '恰图恰搭BTS约30分钟' },
      ],
    },
  },
  {
    id: 'act-9',
    page_type: 'activity_occasion',
    slug: 'golf-simulator-for-non-golfers',
    title: 'Fun Things for Non-Golfers at a Golf Simulator',
    meta_description:
      'Never played golf? Golf simulators are designed to be fun for everyone. Here\'s why non-golfers love indoor golf — and what to expect on your first visit.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'education',
    locale: 'en',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/date-night-ideas-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'non-golfer',
      intro:
        'You don\'t need to know anything about golf to have fun at a golf simulator. Modern simulators like Bravo are designed to be entertaining for complete beginners — with games, virtual courses, and instant feedback on every swing. At venues like LENGOLF, the bar atmosphere makes it social, not serious.',
      why_lengolf:
        'LENGOLF is built for non-golfers as much as golfers. Our Bravo golf simulators show ball flight, distance, and accuracy in real-time — it\'s satisfying even on your first swing. We provide club rentals — standard sets are included free with bay rental — so you don\'t need to bring anything. The bar atmosphere means it\'s about having fun with friends, not perfecting your technique. Staff can help you get started in 2 minutes.',
      other_activities: [
        { name: 'Closest to the Pin Challenge', description: 'Simple target game — whoever hits closest to the pin on a virtual par-3 wins. No experience needed.', type: 'game' },
        { name: 'Longest Drive Competition', description: 'Just swing hard. The simulator tracks exact distance. Great for competitive groups.', type: 'game' },
        { name: 'Virtual Course Play', description: 'Play famous courses like Pebble Beach or St Andrews. The simulator does all the scoring.', type: 'game' },
        { name: 'Cocktails & Swings', description: 'Alternate between swings and cocktails. The social format is the whole point for non-golfers.', type: 'social' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'Non-golfers considering visiting a golf simulator',
      show_aqi_widget: false,
      comparison_table: [
        { feature: 'Experience required', lengolf: 'None — staff help you start', alternative: 'N/A' },
        { feature: 'Equipment needed', lengolf: 'All provided (included in price)', alternative: 'N/A' },
        { feature: 'Fun without skill', lengolf: 'Yes — games are designed for it', alternative: 'N/A' },
        { feature: 'Social atmosphere', lengolf: 'Bar setting, music, cocktails', alternative: 'N/A' },
        { feature: 'Time commitment', lengolf: '1 hour minimum, no maximum', alternative: 'N/A' },
      ],
    },
  },

  // ─── TH: golf-simulator-for-non-golfers ───
  // No price figures in the EN entry, so no as-of marker is carried.
  // The EN why_lengolf says "premium club rentals (included with bay rental)",
  // which contradicts /golf-club-rental (premium tier from 150 THB/hr); TH says
  // only that clubs are provided with the bay — the narrower, safer claim.
  // The EN 'N/A' alternative cells become 'ไม่มีตัวเปรียบเทียบ'.
  {
    id: 'act-9-th',
    page_type: 'activity_occasion',
    slug: 'golf-simulator-for-non-golfers',
    title: 'กอล์ฟซิมูเลเตอร์สำหรับคนไม่เล่นกอล์ฟ | สนุกได้แม้ไม่เคยจับไม้',
    meta_description:
      'ไม่เคยเล่นกอล์ฟก็สนุกได้ กอล์ฟซิมูเลเตอร์ออกแบบมาให้ทุกคนเล่นได้ นี่คือเหตุผลที่คนไม่เล่นกอล์ฟชอบกอล์ฟในร่ม และสิ่งที่จะได้เจอในการมาครั้งแรก',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'education',
    locale: 'th',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/date-night-ideas-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'non-golfer',
      intro:
        'คุณไม่จำเป็นต้องรู้เรื่องกอล์ฟเลยก็สนุกกับกอล์ฟซิมูเลเตอร์ได้ ซิมูเลเตอร์สมัยใหม่อย่าง Bravo Golf ออกแบบมาให้คนที่ไม่เคยเล่นเลยก็สนุกไปกับมันได้ ทั้งเกม สนามเสมือนจริง และข้อมูลป้อนกลับทันทีในทุกช็อต ที่สถานที่อย่าง LENGOLF บรรยากาศแบบบาร์ทำให้เป็นเรื่องของการสังสรรค์ ไม่ใช่เรื่องจริงจัง',
      why_lengolf:
        'LENGOLF สร้างมาเพื่อคนที่ไม่เล่นกอล์ฟพอๆ กับคนที่เล่นกอล์ฟเป็น ซิมูเลเตอร์ Bravo Golf แสดงวิถีลูก ระยะ และความแม่นยำแบบเรียลไทม์ จึงให้ความรู้สึกดีตั้งแต่สวิงแรก มีไม้กอล์ฟให้ใช้พร้อมกับการจองเบย์ คุณจึงไม่ต้องเตรียมอะไรมาเอง บรรยากาศแบบบาร์ทำให้เรื่องหลักคือความสนุกกับเพื่อน ไม่ใช่การฝึกท่าสวิงให้สมบูรณ์แบบ ทีมงานช่วยให้คุณเริ่มเล่นได้ภายใน 2 นาที',
      other_activities: [
        { name: 'Closest to the Pin Challenge', description: 'เกมเล็งเป้าง่ายๆ ใครตีลงใกล้ธงที่สุดบนหลุมพาร์ 3 เสมือนจริงคนนั้นชนะ ไม่ต้องมีประสบการณ์', type: 'game' },
        { name: 'Longest Drive Competition', description: 'แค่ตีให้แรง ซิมูเลเตอร์วัดระยะให้แม่นยำ เหมาะกับกลุ่มที่ชอบแข่งขัน', type: 'game' },
        { name: 'Virtual Course Play', description: 'เล่นสนามดังอย่าง Pebble Beach หรือ St Andrews โดยซิมูเลเตอร์คิดคะแนนให้ทั้งหมด', type: 'game' },
        { name: 'Cocktails & Swings', description: 'สลับระหว่างการสวิงกับการจิบค็อกเทล รูปแบบสังสรรค์แบบนี้คือหัวใจสำหรับคนที่ไม่เล่นกอล์ฟ', type: 'social' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'คนที่ไม่เล่นกอล์ฟและกำลังคิดจะไปลองกอล์ฟซิมูเลเตอร์',
      show_aqi_widget: false,
      comparison_table: [
        { feature: 'ต้องมีประสบการณ์ไหม', lengolf: 'ไม่ต้อง ทีมงานช่วยเริ่มให้', alternative: 'ไม่มีตัวเปรียบเทียบ' },
        { feature: 'ต้องเตรียมอุปกรณ์ไหม', lengolf: 'มีให้ครบ (รวมอยู่ในราคาแล้ว)', alternative: 'ไม่มีตัวเปรียบเทียบ' },
        { feature: 'สนุกได้แม้ไม่มีฝีมือ', lengolf: 'ได้ เกมออกแบบมาเพื่อสิ่งนี้', alternative: 'ไม่มีตัวเปรียบเทียบ' },
        { feature: 'บรรยากาศสังสรรค์', lengolf: 'บรรยากาศบาร์ มีเพลงและค็อกเทล', alternative: 'ไม่มีตัวเปรียบเทียบ' },
        { feature: 'ใช้เวลานานแค่ไหน', lengolf: 'ขั้นต่ำ 1 ชั่วโมง ไม่จำกัดสูงสุด', alternative: 'ไม่มีตัวเปรียบเทียบ' },
      ],
    },
  },

  // ─── JA: golf-simulator-for-non-golfers ───
  // The only entry with no price figure, so it deliberately carries NO as-of
  // marker (nothing to date). DEVIATION, flagged for review: other_activities
  // here are GAME labels, not Bangkok businesses, so the brief\'s verbatim-name
  // rule does not fit — they are rendered in JA with the English kept in parens.
  // ニアピン and ドラコン are the standard JA golf terms for these two games.
  // related_slugs unchanged — all three are in the ja allowlist.
  {
    id: 'act-9-ja',
    page_type: 'activity_occasion',
    slug: 'golf-simulator-for-non-golfers',
    title: 'ゴルフ未経験でも楽しめる？ — ゴルフシミュレーターの遊び方',
    meta_description:
      'ゴルフをしたことがなくても大丈夫。ゴルフシミュレーターは誰でも楽しめるように作られています。未経験の方がインドアゴルフを楽しめる理由と、初めての来店で知っておきたいことをご紹介します。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'education',
    locale: 'ja',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/date-night-ideas-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'non-golfer',
      intro:
        'ゴルフシミュレーターを楽しむのに、ゴルフの知識は要りません。Bravo Golfのような最新のシミュレーターは、まったくの初心者でも面白く遊べるように作られていて、ゲーム、バーチャルコース、1打ごとのその場でのフィードバックが用意されています。LENGOLFのような店ならバーの雰囲気があるので、堅苦しくならず、みんなでわいわい過ごせます。',
      why_lengolf:
        'LENGOLFは、ゴルファーと同じくらい未経験の方を想定して作られています。Bravo Golfシミュレーターはボールの弾道、飛距離、方向をリアルタイムに表示するので、初めての1打でも手応えがあります。クラブのレンタルはベイの料金に含まれ、スタンダードセットは無料なので、道具を持ち込む必要はありません。バーの雰囲気なので、技術を磨く場ではなく、友人と楽しむ場です。始め方はスタッフが2分ほどでご案内します。',
      other_activities: [
        { name: 'ニアピンチャレンジ（Closest to the Pin）', description: 'バーチャルのパー3で、ピンにいちばん近づけた人の勝ちというシンプルな的当てゲーム。経験は要りません。', type: 'game' },
        { name: 'ドラコン対決（Longest Drive）', description: 'とにかく思い切り振るだけ。シミュレーターが飛距離を正確に計測します。競い合うのが好きなグループにぴったりです。', type: 'game' },
        { name: 'バーチャルコースでのラウンド（Virtual Course Play）', description: 'ペブルビーチやセントアンドリュースといった名門コースでプレーできます。スコアの計算はすべてシミュレーターが行います。', type: 'game' },
        { name: 'カクテル片手にスイング（Cocktails & Swings）', description: '打っては飲み、飲んでは打つ。未経験の方にとっては、この社交的な流れこそが本題です。', type: 'social' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'ゴルフシミュレーターに行ってみようか迷っている未経験の方',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '必要な経験', lengolf: '不要 — スタッフが始め方をご案内', alternative: '該当なし' },
        { feature: '必要な道具', lengolf: 'すべてご用意（料金に含まれます）', alternative: '該当なし' },
        { feature: '腕前がなくても楽しめるか', lengolf: '楽しめます — そのためのゲームがあります', alternative: '該当なし' },
        { feature: '場の雰囲気', lengolf: 'バー仕様。音楽とカクテルあり', alternative: '該当なし' },
        { feature: '所要時間', lengolf: '最短1時間、上限なし', alternative: '該当なし' },
      ],
    },
  },

  // ─── KO: golf-simulator-for-non-golfers ───
  // The four other_activities here are GAME names, not venues, so they are
  // localized — an untranslated "Closest to the Pin Challenge" would defeat the
  // page. Course names (Pebble Beach, St Andrews) stay verbatim. 스크린골프
  // appears once in the meta as the familiar KO frame; body uses 골프 시뮬레이터.
  // No prices in the EN entry, so none here and no as-of marker.
  {
    id: 'act-9-ko',
    page_type: 'activity_occasion',
    slug: 'golf-simulator-for-non-golfers',
    title: '골프 몰라도 재미있는 골프 시뮬레이터 — 첫 방문 가이드',
    meta_description:
      '골프를 한 번도 안 쳐 봤어도 괜찮아요. 골프 시뮬레이터는 누구나 즐기도록 만들어졌어요. 골프를 안 치는 사람들이 스크린골프를 좋아하는 이유와 첫 방문에서 알아둘 점을 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'education',
    locale: 'ko',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/date-night-ideas-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'non-golfer',
      intro:
        '골프를 전혀 몰라도 골프 시뮬레이터에서는 충분히 재미있게 놀 수 있어요. Bravo 같은 요즘 시뮬레이터는 완전 초보자도 즐기도록 만들어졌어요. 게임과 가상 코스가 있고, 스윙할 때마다 결과가 바로 화면에 떠요. LENGOLF 같은 곳은 바 분위기라서 진지하기보다 어울려 노는 자리에 가까워요.',
      why_lengolf:
        'LENGOLF는 골퍼만큼이나 골프를 안 치는 분들을 염두에 두고 만들어졌어요. Bravo 골프 시뮬레이터가 공의 궤적과 비거리, 정확도를 실시간으로 보여줘서 첫 스윙부터 보는 재미가 있어요. 스탠더드 클럽 대여가 베이 이용료에 무료로 포함돼 있어서 따로 챙겨 올 것도 없어요. 바 분위기라 기술을 다듬기보다 친구들과 즐기는 데 무게가 실려요. 스태프가 2분이면 시작하는 법을 알려드려요.',
      other_activities: [
        { name: '홀에 가장 가까이 붙이기', description: '가상 파3 홀에서 깃대에 가장 가까이 붙인 사람이 이기는 단순한 타깃 게임이에요. 경험이 없어도 돼요.', type: 'game' },
        { name: '최장 비거리 대결', description: '세게 휘두르기만 하면 돼요. 시뮬레이터가 정확한 거리를 재 줘요. 승부욕 있는 그룹에 잘 맞아요.', type: 'game' },
        { name: '가상 코스 라운딩', description: 'Pebble Beach나 St Andrews 같은 유명 코스에서 라운딩해요. 점수 계산은 시뮬레이터가 알아서 해요.', type: 'game' },
        { name: '칵테일과 스윙', description: '스윙 한 번, 칵테일 한 모금을 번갈아 가며 즐겨요. 골프를 안 치는 분들에게는 이렇게 어울리는 형식 자체가 핵심이에요.', type: 'social' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '골프 시뮬레이터 방문을 고민 중인 비골퍼',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '필요한 경험', lengolf: '없어요 — 스태프가 시작을 도와드려요', alternative: '해당 없음' },
        { feature: '준비물', lengolf: '전부 제공 (요금에 포함)', alternative: '해당 없음' },
        { feature: '실력 없이도 재미있는가', lengolf: '재미있어요 — 게임 자체가 그렇게 설계됐어요', alternative: '해당 없음' },
        { feature: '분위기', lengolf: '바 공간, 음악, 칵테일', alternative: '해당 없음' },
        { feature: '이용 시간', lengolf: '최소 1시간, 상한 없음', alternative: '해당 없음' },
      ],
    },
  },

  // ─── ZH: golf-simulator-for-non-golfers ───
  // Title front-loads 不会打高尔夫也能玩 — the way a Mainland reader phrases this
  // doubt. No prices in EN act-9, so no as-of marker is added (nothing to scope).
  // Figures trace to EN act-9 (店员2分钟带你上手, 最少1小时、上不封顶); the EN
  // "N/A" alternative cells render as 不适用. Pebble Beach / St Andrews / Bravo
  // kept Latin per the ZH transliteration note.
  {
    id: 'act-9-zh',
    page_type: 'activity_occasion',
    slug: 'golf-simulator-for-non-golfers',
    title: '不会打高尔夫也能玩 — 高尔夫模拟器新手体验指南',
    meta_description:
      '完全没打过高尔夫也没关系。现代高尔夫模拟器本来就是为新手设计的，有游戏、有虚拟球场、每一杆都有即时反馈。第一次去该期待什么，这里讲清楚。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'education',
    locale: 'zh',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/date-night-ideas-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'non-golfer',
      intro:
        '你完全不需要懂高尔夫，也能在高尔夫模拟器上玩得开心。像Bravo这样的现代模拟器，本来就是为零基础的人设计的——有游戏、有虚拟球场，每一次挥杆都会立刻给出反馈。在LENGOLF这样的场馆里，酒吧氛围让这件事变得轻松社交，而不是一本正经。',
      why_lengolf:
        'LENGOLF既为球友而设，也同样为不打球的人而设。我们的Bravo高尔夫模拟器会实时显示球路、距离和精准度——哪怕是你人生的第一杆，看着也很有成就感。店内提供标准套杆租借免费包含在球位租用里，你什么都不用带。酒吧氛围意味着重点是和朋友玩得开心，而不是把动作练标准。店员2分钟就能帮你上手。',
      other_activities: [
        { name: 'Closest to the Pin Challenge', description: '简单的目标游戏——在虚拟三杆洞上谁打得离旗杆最近谁就赢。零基础也能玩。', type: 'game' },
        { name: 'Longest Drive Competition', description: '尽管用力挥就是了，模拟器会记录准确距离。很适合好胜的团体。', type: 'game' },
        { name: 'Virtual Course Play', description: '打Pebble Beach或St Andrews这类名场，计分全部由模拟器完成。', type: 'game' },
        { name: 'Cocktails & Swings', description: '挥两杆，喝一口，再挥两杆。这种社交式的玩法，对不打球的人来说才是重点。', type: 'social' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '正在考虑体验高尔夫模拟器的非球友',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '需要经验吗', lengolf: '不需要——店员会带你上手', alternative: '不适用' },
        { feature: '需要自备装备吗', lengolf: '全部提供（已含在价格内）', alternative: '不适用' },
        { feature: '没有球技也能玩吗', lengolf: '可以——游戏就是为此设计的', alternative: '不适用' },
        { feature: '社交氛围', lengolf: '酒吧环境、音乐与鸡尾酒', alternative: '不适用' },
        { feature: '时间投入', lengolf: '最少1小时，上不封顶', alternative: '不适用' },
      ],
    },
  },
  {
    id: 'act-10',
    page_type: 'activity_occasion',
    slug: 'family-activities-bangkok',
    title: 'Family Activities in Bangkok | Things to Do with Kids',
    meta_description:
      'Looking for family activities in Bangkok? From kid-friendly golf simulators to aquariums and parks — the best things to do with children in Bangkok.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'family',
    locale: 'en',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/rainy-day-activities-bangkok', '/activities/weekend-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'family',
      intro:
        'Bangkok has plenty of family-friendly activities beyond temples and tuk-tuks. The key for families is finding air-conditioned venues where kids stay entertained — especially during the hot season. Here are the best family activities in Bangkok for children of all ages.',
      why_lengolf:
        'Kids love golf simulators. At LENGOLF, children can play alongside parents — the Bravo simulator technology tracks every swing and shows animated ball flights that kids find fascinating. It\'s safe, air-conditioned, and the bay format means your family has a private space. Bay rental is ~550 THB/hour for up to 5 people, and club rental is included. We welcome families during all hours, though weekday mornings are quietest.',
      other_activities: [
        { name: 'SEA LIFE Bangkok Ocean World', description: 'Massive aquarium under Siam Paragon with shark tanks, penguins, and interactive exhibits. Kids under 3 free.', type: 'attraction' },
        { name: 'KidZania Bangkok', description: 'Mini city where kids role-play adult jobs — pilot, firefighter, doctor. Ages 4-14. Located at Siam Paragon.', type: 'attraction' },
        { name: 'Lumphini Park', description: 'Central park with playgrounds, paddle boats, and giant monitor lizards that fascinate kids. Free entry.', type: 'outdoor' },
        { name: 'Art in Paradise', description: '3D interactive art museum that\'s a hit with kids. Take photos "inside" the paintings.', type: 'museum' },
        { name: 'Safari World Bangkok', description: 'Drive-through safari park with marine show. A full-day outing, 30 min from central Bangkok.', type: 'attraction' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'Families with children visiting or living in Bangkok',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'Kid-friendly', lengolf: 'Yes — kids love the tech', alternative: 'Most listed are family-oriented' },
        { feature: 'Air-conditioned', lengolf: 'Yes — fully indoor', alternative: 'Parks/Safari World are outdoor' },
        { feature: 'Private space', lengolf: 'Private bay for your family', alternative: 'Shared spaces at most venues' },
        { feature: 'Adults enjoy it too', lengolf: 'Bar + golf for parents', alternative: 'KidZania mainly for kids' },
        { feature: 'Price for family of 4', lengolf: '~550 THB/hour (all 4 play)', alternative: '600-3,000 THB total' },
      ],
    },
  },

  // ─── TH: family-activities-bangkok ───
  // Figures from the EN entry: 550 บาท/ชม. สูงสุด 5 คน, ครอบครัว 4 คน
  // ประมาณ 550 บาท/ชม., 600-3,000 บาท, KidZania อายุ 4-14 ปี, เด็กต่ำกว่า 3 ปี
  // เข้าฟรี, Safari World 30 นาที. The 'weekday mornings are quietest' hedge is
  // kept as a hedge (ช่วงเช้าวันธรรมดาจะเงียบที่สุด), not a promise of low crowds.
  {
    id: 'act-10-th',
    page_type: 'activity_occasion',
    slug: 'family-activities-bangkok',
    title: 'กิจกรรมครอบครัวในกรุงเทพฯ | ที่เที่ยวสำหรับเด็กและผู้ปกครอง',
    meta_description:
      'หากิจกรรมครอบครัวในกรุงเทพฯ อยู่ใช่ไหม ตั้งแต่กอล์ฟซิมูเลเตอร์ที่เด็กเล่นได้ ไปจนถึงพิพิธภัณฑ์สัตว์น้ำและสวนสาธารณะ รวมที่เที่ยวกับลูกที่น่าไปที่สุด',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'family',
    locale: 'th',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/rainy-day-activities-bangkok', '/activities/weekend-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'family',
      intro:
        'กรุงเทพฯ มีกิจกรรมสำหรับครอบครัวมากกว่าแค่วัดและตุ๊กตุ๊ก สิ่งสำคัญสำหรับครอบครัวคือการหาสถานที่ติดแอร์ที่เด็กๆ สนุกได้นานๆ โดยเฉพาะช่วงหน้าร้อน นี่คือกิจกรรมครอบครัวที่ดีที่สุดในกรุงเทพฯ สำหรับเด็กทุกวัย',
      why_lengolf:
        'เด็กๆ ชอบกอล์ฟซิมูเลเตอร์ ที่ LENGOLF เด็กเล่นไปพร้อมกับพ่อแม่ได้ เทคโนโลยีซิมูเลเตอร์ Bravo Golf บันทึกทุกสวิงและแสดงวิถีลูกแบบภาพเคลื่อนไหวที่เด็กๆ ดูแล้วตื่นตาตื่นใจ ปลอดภัย ติดแอร์ และรูปแบบเบย์ทำให้ครอบครัวของคุณมีพื้นที่ส่วนตัว ค่าเช่าเบย์ประมาณ 550 บาท/ชั่วโมง สำหรับผู้เล่นสูงสุด 5 คน โดยมีไม้กอล์ฟให้ใช้รวมอยู่ด้วย เรายินดีต้อนรับครอบครัวทุกช่วงเวลา แต่ช่วงเช้าวันธรรมดาจะเงียบที่สุด (ข้อมูล ณ กรกฎาคม 2026)',
      other_activities: [
        { name: 'SEA LIFE Bangkok Ocean World', description: 'พิพิธภัณฑ์สัตว์น้ำขนาดใหญ่ใต้สยามพารากอน มีทั้งตู้ฉลาม เพนกวิน และโซนกิจกรรมให้เด็กได้ลองเล่น เด็กอายุต่ำกว่า 3 ปีเข้าฟรี', type: 'attraction' },
        { name: 'KidZania Bangkok', description: 'เมืองจำลองที่เด็กได้สวมบทบาทอาชีพผู้ใหญ่ ทั้งนักบิน นักดับเพลิง และหมอ สำหรับอายุ 4-14 ปี ตั้งอยู่ที่สยามพารากอน', type: 'attraction' },
        { name: 'Lumphini Park', description: 'สวนสาธารณะใจกลางเมือง มีสนามเด็กเล่น เรือถีบ และตัวเงินตัวทองตัวใหญ่ที่เด็กๆ ชอบดู เข้าฟรี', type: 'outdoor' },
        { name: 'Art in Paradise', description: 'พิพิธภัณฑ์ภาพวาด 3 มิติที่เด็กๆ ชอบมาก ถ่ายรูปเหมือนเข้าไปอยู่ในภาพได้', type: 'museum' },
        { name: 'Safari World Bangkok', description: 'สวนสัตว์แบบขับรถชมพร้อมโชว์สัตว์น้ำ ใช้เวลาเที่ยวเต็มวัน ห่างจากใจกลางกรุงเทพฯ 30 นาที', type: 'attraction' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'ครอบครัวที่มีลูกซึ่งมาเที่ยวหรืออาศัยอยู่ในกรุงเทพฯ',
      show_aqi_widget: true,
      comparison_table: [
        { feature: 'เหมาะกับเด็ก', lengolf: 'ใช่ เด็กชอบเทคโนโลยีแบบนี้', alternative: 'ส่วนใหญ่ในรายการเน้นครอบครัวอยู่แล้ว' },
        { feature: 'ติดแอร์', lengolf: 'ใช่ อยู่ในร่มทั้งหมด', alternative: 'สวนสาธารณะและ Safari World อยู่กลางแจ้ง' },
        { feature: 'พื้นที่ส่วนตัว', lengolf: 'เบย์ส่วนตัวสำหรับครอบครัวคุณ', alternative: 'ส่วนใหญ่เป็นพื้นที่ใช้ร่วมกัน' },
        { feature: 'ผู้ใหญ่ก็สนุกด้วย', lengolf: 'มีบาร์และกอล์ฟสำหรับพ่อแม่', alternative: 'KidZania เน้นเด็กเป็นหลัก' },
        { feature: 'ราคาสำหรับครอบครัว 4 คน', lengolf: 'ประมาณ 550 บาท/ชั่วโมง (เล่นได้ครบทั้ง 4 คน)', alternative: 'รวม 600-3,000 บาท' },
      ],
    },
  },

  // ─── JA: family-activities-bangkok ───
  // Title targets バンコク 子連れ, which is how a Japanese parent searches this,
  // with 家族向けアクティビティ in the tail. 約550THB/時（最大5名）, クラブレンタル込み,
  // 平日の午前中が静か, 3歳未満無料, 4〜14歳, 中心部から30分, 600〜3,000THB all
  // trace to the EN entry. related_slugs unchanged — all in allowlist.
  {
    id: 'act-10-ja',
    page_type: 'activity_occasion',
    slug: 'family-activities-bangkok',
    title: 'バンコクの子連れでできること — 家族向けアクティビティ',
    meta_description:
      'バンコクで家族向けのアクティビティをお探しですか。子どもも遊べるゴルフシミュレーターから水族館、公園まで、子連れで楽しめるおすすめの場所をまとめました。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'family',
    locale: 'ja',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/rainy-day-activities-bangkok', '/activities/weekend-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'family',
      intro:
        'バンコクには、寺院やトゥクトゥク以外にも家族で楽しめる場所がたくさんあります。家族連れにとって大事なのは、冷房が効いていて子どもが飽きない場所を見つけること。暑季はとくにそうです。年齢を問わず楽しめる、バンコクの家族向けアクティビティをご紹介します。',
      why_lengolf:
        '子どもはゴルフシミュレーターをよろこびます。LENGOLFでは、お子様も保護者の方と並んでプレーできます。Bravo Golfのシミュレーター技術が1打ごとを計測し、ボールの弾道をアニメーションで見せるので、子どもは画面に釘付けです。安全で冷房も効いており、ベイ単位なのでご家族だけの空間になります。ベイのレンタルは最大5名まで1時間約550THBで、クラブレンタルも込み。どの時間帯もご家族を歓迎していますが、いちばん静かなのは平日の午前中です（2026年7月現在）。',
      other_activities: [
        { name: 'SEA LIFE Bangkok Ocean World', description: 'サイアムパラゴンの地下にある大型水族館。サメの水槽、ペンギン、体験型の展示があります。3歳未満は無料です。', type: 'attraction' },
        { name: 'KidZania Bangkok', description: 'パイロット、消防士、医師など、子どもが大人の仕事を体験できるミニチュアの街。対象は4〜14歳で、サイアムパラゴン内にあります。', type: 'attraction' },
        { name: 'Lumphini Park', description: '遊具、足こぎボート、子どもが釘付けになる大きなミズオオトカゲがいる中心部の公園。入場は無料です。', type: 'outdoor' },
        { name: 'Art in Paradise', description: '子どもに人気の3Dトリックアート美術館。絵の「中に入った」写真を撮れます。', type: 'museum' },
        { name: 'Safari World Bangkok', description: '車で回るサファリパークとマリンショー。バンコク中心部から30分ほどで、1日がかりのおでかけになります。', type: 'attraction' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'バンコクを訪れる、または暮らしている子育て世帯',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '子ども向きか', lengolf: '向いています — 機械の仕掛けに夢中になります', alternative: '掲載しているものはおおむね家族向け' },
        { feature: '冷房', lengolf: '完全屋内で完備', alternative: '公園やサファリワールドは屋外' },
        { feature: '専用の空間', lengolf: 'ご家族だけのベイ', alternative: '多くの施設は共用スペース' },
        { feature: '大人も楽しめるか', lengolf: '保護者にはバーとゴルフ', alternative: 'キッザニアは主に子ども向け' },
        { feature: '4人家族の料金', lengolf: '1時間約550THB（4人ともプレー可）', alternative: '合計600〜3,000THB' },
      ],
    },
  },

  // ─── KO: family-activities-bangkok ───
  // Title targets 아이와 갈 만한 곳, the KO parent query. Figures carried:
  // 시간당 약 550바트(최대 5명), 3세 미만 무료, 4~14세, 30분 거리, 총
  // 600~3,000바트. The EN hedge "weekday mornings are quietest" is kept as a
  // comparative, not a promise. Attraction names all verbatim Latin.
  {
    id: 'act-10-ko',
    page_type: 'activity_occasion',
    slug: 'family-activities-bangkok',
    title: '방콕 가족 액티비티 — 아이와 갈 만한 곳',
    meta_description:
      '방콕에서 아이와 갈 만한 곳을 찾는다면, 아이도 함께 칠 수 있는 골프 시뮬레이터부터 수족관, 공원까지 가족 액티비티를 모았어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'family',
    locale: 'ko',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/rainy-day-activities-bangkok', '/activities/weekend-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'family',
      intro:
        '방콕에는 사원과 툭툭 말고도 가족이 함께할 거리가 많아요. 가족 여행에서 중요한 건 아이들이 지루해하지 않으면서 에어컨이 나오는 곳을 찾는 일이고, 더운 시즌에는 특히 그래요. 나이대와 상관없이 아이와 함께 가기 좋은 방콕 액티비티를 정리했어요.',
      why_lengolf:
        '아이들은 골프 시뮬레이터를 좋아해요. LENGOLF에서는 아이가 부모와 나란히 칠 수 있어요. Bravo 시뮬레이터가 스윙을 하나하나 잡아내고 공이 날아가는 궤적을 화면에 그려 주는데, 아이들이 이걸 무척 신기해해요. 안전하고 에어컨이 나오며, 베이 구조라 가족만의 공간이 생겨요. 베이 이용료는 최대 5명까지 시간당 약 550바트고 클럽 대여가 포함돼요 (2026년 7월 기준). 영업시간 내내 가족 손님을 환영하지만, 가장 한산한 시간대는 평일 오전이에요.',
      other_activities: [
        { name: 'SEA LIFE Bangkok Ocean World', description: 'Siam Paragon 지하의 대형 수족관이에요. 상어 수조와 펭귄, 체험형 전시가 있어요. 3세 미만은 무료예요.', type: 'attraction' },
        { name: 'KidZania Bangkok', description: '아이들이 파일럿, 소방관, 의사 같은 어른 직업을 체험하는 미니 도시예요. 4~14세 대상이고 Siam Paragon 안에 있어요.', type: 'attraction' },
        { name: 'Lumphini Park', description: '놀이터와 오리배가 있는 도심 공원이고, 커다란 물왕도마뱀이 아이들의 눈길을 사로잡아요. 입장은 무료예요.', type: 'outdoor' },
        { name: 'Art in Paradise', description: '아이들에게 인기 많은 3D 트릭아트 미술관이에요. 그림 속에 들어간 것처럼 사진을 찍을 수 있어요.', type: 'museum' },
        { name: 'Safari World Bangkok', description: '차를 타고 통과하는 사파리 공원에 해양 쇼도 있어요. 방콕 시내에서 30분 거리이고 하루를 온전히 잡아야 해요.', type: 'attraction' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '방콕을 여행 중이거나 살고 있는, 아이가 있는 가족',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '아이 친화', lengolf: '좋아요 — 아이들이 기술을 신기해해요', alternative: '위 목록 대부분이 가족 대상' },
        { feature: '에어컨', lengolf: '완비 — 완전 실내', alternative: '공원과 Safari World는 야외' },
        { feature: '독립 공간', lengolf: '가족 전용 베이', alternative: '대부분 공용 공간' },
        { feature: '어른도 즐길 수 있는가', lengolf: '부모에게는 바와 골프', alternative: 'KidZania는 주로 아이 대상' },
        { feature: '4인 가족 요금', lengolf: '시간당 약 550바트 (4명 모두 플레이)', alternative: '총 600~3,000바트' },
      ],
    },
  },

  // ─── ZH: family-activities-bangkok ───
  // 亲子 is the Mainland search term for family activities; the title uses it.
  // Figures trace to EN act-10 (每小时约550泰铢／最多5人、含球杆租借,
  // 工作日上午最安静, KidZania 4–14岁, SEA LIFE 3岁以下免费, Safari World
  // 距市中心约30分钟, 四口之家每小时约550泰铢, 合计600–3,000泰铢);
  // LENGOLF price carries 截至2026年7月.
  {
    id: 'act-10-zh',
    page_type: 'activity_occasion',
    slug: 'family-activities-bangkok',
    title: '曼谷亲子活动推荐 — 带孩子去哪玩最合适',
    meta_description:
      '在曼谷带孩子出门玩什么好。从孩子也能上手的高尔夫模拟器，到水族馆、职业体验乐园和公园，这里整理了适合各年龄段孩子的曼谷亲子活动。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'family',
    locale: 'zh',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/rainy-day-activities-bangkok', '/activities/weekend-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'family',
      intro:
        '曼谷适合家庭的活动远不止寺庙和嘟嘟车。对带孩子的家庭来说，关键是找到有空调、又能让孩子一直有兴趣的场所——尤其是在热季。以下是曼谷最值得一去的亲子活动，适合各个年龄段的孩子。',
      why_lengolf:
        '孩子很喜欢高尔夫模拟器。在LENGOLF，孩子可以和父母一起打——Bravo模拟器会记录每一次挥杆，并把球的飞行轨迹用动画呈现出来，这一点特别吸引小朋友。场地安全、有空调，而球位的形式意味着一家人有自己的独立空间。球位租用每小时约550泰铢，最多5人，球杆租借已包含在内，截至2026年7月。我们全时段都欢迎家庭前来，其中工作日上午最安静。',
      other_activities: [
        { name: 'SEA LIFE Bangkok Ocean World', description: '位于Siam Paragon地下的大型水族馆，有鲨鱼池、企鹅和互动展区。3岁以下免费。', type: 'attraction' },
        { name: 'KidZania Bangkok', description: '一座迷你城市，孩子可以角色扮演各种成人职业——飞行员、消防员、医生。适合4到14岁，位于Siam Paragon。', type: 'attraction' },
        { name: 'Lumphini Park', description: '市中心的公园，有游乐场、脚踏船，还有让孩子看得入迷的巨蜥。免费入园。', type: 'outdoor' },
        { name: 'Art in Paradise', description: '3D互动艺术馆，孩子非常买账。可以拍出人“走进”画里的照片。', type: 'museum' },
        { name: 'Safari World Bangkok', description: '可以开车穿行的野生动物园，还有海洋动物表演。是一整天的行程，距曼谷市中心约30分钟。', type: 'attraction' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '在曼谷旅居或生活、带着孩子的家庭',
      show_aqi_widget: true,
      comparison_table: [
        { feature: '适合孩子', lengolf: '适合——孩子很喜欢这套设备', alternative: '列出的多数都以家庭为主' },
        { feature: '有空调', lengolf: '有——完全在室内', alternative: '公园与Safari World在户外' },
        { feature: '独立空间', lengolf: '一家人独享一个球位', alternative: '多数场所是共用空间' },
        { feature: '大人也能玩得开心', lengolf: '家长有吧台，也能自己打两杆', alternative: 'KidZania主要面向孩子' },
        { feature: '四口之家价格', lengolf: '每小时约550泰铢（四个人都能打）', alternative: '合计600–3,000泰铢' },
      ],
    },
  },
  {
    id: 'act-11',
    page_type: 'activity_occasion',
    slug: 'private-party-venues-bangkok',
    title: 'Private Party Venues in Bangkok | Exclusive Spaces to Hire',
    meta_description:
      'Private party venues in Bangkok compared: from a golf simulator venue you can book out entirely to private dining rooms and karaoke suites.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'en',
    related_slugs: ['/events', '/corporate-golf-packages', '/activities/birthday-party-venues-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'private-party',
      intro:
        'Choosing between party venues in Bangkok usually comes down to one question: can you get the whole space to yourselves? Plenty of bars and restaurants take group bookings, but a genuine private party means an exclusive buyout: no strangers at the next table, your own music, your own run of the room. This guide compares the private party venues in Bangkok that actually offer exclusive hire for groups, from full-venue buyouts to private rooms, with an honest read on what each is best for.',
      why_lengolf:
        'LENGOLF is one of the few central Bangkok venues you can book out entirely. The Medium Package (21,999 THB) is an exclusive full-venue rental for 15–25 guests: all 4 simulator bays, a full bar, and 3 hours of the space to yourselves, with 20 beers, 10 cocktails, unlimited soft drinks, and a catered food spread included. A smaller Small Package (9,999 THB) covers 10–15 guests, and for a bigger private party the venue hosts 50+ on a custom package, with food, drinks, sound system, and DJ setup all customisable. It sits inside The Mercury Ville right at BTS Chidlom, so guests arrive without a taxi, and the Bravo golf simulators give everyone something to do beyond standing with a drink (no golf experience needed).',
      other_activities: [
        { name: 'Private Karaoke Suites', description: 'KTV venues across Sukhumvit and Silom rent private rooms by the hour, so your group sings without an audience. A reliable private-party format when the plan is drinks and music rather than an activity.', type: 'entertainment' },
        { name: 'Restaurant Private Dining Rooms', description: 'Many mid-range and upscale Bangkok restaurants have a separate private room you can reserve for a group. Best when the party is centred on a seated meal rather than mingling.', type: 'dining' },
        { name: 'Rooftop Bar Private Sections', description: 'Sukhumvit and Silom rooftop bars will cordon off a section, or occasionally the whole terrace, for a group booking. Great for skyline photos, though the open-air setting is weather-dependent in Bangkok.', type: 'bar' },
        { name: 'Serviced-Apartment Function Rooms', description: 'Some serviced residences and pool villas rent out a function room or pool area for private gatherings. Flexible and often self-catered, but you usually arrange food and entertainment yourself.', type: 'venue' },
        { name: 'Event-Space / Studio Hire', description: 'Bare-shell event studios and lofts around Ekkamai, Thong Lo, and the riverside can be hired empty for a fully bespoke party. Maximum control over the look, but you supply catering, drinks, and staffing.', type: 'venue' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'Organisers booking a private, exclusive-hire party for a group in Bangkok',
      show_aqi_widget: false,
      comparison_table: [
        { feature: 'Exclusive venue buyout', lengolf: 'Yes: full-venue rental (Medium Package)', alternative: 'Often only a private section or room' },
        { feature: 'All-inclusive package', lengolf: 'Bays, drinks & catered food from 9,999 THB', alternative: 'Food, drinks, venue usually billed separately' },
        { feature: 'Built-in activity', lengolf: 'Golf simulators (no experience needed)', alternative: 'Usually drinks or dining only' },
        { feature: 'Group capacity', lengolf: '15–25 exclusive; 50+ on custom package', alternative: 'Varies: private rooms often cap at 15–20' },
        { feature: 'Customisable food, music & DJ', lengolf: 'Yes, fully customisable', alternative: 'Depends on venue' },
        { feature: 'Central & BTS-accessible', lengolf: 'BTS Chidlom (Exit 4)', alternative: 'Varies by location' },
      ],
    },
  },

  // ─── TH: private-party-venues-bangkok ───
  // related_slugs substitution: /corporate-golf-packages is translated in no
  // locale, so it is replaced with /cost/corporate-golf-event-cost-bangkok —
  // the TH page landing in this same batch, and the nearest topical match
  // (group/corporate hire pricing). Package figures 21,999 / 9,999 บาท,
  // 15-25 และ 10-15 คน, 50 คนขึ้นไป, เบียร์ 20 ค็อกเทล 10 — all from the EN entry.
  {
    id: 'act-11-th',
    page_type: 'activity_occasion',
    slug: 'private-party-venues-bangkok',
    title: 'สถานที่จัดปาร์ตี้ส่วนตัวในกรุงเทพฯ | เหมาพื้นที่ได้ทั้งร้าน',
    meta_description:
      'เทียบสถานที่จัดปาร์ตี้ส่วนตัวในกรุงเทพฯ ตั้งแต่บาร์กอล์ฟซิมูเลเตอร์ที่เหมาได้ทั้งร้าน ไปจนถึงห้องอาหารส่วนตัว ห้องคาราโอเกะ และพื้นที่จัดอีเวนต์',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'th',
    related_slugs: ['/events', '/cost/corporate-golf-event-cost-bangkok', '/activities/birthday-party-venues-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'private-party',
      intro:
        'การเลือกสถานที่จัดปาร์ตี้ในกรุงเทพฯ มักจบลงที่คำถามเดียว คุณเหมาพื้นที่ทั้งหมดได้หรือเปล่า บาร์และร้านอาหารจำนวนมากรับจองแบบกลุ่ม แต่ปาร์ตี้ส่วนตัวจริงๆ หมายถึงการเหมาทั้งร้าน ไม่มีคนแปลกหน้าอยู่ที่โต๊ะข้างๆ เลือกเพลงเองได้ และคุมจังหวะของงานได้เอง คู่มือนี้เทียบสถานที่จัดปาร์ตี้ส่วนตัวในกรุงเทพฯ ที่ให้เหมาพื้นที่ได้จริง ตั้งแต่การเหมาทั้งร้านไปจนถึงห้องส่วนตัว พร้อมมุมมองตรงไปตรงมาว่าแต่ละแบบเหมาะกับอะไร',
      why_lengolf:
        'LENGOLF เป็นหนึ่งในไม่กี่แห่งใจกลางกรุงเทพฯ ที่เหมาได้ทั้งร้าน Medium Package (21,999 บาท) คือการเหมาพื้นที่ทั้งหมดสำหรับแขก 15-25 คน ได้ครบทั้ง 4 เบย์ซิมูเลเตอร์ บาร์ครบวงจร และพื้นที่เป็นของกลุ่มคุณ 3 ชั่วโมง พร้อมเบียร์ 20 ขวด ค็อกเทล 10 แก้ว น้ำอัดลมไม่อั้น และอาหารจัดเลี้ยงรวมอยู่ด้วย ส่วน Small Package (9,999 บาท) ครอบคลุมแขก 10-15 คน และสำหรับปาร์ตี้ส่วนตัวที่ใหญ่กว่านั้น สถานที่รองรับแขก 50 คนขึ้นไปด้วยแพ็กเกจแบบกำหนดเอง ปรับได้ทั้งอาหาร เครื่องดื่ม ระบบเสียง และชุดดีเจ ที่นี่อยู่ใน The Mercury Ville ติดกับ BTS ชิดลม แขกจึงมาถึงได้โดยไม่ต้องนั่งแท็กซี่ และซิมูเลเตอร์ Bravo Golf ทำให้ทุกคนมีอะไรทำมากกว่าการยืนถือแก้ว โดยไม่ต้องมีประสบการณ์กอล์ฟมาก่อน (ข้อมูล ณ กรกฎาคม 2026)',
      other_activities: [
        { name: 'Private Karaoke Suites', description: 'ห้องคาราโอเกะย่านสุขุมวิทและสีลมให้เช่าเป็นรายชั่วโมง กลุ่มของคุณจึงร้องเพลงกันได้โดยไม่มีคนนอกมอง เป็นรูปแบบปาร์ตี้ส่วนตัวที่ไว้ใจได้เมื่อแผนคือเครื่องดื่มและดนตรีมากกว่ากิจกรรม', type: 'entertainment' },
        { name: 'Restaurant Private Dining Rooms', description: 'ร้านอาหารระดับกลางถึงระดับบนหลายแห่งในกรุงเทพฯ มีห้องส่วนตัวแยกให้จองสำหรับกลุ่ม เหมาะที่สุดเมื่อหัวใจของงานคือมื้ออาหารแบบนั่งโต๊ะมากกว่าการเดินคุยกัน', type: 'dining' },
        { name: 'Rooftop Bar Private Sections', description: 'รูฟท็อปบาร์ย่านสุขุมวิทและสีลมกันโซนหนึ่งไว้ให้ หรือบางครั้งก็ให้ทั้งระเบียง สำหรับการจองแบบกลุ่ม ดีสำหรับถ่ายรูปกับวิวเมือง แม้พื้นที่กลางแจ้งในกรุงเทพฯ จะขึ้นอยู่กับสภาพอากาศ', type: 'bar' },
        { name: 'Serviced-Apartment Function Rooms', description: 'เซอร์วิสอพาร์ตเมนต์และพูลวิลล่าบางแห่งให้เช่าห้องจัดเลี้ยงหรือพื้นที่ริมสระสำหรับงานส่วนตัว ยืดหยุ่นและมักจัดอาหารกันเอง แต่โดยทั่วไปคุณต้องจัดการเรื่องอาหารและความบันเทิงเอง', type: 'venue' },
        { name: 'Event-Space / Studio Hire', description: 'สตูดิโอและลอฟต์สำหรับจัดงานแบบห้องเปล่าย่านเอกมัย ทองหล่อ และริมแม่น้ำ เช่าแบบเปล่าเพื่อจัดปาร์ตี้ตามใจได้ทั้งหมด ควบคุมภาพรวมได้เต็มที่ แต่คุณต้องจัดหาอาหาร เครื่องดื่ม และทีมงานเอง', type: 'venue' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'ผู้จัดงานที่ต้องการจองปาร์ตี้ส่วนตัวแบบเหมาพื้นที่สำหรับกลุ่มในกรุงเทพฯ',
      show_aqi_widget: false,
      comparison_table: [
        { feature: 'เหมาพื้นที่ได้ทั้งหมด', lengolf: 'ได้ เหมาทั้งร้าน (Medium Package)', alternative: 'ส่วนใหญ่ได้แค่โซนหรือห้องส่วนตัว' },
        { feature: 'แพ็กเกจรวมทุกอย่าง', lengolf: 'เบย์ เครื่องดื่ม และอาหารจัดเลี้ยง เริ่มต้น 9,999 บาท', alternative: 'ปกติคิดค่าอาหาร เครื่องดื่ม และสถานที่แยกกัน' },
        { feature: 'มีกิจกรรมในตัว', lengolf: 'กอล์ฟซิมูเลเตอร์ (ไม่ต้องมีประสบการณ์)', alternative: 'ปกติมีแค่เครื่องดื่มหรือมื้ออาหาร' },
        { feature: 'จำนวนที่รองรับ', lengolf: '15-25 คนแบบเหมาพื้นที่ และ 50 คนขึ้นไปด้วยแพ็กเกจแบบกำหนดเอง', alternative: 'แล้วแต่ที่ ห้องส่วนตัวมักจำกัดที่ 15-20 คน' },
        { feature: 'ปรับอาหาร เพลง และดีเจได้', lengolf: 'ได้ ปรับได้เต็มที่', alternative: 'ขึ้นอยู่กับสถานที่' },
        { feature: 'ใจกลางเมืองและถึงด้วย BTS', lengolf: 'BTS ชิดลม (ทางออก 4)', alternative: 'แล้วแต่ทำเล' },
      ],
    },
  },

  // ─── JA: private-party-venues-bangkok ───
  // related_slugs SUBSTITUTION: EN links /corporate-golf-packages, which is
  // translated in no locale, so a ja reader would be 301\'d to English and the
  // funnel would die silently. Replaced with /guide/corporate-golf-events-bangkok
  // — the ja-translated guide covering the same corporate-hire intent, and the
  // closest in-locale target in the allowlist. The other three are unchanged.
  // 21,999THB / 9,999THB, 15〜25名 / 10〜15名, 4ベイ, 3時間, ビール20杯・カクテル10杯,
  // 50名以上, 個室15〜20名 all trace to the EN entry.
  {
    id: 'act-11-ja',
    page_type: 'activity_occasion',
    slug: 'private-party-venues-bangkok',
    title: 'バンコクの貸切パーティー会場 — 完全貸切できる場所を比較',
    meta_description:
      'バンコクの貸切パーティー会場を比較。丸ごと借りられるゴルフシミュレーター会場から、レストランの個室、カラオケスイートまで、実際に貸切に対応する選択肢をご紹介します。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'ja',
    related_slugs: ['/events', '/cost/corporate-golf-event-cost-bangkok', '/activities/birthday-party-venues-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'private-party',
      intro:
        'バンコクでパーティー会場を選ぶとき、最後は「空間全体を自分たちだけのものにできるか」に行き着きます。グループ予約を受けるバーやレストランは多くありますが、本当の意味でのプライベートなパーティーとは完全貸切のこと。隣のテーブルに知らない人がいない、音楽も自分たちで決められる、進行も自由という状態です。このガイドでは、実際にグループ向けの貸切に対応しているバンコクの会場を、全館貸切から個室まで、それぞれ何に向いているかを率直にお伝えしながら比較します。',
      why_lengolf:
        'LENGOLFは、バンコク中心部で丸ごと貸し切れる数少ない会場のひとつです。Mediumパッケージ（21,999THB）は15〜25名向けの全館貸切で、4つのシミュレーターベイ、フルバー、そして3時間の空間がグループだけのものになります。ビール20杯、カクテル10杯、ソフトドリンク飲み放題、ケータリングの料理込み。より小規模なSmallパッケージ（9,999THB）は10〜15名が対象で、さらに大きなプライベートパーティーなら50名以上のカスタムパッケージにも対応します。料理、ドリンク、音響設備、DJ機材はいずれも調整可能です。BTSチットロム駅のすぐそば、ザ・マーキュリービル内にあるためタクシーは要らず、Bravo Golfシミュレーターがあるおかげで、ゲストはグラスを持って立っているだけになりません。ゴルフの経験は不要です（2026年7月現在）。',
      other_activities: [
        { name: 'Private Karaoke Suites', description: 'スクンビットやシーロムのKTVでは個室を時間単位で借りられるので、人目を気にせず歌えます。アクティビティより飲みと音楽が中心のときに、確実な選択肢になります。', type: 'entertainment' },
        { name: 'Restaurant Private Dining Rooms', description: 'バンコクの中価格帯から高級店まで、多くのレストランに予約できる個室があります。歓談より着席の食事が主役のパーティーに向いています。', type: 'dining' },
        { name: 'Rooftop Bar Private Sections', description: 'スクンビットやシーロムのルーフトップバーは、グループ予約に応じて一角を、場合によってはテラス全体を区切ってくれます。スカイラインの写真は魅力ですが、屋外なのでバンコクでは天候に左右されます。', type: 'bar' },
        { name: 'Serviced-Apartment Function Rooms', description: 'サービスアパートメントやプールヴィラのなかには、宴会用の部屋やプールサイドを貸し出すところもあります。自由度は高く自炊もできますが、料理や余興は基本的に自分たちで手配することになります。', type: 'venue' },
        { name: 'Event-Space / Studio Hire', description: 'エカマイ、トンロー、川沿いにある内装なしのイベントスタジオやロフトは、空の状態で借りて一から作り込めます。見た目は思いのままですが、ケータリング、ドリンク、スタッフはすべて自前です。', type: 'venue' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: 'バンコクでグループ向けの貸切パーティーを手配する幹事の方',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '全館貸切', lengolf: '可能。全館貸切に対応（Mediumパッケージ）', alternative: '一角や個室のみのことが多い' },
        { feature: 'オールインクルーシブのパッケージ', lengolf: 'ベイ、ドリンク、ケータリングの料理が9,999THBから', alternative: '料理、ドリンク、会場は別会計が一般的' },
        { feature: '会場内のアクティビティ', lengolf: 'ゴルフシミュレーター（経験不要）', alternative: 'ドリンクか食事のみが一般的' },
        { feature: '対応人数', lengolf: '貸切は15〜25名、カスタムなら50名以上', alternative: 'まちまち。個室は15〜20名で上限のことが多い' },
        { feature: '料理・音楽・DJのカスタマイズ', lengolf: '可能。細かく調整できます', alternative: '会場による' },
        { feature: '中心部・BTSでのアクセス', lengolf: 'BTSチットロム駅（4番出口）', alternative: '場所によって異なる' },
      ],
    },
  },

  // ─── KO: private-party-venues-bangkok ───
  // related_slugs SUBSTITUTION: the EN entry links /corporate-golf-packages,
  // which is translated in no locale, so a KO reader would be 301d to English.
  // Replaced with /guide/corporate-golf-events-bangkok — the KO-translated
  // corporate-event guide, the closest in-locale match to the same intent.
  // Package figures (21,999 / 9,999 / 15~25명 / 50명 이상) all from this EN
  // entry; the EN en-dashes become the KO ~ form.
  {
    id: 'act-11-ko',
    page_type: 'activity_occasion',
    slug: 'private-party-venues-bangkok',
    title: '방콕 프라이빗 파티 장소 — 단독 대관 가능한 곳',
    meta_description:
      '방콕 프라이빗 파티 장소를 비교했어요. 통째로 빌릴 수 있는 골프 시뮬레이터 공간부터 레스토랑 프라이빗 룸, 노래방 룸까지 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'ko',
    related_slugs: ['/events', '/cost/corporate-golf-event-cost-bangkok', '/activities/birthday-party-venues-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'private-party',
      intro:
        '방콕에서 파티 장소를 고를 때 결국 질문 하나로 좁혀져요. 공간을 통째로 우리끼리 쓸 수 있느냐예요. 단체 예약을 받아 주는 바와 레스토랑은 많지만, 진짜 프라이빗 파티는 단독 대관을 뜻해요. 옆 테이블에 모르는 사람이 없고, 음악도 우리가 고르고, 공간의 흐름도 우리가 정하는 자리요. 이 가이드에서는 방콕에서 실제로 단독 대관이 가능한 파티 장소를 전체 대관부터 프라이빗 룸까지 비교하고, 각각 어떤 자리에 잘 맞는지 솔직하게 짚어 봤어요.',
      why_lengolf:
        'LENGOLF는 방콕 도심에서 통째로 빌릴 수 있는 몇 안 되는 공간 중 하나예요. 미디엄 패키지(21,999바트)는 15~25명을 위한 단독 대관으로, 시뮬레이터 베이 4개와 바 전체, 3시간의 공간을 온전히 쓰면서 맥주 20병, 칵테일 10잔, 무제한 소프트드링크, 케이터링 음식 세팅이 포함돼요. 더 작은 스몰 패키지(9,999바트)는 10~15명을 받고, 규모가 큰 프라이빗 파티라면 50명 이상도 커스텀 패키지로 진행하면서 음식과 음료, 사운드 시스템, DJ 세팅까지 맞출 수 있어요 (2026년 7월 기준). BTS 칫롬역 바로 앞 The Mercury Ville 안에 있어서 택시 없이 모일 수 있고, Bravo 골프 시뮬레이터 덕분에 손에 잔만 들고 서 있는 대신 다 같이 할 거리가 생겨요 (골프 경험은 필요 없어요).',
      other_activities: [
        { name: '프라이빗 노래방 룸', description: 'Sukhumvit과 Silom 일대의 KTV는 시간 단위로 룸을 빌려줘서 다른 손님 없이 우리끼리 노래해요. 액티비티보다 술과 음악이 목적일 때 확실한 프라이빗 파티 형식이에요.', type: 'entertainment' },
        { name: '레스토랑 프라이빗 룸', description: '방콕의 중급·고급 레스토랑 상당수가 단체 예약을 받는 별도 프라이빗 룸을 갖추고 있어요. 돌아다니기보다 앉아서 식사하는 파티에 잘 맞아요.', type: 'dining' },
        { name: '루프톱 바 전용 구역', description: 'Sukhumvit과 Silom의 루프톱 바는 단체 예약에 한 구역을, 때로는 테라스 전체를 내주기도 해요. 스카이라인 사진을 남기기 좋지만 야외라 방콕 날씨의 영향을 받아요.', type: 'bar' },
        { name: '서비스드 아파트 연회장', description: '일부 서비스드 레지던스와 풀빌라는 연회장이나 수영장 구역을 프라이빗 모임용으로 빌려줘요. 자유도가 높고 직접 준비하는 방식이 많은데, 대개 음식과 오락은 알아서 마련해야 해요.', type: 'venue' },
        { name: '이벤트 스페이스 / 스튜디오 대관', description: 'Ekkamai, Thong Lo, 강변 일대의 빈 이벤트 스튜디오와 로프트를 통째로 빌려 원하는 대로 꾸밀 수 있어요. 연출의 자유도는 최대지만 케이터링과 음료, 인력은 직접 준비해야 해요.', type: 'venue' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '방콕에서 단독 대관 프라이빗 파티를 준비하는 주최자',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '단독 대관', lengolf: '가능 — 전체 대관 (미디엄 패키지)', alternative: '한 구역이나 룸만 되는 곳이 많아요' },
        { feature: '올인클루시브 패키지', lengolf: '베이, 음료, 케이터링 음식 포함 9,999바트부터', alternative: '음식, 음료, 공간이 보통 따로 청구돼요' },
        { feature: '기본 제공 활동', lengolf: '골프 시뮬레이터 (경험 필요 없음)', alternative: '보통 술이나 식사뿐' },
        { feature: '수용 인원', lengolf: '단독 대관 15~25명, 커스텀 패키지로 50명 이상', alternative: '제각각 — 프라이빗 룸은 보통 15~20명까지' },
        { feature: '음식·음악·DJ 커스터마이즈', lengolf: '가능 — 전부 조정 가능', alternative: '장소에 따라 달라요' },
        { feature: '도심 위치와 BTS 접근성', lengolf: 'BTS 칫롬역(4번 출구)', alternative: '위치에 따라 달라요' },
      ],
    },
  },

  // ─── ZH: private-party-venues-bangkok ───
  // 包场 is the Mainland term for an exclusive buyout and carries the whole page,
  // so the title front-loads it. Figures trace to EN act-11 (中型套餐21,999泰铢／
  // 15–25人／4个球位／3小时／20瓶啤酒／10杯鸡尾酒, 小型套餐9,999泰铢／10–15人,
  // 定制50人以上, 包厢多为15–20人上限, 4号出口); prices carry 截至2026年7月.
  // related_slugs SUBSTITUTION: the EN entry links /corporate-golf-packages,
  // which is translated in no locale, so it is replaced with
  // /guide/corporate-golf-events-bangkok — the ZH-translated page covering the
  // same corporate/private-event intent. The other three EN targets are all in
  // the ZH allowlist and are kept.
  {
    id: 'act-11-zh',
    page_type: 'activity_occasion',
    slug: 'private-party-venues-bangkok',
    title: '曼谷包场派对场地 — 可整场包下的私人聚会空间',
    meta_description:
      '曼谷私人派对场地对比：从可以整场包下的室内高尔夫场馆，到餐厅包厢与KTV包房。哪一种能真正做到不与陌生人同处一室，这里一次说清楚。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'social',
    locale: 'zh',
    related_slugs: ['/events', '/cost/corporate-golf-event-cost-bangkok', '/activities/birthday-party-venues-bangkok', '/activities/group-activities-bangkok'],
    created_at: now,
    updated_at: now,
    content: {
      occasion_type: 'private-party',
      intro:
        '在曼谷挑派对场地，通常归结为一个问题：整个空间能不能只属于你们。愿意接团体订位的酒吧和餐厅很多，但真正的私人派对意味着整场包下：隔壁桌没有陌生人、音乐由你们决定、整个晚上的节奏也由你们掌握。这份指南比较了曼谷真正提供包场的私人派对场地，从整场买断到独立包厢都有，并如实说明各自最适合什么场合。',
      why_lengolf:
        'LENGOLF是曼谷市中心少数可以整场包下的场馆之一。中型套餐（21,999泰铢）是面向15–25人的整场包场：4个模拟器球位全开、一整套吧台，以及3小时完全属于你们的空间，并含20瓶啤酒、10杯鸡尾酒、软饮无限畅饮和一桌自助餐点，截至2026年7月。规模更小的小型套餐（9,999泰铢）适合10–15人；派对更大时，场馆可通过定制套餐接待50人以上，餐食、酒水、音响系统和DJ设备都能定制。场馆位于The Mercury Ville内、紧邻BTS Chidlom，客人不用打车就能到，而Bravo高尔夫模拟器让所有人都有事可做，不必端着酒杯干站着（不需要高尔夫经验）。',
      other_activities: [
        { name: 'Private Karaoke Suites', description: 'Sukhumvit和Silom一带的KTV按小时出租包厢，你们唱歌不会有外人围观。当计划是喝酒加音乐而不是一项活动时，这是稳妥的私人派对形式。', type: 'entertainment' },
        { name: 'Restaurant Private Dining Rooms', description: '曼谷不少中高端餐厅都有可预订的独立包厢，适合团体使用。当派对以一顿正式的坐席餐为核心、而不是走动交流时最合适。', type: 'dining' },
        { name: 'Rooftop Bar Private Sections', description: 'Sukhumvit和Silom的高空酒吧可以为团体隔出一块区域，偶尔也能包下整个露台。拍天际线照片很出彩，不过露天场地在曼谷要看天气。', type: 'bar' },
        { name: 'Serviced-Apartment Function Rooms', description: '有些服务式公寓和泳池别墅会把多功能厅或泳池区租给私人聚会。灵活度高，常常可以自带餐食，但通常要自己安排吃的和娱乐。', type: 'venue' },
        { name: 'Event-Space / Studio Hire', description: 'Ekkamai、Thong Lo和河畔一带的清水活动空间与loft可以整间租下，从零开始打造一场完全定制的派对。对呈现效果的掌控最大，但餐饮、酒水和人手都要自己张罗。', type: 'venue' },
      ],
      seasonal_relevance: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      target_audience: '在曼谷筹办包场私人派对的组织者',
      show_aqi_widget: false,
      comparison_table: [
        { feature: '整场包场', lengolf: '可以：整场包下（中型套餐）', alternative: '通常只能包一块区域或一间包厢' },
        { feature: '全包套餐', lengolf: '球位、酒水与餐食9,999泰铢起', alternative: '餐食、酒水与场地通常分开计费' },
        { feature: '场地自带活动', lengolf: '高尔夫模拟器（不需要经验）', alternative: '通常只有喝酒或用餐' },
        { feature: '团体规模', lengolf: '包场15–25人；定制套餐可达50人以上', alternative: '各家不同：包厢多为15–20人上限' },
        { feature: '餐食、音乐与DJ可定制', lengolf: '可以，完全可定制', alternative: '视场地而定' },
        { feature: '位置居中、BTS可达', lengolf: 'BTS Chidlom（4号出口）', alternative: '因地点而异' },
      ],
    },
  },
]
