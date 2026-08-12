import type { HotelConciergeSeoPage } from '@/types/seo-pages'

const now = new Date().toISOString()

export const hotelConciergePages: HotelConciergeSeoPage[] = [
  {
    id: 'hotel-1',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-arnoma-grand-bangkok',
    title: 'Things to Do Near Arnoma Grand Bangkok | Activities & Dining',
    meta_description:
      'Staying at Arnoma Grand Bangkok? Discover the best things to do nearby — from indoor golf at LENGOLF (700m walk) to dining, shopping, and nightlife around BTS Chidlom.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'en',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Arnoma Grand Bangkok',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 700,
      walking_time_mins: 11,
      walking_directions:
        'Exit Arnoma Grand Bangkok onto Ratchadamri Road. Turn left and then left again (east) onto Ploenchit Road. Walk east along Ploenchit Road — LENGOLF at Mercury Ville will be on your right within 11 minutes. LENGOLF is on Floor 4. Take the escalator up from the ground floor.',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Nara Thai Cuisine (CentralWorld)', cuisine: 'Thai', distance_m: 250 },
        { name: 'Din Tai Fung (CentralWorld)', cuisine: 'Taiwanese / Dim Sum', distance_m: 300 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: 'Thai Seafood', distance_m: 400 },
        { name: 'Smith & Co. (Mercury Ville)', cuisine: 'Western / Cafe', distance_m: 300 },
      ],
      nearby_activities: [
        { name: 'CentralWorld Shopping', type: 'shopping', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 500 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 400 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Arnoma+Grand+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Arnoma Grand sits at the intersection of Ratchadamri Road and Ploenchit Road — one of the busiest and most convenient corners of central Bangkok. CentralWorld, Southeast Asia\'s largest lifestyle shopping complex, is directly across the road and houses hundreds of shops, a cinema, an ice-skating rink, and a food court rivaling any restaurant. The Chidlom area is known as the "office district meets shopping paradise" — during the day it buzzes with white-collar workers grabbing lunch at nearby Somboon Seafood or Din Tai Fung, and in the evening it transforms into a dining and entertainment zone. The skywalk from BTS Chidlom connects you directly to Mercury Ville, Gaysorn Village, and CentralWorld without ever touching street level — which is a blessing during rainy season or Bangkok\'s 35°C afternoons. For a local experience, walk 5 minutes south on Ratchadamri to find street food carts selling pad thai and mango sticky rice at a fraction of mall prices.',
      suggested_itinerary: [
        { time: '10:00 AM', activity: 'Breakfast at the hotel, then walk across to CentralWorld for morning shopping before the crowds arrive' },
        { time: '12:30 PM', activity: 'Lunch at Din Tai Fung (CentralWorld, 6th floor) — the xiao long bao is worth the queue' },
        { time: '2:00 PM', activity: 'Walk 11 minutes to LENGOLF at Mercury Ville for an afternoon session (~550 THB/hour, up to 5 people)' },
        { time: '4:00 PM', activity: 'Grab a coffee at Smith & Co. in Mercury Ville before heading back' },
        { time: '6:30 PM', activity: 'Dinner at Somboon Seafood for their famous curry crab — a Bangkok institution since 1969' },
        { time: '8:30 PM', activity: 'Evening walk along the Chidlom skywalk to Gaysorn Village for rooftop drinks at Vanilla Sky Bar' },
      ],
    },
  },

  // ─── TH: things-to-do-near-arnoma-grand-bangkok ───
  // Figures carried verbatim from EN: 700 m / 11 min / 4 stars, restaurant+activity
  // distances, ประมาณ 550 บาท/ชั่วโมง สูงสุด 5 คน, ปี 1969, 35 องศาเซลเซียส, เดิน 5 นาที.
  // Clock rendered 24h + น. Street names keep the Latin form in parentheses so the
  // reader can match the signage. EN's internal 700 m vs "4-minute walk" gap is
  // carried, not reconciled (flagged in the report).
  {
    id: 'hotel-1-th',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-arnoma-grand-bangkok',
    title: 'สิ่งที่น่าทำใกล้ Arnoma Grand Bangkok | กิจกรรมและร้านอาหาร',
    meta_description:
      'พักที่ Arnoma Grand Bangkok อยู่ใช่ไหม รวมสิ่งที่น่าทำใกล้โรงแรม ตั้งแต่กอล์ฟในร่มที่ LENGOLF (เดิน 700 เมตร) ไปจนถึงร้านอาหาร ช้อปปิ้ง และไนต์ไลฟ์รอบ BTS ชิดลม',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'th',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Arnoma Grand Bangkok',
      hotel_neighbourhood: 'ราชประสงค์ / ชิดลม',
      hotel_distance_m: 700,
      walking_time_mins: 11,
      walking_directions:
        'ออกจาก Arnoma Grand Bangkok มายังถนนราชดำริ (Ratchadamri Road) เลี้ยวซ้าย แล้วเลี้ยวซ้ายอีกครั้ง (ไปทางทิศตะวันออก) เข้าสู่ถนนเพลินจิต (Ploenchit Road) เดินไปทางทิศตะวันออกตามถนนเพลินจิต แล้ว LENGOLF ที่ Mercury Ville จะอยู่ทางขวามือภายใน 11 นาที LENGOLF อยู่ชั้น 4 ขึ้นบันไดเลื่อนจากชั้นล่าง',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Nara Thai Cuisine (CentralWorld)', cuisine: 'อาหารไทย', distance_m: 250 },
        { name: 'Din Tai Fung (CentralWorld)', cuisine: 'ไต้หวัน / ติ่มซำ', distance_m: 300 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: 'ซีฟู้ดไทย', distance_m: 400 },
        { name: 'Smith & Co. (Mercury Ville)', cuisine: 'อาหารตะวันตก / คาเฟ่', distance_m: 300 },
      ],
      nearby_activities: [
        { name: 'CentralWorld Shopping', type: 'shopping', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 500 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 400 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Arnoma+Grand+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Arnoma Grand ตั้งอยู่ตรงจุดตัดของถนนราชดำริกับถนนเพลินจิต ซึ่งเป็นหนึ่งในมุมที่คึกคักและเดินทางสะดวกที่สุดของใจกลางกรุงเทพฯ CentralWorld ศูนย์การค้าไลฟ์สไตล์ที่ใหญ่ที่สุดในเอเชียตะวันออกเฉียงใต้ อยู่ฝั่งตรงข้ามถนนพอดี ภายในมีร้านค้าหลายร้อยร้าน โรงภาพยนตร์ ลานสเก็ตน้ำแข็ง และศูนย์อาหารที่สู้กับร้านอาหารทั่วไปได้สบาย ย่านชิดลมได้ชื่อว่าเป็นย่านที่ออฟฟิศมาบรรจบกับสวรรค์ของนักช้อป กลางวันจะแน่นไปด้วยพนักงานออฟฟิศที่ออกมาหาข้าวเที่ยงที่ Somboon Seafood หรือ Din Tai Fung ที่อยู่ใกล้ ๆ ส่วนตอนเย็นย่านนี้จะเปลี่ยนเป็นโซนร้านอาหารและความบันเทิง ทางเดินลอยฟ้าจาก BTS ชิดลม เชื่อมตรงไปยัง Mercury Ville, Gaysorn Village และ CentralWorld โดยไม่ต้องลงมาที่ระดับถนนเลย ซึ่งช่วยได้มากทั้งในหน้าฝนและในบ่ายที่อุณหภูมิแตะ 35 องศาเซลเซียสของกรุงเทพฯ ถ้าอยากได้บรรยากาศแบบคนท้องถิ่น ลองเดินลงทางใต้ตามถนนราชดำริราว 5 นาที จะพบรถเข็นสตรีทฟู้ดที่ขายผัดไทยและข้าวเหนียวมะม่วงในราคาเพียงเศษเสี้ยวของราคาในห้าง',
      suggested_itinerary: [
        { time: '10:00 น.', activity: 'อาหารเช้าที่โรงแรม แล้วเดินข้ามไป CentralWorld เพื่อช้อปปิ้งช่วงเช้าก่อนที่คนจะเริ่มเยอะ' },
        { time: '12:30 น.', activity: 'มื้อกลางวันที่ Din Tai Fung (CentralWorld ชั้น 6) เสี่ยวหลงเปาของที่นี่คุ้มกับการต่อคิว' },
        { time: '14:00 น.', activity: 'เดิน 11 นาทีไปที่ LENGOLF ใน Mercury Ville สำหรับรอบบ่าย (ประมาณ 550 บาท/ชั่วโมง สำหรับผู้เล่นสูงสุด 5 คน)' },
        { time: '16:00 น.', activity: 'แวะจิบกาแฟที่ Smith & Co. ใน Mercury Ville ก่อนเดินกลับ' },
        { time: '18:30 น.', activity: 'มื้อเย็นที่ Somboon Seafood กับปูผัดผงกะหรี่ชื่อดัง ร้านที่อยู่คู่กรุงเทพฯ มาตั้งแต่ปี 1969' },
        { time: '20:30 น.', activity: 'เดินเล่นยามค่ำบนทางเดินลอยฟ้าชิดลมไปยัง Gaysorn Village แล้วขึ้นไปดื่มบนรูฟท็อปที่ Vanilla Sky Bar' },
      ],
    },
  },

  // ─── JA: things-to-do-near-arnoma-grand-bangkok ───
  // Title/meta front-load the katakana hotel name (what a JP guest types) with the
  // Latin name glossed once in meta; the Latin form is guaranteed on-page anyway by
  // the component's hotel_name headings. Streets in walking_directions are katakana
  // + Latin in parens on first use so the sign is still findable. Figures carried
  // from EN: 700m / 11分 / 4階 / 徒歩4分 (itinerary) / 約550THB / 最大5名.
  // As-of marker moved into the itinerary (renders) rather than meta_description.
  {
    id: 'hotel-1-ja',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-arnoma-grand-bangkok',
    title: 'アルノマ・グランド・バンコク周辺の過ごし方 — アクティビティとグルメ',
    meta_description:
      'アルノマ・グランド・バンコク（Arnoma Grand Bangkok）周辺の過ごし方。徒歩700mのLENGOLFでインドアゴルフ、セントラルワールドでの買い物、BTSチットロム駅まわりのグルメとナイトライフをまとめました。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ja',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Arnoma Grand Bangkok',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 700,
      walking_time_mins: 11,
      walking_directions:
        'Arnoma Grand Bangkokを出て、ラチャダムリ通り（Ratchadamri Road）へ。左に曲がり、もう一度左（東）に曲がってプルンチット通り（Ploenchit Road）に入ります。プルンチット通りを東へ進むと、11分以内に右手にザ・マーキュリービルのLENGOLFが見えてきます。LENGOLFは4階です。1階からエスカレーターで上がってください。',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Nara Thai Cuisine (CentralWorld)', cuisine: 'タイ料理', distance_m: 250 },
        { name: 'Din Tai Fung (CentralWorld)', cuisine: '台湾料理／点心', distance_m: 300 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: 'タイのシーフード', distance_m: 400 },
        { name: 'Smith & Co. (Mercury Ville)', cuisine: '洋食／カフェ', distance_m: 300 },
      ],
      nearby_activities: [
        { name: 'CentralWorld Shopping', type: 'shopping', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 500 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 400 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Arnoma+Grand+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Arnoma Grandが建つのは、ラチャダムリ通りとプルンチット通りが交わる、バンコク中心部でもとりわけ人通りの多い便利な一角です。通りを渡ればすぐに、東南アジア最大級のライフスタイル複合施設セントラルワールド。数百軒の店舗に映画館、アイススケートリンク、そのへんのレストランに引けを取らないフードコートまで揃っています。チットロム周辺は「オフィス街とショッピング天国が同居する場所」と言われるエリアで、昼はSomboon SeafoodやDin Tai Fungでランチをとるオフィスワーカーでにぎわい、夜になると食事と娯楽のゾーンに表情を変えます。BTSチットロム駅から延びるスカイウォークは、ザ・マーキュリービル、Gaysorn Village、セントラルワールドを地上に降りずにつないでいます。雨季や35°Cの午後には、これが本当にありがたく感じられます。ローカルな雰囲気を味わいたい方は、ラチャダムリ通りを南に5分ほど歩いてみてください。パッタイやマンゴースティッキーライスを売る屋台が並び、モールの価格とは比べものにならない安さです。',
      suggested_itinerary: [
        { time: '10:00', activity: 'ホテルで朝食をとったあと、通りを渡ってセントラルワールドへ。混み合う前の午前中に買い物をすませます' },
        { time: '12:30', activity: 'Din Tai Fung（セントラルワールド6階）でランチ。小籠包は行列に並ぶ価値があります' },
        { time: '14:00', activity: '徒歩11分でザ・マーキュリービルのLENGOLFへ。午後のセッションを（1時間約550THB、最大5名まで／2026年7月現在）' },
        { time: '16:00', activity: '戻る前に、ザ・マーキュリービルのSmith & Co.でコーヒーを一杯' },
        { time: '18:30', activity: 'Somboon Seafoodで名物のカニのカレー炒め（プーパッポンカリー）を。1969年から続くバンコクの老舗です' },
        { time: '20:30', activity: 'チットロムのスカイウォークを歩いてGaysorn Villageへ。ルーフトップのVanilla Sky Barで一杯' },
      ],
    },
  },

  // ─── KO: things-to-do-near-arnoma-grand-bangkok ───
  // Figures carried from EN hotel-1: 700m / 11분, 4층, 도보 4분(itinerary), 약 550바트/시간
  // 최대 5명, 35°C, 남쪽 5분. Latin proper nouns never take a Korean particle — every
  // one is followed by a Korean noun (CentralWorld 쇼핑몰이) or an invariant particle
  // (에/에서/의/까지). Stations transliterated per glossary + corpus: BTS 칫롬역.
  // As-of marker added to the LENGOLF price only, with an explicit month.
  {
    id: 'hotel-1-ko',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-arnoma-grand-bangkok',
    title: 'Arnoma Grand Bangkok 주변 즐길 거리 — 액티비티와 맛집 가이드',
    meta_description:
      'Arnoma Grand Bangkok에 묵는다면 도보 700m 거리의 LENGOLF 실내 골프를 비롯해 BTS 칫롬역 주변 맛집과 쇼핑, 밤 나들이까지 가까운 즐길 거리를 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ko',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Arnoma Grand Bangkok',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 700,
      walking_time_mins: 11,
      walking_directions:
        'Arnoma Grand Bangkok에서 Ratchadamri Road 쪽으로 나옵니다. 왼쪽으로 돈 다음 한 번 더 왼쪽(동쪽)으로 꺾어 Ploenchit Road에 들어섭니다. Ploenchit Road에서 동쪽으로 걸으면 11분 안에 오른편으로 Mercury Ville의 LENGOLF가 보여요. LENGOLF는 4층에 있어요. 1층에서 에스컬레이터를 타고 올라가면 됩니다.',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Nara Thai Cuisine (CentralWorld)', cuisine: '태국 요리', distance_m: 250 },
        { name: 'Din Tai Fung (CentralWorld)', cuisine: '대만 요리 / 딤섬', distance_m: 300 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: '태국 해산물', distance_m: 400 },
        { name: 'Smith & Co. (Mercury Ville)', cuisine: '양식 / 카페', distance_m: 300 },
      ],
      nearby_activities: [
        { name: 'CentralWorld Shopping', type: 'shopping', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 500 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 400 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Arnoma+Grand+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Arnoma Grand 호텔은 Ratchadamri Road, Ploenchit Road 두 도로가 만나는 교차로에 자리해요. 방콕 도심에서 가장 붐비면서도 이동하기 편한 모퉁이 중 하나예요. 길 건너편에는 CentralWorld 쇼핑몰이 바로 있어요. 동남아시아 최대 규모의 라이프스타일 쇼핑 복합몰로, 수백 개 상점과 영화관, 아이스링크, 웬만한 레스토랑 못지않은 푸드코트가 들어서 있어요. 칫롬 일대는 "오피스 지구와 쇼핑 천국이 만나는 곳"으로 통해요. 낮에는 근처 Somboon Seafood, Din Tai Fung 같은 곳에서 점심을 해결하는 직장인들로 북적이고, 저녁이면 식사와 유흥이 중심이 되는 동네로 바뀌어요. BTS 칫롬역에서 이어지는 스카이워크를 타면 도로에 한 번도 내려서지 않고 Mercury Ville, Gaysorn Village, CentralWorld까지 그대로 연결돼요. 우기나 기온이 35°C에 달하는 방콕의 오후에는 특히 반가운 구조예요. 현지 분위기를 느끼고 싶다면 Ratchadamri Road에서 남쪽으로 5분쯤 걸어 보세요. 팟타이와 망고 스티키 라이스를 파는 길거리 노점을 만날 수 있고, 가격은 쇼핑몰의 몇 분의 일 수준이에요.',
      suggested_itinerary: [
        { time: '10:00', activity: '호텔에서 아침을 먹고, 사람이 몰리기 전에 CentralWorld 쇼핑몰로 건너가 오전 쇼핑 즐기기' },
        { time: '12:30', activity: 'Din Tai Fung (CentralWorld 6층)에서 점심 — 샤오롱바오는 줄을 설 만한 가치가 있어요' },
        { time: '14:00', activity: '11분만 걸어 Mercury Ville의 LENGOLF에서 오후 세션 (최대 5명까지 시간당 약 550바트, 2026년 7월 기준)' },
        { time: '16:00', activity: '돌아가는 길에 Mercury Ville 안 Smith & Co.에서 커피 한 잔' },
        { time: '18:30', activity: 'Somboon Seafood에서 저녁 — 1969년부터 이어져 온 방콕의 명소로, 커리 크랩이 유명해요' },
        { time: '20:30', activity: '칫롬 스카이워크를 따라 저녁 산책을 하고 Gaysorn Village까지 걸어가 Vanilla Sky Bar에서 루프톱 한 잔' },
      ],
    },
  },

  // ─── ZH: things-to-do-near-arnoma-grand-bangkok ───
  // Figures carried from EN: 700m / 11分钟 / 4星, CentralWorld 200m, Erawan 500m,
  // Gaysorn 400m, ~550泰铢/小时最多5人, 1969年, 35°C, 商场楼层6楼.
  // Chidlom glossed once as 奇隆一带 (matches messages/zh.json BTS奇隆站); station
  // itself stays Latin as BTS Chidlom站. CentralWorld glossed once as 尚泰世界.
  // Clock: 24-hour, two-digit (10:00 AM → 10:00, 2:00 PM → 14:00).
  {
    id: 'hotel-1-zh',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-arnoma-grand-bangkok',
    title: 'Arnoma Grand Bangkok附近好去处 — 周边活动与美食指南',
    meta_description:
      '住在Arnoma Grand Bangkok？步行700米就能到LENGOLF打室内高尔夫，周边还有BTS Chidlom站一带的餐饮、购物与夜生活。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'zh',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Arnoma Grand Bangkok',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 700,
      walking_time_mins: 11,
      walking_directions:
        '从Arnoma Grand Bangkok出来，走到Ratchadamri Road上。先左转，再左转一次（向东）进入Ploenchit Road。沿Ploenchit Road一路向东走，11分钟内就会看到右手边Mercury Ville里的LENGOLF。LENGOLF在4楼，从一楼搭扶梯上去即可。',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Nara Thai Cuisine (CentralWorld)', cuisine: '泰餐', distance_m: 250 },
        { name: 'Din Tai Fung (CentralWorld)', cuisine: '台湾菜、点心', distance_m: 300 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: '泰式海鲜', distance_m: 400 },
        { name: 'Smith & Co. (Mercury Ville)', cuisine: '西餐、咖啡馆', distance_m: 300 },
      ],
      nearby_activities: [
        { name: 'CentralWorld Shopping', type: 'shopping', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 500 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 400 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Arnoma+Grand+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Arnoma Grand就在Ratchadamri Road与Ploenchit Road的路口上，是曼谷市中心最繁忙、也最方便的街角之一。东南亚最大的生活方式购物中心CentralWorld（尚泰世界）就在马路对面，里面有数百家店铺、一家影院、一个溜冰场，还有一个不输给餐厅的美食广场。奇隆一带被称为“办公区遇上购物天堂”——白天满是出来吃午饭的上班族，他们会去附近的Somboon Seafood或Din Tai Fung；到了晚上，这里又变成餐饮与娱乐区。从BTS Chidlom站延伸出来的空中步道，让你不必下到地面就能直接走进Mercury Ville、Gaysorn Village和CentralWorld——雨季或者曼谷35°C的午后，这一点特别值得庆幸。想体验本地生活，沿Ratchadamri往南走5分钟，就能找到卖泰式炒河粉和芒果糯米饭的路边摊，价格只是商场里的零头。',
      suggested_itinerary: [
        { time: '10:00', activity: '在酒店吃过早餐，趁人潮还没涌进来，走到对面的CentralWorld逛一逛' },
        { time: '12:30', activity: '在Din Tai Fung（CentralWorld 6楼）吃午饭——小笼包值得排这个队' },
        { time: '14:00', activity: '步行11分钟到Mercury Ville里的LENGOLF打一场下午的球（每小时约550泰铢，最多5人）' },
        { time: '16:00', activity: '回程前先到Mercury Ville的Smith & Co.喝杯咖啡' },
        { time: '18:30', activity: '到Somboon Seafood吃招牌咖喱蟹——1969年开业至今的曼谷老字号' },
        { time: '20:30', activity: '晚上沿Chidlom空中步道散步到Gaysorn Village，在Vanilla Sky Bar的天台上喝一杯' },
      ],
    },
  },
  {
    id: 'hotel-2',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-sindhorn-midtown',
    title: 'Things to Do Near Sindhorn Midtown Hotel Bangkok | Local Guide',
    meta_description:
      'Staying at Sindhorn Midtown? Here\'s what to do nearby — indoor golf at LENGOLF (400m), rooftop dining, shopping at CentralWorld, and more around Lumpini.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'en',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/weekend-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Sindhorn Midtown Hotel',
      hotel_neighbourhood: 'Langsuan / Chidlom',
      hotel_distance_m: 350,
      walking_time_mins: 5,
      walking_directions:
        'Exit Sindhorn Midtown onto Soi Langsuan. Walk north to Ploenchit Road, then turn right (east). Continue toward BTS Chidlom station — The Mercury Ville is on your right, directly connected to the BTS. LENGOLF is on Floor 4.',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Baan Khanitha (Langsuan)', cuisine: 'Thai Fine Dining', distance_m: 200 },
        { name: 'Pizza Mania (Mercury Ville)', cuisine: 'Italian', distance_m: 400 },
        { name: 'Café Kitsuné (Sindhorn Village)', cuisine: 'French Cafe', distance_m: 150 },
        { name: 'Sorn (2 Michelin Stars)', cuisine: 'Southern Thai', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 300 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 350 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 150 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 600 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Sindhorn+Midtown+Hotel+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The Langsuan–Sindhorn area is one of Bangkok\'s most pleasant neighborhoods for walking — tree-lined soi, upscale residential towers, and a cluster of excellent restaurants that locals consider some of the city\'s best. Soi Langsuan itself is nicknamed "Restaurant Row" for its concentration of fine dining: Baan Khanitha serves royal Thai cuisine in a traditional wooden house, Gaggan Anand holds multiple Michelin stars for progressive Indian food, and Sorn (2 Michelin Stars) is one of Thailand\'s top-rated restaurants for Southern Thai cuisine. Sindhorn Village, the mixed-use development next to the hotel, has a curated selection of lifestyle shops and the Instagram-famous Café Kitsuné. But the real gem of this area is Lumpini Park — Bangkok\'s answer to Central Park — just 300m from the hotel. Early mornings you\'ll find joggers, tai chi groups, and the famous monitor lizards sunbathing by the lake. The park is the best free activity in central Bangkok and a perfect way to start your day before the heat sets in.',
      suggested_itinerary: [
        { time: '6:30 AM', activity: 'Morning jog or walk around Lumpini Park (300m from hotel) — watch the monitor lizards wake up' },
        { time: '8:30 AM', activity: 'Coffee and pastry at Café Kitsuné in Sindhorn Village — the iced matcha latte is the signature order' },
        { time: '10:00 AM', activity: 'Explore Sindhorn Village shops and the art installations around the development' },
        { time: '12:00 PM', activity: 'Lunch at Baan Khanitha on Soi Langsuan — try the tom yum goong and green curry' },
        { time: '2:00 PM', activity: 'Walk 5 minutes to LENGOLF at Mercury Ville for indoor golf (~550 THB/hour, up to 5 people)' },
        { time: '5:00 PM', activity: 'Return to Lumpini Park for sunset paddle boats on the lake (40 THB for 30 minutes)' },
        { time: '7:00 PM', activity: 'Dinner at Sorn for a once-in-a-lifetime Southern Thai tasting menu (book at least 2 weeks ahead)' },
      ],
    },
  },

  // ─── TH: things-to-do-near-sindhorn-midtown ───
  // Figures carried verbatim: 350 m field / 5 min / 4 stars, meta keeps EN's own
  // "400 m" wording, 40 บาท ต่อ 30 นาที, ประมาณ 550 บาท/ชั่วโมง, จอง 2 สัปดาห์ล่วงหน้า,
  // "Sorn (2 Michelin Stars)" left as a business name. Clock 24h + น.
  // "Restaurant Row" glossed rather than transliterated.
  {
    id: 'hotel-2-th',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-sindhorn-midtown',
    title: 'สิ่งที่น่าทำใกล้ Sindhorn Midtown Hotel กรุงเทพฯ | ไกด์ประจำย่าน',
    meta_description:
      'พักที่ Sindhorn Midtown อยู่ใช่ไหม นี่คือสิ่งที่น่าทำใกล้โรงแรม ทั้งกอล์ฟในร่มที่ LENGOLF (400 เมตร) ร้านอาหารรูฟท็อป ช้อปปิ้งที่ CentralWorld และอื่น ๆ รอบย่านลุมพินี',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'th',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/weekend-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Sindhorn Midtown Hotel',
      hotel_neighbourhood: 'หลังสวน / ชิดลม',
      hotel_distance_m: 350,
      walking_time_mins: 5,
      walking_directions:
        'ออกจาก Sindhorn Midtown มายังซอยหลังสวน (Soi Langsuan) เดินขึ้นไปทางทิศเหนือจนถึงถนนเพลินจิต (Ploenchit Road) แล้วเลี้ยวขวา (ไปทางทิศตะวันออก) เดินต่อไปทางสถานี BTS ชิดลม The Mercury Ville จะอยู่ทางขวามือ เชื่อมต่อกับ BTS โดยตรง LENGOLF อยู่ชั้น 4',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Baan Khanitha (Langsuan)', cuisine: 'อาหารไทยไฟน์ไดนิ่ง', distance_m: 200 },
        { name: 'Pizza Mania (Mercury Ville)', cuisine: 'อาหารอิตาเลียน', distance_m: 400 },
        { name: 'Café Kitsuné (Sindhorn Village)', cuisine: 'คาเฟ่ฝรั่งเศส', distance_m: 150 },
        { name: 'Sorn (2 Michelin Stars)', cuisine: 'อาหารไทยภาคใต้', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 300 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 350 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 150 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 600 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Sindhorn+Midtown+Hotel+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'ย่านหลังสวน-สินธรเป็นหนึ่งในย่านที่เดินเล่นสบายที่สุดของกรุงเทพฯ ทั้งซอยที่มีต้นไม้ให้ร่มเงา คอนโดระดับบน และร้านอาหารดี ๆ ที่คนกรุงเทพฯ จำนวนมากยกให้เป็นกลุ่มร้านที่ดีที่สุดของเมือง ซอยหลังสวนเองมีชื่อเล่นว่าถนนสายร้านอาหาร เพราะมีร้านไฟน์ไดนิ่งเรียงกันหนาแน่น ทั้ง Baan Khanitha ที่เสิร์ฟอาหารไทยชาววังในเรือนไม้แบบดั้งเดิม Gaggan Anand ที่ได้ดาวมิชลินหลายดวงจากอาหารอินเดียร่วมสมัย และ Sorn (2 Michelin Stars) ซึ่งเป็นหนึ่งในร้านที่ได้คะแนนสูงที่สุดของไทยในหมวดอาหารไทยภาคใต้ Sindhorn Village โครงการมิกซ์ยูสข้างโรงแรม มีร้านไลฟ์สไตล์ที่คัดมาอย่างดี รวมถึง Café Kitsuné ที่โด่งดังบนโซเชียล แต่ของดีจริงของย่านนี้คือสวนลุมพินี สวนสาธารณะที่เปรียบได้กับเซ็นทรัลพาร์กของกรุงเทพฯ ซึ่งอยู่ห่างจากโรงแรมเพียง 300 เมตร ช่วงเช้าตรู่คุณจะเห็นทั้งคนวิ่ง กลุ่มรำไทเก๊ก และตัวเงินตัวทองชื่อดังที่ออกมานอนผึ่งแดดริมทะเลสาบ สวนแห่งนี้คือกิจกรรมฟรีที่ดีที่สุดในใจกลางกรุงเทพฯ และเป็นวิธีเริ่มต้นวันที่ลงตัวก่อนที่อากาศจะร้อน',
      suggested_itinerary: [
        { time: '06:30 น.', activity: 'วิ่งหรือเดินรอบสวนลุมพินีตอนเช้า (ห่างจากโรงแรม 300 เมตร) แล้วดูตัวเงินตัวทองตื่นขึ้นมารับวันใหม่' },
        { time: '08:30 น.', activity: 'กาแฟและขนมอบที่ Café Kitsuné ใน Sindhorn Village เมนูประจำร้านคือมัทฉะลาเต้เย็น' },
        { time: '10:00 น.', activity: 'เดินสำรวจร้านค้าใน Sindhorn Village และงานศิลปะที่ติดตั้งอยู่รอบโครงการ' },
        { time: '12:00 น.', activity: 'มื้อกลางวันที่ Baan Khanitha ในซอยหลังสวน ลองต้มยำกุ้งและแกงเขียวหวาน' },
        { time: '14:00 น.', activity: 'เดิน 5 นาทีไปที่ LENGOLF ใน Mercury Ville เพื่อเล่นกอล์ฟในร่ม (ประมาณ 550 บาท/ชั่วโมง สำหรับผู้เล่นสูงสุด 5 คน)' },
        { time: '17:00 น.', activity: 'กลับไปสวนลุมพินีเพื่อถีบเรือเป็ดชมพระอาทิตย์ตกกลางทะเลสาบ (40 บาท ต่อ 30 นาที)' },
        { time: '19:00 น.', activity: 'มื้อเย็นที่ Sorn กับเทสติงเมนูอาหารไทยภาคใต้ที่หาที่ไหนไม่ได้ (จองล่วงหน้าอย่างน้อย 2 สัปดาห์)' },
      ],
    },
  },

  // ─── JA: things-to-do-near-sindhorn-midtown ───
  // Carries EN's own split figures without reconciling them: hotel_distance_m 350 /
  // 5分, but the meta says 400m (matching the nearby_activities card) — kept as EN
  // has it. Paddle boat 30分40THB, Sorn の予約は2週間以上前, all from EN.
  // 「レストラン・ロウ」 keeps EN's nickname as a quoted rendering.
  {
    id: 'hotel-2-ja',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-sindhorn-midtown',
    title: 'シンドーン・ミッドタウン周辺の過ごし方 — 宿泊者のためのエリアガイド',
    meta_description:
      'シンドーン・ミッドタウン（Sindhorn Midtown）周辺の過ごし方。徒歩400mのLENGOLFでインドアゴルフ、ランスアン通りのレストラン、ルンピニー公園、セントラルワールドでの買い物まで。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ja',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/weekend-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Sindhorn Midtown Hotel',
      hotel_neighbourhood: 'Langsuan / Chidlom',
      hotel_distance_m: 350,
      walking_time_mins: 5,
      walking_directions:
        'Sindhorn Midtownを出て、ランスアン通り（Soi Langsuan）へ。北へ進んでプルンチット通り（Ploenchit Road）に出たら、右（東）に曲がります。BTSチットロム駅の方向へ進むと、右手にBTSと直結したザ・マーキュリービルがあります。LENGOLFは4階です。',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Baan Khanitha (Langsuan)', cuisine: 'タイ高級料理', distance_m: 200 },
        { name: 'Pizza Mania (Mercury Ville)', cuisine: 'イタリア料理', distance_m: 400 },
        { name: 'Café Kitsuné (Sindhorn Village)', cuisine: 'フレンチカフェ', distance_m: 150 },
        { name: 'Sorn (2 Michelin Stars)', cuisine: '南部タイ料理', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 300 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 350 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 150 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 600 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Sindhorn+Midtown+Hotel+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'ランスアンからシンドーンにかけての一帯は、バンコクでも歩いていて気持ちのいい地区のひとつです。街路樹の並ぶ小道、高級レジデンス、そして地元の人が街で最高の部類と評するレストランが集まっています。ランスアン通りそのものが「レストラン・ロウ」と呼ばれるほどで、Baan Khanithaは伝統的な木造家屋で宮廷タイ料理を出し、Gaggan Anandは革新的なインド料理で複数のミシュランの星を持ち、Sorn（2 Michelin Stars）は南部タイ料理でタイ屈指の評価を得ています。ホテル隣の複合開発Sindhorn Villageには、選りすぐりのライフスタイルショップと、SNSで名高いCafé Kitsunéが入っています。ただ、この地区の本当の宝はホテルから300mのルンピニー公園。バンコクにとってのセントラルパークのような存在です。早朝にはジョギングをする人、太極拳のグループ、そして湖のほとりで日光浴をする有名なミズオオトカゲの姿が見られます。バンコク中心部で最高の無料アクティビティであり、暑くなる前に一日を始めるにはこれ以上ない場所でしょう。',
      suggested_itinerary: [
        { time: '6:30', activity: 'ルンピニー公園（ホテルから300m）でジョギングか散歩を。ミズオオトカゲが目を覚ます時間帯です' },
        { time: '8:30', activity: 'Sindhorn VillageのCafé Kitsunéでコーヒーとペストリーを。定番はアイス抹茶ラテ' },
        { time: '10:00', activity: 'Sindhorn Villageのショップと、敷地内に点在するアート作品を見て回ります' },
        { time: '12:00', activity: 'ランスアン通りのBaan Khanithaでランチ。トムヤムクンとグリーンカレーをぜひ' },
        { time: '14:00', activity: '徒歩5分でザ・マーキュリービルのLENGOLFへ。インドアゴルフを（1時間約550THB、最大5名まで／2026年7月現在）' },
        { time: '17:00', activity: 'ルンピニー公園に戻り、夕暮れの湖でペダルボートに（30分40THB）' },
        { time: '19:00', activity: 'Sornで南部タイ料理のテイスティングメニューを。一生ものの体験です（予約は2週間以上前に）' },
      ],
    },
  },

  // ─── KO: things-to-do-near-sindhorn-midtown ───
  // Figures from EN hotel-2: 350m / 5분(헤더), meta의 400m, 4층, Lumpini Park 300m,
  // 오리배 30분 40바트, Sorn 미쉐린 2스타, 2주 전 예약, 약 550바트/시간 최대 5명.
  // "The Mercury Ville 건물이" 처럼 Latin 뒤에는 반드시 한국어 명사를 붙였고,
  // Lumpini Park에는 동격 쉼표를 써서 조사 접촉을 피했어요.
  {
    id: 'hotel-2-ko',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-sindhorn-midtown',
    title: 'Sindhorn Midtown 주변 즐길 거리 — 랑수언·룸피니 로컬 가이드',
    meta_description:
      'Sindhorn Midtown에 묵는다면 400m 거리의 LENGOLF 실내 골프부터 루프톱 다이닝, CentralWorld 쇼핑까지 룸피니 주변에서 할 수 있는 것들을 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ko',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/weekend-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Sindhorn Midtown Hotel',
      hotel_neighbourhood: 'Langsuan / Chidlom',
      hotel_distance_m: 350,
      walking_time_mins: 5,
      walking_directions:
        'Sindhorn Midtown에서 Soi Langsuan 쪽으로 나옵니다. 북쪽으로 걸어 Ploenchit Road에 닿으면 오른쪽(동쪽)으로 꺾어요. BTS 칫롬역 방향으로 계속 걸으면 오른편에 The Mercury Ville 건물이 나와요. BTS와 바로 연결돼 있어요. LENGOLF는 4층에 있어요.',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Baan Khanitha (Langsuan)', cuisine: '태국 파인다이닝', distance_m: 200 },
        { name: 'Pizza Mania (Mercury Ville)', cuisine: '이탈리아 요리', distance_m: 400 },
        { name: 'Café Kitsuné (Sindhorn Village)', cuisine: '프랑스식 카페', distance_m: 150 },
        { name: 'Sorn (2 Michelin Stars)', cuisine: '남부 태국 요리', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 300 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 350 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 150 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 600 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Sindhorn+Midtown+Hotel+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Langsuan에서 Sindhorn으로 이어지는 일대는 방콕에서 걷기 가장 좋은 동네로 손꼽혀요. 가로수가 늘어선 소이와 고급 주거 타워, 그리고 현지인들이 방콕 최고 수준으로 치는 식당들이 모여 있어요. Soi Langsuan 자체는 파인다이닝 밀집도 때문에 "레스토랑 로우"라는 별명으로 불려요. Baan Khanitha 레스토랑은 전통 목조 가옥에서 왕실 태국 요리를 내고, Gaggan Anand 레스토랑은 프로그레시브 인도 요리로 미쉐린 스타를 여러 개 보유하고 있으며, Sorn 레스토랑(미쉐린 2스타)은 남부 태국 요리로 태국에서 가장 높은 평가를 받는 곳 중 하나예요. 호텔 옆 복합 개발지 Sindhorn Village에는 엄선된 라이프스타일 숍과 인스타그램으로 유명한 Café Kitsuné 매장이 들어와 있어요. 하지만 이 동네의 진짜 보석은 호텔에서 300m 거리에 있는 Lumpini Park, 방콕의 센트럴파크라 불리는 도심 공원이에요. 이른 아침이면 조깅하는 사람들과 태극권 그룹, 호숫가에서 일광욕하는 유명한 물왕도마뱀을 볼 수 있어요. 방콕 도심에서 가장 좋은 무료 액티비티이고, 더위가 오기 전에 하루를 시작하기에도 더할 나위 없어요.',
      suggested_itinerary: [
        { time: '06:30', activity: 'Lumpini Park(호텔에서 300m)에서 아침 조깅이나 산책 — 잠에서 깨어나는 물왕도마뱀을 만날 수 있어요' },
        { time: '08:30', activity: 'Sindhorn Village 안 Café Kitsuné에서 커피와 페이스트리 — 시그니처는 아이스 말차 라테예요' },
        { time: '10:00', activity: 'Sindhorn Village 상점들과 단지 곳곳의 아트 설치물 둘러보기' },
        { time: '12:00', activity: 'Soi Langsuan의 Baan Khanitha에서 점심 — 똠얌꿍과 그린 커리를 추천해요' },
        { time: '14:00', activity: '5분 걸어 Mercury Ville의 LENGOLF에서 실내 골프 (최대 5명까지 시간당 약 550바트, 2026년 7월 기준)' },
        { time: '17:00', activity: 'Lumpini Park에 다시 들러 호수에서 일몰 오리배 타기 (30분에 40바트)' },
        { time: '19:00', activity: 'Sorn에서 저녁 — 평생 한 번쯤은 경험할 만한 남부 태국 요리 테이스팅 메뉴 (최소 2주 전 예약)' },
      ],
    },
  },

  // ─── ZH: things-to-do-near-sindhorn-midtown ───
  // Figures carried from EN: 350m / 5分钟 / 4星, Lumpini 300m, Sindhorn Village 150m,
  // CentralWorld 600m, ~550泰铢/小时最多5人, 天鹅船30分钟40泰铢, 提前2周订位.
  // Meta keeps EN's own 400m figure (EN meta says 400m while hotel_distance_m is
  // 350 — flagged in report, not silently reconciled). Lumpini glossed once as 伦披尼公园.
  {
    id: 'hotel-2-zh',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-sindhorn-midtown',
    title: 'Sindhorn Midtown Hotel附近好去处 — 曼谷Langsuan一带指南',
    meta_description:
      '住在Sindhorn Midtown？周边可以这样安排：LENGOLF室内高尔夫（400米）、天台餐饮、CentralWorld购物，以及Lumpini公园一带的更多去处。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'zh',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/weekend-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Sindhorn Midtown Hotel',
      hotel_neighbourhood: 'Langsuan / Chidlom',
      hotel_distance_m: 350,
      walking_time_mins: 5,
      walking_directions:
        '从Sindhorn Midtown出来，走到Soi Langsuan上。向北走到Ploenchit Road，然后右转（向东）。继续朝BTS Chidlom站方向走——The Mercury Ville就在你的右手边，与BTS直接相连。LENGOLF在4楼。',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Baan Khanitha (Langsuan)', cuisine: '泰式高级料理', distance_m: 200 },
        { name: 'Pizza Mania (Mercury Ville)', cuisine: '意大利菜', distance_m: 400 },
        { name: 'Café Kitsuné (Sindhorn Village)', cuisine: '法式咖啡馆', distance_m: 150 },
        { name: 'Sorn (2 Michelin Stars)', cuisine: '泰南菜', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 300 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 350 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 150 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 600 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Sindhorn+Midtown+Hotel+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Langsuan–Sindhorn一带是曼谷最适合步行的街区之一——绿树成荫的小巷、高档住宅楼，还有一批被本地人视为全城顶尖的餐厅。Soi Langsuan本身因为高级餐厅密集，有“餐厅一条街”之称：Baan Khanitha在一栋传统木屋里做宫廷泰菜，Gaggan Anand凭前卫印度料理拿下多颗米其林星，Sorn（2 Michelin Stars）则是泰国泰南菜评价最高的餐厅之一。酒店旁边的综合体Sindhorn Village里有一批精选的生活方式店铺，还有在Instagram上很出名的Café Kitsuné。不过这一带真正的宝藏，是距酒店只有300米的Lumpini Park（伦披尼公园）——曼谷版的中央公园。清早你会看到晨跑的人、打太极的队伍，还有在湖边晒太阳的巨蜥。这座公园是曼谷市中心最好的免费活动，也很适合在暑气上来之前开启一天。',
      suggested_itinerary: [
        { time: '06:30', activity: '在Lumpini Park（距酒店300米）晨跑或散步——看着巨蜥慢慢醒过来' },
        { time: '08:30', activity: '在Sindhorn Village的Café Kitsuné吃点心配咖啡——招牌是冰抹茶拿铁' },
        { time: '10:00', activity: '逛Sindhorn Village的店铺，以及园区里的艺术装置' },
        { time: '12:00', activity: '在Soi Langsuan的Baan Khanitha吃午饭——试试冬阴功和绿咖喱' },
        { time: '14:00', activity: '步行5分钟到Mercury Ville里的LENGOLF打室内高尔夫（每小时约550泰铢，最多5人）' },
        { time: '17:00', activity: '回Lumpini Park在湖上踩船看日落（30分钟40泰铢）' },
        { time: '19:00', activity: '到Sorn吃一顿难得一遇的泰南菜品尝菜单（至少提前2周订位）' },
      ],
    },
  },
  {
    id: 'hotel-3',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-grand-hyatt-erawan',
    title: 'Things to Do Near Grand Hyatt Erawan Bangkok | Guest Guide',
    meta_description:
      'Staying at Grand Hyatt Erawan? Discover activities nearby — indoor golf at LENGOLF (500m walk), fine dining, the Erawan Shrine, and shopping at Gaysorn Village.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'en',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/date-night-ideas-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Grand Hyatt Erawan Bangkok',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 500,
      walking_time_mins: 6,
      walking_directions:
        'Exit Grand Hyatt Erawan and walk east along Ploenchit Road toward BTS Chidlom. Pass Gaysorn Village on your right. The Mercury Ville is connected to BTS Chidlom station on your left — enter from street level and take the escalator to Floor 4 for LENGOLF.',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Tables Grill (Grand Hyatt)', cuisine: 'Steakhouse', distance_m: 0 },
        { name: 'Erawan Tea Room', cuisine: 'Thai / Afternoon Tea', distance_m: 0 },
        { name: 'Nara Thai (CentralWorld)', cuisine: 'Thai', distance_m: 350 },
        { name: 'Biscotti (Anantara Siam)', cuisine: 'Italian', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 50 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 500 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 300 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Grand+Hyatt+Erawan+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The Grand Hyatt sits at the spiritual and commercial heart of Bangkok\'s Ratchaprasong district. The Erawan Shrine — just steps from the hotel entrance — is one of the most visited Hindu shrines in Southeast Asia, where locals and tourists offer garlands, incense, and even hire traditional Thai dance troupes to give thanks. The shrine is at its most atmospheric early morning and at dusk when the golden light catches the Brahma statue. Gaysorn Village, the luxury mall directly adjacent, houses brands like Louis Vuitton and Gucci across its polished marble floors — a stark contrast to the bustling street shrine next door. This is also the epicenter of Bangkok\'s skywalk network: from the hotel you can walk on air-conditioned elevated pathways all the way to Siam Paragon (15 minutes) without crossing a single road. For golf-loving guests — and the Grand Hyatt has many — LENGOLF offers a convenient 6-minute walk for a practice session or group activity, without the 1-hour drive to an outdoor course. The hotel\'s own Erawan Tea Room is a beloved afternoon tea destination, and Tables Grill downstairs is one of the best steakhouses in Bangkok.',
      suggested_itinerary: [
        { time: '8:00 AM', activity: 'Visit the Erawan Shrine before the crowds — watch the morning offerings and flower garlands being laid' },
        { time: '9:30 AM', activity: 'Breakfast at the Erawan Tea Room or the hotel\'s buffet restaurant' },
        { time: '11:00 AM', activity: 'Browse Gaysorn Village for luxury shopping — the top-floor food hall has excellent Thai craft items' },
        { time: '12:30 PM', activity: 'Lunch at Nara Thai in CentralWorld — reliable, refined Thai food in a comfortable setting' },
        { time: '2:30 PM', activity: 'Walk 6 minutes to LENGOLF for an afternoon golf session (~550 THB/hour, up to 5 people)' },
        { time: '5:00 PM', activity: 'Walk the skywalk to Siam Paragon — stop at the rooftop for skyline photos' },
        { time: '7:00 PM', activity: 'Dinner at Tables Grill (Grand Hyatt) — one of Bangkok\'s top steakhouses with dry-aged cuts' },
        { time: '9:00 PM', activity: 'Nightcap at the shrine — the Erawan is beautifully illuminated at night and much quieter than daytime' },
      ],
    },
  },

  // ─── TH: things-to-do-near-grand-hyatt-erawan ───
  // Figures carried verbatim: 500 m / 6 min / 5 stars, 15 นาที skywalk to Siam Paragon,
  // ขับรถ 1 ชั่วโมง to an outdoor course, ประมาณ 550 บาท/ชั่วโมง. Direction words kept
  // exactly as EN wrote them (EN says "west" toward Chidlom — carried, flagged).
  // Erawan Shrine glossed as ศาลพระพรหมเอราวัณ in prose; the field name stays Latin.
  {
    id: 'hotel-3-th',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-grand-hyatt-erawan',
    title: 'สิ่งที่น่าทำใกล้ Grand Hyatt Erawan Bangkok | ไกด์สำหรับผู้เข้าพัก',
    meta_description:
      'พักที่ Grand Hyatt Erawan อยู่ใช่ไหม รวมกิจกรรมใกล้โรงแรม ทั้งกอล์ฟในร่มที่ LENGOLF (เดิน 500 เมตร) ร้านอาหารไฟน์ไดนิ่ง ศาลพระพรหมเอราวัณ และช้อปปิ้งที่ Gaysorn Village',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'th',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/date-night-ideas-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Grand Hyatt Erawan Bangkok',
      hotel_neighbourhood: 'ราชประสงค์ / ชิดลม',
      hotel_distance_m: 500,
      walking_time_mins: 6,
      walking_directions:
        'ออกจาก Grand Hyatt Erawan แล้วเดินไปทางทิศตะวันออกตามถนนเพลินจิต (Ploenchit Road) มุ่งหน้าสู่ BTS ชิดลม ผ่าน Gaysorn Village ทางขวามือ The Mercury Ville เชื่อมต่อกับสถานี BTS ชิดลม อยู่ทางซ้ายมือ เข้าจากระดับถนนแล้วขึ้นบันไดเลื่อนไปชั้น 4 เพื่อไปยัง LENGOLF',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Tables Grill (Grand Hyatt)', cuisine: 'สเต๊กเฮาส์', distance_m: 0 },
        { name: 'Erawan Tea Room', cuisine: 'อาหารไทย / ชายามบ่าย', distance_m: 0 },
        { name: 'Nara Thai (CentralWorld)', cuisine: 'อาหารไทย', distance_m: 350 },
        { name: 'Biscotti (Anantara Siam)', cuisine: 'อาหารอิตาเลียน', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 50 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 500 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 300 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Grand+Hyatt+Erawan+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Grand Hyatt ตั้งอยู่ในจุดที่เป็นทั้งศูนย์กลางทางความเชื่อและทางการค้าของย่านราชประสงค์ ศาลพระพรหมเอราวัณ (Erawan Shrine) ซึ่งอยู่ห่างจากทางเข้าโรงแรมเพียงไม่กี่ก้าว เป็นศาลฮินดูที่มีผู้มาสักการะมากที่สุดแห่งหนึ่งในเอเชียตะวันออกเฉียงใต้ ทั้งคนไทยและนักท่องเที่ยวมาถวายพวงมาลัย จุดธูป และบางคนถึงกับว่าจ้างคณะรำแก้บน ช่วงที่ศาลมีบรรยากาศดีที่สุดคือเช้าตรู่และตอนโพล้เพล้ เมื่อแสงสีทองต้ององค์พระพรหม Gaysorn Village ห้างหรูที่อยู่ติดกัน รวมแบรนด์อย่าง Louis Vuitton และ Gucci ไว้บนพื้นหินอ่อนขัดเงา ตัดกับความคึกคักของศาลริมถนนข้าง ๆ อย่างชัดเจน ที่นี่ยังเป็นศูนย์กลางของเครือข่ายทางเดินลอยฟ้าของกรุงเทพฯ จากโรงแรมคุณเดินบนทางเดินลอยฟ้าติดแอร์ไปได้ไกลถึง Siam Paragon (15 นาที) โดยไม่ต้องข้ามถนนสักเส้น สำหรับผู้เข้าพักที่ชอบกอล์ฟ ซึ่ง Grand Hyatt มีอยู่ไม่น้อย LENGOLF อยู่ห่างออกไปเพียง 6 นาทีเดิน จึงซ้อมหรือจัดกิจกรรมกลุ่มได้สะดวก โดยไม่ต้องขับรถ 1 ชั่วโมงไปสนามกลางแจ้ง Erawan Tea Room ของโรงแรมเองเป็นจุดหมายยอดนิยมสำหรับชายามบ่าย ส่วน Tables Grill ที่อยู่ชั้นล่างเป็นหนึ่งในสเต๊กเฮาส์ที่ดีที่สุดในกรุงเทพฯ',
      suggested_itinerary: [
        { time: '08:00 น.', activity: 'ไปศาลพระพรหมเอราวัณก่อนคนเยอะ ดูการถวายเครื่องสักการะและพวงมาลัยในตอนเช้า' },
        { time: '09:30 น.', activity: 'อาหารเช้าที่ Erawan Tea Room หรือห้องอาหารบุฟเฟต์ของโรงแรม' },
        { time: '11:00 น.', activity: 'เดินดู Gaysorn Village สำหรับช้อปปิ้งแบรนด์หรู ชั้นบนสุดมีฟู้ดฮอลล์และงานคราฟต์ไทยที่คัดมาดี' },
        { time: '12:30 น.', activity: 'มื้อกลางวันที่ Nara Thai ใน CentralWorld อาหารไทยที่ประณีตและไว้ใจได้ในบรรยากาศสบาย ๆ' },
        { time: '14:30 น.', activity: 'เดิน 6 นาทีไปที่ LENGOLF เพื่อเล่นกอล์ฟรอบบ่าย (ประมาณ 550 บาท/ชั่วโมง สำหรับผู้เล่นสูงสุด 5 คน)' },
        { time: '17:00 น.', activity: 'เดินทางเดินลอยฟ้าไป Siam Paragon แล้วแวะชั้นดาดฟ้าเพื่อถ่ายรูปเส้นขอบฟ้าของเมือง' },
        { time: '19:00 น.', activity: 'มื้อเย็นที่ Tables Grill (Grand Hyatt) หนึ่งในสเต๊กเฮาส์ชั้นนำของกรุงเทพฯ ที่เสิร์ฟเนื้อดรายเอจ' },
        { time: '21:00 น.', activity: 'ปิดท้ายค่ำคืนที่ศาล ตอนกลางคืนศาลพระพรหมเอราวัณจะสว่างสวยและเงียบกว่าตอนกลางวันมาก' },
      ],
    },
  },

  // ─── JA: things-to-do-near-grand-hyatt-erawan ───
  // walking_directions carries EN's 「西へ」 verbatim even though Chidlom is east of
  // Ratchaprasong — flagged to the orchestrator rather than silently corrected.
  // Erawan Shrine glossed as エラワン廟 in prose; the name field stays Latin.
  // Figures: 500m / 6分 / 徒歩6分 / サイアムパラゴンまで15分 / 約550THB / 最大5名.
  {
    id: 'hotel-3-ja',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-grand-hyatt-erawan',
    title: 'グランド・ハイアット・エラワン周辺の過ごし方 — 宿泊者向けガイド',
    meta_description:
      'グランド・ハイアット・エラワン（Grand Hyatt Erawan）周辺の過ごし方。徒歩500mのLENGOLFでインドアゴルフ、エラワン廟、Gaysorn Villageでの買い物、高級レストランまで。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ja',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/date-night-ideas-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Grand Hyatt Erawan Bangkok',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 500,
      walking_time_mins: 6,
      walking_directions:
        'Grand Hyatt Erawanを出て、プルンチット通り（Ploenchit Road）を東へ、BTSチットロム駅の方向に歩きます。右手にGaysorn Villageを見ながら進んでください。BTSチットロム駅と直結したザ・マーキュリービルが左手にあります。1階から入り、エスカレーターで4階へ上がるとLENGOLFです。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Tables Grill (Grand Hyatt)', cuisine: 'ステーキハウス', distance_m: 0 },
        { name: 'Erawan Tea Room', cuisine: 'タイ料理／アフタヌーンティー', distance_m: 0 },
        { name: 'Nara Thai (CentralWorld)', cuisine: 'タイ料理', distance_m: 350 },
        { name: 'Biscotti (Anantara Siam)', cuisine: 'イタリア料理', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 50 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 500 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 300 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Grand+Hyatt+Erawan+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Grand Hyattが建つのは、バンコクのラチャプラソン地区の、信仰と商業の中心そのものです。ホテルの入口からすぐのエラワン廟は、東南アジアでもっとも参拝者の多いヒンドゥー寺院のひとつ。地元の人も旅行者も花輪や線香を供え、願いがかなった礼に伝統舞踊の一団を呼ぶ人もいます。もっとも雰囲気があるのは早朝と夕暮れ時、金色の光がブラフマー像に当たる時間帯です。隣接する高級モールGaysorn Villageは、磨き上げられた大理石の床にLouis VuittonやGucciが並び、すぐ隣の路上の廟のにぎわいとは対照的な世界。この一帯はバンコクのスカイウォーク網の中心でもあり、ホテルから一度も道路を渡ることなく、冷房の効いた歩道橋づたいにサイアムパラゴンまで15分で歩けます。ゴルフ好きの宿泊客が多いGrand Hyattでは、徒歩6分のLENGOLFが手軽な選択肢になります。屋外コースまで車で1時間かけなくても、練習やグループでの利用ができるからです。ホテル内のErawan Tea Roomはアフタヌーンティーの名所として親しまれ、階下のTables Grillはバンコクでも指折りのステーキハウスです。',
      suggested_itinerary: [
        { time: '8:00', activity: '人が増える前にエラワン廟へ。朝の供物と花輪が並べられていく様子が見られます' },
        { time: '9:30', activity: 'Erawan Tea Roomか、ホテルのビュッフェレストランで朝食' },
        { time: '11:00', activity: 'Gaysorn Villageでラグジュアリーな買い物を。最上階のフードホールにはタイのクラフト雑貨も揃います' },
        { time: '12:30', activity: 'セントラルワールドのNara Thaiでランチ。落ち着いた店内で、安定して洗練されたタイ料理が味わえます' },
        { time: '14:30', activity: '徒歩6分でLENGOLFへ。午後のゴルフセッションを（1時間約550THB、最大5名まで／2026年7月現在）' },
        { time: '17:00', activity: 'スカイウォークを歩いてサイアムパラゴンへ。屋上からスカイラインの写真を' },
        { time: '19:00', activity: 'Tables Grill（Grand Hyatt）でディナー。ドライエイジングの肉を出すバンコク屈指のステーキハウスです' },
        { time: '21:00', activity: '一日の締めくくりにもう一度エラワン廟へ。夜は美しくライトアップされ、日中よりずっと静かです' },
      ],
    },
  },

  // ─── KO: things-to-do-near-grand-hyatt-erawan ───
  // Figures from EN hotel-3: 500m / 6분, 4층, Erawan Shrine 50m, Gaysorn 100m,
  // Siam Paragon 스카이워크 15분, 약 550바트/시간 최대 5명. EN의 "walk west …
  // toward BTS Chidlom" 방향어는 그대로 옮겼습니다(보고서에 EN 모순으로 보고).
  {
    id: 'hotel-3-ko',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-grand-hyatt-erawan',
    title: 'Grand Hyatt Erawan 방콕 주변 즐길 거리 — 투숙객 가이드',
    meta_description:
      'Grand Hyatt Erawan에 묵는다면 도보 500m 거리의 LENGOLF 실내 골프를 비롯해 파인다이닝, Erawan Shrine, Gaysorn Village 쇼핑까지 가까운 즐길 거리를 소개해요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ko',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/date-night-ideas-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Grand Hyatt Erawan Bangkok',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 500,
      walking_time_mins: 6,
      walking_directions:
        'Grand Hyatt Erawan 호텔에서 나와 Ploenchit Road에서 동쪽으로, BTS 칫롬역 방향으로 걸어갑니다. 오른편으로 Gaysorn Village 쇼핑몰을 지나갑니다. 왼편에 있는 The Mercury Ville 건물은 BTS 칫롬역과 연결돼 있어요. 지상층에서 들어가 에스컬레이터를 타고 4층 LENGOLF까지 올라가면 됩니다.',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Tables Grill (Grand Hyatt)', cuisine: '스테이크하우스', distance_m: 0 },
        { name: 'Erawan Tea Room', cuisine: '태국 요리 / 애프터눈 티', distance_m: 0 },
        { name: 'Nara Thai (CentralWorld)', cuisine: '태국 요리', distance_m: 350 },
        { name: 'Biscotti (Anantara Siam)', cuisine: '이탈리아 요리', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 50 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 500 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 300 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Grand+Hyatt+Erawan+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Grand Hyatt 호텔은 방콕 Ratchaprasong 지구의 종교적이면서 상업적인 중심에 자리해요. 호텔 입구에서 몇 걸음 거리에 있는 Erawan Shrine 사원은 동남아시아에서 가장 많은 참배객이 찾는 힌두 사원 중 하나예요. 현지인과 여행자가 화환과 향을 올리고, 감사의 뜻으로 전통 태국 무용단을 부르기도 해요. 이른 아침과 해 질 무렵, 금빛이 브라마 상에 내려앉을 때 분위기가 가장 좋아요. 바로 옆 럭셔리 몰 Gaysorn Village에는 Louis Vuitton, Gucci 같은 브랜드가 반들거리는 대리석 바닥 위로 늘어서 있어요. 바로 옆 길거리 사원의 활기와는 뚜렷하게 대비되는 풍경이에요. 이 일대는 방콕 스카이워크 네트워크의 중심이기도 해요. 호텔에서 출발하면 도로를 한 번도 건너지 않고 에어컨이 나오는 고가 보행로만 따라 Siam Paragon까지 15분이면 갈 수 있어요. 골프를 즐기는 투숙객에게 — Grand Hyatt 호텔에는 그런 손님이 많아요 — LENGOLF는 도보 6분 거리에서 연습 세션이나 단체 활동을 할 수 있는 선택지예요. 야외 코스까지 1시간을 달릴 필요가 없어요. 호텔 안 Erawan Tea Room 매장은 애프터눈 티 명소로 오래 사랑받아 왔고, 아래층 Tables Grill 레스토랑은 방콕 최고의 스테이크하우스 중 하나로 꼽혀요.',
      suggested_itinerary: [
        { time: '08:00', activity: '사람이 몰리기 전에 Erawan Shrine 방문 — 아침 공양과 꽃 화환을 올리는 모습을 볼 수 있어요' },
        { time: '09:30', activity: 'Erawan Tea Room 또는 호텔 뷔페 레스토랑에서 아침 식사' },
        { time: '11:00', activity: 'Gaysorn Village에서 럭셔리 쇼핑 — 꼭대기 층 푸드홀에는 태국 공예품이 잘 갖춰져 있어요' },
        { time: '12:30', activity: 'CentralWorld 안 Nara Thai에서 점심 — 편안한 분위기에서 정갈한 태국 요리를 안정적으로 즐길 수 있어요' },
        { time: '14:30', activity: '6분 걸어 LENGOLF에서 오후 골프 세션 (최대 5명까지 시간당 약 550바트, 2026년 7월 기준)' },
        { time: '17:00', activity: '스카이워크를 따라 Siam Paragon까지 이동 — 옥상에서 스카이라인 사진을 남겨 보세요' },
        { time: '19:00', activity: 'Tables Grill (Grand Hyatt)에서 저녁 — 드라이에이징 스테이크로 유명한 방콕 최상급 스테이크하우스 중 하나예요' },
        { time: '21:00', activity: '밤의 사원에서 하루 마무리 — Erawan Shrine 사원은 밤에 아름답게 조명이 들어오고 낮보다 훨씬 조용해요' },
      ],
    },
  },

  // ─── ZH: things-to-do-near-grand-hyatt-erawan ───
  // Figures carried from EN: 500m / 6分钟 / 5星, Erawan 50m, Gaysorn 100m,
  // CentralWorld 300m, Siam Paragon 700m 及空中步道15分钟, ~550泰铢/小时最多5人.
  // Erawan Shrine glossed once as 四面佛, Siam Paragon once as 暹罗百丽宫; the name
  // fields stay Latin. EN's "walk west toward BTS Chidlom" carried verbatim (see report).
  {
    id: 'hotel-3-zh',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-grand-hyatt-erawan',
    title: 'Grand Hyatt Erawan附近好去处 — 曼谷住客周边指南',
    meta_description:
      '住在Grand Hyatt Erawan？周边可玩的不少：步行500米到LENGOLF打室内高尔夫，还有四面佛、Gaysorn Village购物与高级餐饮。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'zh',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/date-night-ideas-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Grand Hyatt Erawan Bangkok',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 500,
      walking_time_mins: 6,
      walking_directions:
        '从Grand Hyatt Erawan出来，沿Ploenchit Road向东朝BTS Chidlom站走，右手边会经过Gaysorn Village。The Mercury Ville在你左手边，与BTS Chidlom站相连——从街面进入，搭扶梯上到4楼就是LENGOLF。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Tables Grill (Grand Hyatt)', cuisine: '牛排餐厅', distance_m: 0 },
        { name: 'Erawan Tea Room', cuisine: '泰餐、下午茶', distance_m: 0 },
        { name: 'Nara Thai (CentralWorld)', cuisine: '泰餐', distance_m: 350 },
        { name: 'Biscotti (Anantara Siam)', cuisine: '意大利菜', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 50 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 500 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 300 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Grand+Hyatt+Erawan+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Grand Hyatt坐落在曼谷Ratchaprasong区的精神与商业中心。离酒店大门只有几步路的Erawan Shrine（四面佛）是东南亚参拜人数最多的印度教神龛之一，本地人和游客在这里献花环、上香，甚至请传统泰舞团来还愿。清晨和黄昏时分最有气氛，金色的光线打在梵天像上。紧邻酒店的奢侈品商场Gaysorn Village里，Louis Vuitton、Gucci等品牌在打磨光亮的大理石地面上一字排开，与隔壁热闹的街边神龛形成强烈反差。这里也是曼谷空中步道网络的核心：从酒店出发，你可以全程走在有空调的高架步道上，一路走到Siam Paragon（暹罗百丽宫，15分钟），中途不必穿过任何一条马路。对爱打高尔夫的住客来说——Grand Hyatt这样的客人不少——LENGOLF步行6分钟就到，不必开一小时车去室外球场，也能练一场球或和朋友一起玩。酒店自家的Erawan Tea Room是很受欢迎的下午茶去处，楼下的Tables Grill也是曼谷最好的牛排餐厅之一。',
      suggested_itinerary: [
        { time: '08:00', activity: '趁人少先去Erawan Shrine——看清晨的供奉和一串串献上的花环' },
        { time: '09:30', activity: '在Erawan Tea Room或酒店的自助餐厅吃早餐' },
        { time: '11:00', activity: '逛Gaysorn Village买奢侈品——顶层的美食区还有不错的泰国手工艺品' },
        { time: '12:30', activity: '在CentralWorld的Nara Thai吃午饭——环境舒服，泰菜稳定又精致' },
        { time: '14:30', activity: '步行6分钟到LENGOLF打一场下午的球（每小时约550泰铢，最多5人）' },
        { time: '17:00', activity: '沿空中步道走到Siam Paragon——上天台拍城市天际线' },
        { time: '19:00', activity: '在Tables Grill（Grand Hyatt）吃晚餐——曼谷顶尖的牛排餐厅之一，供应干式熟成牛肉' },
        { time: '21:00', activity: '以神龛为一天收尾——夜里的Erawan打上灯很美，也比白天安静得多' },
      ],
    },
  },
  {
    id: 'hotel-4',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-athenee-hotel',
    title: 'Things to Do Near The Athenee Hotel Bangkok | Activities Guide',
    meta_description:
      'Staying at The Athenee Hotel Bangkok? Discover nearby activities — indoor golf at LENGOLF (700m), Lumpini Park, shopping, and fine dining around Wireless Road.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'en',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/indoor-activities-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'The Athenee Hotel Bangkok, a Luxury Collection Hotel',
      hotel_neighbourhood: 'Wireless Road / Ploenchit',
      hotel_distance_m: 700,
      walking_time_mins: 10,
      walking_directions:
        'Exit The Athenee Hotel onto Wireless Road. Walk north to the Ploenchit Road intersection. Turn left (west) on Ploenchit Road and walk toward BTS Chidlom — about 7 minutes from the intersection. The Mercury Ville is on your left, connected to BTS Chidlom. LENGOLF is on Floor 4.',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'The Rain Tree Café (Athenee)', cuisine: 'International Buffet', distance_m: 0 },
        { name: 'The House on Sathorn', cuisine: 'Thai Fine Dining', distance_m: 800 },
        { name: 'Baan Khanitha (Langsuan)', cuisine: 'Thai Fine Dining', distance_m: 400 },
        { name: 'Gaggan Anand', cuisine: 'Progressive Indian', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 400 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'US Embassy / UK Embassy', type: 'landmark', distance_m: 300 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=The+Athenee+Hotel+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Wireless Road (Thanon Witthayu) is Bangkok\'s embassy district — a leafy, prestigious boulevard lined with diplomatic compounds, luxury residences, and some of the city\'s finest dining. The US Embassy and UK Embassy are both within 300m of The Athenee, which gives the area a distinctly international, cosmopolitan feel. The street is quieter and more spacious than the bustling Sukhumvit or Silom areas, making it feel more like a European capital than the chaos of Bangkok. The Athenee itself has a storied history — it\'s built on the grounds of the former Kandhavas Palace and retains grand banquet halls that are among the most sought-after event venues in the city. For corporate guests (and there are many), the hotel\'s proximity to LENGOLF makes it easy to organize a post-meeting team activity without complex logistics. Lumpini Park is a 400m walk for guests who want green space, and Soi Langsuan — with its cluster of Michelin-starred restaurants — is just around the corner. The Gaggan Anand (progressive Indian, regularly ranked among Asia\'s best restaurants) is a 500m walk and worth booking well in advance.',
      suggested_itinerary: [
        { time: '7:00 AM', activity: 'Morning walk to Lumpini Park (400m) for a jog around the lake — the park opens at 4:30 AM' },
        { time: '9:00 AM', activity: 'Breakfast buffet at The Rain Tree Café — one of Bangkok\'s most lavish hotel breakfast spreads' },
        { time: '10:30 AM', activity: 'Walk along Wireless Road to see the embassies and the grand colonial-era architecture' },
        { time: '12:00 PM', activity: 'Lunch at Baan Khanitha on Soi Langsuan — traditional Thai fine dining in a teak house' },
        { time: '2:00 PM', activity: 'Walk 8 minutes to LENGOLF for a group golf session — ideal team outing (event packages from ~9,999 THB)' },
        { time: '5:00 PM', activity: 'Afternoon tea or cocktails at the hotel\'s lobby lounge' },
        { time: '7:30 PM', activity: 'Dinner at Gaggan Anand (500m) — book weeks ahead for the progressive Indian tasting menu' },
      ],
    },
  },

  // ─── TH: things-to-do-near-athenee-hotel ───
  // Figures carried verbatim: 700 m / 10 min / 5 stars, 300 m embassies, 400 m Lumpini,
  // 500 m Gaggan Anand, สวนเปิด 04:30 น., แพ็กเกจจัดงานเริ่มต้นประมาณ 9,999 บาท (the only
  // LENGOLF price on this page — EN quotes the event package, not the hourly rate).
  // EN's "8 minutes" in the itinerary vs 10 min field is carried as written.
  {
    id: 'hotel-4-th',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-athenee-hotel',
    title: 'สิ่งที่น่าทำใกล้ The Athenee Hotel Bangkok | ไกด์กิจกรรม',
    meta_description:
      'พักที่ The Athenee Hotel Bangkok อยู่ใช่ไหม รวมกิจกรรมใกล้โรงแรม ทั้งกอล์ฟในร่มที่ LENGOLF (700 เมตร) สวนลุมพินี ช้อปปิ้ง และร้านอาหารไฟน์ไดนิ่งรอบถนนวิทยุ',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'th',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/indoor-activities-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'The Athenee Hotel Bangkok, a Luxury Collection Hotel',
      hotel_neighbourhood: 'ถนนวิทยุ / เพลินจิต',
      hotel_distance_m: 700,
      walking_time_mins: 10,
      walking_directions:
        'ออกจาก The Athenee Hotel มายังถนนวิทยุ (Wireless Road) เดินขึ้นไปทางทิศเหนือจนถึงแยกถนนเพลินจิต (Ploenchit Road) เลี้ยวซ้าย (ไปทางทิศตะวันตก) เข้าถนนเพลินจิต แล้วเดินมุ่งหน้าสู่ BTS ชิดลม ราว 7 นาทีจากแยก The Mercury Ville จะอยู่ทางซ้ายมือ เชื่อมต่อกับ BTS ชิดลม LENGOLF อยู่ชั้น 4',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'The Rain Tree Café (Athenee)', cuisine: 'บุฟเฟต์นานาชาติ', distance_m: 0 },
        { name: 'The House on Sathorn', cuisine: 'อาหารไทยไฟน์ไดนิ่ง', distance_m: 800 },
        { name: 'Baan Khanitha (Langsuan)', cuisine: 'อาหารไทยไฟน์ไดนิ่ง', distance_m: 400 },
        { name: 'Gaggan Anand', cuisine: 'อาหารอินเดียร่วมสมัย', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 400 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'US Embassy / UK Embassy', type: 'landmark', distance_m: 300 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=The+Athenee+Hotel+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'ถนนวิทยุ (Wireless Road หรือถนนวิทยุในชื่อไทย) คือย่านสถานทูตของกรุงเทพฯ เป็นถนนสายใหญ่ร่มรื่นที่เรียงรายด้วยเขตสถานทูต ที่พักอาศัยระดับบน และร้านอาหารชั้นดีที่สุดบางแห่งของเมือง สถานทูตสหรัฐฯ และสถานทูตอังกฤษอยู่ห่างจาก The Athenee ไม่เกิน 300 เมตร ย่านนี้จึงมีบรรยากาศสากลอย่างชัดเจน ถนนเงียบและโปร่งกว่าย่านสุขุมวิทหรือสีลมที่จอแจ จนบางครั้งให้ความรู้สึกใกล้เคียงเมืองหลวงในยุโรปมากกว่าความวุ่นวายแบบกรุงเทพฯ ตัว The Athenee เองก็มีประวัติยาวนาน เพราะสร้างบนพื้นที่ของวังคันธวาสเดิม และยังคงห้องจัดเลี้ยงขนาดใหญ่ที่เป็นสถานที่จัดงานซึ่งเป็นที่ต้องการมากที่สุดแห่งหนึ่งของเมือง สำหรับแขกองค์กรซึ่งมีจำนวนมาก การที่โรงแรมอยู่ใกล้ LENGOLF ทำให้จัดกิจกรรมทีมหลังประชุมได้ง่ายโดยไม่ต้องวางแผนซับซ้อน สวนลุมพินีอยู่ห่างออกไป 400 เมตรสำหรับคนที่อยากได้พื้นที่สีเขียว และซอยหลังสวนที่รวมร้านระดับมิชลินไว้หนาแน่นก็อยู่แค่หัวมุมถัดไป Gaggan Anand (อาหารอินเดียร่วมสมัย ที่ติดอันดับร้านดีที่สุดของเอเชียอยู่เป็นประจำ) อยู่ห่าง 500 เมตร และควรจองล่วงหน้านาน ๆ',
      suggested_itinerary: [
        { time: '07:00 น.', activity: 'เดินไปสวนลุมพินี (400 เมตร) ตอนเช้าเพื่อวิ่งรอบทะเลสาบ สวนเปิดตั้งแต่ 04:30 น.' },
        { time: '09:00 น.', activity: 'บุฟเฟต์อาหารเช้าที่ The Rain Tree Café หนึ่งในอาหารเช้าโรงแรมที่จัดเต็มที่สุดของกรุงเทพฯ' },
        { time: '10:30 น.', activity: 'เดินเล่นตามถนนวิทยุเพื่อดูอาคารสถานทูตและสถาปัตยกรรมยุคอาณานิคม' },
        { time: '12:00 น.', activity: 'มื้อกลางวันที่ Baan Khanitha ในซอยหลังสวน อาหารไทยไฟน์ไดนิ่งแบบดั้งเดิมในเรือนไม้สัก' },
        { time: '14:00 น.', activity: 'เดิน 8 นาทีไปที่ LENGOLF เพื่อเล่นกอล์ฟแบบกลุ่ม เหมาะกับกิจกรรมทีม (แพ็กเกจจัดงานเริ่มต้นประมาณ 9,999 บาท)' },
        { time: '17:00 น.', activity: 'ชายามบ่ายหรือค็อกเทลที่เลานจ์ล็อบบี้ของโรงแรม' },
        { time: '19:30 น.', activity: 'มื้อเย็นที่ Gaggan Anand (500 เมตร) จองล่วงหน้าหลายสัปดาห์สำหรับเทสติงเมนูอาหารอินเดียร่วมสมัย' },
      ],
    },
  },

  // ─── JA: things-to-do-near-athenee-hotel ───
  // Corporate-guest framing kept LENGOLF-scoped and factual; no language claim added
  // (EN makes none). Wireless Road glossed ウィッタユ通り with both the Latin sign
  // name and EN's own Thanon Witthayu in area_guide. Figures: 700m / 10分 /
  // 交差点から約7分 / 徒歩8分 (itinerary) / 400m / 500m / イベントパッケージ約9,999THB.
  {
    id: 'hotel-4-ja',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-athenee-hotel',
    title: 'ジ・アテネ・ホテル・バンコク周辺の過ごし方 — アクティビティガイド',
    meta_description:
      'ジ・アテネ・ホテル・バンコク（The Athenee Hotel Bangkok）周辺の過ごし方。徒歩700mのLENGOLFでインドアゴルフ、ルンピニー公園、ウィッタユ通りの買い物と高級レストランをご紹介します。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ja',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/indoor-activities-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'The Athenee Hotel Bangkok, a Luxury Collection Hotel',
      hotel_neighbourhood: 'Wireless Road / Ploenchit',
      hotel_distance_m: 700,
      walking_time_mins: 10,
      walking_directions:
        'The Athenee Hotelを出て、ウィッタユ通り（Wireless Road）へ。北へ進み、プルンチット通り（Ploenchit Road）との交差点まで歩きます。交差点で左（西）に曲がり、プルンチット通りをBTSチットロム駅の方向へ。交差点からおよそ7分です。左手にBTSチットロム駅と直結したザ・マーキュリービルがあります。LENGOLFは4階です。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'The Rain Tree Café (Athenee)', cuisine: 'インターナショナルビュッフェ', distance_m: 0 },
        { name: 'The House on Sathorn', cuisine: 'タイ高級料理', distance_m: 800 },
        { name: 'Baan Khanitha (Langsuan)', cuisine: 'タイ高級料理', distance_m: 400 },
        { name: 'Gaggan Anand', cuisine: '革新的インド料理', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 400 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'US Embassy / UK Embassy', type: 'landmark', distance_m: 300 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=The+Athenee+Hotel+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'ウィッタユ通り（Wireless Road／Thanon Witthayu）は、バンコクの大使館街です。緑の多い格式ある大通りに、各国の公館と高級レジデンス、そして市内屈指のレストランが並びます。The Athenee Hotelから300m以内に米国大使館と英国大使館があり、界隈には国際色豊かで洗練された空気が漂います。にぎやかなスクンビットやシーロムと比べると通りは静かでゆったりしていて、バンコクの喧騒よりもヨーロッパの首都に近い雰囲気があります。ホテル自体にも由緒があり、かつての旧カンタワート宮殿（Kandhavas Palace）の敷地に建てられ、市内でもっとも人気の高い宴会場のひとつとされる大広間を今も備えています。ビジネス目的の宿泊客が多いホテルですが、LENGOLFが近いおかげで、会議のあとのチームアクティビティを面倒な手配なしに組めます。緑地を求めるなら徒歩400mのルンピニー公園、ミシュランの星を持つ店が集まるランスアン通りもすぐそこ。アジアのベストレストランに毎年名を連ねる革新的インド料理のGaggan Anandは徒歩500mですが、こちらは早めの予約をおすすめします。',
      suggested_itinerary: [
        { time: '7:00', activity: 'ルンピニー公園（400m）まで歩き、湖の周りをジョギング。公園は4時30分から開いています' },
        { time: '9:00', activity: 'The Rain Tree Caféで朝食ビュッフェを。バンコクでも指折りの豪華なホテル朝食です' },
        { time: '10:30', activity: 'ウィッタユ通りを歩いて、大使館群と重厚なコロニアル時代の建築を眺めます' },
        { time: '12:00', activity: 'ランスアン通りのBaan Khanithaでランチ。チーク材の邸宅で味わう伝統的なタイの高級料理です' },
        { time: '14:00', activity: '徒歩8分でLENGOLFへ。グループでのゴルフセッションはチームの集まりにぴったりです（イベントパッケージは約9,999THBから／2026年7月現在）' },
        { time: '17:00', activity: 'ホテルのロビーラウンジでアフタヌーンティーかカクテルを' },
        { time: '19:30', activity: 'Gaggan Anand（500m）でディナー。革新的インド料理のテイスティングメニューは数週間前の予約を' },
      ],
    },
  },

  // ─── KO: things-to-do-near-athenee-hotel ───
  // Figures from EN hotel-4: 700m / 10분, 교차로에서 7분, itinerary의 도보 8분,
  // 대사관 300m, Lumpini Park 400m(공원 개장 04:30), Gaggan Anand 500m,
  // 이벤트 패키지 약 9,999바트부터. Thanon Witthayu는 EN 그대로 병기.
  {
    id: 'hotel-4-ko',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-athenee-hotel',
    title: 'The Athenee Hotel Bangkok 주변 즐길 거리 — 액티비티 가이드',
    meta_description:
      'The Athenee Hotel Bangkok에 묵는다면 도보 700m 거리의 LENGOLF 실내 골프부터 Lumpini Park, 쇼핑, Wireless Road 주변 파인다이닝까지 가까운 즐길 거리를 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ko',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/indoor-activities-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'The Athenee Hotel Bangkok, a Luxury Collection Hotel',
      hotel_neighbourhood: 'Wireless Road / Ploenchit',
      hotel_distance_m: 700,
      walking_time_mins: 10,
      walking_directions:
        'The Athenee Hotel에서 Wireless Road 쪽으로 나옵니다. 북쪽으로 걸어 Ploenchit Road 교차로까지 갑니다. Ploenchit Road에서 왼쪽(서쪽)으로 꺾어 BTS 칫롬역 방향으로 걸어요. 교차로에서 약 7분 거리예요. 왼편에 The Mercury Ville 건물이 있고, BTS 칫롬역과 연결돼 있어요. LENGOLF는 4층에 있어요.',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'The Rain Tree Café (Athenee)', cuisine: '인터내셔널 뷔페', distance_m: 0 },
        { name: 'The House on Sathorn', cuisine: '태국 파인다이닝', distance_m: 800 },
        { name: 'Baan Khanitha (Langsuan)', cuisine: '태국 파인다이닝', distance_m: 400 },
        { name: 'Gaggan Anand', cuisine: '프로그레시브 인도 요리', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 400 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'US Embassy / UK Embassy', type: 'landmark', distance_m: 300 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=The+Athenee+Hotel+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        '방콕의 대사관 거리인 Wireless Road, 태국어 표기로 Thanon Witthayu 일대는 각국 공관과 고급 주거지, 그리고 도시에서 손꼽히는 식당들이 늘어선 녹음 짙은 대로예요. The Athenee 호텔에서 300m 안에 미국 대사관과 영국 대사관이 모두 있어서, 동네 전체에 국제적이고 코스모폴리탄한 공기가 흘러요. 번잡한 Sukhumvit, Silom 일대보다 조용하고 여유로워서 방콕의 혼잡함보다는 유럽의 수도에 가까운 느낌이 들어요. The Athenee 호텔 자체도 이야깃거리가 많아요. 옛 Kandhavas Palace 부지 위에 지어졌고, 도시에서 가장 인기 있는 행사장으로 꼽히는 대형 연회장을 그대로 갖추고 있어요. 이 호텔에는 기업 고객이 많은데, LENGOLF가 가까워서 회의를 마친 뒤 팀 활동을 복잡한 준비 없이 마련할 수 있어요. 녹지를 원한다면 Lumpini Park까지 400m를 걸으면 되고, 미쉐린 스타 레스토랑이 모여 있는 Soi Langsuan도 모퉁이만 돌면 나와요. 아시아 최고 레스토랑 순위에 꾸준히 오르는 프로그레시브 인도 요리 Gaggan Anand 레스토랑은 500m 거리이고, 한참 전에 예약해 두는 편이 좋아요.',
      suggested_itinerary: [
        { time: '07:00', activity: 'Lumpini Park까지 아침 산책(400m)한 뒤 호수를 한 바퀴 조깅 — 공원은 오전 4시 30분에 문을 열어요' },
        { time: '09:00', activity: 'The Rain Tree Café에서 조식 뷔페 — 방콕에서 가장 푸짐한 호텔 조식 중 하나예요' },
        { time: '10:30', activity: 'Wireless Road에서 대사관들과 식민지 시대풍 건축물을 구경하며 걷기' },
        { time: '12:00', activity: 'Soi Langsuan의 Baan Khanitha에서 점심 — 티크 목조 가옥에서 즐기는 전통 태국 파인다이닝' },
        { time: '14:00', activity: '8분 걸어 LENGOLF에서 단체 골프 세션 — 팀 나들이로 좋아요 (이벤트 패키지 약 9,999바트부터, 2026년 7월 기준)' },
        { time: '17:00', activity: '호텔 로비 라운지에서 애프터눈 티 또는 칵테일' },
        { time: '19:30', activity: 'Gaggan Anand(500m)에서 저녁 — 프로그레시브 인도 요리 테이스팅 메뉴는 몇 주 전에 예약해야 해요' },
      ],
    },
  },

  // ─── ZH: things-to-do-near-athenee-hotel ───
  // Figures carried from EN: 700m / 10分钟 / 5星, 使馆300m, Lumpini 400m,
  // CentralWorld 700m, Gaggan Anand 500m, 活动套餐约9,999泰铢起, 公园凌晨4:30开门.
  // "team activity" kept as 团队活动 (event packages figure is EN's own).
  {
    id: 'hotel-4-zh',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-athenee-hotel',
    title: 'The Athenee Hotel Bangkok附近好去处 — 周边活动指南',
    meta_description:
      '住在The Athenee Hotel Bangkok？周边活动一次看齐：LENGOLF室内高尔夫（700米）、Lumpini Park、购物，以及Wireless Road一带的高级餐饮。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'zh',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/indoor-activities-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'The Athenee Hotel Bangkok, a Luxury Collection Hotel',
      hotel_neighbourhood: 'Wireless Road / Ploenchit',
      hotel_distance_m: 700,
      walking_time_mins: 10,
      walking_directions:
        '从The Athenee Hotel出来，走到Wireless Road上。向北走到与Ploenchit Road的路口，左转（向西）沿Ploenchit Road朝BTS Chidlom站走——从路口过去大约7分钟。The Mercury Ville在你左手边，与BTS Chidlom站相连。LENGOLF在4楼。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'The Rain Tree Café (Athenee)', cuisine: '国际自助餐', distance_m: 0 },
        { name: 'The House on Sathorn', cuisine: '泰式高级料理', distance_m: 800 },
        { name: 'Baan Khanitha (Langsuan)', cuisine: '泰式高级料理', distance_m: 400 },
        { name: 'Gaggan Anand', cuisine: '前卫印度料理', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 400 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'US Embassy / UK Embassy', type: 'landmark', distance_m: 300 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=The+Athenee+Hotel+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Wireless Road（Thanon Witthayu）是曼谷的使馆区——一条绿荫浓密、地位显赫的大道，两侧是各国使馆、豪宅，以及全城最好的一批餐厅。美国大使馆和英国大使馆都在距The Athenee 300米以内，让这一带有着鲜明的国际气息。这条街比熙攘的Sukhumvit或Silom更安静、也更开阔，走在其中不太像身处曼谷的喧嚣，反而更接近某座欧洲首都。The Athenee本身颇有来历——它建在旧时Kandhavas宫的地基上，保留下来的几间气派宴会厅，是全城最抢手的活动场地之一。对为数众多的商务客人来说，酒店离LENGOLF很近，会后想安排一场团队活动不需要复杂的调度。想要绿地的住客，步行400米就是Lumpini Park；米其林餐厅扎堆的Soi Langsuan也就在转角。Gaggan Anand（前卫印度料理，常年名列亚洲最佳餐厅之列）步行500米可达，值得提早很久订位。',
      suggested_itinerary: [
        { time: '07:00', activity: '走到Lumpini Park（400米）绕湖跑一圈——公园凌晨4:30就开门' },
        { time: '09:00', activity: '在The Rain Tree Café吃自助早餐——曼谷最丰盛的酒店早餐之一' },
        { time: '10:30', activity: '沿Wireless Road散步，看看各国使馆和殖民时期风格的老建筑' },
        { time: '12:00', activity: '在Soi Langsuan的Baan Khanitha吃午饭——柚木老宅里的传统泰式高级料理' },
        { time: '14:00', activity: '步行8分钟到LENGOLF打一场团体高尔夫——很适合团队出游（活动套餐约9,999泰铢起）' },
        { time: '17:00', activity: '在酒店大堂酒廊喝下午茶或鸡尾酒' },
        { time: '19:30', activity: '到Gaggan Anand（500米）吃晚餐——前卫印度料理品尝菜单，要提前几周订位' },
      ],
    },
  },
  {
    id: 'hotel-5',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-intercontinental-bangkok',
    title: 'Things to Do Near InterContinental Bangkok | Guest Activities',
    meta_description:
      'Staying at InterContinental Bangkok? Discover activities nearby — indoor golf at LENGOLF (a 6-minute walk), Erawan Shrine, CentralWorld shopping, and dining options.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'en',
    related_slugs: ['/activities/things-to-do-bangkok-at-night', '/activities/indoor-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'InterContinental Bangkok',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 450,
      walking_time_mins: 6,
      walking_directions:
        'Exit InterContinental Bangkok onto Ploenchit Road and walk east toward BTS Chidlom. Continue east along Ploenchit Road and The Mercury Ville is on your right within 6 minutes. LENGOLF is on Floor 4.',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Theo Mio (InterContinental)', cuisine: 'Italian', distance_m: 0 },
        { name: 'Fireplace Grill (InterContinental)', cuisine: 'Steakhouse', distance_m: 0 },
        { name: 'Din Tai Fung (CentralWorld)', cuisine: 'Taiwanese / Dim Sum', distance_m: 400 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: 'Thai Seafood', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 100 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 300 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 150 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 450 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 600 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=InterContinental+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The InterContinental occupies a prime position on Ploenchit Road, right at the Ratchaprasong intersection — Bangkok\'s version of Times Square. This is the convergence point of the city\'s major shopping malls: CentralWorld (300m west), Gaysorn Village (150m), Siam Paragon (600m), and Central Embassy (400m east). During the day, the area pulses with shoppers and office workers; in the evening, the rooftop bars and restaurants come alive. The hotel is particularly well-positioned for business travelers — the Ploenchit and Chidlom BTS stations bracket the hotel, and Bangkok\'s main financial districts (Silom, Sathorn, Asok) are each within 15 minutes by train. The Fireplace Grill on the hotel\'s ground floor is a destination steakhouse that draws diners from across the city, while Theo Mio upstairs serves refined Italian with views over the Ratchaprasong skyline. For after-work entertainment, LENGOLF is a 6-minute walk east — many InterContinental guests come for happy-hour golf sessions with colleagues. The Erawan Shrine, just 100m away, is worth visiting at dusk when the crowds thin and the golden light creates a magical atmosphere.',
      suggested_itinerary: [
        { time: '7:30 AM', activity: 'Breakfast at the hotel — the international buffet at Espresso covers all bases' },
        { time: '9:00 AM', activity: 'Quick visit to the Erawan Shrine (100m) — early morning is the most peaceful time' },
        { time: '10:00 AM', activity: 'Shopping at Gaysorn Village (150m) or CentralWorld (300m) — connected via skywalk' },
        { time: '12:30 PM', activity: 'Lunch at Din Tai Fung in CentralWorld or try the street food stalls in the Pratunam alley' },
        { time: '2:00 PM', activity: 'Walk or take 1 BTS stop to LENGOLF for an afternoon session (~550 THB/hour, up to 5 people)' },
        { time: '5:30 PM', activity: 'Sundowner cocktails at Red Sky (Centara Grand, 55th floor) — 10-minute walk from the hotel' },
        { time: '7:30 PM', activity: 'Dinner at Fireplace Grill (in-hotel) — the Wagyu tomahawk is the signature dish' },
      ],
    },
  },

  // ─── TH: things-to-do-near-intercontinental-bangkok ───
  // Figures carried verbatim: 150 m / 2 min / 5 stars, mall distances, 15 นาที by train,
  // Red Sky ชั้น 55 / เดิน 10 นาที, ประมาณ 550 บาท/ชั่วโมง. EN's contradictory "8-minute
  // walk west" in area_guide (vs the 2-minute eastward walk in walking_directions and the
  // 600 m LENGOLF row) is carried verbatim, not smoothed — flagged in the report.
  {
    id: 'hotel-5-th',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-intercontinental-bangkok',
    title: 'สิ่งที่น่าทำใกล้ InterContinental Bangkok | กิจกรรมสำหรับผู้เข้าพัก',
    meta_description:
      'พักที่ InterContinental Bangkok อยู่ใช่ไหม รวมกิจกรรมใกล้โรงแรม ทั้งกอล์ฟในร่มที่ LENGOLF (เดิน 6 นาที) ศาลพระพรหมเอราวัณ ช้อปปิ้งที่ CentralWorld และร้านอาหารอีกหลายทางเลือก',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'th',
    related_slugs: ['/activities/things-to-do-bangkok-at-night', '/activities/indoor-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'InterContinental Bangkok',
      hotel_neighbourhood: 'ราชประสงค์ / ชิดลม',
      hotel_distance_m: 450,
      walking_time_mins: 6,
      walking_directions:
        'ออกจาก InterContinental Bangkok มายังถนนเพลินจิต (Ploenchit Road) แล้วเดินไปทางทิศตะวันออกมุ่งหน้า BTS ชิดลม เดินต่อไปตามถนนเพลินจิต แล้ว The Mercury Ville จะอยู่ทางขวามือภายใน 6 นาที LENGOLF อยู่ชั้น 4',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Theo Mio (InterContinental)', cuisine: 'อาหารอิตาเลียน', distance_m: 0 },
        { name: 'Fireplace Grill (InterContinental)', cuisine: 'สเต๊กเฮาส์', distance_m: 0 },
        { name: 'Din Tai Fung (CentralWorld)', cuisine: 'ไต้หวัน / ติ่มซำ', distance_m: 400 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: 'ซีฟู้ดไทย', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 100 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 300 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 150 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 450 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 600 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=InterContinental+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'InterContinental อยู่ในทำเลชั้นดีบนถนนเพลินจิต ตรงแยกราชประสงค์พอดี ซึ่งเทียบได้กับไทม์สแควร์เวอร์ชันกรุงเทพฯ ที่นี่คือจุดบรรจบของศูนย์การค้าใหญ่ของเมือง ทั้ง CentralWorld (300 เมตรทางทิศตะวันตก) Gaysorn Village (150 เมตร) Siam Paragon (600 เมตร) และ Central Embassy (400 เมตรทางทิศตะวันออก) กลางวันย่านนี้เต็มไปด้วยนักช้อปและพนักงานออฟฟิศ ส่วนตอนเย็นรูฟท็อปบาร์และร้านอาหารจะเริ่มคึกคัก โรงแรมเหมาะกับนักเดินทางเพื่อธุรกิจเป็นพิเศษ เพราะมีสถานี BTS เพลินจิตและ BTS ชิดลม ขนาบอยู่สองฝั่ง และย่านธุรกิจหลักของกรุงเทพฯ อย่างสีลม สาทร และอโศก อยู่ห่างออกไปไม่เกิน 15 นาทีโดยรถไฟฟ้า Fireplace Grill ที่ชั้นล่างของโรงแรมเป็นสเต๊กเฮาส์ที่คนจากทั่วเมืองตั้งใจมากิน ส่วน Theo Mio ชั้นบนเสิร์ฟอาหารอิตาเลียนประณีตพร้อมวิวเส้นขอบฟ้าย่านราชประสงค์ สำหรับกิจกรรมหลังเลิกงาน LENGOLF อยู่ห่างออกไป 6 นาทีเดินทางทิศตะวันออก และผู้เข้าพัก InterContinental จำนวนไม่น้อยแวะไปเล่นกอล์ฟช่วงแฮปปี้อาวร์กับเพื่อนร่วมงาน ส่วนศาลพระพรหมเอราวัณที่อยู่ห่างเพียง 100 เมตร ควรไปช่วงโพล้เพล้ ตอนที่คนเริ่มบางตาและแสงสีทองทำให้บรรยากาศดูพิเศษ',
      suggested_itinerary: [
        { time: '07:30 น.', activity: 'อาหารเช้าที่โรงแรม บุฟเฟต์นานาชาติที่ Espresso มีครบทุกหมวด' },
        { time: '09:00 น.', activity: 'แวะศาลพระพรหมเอราวัณ (100 เมตร) ช่วงเช้าเป็นเวลาที่สงบที่สุด' },
        { time: '10:00 น.', activity: 'ช้อปปิ้งที่ Gaysorn Village (150 เมตร) หรือ CentralWorld (300 เมตร) เชื่อมถึงกันด้วยทางเดินลอยฟ้า' },
        { time: '12:30 น.', activity: 'มื้อกลางวันที่ Din Tai Fung ใน CentralWorld หรือลองสตรีทฟู้ดในตรอกย่านประตูน้ำ' },
        { time: '14:00 น.', activity: 'เดินหรือนั่ง BTS 1 สถานีไป LENGOLF สำหรับรอบบ่าย (ประมาณ 550 บาท/ชั่วโมง สำหรับผู้เล่นสูงสุด 5 คน)' },
        { time: '17:30 น.', activity: 'ค็อกเทลชมพระอาทิตย์ตกที่ Red Sky (Centara Grand ชั้น 55) ห่างจากโรงแรม 10 นาทีเดิน' },
        { time: '19:30 น.', activity: 'มื้อเย็นที่ Fireplace Grill ในโรงแรม เมนูขึ้นชื่อคือวากิวโทมาฮอว์ก' },
      ],
    },
  },

  // ─── JA: things-to-do-near-intercontinental-bangkok ───
  // EN contradicts itself here (2分/東 in the directions vs 徒歩8分/西 in area_guide,
  // and 150m vs a 600m activity card). Every field is carried faithfully to its own
  // EN sentence and the conflict is reported, not silently reconciled.
  // Figures: 150m / 2分 / 300m・150m・600m・400m の各モール / 約550THB / 最大5名.
  {
    id: 'hotel-5-ja',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-intercontinental-bangkok',
    title: 'インターコンチネンタル・バンコク周辺の過ごし方 — 宿泊者向けアクティビティ',
    meta_description:
      'インターコンチネンタル・バンコク（InterContinental Bangkok）周辺の過ごし方。徒歩6分のLENGOLFでインドアゴルフ、エラワン廟、セントラルワールドでの買い物とグルメ情報。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ja',
    related_slugs: ['/activities/things-to-do-bangkok-at-night', '/activities/indoor-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'InterContinental Bangkok',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 450,
      walking_time_mins: 6,
      walking_directions:
        'InterContinental Bangkokを出てプルンチット通り（Ploenchit Road）に出たら、BTSチットロム方面へ東に歩きます。プルンチット通りを東へ進むと、6分以内に右手にザ・マーキュリービルがあります。LENGOLFは4階です。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Theo Mio (InterContinental)', cuisine: 'イタリア料理', distance_m: 0 },
        { name: 'Fireplace Grill (InterContinental)', cuisine: 'ステーキハウス', distance_m: 0 },
        { name: 'Din Tai Fung (CentralWorld)', cuisine: '台湾料理／点心', distance_m: 400 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: 'タイのシーフード', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 100 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 300 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 150 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 450 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 600 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=InterContinental+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'InterContinentalが建つのは、プルンチット通りのラチャプラソン交差点という一等地。バンコク版タイムズスクエアとも言える場所です。主要ショッピングモールがここで交わります。西に300mのセントラルワールド、150mのGaysorn Village、600mのサイアムパラゴン、そして東に400mのセントラル・エンバシー。日中は買い物客とオフィスワーカーで活気づき、夜になるとルーフトップバーやレストランが動き出します。出張利用にも都合がよく、BTSプルンチット駅とBTSチットロム駅がホテルを挟む位置にあり、シーロム、サトーン、アソークといった主要ビジネス街へはいずれも電車で15分以内です。1階のFireplace Grillは市内各所から食事客が集まる名物ステーキハウスで、上階のTheo Mioはラチャプラソンの街並みを見下ろしながら洗練されたイタリア料理を出します。仕事帰りの楽しみとしては、東へ徒歩6分のLENGOLFへ。同僚と連れ立ってハッピーアワーのゴルフを楽しむ宿泊客も少なくありません。100m先のエラワン廟は、人出が落ち着いて金色の光が差す夕暮れ時に訪れるのがおすすめです。',
      suggested_itinerary: [
        { time: '7:30', activity: 'ホテルで朝食。Espressoのインターナショナルビュッフェは一通り揃っています' },
        { time: '9:00', activity: 'エラワン廟（100m）にさっと立ち寄り。早朝がいちばん静かです' },
        { time: '10:00', activity: 'Gaysorn Village（150m）かセントラルワールド（300m）で買い物を。スカイウォークでつながっています' },
        { time: '12:30', activity: 'セントラルワールドのDin Tai Fungでランチ、またはプラトゥーナムの路地の屋台へ' },
        { time: '14:00', activity: '徒歩、またはBTSで1駅のLENGOLFへ。午後のセッションを（1時間約550THB、最大5名まで／2026年7月現在）' },
        { time: '17:30', activity: 'Red Sky（Centara Grand 55階）でサンセットカクテル。ホテルから徒歩10分です' },
        { time: '19:30', activity: 'Fireplace Grill（ホテル内）でディナー。名物は和牛のトマホークです' },
      ],
    },
  },

  // ─── KO: things-to-do-near-intercontinental-bangkok ───
  // Figures from EN hotel-5: 150m / 2분, 4층, Erawan Shrine 100m, Gaysorn 150m,
  // CentralWorld 300m, Siam Paragon 600m, Central Embassy 동쪽 400m, Red Sky 55층
  // 도보 10분, 약 550바트/시간 최대 5명. EN이 walking_directions(동쪽·2분)와
  // area_guide(서쪽·도보 8분)에서 엇갈리는데 둘 다 원문대로 옮겼어요(보고서 참조).
  {
    id: 'hotel-5-ko',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-intercontinental-bangkok',
    title: 'InterContinental Bangkok 주변 즐길 거리 — 투숙객 액티비티 가이드',
    meta_description:
      'InterContinental Bangkok에 묵는다면 도보 6분 거리의 LENGOLF 실내 골프를 비롯해 Erawan Shrine, CentralWorld 쇼핑, 주변 맛집까지 가까운 즐길 거리를 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ko',
    related_slugs: ['/activities/things-to-do-bangkok-at-night', '/activities/indoor-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'InterContinental Bangkok',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 450,
      walking_time_mins: 6,
      walking_directions:
        'InterContinental Bangkok에서 Ploenchit Road 쪽으로 나와 BTS 칫롬역 방향인 동쪽으로 걸어요. Ploenchit Road에서 동쪽으로 걸으면 6분 안에 오른편에 The Mercury Ville 건물이 나와요. LENGOLF는 4층에 있어요.',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Theo Mio (InterContinental)', cuisine: '이탈리아 요리', distance_m: 0 },
        { name: 'Fireplace Grill (InterContinental)', cuisine: '스테이크하우스', distance_m: 0 },
        { name: 'Din Tai Fung (CentralWorld)', cuisine: '대만 요리 / 딤섬', distance_m: 400 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: '태국 해산물', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 100 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 300 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 150 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 450 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 600 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=InterContinental+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'InterContinental 호텔은 Ploenchit Road의 요지, Ratchaprasong 교차로 바로 앞에 있어요. 방콕판 타임스스퀘어라고 할 만한 자리예요. 도시의 주요 쇼핑몰이 이곳에서 만나요. CentralWorld(서쪽 300m), Gaysorn Village(150m), Siam Paragon(600m), Central Embassy(동쪽 400m)까지 모두 가까워요. 낮에는 쇼핑객과 직장인으로 활기가 넘치고, 저녁이면 루프톱 바와 레스토랑이 살아나요. 특히 비즈니스 여행자에게 자리가 좋아요. 호텔 양옆으로 BTS 플런칫역과 BTS 칫롬역이 있고, 방콕의 주요 업무 지구인 Silom, Sathorn, Asok까지 각각 전철로 15분 안에 닿아요. 호텔 1층 Fireplace Grill 레스토랑은 도시 곳곳에서 손님이 찾아오는 스테이크하우스이고, 위층 Theo Mio 레스토랑은 Ratchaprasong 스카이라인이 내려다보이는 정갈한 이탈리아 요리를 내요. 퇴근 후 즐길 거리로는 동쪽으로 도보 6분 거리의 LENGOLF가 있어요. InterContinental 투숙객 중에는 동료들과 해피아워 골프 세션을 즐기러 오는 분이 많아요. 100m 거리의 Erawan Shrine 사원은 인파가 잦아드는 해 질 무렵에 가면 금빛 조명 속 특별한 분위기를 만날 수 있어요.',
      suggested_itinerary: [
        { time: '07:30', activity: '호텔에서 조식 — Espresso의 인터내셔널 뷔페면 웬만한 취향은 다 커버돼요' },
        { time: '09:00', activity: 'Erawan Shrine(100m) 짧게 둘러보기 — 이른 아침이 가장 평온해요' },
        { time: '10:00', activity: 'Gaysorn Village(150m) 또는 CentralWorld(300m)에서 쇼핑 — 스카이워크로 연결돼 있어요' },
        { time: '12:30', activity: 'CentralWorld 안 Din Tai Fung에서 점심, 또는 Pratunam 골목의 길거리 노점 도전' },
        { time: '14:00', activity: '걷거나 BTS로 한 정거장 이동해 LENGOLF에서 오후 세션 (최대 5명까지 시간당 약 550바트, 2026년 7월 기준)' },
        { time: '17:30', activity: 'Red Sky(Centara Grand 55층)에서 선다우너 칵테일 — 호텔에서 도보 10분 거리예요' },
        { time: '19:30', activity: 'Fireplace Grill(호텔 내)에서 저녁 — 와규 토마호크가 시그니처예요' },
      ],
    },
  },

  // ─── ZH: things-to-do-near-intercontinental-bangkok ───
  // Figures carried from EN: 150m / 2分钟 / 5星, Erawan 100m, Gaysorn 150m,
  // CentralWorld 300m, Siam Paragon 600m, Central Embassy 400m, 商务区15分钟,
  // LENGOLF向西步行8分钟 (EN's own area_guide figure), ~550泰铢/小时最多5人.
  // The 2-min / 8-min and 150m / 600m disagreements are EN's — carried, flagged in report.
  {
    id: 'hotel-5-zh',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-intercontinental-bangkok',
    title: 'InterContinental Bangkok附近好去处 — 住客活动指南',
    meta_description:
      '住在InterContinental Bangkok？周边玩法很多：步行6分钟即到LENGOLF室内高尔夫，还有四面佛、CentralWorld购物与各式餐厅。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'zh',
    related_slugs: ['/activities/things-to-do-bangkok-at-night', '/activities/indoor-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'InterContinental Bangkok',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 450,
      walking_time_mins: 6,
      walking_directions:
        '从InterContinental Bangkok出来走到Ploenchit Road，向东走，朝BTS Chidlom站方向。沿Ploenchit Road一路向东，6分钟内The Mercury Ville就在你右手边。LENGOLF在4楼。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Theo Mio (InterContinental)', cuisine: '意大利菜', distance_m: 0 },
        { name: 'Fireplace Grill (InterContinental)', cuisine: '牛排餐厅', distance_m: 0 },
        { name: 'Din Tai Fung (CentralWorld)', cuisine: '台湾菜、点心', distance_m: 400 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: '泰式海鲜', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 100 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 300 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 150 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 450 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 600 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=InterContinental+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'InterContinental占据了Ploenchit Road上的黄金位置，正对Ratchaprasong路口——相当于曼谷版的时代广场。这里是全城主要商场的交汇点：CentralWorld（尚泰世界，向西300米）、Gaysorn Village（150米）、Siam Paragon（暹罗百丽宫，600米）和Central Embassy（向东400米）。白天这一带是购物者和上班族的洪流，入夜之后天台酒吧和餐厅接力登场。酒店对商务旅客尤其合适——BTS Ploenchit站和BTS Chidlom站一左一右夹着酒店，去Silom、Sathorn、Asok这几个曼谷主要商务区，搭轻轨各在15分钟以内。酒店一楼的Fireplace Grill是全城食客专程赶来的牛排餐厅，楼上的Theo Mio则供应精致意大利菜，可以俯瞰Ratchaprasong的天际线。下班后想找点娱乐，LENGOLF向东步行6分钟就到——不少InterContinental的住客会约上同事来打一场欢乐时光的球。距酒店只有100米的Erawan Shrine（四面佛）值得在黄昏时去，那时人流散去，金色的光线让气氛格外好。',
      suggested_itinerary: [
        { time: '07:30', activity: '在酒店吃早餐——Espresso的国际自助早餐样样齐全' },
        { time: '09:00', activity: '快速去一趟Erawan Shrine（100米）——清早最安静' },
        { time: '10:00', activity: '到Gaysorn Village（150米）或CentralWorld（300米）购物——空中步道直接相连' },
        { time: '12:30', activity: '在CentralWorld的Din Tai Fung吃午饭，或者去Pratunam的小巷试试路边摊' },
        { time: '14:00', activity: '步行或搭1站BTS到LENGOLF打一场下午的球（每小时约550泰铢，最多5人）' },
        { time: '17:30', activity: '到Red Sky（Centara Grand 55楼）喝日落鸡尾酒——从酒店步行10分钟' },
        { time: '19:30', activity: '在酒店内的Fireplace Grill吃晚餐——招牌是和牛战斧牛排' },
      ],
    },
  },
  {
    id: 'hotel-6',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-hotel-indigo-wireless-road',
    title: 'Things to Do Near Hotel Indigo Bangkok Wireless Road | Local Guide',
    meta_description:
      'Staying at Hotel Indigo Wireless Road? Discover things to do nearby — indoor golf at LENGOLF (700m), Lumpini Park, craft cocktails, and Ploenchit dining.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'en',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/indoor-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Hotel Indigo Bangkok Wireless Road',
      hotel_neighbourhood: 'Wireless Road / Ploenchit',
      hotel_distance_m: 700,
      walking_time_mins: 9,
      walking_directions:
        'Exit Hotel Indigo onto Wireless Road. Walk north to Ploenchit Road, then turn left (west). Walk along Ploenchit Road for about 6 minutes past the Ploenchit BTS area. The Mercury Ville is connected to BTS Chidlom on your left. LENGOLF is on Floor 4.',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Mesamis Café (Hotel Indigo)', cuisine: 'International', distance_m: 0 },
        { name: 'Café Kitsuné (Sindhorn Village)', cuisine: 'French Cafe', distance_m: 400 },
        { name: 'Baan Khanitha (Sathorn)', cuisine: 'Thai Fine Dining', distance_m: 500 },
        { name: 'Above Eleven (rooftop)', cuisine: 'Peruvian-Japanese', distance_m: 800 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 200 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 400 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'US & UK Embassies', type: 'landmark', distance_m: 200 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Hotel+Indigo+Bangkok+Wireless+Road+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Hotel Indigo sits on the quieter, more residential stretch of Wireless Road, giving it a neighborhood feel that\'s rare in central Bangkok. The hotel is an IHG boutique brand that prides itself on reflecting local culture — the design references the area\'s history as the site of Bangkok\'s first foreign embassies. Lumpini Park is only 200m away, making this one of the best-located hotels in Bangkok for runners and outdoor enthusiasts. The park\'s southeast corner has an open-air gym that locals use at dawn, and the lake offers paddle boats until sunset. Wireless Road itself is one of Bangkok\'s widest, most pleasant boulevards — lined with rain trees that provide welcome shade. The embassy compounds (US, UK, Japanese) give the street an international atmosphere, and several excellent restaurants have opened in the area in recent years. Sindhorn Village (400m), the new mixed-use development, brings a modern retail element with its curated shops and the trendy Café Kitsuné. For Hotel Indigo guests who are the craft-cocktail-and-Instagram type, the 9-minute walk to LENGOLF offers a photogenic, shareable activity that pairs well with the hotel\'s own rooftop bar for pre- or post-golf drinks.',
      suggested_itinerary: [
        { time: '6:00 AM', activity: 'Run the Lumpini Park loop (2.5km, 200m from hotel) — look for monitor lizards by the lake' },
        { time: '8:00 AM', activity: 'Healthy breakfast at Mesamis Café in the hotel lobby' },
        { time: '10:00 AM', activity: 'Walk to Sindhorn Village (400m) for Café Kitsuné and boutique shopping' },
        { time: '12:00 PM', activity: 'Explore the embassy district on Wireless Road — the Japanese Embassy garden is visible through the fence' },
        { time: '1:00 PM', activity: 'Lunch at a local Thai restaurant on Soi Langsuan (many options within 500m)' },
        { time: '3:00 PM', activity: 'Walk 9 minutes to LENGOLF for indoor golf — great date activity or solo practice' },
        { time: '6:00 PM', activity: 'Return to Hotel Indigo\'s rooftop bar for sunset cocktails overlooking Lumpini Park' },
        { time: '8:00 PM', activity: 'Dinner at Above Eleven (Sukhumvit Soi 11) — Peruvian-Japanese rooftop dining with skyline views' },
      ],
    },
  },

  // ─── TH: things-to-do-near-hotel-indigo-wireless-road ───
  // Figures carried verbatim: 700 m / 9 min / 4 stars, สวนลุมพินี 200 เมตร,
  // Sindhorn Village 400 เมตร, ลู่วิ่ง 2.5 กม. No price appears on this page in EN,
  // so none was added. Clock 24h + น.
  {
    id: 'hotel-6-th',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-hotel-indigo-wireless-road',
    title: 'สิ่งที่น่าทำใกล้ Hotel Indigo Bangkok Wireless Road | ไกด์ประจำย่าน',
    meta_description:
      'พักที่ Hotel Indigo Wireless Road อยู่ใช่ไหม รวมสิ่งที่น่าทำใกล้โรงแรม ทั้งกอล์ฟในร่มที่ LENGOLF (700 เมตร) สวนลุมพินี คราฟต์ค็อกเทล และร้านอาหารย่านเพลินจิต',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'th',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/indoor-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Hotel Indigo Bangkok Wireless Road',
      hotel_neighbourhood: 'ถนนวิทยุ / เพลินจิต',
      hotel_distance_m: 700,
      walking_time_mins: 9,
      walking_directions:
        'ออกจาก Hotel Indigo มายังถนนวิทยุ (Wireless Road) เดินขึ้นไปทางทิศเหนือจนถึงถนนเพลินจิต (Ploenchit Road) แล้วเลี้ยวซ้าย (ไปทางทิศตะวันตก) เดินตามถนนเพลินจิตราว 6 นาที ผ่านบริเวณ BTS เพลินจิต The Mercury Ville เชื่อมต่อกับ BTS ชิดลม อยู่ทางซ้ายมือ LENGOLF อยู่ชั้น 4',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Mesamis Café (Hotel Indigo)', cuisine: 'อาหารนานาชาติ', distance_m: 0 },
        { name: 'Café Kitsuné (Sindhorn Village)', cuisine: 'คาเฟ่ฝรั่งเศส', distance_m: 400 },
        { name: 'Baan Khanitha (Sathorn)', cuisine: 'อาหารไทยไฟน์ไดนิ่ง', distance_m: 500 },
        { name: 'Above Eleven (rooftop)', cuisine: 'เปรู-ญี่ปุ่น', distance_m: 800 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 200 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 400 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'US & UK Embassies', type: 'landmark', distance_m: 200 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Hotel+Indigo+Bangkok+Wireless+Road+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Hotel Indigo ตั้งอยู่บนช่วงที่เงียบและเป็นที่พักอาศัยมากกว่าของถนนวิทยุ จึงมีความรู้สึกแบบย่านชุมชนที่หาได้ยากในใจกลางกรุงเทพฯ โรงแรมเป็นแบรนด์บูทีคในเครือ IHG ที่ให้ความสำคัญกับการสะท้อนวัฒนธรรมท้องถิ่น งานออกแบบจึงอ้างอิงประวัติศาสตร์ของย่านในฐานะที่ตั้งของสถานทูตต่างประเทศแห่งแรก ๆ ในกรุงเทพฯ สวนลุมพินีอยู่ห่างเพียง 200 เมตร ทำให้ที่นี่เป็นหนึ่งในโรงแรมที่ทำเลดีที่สุดของกรุงเทพฯ สำหรับคนชอบวิ่งและกิจกรรมกลางแจ้ง มุมตะวันออกเฉียงใต้ของสวนมีฟิตเนสกลางแจ้งที่คนท้องถิ่นใช้กันตั้งแต่ฟ้าสาง และมีเรือถีบให้เล่นในทะเลสาบจนถึงช่วงพระอาทิตย์ตก ตัวถนนวิทยุเองเป็นหนึ่งในถนนที่กว้างและเดินสบายที่สุดของกรุงเทพฯ เพราะมีต้นจามจุรีเรียงรายให้ร่มเงา เขตสถานทูตทั้งสหรัฐฯ อังกฤษ และญี่ปุ่น ทำให้ถนนสายนี้มีบรรยากาศสากล และในช่วงไม่กี่ปีที่ผ่านมาก็มีร้านอาหารดี ๆ เปิดใหม่หลายร้าน Sindhorn Village (400 เมตร) โครงการมิกซ์ยูสแห่งใหม่ เพิ่มมิติค้าปลีกสมัยใหม่ด้วยร้านค้าที่คัดมาและ Café Kitsuné ที่กำลังเป็นที่นิยม สำหรับผู้เข้าพัก Hotel Indigo ที่ชอบคราฟต์ค็อกเทลและการถ่ายรูปลงโซเชียล การเดิน 9 นาทีไป LENGOLF ให้กิจกรรมที่ถ่ายรูปสวยและแชร์ได้ ซึ่งเข้ากันดีกับรูฟท็อปบาร์ของโรงแรมเองสำหรับดื่มก่อนหรือหลังเล่นกอล์ฟ',
      suggested_itinerary: [
        { time: '06:00 น.', activity: 'วิ่งรอบสวนลุมพินี (2.5 กม. ห่างจากโรงแรม 200 เมตร) ลองมองหาตัวเงินตัวทองริมทะเลสาบ' },
        { time: '08:00 น.', activity: 'อาหารเช้าเพื่อสุขภาพที่ Mesamis Café ในล็อบบี้โรงแรม' },
        { time: '10:00 น.', activity: 'เดินไป Sindhorn Village (400 เมตร) เพื่อแวะ Café Kitsuné และร้านบูทีค' },
        { time: '12:00 น.', activity: 'สำรวจย่านสถานทูตบนถนนวิทยุ สวนของสถานทูตญี่ปุ่นมองเห็นได้จากด้านนอกรั้ว' },
        { time: '13:00 น.', activity: 'มื้อกลางวันที่ร้านอาหารไทยในซอยหลังสวน มีให้เลือกหลายร้านในระยะ 500 เมตร' },
        { time: '15:00 น.', activity: 'เดิน 9 นาทีไปที่ LENGOLF เพื่อเล่นกอล์ฟในร่ม เหมาะทั้งกับการมาเดตและการซ้อมคนเดียว' },
        { time: '18:00 น.', activity: 'กลับมาที่รูฟท็อปบาร์ของ Hotel Indigo เพื่อดื่มค็อกเทลชมพระอาทิตย์ตกเหนือสวนลุมพินี' },
        { time: '20:00 น.', activity: 'มื้อเย็นที่ Above Eleven (สุขุมวิท ซอย 11) อาหารเปรู-ญี่ปุ่นบนรูฟท็อปพร้อมวิวเส้นขอบฟ้า' },
      ],
    },
  },

  // ─── JA: things-to-do-near-hotel-indigo-wireless-road ───
  // The only entry with no price anywhere in rendered copy, so no as-of marker was
  // added (there is nothing to date). Figures: 700m / 9分 / 約6分 / 200m / 400m /
  // 500m / 800m / 2.5km。EN の「Japanese Embassy」は日本大使館としてそのまま。
  // 言語サポートに関する主張は EN になく、こちらでも追加していません。
  {
    id: 'hotel-6-ja',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-hotel-indigo-wireless-road',
    title: 'ホテル・インディゴ・ワイヤレスロード周辺の過ごし方 — エリアガイド',
    meta_description:
      'ホテル・インディゴ・ワイヤレスロード（Hotel Indigo Bangkok Wireless Road）周辺の過ごし方。徒歩700mのLENGOLFでインドアゴルフ、ルンピニー公園、クラフトカクテル、プルンチットのグルメ。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ja',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/indoor-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Hotel Indigo Bangkok Wireless Road',
      hotel_neighbourhood: 'Wireless Road / Ploenchit',
      hotel_distance_m: 700,
      walking_time_mins: 9,
      walking_directions:
        'Hotel Indigoを出て、ウィッタユ通り（Wireless Road）へ。北へ進んでプルンチット通り（Ploenchit Road）に出たら、左（西）に曲がります。BTSプルンチット駅の前を通り過ぎ、プルンチット通りをおよそ6分歩いてください。左手にBTSチットロム駅と直結したザ・マーキュリービルがあります。LENGOLFは4階です。',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Mesamis Café (Hotel Indigo)', cuisine: 'インターナショナル', distance_m: 0 },
        { name: 'Café Kitsuné (Sindhorn Village)', cuisine: 'フレンチカフェ', distance_m: 400 },
        { name: 'Baan Khanitha (Sathorn)', cuisine: 'タイ高級料理', distance_m: 500 },
        { name: 'Above Eleven (rooftop)', cuisine: 'ペルー×日本料理', distance_m: 800 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 200 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 400 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'US & UK Embassies', type: 'landmark', distance_m: 200 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Hotel+Indigo+Bangkok+Wireless+Road+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Hotel Indigoが建つのは、ウィッタユ通り（Wireless Road）の中でも静かで住宅寄りの一角。バンコク中心部では珍しい、生活感のある落ち着きがあります。地域の文化を映すことを信条とするIHGのブティックブランドで、バンコクに最初の外国公館が置かれた土地という歴史がデザインの随所に引かれています。ルンピニー公園まではわずか200m。ランニングやアウトドアが好きな人にとって、バンコクでも有数の立地です。公園の南東の角には夜明けとともに地元の人が使う屋外ジムがあり、湖では日没までペダルボートに乗れます。ウィッタユ通り自体もバンコクで最も幅が広く快適な大通りのひとつで、レインツリーの並木がありがたい日陰をつくっています。米国、英国、日本の大使館が並ぶことで街路には国際的な空気があり、この数年で優れたレストランもいくつか開業しました。徒歩400mの新しい複合開発Sindhorn Villageには、選び抜かれたショップと話題のCafé Kitsunéが入り、モダンな買い物の要素を加えています。クラフトカクテルと写真を楽しむタイプのHotel Indigoの宿泊客なら、徒歩9分のLENGOLFは絵になるアクティビティ。ゴルフの前後にホテルのルーフトップバーで一杯、という流れとも相性がよいはずです。',
      suggested_itinerary: [
        { time: '6:00', activity: 'ルンピニー公園の周回コースを走ります（2.5km、ホテルから200m）。湖のそばのミズオオトカゲを探してみてください' },
        { time: '8:00', activity: 'ホテル1階のMesamis Caféでヘルシーな朝食を' },
        { time: '10:00', activity: 'Sindhorn Village（400m）まで歩き、Café Kitsunéとブティックめぐりを' },
        { time: '12:00', activity: 'ウィッタユ通りの大使館街を散策。日本大使館の庭は柵越しに見えます' },
        { time: '13:00', activity: 'ランスアン通りのタイ料理店でランチ。500m以内に選択肢がたくさんあります' },
        { time: '15:00', activity: '徒歩9分でLENGOLFへ。デートにも、一人での練習にも向いています' },
        { time: '18:00', activity: 'Hotel Indigoのルーフトップバーに戻り、ルンピニー公園を望みながらサンセットカクテルを' },
        { time: '20:00', activity: 'Above Eleven（スクンビット・ソイ11）でディナー。ペルー×日本料理をルーフトップで、街の眺めとともに' },
      ],
    },
  },

  // ─── KO: things-to-do-near-hotel-indigo-wireless-road ───
  // Figures from EN hotel-6: 700m / 9분, Ploenchit Road 약 6분, 4층,
  // Lumpini Park 200m(러닝 루프 2.5km), Sindhorn Village 400m, 대사관 200m.
  // 이 항목의 EN에는 LENGOLF 가격이 없어서 가격도 as-of 표기도 넣지 않았어요.
  {
    id: 'hotel-6-ko',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-hotel-indigo-wireless-road',
    title: 'Hotel Indigo Wireless Road 주변 즐길 거리 — 로컬 가이드',
    meta_description:
      'Hotel Indigo Wireless Road에 묵는다면 도보 700m 거리의 LENGOLF 실내 골프부터 Lumpini Park, 크래프트 칵테일, Ploenchit 다이닝까지 가까운 즐길 거리를 소개해요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ko',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/indoor-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Hotel Indigo Bangkok Wireless Road',
      hotel_neighbourhood: 'Wireless Road / Ploenchit',
      hotel_distance_m: 700,
      walking_time_mins: 9,
      walking_directions:
        'Hotel Indigo에서 Wireless Road 쪽으로 나옵니다. 북쪽으로 걸어 Ploenchit Road에 닿으면 왼쪽(서쪽)으로 꺾어요. Ploenchit Road에서 BTS 플런칫역 일대를 지나 약 6분 걸어갑니다. 왼편에 있는 The Mercury Ville 건물은 BTS 칫롬역과 연결돼 있어요. LENGOLF는 4층에 있어요.',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Mesamis Café (Hotel Indigo)', cuisine: '인터내셔널', distance_m: 0 },
        { name: 'Café Kitsuné (Sindhorn Village)', cuisine: '프랑스식 카페', distance_m: 400 },
        { name: 'Baan Khanitha (Sathorn)', cuisine: '태국 파인다이닝', distance_m: 500 },
        { name: 'Above Eleven (rooftop)', cuisine: '페루-일본 퓨전', distance_m: 800 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 200 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 400 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'US & UK Embassies', type: 'landmark', distance_m: 200 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Hotel+Indigo+Bangkok+Wireless+Road+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Hotel Indigo 호텔은 Wireless Road에서도 조용하고 주거지에 가까운 구간에 있어요. 방콕 도심에서는 드물게 동네 같은 분위기가 느껴져요. IHG의 부티크 브랜드답게 지역 문화를 디자인에 담았고, 방콕 최초의 외국 공관들이 들어섰던 이 일대의 역사를 곳곳에서 참조했어요. Lumpini Park까지 200m밖에 되지 않아서, 러닝이나 야외 활동을 좋아하는 사람에게는 방콕에서 가장 위치 좋은 호텔 중 하나예요. 공원 남동쪽 모퉁이에는 현지인들이 새벽에 쓰는 야외 헬스장이 있고, 호수에서는 해 질 때까지 오리배를 탈 수 있어요. Wireless Road 자체가 방콕에서 가장 넓고 걷기 좋은 대로 중 하나예요. 그늘을 드리우는 레인트리 가로수가 줄지어 서 있어요. 미국, 영국, 일본 대사관 부지가 이어지며 거리에 국제적인 분위기를 더하고, 최근 몇 년 사이 좋은 식당들도 여럿 문을 열었어요. 400m 거리의 신규 복합 개발지 Sindhorn Village에는 엄선된 상점과 요즘 인기인 Café Kitsuné 매장이 들어와 현대적인 리테일 요소를 더해요. 크래프트 칵테일과 사진을 좋아하는 Hotel Indigo 손님이라면 도보 9분 거리의 LENGOLF가 사진으로 남기고 공유하기 좋은 활동이 돼요. 골프 전후로 호텔 루프톱 바에서 한잔하기에도 잘 어울려요.',
      suggested_itinerary: [
        { time: '06:00', activity: 'Lumpini Park 순환 코스 달리기(2.5km, 호텔에서 200m) — 호숫가의 물왕도마뱀을 찾아보세요' },
        { time: '08:00', activity: '호텔 로비의 Mesamis Café에서 건강한 아침 식사' },
        { time: '10:00', activity: 'Sindhorn Village까지 걸어가(400m) Café Kitsuné와 부티크 쇼핑 즐기기' },
        { time: '12:00', activity: 'Wireless Road 대사관 지구 둘러보기 — 일본 대사관 정원은 담장 너머로 들여다볼 수 있어요' },
        { time: '13:00', activity: 'Soi Langsuan의 현지 태국 식당에서 점심 (500m 안에 선택지가 많아요)' },
        { time: '15:00', activity: '9분 걸어 LENGOLF에서 실내 골프 — 데이트 코스로도, 혼자 연습하기에도 좋아요' },
        { time: '18:00', activity: 'Hotel Indigo 루프톱 바로 돌아가 Lumpini Park 쪽 일몰을 보며 칵테일 한 잔' },
        { time: '20:00', activity: 'Above Eleven(Sukhumvit Soi 11)에서 저녁 — 스카이라인이 보이는 페루-일본 퓨전 루프톱 다이닝' },
      ],
    },
  },

  // ─── ZH: things-to-do-near-hotel-indigo-wireless-road ───
  // Figures carried from EN: 700m / 9分钟 / 4星, Lumpini 200m, Sindhorn Village 400m,
  // 使馆200m, Lumpini环线2.5公里, Soi Langsuan 500米内, Ploenchit Road走约6分钟.
  // "craft-cocktail-and-Instagram type" rendered as a reader-type description, not a claim.
  {
    id: 'hotel-6-zh',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-hotel-indigo-wireless-road',
    title: 'Hotel Indigo Wireless Road附近好去处 — 周边生活指南',
    meta_description:
      '住在Hotel Indigo Wireless Road？周边这样玩：LENGOLF室内高尔夫（700米）、Lumpini Park、手工调酒，还有Ploenchit一带的餐厅。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'zh',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/indoor-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Hotel Indigo Bangkok Wireless Road',
      hotel_neighbourhood: 'Wireless Road / Ploenchit',
      hotel_distance_m: 700,
      walking_time_mins: 9,
      walking_directions:
        '从Hotel Indigo出来，走到Wireless Road上。向北走到Ploenchit Road，然后左转（向西）。沿Ploenchit Road走大约6分钟，经过BTS Ploenchit站一带。The Mercury Ville在你左手边，与BTS Chidlom站相连。LENGOLF在4楼。',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'Mesamis Café (Hotel Indigo)', cuisine: '国际料理', distance_m: 0 },
        { name: 'Café Kitsuné (Sindhorn Village)', cuisine: '法式咖啡馆', distance_m: 400 },
        { name: 'Baan Khanitha (Sathorn)', cuisine: '泰式高级料理', distance_m: 500 },
        { name: 'Above Eleven (rooftop)', cuisine: '秘鲁日式料理', distance_m: 800 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 200 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 400 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 700 },
        { name: 'US & UK Embassies', type: 'landmark', distance_m: 200 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Hotel+Indigo+Bangkok+Wireless+Road+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Hotel Indigo位于Wireless Road较安静、住宅气息更浓的一段，有一种曼谷市中心少见的社区感。这家酒店属于IHG旗下的精品品牌，一向以呼应在地文化为傲——设计上引用了这一带作为曼谷最早一批外国使馆所在地的历史。Lumpini Park只有200米，让这里成为曼谷最适合跑者和户外爱好者入住的酒店之一。公园东南角有一片露天健身区，本地人天亮就来使用；湖上的踩船一直开到日落。Wireless Road本身是曼谷最宽阔、最舒服的大道之一，两旁的雨树投下难得的树荫。美国、英国、日本等使馆区让这条街充满国际感，近几年也开出了好几家出色的餐厅。400米外的新综合体Sindhorn Village带来了现代零售的一面，有精选店铺和当下很红的Café Kitsuné。如果你是那种喜欢手工调酒、也爱随手拍照分享的Hotel Indigo客人，步行9分钟到LENGOLF会是一个上镜又值得分享的活动，还能和酒店自家的天台酒吧凑成打球前后的一杯。',
      suggested_itinerary: [
        { time: '06:00', activity: '跑一圈Lumpini Park环线（2.5公里，距酒店200米）——留意湖边的巨蜥' },
        { time: '08:00', activity: '在酒店大堂的Mesamis Café吃一顿健康早餐' },
        { time: '10:00', activity: '走到Sindhorn Village（400米）喝Café Kitsuné，顺便逛精品店' },
        { time: '12:00', activity: '在Wireless Road上逛使馆区——隔着围栏可以看到日本大使馆的庭院' },
        { time: '13:00', activity: '在Soi Langsuan找一家本地泰餐吃午饭（500米内选择很多）' },
        { time: '15:00', activity: '步行9分钟到LENGOLF打室内高尔夫——很适合约会，一个人练球也不错' },
        { time: '18:00', activity: '回Hotel Indigo的天台酒吧喝日落鸡尾酒，俯瞰Lumpini Park' },
        { time: '20:00', activity: '到Above Eleven（Sukhumvit Soi 11）吃晚餐——天台上的秘鲁日式料理，配天际线夜景' },
      ],
    },
  },
  {
    id: 'hotel-7',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-novotel-ploenchit',
    title: 'Things to Do Near Novotel Bangkok Ploenchit Sukhumvit | Activities',
    meta_description:
      'Staying at Novotel Ploenchit? Discover what to do nearby — indoor golf at LENGOLF (800m or 1 BTS stop), shopping, Thai street food, and evening entertainment.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'en',
    related_slugs: ['/activities/weekend-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Novotel Bangkok Ploenchit Sukhumvit',
      hotel_neighbourhood: 'Sukhumvit / Ploenchit',
      hotel_distance_m: 1500,
      walking_time_mins: 21,
      walking_directions:
        'It\'s a 1.5km, 21-minute walk — doable, but in Bangkok\'s heat we\'d recommend the BTS or a cab instead. Walk to BTS Ploenchit station (2-minute walk from the hotel), take the BTS one stop westbound to BTS Chidlom, and walk directly into The Mercury Ville. Total door-to-door by BTS: about 10 minutes. A taxi or Grab from the hotel takes around 5 minutes and costs ~60 THB. LENGOLF is on Floor 4.',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'The Square (Novotel)', cuisine: 'International Buffet', distance_m: 0 },
        { name: 'Soi 11 Food Street', cuisine: 'Street Food', distance_m: 400 },
        { name: 'Nara Thai (Gaysorn)', cuisine: 'Thai', distance_m: 700 },
        { name: 'Long Table (rooftop)', cuisine: 'Thai Contemporary', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'Ploenchit BTS to explore Bangkok', type: 'transport', distance_m: 150 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 1500 },
        { name: 'Bumrungrad Hospital', type: 'medical', distance_m: 500 },
        { name: 'Nana Entertainment', type: 'nightlife', distance_m: 400 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Novotel+Bangkok+Ploenchit+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The Novotel Ploenchit sits at the western edge of Sukhumvit — Bangkok\'s longest and most diverse road. This stretch between BTS Ploenchit and Nana is where the Sukhumvit dining and nightlife scene begins, offering a grittier, more authentic Bangkok experience than the polished mall district further west. Soi 11, one of Bangkok\'s most famous side streets, is a 400m walk and transforms after dark into a strip of restaurants, bars, and clubs that draws both locals and expats. During the day, the area offers excellent street food — the Soi 11 alley has vendors selling pad kra pao (basil stir-fry), boat noodles, and som tam (green papaya salad) for 50-80 THB. BTS Ploenchit is a 2-minute walk from the hotel, which puts you one stop from LENGOLF at BTS Chidlom — making it one of the easiest commutes to indoor golf in the area. Bumrungrad Hospital (500m), one of the top medical tourism destinations in Southeast Asia, is nearby — many hotel guests are medical tourists combining treatment with leisure. For families, the Novotel\'s swimming pool and kids\' area are solid, and the Central Embassy mall (3 BTS stops) has an excellent kids\' play area.',
      suggested_itinerary: [
        { time: '8:00 AM', activity: 'Breakfast at The Square (in-hotel) or grab a coffee from the lobby café' },
        { time: '9:30 AM', activity: 'Take BTS from Ploenchit to Siam (2 stops) for shopping at Siam Paragon and MBK' },
        { time: '12:00 PM', activity: 'Lunch at the Soi 11 food stalls — try the boat noodles or pad kra pao from the street vendors' },
        { time: '2:00 PM', activity: 'Take BTS 1 stop to Chidlom for indoor golf at LENGOLF (~550 THB/hour, up to 5 people)' },
        { time: '4:30 PM', activity: 'Walk back along Ploenchit Road, stopping at Central Embassy for browsing and aircon' },
        { time: '6:30 PM', activity: 'Sundowner at Long Table rooftop bar (Column Bangkok) — panoramic city views and Thai tapas' },
        { time: '8:30 PM', activity: 'Dinner and drinks on Soi 11 — Cheap Charlie\'s (open-air bar) or Havana Social (speakeasy)' },
      ],
    },
  },

  // ─── TH: things-to-do-near-novotel-ploenchit ───
  // Figures carried verbatim: 1,500 m / 21 min / 4 stars, 1.5 กม., ราว 10 นาที door-to-door
  // by BTS, แท็กซี่ราว 5 นาที ประมาณ 60 บาท, สตรีทฟู้ด 50-80 บาท, ประมาณ 550 บาท/ชั่วโมง.
  // EN's own meta says "800 m or 1 BTS stop" while the field says 1,500 m — EN wording kept.
  // Range separator is the ASCII hyphen per the TH glossary.
  {
    id: 'hotel-7-th',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-novotel-ploenchit',
    title: 'สิ่งที่น่าทำใกล้ Novotel Bangkok Ploenchit Sukhumvit | กิจกรรม',
    meta_description:
      'พักที่ Novotel Ploenchit อยู่ใช่ไหม รวมสิ่งที่น่าทำใกล้โรงแรม ทั้งกอล์ฟในร่มที่ LENGOLF (800 เมตร หรือ BTS 1 สถานี) ช้อปปิ้ง สตรีทฟู้ดไทย และความบันเทิงยามค่ำ',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'th',
    related_slugs: ['/activities/weekend-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Novotel Bangkok Ploenchit Sukhumvit',
      hotel_neighbourhood: 'สุขุมวิท / เพลินจิต',
      hotel_distance_m: 1500,
      walking_time_mins: 21,
      walking_directions:
        'ระยะทาง 1.5 กม. เดินราว 21 นาที ซึ่งเดินไหวอยู่ แต่ด้วยอากาศร้อนของกรุงเทพฯ เราแนะนำให้ใช้ BTS หรือแท็กซี่แทน เดินไปสถานี BTS เพลินจิต (ห่างจากโรงแรม 2 นาที) นั่ง BTS ไปทางทิศตะวันตก 1 สถานีลงที่ BTS ชิดลม แล้วเดินเข้า The Mercury Ville ได้โดยตรง รวมเวลาจากประตูถึงประตูโดย BTS ราว 10 นาที ส่วนแท็กซี่หรือ Grab จากโรงแรมใช้เวลาราว 5 นาที ค่าโดยสารประมาณ 60 บาท LENGOLF อยู่ชั้น 4',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'The Square (Novotel)', cuisine: 'บุฟเฟต์นานาชาติ', distance_m: 0 },
        { name: 'Soi 11 Food Street', cuisine: 'สตรีทฟู้ด', distance_m: 400 },
        { name: 'Nara Thai (Gaysorn)', cuisine: 'อาหารไทย', distance_m: 700 },
        { name: 'Long Table (rooftop)', cuisine: 'อาหารไทยร่วมสมัย', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'Ploenchit BTS to explore Bangkok', type: 'transport', distance_m: 150 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 1500 },
        { name: 'Bumrungrad Hospital', type: 'medical', distance_m: 500 },
        { name: 'Nana Entertainment', type: 'nightlife', distance_m: 400 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Novotel+Bangkok+Ploenchit+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Novotel Ploenchit ตั้งอยู่ปลายด้านตะวันตกของถนนสุขุมวิท ถนนที่ยาวและหลากหลายที่สุดของกรุงเทพฯ ช่วงระหว่าง BTS เพลินจิตกับนานาคือจุดเริ่มต้นของฉากร้านอาหารและไนต์ไลฟ์แบบสุขุมวิท ซึ่งดิบและใกล้เคียงกรุงเทพฯ ของจริงมากกว่าย่านห้างที่ขัดเงาถัดไปทางตะวันตก ซอย 11 หนึ่งในซอยที่มีชื่อเสียงที่สุดของกรุงเทพฯ อยู่ห่างออกไป 400 เมตร และหลังพระอาทิตย์ตกจะกลายเป็นแนวร้านอาหาร บาร์ และคลับ ที่ดึงดูดทั้งคนไทยและชาวต่างชาติที่ทำงานในเมือง ส่วนกลางวันย่านนี้มีสตรีทฟู้ดที่ดีมาก ในตรอกซอย 11 มีแม่ค้าขายผัดกะเพรา ก๋วยเตี๋ยวเรือ และส้มตำ ในราคา 50-80 บาท BTS เพลินจิตอยู่ห่างจากโรงแรม 2 นาทีเดิน ซึ่งทำให้คุณอยู่ห่างจาก LENGOLF ที่ BTS ชิดลม เพียงสถานีเดียว จึงเป็นหนึ่งในเส้นทางไปเล่นกอล์ฟในร่มที่ง่ายที่สุดในย่านนี้ โรงพยาบาลบำรุงราษฎร์ (500 เมตร) ซึ่งเป็นหนึ่งในจุดหมายด้านการท่องเที่ยวเชิงการแพทย์อันดับต้น ๆ ของเอเชียตะวันออกเฉียงใต้ ก็อยู่ใกล้ ผู้เข้าพักจำนวนไม่น้อยจึงเป็นผู้ที่มารักษาพร้อมกับเที่ยวไปด้วย สำหรับครอบครัว สระว่ายน้ำและโซนเด็กของ Novotel ทำได้ดี และห้าง Central Embassy (BTS 3 สถานี) มีโซนเครื่องเล่นสำหรับเด็กที่ยอดเยี่ยม',
      suggested_itinerary: [
        { time: '08:00 น.', activity: 'อาหารเช้าที่ The Square ในโรงแรม หรือซื้อกาแฟจากคาเฟ่ที่ล็อบบี้' },
        { time: '09:30 น.', activity: 'นั่ง BTS จากเพลินจิตไปสยาม (2 สถานี) เพื่อช้อปปิ้งที่ Siam Paragon และ MBK' },
        { time: '12:00 น.', activity: 'มื้อกลางวันที่แผงอาหารซอย 11 ลองก๋วยเตี๋ยวเรือหรือผัดกะเพราจากร้านริมทาง' },
        { time: '14:00 น.', activity: 'นั่ง BTS 1 สถานีไปชิดลมเพื่อเล่นกอล์ฟในร่มที่ LENGOLF (ประมาณ 550 บาท/ชั่วโมง สำหรับผู้เล่นสูงสุด 5 คน)' },
        { time: '16:30 น.', activity: 'เดินกลับตามถนนเพลินจิต แวะ Central Embassy เพื่อเดินดูของและพักในห้องแอร์' },
        { time: '18:30 น.', activity: 'ดื่มชมพระอาทิตย์ตกที่รูฟท็อปบาร์ Long Table (Column Bangkok) วิวเมืองแบบพาโนรามาพร้อมทาปาสไทย' },
        { time: '20:30 น.', activity: 'มื้อเย็นและเครื่องดื่มที่ซอย 11 ทั้ง Cheap Charlie\'s (บาร์กลางแจ้ง) และ Havana Social (บาร์ลับ)' },
      ],
    },
  },

  // ─── JA: things-to-do-near-novotel-ploenchit ───
  // EN's own two numbers are both carried in their own fields: 1.5km / 21分 in
  // walking_directions, 800m on the activity card and in the meta. Transit facts kept
  // intact (BTSプルンチット駅まで徒歩2分、西方向に1駅、ドアツードア約10分、
  // タクシー約5分・約60THB). 屋台 50〜80THB uses the JA wave dash.
  {
    id: 'hotel-7-ja',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-novotel-ploenchit',
    title: 'ノボテル・バンコク・プルンチット周辺の過ごし方 — アクティビティガイド',
    meta_description:
      'ノボテル・プルンチット（Novotel Bangkok Ploenchit Sukhumvit）周辺の過ごし方。LENGOLFのインドアゴルフはBTSで1駅（800m）、買い物、タイの屋台料理、夜の楽しみ方までまとめました。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ja',
    related_slugs: ['/activities/weekend-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Novotel Bangkok Ploenchit Sukhumvit',
      hotel_neighbourhood: 'Sukhumvit / Ploenchit',
      hotel_distance_m: 1500,
      walking_time_mins: 21,
      walking_directions:
        '徒歩なら1.5km、21分です。歩けない距離ではありませんが、バンコクの暑さを考えるとBTSかタクシーをおすすめします。ホテルから徒歩2分のBTSプルンチット駅へ向かい、BTSで西方向に1駅、BTSチットロム駅で降りるとザ・マーキュリービルへそのまま入れます。BTS利用ならドアツードアでおよそ10分。ホテルからタクシーやGrabを使えば5分ほどで、料金は約60THBです。LENGOLFは4階です。',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'The Square (Novotel)', cuisine: 'インターナショナルビュッフェ', distance_m: 0 },
        { name: 'Soi 11 Food Street', cuisine: '屋台料理', distance_m: 400 },
        { name: 'Nara Thai (Gaysorn)', cuisine: 'タイ料理', distance_m: 700 },
        { name: 'Long Table (rooftop)', cuisine: '現代タイ料理', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'Ploenchit BTS to explore Bangkok', type: 'transport', distance_m: 150 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 1500 },
        { name: 'Bumrungrad Hospital', type: 'medical', distance_m: 500 },
        { name: 'Nana Entertainment', type: 'nightlife', distance_m: 400 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Novotel+Bangkok+Ploenchit+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Novotel Ploenchitが建つのは、バンコクで最も長く多彩な通りであるスクンビットの西端です。BTSプルンチット駅からナナにかけての一帯は、スクンビットの食とナイトライフが始まる場所。西側の洗練されたモール地区よりも雑然としていて、生活のにおいのするバンコクが味わえます。バンコクでも名の知れたソイ11は徒歩400m。日が暮れるとレストラン、バー、クラブが並ぶ通りに変わり、地元の人と在住外国人でにぎわいます。昼は屋台が充実していて、ソイ11の路地ではガパオライス、ボートヌードル、ソムタム（青パパイヤのサラダ）が50〜80THBで食べられます。BTSプルンチット駅はホテルから徒歩2分。LENGOLFのあるBTSチットロム駅まで1駅なので、この界隈ではインドアゴルフへの移動がとりわけ楽です。東南アジア有数の医療ツーリズムの拠点であるバムルンラード病院も500mの距離にあり、治療と滞在を兼ねた宿泊客も多く見かけます。家族連れにはNovotelのプールとキッズエリアが頼りになりますし、BTSで3駅のセントラル・エンバシーには充実したキッズプレイエリアがあります。',
      suggested_itinerary: [
        { time: '8:00', activity: 'The Square（ホテル内）で朝食、またはロビーのカフェでコーヒーを' },
        { time: '9:30', activity: 'BTSでプルンチット駅からサイアム駅まで2駅。サイアムパラゴンとMBKで買い物を' },
        { time: '12:00', activity: 'ソイ11の屋台でランチ。ボートヌードルか、屋台のガパオライスを' },
        { time: '14:00', activity: 'BTSで1駅、チットロム駅のLENGOLFでインドアゴルフを（1時間約550THB、最大5名まで／2026年7月現在）' },
        { time: '16:30', activity: 'プルンチット通りを歩いて戻り、セントラル・エンバシーで涼みながら店をのぞきます' },
        { time: '18:30', activity: 'ルーフトップバーLong Table（Column Bangkok）でサンセットドリンクを。街を一望しながらタイ料理のタパスが楽しめます' },
        { time: '20:30', activity: 'ソイ11でディナーと一杯。オープンエアのCheap Charlie\'sか、隠れ家風のHavana Socialへ' },
      ],
    },
  },

  // ─── KO: things-to-do-near-novotel-ploenchit ───
  // Figures from EN hotel-7: 1.5km / 21분, BTS 플런칫역 도보 2분, 서쪽 한 정거장,
  // 문 앞에서 문 앞까지 약 10분, 택시 약 5분·약 60바트, 4층, Soi 11 400m,
  // 길거리 음식 50~80바트, Bumrungrad 500m, Central Embassy BTS 3정거장,
  // 약 550바트/시간 최대 5명. "기준"은 as-of 표기에만 쓰고 BTS 문장에서는 뺐어요.
  {
    id: 'hotel-7-ko',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-novotel-ploenchit',
    title: 'Novotel Bangkok Ploenchit 주변 즐길 거리 — 액티비티 가이드',
    meta_description:
      'Novotel Ploenchit에 묵는다면 LENGOLF 실내 골프(800m 또는 BTS 한 정거장)부터 쇼핑, 태국 길거리 음식, 저녁 나들이까지 가까운 즐길 거리를 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ko',
    related_slugs: ['/activities/weekend-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Novotel Bangkok Ploenchit Sukhumvit',
      hotel_neighbourhood: 'Sukhumvit / Ploenchit',
      hotel_distance_m: 1500,
      walking_time_mins: 21,
      walking_directions:
        '도보로는 1.5km, 21분 거리예요. 걸을 수는 있지만 방콕의 더위를 생각하면 BTS나 택시를 권해요. 호텔에서 2분 걸어 BTS 플런칫역으로 간 뒤, BTS를 타고 서쪽으로 한 정거장 이동해 BTS 칫롬역에서 내리면 The Mercury Ville 건물로 바로 들어갈 수 있어요. BTS를 이용하면 문 앞에서 문 앞까지 약 10분이 걸려요. 택시나 Grab 앱을 이용하면 약 5분, 요금은 약 60바트예요. LENGOLF는 4층에 있어요.',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'The Square (Novotel)', cuisine: '인터내셔널 뷔페', distance_m: 0 },
        { name: 'Soi 11 Food Street', cuisine: '길거리 음식', distance_m: 400 },
        { name: 'Nara Thai (Gaysorn)', cuisine: '태국 요리', distance_m: 700 },
        { name: 'Long Table (rooftop)', cuisine: '컨템퍼러리 태국 요리', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'Ploenchit BTS to explore Bangkok', type: 'transport', distance_m: 150 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 1500 },
        { name: 'Bumrungrad Hospital', type: 'medical', distance_m: 500 },
        { name: 'Nana Entertainment', type: 'nightlife', distance_m: 400 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Novotel+Bangkok+Ploenchit+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Novotel Ploenchit 호텔은 방콕에서 가장 길고 다양한 도로인 Sukhumvit의 서쪽 끝자락에 있어요. BTS 플런칫역과 나나 사이의 이 구간에서 Sukhumvit의 식음료와 나이트라이프 신이 시작돼요. 서쪽의 정돈된 쇼핑몰 지구보다 거칠고 더 방콕다운 경험을 할 수 있어요. 방콕에서 가장 유명한 골목 중 하나인 Soi 11 거리는 400m 떨어져 있고, 해가 지면 현지인과 외국인 거주자가 함께 몰리는 레스토랑·바·클럽 거리로 바뀌어요. 낮에는 길거리 음식이 훌륭해요. Soi 11 골목 노점에서는 팟 끄라파오(바질 볶음), 보트 누들, 쏨땀(그린 파파야 샐러드)을 50~80바트에 팔아요. 호텔에서 BTS 플런칫역까지 2분이면 걸어가고, 거기서 BTS 칫롬역의 LENGOLF까지 한 정거장이라 이 일대에서 실내 골프에 가장 쉽게 닿는 편이에요. 동남아시아 최고의 의료 관광지로 꼽히는 Bumrungrad Hospital 병원도 500m 거리라, 치료와 여행을 함께 하는 투숙객이 많아요. 가족 여행이라면 Novotel 호텔의 수영장과 키즈 공간이 무난하고, BTS로 세 정거장 거리의 Central Embassy 쇼핑몰에는 훌륭한 어린이 놀이 공간이 있어요.',
      suggested_itinerary: [
        { time: '08:00', activity: 'The Square(호텔 내)에서 조식, 또는 로비 카페에서 커피 한 잔' },
        { time: '09:30', activity: 'BTS 플런칫역에서 시암역까지 두 정거장 이동해 Siam Paragon과 MBK에서 쇼핑' },
        { time: '12:00', activity: 'Soi 11 노점에서 점심 — 길거리 상인들이 파는 보트 누들이나 팟 끄라파오를 맛보세요' },
        { time: '14:00', activity: 'BTS로 한 정거장 이동해 칫롬역 LENGOLF에서 실내 골프 (최대 5명까지 시간당 약 550바트, 2026년 7월 기준)' },
        { time: '16:30', activity: 'Ploenchit Road에서 걸어 돌아오며 Central Embassy에 들러 구경도 하고 더위도 식히기' },
        { time: '18:30', activity: 'Long Table 루프톱 바(Column Bangkok)에서 선다우너 — 파노라마 도시 전망과 태국식 타파스' },
        { time: '20:30', activity: 'Soi 11에서 저녁과 술 — Cheap Charlie\'s(야외 바) 또는 Havana Social(스피크이지)' },
      ],
    },
  },

  // ─── ZH: things-to-do-near-novotel-ploenchit ───
  // Figures carried from EN: 1,500m / 21分钟 / 4星, BTS门到门约10分钟, 打车约5分钟约60泰铢,
  // Soi 11 400m, Bumrungrad 500m, 路边小吃50–80泰铢, Central Embassy 3站BTS.
  // Range separator –, per zh conventions. Cheap Charlie\'s apostrophe escaped.
  {
    id: 'hotel-7-zh',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-novotel-ploenchit',
    title: 'Novotel Bangkok Ploenchit附近好去处 — 周边活动指南',
    meta_description:
      '住在Novotel Ploenchit？周边这样安排：LENGOLF室内高尔夫（800米，或BTS一站）、购物、泰式路边小吃与夜间娱乐。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'zh',
    related_slugs: ['/activities/weekend-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Novotel Bangkok Ploenchit Sukhumvit',
      hotel_neighbourhood: 'Sukhumvit / Ploenchit',
      hotel_distance_m: 1500,
      walking_time_mins: 21,
      walking_directions:
        '走路是1.5公里、约21分钟——走得动，但在曼谷的暑气里我们更建议搭BTS或打车。先走到BTS Ploenchit站（距酒店步行2分钟），搭BTS向西一站到BTS Chidlom站，再直接走进The Mercury Ville。搭BTS门到门总共约10分钟。从酒店打车或叫Grab约5分钟，车费约60泰铢。LENGOLF在4楼。',
      hotel_star_rating: 4,
      nearby_restaurants: [
        { name: 'The Square (Novotel)', cuisine: '国际自助餐', distance_m: 0 },
        { name: 'Soi 11 Food Street', cuisine: '路边小吃', distance_m: 400 },
        { name: 'Nara Thai (Gaysorn)', cuisine: '泰餐', distance_m: 700 },
        { name: 'Long Table (rooftop)', cuisine: '当代泰菜', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'Ploenchit BTS to explore Bangkok', type: 'transport', distance_m: 150 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 1500 },
        { name: 'Bumrungrad Hospital', type: 'medical', distance_m: 500 },
        { name: 'Nana Entertainment', type: 'nightlife', distance_m: 400 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Novotel+Bangkok+Ploenchit+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Novotel Ploenchit位于Sukhumvit的西端——这是曼谷最长、也最多元的一条路。BTS Ploenchit站到Nana之间的这一段，正是Sukhumvit餐饮与夜生活的起点，比再往西的商场区更粗粝，也更贴近真实的曼谷。曼谷最有名的巷子之一Soi 11步行400米可达，入夜后变成一整条餐厅、酒吧和夜店，本地人和外籍居民都爱去。白天这一带的路边小吃很出色——Soi 11的巷子里有摊贩卖打抛饭、船面和青木瓜沙拉，一份50–80泰铢。BTS Ploenchit站距酒店步行2分钟，从这里到LENGOLF所在的BTS Chidlom站只有一站，是这一带去室内高尔夫最省事的路线之一。500米外的Bumrungrad Hospital是东南亚顶尖的医疗旅游目的地之一，不少住客正是把治疗和休闲结合起来的医疗游客。带孩子的家庭，Novotel的泳池和儿童区都不错；搭BTS 3站可达的Central Embassy商场也有很好的儿童游乐区。',
      suggested_itinerary: [
        { time: '08:00', activity: '在酒店的The Square吃早餐，或者到大堂咖啡吧买杯咖啡' },
        { time: '09:30', activity: '从Ploenchit搭BTS到Siam（2站），逛Siam Paragon和MBK' },
        { time: '12:00', activity: '在Soi 11的小吃摊吃午饭——试试船面或路边摊的打抛饭' },
        { time: '14:00', activity: '搭BTS 1站到Chidlom，在LENGOLF打室内高尔夫（每小时约550泰铢，最多5人）' },
        { time: '16:30', activity: '沿Ploenchit Road走回来，顺路进Central Embassy逛逛、吹吹空调' },
        { time: '18:30', activity: '到Long Table天台酒吧（Column Bangkok）喝日落酒——全景城市视野配泰式小食' },
        { time: '20:30', activity: '在Soi 11吃晚饭喝酒——Cheap Charlie\'s（露天酒吧）或Havana Social（隐藏酒吧）' },
      ],
    },
  },
  {
    id: 'hotel-8',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-renaissance-ratchaprasong',
    title: 'Things to Do Near Renaissance Bangkok Ratchaprasong | Guest Guide',
    meta_description:
      'Staying at Renaissance Bangkok Ratchaprasong? Discover nearby activities — indoor golf at LENGOLF (450m walk), CentralWorld, Erawan Shrine, and fine dining.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'en',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/indoor-activities-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Renaissance Bangkok Ratchaprasong Hotel',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 450,
      walking_time_mins: 6,
      walking_directions:
        'Exit Renaissance Bangkok onto Ratchadamri Road via the main entrance. Turn right and walk east along Ploenchit Road — The Mercury Ville will be on your right at BTS Chidlom within 6 minutes. LENGOLF is on Floor 4.',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Flavors (Renaissance)', cuisine: 'International', distance_m: 0 },
        { name: 'Red Sky (Centara Grand)', cuisine: 'Mediterranean / Rooftop', distance_m: 300 },
        { name: 'Nara Thai (CentralWorld)', cuisine: 'Thai', distance_m: 200 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: 'Thai Seafood', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'CentralWorld', type: 'shopping', distance_m: 100 },
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 450 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 500 },
        { name: 'BigC Supercenter', type: 'shopping', distance_m: 200 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Renaissance+Bangkok+Ratchaprasong+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The Renaissance sits directly behind CentralWorld — Southeast Asia\'s largest lifestyle mall — giving guests instant access to over 500 shops, a 15-screen cinema, an ice-skating rink, and one of Bangkok\'s best food courts. The Ratchaprasong district is Bangkok\'s retail core, home to an unbroken chain of malls stretching from Siam Discovery to Gaysorn Village. But the area has cultural depth too: the Ratchaprasong intersection features four Hindu shrines at its corners (Erawan Shrine being the most famous), each dedicated to different deities, and watching the Thai dancers perform is a quintessential Bangkok moment. For corporate guests at the Renaissance — and there are many, given the hotel\'s extensive meeting facilities — the area offers seamless team entertainment. CentralWorld\'s upper floors house excellent restaurants like Nara Thai and Red Sky (the 55th-floor rooftop bar at the adjacent Centara Grand). BigC Supercenter (200m) is the place to stock up on Thai snacks, cosmetics, and souvenirs at local prices — far cheaper than the upmarket malls. The Renaissance\'s main entrance is on Sukhumvit Road, which means the 6-minute walk to LENGOLF is a quick, straight stroll west along Ploenchit Road.',
      suggested_itinerary: [
        { time: '8:30 AM', activity: 'Breakfast at Flavors — the Renaissance\'s all-day dining restaurant with city views' },
        { time: '10:00 AM', activity: 'Walk to CentralWorld (100m) for shopping — the B2S bookstore on the 6th floor is excellent' },
        { time: '12:00 PM', activity: 'Lunch at Nara Thai (CentralWorld) or the food court on Level 7 for budget-friendly Thai food' },
        { time: '1:30 PM', activity: 'Visit the Erawan Shrine (200m) and the three other Hindu shrines at the Ratchaprasong intersection' },
        { time: '3:00 PM', activity: 'Walk 6 minutes to LENGOLF for indoor golf — great for post-meeting team bonding' },
        { time: '5:30 PM', activity: 'Stop at BigC (200m from hotel) for Thai snacks, local cosmetics, and souvenirs at local prices' },
        { time: '7:00 PM', activity: 'Sunset cocktails at Red Sky (Centara Grand, 55th floor, 300m) — one of Bangkok\'s best rooftop bars' },
        { time: '9:00 PM', activity: 'Late dinner at Somboon Seafood Chidlom — the curry crab and garlic prawns are legendary' },
      ],
    },
  },

  // ─── TH: things-to-do-near-renaissance-ratchaprasong ───
  // Figures carried verbatim: 450 m / 6 min / 5 stars, ร้านค้ากว่า 500 ร้าน, โรงหนัง 15 โรง,
  // Red Sky ชั้น 55, BigC 200 เมตร, ศาล 4 แห่งที่แยกราชประสงค์. Direction wording ("ออกทาง
  // ถนนสุขุมวิท ... เดินไปทางทิศตะวันตก") carried exactly as EN wrote it — flagged.
  {
    id: 'hotel-8-th',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-renaissance-ratchaprasong',
    title: 'สิ่งที่น่าทำใกล้ Renaissance Bangkok Ratchaprasong | ไกด์สำหรับผู้เข้าพัก',
    meta_description:
      'พักที่ Renaissance Bangkok Ratchaprasong อยู่ใช่ไหม รวมกิจกรรมใกล้โรงแรม ทั้งกอล์ฟในร่มที่ LENGOLF (เดิน 450 เมตร) CentralWorld ศาลพระพรหมเอราวัณ และร้านอาหารไฟน์ไดนิ่ง',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'th',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/indoor-activities-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Renaissance Bangkok Ratchaprasong Hotel',
      hotel_neighbourhood: 'ราชประสงค์ / ชิดลม',
      hotel_distance_m: 450,
      walking_time_mins: 6,
      walking_directions:
        'ออกจาก Renaissance Bangkok ทางประตูหลักสู่ถนนราชดำริ (Ratchadamri Road) เลี้ยวขวาแล้วเดินไปทางทิศตะวันออกตามถนนเพลินจิต (Ploenchit Road) The Mercury Ville จะอยู่ทางขวามือที่ BTS ชิดลม ภายใน 6 นาที LENGOLF อยู่ชั้น 4',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Flavors (Renaissance)', cuisine: 'อาหารนานาชาติ', distance_m: 0 },
        { name: 'Red Sky (Centara Grand)', cuisine: 'เมดิเตอร์เรเนียน / รูฟท็อป', distance_m: 300 },
        { name: 'Nara Thai (CentralWorld)', cuisine: 'อาหารไทย', distance_m: 200 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: 'ซีฟู้ดไทย', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'CentralWorld', type: 'shopping', distance_m: 100 },
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 450 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 500 },
        { name: 'BigC Supercenter', type: 'shopping', distance_m: 200 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Renaissance+Bangkok+Ratchaprasong+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Renaissance ตั้งอยู่ด้านหลัง CentralWorld ศูนย์การค้าไลฟ์สไตล์ที่ใหญ่ที่สุดในเอเชียตะวันออกเฉียงใต้พอดี ผู้เข้าพักจึงเข้าถึงร้านค้ากว่า 500 ร้าน โรงภาพยนตร์ 15 โรง ลานสเก็ตน้ำแข็ง และหนึ่งในศูนย์อาหารที่ดีที่สุดของกรุงเทพฯ ได้ทันที ย่านราชประสงค์คือแกนกลางค้าปลีกของกรุงเทพฯ ที่มีห้างเรียงต่อกันไม่ขาดสายตั้งแต่ Siam Discovery ไปจนถึง Gaysorn Village แต่ย่านนี้ก็มีมิติทางวัฒนธรรมด้วย เพราะแยกราชประสงค์มีศาลฮินดูอยู่ทั้งสี่มุม (โดยศาลพระพรหมเอราวัณเป็นที่รู้จักมากที่สุด) แต่ละแห่งบูชาเทพองค์ต่างกัน และการได้ยืนดูคณะรำไทยแสดงแก้บนถือเป็นภาพจำอย่างหนึ่งของกรุงเทพฯ สำหรับแขกองค์กรของ Renaissance ซึ่งมีจำนวนมากเพราะโรงแรมมีห้องประชุมครบครัน ย่านนี้จัดกิจกรรมให้ทีมได้ราบรื่น ชั้นบนของ CentralWorld มีร้านอาหารดี ๆ อย่าง Nara Thai และ Red Sky (รูฟท็อปบาร์ชั้น 55 ของ Centara Grand ที่อยู่ติดกัน) ส่วน BigC Supercenter (200 เมตร) คือที่ที่ควรไปตุนขนมไทย เครื่องสำอาง และของฝากในราคาแบบคนท้องถิ่น ซึ่งถูกกว่าห้างระดับบนมาก ประตูหลักของ Renaissance อยู่บนถนนสุขุมวิท การเดิน 6 นาทีไป LENGOLF จึงเป็นเส้นทางตรงไปทางทิศตะวันตกตามถนนเพลินจิตแบบสบาย ๆ',
      suggested_itinerary: [
        { time: '08:30 น.', activity: 'อาหารเช้าที่ Flavors ห้องอาหารออลเดย์ไดนิ่งของ Renaissance พร้อมวิวเมือง' },
        { time: '10:00 น.', activity: 'เดินไป CentralWorld (100 เมตร) เพื่อช้อปปิ้ง ร้านหนังสือ B2S ชั้น 6 ดีมาก' },
        { time: '12:00 น.', activity: 'มื้อกลางวันที่ Nara Thai (CentralWorld) หรือศูนย์อาหารชั้น 7 สำหรับอาหารไทยราคาย่อมเยา' },
        { time: '13:30 น.', activity: 'ไปศาลพระพรหมเอราวัณ (200 เมตร) และศาลฮินดูอีกสามแห่งที่แยกราชประสงค์' },
        { time: '15:00 น.', activity: 'เดิน 6 นาทีไปที่ LENGOLF เพื่อเล่นกอล์ฟในร่ม เหมาะกับการกระชับความสัมพันธ์ในทีมหลังประชุม' },
        { time: '17:30 น.', activity: 'แวะ BigC (ห่างจากโรงแรม 200 เมตร) ซื้อขนมไทย เครื่องสำอาง และของฝากในราคาแบบคนท้องถิ่น' },
        { time: '19:00 น.', activity: 'ค็อกเทลยามพระอาทิตย์ตกที่ Red Sky (Centara Grand ชั้น 55 ห่าง 300 เมตร) หนึ่งในรูฟท็อปบาร์ที่ดีที่สุดของกรุงเทพฯ' },
        { time: '21:00 น.', activity: 'มื้อค่ำมื้อดึกที่ Somboon Seafood ชิดลม ปูผัดผงกะหรี่และกุ้งกระเทียมเป็นเมนูในตำนาน' },
      ],
    },
  },

  // ─── JA: things-to-do-near-renaissance-ratchaprasong ───
  // EN's 「スクンビット通りの正面玄関」と「西へ」 are carried verbatim in both the
  // directions and the area_guide even though the hotel fronts Ploenchit and
  // Chidlom lies east — reported to the orchestrator instead of corrected.
  // No LENGOLF price appears in rendered copy, so no as-of marker was added.
  {
    id: 'hotel-8-ja',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-renaissance-ratchaprasong',
    title: 'ルネッサンス・バンコク・ラチャプラソン周辺の過ごし方 — 宿泊者向けガイド',
    meta_description:
      'ルネッサンス・バンコク・ラチャプラソン（Renaissance Bangkok Ratchaprasong）周辺の過ごし方。徒歩450mのLENGOLFでインドアゴルフ、セントラルワールド、エラワン廟、高級レストラン。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ja',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/indoor-activities-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Renaissance Bangkok Ratchaprasong Hotel',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 450,
      walking_time_mins: 6,
      walking_directions:
        'Renaissance Bangkokの正面玄関からラチャダムリ通り（Ratchadamri Road）へ出ます。右に曲がり、プルンチット通り（Ploenchit Road）を東へ歩くと、6分以内にBTSチットロム駅のところで右手にザ・マーキュリービルが見えます。LENGOLFは4階です。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Flavors (Renaissance)', cuisine: 'インターナショナル', distance_m: 0 },
        { name: 'Red Sky (Centara Grand)', cuisine: '地中海料理／ルーフトップ', distance_m: 300 },
        { name: 'Nara Thai (CentralWorld)', cuisine: 'タイ料理', distance_m: 200 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: 'タイのシーフード', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'CentralWorld', type: 'shopping', distance_m: 100 },
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 450 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 500 },
        { name: 'BigC Supercenter', type: 'shopping', distance_m: 200 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Renaissance+Bangkok+Ratchaprasong+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Renaissanceは、東南アジア最大級のライフスタイルモールであるセントラルワールドのちょうど裏手に建っています。500を超える店舗、15スクリーンの映画館、アイススケートリンク、そしてバンコク屈指のフードコートがすぐそこ。ラチャプラソン地区はバンコクの小売の中心で、サイアムディスカバリーからGaysorn Villageまでモールが途切れることなく連なります。ただ、この一帯には文化的な奥行きもあります。ラチャプラソン交差点の四つの角には、それぞれ別の神を祀るヒンドゥーの祠があり（もっとも有名なのがエラワン廟）、奉納舞踊を眺める時間はいかにもバンコクらしいひとときです。広い会議施設を持つRenaissanceにはビジネス目的の宿泊が多く、そうしたグループの余暇にもこの立地は好都合。セントラルワールドの上層階には、Nara Thaiや、隣接するCentara Grandの55階にあるルーフトップバーRed Skyなど、質の高い店が入っています。200m先のBigC Supercenterは、タイのお菓子や化粧品、土産物をローカル価格でまとめ買いできる場所で、高級モールとは値段が大きく違います。Renaissanceの正面玄関はスクンビット通りに面しているため、LENGOLFへの徒歩6分はプルンチット通りを西へまっすぐ歩くだけです。',
      suggested_itinerary: [
        { time: '8:30', activity: 'Flavorsで朝食。Renaissanceのオールデイダイニングで、街の眺めも楽しめます' },
        { time: '10:00', activity: 'セントラルワールド（100m）まで歩いて買い物を。6階の書店B2Sは品揃えが充実しています' },
        { time: '12:00', activity: 'Nara Thai（セントラルワールド）でランチ、または7階のフードコートで手頃なタイ料理を' },
        { time: '13:30', activity: 'エラワン廟（200m）と、ラチャプラソン交差点にある他の三つのヒンドゥーの祠を巡ります' },
        { time: '15:00', activity: '徒歩6分でLENGOLFへ。会議のあとのチームの親睦にも向いています' },
        { time: '17:30', activity: 'ホテルから200mのBigCで、タイのお菓子やコスメ、土産物をローカル価格で' },
        { time: '19:00', activity: 'Red Sky（Centara Grand 55階、300m）でサンセットカクテル。バンコク屈指のルーフトップバーです' },
        { time: '21:00', activity: '遅めのディナーはSomboon Seafoodのチットロム店へ。カニのカレー炒めとエビのニンニク炒めは語り草です' },
      ],
    },
  },

  // ─── KO: things-to-do-near-renaissance-ratchaprasong ───
  // Figures from EN hotel-8: 450m / 6분, 4층, CentralWorld 100m(500개 이상 상점,
  // 15개 상영관), Erawan Shrine 200m, BigC 200m, Red Sky 55층 300m, B2S 6층,
  // 푸드코트 7층. EN에 LENGOLF 가격이 없어 가격/as-of 표기를 넣지 않았어요.
  // EN의 "Sukhumvit Road 정문"과 "서쪽으로" 방향어는 원문대로 옮겼습니다.
  {
    id: 'hotel-8-ko',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-renaissance-ratchaprasong',
    title: 'Renaissance Bangkok Ratchaprasong 주변 즐길 거리 — 투숙객 가이드',
    meta_description:
      'Renaissance Bangkok Ratchaprasong에 묵는다면 도보 450m 거리의 LENGOLF 실내 골프부터 CentralWorld, Erawan Shrine, 파인다이닝까지 가까운 즐길 거리를 소개해요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ko',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/indoor-activities-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Renaissance Bangkok Ratchaprasong Hotel',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 450,
      walking_time_mins: 6,
      walking_directions:
        'Renaissance Bangkok 호텔 정문에서 Ratchadamri Road 쪽으로 나옵니다. 오른쪽으로 돈 뒤 Ploenchit Road에서 동쪽으로 걸으면, 6분 안에 BTS 칫롬역 오른편으로 The Mercury Ville 건물이 나와요. LENGOLF는 4층에 있어요.',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Flavors (Renaissance)', cuisine: '인터내셔널', distance_m: 0 },
        { name: 'Red Sky (Centara Grand)', cuisine: '지중해 요리 / 루프톱', distance_m: 300 },
        { name: 'Nara Thai (CentralWorld)', cuisine: '태국 요리', distance_m: 200 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: '태국 해산물', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'CentralWorld', type: 'shopping', distance_m: 100 },
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 450 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 500 },
        { name: 'BigC Supercenter', type: 'shopping', distance_m: 200 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Renaissance+Bangkok+Ratchaprasong+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Renaissance 호텔은 동남아시아 최대 라이프스타일 몰인 CentralWorld 바로 뒤에 있어요. 500개가 넘는 상점과 15개 상영관 영화관, 아이스링크, 방콕에서 손꼽히는 푸드코트를 곧바로 이용할 수 있어요. Ratchaprasong 지구는 방콕 리테일의 중심으로, Siam Discovery에서 Gaysorn Village까지 쇼핑몰이 끊이지 않고 이어져요. 그렇다고 문화가 얕은 동네는 아니에요. Ratchaprasong 교차로 네 모퉁이에는 각각 다른 신을 모시는 힌두 사원 네 곳이 있고(가장 유명한 곳이 Erawan Shrine 사원이에요), 태국 무용수들의 공연을 지켜보는 건 전형적인 방콕의 한 장면이에요. Renaissance 호텔은 회의 시설이 넓어 기업 고객이 많은데, 이 동네는 단체 여흥을 짜기에도 매끄러워요. CentralWorld 위층에는 Nara Thai 같은 좋은 식당들이 있고, 옆 건물 Centara Grand 55층 루프톱 바 Red Sky도 가까워요. 200m 거리의 BigC Supercenter 매장은 태국 과자와 화장품, 기념품을 현지 가격에 사기 좋아요. 고급 쇼핑몰보다 훨씬 저렴해요. Renaissance 호텔의 정문은 Sukhumvit Road에 있어서, LENGOLF까지 6분 걷는 길은 Ploenchit Road에서 서쪽으로 곧게 이어지는 짧은 산책이에요.',
      suggested_itinerary: [
        { time: '08:30', activity: 'Flavors에서 조식 — 도시 전망을 갖춘 Renaissance 호텔의 올데이 다이닝 레스토랑이에요' },
        { time: '10:00', activity: 'CentralWorld까지 걸어가(100m) 쇼핑 — 6층 B2S 서점이 특히 좋아요' },
        { time: '12:00', activity: 'Nara Thai(CentralWorld)에서 점심, 또는 7층 푸드코트에서 부담 없는 가격의 태국 요리' },
        { time: '13:30', activity: 'Erawan Shrine 방문(200m)과 Ratchaprasong 교차로의 다른 힌두 사원 세 곳 둘러보기' },
        { time: '15:00', activity: '6분 걸어 LENGOLF에서 실내 골프 — 회의를 마친 뒤 팀 분위기를 다지기에 좋아요' },
        { time: '17:30', activity: 'BigC(호텔에서 200m)에 들러 태국 과자와 현지 화장품, 기념품을 현지 가격에 쇼핑' },
        { time: '19:00', activity: 'Red Sky(Centara Grand 55층, 300m)에서 일몰 칵테일 — 방콕 최고의 루프톱 바 중 하나예요' },
        { time: '21:00', activity: 'Somboon Seafood Chidlom에서 늦은 저녁 — 커리 크랩과 마늘 새우가 전설적이에요' },
      ],
    },
  },

  // ─── ZH: things-to-do-near-renaissance-ratchaprasong ───
  // Figures carried from EN: 450m / 6分钟 / 5星, CentralWorld 100m, Erawan 200m,
  // Siam Paragon 500m, BigC 200m, Red Sky 300m 55楼, 500多家店铺, 15个厅影院.
  // CentralWorld glossed once as 尚泰世界; Erawan Shrine glossed once as 四面佛.
  {
    id: 'hotel-8-zh',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-renaissance-ratchaprasong',
    title: 'Renaissance Bangkok Ratchaprasong附近好去处 — 住客指南',
    meta_description:
      '住在Renaissance Bangkok Ratchaprasong？周边活动一次看齐：步行450米到LENGOLF打室内高尔夫，还有CentralWorld、四面佛与高级餐饮。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'zh',
    related_slugs: ['/activities/group-activities-bangkok', '/activities/indoor-activities-bangkok', '/events'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Renaissance Bangkok Ratchaprasong Hotel',
      hotel_neighbourhood: 'Ratchaprasong / Chidlom',
      hotel_distance_m: 450,
      walking_time_mins: 6,
      walking_directions:
        '从Renaissance Bangkok的正门出来到Ratchadamri Road上。右转，沿Ploenchit Road向东走——6分钟内The Mercury Ville就会出现在右手边的BTS Chidlom站旁。LENGOLF在4楼。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Flavors (Renaissance)', cuisine: '国际料理', distance_m: 0 },
        { name: 'Red Sky (Centara Grand)', cuisine: '地中海菜、天台', distance_m: 300 },
        { name: 'Nara Thai (CentralWorld)', cuisine: '泰餐', distance_m: 200 },
        { name: 'Somboon Seafood (Chidlom)', cuisine: '泰式海鲜', distance_m: 600 },
      ],
      nearby_activities: [
        { name: 'CentralWorld', type: 'shopping', distance_m: 100 },
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 450 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 500 },
        { name: 'BigC Supercenter', type: 'shopping', distance_m: 200 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Renaissance+Bangkok+Ratchaprasong+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Renaissance就在CentralWorld（尚泰世界）正后方——这是东南亚最大的生活方式商场，住客一出门就有500多家店铺、15个厅的影院、一个溜冰场，以及曼谷最好的美食广场之一。Ratchaprasong区是曼谷的零售核心，从Siam Discovery一路到Gaysorn Village的商场几乎连成一片。不过这一带也有文化的厚度：Ratchaprasong路口的四个角上各有一座印度教神龛（其中最有名的是Erawan Shrine，也就是四面佛），分别供奉不同神祇，看泰国舞者在这里献舞是很地道的曼谷一刻。对Renaissance的商务客人来说——酒店会议设施齐全，这类客人不少——周边安排团队娱乐相当顺手。CentralWorld的高楼层有Nara Thai这样的好餐厅，隔壁Centara Grand的55楼还有天台酒吧Red Sky。200米外的BigC Supercenter是按本地价格采买泰国零食、化妆品和伴手礼的地方，比高档商场便宜得多。Renaissance的正门开在Sukhumvit Road上，因此沿Ploenchit Road向西笔直走6分钟就到LENGOLF，一路好走。',
      suggested_itinerary: [
        { time: '08:30', activity: '在Flavors吃早餐——Renaissance的全日餐厅，可以看城市景观' },
        { time: '10:00', activity: '走到CentralWorld（100米）购物——6楼的B2S书店很不错' },
        { time: '12:00', activity: '在CentralWorld的Nara Thai吃午饭，或者到7楼美食广场吃平价泰菜' },
        { time: '13:30', activity: '去Erawan Shrine（200米），顺便看看Ratchaprasong路口另外三座印度教神龛' },
        { time: '15:00', activity: '步行6分钟到LENGOLF打室内高尔夫——很适合会后的团队破冰' },
        { time: '17:30', activity: '到BigC（距酒店200米）买泰国零食、本地化妆品和伴手礼，价格按本地来' },
        { time: '19:00', activity: '在Red Sky（Centara Grand 55楼，300米）喝日落鸡尾酒——曼谷最好的天台酒吧之一' },
        { time: '21:00', activity: '在Somboon Seafood Chidlom吃一顿晚一些的晚餐——咖喱蟹和蒜香虾是招牌' },
      ],
    },
  },
  {
    id: 'hotel-9',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-okura-prestige-bangkok',
    title: 'Things to Do Near The Okura Prestige Bangkok | Activities Guide',
    meta_description:
      'Staying at The Okura Prestige Bangkok? Discover nearby activities — indoor golf at LENGOLF (600m), Ploenchit shopping, Lumpini Park, and fine dining.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'en',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'The Okura Prestige Bangkok',
      hotel_neighbourhood: 'Wireless Road / Ploenchit',
      hotel_distance_m: 600,
      walking_time_mins: 9,
      walking_directions:
        'Exit The Okura Prestige onto Ploenchit Road. Walk west (right out of the hotel) along Ploenchit Road past BTS Ploenchit station. Continue along Ploenchit Road for about 7 minutes. The Mercury Ville is on your left at BTS Chidlom. LENGOLF is on Floor 4. Alternatively, take BTS Ploenchit one stop to Chidlom (faster in hot weather).',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Yamazato (Okura)', cuisine: 'Japanese Fine Dining', distance_m: 0 },
        { name: 'Elements (Okura)', cuisine: 'French-Japanese', distance_m: 0 },
        { name: 'Karmakamet Diner', cuisine: 'Thai Fusion', distance_m: 300 },
        { name: 'Sushi Masato', cuisine: 'Japanese Omakase', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Ploenchit BTS', type: 'transport', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 600 },
        { name: 'Central Embassy', type: 'shopping', distance_m: 200 },
        { name: 'Nai Lert Park Heritage Home', type: 'cultural', distance_m: 300 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=The+Okura+Prestige+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The Okura Prestige occupies one of the most prestigious addresses on Ploenchit Road, Bangkok\'s equivalent of Park Avenue. The hotel sits directly above BTS Ploenchit station, making it effortlessly connected to the entire city. The Okura is a Japanese institution — the Tokyo original has hosted emperors and heads of state — and the Bangkok property maintains the same exacting standards. Yamazato, the hotel\'s Japanese restaurant, is considered one of the most authentic Japanese fine dining experiences outside Japan, and Elements fuses French technique with Japanese precision. The Ploenchit stretch is home to Bangkok\'s most upscale shopping: Central Embassy (200m), a soaring glass mall anchored by a luxury cinema and the Open House co-working space, is the primary destination. The Nai Lert Park Heritage Home (300m), a beautifully preserved teak mansion from the early 1900s, offers a quiet cultural detour that most tourists miss. For the Okura\'s Japanese clientele — many of whom are avid golfers — LENGOLF is an appealing option: just one BTS stop away, it offers a quick practice session or social round without the half-day commitment of traveling to an outdoor course. The hotel\'s own 25th-floor infinity pool and spa, overlooking the Royal Bangkok Sports Club, is among the best in the city.',
      suggested_itinerary: [
        { time: '7:00 AM', activity: 'Morning swim in the 25th-floor infinity pool — the view over the Royal Bangkok Sports Club is stunning' },
        { time: '8:30 AM', activity: 'Traditional Japanese breakfast at Yamazato — grilled salmon, miso soup, tamagoyaki, and rice' },
        { time: '10:00 AM', activity: 'Walk to Central Embassy (200m) for luxury shopping and the Open House rooftop library' },
        { time: '12:00 PM', activity: 'Lunch at Karmakamet Diner (300m) — a hidden Thai-fusion gem inside an aromatic boutique' },
        { time: '2:00 PM', activity: 'Visit Nai Lert Park Heritage Home (300m) — a restored teak mansion with beautiful gardens' },
        { time: '3:30 PM', activity: 'Take BTS 1 stop to Chidlom for indoor golf at LENGOLF (~550 THB/hour, up to 5 people)' },
        { time: '6:00 PM', activity: 'Return to the Okura\'s rooftop bar for cocktails with panoramic skyline views' },
        { time: '8:00 PM', activity: 'Omakase dinner at Sushi Masato (500m) — one of Bangkok\'s top Japanese omakase counters' },
      ],
    },
  },

  // ─── TH: things-to-do-near-okura-prestige-bangkok ───
  // Figures carried verbatim: 600 m / 9 min / 5 stars, Central Embassy 200 เมตร,
  // Nai Lert Park 300 เมตร, Sushi Masato 500 เมตร, สระชั้น 25, ประมาณ 550 บาท/ชั่วโมง.
  // EN's Japanese-clientele sentence is a statement about the hotel's guests, not a
  // LENGOLF language claim, so it is carried without adding any language-support claim.
  {
    id: 'hotel-9-th',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-okura-prestige-bangkok',
    title: 'สิ่งที่น่าทำใกล้ The Okura Prestige Bangkok | ไกด์กิจกรรม',
    meta_description:
      'พักที่ The Okura Prestige Bangkok อยู่ใช่ไหม รวมกิจกรรมใกล้โรงแรม ทั้งกอล์ฟในร่มที่ LENGOLF (600 เมตร) ช้อปปิ้งย่านเพลินจิต สวนลุมพินี และร้านอาหารไฟน์ไดนิ่ง',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'th',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'The Okura Prestige Bangkok',
      hotel_neighbourhood: 'ถนนวิทยุ / เพลินจิต',
      hotel_distance_m: 600,
      walking_time_mins: 9,
      walking_directions:
        'ออกจาก The Okura Prestige มายังถนนเพลินจิต (Ploenchit Road) เดินไปทางทิศตะวันตก (เลี้ยวขวาเมื่อออกจากโรงแรม) ตามถนนเพลินจิต ผ่านสถานี BTS เพลินจิต แล้วเดินต่อไปตามถนนเพลินจิตราว 7 นาที The Mercury Ville จะอยู่ทางซ้ายมือที่ BTS ชิดลม LENGOLF อยู่ชั้น 4 อีกทางเลือกหนึ่งคือนั่ง BTS จากเพลินจิตไปชิดลม 1 สถานี ซึ่งเร็วกว่าเมื่ออากาศร้อน',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Yamazato (Okura)', cuisine: 'อาหารญี่ปุ่นไฟน์ไดนิ่ง', distance_m: 0 },
        { name: 'Elements (Okura)', cuisine: 'ฝรั่งเศส-ญี่ปุ่น', distance_m: 0 },
        { name: 'Karmakamet Diner', cuisine: 'อาหารไทยฟิวชัน', distance_m: 300 },
        { name: 'Sushi Masato', cuisine: 'โอมากาเสะญี่ปุ่น', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Ploenchit BTS', type: 'transport', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 600 },
        { name: 'Central Embassy', type: 'shopping', distance_m: 200 },
        { name: 'Nai Lert Park Heritage Home', type: 'cultural', distance_m: 300 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=The+Okura+Prestige+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The Okura Prestige อยู่บนหนึ่งในทำเลที่มีเกียรติที่สุดของถนนเพลินจิต ซึ่งเทียบได้กับพาร์กอเวนิวของกรุงเทพฯ ตัวโรงแรมตั้งอยู่เหนือสถานี BTS เพลินจิตพอดี จึงเชื่อมต่อกับทั้งเมืองได้อย่างไม่มีสะดุด Okura เป็นสถาบันของญี่ปุ่น โรงแรมต้นแบบที่โตเกียวเคยรับรองทั้งจักรพรรดิและประมุขของรัฐ และสาขากรุงเทพฯ ก็รักษามาตรฐานอันเข้มงวดเดียวกันไว้ Yamazato ห้องอาหารญี่ปุ่นของโรงแรม ได้รับการยกให้เป็นหนึ่งในประสบการณ์อาหารญี่ปุ่นไฟน์ไดนิ่งที่แท้จริงที่สุดนอกประเทศญี่ปุ่น ส่วน Elements ผสมเทคนิคฝรั่งเศสเข้ากับความประณีตแบบญี่ปุ่น ช่วงถนนเพลินจิตนี้เป็นที่ตั้งของแหล่งช้อปปิ้งระดับบนที่สุดของกรุงเทพฯ โดยมี Central Embassy (200 เมตร) ห้างกระจกทรงโค้งที่มีโรงภาพยนตร์ระดับหรูและพื้นที่ทำงานร่วม Open House เป็นจุดหมายหลัก ส่วนบ้านปาร์คนายเลิศ (Nai Lert Park Heritage Home, 300 เมตร) คฤหาสน์ไม้สักจากต้นทศวรรษ 1900 ที่ได้รับการอนุรักษ์อย่างงดงาม เป็นแวะพักทางวัฒนธรรมที่นักท่องเที่ยวส่วนใหญ่มองข้าม สำหรับลูกค้าชาวญี่ปุ่นของ Okura ซึ่งจำนวนมากเล่นกอล์ฟเป็นประจำ LENGOLF เป็นตัวเลือกที่น่าสนใจ เพราะอยู่ห่างเพียง BTS สถานีเดียว จึงซ้อมสั้น ๆ หรือเล่นแบบสังสรรค์ได้โดยไม่ต้องเสียเวลาครึ่งวันเดินทางไปสนามกลางแจ้ง ส่วนสระว่ายน้ำอินฟินิตี้ชั้น 25 และสปาของโรงแรมที่มองลงไปเห็นราชกรีฑาสโมสร ก็จัดว่าดีที่สุดแห่งหนึ่งในเมือง',
      suggested_itinerary: [
        { time: '07:00 น.', activity: 'ว่ายน้ำตอนเช้าที่สระอินฟินิตี้ชั้น 25 วิวราชกรีฑาสโมสรจากตรงนี้สวยมาก' },
        { time: '08:30 น.', activity: 'อาหารเช้าแบบญี่ปุ่นดั้งเดิมที่ Yamazato ทั้งปลาแซลมอนย่าง ซุปมิโซะ ทามาโกยากิ และข้าว' },
        { time: '10:00 น.', activity: 'เดินไป Central Embassy (200 เมตร) เพื่อช้อปปิ้งแบรนด์หรูและแวะห้องสมุดรูฟท็อป Open House' },
        { time: '12:00 น.', activity: 'มื้อกลางวันที่ Karmakamet Diner (300 เมตร) ร้านอาหารไทยฟิวชันที่ซ่อนอยู่ในร้านเครื่องหอมบูทีค' },
        { time: '14:00 น.', activity: 'เที่ยวบ้านปาร์คนายเลิศ (300 เมตร) คฤหาสน์ไม้สักที่ได้รับการบูรณะพร้อมสวนสวย' },
        { time: '15:30 น.', activity: 'นั่ง BTS 1 สถานีไปชิดลมเพื่อเล่นกอล์ฟในร่มที่ LENGOLF (ประมาณ 550 บาท/ชั่วโมง สำหรับผู้เล่นสูงสุด 5 คน)' },
        { time: '18:00 น.', activity: 'กลับมาที่รูฟท็อปบาร์ของ Okura เพื่อดื่มค็อกเทลพร้อมวิวเส้นขอบฟ้าแบบพาโนรามา' },
        { time: '20:00 น.', activity: 'มื้อค่ำโอมากาเสะที่ Sushi Masato (500 เมตร) หนึ่งในเคาน์เตอร์โอมากาเสะญี่ปุ่นชั้นนำของกรุงเทพฯ' },
      ],
    },
  },

  // ─── JA: things-to-do-near-okura-prestige-bangkok ───
  // EN's 「Okura's Japanese clientele — many of whom are avid golfers」 is rendered as
  // a statement about the guests, NOT about LENGOLF's language support: no 日本語
  // レッスン / 日本人コーチ claim is made or implied anywhere in this entry.
  // Figures: 600m / 9分 / 約7分 / BTS1駅 / 200m / 300m / 500m / 25階 / 約550THB.
  {
    id: 'hotel-9-ja',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-okura-prestige-bangkok',
    title: 'ザ・オークラ・プレステージ・バンコク周辺の過ごし方 — アクティビティガイド',
    meta_description:
      'ザ・オークラ・プレステージ・バンコク（The Okura Prestige Bangkok）周辺の過ごし方。徒歩600mのLENGOLFでインドアゴルフ、プルンチットの買い物、ルンピニー公園、高級レストランをご紹介します。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ja',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'The Okura Prestige Bangkok',
      hotel_neighbourhood: 'Wireless Road / Ploenchit',
      hotel_distance_m: 600,
      walking_time_mins: 9,
      walking_directions:
        'The Okura Prestigeを出て、プルンチット通り（Ploenchit Road）へ。ホテルを出て右、西方向に進み、BTSプルンチット駅の前を通り過ぎます。そのままプルンチット通りをおよそ7分歩くと、BTSチットロム駅のところで左手にザ・マーキュリービルがあります。LENGOLFは4階です。暑い日は、BTSプルンチット駅から1駅乗ってチットロム駅で降りるほうが早く着きます。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Yamazato (Okura)', cuisine: '日本料理（高級）', distance_m: 0 },
        { name: 'Elements (Okura)', cuisine: 'フレンチ×日本料理', distance_m: 0 },
        { name: 'Karmakamet Diner', cuisine: 'タイ・フュージョン', distance_m: 300 },
        { name: 'Sushi Masato', cuisine: '日本料理（おまかせ）', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Ploenchit BTS', type: 'transport', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 600 },
        { name: 'Central Embassy', type: 'shopping', distance_m: 200 },
        { name: 'Nai Lert Park Heritage Home', type: 'cultural', distance_m: 300 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=The+Okura+Prestige+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The Okura Prestigeが構えるのは、バンコクのパークアベニューとも言えるプルンチット通りの、屈指の住所です。BTSプルンチット駅の真上に立つため、市内どこへ出るにも身軽。オークラは日本を代表する存在で、東京の本館は各国の元首や国賓を迎えてきました。バンコクのホテルもその水準をそのまま保っています。館内の日本料理店Yamazatoは日本国外でもっとも本格的な日本料理のひとつと評され、Elementsはフランス料理の技法と日本料理の精緻さを掛け合わせています。プルンチット通り沿いはバンコクでも最上級の買い物エリアで、中心となるのは200m先のセントラル・エンバシー。高級シネマとコワーキングスペースOpen Houseを擁するガラス張りの高層モールです。300mのナイ・レート・パーク・ヘリテージホームは、1900年代初頭のチーク材の邸宅を美しく保存した場所で、多くの旅行者が見落とす静かな寄り道になります。ゴルフ好きの多い日本からの宿泊客にとって、LENGOLFはBTSで1駅という手軽さが魅力です。屋外コースまで出向いて半日を使わなくても、練習や仲間内のラウンドをすませられます。ロイヤル・バンコク・スポーツクラブを見下ろす25階のインフィニティプールとスパも、市内有数の設えです。',
      suggested_itinerary: [
        { time: '7:00', activity: '25階のインフィニティプールでひと泳ぎ。ロイヤル・バンコク・スポーツクラブを見渡す眺めが見事です' },
        { time: '8:30', activity: 'Yamazatoで和朝食を。焼き鮭、味噌汁、卵焼き、ご飯が並びます' },
        { time: '10:00', activity: 'セントラル・エンバシー（200m）まで歩き、ラグジュアリーな買い物と屋上のライブラリーOpen Houseへ' },
        { time: '12:00', activity: 'Karmakamet Diner（300m）でランチ。香りの雑貨店の奥に隠れたタイ・フュージョンの名店です' },
        { time: '14:00', activity: 'ナイ・レート・パーク・ヘリテージホーム（300m）を見学。美しい庭園を持つ、復元されたチーク材の邸宅です' },
        { time: '15:30', activity: 'BTSで1駅、チットロム駅のLENGOLFでインドアゴルフを（1時間約550THB、最大5名まで／2026年7月現在）' },
        { time: '18:00', activity: 'オークラのルーフトップバーに戻り、街を一望しながらカクテルを' },
        { time: '20:00', activity: 'Sushi Masato（500m）でおまかせのディナー。バンコクでも屈指のおまかせ寿司のカウンターです' },
      ],
    },
  },

  // ─── KO: things-to-do-near-okura-prestige-bangkok ───
  // Figures from EN hotel-9: 600m / 9분(도로에서 약 7분), 4층, Central Embassy 200m,
  // Nai Lert Park Heritage Home 300m(1900년대 초), Karmakamet 300m, Sushi Masato 500m,
  // 25층 인피니티 풀, 약 550바트/시간 최대 5명. "같은 기준" 표현은 as-of 오탐을
  // 피하려고 "같은 수준"으로 바꿨어요.
  {
    id: 'hotel-9-ko',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-okura-prestige-bangkok',
    title: 'The Okura Prestige Bangkok 주변 즐길 거리 — 액티비티 가이드',
    meta_description:
      'The Okura Prestige Bangkok에 묵는다면 도보 600m 거리의 LENGOLF 실내 골프부터 Ploenchit 쇼핑, Lumpini Park, 파인다이닝까지 가까운 즐길 거리를 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ko',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'The Okura Prestige Bangkok',
      hotel_neighbourhood: 'Wireless Road / Ploenchit',
      hotel_distance_m: 600,
      walking_time_mins: 9,
      walking_directions:
        'The Okura Prestige에서 Ploenchit Road 쪽으로 나옵니다. 호텔에서 오른쪽으로, Ploenchit Road에서 서쪽으로 걸어 BTS 플런칫역을 지나갑니다. Ploenchit Road에서 약 7분 더 걸으면 왼편 BTS 칫롬역에 The Mercury Ville 건물이 있어요. LENGOLF는 4층에 있어요. 더운 날에는 BTS 플런칫역에서 칫롬역까지 한 정거장을 타는 편이 더 빨라요.',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Yamazato (Okura)', cuisine: '일본 파인다이닝', distance_m: 0 },
        { name: 'Elements (Okura)', cuisine: '프랑스-일본 퓨전', distance_m: 0 },
        { name: 'Karmakamet Diner', cuisine: '태국 퓨전', distance_m: 300 },
        { name: 'Sushi Masato', cuisine: '일본 오마카세', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Ploenchit BTS', type: 'transport', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 600 },
        { name: 'Central Embassy', type: 'shopping', distance_m: 200 },
        { name: 'Nai Lert Park Heritage Home', type: 'cultural', distance_m: 300 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=The+Okura+Prestige+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The Okura Prestige 호텔은 방콕의 파크애비뉴라 불리는 Ploenchit Road에서도 가장 좋은 주소 중 하나에 있어요. 호텔이 BTS 플런칫역 바로 위에 있어서 도시 전체와 손쉽게 이어져요. Okura 브랜드는 일본을 대표하는 이름이에요. 도쿄 본관은 국왕과 국가 원수들을 맞아 왔고, 방콕 지점도 같은 수준의 엄격함을 지키고 있어요. 호텔의 일식 레스토랑 Yamazato 매장은 일본 밖에서 가장 정통에 가까운 일식 파인다이닝으로 꼽히고, Elements 레스토랑은 프랑스 조리 기법에 일본식 정밀함을 더해요. Ploenchit 일대에는 방콕에서 가장 고급스러운 쇼핑이 모여 있어요. 대표적인 곳이 200m 거리의 Central Embassy 쇼핑몰인데, 유리로 솟은 건물 안에 럭셔리 영화관과 Open House 코워킹 공간이 들어서 있어요. 300m 거리의 Nai Lert Park Heritage Home 저택은 1900년대 초에 지어진 티크 가옥을 아름답게 보존한 곳으로, 대부분의 여행자가 모르고 지나치는 조용한 문화 코스예요. 골프를 즐기는 일본인 손님이 많은 Okura 투숙객에게 LENGOLF는 매력적인 선택지예요. BTS로 한 정거장이면 닿아서, 야외 코스까지 반나절을 들이지 않고도 짧게 연습하거나 여럿이 어울려 한 라운드를 즐길 수 있어요. 호텔 25층 인피니티 풀과 스파에서는 Royal Bangkok Sports Club 전경이 내려다보여요. 방콕에서 손꼽히는 시설이에요.',
      suggested_itinerary: [
        { time: '07:00', activity: '25층 인피니티 풀에서 아침 수영 — Royal Bangkok Sports Club 쪽 전망이 훌륭해요' },
        { time: '08:30', activity: 'Yamazato에서 전통 일본식 조식 — 구운 연어와 미소 된장국, 다마고야키, 밥이 나와요' },
        { time: '10:00', activity: 'Central Embassy까지 걸어가(200m) 럭셔리 쇼핑과 Open House 루프톱 라이브러리 둘러보기' },
        { time: '12:00', activity: 'Karmakamet Diner(300m)에서 점심 — 향기 편집숍 안에 숨어 있는 태국 퓨전 맛집이에요' },
        { time: '14:00', activity: 'Nai Lert Park Heritage Home 방문(300m) — 정원이 아름다운 복원 티크 저택이에요' },
        { time: '15:30', activity: 'BTS로 한 정거장 이동해 칫롬역 LENGOLF에서 실내 골프 (최대 5명까지 시간당 약 550바트, 2026년 7월 기준)' },
        { time: '18:00', activity: 'Okura 루프톱 바로 돌아가 파노라마 스카이라인을 보며 칵테일' },
        { time: '20:00', activity: 'Sushi Masato(500m)에서 오마카세 저녁 — 방콕에서 손꼽히는 일식 오마카세 카운터예요' },
      ],
    },
  },

  // ─── ZH: things-to-do-near-okura-prestige-bangkok ───
  // Figures carried from EN: 600m / 9分钟 / 5星, Ploenchit BTS 100m, Central Embassy 200m,
  // Nai Lert 300m, Karmakamet 300m, Sushi Masato 500m, 25楼泳池, 1900年代初, ~550泰铢/小时最多5人.
  // No language claim added — EN's "Japanese clientele" line is about guests, not LENGOLF coaching.
  {
    id: 'hotel-9-zh',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-okura-prestige-bangkok',
    title: 'The Okura Prestige Bangkok附近好去处 — 周边活动指南',
    meta_description:
      '住在The Okura Prestige Bangkok？周边活动这样挑：LENGOLF室内高尔夫（600米）、Ploenchit购物、Lumpini Park与高级餐饮。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'zh',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'The Okura Prestige Bangkok',
      hotel_neighbourhood: 'Wireless Road / Ploenchit',
      hotel_distance_m: 600,
      walking_time_mins: 9,
      walking_directions:
        '从The Okura Prestige出来，走到Ploenchit Road上。出酒店后向西（右转），沿Ploenchit Road经过BTS Ploenchit站继续走，大约7分钟。The Mercury Ville在你左手边的BTS Chidlom站旁。LENGOLF在4楼。天气热的话，也可以从BTS Ploenchit站搭一站到Chidlom站，会更快。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Yamazato (Okura)', cuisine: '日式高级料理', distance_m: 0 },
        { name: 'Elements (Okura)', cuisine: '法日料理', distance_m: 0 },
        { name: 'Karmakamet Diner', cuisine: '泰式融合料理', distance_m: 300 },
        { name: 'Sushi Masato', cuisine: '日式无菜单料理', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Ploenchit BTS', type: 'transport', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 600 },
        { name: 'Central Embassy', type: 'shopping', distance_m: 200 },
        { name: 'Nai Lert Park Heritage Home', type: 'cultural', distance_m: 300 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=The+Okura+Prestige+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The Okura Prestige占据Ploenchit Road上最有分量的地址之一——这条路相当于曼谷的公园大道。酒店就建在BTS Ploenchit站上方，去城里任何地方都毫不费力。Okura是日本的老字号——东京本店接待过天皇与各国元首——曼谷这家也维持着同样严苛的标准。酒店的日餐厅Yamazato被认为是日本之外最正宗的日式高级料理之一，Elements则把法式技法与日式的精准糅合在一起。Ploenchit这一段聚集了曼谷最高端的购物场所：200米外的Central Embassy是一座向上生长的玻璃商场，里面有奢华影院和Open House共享空间，是这一带的首选去处。300米外的Nai Lert Park Heritage Home是一栋保存完好的1900年代初柚木宅邸，多数游客会错过，很适合安静地看一段历史。对Okura的日本客人来说——其中很多是高尔夫爱好者——LENGOLF很有吸引力：只有一站BTS的距离，不必花上半天跑去室外球场，也能练一场球或和朋友打一轮。酒店25楼的无边泳池和水疗俯瞰Royal Bangkok Sports Club，在全城也属顶尖。',
      suggested_itinerary: [
        { time: '07:00', activity: '在25楼的无边泳池游个早泳——俯瞰Royal Bangkok Sports Club的视野非常好' },
        { time: '08:30', activity: '在Yamazato吃一顿传统日式早餐——烤鲑鱼、味噌汤、玉子烧配米饭' },
        { time: '10:00', activity: '走到Central Embassy（200米）逛奢侈品，顺便上Open House的天台图书馆' },
        { time: '12:00', activity: '在Karmakamet Diner（300米）吃午饭——藏在香氛选物店里的泰式融合料理' },
        { time: '14:00', activity: '参观Nai Lert Park Heritage Home（300米）——修复过的柚木宅邸，花园很美' },
        { time: '15:30', activity: '搭BTS 1站到Chidlom，在LENGOLF打室内高尔夫（每小时约550泰铢，最多5人）' },
        { time: '18:00', activity: '回Okura的天台酒吧喝一杯，看全景天际线' },
        { time: '20:00', activity: '到Sushi Masato（500米）吃无菜单料理——曼谷顶尖的日式无菜单寿司之一' },
      ],
    },
  },
  {
    id: 'hotel-10',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-anantara-siam',
    title: 'Things to Do Near Anantara Siam Bangkok | Guest Activities',
    meta_description:
      'Staying at Anantara Siam Bangkok? Discover nearby activities — indoor golf at LENGOLF (1km), Siam Paragon, Erawan Shrine, rooftop dining, and more.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'en',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/weekend-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Anantara Siam Bangkok Hotel',
      hotel_neighbourhood: 'Ratchadamri / Ratchaprasong',
      hotel_distance_m: 800,
      walking_time_mins: 11,
      walking_directions:
        'Exit Anantara Siam onto Ratchadamri Road. Walk north to the Ratchaprasong intersection (Erawan Shrine). Turn right (east) onto Ploenchit Road and continue toward BTS Chidlom — about 6 minutes from the intersection. The Mercury Ville is on your right. LENGOLF is on Floor 4. Alternatively, take a short taxi (5 minutes, ~60 THB) or BTS from Ratchadamri to Chidlom (2 stops).',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Biscotti (Anantara Siam)', cuisine: 'Italian', distance_m: 0 },
        { name: 'Shintaro (Anantara Siam)', cuisine: 'Japanese', distance_m: 0 },
        { name: 'Red Sky (Centara Grand)', cuisine: 'Mediterranean / Rooftop', distance_m: 500 },
        { name: 'Nara Thai (Gaysorn)', cuisine: 'Thai', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 300 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 800 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 800 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 300 },
        { name: 'Bangkok Art and Culture Centre', type: 'cultural', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Anantara+Siam+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The Anantara Siam anchors the southern end of the Ratchaprasong shopping district, sitting on Ratchadamri Road across from the Royal Bangkok Sports Club — a sprawling green oasis in the middle of the city that serves as Bangkok\'s most exclusive private club. The view from the hotel\'s upper floors, looking out over the horse racing track and manicured polo fields, is one of the most distinctive in Bangkok. The hotel itself occupies a spacious, garden-like compound that feels remarkably serene given its central location. The Anantara Spa is one of Bangkok\'s most celebrated, offering traditional Thai treatments in private treatment suites surrounded by tropical gardens. For couples and honeymooners — a significant portion of the Anantara\'s guests — the area offers excellent date options: Siam Paragon (800m) has fine dining and an IMAX cinema, the Erawan Shrine (300m) provides a cultural touchpoint, and the Bangkok Art and Culture Centre (700m, free entry) rotates contemporary art exhibitions across multiple floors. LENGOLF adds an unexpected, playful element to a romantic trip — the cocktail-bar setting and private bays make it genuinely intimate. A taxi from the hotel takes just 5 minutes and costs around 60 THB.',
      suggested_itinerary: [
        { time: '9:00 AM', activity: 'Start with a couples Thai massage at Anantara Spa — book the Thai Heritage Suite for the full experience' },
        { time: '11:30 AM', activity: 'Late breakfast or brunch at Biscotti — their Italian eggs Benedict and fresh pastries are excellent' },
        { time: '1:00 PM', activity: 'Walk to Siam Paragon (800m) for shopping and the aquarium (SEA LIFE Bangkok Ocean World)' },
        { time: '3:00 PM', activity: 'Short taxi to LENGOLF for a fun couples golf session with cocktails (~550 THB/hour)' },
        { time: '5:30 PM', activity: 'Visit the Bangkok Art and Culture Centre (700m from hotel, free) — contemporary Thai art across 9 floors' },
        { time: '7:00 PM', activity: 'Pre-dinner cocktails at the Erawan Shrine area — the Four Faces Bar at the Grand Hyatt overlooks the shrine' },
        { time: '8:30 PM', activity: 'Dinner at Shintaro (Anantara Siam) — Japanese teppanyaki where the chef performs tableside' },
      ],
    },
  },

  // ─── TH: things-to-do-near-anantara-siam ───
  // Figures carried verbatim: 800 m / 11 min / 5 stars, Siam Paragon 800 เมตร,
  // BACC 700 เมตร ชั้น 9 เข้าฟรี, แท็กซี่ 5 นาที ประมาณ 60 บาท, BTS ราชดำริไปชิดลม 2 สถานี,
  // ประมาณ 550 บาท/ชั่วโมง (EN drops the 5-person clause on this page — not re-added).
  {
    id: 'hotel-10-th',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-anantara-siam',
    title: 'สิ่งที่น่าทำใกล้ Anantara Siam Bangkok | กิจกรรมสำหรับผู้เข้าพัก',
    meta_description:
      'พักที่ Anantara Siam Bangkok อยู่ใช่ไหม รวมกิจกรรมใกล้โรงแรม ทั้งกอล์ฟในร่มที่ LENGOLF (1 กม.) Siam Paragon ศาลพระพรหมเอราวัณ ร้านอาหารรูฟท็อป และอื่น ๆ',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'th',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/weekend-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Anantara Siam Bangkok Hotel',
      hotel_neighbourhood: 'ราชดำริ / ราชประสงค์',
      hotel_distance_m: 800,
      walking_time_mins: 11,
      walking_directions:
        'ออกจาก Anantara Siam มายังถนนราชดำริ (Ratchadamri Road) เดินขึ้นไปทางทิศเหนือจนถึงแยกราชประสงค์ (ศาลพระพรหมเอราวัณ) เลี้ยวขวา (ไปทางทิศตะวันออก) เข้าถนนเพลินจิต (Ploenchit Road) แล้วเดินต่อไปทาง BTS ชิดลม ราว 6 นาทีจากแยก The Mercury Ville จะอยู่ทางขวามือ LENGOLF อยู่ชั้น 4 อีกทางเลือกคือนั่งแท็กซี่ระยะสั้น (5 นาที ประมาณ 60 บาท) หรือนั่ง BTS จากราชดำริไปชิดลม (2 สถานี)',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Biscotti (Anantara Siam)', cuisine: 'อาหารอิตาเลียน', distance_m: 0 },
        { name: 'Shintaro (Anantara Siam)', cuisine: 'อาหารญี่ปุ่น', distance_m: 0 },
        { name: 'Red Sky (Centara Grand)', cuisine: 'เมดิเตอร์เรเนียน / รูฟท็อป', distance_m: 500 },
        { name: 'Nara Thai (Gaysorn)', cuisine: 'อาหารไทย', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 300 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 800 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 800 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 300 },
        { name: 'Bangkok Art and Culture Centre', type: 'cultural', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Anantara+Siam+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Anantara Siam เป็นหมุดหมายทางใต้สุดของย่านช้อปปิ้งราชประสงค์ ตั้งอยู่บนถนนราชดำริ ตรงข้ามราชกรีฑาสโมสร พื้นที่สีเขียวกว้างใหญ่กลางเมืองที่เป็นสโมสรส่วนตัวซึ่งเข้าถึงยากที่สุดของกรุงเทพฯ วิวจากห้องพักชั้นบนของโรงแรมที่มองลงไปเห็นสนามแข่งม้าและสนามโปโลที่ตัดแต่งเรียบร้อย จึงเป็นวิวที่มีเอกลักษณ์ที่สุดวิวหนึ่งในกรุงเทพฯ ตัวโรงแรมเองอยู่ในพื้นที่กว้างคล้ายสวน ให้ความรู้สึกสงบอย่างน่าประหลาดใจเมื่อเทียบกับทำเลใจกลางเมือง Anantara Spa เป็นหนึ่งในสปาที่ได้รับการกล่าวถึงมากที่สุดของกรุงเทพฯ ให้บริการทรีตเมนต์ไทยดั้งเดิมในห้องส่วนตัวที่ล้อมรอบด้วยสวนเขตร้อน สำหรับคู่รักและคู่ฮันนีมูน ซึ่งเป็นสัดส่วนสำคัญของผู้เข้าพัก Anantara ย่านนี้มีตัวเลือกสำหรับเดตที่ดีมาก ทั้ง Siam Paragon (800 เมตร) ที่มีร้านอาหารไฟน์ไดนิ่งและโรงภาพยนตร์ IMAX ศาลพระพรหมเอราวัณ (300 เมตร) ที่ให้จุดสัมผัสทางวัฒนธรรม และหอศิลปวัฒนธรรมแห่งกรุงเทพมหานคร (Bangkok Art and Culture Centre, 700 เมตร เข้าฟรี) ที่หมุนเวียนนิทรรศการศิลปะร่วมสมัยหลายชั้น LENGOLF เพิ่มความสนุกที่คาดไม่ถึงให้ทริปโรแมนติก เพราะบรรยากาศแบบบาร์ค็อกเทลและเบย์ส่วนตัวทำให้รู้สึกเป็นส่วนตัวจริง ๆ แท็กซี่จากโรงแรมใช้เวลาเพียง 5 นาที ค่าโดยสารประมาณ 60 บาท',
      suggested_itinerary: [
        { time: '09:00 น.', activity: 'เริ่มด้วยนวดไทยสำหรับคู่รักที่ Anantara Spa จอง Thai Heritage Suite เพื่อรับประสบการณ์เต็มรูปแบบ' },
        { time: '11:30 น.', activity: 'อาหารเช้ามื้อสายหรือบรันช์ที่ Biscotti ทั้งเอ้กเบเนดิกต์สไตล์อิตาเลียนและขนมอบสดใหม่ทำได้ดีมาก' },
        { time: '13:00 น.', activity: 'เดินไป Siam Paragon (800 เมตร) เพื่อช้อปปิ้งและชมพิพิธภัณฑ์สัตว์น้ำ SEA LIFE Bangkok Ocean World' },
        { time: '15:00 น.', activity: 'นั่งแท็กซี่ระยะสั้นไป LENGOLF เพื่อเล่นกอล์ฟคู่กันพร้อมค็อกเทล (ประมาณ 550 บาท/ชั่วโมง)' },
        { time: '17:30 น.', activity: 'ชมหอศิลปวัฒนธรรมแห่งกรุงเทพมหานคร (700 เมตรจากโรงแรม เข้าฟรี) ศิลปะไทยร่วมสมัยกระจายอยู่ 9 ชั้น' },
        { time: '19:00 น.', activity: 'ค็อกเทลก่อนมื้อค่ำแถวศาลพระพรหมเอราวัณ ที่ Four Faces Bar ของ Grand Hyatt ซึ่งมองลงไปเห็นตัวศาล' },
        { time: '20:30 น.', activity: 'มื้อค่ำที่ Shintaro (Anantara Siam) เทปปันยากิญี่ปุ่นที่เชฟทำโชว์ตรงหน้าโต๊ะ' },
      ],
    },
  },

  // ─── JA: things-to-do-near-anantara-siam ───
  // Figures: 800m / 11分 / 交差点から約6分 / タクシー5分・約60THB / ラチャダムリ駅から
  // 2駅 / 300m / 700m（入場無料）/ 9フロア / 約550THB。「Sports Club を見下ろす」は
  // EN の上層階の眺めの記述に対応。EN の「2 stops」はシーロム線・スクンビット線の
  // 乗り換えを含む点を報告に記載（本文は EN のまま）。
  {
    id: 'hotel-10-ja',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-anantara-siam',
    title: 'アナンタラ・サイアム・バンコク周辺の過ごし方 — 宿泊者向けアクティビティ',
    meta_description:
      'アナンタラ・サイアム・バンコク（Anantara Siam Bangkok）周辺の過ごし方。1km先のLENGOLFでインドアゴルフ、サイアムパラゴン、エラワン廟、ルーフトップでの食事まで。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ja',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/weekend-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Anantara Siam Bangkok Hotel',
      hotel_neighbourhood: 'Ratchadamri / Ratchaprasong',
      hotel_distance_m: 800,
      walking_time_mins: 11,
      walking_directions:
        'Anantara Siamを出て、ラチャダムリ通り（Ratchadamri Road）へ。北へ進み、ラチャプラソン交差点（エラワン廟）まで歩きます。交差点で右（東）に曲がってプルンチット通り（Ploenchit Road）に入り、BTSチットロム駅の方向へ。交差点からおよそ6分です。右手にザ・マーキュリービルがあります。LENGOLFは4階です。タクシーなら5分ほどで約60THB、BTSを使う場合はラチャダムリ駅からチットロム駅まで2駅です。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Biscotti (Anantara Siam)', cuisine: 'イタリア料理', distance_m: 0 },
        { name: 'Shintaro (Anantara Siam)', cuisine: '日本料理', distance_m: 0 },
        { name: 'Red Sky (Centara Grand)', cuisine: '地中海料理／ルーフトップ', distance_m: 500 },
        { name: 'Nara Thai (Gaysorn)', cuisine: 'タイ料理', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 300 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 800 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 800 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 300 },
        { name: 'Bangkok Art and Culture Centre', type: 'cultural', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Anantara+Siam+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Anantara Siamは、ラチャプラソンのショッピング地区の南端を締めくくる位置にあり、ラチャダムリ通りをはさんでロイヤル・バンコク・スポーツクラブと向かい合っています。都心のただ中に広がるこの緑地は、バンコクでもっとも格式のある会員制クラブです。上層階から競馬場と手入れの行き届いたポロ場を見渡す眺めは、この街でも他にないもの。ホテル自体もゆったりとした庭園のような敷地を占めており、中心部とは思えない静けさがあります。Anantara Spaはバンコクでも名高いスパのひとつで、熱帯の庭に囲まれた個室で伝統的なタイ式の施術を受けられます。宿泊客に多いカップルや新婚旅行の方には、周辺のデートの選択肢が充実しています。800m先のサイアムパラゴンには高級レストランとIMAXシアターがあり、300mのエラワン廟は文化的な立ち寄り先に。700mのバンコク芸術文化センター（入場無料）では、複数のフロアで現代アートの企画展が入れ替わります。LENGOLFは、ロマンチックな旅程に少し意外な遊びの要素を足してくれます。カクテルバーのような設えと個室のベイで、思いのほか二人の時間になるはずです。ホテルからはタクシーで5分ほど、料金は約60THBです。',
      suggested_itinerary: [
        { time: '9:00', activity: 'Anantara Spaでカップル向けのタイ古式マッサージから。フルに味わうならThai Heritage Suiteを' },
        { time: '11:30', activity: 'Biscottiで遅めの朝食かブランチを。イタリア風エッグベネディクトと焼きたてのペストリーが評判です' },
        { time: '13:00', activity: 'サイアムパラゴン（800m）まで歩いて買い物と、水族館SEA LIFE Bangkok Ocean Worldへ' },
        { time: '15:00', activity: 'タクシーですぐのLENGOLFへ。カクテル片手にカップルでゴルフを（1時間約550THB／2026年7月現在）' },
        { time: '17:30', activity: 'バンコク芸術文化センター（ホテルから700m、入場無料）へ。9フロアにわたってタイの現代アートが並びます' },
        { time: '19:00', activity: 'ディナー前のカクテルはエラワン廟の界隈で。Grand HyattのFour Faces Barからは廟が見下ろせます' },
        { time: '20:30', activity: 'Shintaro（Anantara Siam）でディナー。目の前で焼き上げる日本の鉄板焼きです' },
      ],
    },
  },

  // ─── KO: things-to-do-near-anantara-siam ───
  // Figures from EN hotel-10: 800m / 11분(교차로에서 약 6분), 4층, 택시 5분 약 60바트,
  // Ratchadamri역에서 칫롬역 두 정거장, Erawan Shrine 300m, Siam Paragon 800m,
  // BACC 700m 무료 9개 층, 약 550바트/시간. BACC 층수는 itinerary의 EN 표기.
  {
    id: 'hotel-10-ko',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-anantara-siam',
    title: 'Anantara Siam Bangkok 주변 즐길 거리 — 투숙객 액티비티 가이드',
    meta_description:
      'Anantara Siam Bangkok에 묵는다면 1km 거리의 LENGOLF 실내 골프부터 Siam Paragon, Erawan Shrine, 루프톱 다이닝까지 가까운 즐길 거리를 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ko',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/weekend-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Anantara Siam Bangkok Hotel',
      hotel_neighbourhood: 'Ratchadamri / Ratchaprasong',
      hotel_distance_m: 800,
      walking_time_mins: 11,
      walking_directions:
        'Anantara Siam에서 Ratchadamri Road 쪽으로 나옵니다. 북쪽으로 걸어 Ratchaprasong 교차로(Erawan Shrine)까지 갑니다. 오른쪽(동쪽)으로 꺾어 Ploenchit Road에 들어선 뒤 BTS 칫롬역 방향으로 계속 걸어요. 교차로에서 약 6분 거리예요. 오른편에 The Mercury Ville 건물이 있어요. LENGOLF는 4층에 있어요. 짧게 택시를 타면 5분에 약 60바트이고, BTS를 이용한다면 랏차담리역에서 칫롬역까지 두 정거장이에요.',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Biscotti (Anantara Siam)', cuisine: '이탈리아 요리', distance_m: 0 },
        { name: 'Shintaro (Anantara Siam)', cuisine: '일본 요리', distance_m: 0 },
        { name: 'Red Sky (Centara Grand)', cuisine: '지중해 요리 / 루프톱', distance_m: 500 },
        { name: 'Nara Thai (Gaysorn)', cuisine: '태국 요리', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 300 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 800 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 800 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 300 },
        { name: 'Bangkok Art and Culture Centre', type: 'cultural', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Anantara+Siam+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Anantara Siam 호텔은 Ratchaprasong 쇼핑 지구의 남쪽 끝을 지키고 있어요. Ratchadamri Road에 면해 있고, 길 건너에는 도심 한가운데 펼쳐진 녹지 Royal Bangkok Sports Club, 방콕에서 가장 배타적인 프라이빗 클럽이 있어요. 호텔 고층에서 경마 트랙과 손질된 폴로 필드를 내려다보는 전망은 방콕에서도 손꼽히게 독특해요. 호텔 자체도 정원 같은 넓은 부지를 써서, 도심 한복판인데도 놀랄 만큼 고요해요. Anantara Spa는 방콕에서 가장 인정받는 스파 중 하나로, 열대 정원에 둘러싸인 프라이빗 트리트먼트 룸에서 전통 태국식 관리를 받을 수 있어요. Anantara 손님 가운데 큰 비중을 차지하는 커플과 신혼여행객에게 이 일대는 데이트 선택지가 넉넉해요. Siam Paragon(800m)에는 파인다이닝과 IMAX 영화관이 있고, Erawan Shrine(300m)에서는 문화적인 접점을 만날 수 있으며, Bangkok Art and Culture Centre(700m, 무료 입장)에서는 여러 층에 걸쳐 현대미술 전시가 번갈아 열려요. LENGOLF는 로맨틱한 여행에 예상 밖의 유쾌한 요소를 더해요. 칵테일 바 같은 분위기와 프라이빗 베이 덕분에 실제로 둘만의 시간이 돼요. 호텔에서 택시로 5분, 요금은 약 60바트예요.',
      suggested_itinerary: [
        { time: '09:00', activity: 'Anantara Spa에서 커플 타이 마사지로 시작 — 제대로 즐기려면 Thai Heritage Suite를 예약해 보세요' },
        { time: '11:30', activity: 'Biscotti에서 늦은 아침이나 브런치 — 이탈리아식 에그 베네딕트와 갓 구운 페이스트리가 좋아요' },
        { time: '13:00', activity: 'Siam Paragon까지 걸어가(800m) 쇼핑과 아쿠아리움(SEA LIFE Bangkok Ocean World) 관람' },
        { time: '15:00', activity: '택시로 잠깐 이동해 LENGOLF에서 칵테일과 함께 커플 골프 세션 (시간당 약 550바트, 2026년 7월 기준)' },
        { time: '17:30', activity: 'Bangkok Art and Culture Centre 방문(호텔에서 700m, 무료) — 9개 층에 걸친 태국 현대미술' },
        { time: '19:00', activity: 'Erawan Shrine 주변에서 저녁 전 칵테일 — Grand Hyatt의 Four Faces Bar에서 사원이 내려다보여요' },
        { time: '20:30', activity: 'Shintaro(Anantara Siam)에서 저녁 — 셰프가 눈앞에서 선보이는 일본식 뎃판야키' },
      ],
    },
  },

  // ─── ZH: things-to-do-near-anantara-siam ───
  // Figures carried from EN: 800m / 11分钟 / 5星, Erawan 300m, Gaysorn 300m,
  // Siam Paragon 800m, BACC 700m 免费 9层, 打车5分钟约60泰铢, BTS Ratchadamri→Chidlom 2站,
  // ~550泰铢/小时. Siam Paragon glossed once as 暹罗百丽宫, Erawan once as 四面佛.
  {
    id: 'hotel-10-zh',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-anantara-siam',
    title: 'Anantara Siam Bangkok附近好去处 — 住客活动指南',
    meta_description:
      '住在Anantara Siam Bangkok？周边活动这样挑：LENGOLF室内高尔夫（1公里）、暹罗百丽宫、四面佛与天台餐饮。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'zh',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/weekend-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Anantara Siam Bangkok Hotel',
      hotel_neighbourhood: 'Ratchadamri / Ratchaprasong',
      hotel_distance_m: 800,
      walking_time_mins: 11,
      walking_directions:
        '从Anantara Siam出来，走到Ratchadamri Road上。向北走到Ratchaprasong路口（Erawan Shrine所在的位置）。右转（向东）进入Ploenchit Road，继续朝BTS Chidlom站走——从路口过去大约6分钟。The Mercury Ville在你右手边。LENGOLF在4楼。也可以打车（5分钟，约60泰铢），或从Ratchadamri站搭BTS到Chidlom站（2站）。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Biscotti (Anantara Siam)', cuisine: '意大利菜', distance_m: 0 },
        { name: 'Shintaro (Anantara Siam)', cuisine: '日本料理', distance_m: 0 },
        { name: 'Red Sky (Centara Grand)', cuisine: '地中海菜、天台', distance_m: 500 },
        { name: 'Nara Thai (Gaysorn)', cuisine: '泰餐', distance_m: 500 },
      ],
      nearby_activities: [
        { name: 'Erawan Shrine', type: 'cultural', distance_m: 300 },
        { name: 'Siam Paragon', type: 'shopping', distance_m: 800 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 800 },
        { name: 'Gaysorn Village', type: 'shopping', distance_m: 300 },
        { name: 'Bangkok Art and Culture Centre', type: 'cultural', distance_m: 700 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Anantara+Siam+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Anantara Siam坐镇Ratchaprasong购物区的南端，位于Ratchadamri Road上，正对Royal Bangkok Sports Club——那是市中心一片开阔的绿洲，也是曼谷最私密的会员制俱乐部。从酒店高层望出去，赛马跑道和修剪整齐的马球场连成一片，是曼谷最特别的窗景之一。酒店本身占据一片花园般宽阔的院落，位置这么中心，却意外地安静。Anantara Spa是曼谷最受推崇的水疗之一，在热带花园环绕的独立疗程套房里提供传统泰式疗程。对情侣和度蜜月的客人来说——他们在Anantara的住客中占了不小比例——这一带的约会选择很丰富：Siam Paragon（暹罗百丽宫，800米）有高级餐厅和IMAX影院，Erawan Shrine（四面佛，300米）提供一个文化落点，Bangkok Art and Culture Centre（700米，免费入场）则在多个楼层轮换当代艺术展。LENGOLF会给一趟浪漫的旅程加上一点意外的玩心——鸡尾酒吧式的氛围和独立球位，让两个人待着相当自在。从酒店打车只要5分钟，车费约60泰铢。',
      suggested_itinerary: [
        { time: '09:00', activity: '先到Anantara Spa做一次双人泰式按摩——想完整体验就订Thai Heritage Suite' },
        { time: '11:30', activity: '在Biscotti吃迟一点的早餐或早午餐——意式班尼迪克蛋和现烤面包很出色' },
        { time: '13:00', activity: '步行到Siam Paragon（800米）购物，顺便看水族馆（SEA LIFE Bangkok Ocean World）' },
        { time: '15:00', activity: '打车去LENGOLF，两个人打一场球配鸡尾酒（每小时约550泰铢）' },
        { time: '17:30', activity: '参观Bangkok Art and Culture Centre（距酒店700米，免费）——9层楼的泰国当代艺术' },
        { time: '19:00', activity: '到Erawan Shrine一带喝餐前酒——Grand Hyatt的Four Faces Bar正对神龛' },
        { time: '20:30', activity: '在Shintaro（Anantara Siam）吃晚餐——日式铁板烧，厨师就在桌边表演' },
      ],
    },
  },
  {
    id: 'hotel-11',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-mercure-siam',
    title: 'Things to Do Near Mercure Bangkok Siam | Activities & Food Guide',
    meta_description:
      'Staying at Mercure Bangkok Siam? Discover nearby activities — indoor golf at LENGOLF (1km by BTS), Siam Square shopping, street food, and entertainment.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'en',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/family-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Mercure Bangkok Siam',
      hotel_neighbourhood: 'Siam / CentralWorld',
      hotel_distance_m: 2100,
      walking_time_mins: 30,
      walking_directions:
        'Walking is 2.1km and around 30 minutes — not ideal in Bangkok\'s heat. We recommend the BTS or a cab instead. Walk to BTS Siam station (3-minute walk), take the BTS one stop eastbound to BTS Chidlom, and walk directly into The Mercury Ville. Total door-to-door by BTS: about 10 minutes. A taxi or Grab takes around 8 minutes and costs ~80 THB. LENGOLF is on Floor 4.',
      hotel_star_rating: 3,
      nearby_restaurants: [
        { name: 'Siam Square Street Food', cuisine: 'Thai Street Food', distance_m: 100 },
        { name: 'MBK Food Island', cuisine: 'Thai / International', distance_m: 200 },
        { name: 'Som Tam Nua (Siam Square)', cuisine: 'Thai (Isaan)', distance_m: 150 },
        { name: 'After You Dessert Café', cuisine: 'Desserts', distance_m: 200 },
      ],
      nearby_activities: [
        { name: 'Siam Paragon', type: 'shopping', distance_m: 200 },
        { name: 'SEA LIFE Bangkok Ocean World', type: 'attraction', distance_m: 250 },
        { name: 'MBK Center', type: 'shopping', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 2100 },
        { name: 'Bangkok Art and Culture Centre', type: 'cultural', distance_m: 300 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Mercure+Bangkok+Siam+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The Mercure sits in the beating heart of Siam — Bangkok\'s youth and shopping epicenter. Siam Square, right outside the hotel, is a grid of narrow sois packed with independent Thai fashion boutiques, street food stalls, bubble tea shops, and trendy cafés that cater to students from nearby Chulalongkorn University. This is where Bangkok\'s trends start. The area has three distinct vibes: Siam Paragon (200m) for luxury brands and the incredible SEA LIFE Bangkok aquarium in the basement; MBK Center (200m) for budget shopping, phone accessories, and a massive food court; and Siam Square itself for authentic Thai street culture. For families, the area is unbeatable — KidZania (in Siam Paragon) lets kids role-play adult jobs, SEA LIFE has sharks and penguins, and the food options span from 40 THB street noodles to international chains. Som Tam Nua, a legendary Isaan (northeastern Thai) restaurant on Siam Square Soi 5, always has a queue — but the green papaya salad and crispy pork are worth the 20-minute wait. The Bangkok Art and Culture Centre (BACC), a 300m walk at the National Stadium BTS intersection, is free and rotates excellent contemporary Thai art. LENGOLF is just one BTS stop away at Chidlom — a quick 8-minute door-to-door journey that makes it an easy family afternoon activity.',
      suggested_itinerary: [
        { time: '9:00 AM', activity: 'Breakfast at the hotel, then walk to Siam Paragon (200m) when it opens at 10 AM' },
        { time: '10:30 AM', activity: 'SEA LIFE Bangkok Ocean World (Siam Paragon basement) — kids love the shark tunnel and touch pool' },
        { time: '12:30 PM', activity: 'Lunch at Som Tam Nua (Siam Square Soi 5) — arrive before noon to beat the queue' },
        { time: '2:00 PM', activity: 'Explore Siam Square\'s indie shops and street food stalls — try the Thai milk tea and toast' },
        { time: '3:30 PM', activity: 'Take BTS 1 stop to Chidlom for indoor golf at LENGOLF — family-friendly, kids love the simulators' },
        { time: '5:30 PM', activity: 'Walk to BACC (300m from hotel, free) for contemporary art exhibitions' },
        { time: '6:30 PM', activity: 'After You Dessert Café (Siam Square) for their famous Shibuya honey toast' },
        { time: '8:00 PM', activity: 'Dinner at MBK Food Island (200m) — budget-friendly with dozens of Thai dishes under 100 THB' },
      ],
    },
  },

  // ─── TH: things-to-do-near-mercure-siam ───
  // Figures carried verbatim: 2,100 m / 30 min / 3 stars, 2.1 กม., BTS door-to-door
  // ราว 10 นาที (walking_directions) vs 8 นาที (area_guide) — both carried as EN has them,
  // แท็กซี่ราว 8 นาที ประมาณ 80 บาท, ก๋วยเตี๋ยว 40 บาท, MBK ต่ำกว่า 100 บาท, คิว 20 นาที.
  {
    id: 'hotel-11-th',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-mercure-siam',
    title: 'สิ่งที่น่าทำใกล้ Mercure Bangkok Siam | ไกด์กิจกรรมและร้านอาหาร',
    meta_description:
      'พักที่ Mercure Bangkok Siam อยู่ใช่ไหม รวมกิจกรรมใกล้โรงแรม ทั้งกอล์ฟในร่มที่ LENGOLF (1 กม. โดย BTS) ช้อปปิ้งสยามสแควร์ สตรีทฟู้ด และความบันเทิง',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'th',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/family-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Mercure Bangkok Siam',
      hotel_neighbourhood: 'สยาม / CentralWorld',
      hotel_distance_m: 2100,
      walking_time_mins: 30,
      walking_directions:
        'ถ้าเดินคือ 2.1 กม. ใช้เวลาราว 30 นาที ซึ่งไม่เหมาะกับอากาศร้อนของกรุงเทพฯ เราแนะนำให้ใช้ BTS หรือแท็กซี่แทน เดินไปสถานี BTS สยาม (3 นาที) นั่ง BTS ไปทางทิศตะวันออก 1 สถานีลงที่ BTS ชิดลม แล้วเดินเข้า The Mercury Ville ได้โดยตรง รวมเวลาจากประตูถึงประตูโดย BTS ราว 10 นาที ส่วนแท็กซี่หรือ Grab ใช้เวลาราว 8 นาที ค่าโดยสารประมาณ 80 บาท LENGOLF อยู่ชั้น 4',
      hotel_star_rating: 3,
      nearby_restaurants: [
        { name: 'Siam Square Street Food', cuisine: 'สตรีทฟู้ดไทย', distance_m: 100 },
        { name: 'MBK Food Island', cuisine: 'อาหารไทย / นานาชาติ', distance_m: 200 },
        { name: 'Som Tam Nua (Siam Square)', cuisine: 'อาหารไทย (อีสาน)', distance_m: 150 },
        { name: 'After You Dessert Café', cuisine: 'ของหวาน', distance_m: 200 },
      ],
      nearby_activities: [
        { name: 'Siam Paragon', type: 'shopping', distance_m: 200 },
        { name: 'SEA LIFE Bangkok Ocean World', type: 'attraction', distance_m: 250 },
        { name: 'MBK Center', type: 'shopping', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 2100 },
        { name: 'Bangkok Art and Culture Centre', type: 'cultural', distance_m: 300 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Mercure+Bangkok+Siam+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Mercure ตั้งอยู่ใจกลางย่านสยาม ศูนย์กลางของวัยรุ่นและการช้อปปิ้งของกรุงเทพฯ สยามสแควร์ที่อยู่หน้าโรงแรมพอดีเป็นตารางซอยเล็ก ๆ ที่อัดแน่นด้วยร้านเสื้อผ้าแบรนด์ไทยอิสระ แผงสตรีทฟู้ด ร้านชานมไข่มุก และคาเฟ่ทันสมัยที่รองรับนักศึกษาจากจุฬาลงกรณ์มหาวิทยาลัยที่อยู่ใกล้ ๆ ที่นี่คือจุดเริ่มต้นของเทรนด์ในกรุงเทพฯ ย่านนี้มีสามบุคลิกที่ชัดเจน คือ Siam Paragon (200 เมตร) สำหรับแบรนด์หรูและพิพิธภัณฑ์สัตว์น้ำ SEA LIFE Bangkok ที่ชั้นใต้ดิน MBK Center (200 เมตร) สำหรับช้อปปิ้งราคาประหยัด อุปกรณ์มือถือ และศูนย์อาหารขนาดใหญ่ และตัวสยามสแควร์เองสำหรับวัฒนธรรมริมถนนแบบไทยแท้ สำหรับครอบครัว ย่านนี้แทบไม่มีคู่แข่ง เพราะ KidZania (ใน Siam Paragon) ให้เด็กได้ลองสวมบทบาทอาชีพผู้ใหญ่ SEA LIFE มีทั้งฉลามและเพนกวิน และตัวเลือกอาหารก็มีตั้งแต่ก๋วยเตี๋ยวริมทาง 40 บาท ไปจนถึงเชนร้านอาหารระดับสากล Som Tam Nua ร้านอาหารอีสานในตำนานที่สยามสแควร์ ซอย 5 มีคิวตลอด แต่ส้มตำและหมูกรอบก็คุ้มกับการรอราว 20 นาที ส่วนหอศิลปวัฒนธรรมแห่งกรุงเทพมหานคร (BACC) ซึ่งอยู่ห่าง 300 เมตร ตรงแยกสถานี BTS สนามกีฬาแห่งชาติ เข้าฟรีและหมุนเวียนงานศิลปะไทยร่วมสมัยที่ดีมาก LENGOLF อยู่ห่างออกไปเพียง BTS สถานีเดียวที่ชิดลม เดินทางจากประตูถึงประตูราว 8 นาที จึงเป็นกิจกรรมช่วงบ่ายสำหรับครอบครัวที่จัดได้ง่าย',
      suggested_itinerary: [
        { time: '09:00 น.', activity: 'อาหารเช้าที่โรงแรม แล้วเดินไป Siam Paragon (200 เมตร) ตอนเปิด 10:00 น.' },
        { time: '10:30 น.', activity: 'SEA LIFE Bangkok Ocean World (ชั้นใต้ดินของ Siam Paragon) เด็ก ๆ ชอบอุโมงค์ฉลามและบ่อสัมผัส' },
        { time: '12:30 น.', activity: 'มื้อกลางวันที่ Som Tam Nua (สยามสแควร์ ซอย 5) ควรไปก่อนเที่ยงเพื่อเลี่ยงคิว' },
        { time: '14:00 น.', activity: 'เดินสำรวจร้านอินดี้และแผงสตรีทฟู้ดในสยามสแควร์ ลองชานมไทยกับขนมปังปิ้ง' },
        { time: '15:30 น.', activity: 'นั่ง BTS 1 สถานีไปชิดลมเพื่อเล่นกอล์ฟในร่มที่ LENGOLF เหมาะกับครอบครัว เด็ก ๆ ชอบซิมูเลเตอร์' },
        { time: '17:30 น.', activity: 'เดินไป BACC (300 เมตรจากโรงแรม เข้าฟรี) เพื่อชมนิทรรศการศิลปะร่วมสมัย' },
        { time: '18:30 น.', activity: 'After You Dessert Café (สยามสแควร์) กับชิบูย่าฮันนีโทสต์ชื่อดัง' },
        { time: '20:00 น.', activity: 'มื้อเย็นที่ MBK Food Island (200 เมตร) ราคาย่อมเยา มีอาหารไทยหลายสิบเมนูในราคาต่ำกว่า 100 บาท' },
      ],
    },
  },

  // ─── JA: things-to-do-near-mercure-siam ───
  // No LENGOLF price in rendered copy, so the as-of marker sits on the taxi fare in
  // walking_directions (which renders) rather than in meta_description.
  // EN's two door-to-door figures (約10分 in directions, 8分 in area_guide) are both
  // carried in their own field and reported. Figures: 2.1km / 30分 / 徒歩3分 /
  // 東方向に1駅 / 約80THB / 200m / 250m / 300m / 40THB / 100THB以下 / 20分待ち.
  {
    id: 'hotel-11-ja',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-mercure-siam',
    title: 'メルキュール・バンコク・サイアム周辺の過ごし方 — アクティビティとグルメ',
    meta_description:
      'メルキュール・バンコク・サイアム（Mercure Bangkok Siam）周辺の過ごし方。BTSで1駅（1km）のLENGOLFでインドアゴルフ、サイアムスクエアでの買い物、屋台グルメ、娯楽施設をご紹介します。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ja',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/family-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Mercure Bangkok Siam',
      hotel_neighbourhood: 'Siam / CentralWorld',
      hotel_distance_m: 2100,
      walking_time_mins: 30,
      walking_directions:
        '徒歩では2.1km、およそ30分かかります。バンコクの暑さを考えると現実的ではないので、BTSかタクシーをおすすめします。徒歩3分のBTSサイアム駅へ向かい、BTSで東方向に1駅、BTSチットロム駅で降りるとザ・マーキュリービルへそのまま入れます。BTS利用ならドアツードアでおよそ10分。タクシーやGrabなら8分ほどで、料金は約80THB（2026年7月現在）です。LENGOLFは4階です。',
      hotel_star_rating: 3,
      nearby_restaurants: [
        { name: 'Siam Square Street Food', cuisine: 'タイの屋台料理', distance_m: 100 },
        { name: 'MBK Food Island', cuisine: 'タイ料理／インターナショナル', distance_m: 200 },
        { name: 'Som Tam Nua (Siam Square)', cuisine: 'タイ料理（イサーン）', distance_m: 150 },
        { name: 'After You Dessert Café', cuisine: 'デザート', distance_m: 200 },
      ],
      nearby_activities: [
        { name: 'Siam Paragon', type: 'shopping', distance_m: 200 },
        { name: 'SEA LIFE Bangkok Ocean World', type: 'attraction', distance_m: 250 },
        { name: 'MBK Center', type: 'shopping', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 2100 },
        { name: 'Bangkok Art and Culture Centre', type: 'cultural', distance_m: 300 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Mercure+Bangkok+Siam+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Mercureが建つのは、バンコクの若者文化と買い物の中心地サイアムのど真ん中です。ホテルのすぐ外に広がるサイアムスクエアは、細い路地が碁盤の目のように走り、タイのインディーズブランドのブティック、屋台、タピオカドリンクの店、そして近くのチュラロンコン大学の学生が集まる今どきのカフェで埋まっています。バンコクの流行はここから始まります。この一帯には三つの顔があります。高級ブランドと、地下の水族館SEA LIFE Bangkok Ocean Worldを擁する200m先のサイアムパラゴン。格安の買い物とスマホ用品、巨大なフードコートが揃う200m先のMBKセンター。そしてタイの路上文化がそのまま残るサイアムスクエア。家族連れにとってはこれ以上ない環境で、サイアムパラゴン内のキッザニアでは子どもが大人の仕事を体験でき、SEA LIFEにはサメやペンギンがいます。食事も40THBの屋台の麺から海外チェーンまで幅広く選べます。サイアムスクエア・ソイ5にあるイサーン料理の名店Som Tam Nuaはいつも行列ですが、青パパイヤのサラダとカリカリの豚肉は20分待つ価値があります。BTSナショナルスタジアム駅の交差点にある徒歩300mのバンコク芸術文化センター（BACC）は入場無料で、質の高いタイの現代アートの企画展が入れ替わります。LENGOLFはBTSでチットロム駅まで1駅。ドアツードアで8分ほどという近さは、家族の午後のお出かけ先として使いやすいはずです。',
      suggested_itinerary: [
        { time: '9:00', activity: 'ホテルで朝食をとり、10:00の開店に合わせてサイアムパラゴン（200m）へ' },
        { time: '10:30', activity: 'SEA LIFE Bangkok Ocean World（サイアムパラゴン地下）へ。サメのトンネルとタッチプールは子どもに人気です' },
        { time: '12:30', activity: 'Som Tam Nua（サイアムスクエア・ソイ5）でランチ。行列を避けるなら正午前に' },
        { time: '14:00', activity: 'サイアムスクエアのインディーズショップと屋台を散策。タイミルクティーとトーストをぜひ' },
        { time: '15:30', activity: 'BTSで1駅、チットロム駅のLENGOLFでインドアゴルフを。家族向けで、子どももシミュレーターに夢中になります' },
        { time: '17:30', activity: 'BACC（ホテルから300m、入場無料）まで歩いて現代アートの企画展を' },
        { time: '18:30', activity: 'After You Dessert Café（サイアムスクエア）で名物のハニートーストを' },
        { time: '20:00', activity: 'MBK Food Island（200m）でディナー。100THB以下のタイ料理が何十種類も並びます' },
      ],
    },
  },

  // ─── KO: things-to-do-near-mercure-siam ───
  // Figures from EN hotel-11: 2.1km / 30분, BTS 시암역 도보 3분, 동쪽 한 정거장,
  // 문 앞에서 문 앞까지 약 10분, 택시 약 8분·약 80바트, 4층, Siam Paragon 200m,
  // MBK 200m, Som Tam Nua Soi 5(20분 대기), 길거리 국수 40바트, MBK 100바트 이하,
  // BACC 300m 무료, area_guide의 "8분". EN에 LENGOLF 가격이 없어 넣지 않았어요.
  {
    id: 'hotel-11-ko',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-mercure-siam',
    title: 'Mercure Bangkok Siam 주변 즐길 거리 — 액티비티와 먹거리 가이드',
    meta_description:
      'Mercure Bangkok Siam에 묵는다면 BTS로 1km 거리의 LENGOLF 실내 골프부터 Siam Square 쇼핑, 길거리 음식, 가족 나들이까지 가까운 즐길 거리를 정리했어요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ko',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/family-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Mercure Bangkok Siam',
      hotel_neighbourhood: 'Siam / CentralWorld',
      hotel_distance_m: 2100,
      walking_time_mins: 30,
      walking_directions:
        '도보로는 2.1km, 약 30분이라 방콕의 더위에는 권하기 어려워요. BTS나 택시를 추천해요. 3분 걸어 BTS 시암역으로 간 뒤, BTS를 타고 동쪽으로 한 정거장 이동해 BTS 칫롬역에서 내리면 The Mercury Ville 건물로 바로 들어갈 수 있어요. BTS를 이용하면 문 앞에서 문 앞까지 약 10분이 걸려요. 택시나 Grab 앱을 이용하면 약 8분, 요금은 약 80바트예요. LENGOLF는 4층에 있어요.',
      hotel_star_rating: 3,
      nearby_restaurants: [
        { name: 'Siam Square Street Food', cuisine: '태국 길거리 음식', distance_m: 100 },
        { name: 'MBK Food Island', cuisine: '태국 요리 / 인터내셔널', distance_m: 200 },
        { name: 'Som Tam Nua (Siam Square)', cuisine: '태국 이싼 요리', distance_m: 150 },
        { name: 'After You Dessert Café', cuisine: '디저트', distance_m: 200 },
      ],
      nearby_activities: [
        { name: 'Siam Paragon', type: 'shopping', distance_m: 200 },
        { name: 'SEA LIFE Bangkok Ocean World', type: 'attraction', distance_m: 250 },
        { name: 'MBK Center', type: 'shopping', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 2100 },
        { name: 'Bangkok Art and Culture Centre', type: 'cultural', distance_m: 300 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Mercure+Bangkok+Siam+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Mercure 호텔은 방콕 청춘 문화와 쇼핑의 진원지인 Siam 한복판에 있어요. 호텔 바로 앞 Siam Square 일대는 좁은 소이가 격자로 얽혀 있고, 태국 인디 패션 부티크와 길거리 음식 노점, 버블티 가게, 근처 Chulalongkorn University 학생들이 찾는 감각적인 카페가 빼곡해요. 방콕의 유행이 시작되는 곳이에요. 이 동네에는 뚜렷하게 다른 세 가지 얼굴이 있어요. 럭셔리 브랜드와 지하의 훌륭한 SEA LIFE Bangkok 아쿠아리움을 품은 Siam Paragon(200m), 저렴한 쇼핑과 휴대폰 액세서리, 거대한 푸드코트가 있는 MBK Center(200m), 그리고 태국 길거리 문화 그대로인 Siam Square 자체예요. 가족 여행이라면 이만한 동네가 없어요. Siam Paragon 안 KidZania에서는 아이들이 어른 직업을 체험하고, SEA LIFE에는 상어와 펭귄이 있으며, 먹거리는 40바트짜리 길거리 국수부터 해외 체인까지 폭이 넓어요. Siam Square Soi 5의 전설적인 이싼(태국 북동부) 식당 Som Tam Nua 매장에는 늘 줄이 서 있지만, 그린 파파야 샐러드와 바삭한 돼지고기는 20분을 기다릴 만해요. BTS 내셔널 스타디움역 교차로 쪽으로 300m 걸으면 나오는 Bangkok Art and Culture Centre(BACC) 미술관은 입장이 무료이고, 훌륭한 태국 현대미술 전시가 번갈아 열려요. LENGOLF는 BTS로 한 정거장 거리인 칫롬역에 있어서, 문 앞에서 문 앞까지 8분이면 닿는 가족 오후 나들이 코스가 돼요.',
      suggested_itinerary: [
        { time: '09:00', activity: '호텔에서 아침을 먹고, 오전 10시 문 여는 시간에 맞춰 Siam Paragon까지 걸어가기(200m)' },
        { time: '10:30', activity: 'SEA LIFE Bangkok Ocean World(Siam Paragon 지하) — 상어 터널과 터치 풀을 아이들이 좋아해요' },
        { time: '12:30', activity: 'Som Tam Nua(Siam Square Soi 5)에서 점심 — 줄을 피하려면 정오 전에 도착하세요' },
        { time: '14:00', activity: 'Siam Square의 인디 숍과 길거리 음식 노점 구경 — 타이 밀크티와 토스트를 맛보세요' },
        { time: '15:30', activity: 'BTS로 한 정거장 이동해 칫롬역 LENGOLF에서 실내 골프 — 가족 단위로 좋고, 아이들이 시뮬레이터를 즐거워해요' },
        { time: '17:30', activity: 'BACC까지 걸어가(호텔에서 300m, 무료) 현대미술 전시 관람' },
        { time: '18:30', activity: 'After You Dessert Café(Siam Square)에서 유명한 시부야 허니 토스트' },
        { time: '20:00', activity: 'MBK Food Island(200m)에서 저녁 — 100바트 이하 태국 요리가 수십 가지예요' },
      ],
    },
  },

  // ─── ZH: things-to-do-near-mercure-siam ───
  // Figures carried from EN: 2,100m / 30分钟 / 3星, BTS Siam步行3分钟, 门到门约10分钟,
  // 打车约8分钟约80泰铢, Siam Paragon 200m, MBK 200m, BACC 300m, 40泰铢路边面,
  // 排队20分钟, 100泰铢以内, 上午10点开门. EN area_guide's own "8-minute door-to-door" kept.
  {
    id: 'hotel-11-zh',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-mercure-siam',
    title: 'Mercure Bangkok Siam附近好去处 — 周边活动与美食指南',
    meta_description:
      '住在Mercure Bangkok Siam？周边这样玩：搭BTS去LENGOLF打室内高尔夫（1公里）、逛Siam Square、吃路边小吃，还有各种娱乐。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'zh',
    related_slugs: ['/activities/indoor-activities-bangkok', '/activities/family-activities-bangkok', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Mercure Bangkok Siam',
      hotel_neighbourhood: 'Siam / CentralWorld',
      hotel_distance_m: 2100,
      walking_time_mins: 30,
      walking_directions:
        '走路是2.1公里、约30分钟——在曼谷的暑气里并不理想，我们更建议搭BTS或打车。先走到BTS Siam站（步行3分钟），搭BTS向东一站到BTS Chidlom站，再直接走进The Mercury Ville。搭BTS门到门总共约10分钟。打车或叫Grab约8分钟，车费约80泰铢。LENGOLF在4楼。',
      hotel_star_rating: 3,
      nearby_restaurants: [
        { name: 'Siam Square Street Food', cuisine: '泰式路边小吃', distance_m: 100 },
        { name: 'MBK Food Island', cuisine: '泰餐、国际料理', distance_m: 200 },
        { name: 'Som Tam Nua (Siam Square)', cuisine: '泰国伊善菜', distance_m: 150 },
        { name: 'After You Dessert Café', cuisine: '甜品', distance_m: 200 },
      ],
      nearby_activities: [
        { name: 'Siam Paragon', type: 'shopping', distance_m: 200 },
        { name: 'SEA LIFE Bangkok Ocean World', type: 'attraction', distance_m: 250 },
        { name: 'MBK Center', type: 'shopping', distance_m: 200 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 2100 },
        { name: 'Bangkok Art and Culture Centre', type: 'cultural', distance_m: 300 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Mercure+Bangkok+Siam+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Mercure位于Siam的正中心——这里是曼谷年轻人与购物的震源。酒店门外的Siam Square是一片由窄巷组成的方格，塞满了独立泰国服饰店、路边小吃摊、奶茶店和时髦咖啡馆，服务着附近朱拉隆功大学的学生。曼谷的潮流就是从这里开始的。这一带有三种截然不同的气质：Siam Paragon（暹罗百丽宫，200米）是奢侈品牌，地下一层还有那座出色的SEA LIFE Bangkok水族馆；MBK Center（200米）是平价购物、手机配件和一个巨大的美食广场；而Siam Square本身是最地道的泰国街头文化。对家庭来说，这一带几乎无可挑剔——Siam Paragon里的KidZania让孩子扮演大人的职业，SEA LIFE有鲨鱼和企鹅，吃的从40泰铢的路边面到国际连锁一应俱全。开在Siam Square Soi 5的伊善（泰国东北）名店Som Tam Nua总在排队，但青木瓜沙拉和脆皮猪肉值得等那20分钟。步行300米、位于National Stadium站路口的Bangkok Art and Culture Centre（BACC）免费开放，轮换的泰国当代艺术展相当好。LENGOLF就在一站之外的Chidlom——门到门大约8分钟，很适合安排成一个家庭下午。',
      suggested_itinerary: [
        { time: '09:00', activity: '在酒店吃早餐，然后趁Siam Paragon上午10点开门走过去（200米）' },
        { time: '10:30', activity: '逛SEA LIFE Bangkok Ocean World（Siam Paragon地下层）——孩子最爱鲨鱼隧道和触摸池' },
        { time: '12:30', activity: '在Som Tam Nua（Siam Square Soi 5）吃午饭——中午前到可以少排队' },
        { time: '14:00', activity: '逛Siam Square的独立小店和路边摊——试试泰式奶茶配烤吐司' },
        { time: '15:30', activity: '搭BTS 1站到Chidlom，在LENGOLF打室内高尔夫——适合全家，孩子很喜欢模拟器' },
        { time: '17:30', activity: '走到BACC（距酒店300米，免费）看当代艺术展' },
        { time: '18:30', activity: '到After You Dessert Café（Siam Square）吃招牌的涩谷蜂蜜吐司' },
        { time: '20:00', activity: '在MBK Food Island（200米）吃晚餐——平价，几十种泰国菜都在100泰铢以内' },
      ],
    },
  },
  {
    id: 'hotel-12',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-kimpton-maa-lai',
    title: 'Things to Do Near Kimpton Maa-Lai Bangkok | Activities Guide',
    meta_description:
      'Staying at Kimpton Maa-Lai Bangkok? Discover nearby activities — indoor golf at LENGOLF (800m), Langsuan dining, Lumpini Park, and unique nightlife.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'en',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Kimpton Maa-Lai Bangkok',
      hotel_neighbourhood: 'Langsuan / Chidlom',
      hotel_distance_m: 800,
      walking_time_mins: 11,
      walking_directions:
        'Exit Kimpton Maa-Lai onto Soi Tonson / Langsuan Road. Walk north to Ploenchit Road. Turn right (east) and walk along Ploenchit Road toward BTS Chidlom — about 8 minutes from the Langsuan intersection. The Mercury Ville is on your right at BTS Chidlom. LENGOLF is on Floor 4. In hot weather, consider a short taxi (5-7 minutes, ~60 THB) or grab a BTS from the nearest station.',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Stock.Room (Kimpton)', cuisine: 'Contemporary Thai', distance_m: 0 },
        { name: 'Ms. Jigger (Kimpton)', cuisine: 'Cocktail Bar', distance_m: 0 },
        { name: 'Baan Khanitha (Langsuan)', cuisine: 'Thai Fine Dining', distance_m: 200 },
        { name: 'Café Kitsuné', cuisine: 'French Cafe', distance_m: 600 },
        { name: 'Gaggan Anand', cuisine: 'Progressive Indian', distance_m: 300 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 500 },
        { name: 'Langsuan Restaurant Row', type: 'dining', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 800 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 800 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 500 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Kimpton+Maa-Lai+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'The Kimpton Maa-Lai is hidden on Soi Tonson, a quiet residential lane off Langsuan Road, which gives it a secret-garden quality that\'s wildly different from the chaos of nearby Sukhumvit or Silom. The hotel is Bangkok\'s first Kimpton and leans hard into the brand\'s personality — it\'s pet-friendly (a rarity in Bangkok hotels), hosts a lively evening social hour, and the design references the maa-lai (Thai jasmine garland) with floral motifs throughout. Soi Tonson and Langsuan itself form one of Bangkok\'s most concentrated dining corridors: within 300m you have Gaggan Anand (progressive Indian, regularly ranked among Asia\'s best), Baan Khanitha (royal Thai in a traditional house), and a half-dozen other acclaimed restaurants that food-focused travelers specifically seek out. Ms. Jigger, the hotel\'s own cocktail bar, has quickly become one of Bangkok\'s top cocktail destinations with its apothecary-themed interior and inventive Thai-inspired drinks. Bar.Yard, the rooftop, offers craft beers and a more relaxed vibe. The Kimpton\'s guests are typically the type who want experiences over sightseeing — making LENGOLF a natural fit. A short taxi ride (5-8 minutes, ~70 THB) gets you there, and the indoor golf + cocktails format aligns perfectly with the Kimpton crowd. Lumpini Park is a 500m walk for morning exercise, and Sindhorn Village (500m) provides a curated alternative to the mega-malls.',
      suggested_itinerary: [
        { time: '7:00 AM', activity: 'Morning walk to Lumpini Park (500m) — the southeast entrance is closest and has the most monitor lizard activity' },
        { time: '9:00 AM', activity: 'Breakfast at Stock.Room (in-hotel) — their Thai breakfast set with congee and dim sum is excellent' },
        { time: '10:30 AM', activity: 'Explore Soi Langsuan on foot — pop into the art galleries, design shops, and the famous Gaggan building' },
        { time: '12:00 PM', activity: 'Lunch at Baan Khanitha (200m) — one of Bangkok\'s most storied Thai restaurants, in a century-old teak house' },
        { time: '2:30 PM', activity: 'Taxi to LENGOLF (5-8 min) for indoor golf with cocktails (~550 THB/hour) — very Kimpton-vibe' },
        { time: '5:00 PM', activity: 'Return for the Kimpton Social Hour — complimentary drinks and snacks in the lobby each evening' },
        { time: '6:30 PM', activity: 'Craft cocktails at Ms. Jigger — try the Maa-Lai Sour, their signature Thai-inspired creation' },
        { time: '8:30 PM', activity: 'Dinner at Gaggan Anand (300m) — the 25-course tasting menu is a bucket-list experience (book 3+ weeks ahead)' },
        { time: '10:30 PM', activity: 'Nightcap on the Bar.Yard rooftop — craft beer and Bangkok skyline views under the stars' },
      ],
    },
  },

  // ─── TH: things-to-do-near-kimpton-maa-lai ───
  // Figures carried verbatim: 800 m / 11 min / 5 stars, สวนลุมพินี 500 เมตร,
  // Gaggan Anand 300 เมตร เทสติงเมนู 25 คอร์ส จองล่วงหน้า 3 สัปดาห์ขึ้นไป,
  // ประมาณ 550 บาท/ชั่วโมง. EN gives two different taxi figures on the same page
  // (5-7 นาที ประมาณ 60 บาท in directions, 5-8 นาที ประมาณ 70 บาท in area_guide) —
  // both carried in their own field, not reconciled. Flagged in the report.
  {
    id: 'hotel-12-th',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-kimpton-maa-lai',
    title: 'สิ่งที่น่าทำใกล้ Kimpton Maa-Lai Bangkok | ไกด์กิจกรรม',
    meta_description:
      'พักที่ Kimpton Maa-Lai Bangkok อยู่ใช่ไหม รวมกิจกรรมใกล้โรงแรม ทั้งกอล์ฟในร่มที่ LENGOLF (800 เมตร) ร้านอาหารย่านหลังสวน สวนลุมพินี และไนต์ไลฟ์ที่ไม่เหมือนใคร',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'th',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Kimpton Maa-Lai Bangkok',
      hotel_neighbourhood: 'หลังสวน / ชิดลม',
      hotel_distance_m: 800,
      walking_time_mins: 11,
      walking_directions:
        'ออกจาก Kimpton Maa-Lai มายังซอยต้นสน / ถนนหลังสวน (Soi Tonson / Langsuan Road) เดินขึ้นไปทางทิศเหนือจนถึงถนนเพลินจิต (Ploenchit Road) เลี้ยวขวา (ไปทางทิศตะวันออก) แล้วเดินตามถนนเพลินจิตมุ่งหน้าสู่ BTS ชิดลม ราว 8 นาทีจากแยกหลังสวน The Mercury Ville จะอยู่ทางขวามือที่ BTS ชิดลม LENGOLF อยู่ชั้น 4 ถ้าอากาศร้อน ลองนั่งแท็กซี่ระยะสั้น (5-7 นาที ประมาณ 60 บาท) หรือขึ้น BTS จากสถานีที่ใกล้ที่สุด',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Stock.Room (Kimpton)', cuisine: 'อาหารไทยร่วมสมัย', distance_m: 0 },
        { name: 'Ms. Jigger (Kimpton)', cuisine: 'บาร์ค็อกเทล', distance_m: 0 },
        { name: 'Baan Khanitha (Langsuan)', cuisine: 'อาหารไทยไฟน์ไดนิ่ง', distance_m: 200 },
        { name: 'Café Kitsuné', cuisine: 'คาเฟ่ฝรั่งเศส', distance_m: 600 },
        { name: 'Gaggan Anand', cuisine: 'อาหารอินเดียร่วมสมัย', distance_m: 300 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 500 },
        { name: 'Langsuan Restaurant Row', type: 'dining', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 800 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 800 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 500 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Kimpton+Maa-Lai+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Kimpton Maa-Lai ซ่อนตัวอยู่ในซอยต้นสน ซอยที่พักอาศัยอันเงียบสงบซึ่งแยกออกจากถนนหลังสวน จึงมีความรู้สึกแบบสวนลับที่ต่างจากความวุ่นวายของสุขุมวิทหรือสีลมอย่างสิ้นเชิง โรงแรมแห่งนี้เป็น Kimpton แห่งแรกของกรุงเทพฯ และทุ่มเทกับบุคลิกของแบรนด์อย่างเต็มที่ ทั้งการรับสัตว์เลี้ยง (ซึ่งหาได้ยากในโรงแรมกรุงเทพฯ) การจัดชั่วโมงสังสรรค์ตอนเย็นที่คึกคัก และงานออกแบบที่อ้างอิงพวงมาลัยมะลิไทยผ่านลวดลายดอกไม้ทั่วทั้งอาคาร ซอยต้นสนและถนนหลังสวนรวมกันเป็นหนึ่งในแนวร้านอาหารที่หนาแน่นที่สุดของกรุงเทพฯ ในระยะ 300 เมตรคุณมีทั้ง Gaggan Anand (อาหารอินเดียร่วมสมัย ที่ติดอันดับร้านดีที่สุดของเอเชียอยู่เป็นประจำ) Baan Khanitha (อาหารไทยชาววังในเรือนไทยดั้งเดิม) และร้านที่ได้รับคำชมอีกราวครึ่งโหลที่นักเดินทางสายอาหารตั้งใจมาโดยเฉพาะ Ms. Jigger บาร์ค็อกเทลของโรงแรมเอง ก้าวขึ้นมาเป็นหนึ่งในจุดหมายค็อกเทลชั้นนำของกรุงเทพฯ อย่างรวดเร็ว ด้วยการตกแต่งธีมร้านขายยาโบราณและเครื่องดื่มที่ได้แรงบันดาลใจจากรสไทย ส่วน Bar.Yard บนดาดฟ้าเสิร์ฟคราฟต์เบียร์ในบรรยากาศที่ผ่อนคลายกว่า ผู้เข้าพักของ Kimpton มักเป็นคนที่มองหาประสบการณ์มากกว่าการไล่ดูสถานที่ท่องเที่ยว LENGOLF จึงเข้ากันได้ดี นั่งแท็กซี่สั้น ๆ (5-8 นาที ประมาณ 70 บาท) ก็ถึง และรูปแบบกอล์ฟในร่มบวกค็อกเทลก็ตรงกับรสนิยมของแขก Kimpton พอดี สวนลุมพินีอยู่ห่าง 500 เมตรสำหรับออกกำลังกายตอนเช้า และ Sindhorn Village (500 เมตร) เป็นทางเลือกที่คัดสรรมาแล้วแทนห้างขนาดใหญ่',
      suggested_itinerary: [
        { time: '07:00 น.', activity: 'เดินไปสวนลุมพินีตอนเช้า (500 เมตร) ประตูด้านตะวันออกเฉียงใต้ใกล้ที่สุดและมีตัวเงินตัวทองให้เห็นมากที่สุด' },
        { time: '09:00 น.', activity: 'อาหารเช้าที่ Stock.Room ในโรงแรม เซ็ตอาหารเช้าแบบไทยพร้อมโจ๊กและติ่มซำทำได้ดีมาก' },
        { time: '10:30 น.', activity: 'เดินสำรวจซอยหลังสวน แวะแกลเลอรีศิลปะ ร้านดีไซน์ และอาคาร Gaggan ที่โด่งดัง' },
        { time: '12:00 น.', activity: 'มื้อกลางวันที่ Baan Khanitha (200 เมตร) หนึ่งในร้านอาหารไทยที่มีเรื่องเล่ายาวนานที่สุดของกรุงเทพฯ ในเรือนไม้สักอายุร้อยปี' },
        { time: '14:30 น.', activity: 'นั่งแท็กซี่ไป LENGOLF (5-8 นาที) เล่นกอล์ฟในร่มพร้อมค็อกเทล (ประมาณ 550 บาท/ชั่วโมง) เข้ากับสไตล์ Kimpton มาก' },
        { time: '17:00 น.', activity: 'กลับมาร่วม Kimpton Social Hour เครื่องดื่มและของว่างฟรีที่ล็อบบี้ทุกเย็น' },
        { time: '18:30 น.', activity: 'คราฟต์ค็อกเทลที่ Ms. Jigger ลอง Maa-Lai Sour เครื่องดื่มซิกเนเจอร์ที่ได้แรงบันดาลใจจากรสไทย' },
        { time: '20:30 น.', activity: 'มื้อค่ำที่ Gaggan Anand (300 เมตร) เทสติงเมนู 25 คอร์สที่ควรได้ลองสักครั้ง (จองล่วงหน้า 3 สัปดาห์ขึ้นไป)' },
        { time: '22:30 น.', activity: 'ปิดท้ายค่ำคืนบนดาดฟ้า Bar.Yard กับคราฟต์เบียร์และวิวเส้นขอบฟ้ากรุงเทพฯ ใต้ดาว' },
      ],
    },
  },

  // ─── JA: things-to-do-near-kimpton-maa-lai ───
  // EN quotes two different taxi fares/times for the same trip (5-7分・約60THB in
  // walking_directions vs 5-8分・約70THB in area_guide); each is carried in its own
  // field and the conflict is reported. Ranges use the JA wave dash 〜.
  // Figures: 800m / 11分 / 交差点から約8分 / 300m / 200m / 500m / 約550THB /
  // 25品 / 予約は3週間以上前。
  {
    id: 'hotel-12-ja',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-kimpton-maa-lai',
    title: 'キンプトン・マーライ・バンコク周辺の過ごし方 — アクティビティガイド',
    meta_description:
      'キンプトン・マーライ・バンコク（Kimpton Maa-Lai Bangkok）周辺の過ごし方。徒歩800mのLENGOLFでインドアゴルフ、ランスアンのレストラン、ルンピニー公園、個性的なナイトライフ。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ja',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Kimpton Maa-Lai Bangkok',
      hotel_neighbourhood: 'Langsuan / Chidlom',
      hotel_distance_m: 800,
      walking_time_mins: 11,
      walking_directions:
        'Kimpton Maa-Laiを出て、トンソン通り／ランスアン通り（Soi Tonson / Langsuan Road）へ。北へ進んでプルンチット通り（Ploenchit Road）に出たら、右（東）に曲がり、BTSチットロム駅の方向へ歩きます。ランスアンの交差点からおよそ8分です。BTSチットロム駅のところで右手にザ・マーキュリービルがあります。LENGOLFは4階です。暑い日は、タクシーで5〜7分（約60THB）か、最寄り駅からBTSを利用するのもよいでしょう。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Stock.Room (Kimpton)', cuisine: '現代タイ料理', distance_m: 0 },
        { name: 'Ms. Jigger (Kimpton)', cuisine: 'カクテルバー', distance_m: 0 },
        { name: 'Baan Khanitha (Langsuan)', cuisine: 'タイ高級料理', distance_m: 200 },
        { name: 'Café Kitsuné', cuisine: 'フレンチカフェ', distance_m: 600 },
        { name: 'Gaggan Anand', cuisine: '革新的インド料理', distance_m: 300 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 500 },
        { name: 'Langsuan Restaurant Row', type: 'dining', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 800 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 800 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 500 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Kimpton+Maa-Lai+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Kimpton Maa-Laiは、ランスアン通りから入った静かな住宅街の小道、トンソン通りに隠れるように建っています。近くのスクンビットやシーロムの喧騒とはまるで違う、秘密の庭のような趣です。バンコク初のKimptonで、ブランドの個性を前面に出しているのが特徴。バンコクのホテルでは珍しくペット同伴が可能で、夕方にはにぎやかなソーシャルアワーがあり、館内のデザインはマーライ（タイのジャスミンの花輪）にちなんだ花のモチーフで統一されています。トンソン通りとランスアン通りは、バンコクでも屈指の飲食店密集地帯です。300m以内に、アジアのベストレストランに毎年名を連ねる革新的インド料理のGaggan Anand、伝統家屋で宮廷タイ料理を出すBaan Khanitha、そして食を目当てに訪れる旅行者が名指しで探す評判の店が半ダースほど揃っています。ホテル内のカクテルバーMs. Jiggerは、薬局を思わせる内装とタイの素材を使った独創的な一杯で、短期間のうちにバンコク有数のカクテル店になりました。ルーフトップのBar.Yardでは、クラフトビールをもう少し肩の力を抜いて楽しめます。Kimptonの宿泊客は名所巡りより体験を求めるタイプが多く、LENGOLFはその意味で相性のよい行き先。タクシーで5〜8分、約70THBで着き、インドアゴルフとカクテルという組み合わせはKimptonの客層にぴたりと合います。朝の運動には500m先のルンピニー公園、巨大モールとは違う選び抜かれた買い物なら500mのSindhorn Villageがあります。',
      suggested_itinerary: [
        { time: '7:00', activity: 'ルンピニー公園（500m）まで朝の散歩を。南東の入口がいちばん近く、ミズオオトカゲもよく見かけます' },
        { time: '9:00', activity: 'Stock.Room（ホテル内）で朝食。お粥と点心のタイ式ブレックファストセットが評判です' },
        { time: '10:30', activity: 'ランスアン通りを歩いて、アートギャラリーやデザインショップ、有名なGagganの建物をのぞきます' },
        { time: '12:00', activity: 'Baan Khanitha（200m）でランチ。築100年を超えるチーク材の邸宅で、バンコクでも由緒あるタイ料理店のひとつです' },
        { time: '14:30', activity: 'タクシーで5〜8分、LENGOLFへ。カクテル片手にインドアゴルフを（1時間約550THB／2026年7月現在）。Kimptonらしい過ごし方です' },
        { time: '17:00', activity: 'ホテルに戻ってKimpton Social Hourへ。毎晩ロビーでドリンクとスナックが無料で振る舞われます' },
        { time: '18:30', activity: 'Ms. Jiggerでクラフトカクテルを。看板メニューはタイの素材を使ったMaa-Lai Sourです' },
        { time: '20:30', activity: 'Gaggan Anand（300m）でディナー。25品のテイスティングメニューは一生に一度の体験です（予約は3週間以上前に）' },
        { time: '22:30', activity: '締めはルーフトップのBar.Yardで。クラフトビールと、星空の下のバンコクのスカイラインを' },
      ],
    },
  },

  // ─── KO: things-to-do-near-kimpton-maa-lai ───
  // Figures from EN hotel-12: 800m / 11분(Langsuan 교차로에서 약 8분), 4층,
  // 택시 5~7분 약 60바트(walking_directions) / 5~8분 약 70바트(area_guide) — EN이
  // 두 값을 다르게 적어 각각 원문대로 옮겼어요(보고서 참조). Gaggan Anand 300m,
  // Baan Khanitha 200m(100년 된 티크 가옥), Lumpini Park 500m, Sindhorn Village 500m,
  // 25코스·3주 이상 전 예약, 약 550바트/시간. 범위 구분자는 KO 하우스 스타일 ~.
  {
    id: 'hotel-12-ko',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-kimpton-maa-lai',
    title: 'Kimpton Maa-Lai Bangkok 주변 즐길 거리 — 액티비티 가이드',
    meta_description:
      'Kimpton Maa-Lai Bangkok에 묵는다면 도보 800m 거리의 LENGOLF 실내 골프부터 Langsuan 다이닝, Lumpini Park, 독특한 밤 문화까지 가까운 즐길 거리를 소개해요.',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'ko',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Kimpton Maa-Lai Bangkok',
      hotel_neighbourhood: 'Langsuan / Chidlom',
      hotel_distance_m: 800,
      walking_time_mins: 11,
      walking_directions:
        'Kimpton Maa-Lai에서 Soi Tonson / Langsuan Road 쪽으로 나옵니다. 북쪽으로 걸어 Ploenchit Road까지 갑니다. 오른쪽(동쪽)으로 꺾어 Ploenchit Road에서 BTS 칫롬역 방향으로 걸어요. Langsuan 교차로에서 약 8분 거리예요. 오른편 BTS 칫롬역에 The Mercury Ville 건물이 있어요. LENGOLF는 4층에 있어요. 더운 날에는 짧게 택시를 타거나(5~7분, 약 60바트) 가장 가까운 역에서 BTS를 이용하는 방법도 있어요.',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Stock.Room (Kimpton)', cuisine: '컨템퍼러리 태국 요리', distance_m: 0 },
        { name: 'Ms. Jigger (Kimpton)', cuisine: '칵테일 바', distance_m: 0 },
        { name: 'Baan Khanitha (Langsuan)', cuisine: '태국 파인다이닝', distance_m: 200 },
        { name: 'Café Kitsuné', cuisine: '프랑스식 카페', distance_m: 600 },
        { name: 'Gaggan Anand', cuisine: '프로그레시브 인도 요리', distance_m: 300 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 500 },
        { name: 'Langsuan Restaurant Row', type: 'dining', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 800 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 800 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 500 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Kimpton+Maa-Lai+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Kimpton Maa-Lai 호텔은 Langsuan Road에서 갈라지는 조용한 주택가 골목 Soi Tonson에 숨어 있어요. 가까운 Sukhumvit, Silom 일대의 번잡함과는 전혀 다른, 비밀 정원 같은 느낌이 있어요. 방콕 최초의 Kimpton 호텔로 브랜드 특유의 개성이 강해요. 방콕 호텔로는 드물게 반려동물을 받고, 저녁마다 활기찬 소셜 아워를 열며, 디자인은 태국 재스민 화환인 마알라이(maa-lai)에서 따온 꽃 모티프를 곳곳에 담았어요. Soi Tonson과 Langsuan 일대는 방콕에서 식당 밀도가 가장 높은 구역 중 하나예요. 300m 안에 아시아 최고 레스토랑 순위에 꾸준히 오르는 프로그레시브 인도 요리 Gaggan Anand, 전통 가옥에서 왕실 태국 요리를 내는 Baan Khanitha를 비롯해 미식 여행자들이 일부러 찾아오는 이름난 식당이 여섯 곳 넘게 모여 있어요. 호텔 자체 칵테일 바 Ms. Jigger 매장은 약제상을 테마로 한 인테리어와 태국에서 영감을 얻은 창의적인 칵테일로 금세 방콕 최고의 칵테일 명소 중 하나가 됐어요. 루프톱 Bar.Yard에서는 크래프트 맥주와 조금 더 느긋한 분위기를 즐길 수 있어요. Kimpton 손님들은 대체로 관광보다 경험을 원하는 편이라 LENGOLF가 자연스럽게 어울려요. 택시로 5~8분(약 70바트)이면 닿고, 실내 골프에 칵테일을 곁들이는 형식이 Kimpton 특유의 분위기와 잘 맞아요. Lumpini Park까지는 500m라 아침 운동에 좋고, Sindhorn Village(500m)에서는 대형 쇼핑몰과는 다른 엄선된 선택지를 만날 수 있어요.',
      suggested_itinerary: [
        { time: '07:00', activity: 'Lumpini Park까지 아침 산책(500m) — 남동쪽 입구가 가장 가깝고 물왕도마뱀도 가장 많이 보여요' },
        { time: '09:00', activity: 'Stock.Room(호텔 내)에서 조식 — 죽과 딤섬이 나오는 태국식 조식 세트가 좋아요' },
        { time: '10:30', activity: 'Soi Langsuan 도보 산책 — 갤러리와 디자인 숍, 유명한 Gaggan 건물을 둘러보세요' },
        { time: '12:00', activity: 'Baan Khanitha(200m)에서 점심 — 100년 된 티크 가옥에 자리한 방콕의 대표적인 태국 식당이에요' },
        { time: '14:30', activity: '택시로 LENGOLF까지 이동(5~8분)해 칵테일과 함께 실내 골프 (시간당 약 550바트, 2026년 7월 기준) — Kimpton 분위기와 잘 맞아요' },
        { time: '17:00', activity: 'Kimpton Social Hour에 맞춰 복귀 — 매일 저녁 로비에서 무료 음료와 스낵이 제공돼요' },
        { time: '18:30', activity: 'Ms. Jigger에서 크래프트 칵테일 — 시그니처인 Maa-Lai Sour를 맛보세요' },
        { time: '20:30', activity: 'Gaggan Anand(300m)에서 저녁 — 25코스 테이스팅 메뉴는 버킷리스트급이에요 (3주 이상 전 예약)' },
        { time: '22:30', activity: 'Bar.Yard 루프톱에서 마무리 한 잔 — 크래프트 맥주와 별빛 아래 방콕 스카이라인' },
      ],
    },
  },

  // ─── ZH: things-to-do-near-kimpton-maa-lai ───
  // Figures carried from EN: 800m / 11分钟 / 5星, Lumpini 500m, Sindhorn Village 500m,
  // CentralWorld 800m, Baan Khanitha 200m, Gaggan Anand 300m, 打车5–7分钟约60泰铢
  // (walking_directions) 与5–8分钟约70泰铢 (area_guide) — EN carries BOTH, both kept
  // verbatim per the no-reconcile rule; flagged in the report. 25道菜, 提前3周以上.
  {
    id: 'hotel-12-zh',
    page_type: 'hotel_concierge',
    slug: 'things-to-do-near-kimpton-maa-lai',
    title: 'Kimpton Maa-Lai Bangkok附近好去处 — 周边活动指南',
    meta_description:
      '住在Kimpton Maa-Lai Bangkok？周边活动这样挑：LENGOLF室内高尔夫（800米）、Langsuan餐饮、Lumpini Park与别具一格的夜生活。',
    featured_image: null,
    schema_markup: null,
    status: 'published',
    category: 'hotel',
    locale: 'zh',
    related_slugs: ['/activities/date-night-ideas-bangkok', '/activities/things-to-do-bangkok-at-night', '/golf'],
    created_at: now,
    updated_at: now,
    content: {
      hotel_name: 'Kimpton Maa-Lai Bangkok',
      hotel_neighbourhood: 'Langsuan / Chidlom',
      hotel_distance_m: 800,
      walking_time_mins: 11,
      walking_directions:
        '从Kimpton Maa-Lai出来，走到Soi Tonson / Langsuan Road上。向北走到Ploenchit Road，右转（向东）沿Ploenchit Road朝BTS Chidlom站走——从Langsuan路口过去大约8分钟。The Mercury Ville在你右手边的BTS Chidlom站旁。LENGOLF在4楼。天气热的话，可以考虑打车（5–7分钟，约60泰铢），或者从最近的车站搭BTS过去。',
      hotel_star_rating: 5,
      nearby_restaurants: [
        { name: 'Stock.Room (Kimpton)', cuisine: '当代泰菜', distance_m: 0 },
        { name: 'Ms. Jigger (Kimpton)', cuisine: '鸡尾酒吧', distance_m: 0 },
        { name: 'Baan Khanitha (Langsuan)', cuisine: '泰式高级料理', distance_m: 200 },
        { name: 'Café Kitsuné', cuisine: '法式咖啡馆', distance_m: 600 },
        { name: 'Gaggan Anand', cuisine: '前卫印度料理', distance_m: 300 },
      ],
      nearby_activities: [
        { name: 'Lumpini Park', type: 'outdoor', distance_m: 500 },
        { name: 'Langsuan Restaurant Row', type: 'dining', distance_m: 100 },
        { name: 'LENGOLF Indoor Golf', type: 'entertainment', distance_m: 800 },
        { name: 'CentralWorld', type: 'shopping', distance_m: 800 },
        { name: 'Sindhorn Village', type: 'shopping', distance_m: 500 },
      ],
      google_maps_embed: 'https://maps.google.com/maps?q=Kimpton+Maa-Lai+Bangkok+to+LENGOLF&t=m&z=16&output=embed',
      area_guide:
        'Kimpton Maa-Lai藏在Langsuan Road旁一条安静的住宅小巷Soi Tonson里，有一种秘密花园般的气质，和附近Sukhumvit或Silom的喧闹完全是两回事。这是曼谷第一家Kimpton，把品牌的个性发挥得很足——可以带宠物入住（在曼谷酒店里少见）、每天傍晚有热闹的社交时光，设计上则以maa-lai（泰式茉莉花环）为主题，花卉纹样贯穿全馆。Soi Tonson和Langsuan本身构成曼谷最密集的餐饮走廊之一：300米内就有Gaggan Anand（前卫印度料理，常年名列亚洲最佳餐厅之列）、Baan Khanitha（传统宅邸里的宫廷泰菜），以及另外五六家专程有人为它们而来的名店。酒店自家的鸡尾酒吧Ms. Jigger以药房主题的室内设计和创意泰式风味调酒，很快就成了曼谷顶尖的鸡尾酒去处之一。天台的Bar.Yard则供应精酿啤酒，气氛更放松。Kimpton的客人通常更看重体验而不是打卡景点——这让LENGOLF成了很自然的选择。打车5–8分钟就到，车费约70泰铢，室内高尔夫配鸡尾酒的组合，和Kimpton的调性相当合拍。Lumpini Park步行500米，适合早晨活动；500米外的Sindhorn Village则提供了一个不同于大型商场的精选选择。',
      suggested_itinerary: [
        { time: '07:00', activity: '早上走到Lumpini Park（500米）——东南门最近，那一带巨蜥也最活跃' },
        { time: '09:00', activity: '在酒店的Stock.Room吃早餐——泰式早餐套餐配粥和点心很不错' },
        { time: '10:30', activity: '步行逛Soi Langsuan——钻进画廊、设计小店，还有那栋有名的Gaggan大楼' },
        { time: '12:00', activity: '在Baan Khanitha（200米）吃午饭——曼谷最有故事的泰餐厅之一，开在百年柚木宅里' },
        { time: '14:30', activity: '打车去LENGOLF（5–8分钟）打室内高尔夫配鸡尾酒（每小时约550泰铢）——很Kimpton的玩法' },
        { time: '17:00', activity: '回酒店参加Kimpton Social Hour——每天傍晚在大堂免费供应酒水和小食' },
        { time: '18:30', activity: '在Ms. Jigger喝手工调酒——试试招牌的泰式创意调酒Maa-Lai Sour' },
        { time: '20:30', activity: '到Gaggan Anand（300米）吃晚餐——25道的品尝菜单是人生清单级的体验（提前3周以上订位）' },
        { time: '22:30', activity: '在Bar.Yard天台喝最后一杯——精酿啤酒配星空下的曼谷天际线' },
      ],
    },
  },
]
