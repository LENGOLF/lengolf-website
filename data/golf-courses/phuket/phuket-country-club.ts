import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'phuket-country-club',
  region: 'phuket',
  name: `Phuket Country Club`,
  province: `Phuket`,
  designer: `Dr. Sukitti Klangvisai`,
  holes: 18,
  par: 72,
  year_opened: 1989,
  green_fee_weekday_thb: 2800,
  green_fee_weekend_thb: 4000,
  // Phuket CC prices by SEASON, not day of week: the 2,800 / 4,000 above are
  // low-season / high-season (the prose says so). This flag suppresses the
  // auto weekday/weekend fee FAQ + meta line so structured data does not
  // assert a false day-of-week split.
  fee_is_seasonal: true,
  caddie_fee_thb: 400,
  cart_fee_thb: 700,
  caddie_required: true,
  cart_required: false,
  driving_range: true,
  website: 'https://www.phuketcountryclub.com/',
  phone: '+66 76 319 200',
  latitude: 7.897,
  longitude: 98.324,
  distance_from_bangkok_km: 860,
  drive_time_from_bangkok_min: null,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: null,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Phuket Country Club\",\n  \"url\": \"https://len.golf/golf-courses/phuket/phuket-country-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Phuket\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 7.897,\n    \"longitude\": 98.324\n  },\n  \"telephone\": \"+66 76 319 200\",\n  \"priceRange\": \"฿฿฿\",\n  \"sameAs\": [\n    \"https://www.phuketcountryclub.com/\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": false\n    }\n  ]\n}",
  prose: {
    overview: `Phuket Country Club holds the distinction of being Phuket's original championship golf course — the first 18-hole layout built on the island, opened in 1989 and designed by Dr. Sukitti Klangvisai on reclaimed tin mine land in Kathu. Now in its fourth decade, the course has aged into a mature, characterful layout shaded by established trees and flanked by the limestone hills and cliffs that define central Phuket's interior landscape. Where newer Phuket courses rely on ocean views and resort infrastructure for appeal, Phuket Country Club derives its character from topography and history. The course sits about 15 minutes from Patong Beach and 10 minutes from Phuket Town, making it the most centrally located golf facility on the island. The club operates both the 18-hole Old Course and a shorter 9-hole Country Club Course; the Old Course is the championship layout and the subject of this guide. The 52-bay, floodlit driving range at the club entrance is one of the best practice facilities in Phuket.`,
    layout_and_experience: `The 18-hole, par-72 Old Course plays to 6,484 yards from the blue tees across terrain shaped by its former life as a tin mine — undulating land with natural depressions and elevated sections that the original design team used to create visual variety and strategic options. The layout occupies three distinct environments: open parkland fairways, areas hemmed by mature trees and tropical vegetation, and holes that wrap around the large lake at the course's centre. The 10th hole, a par-five, is the course's most celebrated individual hole — the fairway bends 180 degrees around a massive lake, demanding a careful decision on where to lay up or when to attempt a heroic carry. The greens are considered medium in speed, consistent, and receptive to well-struck approach shots. The absence of compulsory carts means golfers can walk the course with their caddie — a more intimate and traditionally Thai way to experience the layout. Pace of play is generally good outside weekend mornings. The club retains the atmosphere of an established local club rather than an international resort course.`,
    tips: `Early morning tee times on weekdays deliver the best combination of mild temperatures and uncrowded fairways. The high-season period (November–March) brings more visitors but also the best weather; the course's inland location means it is somewhat sheltered from the sea wind that affects coastal courses. Rain gear is advisable from May through October, though afternoon squalls pass quickly. The driving range at the club entrance is floodlit and open until 19:30, making it ideal for late arrivals or anyone who wants to tune their game without needing to book a full round. Cart rental is optional at ฿700 — the course is walkable but hilly enough that a cart is worth considering in the hotter months. The caddie quality at Phuket Country Club is consistently praised in reviews; let them read the greens, particularly on the holes that ring the central lake.`,
    location_and_access: `Phuket Country Club is located at 80/1 Moo 7, Vichitsongkram Road in Kathu, central Phuket — approximately 15 minutes by car from Patong Beach and 10 minutes from Phuket Town. It sits roughly 25–30 minutes from Phuket International Airport. All visitors from Bangkok fly to Phuket (approximately 1 hour 20 minutes). Grab taxis, local taxis, and hotel transfers are the standard transport options. The central location makes Phuket Country Club accessible from almost any Phuket hotel without a long transfer.`,
    rental_cta_context: `Heading to Phuket Country Club on your island trip? If your travel plan includes a night in Bangkok before or after, rent TaylorMade or Callaway clubs delivered to your Bangkok hotel — skip airline baggage fees entirely.`,
  },
  locales: {
    en: {
      title: `Phuket Country Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Phuket Country Club: Phuket's oldest course, est. 1989, par-72, 6,484 yards. Low season from ฿2,800 / high season from ฿4,000. Central Kathu location. Caddie compulsory.`,
    },
    th: {
      title: `Phuket Country Club ภูเก็ต — ค่ากรีนฟี รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `ค่ากรีนฟี Phuket Country Club โลว์ซีซันประมาณ 2,800 บาท ไฮซีซันประมาณ 4,000 บาท สนาม 18 หลุมแห่งแรกของภูเก็ต เปิดปี 1989 ทำเลใจกลางกะทู้`,
      prose: {
        overview: `Phuket Country Club ครองสถานะสนามกอล์ฟระดับแชมเปียนชิพแห่งแรกของภูเก็ต เป็นเลย์เอาต์ 18 หลุมแห่งแรกที่สร้างขึ้นบนเกาะ เปิดให้บริการในปี 1989 ออกแบบโดย Dr. Sukitti Klangvisai บนพื้นที่เหมืองแร่ดีบุกเก่าที่ปรับสภาพแล้วในกะทู้ ปัจจุบันสนามก้าวเข้าสู่ทศวรรษที่สี่ และเติบโตเป็นเลย์เอาต์ที่กลมกล่อมเปี่ยมเอกลักษณ์ ร่มรื่นด้วยต้นไม้ใหญ่ที่หยั่งรากมานาน ขนาบด้วยเขาหินปูนและหน้าผาซึ่งเป็นภูมิทัศน์อันเป็นเอกลักษณ์ของภูเก็ตตอนใน ขณะที่สนามใหม่ ๆ ของภูเก็ตพึ่งพาวิวทะเลและโครงสร้างแบบรีสอร์ตเป็นจุดขาย Phuket Country Club กลับได้เสน่ห์มาจากภูมิประเทศและประวัติศาสตร์ สนามอยู่ห่างจากหาดป่าตองประมาณ 15 นาที และห่างจากตัวเมืองภูเก็ต 10 นาที นับเป็นสนามกอล์ฟที่ตั้งอยู่ใจกลางเกาะมากที่สุด สโมสรเปิดให้บริการทั้ง Old Course ขนาด 18 หลุม และ Country Club Course ขนาด 9 หลุมที่สั้นกว่า โดย Old Course คือเลย์เอาต์ระดับแชมเปียนชิพและเป็นหัวข้อของไกด์ฉบับนี้ สนามไดรฟ์ขนาด 52 เบย์พร้อมไฟส่องสว่างที่ทางเข้าสโมสรยังนับเป็นหนึ่งในสถานที่ฝึกซ้อมที่ดีที่สุดของภูเก็ต`,
        layout_and_experience: `Old Course ขนาด 18 หลุม พาร์ 72 มีระยะ 6,484 หลาจากแท่นทีน้ำเงิน ทอดตัวบนภูมิประเทศที่ถูกหล่อหลอมจากอดีตการเป็นเหมืองแร่ดีบุก เป็นผืนดินลูกคลื่นที่มีแอ่งธรรมชาติและพื้นที่ยกระดับ ซึ่งทีมออกแบบดั้งเดิมนำมาใช้สร้างความหลากหลายทางสายตาและทางเลือกเชิงกลยุทธ์ เลย์เอาต์ครอบคลุมสภาพแวดล้อมสามแบบที่แตกต่างกัน ทั้งแฟร์เวย์พาร์กแลนด์เปิดโล่ง พื้นที่ที่ขนาบด้วยต้นไม้ใหญ่และพืชพรรณเขตร้อน และหลุมที่โอบล้อมทะเลสาบขนาดใหญ่ใจกลางสนาม หลุม 10 ซึ่งเป็นพาร์ 5 คือหลุมเดี่ยวที่มีชื่อเสียงที่สุดของสนาม แฟร์เวย์โค้ง 180 องศารอบทะเลสาบขนาดมหึมา บังคับให้ตัดสินใจอย่างรอบคอบว่าจะวางลูกที่จุดใด หรือเมื่อใดจึงควรเสี่ยงตีข้ามน้ำแบบท้าทาย กรีนถือว่ามีความเร็วระดับปานกลาง สม่ำเสมอ และรับลูกแอพโพรชที่ตีมาอย่างดี การที่ไม่บังคับใช้รถกอล์ฟหมายความว่านักกอล์ฟสามารถเดินออกรอบพร้อมแคดดี้ได้ ซึ่งเป็นวิถีสัมผัสเลย์เอาต์ที่ใกล้ชิดและเป็นแบบไทยดั้งเดิมมากกว่า จังหวะการเล่นโดยทั่วไปดี ยกเว้นช่วงเช้าวันเสาร์อาทิตย์ สโมสรยังคงบรรยากาศของสโมสรท้องถิ่นที่ก่อตั้งมานาน มากกว่าจะเป็นสนามรีสอร์ตระดับนานาชาติ`,
        tips: `ทีไทม์ช่วงเช้าตรู่ของวันธรรมดาให้ส่วนผสมที่ลงตัวที่สุดระหว่างอากาศที่ไม่ร้อนจัดกับแฟร์เวย์ที่ไม่แออัด ช่วงไฮซีซัน (พฤศจิกายน-มีนาคม) มีผู้มาเยือนมากขึ้นแต่ก็มาพร้อมสภาพอากาศที่ดีที่สุด ทำเลตอนในของสนามช่วยกำบังลมทะเลที่ส่งผลต่อสนามริมชายฝั่งได้พอสมควร ควรเตรียมชุดกันฝนช่วงพฤษภาคมถึงตุลาคม แม้พายุฝนช่วงบ่ายมักผ่านไปอย่างรวดเร็ว สนามไดรฟ์ที่ทางเข้าสโมสรมีไฟส่องสว่างและเปิดถึง 19:30 น. เหมาะสำหรับผู้ที่มาถึงช่วงค่ำหรือใครก็ตามที่ต้องการปรับจูนวงสวิงโดยไม่ต้องจองออกรอบเต็มรูปแบบ รถกอล์ฟเป็นตัวเลือกเสริมในราคาประมาณ 700 บาท สนามเดินได้แต่ก็มีเนินมากพอที่รถกอล์ฟจะคุ้มค่าในเดือนที่อากาศร้อน คุณภาพแคดดี้ของ Phuket Country Club ได้รับคำชมอย่างสม่ำเสมอในรีวิวต่าง ๆ ควรให้แคดดี้ช่วยอ่านกรีน โดยเฉพาะหลุมที่ล้อมรอบทะเลสาบใจกลางสนาม`,
        location_and_access: `Phuket Country Club ตั้งอยู่เลขที่ 80/1 หมู่ 7 ถนนวิชิตสงคราม ในกะทู้ ใจกลางภูเก็ต ห่างจากหาดป่าตองประมาณ 15 นาทีโดยรถยนต์ และห่างจากตัวเมืองภูเก็ต 10 นาที ส่วนสนามบินนานาชาติภูเก็ตอยู่ห่างออกไปราว 25-30 นาที ผู้มาเยือนจากกรุงเทพฯ ทุกคนเดินทางโดยเครื่องบินสู่ภูเก็ต (ประมาณ 1 ชั่วโมง 20 นาที) ตัวเลือกการเดินทางมาตรฐานได้แก่แท็กซี่ Grab แท็กซี่ท้องถิ่น และรถรับส่งของโรงแรม ทำเลใจกลางเกาะทำให้เดินทางมา Phuket Country Club ได้จากโรงแรมแทบทุกแห่งในภูเก็ตโดยไม่ต้องนั่งรถไกล`,
        rental_cta_context: `กำลังจะไป Phuket Country Club ในทริปเที่ยวเกาะของคุณใช่ไหม หากแผนการเดินทางมีการค้างคืนที่กรุงเทพฯ ก่อนหรือหลังทริป สามารถเช่าไม้กอล์ฟ TaylorMade หรือ Callaway ส่งถึงโรงแรมของคุณในกรุงเทพฯ ได้ ตัดปัญหาค่าโหลดสัมภาระของสายการบินไปได้ทั้งหมด`,
      },
    },
    ko: {
      title: `Phuket Country Club 푸켓 그린피 — 코스 가이드와 클럽 대여`,
      meta_description: `Phuket Country Club 그린피는 비수기 약 2,800바트, 성수기 약 4,000바트예요. 1989년 문을 연 푸켓 최초의 18홀 코스와 Kathu 중심부라는 좋은 위치까지 함께 안내해 드려요.`,
      prose: {
        overview: `Phuket Country Club은 푸켓에서 가장 먼저 조성된 챔피언십 코스라는 이름을 지닌 골프장이에요. 섬 최초의 18홀 레이아웃으로 1989년에 문을 열었고, 설계는 Dr. Sukitti Klangvisai가 맡았습니다. Kathu의 옛 주석 광산 부지를 되살린 땅 위에 지어졌죠. 개장 30년을 훌쩍 넘긴 코스는 세월과 함께 무르익어, 오래 자란 나무가 그늘을 드리우고 푸켓 내륙 풍경을 규정하는 석회암 언덕과 절벽이 둘러싼 개성 있는 레이아웃이 되었어요. 푸켓의 새로운 코스들이 오션뷰와 리조트 인프라를 매력의 근거로 삼는다면, Phuket Country Club의 개성은 지형과 역사에서 나옵니다. Patong Beach에서 약 15분, Phuket Town에서 약 10분 거리로 섬에서 가장 중심에 가까운 골프 시설이에요. 클럽은 18홀 Old Course와 더 짧은 9홀 Country Club Course를 함께 운영하는데, 챔피언십 레이아웃인 Old Course가 이 가이드의 대상입니다. 클럽 입구에 있는 52베이 야간 조명 드라이빙 레인지는 푸켓에서 손꼽히는 연습 시설로 통해요.`,
        layout_and_experience: `18홀 파 72의 Old Course는 블루 티에서 전장 6,484야드예요. 주석 광산이던 과거가 빚어낸 지형 위에 펼쳐지는데, 자연스러운 웅덩이와 솟은 구역이 이어지는 기복을 원래 설계팀이 시각적 변화와 전략적 선택지로 살려 냈습니다. 레이아웃은 세 가지 다른 환경으로 이루어져 있어요. 탁 트인 파크랜드 페어웨이, 오래된 나무와 열대 식생이 감싸는 구역, 그리고 코스 한가운데 큰 호수를 감아 도는 홀들이죠. 가장 이름난 홀은 파 5의 10번 홀이에요. 페어웨이가 거대한 호수를 180도로 휘감고 돌아, 어디에 레이업할지 아니면 과감하게 캐리로 넘길지 신중한 판단을 요구합니다. 그린은 스피드가 중간 정도로 일정하고, 잘 맞은 어프로치에는 정직하게 반응해 줘요. 카트가 필수가 아니라 캐디와 함께 걸어서 라운딩할 수 있다는 점도 매력인데, 레이아웃을 더 가깝게 그리고 태국의 전통적인 방식으로 느낄 수 있거든요. 진행 속도는 주말 오전을 빼면 대체로 좋습니다. 클럽 전체에는 국제적인 리조트 코스라기보다 지역에 뿌리내린 오래된 클럽의 공기가 흘러요.`,
        tips: `주중 이른 아침 티타임이면 선선한 기온과 한산한 페어웨이라는 최고의 조합을 누릴 수 있어요. 성수기(11월~3월)에는 방문객이 늘지만 날씨는 일 년 중 가장 좋습니다. 내륙에 자리한 덕분에 해안 코스에 영향을 주는 바닷바람에서 어느 정도 보호받아요. 5월부터 10월까지는 우비를 챙기는 편이 좋은데, 오후 스콜은 금방 지나갑니다. 클럽 입구의 드라이빙 레인지는 야간 조명을 갖추고 19:30까지 운영해서, 늦게 도착한 날이나 라운딩 예약 없이 스윙만 다듬고 싶을 때 안성맞춤이에요. 카트는 700바트의 선택 사항이고, 걸어서 돌 수 있는 코스지만 기복이 있어 더운 달에는 이용을 고려해 볼 만합니다. Phuket Country Club의 캐디 수준은 리뷰에서 한결같이 좋은 평가를 받아요. 특히 가운데 호수를 두르는 홀에서는 그린 읽기를 캐디에게 맡겨 보세요.`,
        location_and_access: `Phuket Country Club의 주소는 푸켓 중심부 Kathu의 Vichitsongkram Road 80/1 Moo 7이에요. Patong Beach에서 차로 약 15분, Phuket Town에서 약 10분 거리이고, 푸켓 국제공항에서는 약 25~30분입니다. 방콕에서 오는 방문객은 모두 비행기로 푸켓에 들어와요(약 1시간 20분). 교통수단은 Grab과 현지 택시, 호텔 픽업 서비스가 일반적이에요. 섬 중심이라는 위치 덕분에 푸켓의 거의 모든 호텔에서 긴 이동 없이 닿을 수 있습니다.`,
        rental_cta_context: `섬 여행길에 Phuket Country Club을 찾을 계획이라면, 일정에 방콕에서의 하루가 앞뒤로 끼어 있는지 살펴보세요. TaylorMade나 Callaway 클럽을 방콕 호텔까지 받아 보면 항공사 수하물 요금을 통째로 아낄 수 있어요.`,
      },
    },
    zh: {
      title: `Phuket Country Club果岭费与球场攻略 — 普吉最早的18洞`,
      meta_description: `Phuket Country Club果岭费淡季约2,800泰铢、旺季约4,000泰铢。这是普吉第一座18洞球场，1989年开放，坐落于Kathu中心地带，交通便利。`,
      prose: {
        overview: `Phuket Country Club拥有一个特别的头衔：普吉最早的锦标赛级球场。它是岛上建成的第一条18洞布局，1989年开放，由Dr. Sukitti Klangvisai设计，建在Kathu的锡矿复垦地上。如今球场已步入第四个十年，岁月把它养成了一条成熟而有性格的布局——高大的树木洒下浓荫，石灰岩丘陵与崖壁环绕四周，那正是普吉内陆景观的标志。当普吉更新的球场靠海景与度假村配套吸引人时，Phuket Country Club的魅力来自地形与历史。球场距Patong Beach约15分钟、距Phuket Town约10分钟，是全岛位置最靠中心的高尔夫设施。俱乐部同时经营18洞的Old Course与较短的9洞Country Club Course，其中Old Course是锦标赛布局，也是本篇攻略的主角。会所入口处那座52个球位、配有夜间照明的练习场，是普吉最好的练习设施之一。`,
        layout_and_experience: `18洞标准杆72的Old Course，从蓝色发球台量起6,484码，铺展在昔日锡矿塑造出的地形之上——起伏的土地带着天然的洼地与抬高的台地，最初的设计团队正是用这些地貌造出视觉变化与策略选择。整条布局横跨三种截然不同的环境：开阔的公园式球道、被老树与热带植被夹峙的区域，以及环绕球场中央大湖展开的球洞。5杆的第10洞是全场最著名的一个洞：球道绕着一片巨大的湖面拐出180度，你必须仔细判断在哪里垫杆，或者何时值得冒险一博、直接越水。果岭速度中等、滚动稳定，对打得扎实的攻果岭球给予回报。由于不强制使用球车，球手可以和球童一起走着打完全场——这是一种更亲近、也更具泰式传统的体验方式。除周末上午外，打球节奏通常不错。整座俱乐部的气息更像一家扎根本地的老牌球会，而非国际化的度假村球场。`,
        tips: `平日清早的开球时间，能同时收获温和的气温与不拥挤的球道。旺季（11月至3月）访客更多，但天气也是一年中最好的；球场位于内陆，多少能挡住影响海边球场的海风。5月到10月建议带上雨具，不过午后的阵雨往往很快就过去。会所入口的练习场配有夜间照明，营业到19:30，很适合抵达较晚的人，或者不想订整轮球、只想调一调挥杆的人。球车属可选项目，费用700泰铢——球场走得动，但起伏不小，天气热的月份值得考虑租一台。Phuket Country Club的球童水准在评价中一直广受称赞，尤其在环绕中央湖泊的那几个洞，不妨把读果岭的事交给他们。`,
        location_and_access: `Phuket Country Club地址为普吉中部Kathu的Vichitsongkram Road 80/1 Moo 7，距Patong Beach车程约15分钟，距Phuket Town约10分钟，距普吉国际机场大约25–30分钟。从曼谷前来的访客都搭飞机到普吉（约1小时20分钟）。常见的交通方式包括Grab、本地出租车与酒店接送。中心地带的位置，让你几乎从普吉任何一家酒店出发都不必长途奔波。`,
        rental_cta_context: `如果你的海岛行程会去Phuket Country Club，而前后又在曼谷住上一晚，可以把TaylorMade或Callaway球杆直接租到你的曼谷酒店，把航空公司的托运行李费整个省下来。`,
      },
    },
    ja: {
      title: `Phuket Country Club（プーケット）— グリーンフィー・コース紹介・クラブレンタル`,
      meta_description: `グリーンフィーはローシーズン約2,800THB、ハイシーズン約4,000THB。Phuket Country Clubは1989年開場、プーケット初の18ホールコースです。カトゥー中心部の好立地もご紹介します。`,
      prose: {
        overview: `Phuket Country Clubは、プーケットで最初に造られたチャンピオンシップコースという称号を持つゴルフ場です。島内初の18ホールレイアウトとして1989年に開場し、設計はDr. Sukitti Klangvisai。カトゥーの錫鉱山跡地を再生した土地に築かれました。開場から30年以上が経過した現在、コースは年月を重ねて成熟し、大きく育った木々に彩られ、プーケット中央部の内陸景観を特徴づける石灰岩の丘や断崖に囲まれた、個性豊かなレイアウトへと熟成しています。新しいプーケットのコースがオーシャンビューやリゾート施設を魅力の拠り所とするのに対し、Phuket Country Clubの持ち味は地形と歴史から生まれています。パトンビーチから約15分、プーケットタウンから約10分という、島内で最も中心に近いゴルフ施設です。クラブは18ホールのOld Courseと、より短い9ホールのCountry Club Courseを運営しており、チャンピオンシップレイアウトであるOld Courseが本ガイドの対象となります。クラブ入口にある52打席のナイター照明付きドライビングレンジは、プーケット屈指の練習施設に数えられます。`,
        layout_and_experience: `18ホール・パー72のOld Courseは、ブルーティーから全長6,484ヤード。錫鉱山だった過去に形づくられた、自然の窪地や高台がうねる地形の上に展開し、当初の設計チームはその起伏を活かして視覚的な変化と戦略の選択肢を生み出しました。レイアウトは3つの異なる環境で構成されています。開けたパークランドのフェアウェイ、成熟した木々と熱帯植物に囲まれたエリア、そしてコース中央の大きな湖を巡るホール群です。名物はパー5の10番ホール。フェアウェイが巨大な湖を180度回り込む形状で、どこにレイアップするか、いつ思い切ってキャリーで狙うかの慎重な判断が求められます。グリーンはスピードが中程度で転がりが安定しており、良いアプローチショットには素直に応えてくれます。カートが必須ではないため、キャディーとともに歩いてラウンドできるのも魅力で、レイアウトをより親密に、伝統的なタイの流儀で味わえます。プレーのペースは週末の午前を除けば概ね良好。クラブ全体に、国際的なリゾートコースというより、地元に根づいた老舗クラブの空気が流れています。`,
        tips: `平日の早朝のティータイムなら、穏やかな気温と空いたフェアウェイという最高の組み合わせが得られます。ハイシーズン（11月〜3月）はビジターが増えるものの、天候は一年で最も良い時期です。内陸に位置するため、海沿いのコースに影響する海風からはある程度守られています。5月から10月にかけては雨具の携行がおすすめですが、午後のスコールはすぐに通り過ぎます。クラブ入口のドライビングレンジはナイター照明付きで19:30まで営業しており、到着が遅い日や、ラウンドを予約せずにスイングを調整したいときに最適です。カートは約700THBのオプションで、歩いて回れるコースとはいえ起伏があるので、暑い時期には利用を検討する価値があります。Phuket Country Clubのキャディーの質はレビューでも一貫して高く評価されています。特に中央の湖を囲むホールでは、グリーンの読みをキャディーに任せてみてください。`,
        location_and_access: `Phuket Country Clubの所在地は、プーケット中央部カトゥーのウィチットソンクラーム通り80/1 Moo 7。パトンビーチから車で約15分、プーケットタウンから約10分の距離にあります。プーケット国際空港からはおよそ25〜30分です。バンコクからのビジターは全員、飛行機でプーケットへ移動します（約1時間20分）。交通手段はGrab、地元のタクシー、ホテルの送迎が標準的です。中心部という立地のおかげで、プーケットのほぼどのホテルからも長い移動なしでアクセスできます。`,
        rental_cta_context: `島旅行でPhuket Country Clubへ向かう予定ですか。旅程にバンコクでの前泊や後泊が含まれるなら、TaylorMadeやCallawayのクラブをバンコクのホテルまでお届けするレンタルをご利用ください。航空会社の手荷物料金を丸ごと節約できます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-20',
}
