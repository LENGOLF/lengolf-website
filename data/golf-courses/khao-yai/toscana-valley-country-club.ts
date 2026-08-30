import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'toscana-valley-country-club',
  region: 'khao-yai',
  name: `Toscana Valley Country Club`,
  province: `Nakhon Ratchasima`,
  designer: `Bob McFarland`,
  holes: 18,
  par: 72,
  year_opened: 2009,
  green_fee_weekday_thb: 5000,
  green_fee_weekend_thb: 6000,
  // All-in package per this file's own EN prose: the posted rate bundles the
  // caddie (and cart where the course has one). Stops generated copy calling
  // the number a bare "green fee", which would tell a reader they pay extra.
  fee_is_package: true,
  // Zero, not null: EN prose states "The all-inclusive rate (green fee, caddie,
  // cart) is approximately 5,000 THB weekday and 6,000 THB weekend".
  caddie_fee_thb: 0,
  cart_fee_thb: 0,
  caddie_required: true,
  cart_required: true,
  driving_range: true,
  website: 'https://toscanavalley.com/',
  phone: '+66 87 549 7222',
  latitude: 14.5071,
  longitude: 101.5034,
  distance_from_bangkok_km: 150,
  drive_time_from_bangkok_min: 120,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: null,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Toscana Valley Country Club\",\n  \"url\": \"https://len.golf/golf-courses/khao-yai/toscana-valley-country-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Nakhon Ratchasima\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 14.5071,\n    \"longitude\": 101.5034\n  },\n  \"telephone\": \"+66 87 549 7222\",\n  \"priceRange\": \"฿฿฿\",\n  \"sameAs\": [\n    \"https://maps.google.com/?q=14.5071,101.5034\",\n    \"https://toscanavalley.com/\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `Toscana Valley Country Club is widely considered one of the most dramatic and challenging golf experiences accessible from Bangkok, situated within the rolling hills surrounding Khao Yai National Park — a UNESCO World Heritage Site — approximately two hours north of the capital. Opened in 2009 and designed by American architect Bob McFarland, the course evokes the Tuscan landscape its name suggests: deep valleys, elevated tees, steep terrain changes, and sweeping vistas. It is part of the larger Toscana Valley resort complex, which includes residential villas, a hotel, and extensive leisure facilities. The course is reserved primarily for weekday play by the public (the resort's membership model influences weekend availability), making it a genuine escape-from-the-city proposition. Premium conditioning and a PGA-standard layout put this among the most prestigious courses in the Bangkok day-trip category.`,
    layout_and_experience: `McFarland's design exploits the Khao Yai terrain to its maximum, with tee boxes positioned on high ground offering panoramic views and fairways that plunge, rise, and bend through dense tropical forest. The deep valley setting means many holes play longer or shorter than the yardage suggests, and reading wind direction requires local knowledge. Raised greens with steep fall-offs punish anything short, while deep greenside bunkers catch errant approaches. The course measures 7,007 yards from the tips and is designated as one of the most challenging courses in Thailand — scores routinely run 10 or more strokes over a player's normal performance. Signature holes include dramatic par-3s requiring full carries over ravines and long par-4s where the dogleg angle cannot be cut. The par-5 holes offer tantalising risk/reward options but water and jungle punish the overambitious. Greens are fast and true. Carts are mandatory given the terrain, and caddies are extremely helpful for reading the complex topography.`,
    tips: `Toscana Valley is a destination round, not a quick weekday-morning spin — plan a full day and ideally combine with an overnight at the resort. The all-inclusive rate (green fee, caddie, cart) is approximately 5,000 THB weekday and 6,000 THB weekend, which represents genuine value for a PGA-standard mountain course. Play in the cool season (November to February) for the best conditions and most dramatic scenery. The journey is approximately 2 hours from Bangkok — start early to avoid midday heat on uphill holes. Correct club selection is critical given the elevation changes; your caddie's advice on yardage adjustments is essential. Tee times should be booked directly via the resort website or phone: +66 87 549 7222.`,
    location_and_access: `Toscana Valley Country Club is located at 2 Moo 11, Ban Nenthong, Pong Ta Long, Pak Chong, Nakhon Ratchasima 30450 — approximately 150 km north of Bangkok in the Khao Yai highlands. The drive from central Bangkok takes around 2 hours via Highway 2 (Mittraphap Road) to Pak Chong. The nearest town, Pak Chong, offers hotels and restaurants. The resort itself has on-site accommodation, making an overnight stay practical. The closest major city is Nakhon Ratchasima (Korat), about 45 minutes further north.`,
    rental_cta_context: `Making the two-hour drive to Toscana Valley is far more enjoyable without luggage; LENGOLF delivers tour-quality rental clubs to your Bangkok hotel before you depart, so you can travel light and arrive ready.`,
  },
  locales: {
    en: {
      title: `Toscana Valley Country Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Toscana Valley Country Club Khao Yai green fees, course overview, Bob McFarland design, tips for visiting, and golf club rentals delivered to your Bangkok hotel.`,
    },
    th: {
      title: `Toscana Valley Country Club เขาใหญ่ — แพ็กเกจรวมทุกอย่าง รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `Toscana Valley Country Club เขาใหญ่ สนาม 18 หลุมออกแบบโดย Bob McFarland บนภูมิประเทศหุบเขา อัตรารวมทุกอย่างราว 5,000 บาทวันธรรมดา และ 6,000 บาทวันเสาร์อาทิตย์ (รวมค่ากรีนฟี ค่าแคดดี้ และรถกอล์ฟ) ห่างจากกรุงเทพฯ 150 กิโลเมตร พร้อมข้อมูลเช่าไม้กอล์ฟ`,
      prose: {
        overview: `Toscana Valley Country Club ได้รับการยอมรับอย่างกว้างขวางว่าเป็นหนึ่งในประสบการณ์กอล์ฟที่ตื่นตาและท้าทายที่สุดเท่าที่เดินทางจากกรุงเทพฯ ไปถึงได้ ตั้งอยู่ท่ามกลางเนินเขาที่โอบล้อมอุทยานแห่งชาติเขาใหญ่ ซึ่งเป็นมรดกโลกของยูเนสโก ห่างจากเมืองหลวงขึ้นไปทางเหนือราวสองชั่วโมง สนามเปิดให้บริการในปี 2009 ออกแบบโดย Bob McFarland สถาปนิกชาวอเมริกัน และให้ความรู้สึกถึงภูมิทัศน์ทัสคานีสมชื่อ ทั้งหุบเขาลึก แท่นทียกสูง การเปลี่ยนระดับที่ชัน และทัศนียภาพกว้างไกล ที่นี่เป็นส่วนหนึ่งของคอมเพล็กซ์ Toscana Valley ขนาดใหญ่ ซึ่งมีทั้งวิลลาที่พักอาศัย โรงแรม และสิ่งอำนวยความสะดวกเพื่อการพักผ่อนอย่างครบครัน สนามสงวนไว้สำหรับบุคคลทั่วไปเล่นในวันธรรมดาเป็นหลัก เนื่องจากรูปแบบสมาชิกของรีสอร์ตมีผลต่อคิวว่างในวันเสาร์อาทิตย์ จึงเป็นข้อเสนอที่ให้ความรู้สึกหนีเมืองอย่างแท้จริง การดูแลสนามระดับพรีเมียมและเลย์เอาต์มาตรฐาน PGA ทำให้ที่นี่อยู่ในกลุ่มสนามที่มีเกียรติภูมิที่สุดของหมวดสนามที่ไปกลับจากกรุงเทพฯ ได้ภายในวันเดียว`,
        layout_and_experience: `งานออกแบบของ McFarland ดึงศักยภาพของภูมิประเทศเขาใหญ่ออกมาใช้เต็มที่ แท่นทีวางอยู่บนที่สูงเปิดทัศนียภาพแบบพาโนรามา ส่วนแฟร์เวย์ดิ่งลง ไต่ขึ้น และคดโค้งผ่านผืนป่าเขตร้อนที่หนาแน่น ทำเลในหุบเขาลึกทำให้หลายหลุมเล่นยาวหรือสั้นกว่าตัวเลขระยะที่ระบุไว้ และการอ่านทิศทางลมต้องอาศัยความรู้ของคนในพื้นที่ กรีนที่ยกสูงพร้อมขอบลาดชันลงโทษช็อตที่สั้นเกินไป ขณะที่บังเกอร์ลึกรอบกรีนคอยรับช็อตเข้ากรีนที่พลาดเป้า สนามวัดความยาวได้ 7,007 หลาจากแท่นทีหลังสุด และถูกจัดให้เป็นหนึ่งในสนามที่ท้าทายที่สุดในประเทศไทย โดยสกอร์ของผู้เล่นสูงกว่าฟอร์มปกติของตัวเอง 10 สโตรกขึ้นไปเป็นเรื่องปกติ หลุมซิกเนเจอร์ประกอบด้วยหลุมพาร์ 3 ที่ต้องแคร์รีข้ามหุบเหวเต็มระยะ และหลุมพาร์ 4 ระยะยาวที่ไม่สามารถตีตัดมุมโค้งได้ ส่วนหลุมพาร์ 5 เปิดทางเลือกเสี่ยงแลกผลตอบแทนที่ชวนให้ลอง แต่ทั้งน้ำและป่าก็ลงโทษผู้ที่ทะเยอทะยานเกินตัว กรีนเร็วและอ่านทางได้ตรง รถกอล์ฟเป็นข้อบังคับเนื่องจากภูมิประเทศ และแคดดี้มีประโยชน์อย่างยิ่งในการอ่านสภาพพื้นที่อันซับซ้อน`,
        tips: `Toscana Valley เป็นการออกรอบแบบตั้งใจไปเป็นจุดหมาย ไม่ใช่การแวะเล่นเช้าวันธรรมดาแบบรีบ ๆ ควรวางแผนให้เต็มวันและถ้าเป็นไปได้ควรค้างคืนที่รีสอร์ตด้วย อัตราแบบรวมทุกอย่าง (ค่ากรีนฟี ค่าแคดดี้ และรถกอล์ฟ) อยู่ที่ประมาณ 5,000 บาทในวันธรรมดา และ 6,000 บาทในวันเสาร์อาทิตย์ (ข้อมูล ณ สิงหาคม 2026) ซึ่งถือว่าคุ้มค่าจริงสำหรับสนามภูเขามาตรฐาน PGA ควรเล่นในฤดูหนาว (พฤศจิกายนถึงกุมภาพันธ์) เพื่อสภาพสนามที่ดีที่สุดและทัศนียภาพที่งดงามที่สุด การเดินทางจากกรุงเทพฯ ใช้เวลาราวสองชั่วโมง ควรออกแต่เช้าเพื่อเลี่ยงความร้อนกลางวันในหลุมที่ต้องตีขึ้นเนิน การเลือกไม้ให้ถูกต้องเป็นเรื่องสำคัญมากเมื่อพิจารณาจากการเปลี่ยนระดับความสูง คำแนะนำเรื่องการปรับระยะจากแคดดี้จึงจำเป็น ควรจองทีไทม์โดยตรงผ่านเว็บไซต์ของรีสอร์ตหรือโทร +66 87 549 7222`,
        location_and_access: `Toscana Valley Country Club ตั้งอยู่เลขที่ 2 หมู่ 11 บ้านเนินทอง ตำบลโป่งตาลอง อำเภอปากช่อง จังหวัดนครราชสีมา 30450 ห่างจากกรุงเทพฯ ขึ้นไปทางเหนือประมาณ 150 กิโลเมตร ในเขตที่สูงของเขาใหญ่ การขับรถจากใจกลางกรุงเทพฯ ใช้เวลาราว 2 ชั่วโมงตามทางหลวงหมายเลข 2 (ถนนมิตรภาพ) ไปยังปากช่อง เมืองที่ใกล้ที่สุดคือปากช่อง ซึ่งมีทั้งโรงแรมและร้านอาหาร ส่วนตัวรีสอร์ตเองก็มีที่พักภายในพื้นที่ ทำให้การค้างคืนเป็นเรื่องสะดวก เมืองใหญ่ที่ใกล้ที่สุดคือนครราชสีมา (โคราช) ซึ่งอยู่ขึ้นไปทางเหนืออีกราว 45 นาที`,
        rental_cta_context: `การขับรถสองชั่วโมงไป Toscana Valley สนุกขึ้นมากเมื่อไม่ต้องพะวงเรื่องสัมภาระ LENGOLF ส่งไม้กอล์ฟให้เช่าคุณภาพระดับทัวร์ถึงโรงแรมของคุณในกรุงเทพฯ ก่อนออกเดินทาง ให้คุณเดินทางแบบเบาสบายและไปถึงพร้อมเล่นทันที`,
      },
    },
    ja: {
      title: `Toscana Valley Country Club（カオヤイ）— パッケージ料金・コース紹介・クラブレンタル`,
      meta_description: `Toscana Valley Country Clubはカオヤイの丘陵に広がるBob McFarland設計の18ホール。グリーンフィー・キャディー・カート込みで平日約5,000THBのオールインクルーシブ料金、コースの手強さ、バンコクからのクラブレンタルをご案内します。`,
      prose: {
        overview: `Toscana Valley Country Clubは、バンコクから足を伸ばせる範囲では最も劇的で手強いゴルフ体験のひとつと広く見なされているコースです。ユネスコ世界遺産のカオヤイ国立公園を取り巻くなだらかな丘陵のなかにあり、首都の北およそ2時間の距離にあります。2009年の開場、設計はアメリカ人建築家のBob McFarlandで、その名が連想させるトスカーナの風景を思わせる深い谷、高い位置のティー、急峻な地形の変化、そして広がる眺望を備えています。住宅ヴィラ、ホテル、充実したレジャー施設を含む大規模なToscana Valleyリゾート複合施設の一部です。コースは一般には主に平日のプレー向けに開放されており（リゾートの会員制モデルが週末の空き状況に影響します）、都会からの本物の脱出という提案になっています。プレミアムなコンディショニングとPGA基準のレイアウトが、バンコクからの日帰り圏では屈指の格式あるコースの一角に位置づけています。`,
        layout_and_experience: `McFarlandの設計はカオヤイの地形を最大限に引き出しており、ティーボックスは眺望の開ける高台に置かれ、フェアウェイは深い熱帯の森を縫って落ち、駆け上がり、曲がっていきます。深い谷という立地のため、多くのホールは表示ヤーデージより長くも短くもプレーされ、風向きを読むには土地勘が要ります。持ち上げられたグリーンは急な傾斜で落ちており、ショートしたショットを容赦なく罰します。グリーンサイドの深いバンカーも、外れたアプローチを捕まえます。コースはバックティーから7,007ヤードで、タイでも最も手強いコースのひとつに数えられています。スコアはふだんの実力より10打以上多くなることも珍しくありません。シグネチャーホールには、峡谷をフルキャリーで越えていく劇的なパー3や、ドッグレッグのコーナーをカットできないロングパー4があります。パー5は魅力的なリスク・リワードの選択肢を用意しつつ、欲張りすぎれば水とジャングルが罰を与えます。グリーンは速く、素直に転がります。地形の性格上カートは必須で、複雑な起伏を読むうえでキャディーは非常に頼りになります。`,
        tips: `Toscana Valleyは平日の朝にさっと回るようなコースではなく、目的地として1日をあてる場所です。できればリゾートでの宿泊と組み合わせてください。グリーンフィー、キャディー、カートを含むオールインクルーシブ料金は平日およそ5,000THB、週末およそ6,000THBで、PGA基準の山岳コースとしては本物の価値があります（2026年8月現在）。コンディションと景観が最も良いのは涼季（11月から2月）です。バンコクからはおよそ2時間。打ち上げのホールで日中の暑さに当たらないよう、早めに出発してください。高低差があるぶんクラブ選択が決定的に重要になるため、ヤーデージの補正についてはキャディーの助言が欠かせません。ティータイムはリゾートの公式サイトか電話（+66 87 549 7222）から直接ご予約ください。`,
        location_and_access: `Toscana Valley Country Clubの住所は2 Moo 11, Ban Nenthong, Pong Ta Long, Pak Chong, Nakhon Ratchasima 30450で、バンコクの北およそ150km、カオヤイの高原地帯にあります。バンコク中心部からは国道2号線（ミットラパープ道路）でパクチョンへ向かい、およそ2時間のドライブです。最寄りの町であるパクチョンにはホテルとレストランがそろっています。リゾート自体にも宿泊施設があるため、1泊の滞在も現実的です。最も近い主要都市はナコンラーチャシーマー（コラート）で、さらに北へ45分ほどの距離です。`,
        rental_cta_context: `Toscana Valleyまでの2時間のドライブは、荷物がないほうがずっと快適です。LENGOLFがツアークオリティのレンタルクラブを、出発前にバンコクのホテルまでお届けしますので、身軽に移動して、準備の整った状態で到着できます。`,
      },
    },
    ko: {
      title: `Toscana Valley Country Club 올인클루시브 패키지 — 카오야이 18홀 코스 가이드`,
      meta_description: `Toscana Valley Country Club은 카오야이 고지대의 Bob McFarland 설계 18홀 코스예요. 올인클루시브 요금은 평일 약 5,000바트, 주말 약 6,000바트로 그린피와 캐디, 카트가 포함됩니다 (2026년 8월 기준). 코스 가이드와 클럽 대여 정보까지 담았어요.`,
      prose: {
        overview: `Toscana Valley Country Club은 방콕에서 다녀올 수 있는 골프 경험 가운데 가장 극적이고 까다로운 축으로 널리 꼽히는 코스로, 유네스코 세계유산인 카오야이 국립공원을 둘러싼 구릉지대에 자리하며 수도에서 북쪽으로 약 두 시간 거리에 있어요. 2009년에 문을 열었고 미국인 설계가 Bob McFarland가 설계했는데, 이름이 떠올리게 하는 토스카나 풍경을 그대로 불러냅니다. 깊은 계곡과 높이 솟은 티, 가파른 지형 변화, 시원하게 펼쳐지는 조망이 이어져요. 코스는 주거용 빌라와 호텔, 폭넓은 레저 시설을 갖춘 더 큰 Toscana Valley 리조트 단지의 일부입니다. 일반 방문객에게는 주로 평일 플레이가 열려 있는데(리조트의 회원제 모델이 주말 이용 가능성에 영향을 줍니다), 그만큼 도시를 진짜로 벗어나는 제안이 돼요. 프리미엄급 관리 상태와 PGA 수준의 레이아웃이 더해져, 방콕 당일치기로 갈 수 있는 코스 중에서는 가장 명망 있는 축에 듭니다.`,
        layout_and_experience: `McFarland의 설계는 카오야이 지형을 최대한으로 끌어씁니다. 티 박스는 높은 지대에 놓여 파노라마 조망을 내주고, 페어웨이는 울창한 열대림 사이로 곤두박질치고 솟아오르며 휘어져요. 깊은 계곡이라는 환경 탓에 많은 홀이 표시된 야드보다 길게 혹은 짧게 플레이되고, 바람 방향을 읽으려면 현지 감각이 필요합니다. 솟아오른 그린은 가장자리가 가파르게 떨어져 짧은 샷에 벌을 주고, 깊은 그린사이드 벙커가 빗나간 어프로치를 붙잡아요. 코스는 맨 뒤 티에서 7,007야드이고 태국에서 가장 까다로운 코스 가운데 하나로 꼽히는데, 평소 실력보다 10타 이상 더 치는 일이 흔합니다. 시그니처 홀로는 협곡을 온전히 넘겨야 하는 극적인 파 3 홀들과, 도그레그 각을 질러갈 수 없는 긴 파 4 홀들이 있어요. 파 5 홀들은 구미가 당기는 리스크 리워드 선택지를 내주지만, 지나치게 욕심을 부리면 물과 정글이 대가를 치르게 합니다. 그린은 빠르고 정직하게 굴러요. 지형 때문에 카트는 필수이고, 복잡한 기복을 읽는 데는 캐디의 도움이 아주 큽니다.`,
        tips: `Toscana Valley는 평일 오전에 가볍게 한 바퀴 돌고 오는 코스가 아니라 작정하고 찾아가는 목적지예요. 하루를 온전히 비우고, 가능하면 리조트에서 하룻밤 묵는 일정과 묶으세요. 올인클루시브 요금(그린피, 캐디, 카트 포함)은 평일 약 5,000바트, 주말 약 6,000바트이고 (2026년 8월 기준), PGA 수준의 산악 코스라는 점을 생각하면 진짜 값을 하는 가격입니다. 조건과 풍경이 가장 좋은 선선한 시기(11월~2월)에 플레이하세요. 방콕에서 약 두 시간 거리이니, 오르막 홀에서 한낮의 더위를 피하려면 일찍 출발하는 편이 좋아요. 고저 차가 큰 만큼 올바른 클럽 선택이 결정적이고, 야드 보정에 대한 캐디의 조언이 꼭 필요합니다. 티타임은 리조트 웹사이트나 +66 87 549 7222로 직접 예약하세요.`,
        location_and_access: `Toscana Valley Country Club은 나콘랏차시마주 30450, Pak Chong의 Pong Ta Long, Ban Nenthong 2 Moo 11에 있고, 방콕에서 북쪽으로 약 150km 떨어진 카오야이 고지대에 자리합니다. 방콕 도심에서 2번 국도(Mittraphap Road)를 따라 Pak Chong까지 차로 약 두 시간이 걸려요. 가장 가까운 도시인 Pak Chong에는 호텔과 식당이 있습니다. 리조트 자체에도 숙박 시설이 있어 하룻밤 묵는 일정을 잡기 좋아요. 가장 가까운 대도시는 북쪽으로 45분쯤 더 가면 나오는 나콘랏차시마(코랏)입니다.`,
        rental_cta_context: `Toscana Valley까지 두 시간을 달리는 길은 짐이 없을 때 훨씬 즐거워요. LENGOLF가 출발 전에 투어 퀄리티 대여 클럽을 방콕 호텔로 배달해 드리니, 가볍게 떠나 준비된 상태로 도착할 수 있습니다.`,
      },
    },
    zh: {
      title: `Toscana Valley Country Club全包套餐 — 考艾18洞山地球场攻略与球杆租借`,
      meta_description: `Toscana Valley Country Club全包价约平日5,000泰铢、周末6,000泰铢，含果岭费、球童与球车。这座Bob McFarland设计的考艾山地球场全长7,007码，另附球杆租借信息。`,
      prose: {
        overview: `Toscana Valley Country Club被广泛视为从曼谷出发可及范围内最富戏剧性、也最具挑战的高尔夫体验之一，坐落在环绕考艾国家公园——一处UNESCO世界遗产——的连绵丘陵之间，距首都以北约两小时车程。球场2009年开放，由美国建筑师Bob McFarland设计，确实唤起了名字所指的托斯卡纳意象：深谷、抬高的发球台、陡峭的地形变化和开阔的远景。它隶属于规模更大的Toscana Valley度假园区，园区内还有住宅别墅、酒店和大量休闲设施。球场主要在平日对公众开放（度假村的会员制模式影响了周末的可订状况），因此是一次真正意义上的逃离城市。顶级的养护水准加上PGA标准的布局，让它在曼谷当天往返可及的球场中位居最负盛名的一档。`,
        layout_and_experience: `McFarland的设计把考艾的地形用到了极致，发球台设在高处，视野开阔，球道则在茂密的热带森林间俯冲、爬升、拐弯。深谷环境意味着许多球洞打起来比码数显示的更长或更短，判读风向也需要本地经验。抬高的果岭四周落差陡峭，打短一点就会受罚；果岭旁的深沙坑则专门收走偏掉的攻果岭球。球场从后发球台算起全长7,007码，被列为泰国最具挑战的球场之一——成绩比平常多打十杆以上是常有的事。招牌球洞包括几个必须完整越过峡谷的3杆洞，以及拐角根本切不掉的长4杆洞。5杆洞提供了很诱人的冒险与回报选择，但水和丛林会惩罚过于贪心的人。果岭又快又真。考虑到地形，球车是强制的；球童在判读复杂地貌上也帮得上大忙。`,
        tips: `Toscana Valley是一趟专程而来的球局，不是平日上午匆匆打完就走的地方——请预留一整天，最好再配上在度假村住一晚。全包价（含果岭费、球童与球车）约为平日5,000泰铢、周末6,000泰铢，对一座PGA标准的山地球场来说是真正的超值。凉季（11月到2月）来打，条件最好、景色也最壮观。从曼谷过来约两小时车程——早点出发，避开在上坡球洞上遇到正午的暑热。高低落差让选杆变得至关重要，球童在距离修正上的建议不可或缺。开球时间请直接通过度假村官网或电话预订：+66 87 549 7222。`,
        location_and_access: `Toscana Valley Country Club地址为呵叻府Pak Chong县Pong Ta Long的Ban Nenthong 2 Moo 11，邮编30450——位于曼谷以北约150公里的考艾高地。从曼谷市中心驾车，走2号公路（Mittraphap路）到Pak Chong，约需两小时。最近的城镇Pak Chong有酒店和餐厅。度假村本身设有场内住宿，安排过夜很方便。最近的大城市是呵叻（Nakhon Ratchasima，即Korat），再往北大约45分钟。`,
        rental_cta_context: `开两小时的车去Toscana Valley，不带行李会轻松得多；LENGOLF会在你出发前把巡回赛级别的租借球杆送到你的曼谷酒店，让你轻装上路，到场就能开打。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-20',
}
