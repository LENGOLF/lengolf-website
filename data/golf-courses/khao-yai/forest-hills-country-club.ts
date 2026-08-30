import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'forest-hills-country-club',
  region: 'khao-yai',
  name: `Forest Hills Country Club`,
  province: `Saraburi`,
  designer: `John William Rogers & Pichai Vichupas`,
  holes: 27,
  par: 72,
  year_opened: 1993,
  green_fee_weekday_thb: 1350,
  green_fee_weekend_thb: 1600,
  // The typed pair is the BOOKING-PLATFORM PACKAGE, not a bare green fee: prose says
  // "packages run around 1,350 THB weekdays and 1,600 THB weekends all-in, including
  // caddie and a single-rider cart". (fees_verified_at attests the fee VALUES; no
  // field records what a rate includes, so it is not evidence of the package.) The file used to
  // mix two pricing paths - package green fee beside walk-in caddie/cart - which is
  // what made this look ambiguous. It is not: one path, typed consistently.
  fee_is_package: true,
  fees_verified_at: '2026-07-30',
  // Was 400, which was a TIP typed as a FEE - this file's own prose says twice that
  // "a caddie tip of 400 THB is the customary minimum ON TOP". Identical to the
  // hang-dong correction in the chiang-mai batch (68b12ca), where a 200 THB tip was
  // likewise typed as a fee. NOT gassan-khuntan, which an earlier draft miscited. Caddies are
  // mandatory here and the package covers them, so the fee is zero and the tip
  // stays extra (caddie_tip_included deliberately unset).
  caddie_fee_thb: 0,
  // Was 500. The typed green fee above is the booking-platform package rate, which
  // includes a single-rider cart, so the typed fields must describe that same
  // pricing path or the card contradicts its own heading. The 500 is the cart
  // price off that package; `layout_and_experience` is reworded in this commit to
  // say so, because it previously stated the figure with NO pricing-path framing
  // at all - directly under a card headed "Rates". An earlier draft of this
  // comment claimed the prose already framed it; that was false.
  cart_fee_thb: 0,
  caddie_required: true,
  cart_required: false,
  driving_range: true,
  website: null,
  phone: '+66 36 343200',
  latitude: 14.58863,
  longitude: 101.193251,
  distance_from_bangkok_km: 150,
  drive_time_from_bangkok_min: 90,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: 600,
  club_rental_brands: null,
  schema_markup: "{\"@context\":\"https://schema.org\",\"@type\":\"GolfCourse\",\"name\":\"Forest Hills Country Club\",\"url\":\"https://len.golf/golf-courses/khao-yai/forest-hills-country-club\",\"description\":null,\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Muak Lek\",\"addressRegion\":\"Saraburi\",\"addressCountry\":\"TH\"},\"geo\":{\"@type\":\"GeoCoordinates\",\"latitude\":14.58863,\"longitude\":101.193251},\"telephone\":\"+66 36 343200\",\"priceRange\":\"฿\",\"sameAs\":[\"https://maps.google.com/?q=14.58863,101.193251\"],\"amenityFeature\":[{\"@type\":\"LocationFeatureSpecification\",\"name\":\"Driving Range\",\"value\":true},{\"@type\":\"LocationFeatureSpecification\",\"name\":\"Caddie Required\",\"value\":true},{\"@type\":\"LocationFeatureSpecification\",\"name\":\"Golf Cart\",\"value\":false}]}",
  prose: {
    overview: `Forest Hills Country Club — today marketed as Sir James Country Club, named after Sir James Richard Holt — is a 27-hole resort course in Muak Lek district, Saraburi province, sitting along the Mittraphap Road corridor approximately 90 minutes northeast of Bangkok. Designed by John William Rogers and Pichai Vichupas and opened in 1993, the course offers an accessible day-trip proposition: current booking-platform packages run around 1,350 THB weekdays and 1,600 THB weekends all-in, including caddie and a single-rider cart. A customary caddie tip (400 THB minimum) applies on top. The 27-hole layout provides enough variety for a full day or multiple-round visit, and the on-site hotel — a 4-star property with over 100 rooms — makes Forest Hills a practical choice for groups or golfers who prefer to stay overnight rather than drive back to Bangkok.`,
    layout_and_experience: `The 27-hole parkland layout is divided into three nine-hole loops, allowing golfers to play any combination of 18 holes across a mature, tree-lined landscape. Rogers and Vichupas's design works with the natural terrain of the Muak Lek valley, incorporating water features and strategic bunkering that reward accuracy off the tee and precision on approach. Caddies are mandatory and carry genuine value on a layout with 27 holes, where local knowledge of green speeds and pin positions is helpful. Off that package, a golf cart is 500 THB for those who prefer not to walk. The driving range on-site allows a proper warm-up, and club rental at 600 THB makes the course fully accessible for visiting golfers travelling without equipment.`,
    tips: `Booking-platform packages (around 1,350 THB weekday / 1,600 THB weekend, caddie and cart included) are usually the best deal — compare them against the walk-in rate before you go. A caddie tip of 400 THB is the customary minimum on top. Because the course has 27 holes, clarify which 18-hole combination is in play on your visit, as some loops may see heavier traffic on weekends. The Muak Lek location places it close to other Khao Yai-corridor courses, making it possible to combine with a round at a nearby venue for a multi-course weekend itinerary.`,
    location_and_access: `Forest Hills Country Club is located at 195 Moo 3, Mittraphap Road, Muak Lek district, Saraburi province — approximately 150 km northeast of Bangkok at around the 150-kilometre mark along the Mittraphap Road (Highway 2). The drive from Bangkok takes approximately 90 minutes, making it one of the closer options in the Khao Yai/Pak Chong corridor. The Mittraphap Road runs directly through the area, so navigation is straightforward. There is no direct public bus service to the course gate; private car or hired vehicle is the standard approach from Bangkok.`,
    rental_cta_context: `Forest Hills Country Club offers club rental at 600 THB per round, and golfers travelling from Bangkok can also arrange a rental set through LENGOLF near BTS Chidlom before heading northeast to Muak Lek.`,
  },
  locales: {
    en: {
      title: `Forest Hills Country Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Forest Hills Country Club (Sir James CC): 27-hole parkland in Saraburi, packages from ~1,350 THB weekday incl caddie & cart. 90 mins from Bangkok. Club rental options.`,
    },
    th: {
      title: `Forest Hills Country Club สระบุรี — แพ็กเกจรวมทุกอย่าง รีวิวสนาม 27 หลุม และเช่าไม้กอล์ฟ`,
      meta_description: `Forest Hills Country Club (Sir James CC) สนามพาร์กแลนด์ 27 หลุมในอำเภอมวกเหล็ก จังหวัดสระบุรี แพ็กเกจรวมทุกอย่างเริ่มต้น 1,350 บาทวันธรรมดา รวมค่าแคดดี้และรถกอล์ฟแบบนั่งคนเดียว ห่างจากกรุงเทพฯ ราว 90 นาที พร้อมข้อมูลเช่าไม้กอล์ฟ`,
      prose: {
        overview: `Forest Hills Country Club ซึ่งปัจจุบันทำการตลาดในชื่อ Sir James Country Club ตามชื่อของ Sir James Richard Holt เป็นสนามรีสอร์ต 27 หลุมในอำเภอมวกเหล็ก จังหวัดสระบุรี ตั้งอยู่ริมแนวถนนมิตรภาพ ห่างจากกรุงเทพฯ ไปทางตะวันออกเฉียงเหนือราว 90 นาที ออกแบบโดย John William Rogers และ Pichai Vichupas เปิดให้บริการในปี 1993 สนามแห่งนี้ตอบโจทย์การเดินทางไปกลับภายในวันเดียวได้ดี ปัจจุบันแพ็กเกจที่ขายผ่านแพลตฟอร์มจองอยู่ที่ราว 1,350 บาทในวันธรรมดา และ 1,600 บาทในวันเสาร์อาทิตย์ แบบรวมทุกอย่าง ทั้งค่าแคดดี้และรถกอล์ฟแบบนั่งคนเดียว โดยมีทิปแคดดี้ตามธรรมเนียม (ขั้นต่ำ 400 บาท) จ่ายเพิ่มต่างหาก เลย์เอาต์ 27 หลุมให้ความหลากหลายพอสำหรับการเล่นเต็มวันหรือหลายรอบ และโรงแรมภายในพื้นที่ซึ่งเป็นระดับ 4 ดาวมีห้องพักกว่า 100 ห้อง ทำให้ Forest Hills เป็นตัวเลือกที่ใช้งานได้จริงสำหรับกลุ่มคณะหรือนักกอล์ฟที่อยากค้างคืนมากกว่าจะขับรถกลับกรุงเทพฯ`,
        layout_and_experience: `เลย์เอาต์พาร์กแลนด์ 27 หลุมแบ่งเป็นสามลูป ลูปละ 9 หลุม ผู้เล่นจึงจับคู่เป็น 18 หลุมได้หลายรูปแบบบนภูมิทัศน์ที่มีต้นไม้ใหญ่ขนาบตลอดเส้นทาง การออกแบบของ Rogers และ Vichupas ทำงานร่วมกับสภาพภูมิประเทศตามธรรมชาติของหุบเขามวกเหล็ก โดยดึงแหล่งน้ำและการวางบังเกอร์เชิงกลยุทธ์เข้ามาใช้ ซึ่งให้รางวัลกับความแม่นยำทั้งจากแท่นทีและช็อตเข้ากรีน การใช้แคดดี้เป็นข้อบังคับ และแคดดี้มีคุณค่าจริงบนสนามที่มีถึง 27 หลุม เพราะความรู้เรื่องความเร็วกรีนและตำแหน่งธงในแต่ละวันช่วยได้มาก หากไม่ใช้แพ็กเกจดังกล่าว ค่ารถกอล์ฟจะอยู่ที่ 500 บาทสำหรับผู้ที่ไม่อยากเดิน ภายในสนามมีสนามไดรฟ์ให้วอร์มอัพอย่างเหมาะสม และบริการเช่าไม้กอล์ฟในราคา 600 บาท ทำให้นักกอล์ฟที่เดินทางมาโดยไม่ได้นำอุปกรณ์มาด้วยเข้าใช้สนามได้เต็มที่`,
        tips: `แพ็กเกจที่ขายผ่านแพลตฟอร์มจอง (ราว 1,350 บาทวันธรรมดา และ 1,600 บาทวันเสาร์อาทิตย์ รวมค่าแคดดี้และรถกอล์ฟ) มักเป็นดีลที่คุ้มที่สุด ควรเทียบกับอัตราหน้าเคาน์เตอร์ก่อนออกเดินทาง (ข้อมูล ณ กรกฎาคม 2026) ทิปแคดดี้ตามธรรมเนียมขั้นต่ำอยู่ที่ 400 บาท จ่ายเพิ่มจากแพ็กเกจ เนื่องจากสนามมีถึง 27 หลุม ควรสอบถามให้ชัดว่าวันที่คุณไปใช้ลูปใดจับคู่กันเป็น 18 หลุม เพราะบางลูปอาจมีผู้เล่นหนาแน่นกว่าในวันเสาร์อาทิตย์ ทำเลในอำเภอมวกเหล็กอยู่ใกล้สนามอื่น ๆ ในแนวเขาใหญ่ จึงจับคู่กับทีไทม์ที่สนามข้างเคียงเป็นโปรแกรมกอล์ฟหลายสนามในหนึ่งสุดสัปดาห์ได้`,
        location_and_access: `Forest Hills Country Club ตั้งอยู่เลขที่ 195 หมู่ 3 ถนนมิตรภาพ อำเภอมวกเหล็ก จังหวัดสระบุรี ห่างจากกรุงเทพฯ ไปทางตะวันออกเฉียงเหนือประมาณ 150 กิโลเมตร ราวหลักกิโลเมตรที่ 150 ของถนนมิตรภาพ (ทางหลวงหมายเลข 2) การขับรถจากกรุงเทพฯ ใช้เวลาประมาณ 90 นาที จึงเป็นหนึ่งในสนามที่อยู่ใกล้ที่สุดในแนวเขาใหญ่-ปากช่อง ถนนมิตรภาพตัดผ่านพื้นที่นี้โดยตรง การหาเส้นทางจึงไม่ซับซ้อน ไม่มีรถโดยสารประจำทางที่วิ่งถึงหน้าสนาม การเดินทางจากกรุงเทพฯ ตามปกติจึงใช้รถส่วนตัวหรือรถเช่าพร้อมคนขับ`,
        rental_cta_context: `Forest Hills Country Club มีบริการเช่าไม้กอล์ฟในราคา 600 บาทต่อรอบ ส่วนนักกอล์ฟที่เดินทางมาจากกรุงเทพฯ ยังจัดเตรียมชุดไม้เช่าผ่าน LENGOLF ใกล้ BTS ชิดลม ก่อนออกเดินทางขึ้นไปทางตะวันออกเฉียงเหนือสู่มวกเหล็กได้เช่นกัน`,
      },
    },
    ja: {
      title: `Forest Hills Country Club（サラブリー）— パッケージ料金・コース紹介・クラブレンタル`,
      meta_description: `Forest Hills Country Club（Sir James CC）はサラブリー県ムアクレックの27ホール・パークランドコース。キャディーとカート込みで平日約1,350THBからのオールインクルーシブ料金、バンコクから約90分の行き方、クラブレンタルをまとめました。`,
      prose: {
        overview: `Forest Hills Country Club — 現在はSir James Richard Holtの名を冠したSir James Country Clubとして展開されています — は、サラブリー県ムアクレック郡にある27ホールのリゾートコースです。ミットラパープ道路の回廊沿い、バンコクの北東およそ90分の位置にあります。設計はJohn William RogersとPichai Vichupasで、開場は1993年。日帰りでも組み立てやすい料金設定が魅力で、現在の予約サイトのパッケージは平日約1,350THB、週末約1,600THBのオールインクルーシブとなっており、キャディーと1人乗りカートが含まれます（2026年7月現在）。これとは別に、慣例としてキャディーへのチップ（最低400THB）が加わります。27ホールというボリュームは1日たっぷり回るにも、複数ラウンドの滞在にも十分な変化があり、敷地内の100室を超える4つ星ホテルがあることから、グループや、バンコクへ戻らず1泊したいゴルファーにとって現実的な選択肢になっています。`,
        layout_and_experience: `27ホールのパークランドレイアウトは9ホールずつ3つのループに分かれており、成熟した木立の景観のなかで任意の組み合わせによる18ホールをプレーできます。RogersとVichupasの設計はムアクレック渓谷の自然地形を生かしたもので、水景と戦略的なバンカー配置が、ティーショットの正確さとアプローチの精度に報いる構成になっています。キャディーの帯同は必須で、27ホールというレイアウトではグリーンの速さやピン位置に関する土地勘が実際に役立ちます。前述のパッケージとは別枠で、歩きたくない場合のゴルフカートは500THBです。敷地内にはドライビングレンジがあり、しっかりウォームアップができます。クラブレンタルは600THBで、道具を持たずに訪れるゴルファーでも問題なくプレーできます。`,
        tips: `予約サイトのパッケージ（平日約1,350THB、週末約1,600THB、キャディーとカート込み）が最も条件のよいことが多いので、出発前にウォークイン料金と比較しておくとよいでしょう（2026年7月現在）。これに加えて、キャディーへのチップは400THBが慣例的な最低額です。27ホールあるため、訪問日にどの18ホールの組み合わせが使われるかを確認しておいてください。週末は一部のループに人が集中することがあります。ムアクレックという立地はカオヤイ回廊の他のコースにも近く、近隣のコースと組み合わせて週末に複数ラウンドを回る行程も組めます。`,
        location_and_access: `Forest Hills Country Clubの住所は195 Moo 3, Mittraphap Road, Muak Lek district, Saraburi provinceで、バンコクの北東およそ150km、ミットラパープ道路（国道2号線）の150kmポスト付近に位置します。バンコクからの所要時間はおよそ90分で、カオヤイ・パクチョン回廊のなかでは近いほうのコースのひとつです。ミットラパープ道路がこの一帯を直接貫いているため、道順は分かりやすいでしょう。コースのゲートまで直行する路線バスはなく、バンコクからは自家用車かチャーター車が一般的なアクセス手段です。`,
        rental_cta_context: `Forest Hills Country Clubでは1ラウンド600THBでクラブレンタルを利用できます。バンコクから向かうゴルファーは、北東のムアクレックへ出発する前に、BTSチットロム駅近くのLENGOLFでレンタルセットを手配することもできます。`,
      },
    },
    ko: {
      title: `Forest Hills Country Club 올인클루시브 패키지 — 사라부리 27홀 코스 가이드`,
      meta_description: `Forest Hills Country Club(현재 Sir James Country Club)은 사라부리주 Muak Lek의 27홀 파크랜드 코스예요. 예약 플랫폼 패키지는 평일 약 1,350바트, 주말 약 1,600바트로 캐디와 1인승 카트가 포함됩니다 (2026년 7월 기준). 방콕에서 90분 거리이고 클럽 대여 정보까지 정리했어요.`,
      prose: {
        overview: `Forest Hills Country Club은 현재 Sir James Richard Holt의 이름을 딴 Sir James Country Club이라는 이름으로 홍보되는 27홀 리조트 코스로, 사라부리주 Muak Lek 지구의 Mittraphap Road 축을 따라 방콕에서 북동쪽으로 약 90분 거리에 자리합니다. John William Rogers와 Pichai Vichupas가 설계해 1993년에 문을 열었어요. 당일치기로 다녀오기 좋은 조건인데, 현재 예약 플랫폼 패키지는 평일 약 1,350바트, 주말 약 1,600바트이고 캐디와 1인승 카트까지 모두 포함된 가격입니다. 여기에 관례적인 캐디 팁(최소 400바트)이 별도로 붙어요. 27홀 레이아웃은 하루를 온전히 쓰거나 여러 라운드를 도는 방문에도 충분한 변화를 주고, 부지 안에는 100실이 넘는 4성급 호텔이 있어 단체 골퍼나 방콕으로 돌아가는 대신 하룻밤 묵고 싶은 골퍼에게 실용적인 선택지가 됩니다.`,
        layout_and_experience: `27홀 파크랜드 레이아웃은 9홀씩 세 개의 루프로 나뉘어 있어, 다 자란 나무가 늘어선 풍경 속에서 어떤 조합으로든 18홀을 돌 수 있어요. Rogers와 Vichupas의 설계는 Muak Lek 계곡의 자연 지형을 살리면서 워터 해저드와 전략적인 벙커를 배치해, 티샷의 정확도와 어프로치의 정밀함에 보답합니다. 캐디는 필수이고, 그린 스피드와 핀 위치에 대한 현지 감각이 도움이 되는 27홀 레이아웃에서는 그 값을 제대로 해요. 이 패키지를 벗어나 따로 이용하면 골프 카트는 500바트이고, 걷고 싶지 않은 분들이 선택할 수 있습니다. 부지 안 드라이빙 레인지에서 제대로 몸을 풀 수 있고, 600바트인 클럽 대여 덕분에 장비 없이 찾아온 골퍼도 부담 없이 라운딩할 수 있어요.`,
        tips: `예약 플랫폼 패키지(평일 약 1,350바트, 주말 약 1,600바트, 캐디와 카트 포함)가 대체로 가장 유리하니, 출발 전에 워크인 요금과 비교해 보세요 (2026년 7월 기준). 캐디 팁은 최소 400바트가 관례이며, 패키지 요금과 별도로 지불합니다. 27홀 코스라 방문하는 날 어떤 18홀 조합이 열리는지 미리 확인해 두는 편이 좋아요. 주말에는 특정 루프에 사람이 몰릴 수 있습니다. Muak Lek이라는 위치 덕분에 카오야이 축의 다른 코스들과 가까워, 근처 골프장 라운딩과 묶어 여러 코스를 도는 주말 일정을 짜기도 좋아요.`,
        location_and_access: `Forest Hills Country Club은 사라부리주 Muak Lek 지구 Mittraphap Road 195 Moo 3에 있고, 방콕에서 북동쪽으로 약 150km, Mittraphap Road(2번 국도) 150km 지점 언저리에 자리합니다. 방콕에서 차로 약 90분이라 카오야이·Pak Chong 축에서 가까운 축에 드는 선택지 가운데 하나예요. Mittraphap Road가 이 일대를 그대로 관통하기 때문에 길 찾기는 어렵지 않습니다. 코스 정문까지 바로 가는 시외버스 노선은 없어서, 방콕에서는 자가용이나 대절 차량으로 가는 것이 일반적이에요.`,
        rental_cta_context: `Forest Hills Country Club은 라운드당 600바트에 클럽 대여를 제공하고, 방콕에서 출발하는 골퍼라면 북동쪽 Muak Lek으로 향하기 전에 BTS 칫롬역 근처의 LENGOLF에서 대여 세트를 준비할 수도 있어요.`,
      },
    },
    zh: {
      title: `Forest Hills Country Club全包套餐 — 北标府27洞球场攻略与球杆租借`,
      meta_description: `Forest Hills Country Club（即Sir James CC）是北标府Muak Lek的27洞林间公园式球场，订球平台套餐平日约1,350泰铢起，含球童与单人座球车，距曼谷90分钟车程，另附球杆租借信息。`,
      prose: {
        overview: `Forest Hills Country Club——如今以Sir James Country Club的名字对外经营，名字取自Sir James Richard Holt——是一座位于北标府Muak Lek县的27洞度假球场，就在Mittraphap路走廊沿线，距曼谷东北方向约90分钟车程。球场由John William Rogers与Pichai Vichupas设计，1993年开放，很适合当天往返：目前订球平台上的套餐价平日约1,350泰铢、周末约1,600泰铢，全包价已含球童与单人座球车，截至2026年7月。按惯例还需另付球童小费（最低400泰铢）。27洞的布局足以支撑一整天或连打多场，场内还有一家超过100间客房的四星酒店，因此对团体，或是不想当天开回曼谷、宁愿住一晚的球手来说，Forest Hills都是个务实的选择。`,
        layout_and_experience: `这套27洞的林间公园式布局分成三组9洞，球手可以任意搭配出18洞，一路穿行在成熟的林木景观之中。Rogers与Vichupas的设计顺着Muak Lek谷地的天然地形展开，把水景与讲究策略的沙坑布置结合起来，回报开球的准头与攻果岭的精度。球童是强制的，在27洞的场地上他们也确实值这个价——他们对果岭速度和旗杆位置的本地经验很有帮助。如果不走这个套餐、又不想走路，球车另收500泰铢。场内的练习场可以做一次像样的热身，600泰铢的球杆租借则让没带装备的外地球手也能完整地打完一场。`,
        tips: `订球平台上的套餐（平日约1,350泰铢、周末约1,600泰铢，含球童与球车）通常是最划算的选择——出发前不妨拿它和现场散客价比一比。按惯例，球童小费最低400泰铢，需另付。由于球场有27洞，到访当天请先问清楚在打的是哪一组18洞组合，因为周末有些组次的人流会明显更大。Muak Lek的位置离考艾走廊上的其他球场都不远，可以和附近球场的开球时间串在一起，凑成一个连打多场的周末行程。`,
        location_and_access: `Forest Hills Country Club地址为北标府Muak Lek县Mittraphap路195 Moo 3——位于曼谷东北方向约150公里处，大致在Mittraphap路（2号公路）150公里的路碑附近。从曼谷驾车约需90分钟，是考艾与Pak Chong这条走廊上距离较近的选择之一。Mittraphap路直接穿过这一带，所以找路并不费劲。没有直达球场门口的公共巴士，从曼谷过来的标准做法是自驾或包车。`,
        rental_cta_context: `Forest Hills Country Club提供球杆租借，每场600泰铢；从曼谷过来的球手，也可以在向东北前往Muak Lek之前，先到BTS Chidlom附近的LENGOLF租一套球杆。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-20',
}
