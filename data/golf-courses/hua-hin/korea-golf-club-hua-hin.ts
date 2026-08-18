import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'korea-golf-club-hua-hin',
  region: 'hua-hin',
  name: `Hua Hin Korea Golf Club`,
  province: `Prachuap Khiri Khan`,
  designer: `Bob McFarland`,
  holes: 18,
  par: 72,
  year_opened: 1992,
  // Published rate is the 800 THB all-in package (green fee + caddie + cart);
  // no standalone green fee is published anywhere current.
  green_fee_weekday_thb: 800,
  green_fee_weekend_thb: 800,
  fees_verified_at: '2026-07-30',
  // Zero means INCLUDED, and that is the encoding SpecTable already reads: it
  // renders `> 0` as the amount, `=== 0` as "Included", and null as "—" (no
  // data). Both are inside the 800 THB all-in package — the prose and the
  // header comment above say so, and 300 + 500 = 800 would leave a zero green
  // fee, so they cannot have been surcharges. A first pass nulled them, which
  // stopped the fee card billing 800 + 300 + 500 but then asserted "unknown"
  // where this file asserts "included". NOTE this does not conflict with the
  // CLAUDE.md rule about `caddie_fee_thb: 0` — that rule forbids INFERRING
  // all-inclusiveness from a zero (seven courses carry it without being
  // all-inclusive); it does not forbid encoding a genuine inclusion as zero,
  // which is what SpecTable's "Included" branch already exists for.
  caddie_fee_thb: 0,
  cart_fee_thb: 0,
  caddie_required: true,
  cart_required: true,
  driving_range: true,
  website: 'https://www.facebook.com/HUAHINKOREAGOLFCLUB',
  phone: '+66 63 218 6636',
  latitude: 12.4332,
  longitude: 99.9767,
  distance_from_bangkok_km: 255,
  drive_time_from_bangkok_min: 210,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: 1500,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Hua Hin Korea Golf Club\",\n  \"url\": \"https://len.golf/golf-courses/hua-hin/korea-golf-club-hua-hin\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Pran Buri\",\n    \"addressRegion\": \"Prachuap Khiri Khan\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 12.4332,\n    \"longitude\": 99.9767\n  },\n  \"telephone\": \"+66 63 218 6636\",\n  \"priceRange\": \"฿\",\n  \"sameAs\": [\n    \"https://maps.google.com/?q=12.4332,99.9767\",\n    \"https://www.facebook.com/HUAHINKOREAGOLFCLUB\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `Hua Hin Korea Golf Club is one of the cheapest 18-hole golf courses in Thailand, with a published all-in package of just 800 THB covering green fee, caddie and cart — among the cheapest full 18-hole rounds anywhere in Thailand. The course was originally built in 1992 as Milford Golf Club by designer Bob McFarland, measuring 6,614 yards off the back tees at par 72. Over the decades it passed through several name changes — Milford Paradise, The Eagle Milford, Hua Hin Seoul Country Club — before Korean management rebranded it as the current Hua Hin Korea Golf Club. Located roughly 40 minutes south of Hua Hin town in Pran Buri, Prachuap Khiri Khan, the course sits in a mountain-framed coastal valley that gives it a scenic setting for the price. For golfers on a strict budget, or those who simply want a casual round without the pressure of a premium venue, this is a viable option — but the maintenance standards are modest and anyone accustomed to well-manicured conditions should set expectations accordingly.`,
    layout_and_experience: `The McFarland layout at what was originally Milford Golf Club uses the natural topography of the valley — mountain ridges to the west, coastal lowlands to the east — to create a course with reasonable visual variety. At 6,614 yards and par 72, the routing is comfortably mid-length, with a mix of par-4s that require straightforward tee-to-green shot-making and par-5s that offer birdie opportunities for longer hitters. The mountain backdrop is genuinely attractive and gives the course a more dramatic feel than the flat rate would suggest. That said, golfers should be prepared for the realities of a low-investment operation: reviewers have noted waterlogged bunkers after rain, patches of thin or unkempt turf on the fairways, and greens that can be slow or uneven. The course is rarely crowded — a genuine benefit that keeps pace of play brisk and the atmosphere relaxed.`,
    tips: `The best reason to play Hua Hin Korea Golf Club is the price: the all-in 800 THB package (green fee + caddie + cart) is among the cheapest 18-hole rounds available anywhere in Thailand. That value proposition is real, but manage expectations — course conditions are variable and have been described by multiple reviewers as below the standard of other Hua Hin-area clubs. Visit during the November–February dry season to reduce the risk of waterlogged bunkers and soft fairways. Because the course is rarely busy, pace of play is typically fast and you may often play through or ahead of other groups. Book by phone (+66 63 218 6636) or via the Facebook page; walk-ins are usually welcome but calling ahead is advisable. Bring your own water and snacks as on-course F&B facilities are limited. The caddie complement is small, so confirm availability in advance if playing in a larger group.`,
    location_and_access: `Hua Hin Korea Golf Club is located at 174 Moo 1, Pak Nam Pran, Pran Buri, Prachuap Khiri Khan 77220, approximately 40 minutes south of Hua Hin town centre by car. The drive from Bangkok covers approximately 255 kilometres via Highway 4 (Phetkasem Road) and takes around three and a half hours. From Hua Hin town, a taxi or Grab to the course runs roughly 200–300 THB. There is no shuttle service. GPS coordinates 12.4332, 99.9767. The course is not prominently signposted from the main highway, so GPS navigation is advisable.`,
    rental_cta_context: `Heading to Hua Hin Korea Golf Club? LENGOLF offers quality rental sets so you can keep your all-in costs low without the hassle of transporting clubs from Bangkok.`,
  },
  locales: {
    en: {
      title: `Hua Hin Korea Golf Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Play Hua Hin Korea Golf Club from just 800 THB all-in (green fee, caddie & cart). 18 holes, par 72. Rent clubs from LENGOLF before heading south from Bangkok.`,
    },
    th: {
      title: `Hua Hin Korea Golf Club ปราณบุรี — ค่ากรีนฟี รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `แพ็กเกจแบบรวมทุกอย่างที่ Hua Hin Korea Golf Club เริ่มต้น 800 บาท ครอบคลุมค่ากรีนฟี แคดดี้ และรถกอล์ฟ สนาม 18 หลุม พาร์ 72 ที่ปราณบุรี พร้อมบริการเช่าไม้กอล์ฟจาก LENGOLF ก่อนออกเดินทางจากกรุงเทพฯ`,
      prose: {
        overview: `Hua Hin Korea Golf Club เป็นหนึ่งในสนามกอล์ฟ 18 หลุมที่ราคาถูกที่สุดในประเทศไทย ด้วยแพ็กเกจแบบรวมทุกอย่างที่ประกาศไว้เพียง 800 บาท ครอบคลุมทั้งค่ากรีนฟี แคดดี้ และรถกอล์ฟ ซึ่งนับเป็นค่าออกรอบ 18 หลุมเต็มที่ถูกที่สุดแห่งหนึ่งเท่าที่หาได้ในประเทศไทย สนามแห่งนี้สร้างขึ้นครั้งแรกในปี 1992 ในชื่อ Milford Golf Club โดยนักออกแบบ Bob McFarland มีระยะ 6,614 หลาจากแท่นทีหลัง พาร์ 72 ตลอดหลายทศวรรษที่ผ่านมาสนามเปลี่ยนชื่อมาหลายครั้ง ทั้ง Milford Paradise, The Eagle Milford และ Hua Hin Seoul Country Club ก่อนที่ผู้บริหารชาวเกาหลีจะรีแบรนด์เป็น Hua Hin Korea Golf Club อย่างที่เป็นอยู่ในปัจจุบัน สนามตั้งอยู่ห่างจากตัวเมืองหัวหินลงไปทางใต้ราว 40 นาที ในอำเภอปราณบุรี จังหวัดประจวบคีรีขันธ์ อยู่ในหุบเขาชายฝั่งที่มีภูเขาโอบล้อม จึงให้ทัศนียภาพที่ดีเกินราคา สำหรับนักกอล์ฟที่มีงบจำกัด หรือผู้ที่อยากออกรอบสบาย ๆ โดยไม่ต้องกดดันแบบสนามระดับพรีเมียม ที่นี่ถือเป็นตัวเลือกที่ใช้ได้จริง แต่มาตรฐานการดูแลสนามอยู่ในระดับพอประมาณ ผู้ที่คุ้นเคยกับสภาพสนามที่ตัดแต่งอย่างประณีตควรตั้งความคาดหวังให้เหมาะสม`,
        layout_and_experience: `เลย์เอาต์ของ McFarland ในสนามที่เดิมชื่อ Milford Golf Club ใช้ภูมิประเทศตามธรรมชาติของหุบเขา ทั้งแนวสันเขาทางทิศตะวันตกและที่ราบลุ่มชายฝั่งทางทิศตะวันออก เพื่อสร้างสนามที่มีความหลากหลายทางสายตาพอสมควร ด้วยระยะ 6,614 หลา พาร์ 72 การวางผังจึงอยู่ในช่วงระยะกลางที่เล่นได้สบาย ผสมผสานหลุมพาร์ 4 ที่ต้องการการตีจากแท่นทีถึงกรีนอย่างตรงไปตรงมา และหลุมพาร์ 5 ที่เปิดโอกาสทำเบอร์ดี้สำหรับผู้ที่ตีได้ไกล ฉากหลังภูเขาสวยงามอย่างแท้จริง และทำให้สนามดูน่าตื่นตากว่าที่ราคาค่าออกรอบจะบ่งบอก อย่างไรก็ตาม นักกอล์ฟควรเตรียมใจกับความเป็นจริงของสนามที่ลงทุนไม่สูง มีผู้เข้าเล่นหลายรายระบุว่าบังเกอร์มีน้ำขังหลังฝนตก แฟร์เวย์มีหญ้าบางหรือไม่ได้รับการดูแลเป็นหย่อม ๆ และกรีนอาจช้าหรือไม่สม่ำเสมอ ข้อดีที่แท้จริงคือสนามแทบไม่แออัด จังหวะการเล่นจึงลื่นไหลและบรรยากาศผ่อนคลาย`,
        tips: `เหตุผลที่ดีที่สุดในการมาเล่นที่ Hua Hin Korea Golf Club คือราคา แพ็กเกจแบบรวมทุกอย่าง 800 บาท (ค่ากรีนฟี แคดดี้ และรถกอล์ฟ) นับเป็นค่าออกรอบ 18 หลุมที่ถูกที่สุดแห่งหนึ่งเท่าที่หาได้ในประเทศไทย ความคุ้มค่านี้เป็นเรื่องจริง แต่ควรตั้งความคาดหวังให้พอดี เพราะสภาพสนามไม่สม่ำเสมอ และมีผู้เข้าเล่นหลายรายระบุว่าต่ำกว่ามาตรฐานของสนามอื่นในย่านหัวหิน ควรมาเล่นช่วงฤดูแล้งระหว่างเดือนพฤศจิกายน-กุมภาพันธ์ เพื่อลดความเสี่ยงที่บังเกอร์จะมีน้ำขังและแฟร์เวย์นิ่ม เนื่องจากสนามแทบไม่พลุกพล่าน จังหวะการเล่นจึงมักรวดเร็ว และคุณอาจได้แซงหรือเล่นนำหน้ากลุ่มอื่นอยู่บ่อยครั้ง จองผ่านโทรศัพท์ (+66 63 218 6636) หรือทางเพจ Facebook โดยปกติแล้ววอล์กอินได้ แต่แนะนำให้โทรแจ้งล่วงหน้า ควรเตรียมน้ำดื่มและของว่างไปเอง เพราะบริการอาหารและเครื่องดื่มในสนามมีจำกัด จำนวนแคดดี้มีไม่มาก หากมาเป็นกลุ่มใหญ่ควรยืนยันเรื่องแคดดี้ล่วงหน้า`,
        location_and_access: `Hua Hin Korea Golf Club ตั้งอยู่ที่ 174 หมู่ 1 ตำบลปากน้ำปราณ อำเภอปราณบุรี จังหวัดประจวบคีรีขันธ์ 77220 ห่างจากใจกลางเมืองหัวหินลงไปทางใต้ราว 40 นาทีโดยรถยนต์ การขับรถจากกรุงเทพฯ มีระยะทางประมาณ 255 กิโลเมตรผ่านทางหลวงหมายเลข 4 (ถนนเพชรเกษม) ใช้เวลาราวสามชั่วโมงครึ่ง จากตัวเมืองหัวหิน ค่าแท็กซี่หรือ Grab มาที่สนามอยู่ที่ประมาณ 200-300 บาท และไม่มีบริการรถรับส่ง พิกัด GPS คือ 12.4332, 99.9767 สนามไม่มีป้ายบอกทางที่เด่นชัดจากถนนใหญ่ จึงแนะนำให้ใช้ GPS นำทาง`,
        rental_cta_context: `กำลังจะไปออกรอบที่ Hua Hin Korea Golf Club ใช่ไหม LENGOLF มีชุดไม้กอล์ฟให้เช่าคุณภาพดี ช่วยให้คุณคุมค่าใช้จ่ายรวมไว้ให้ต่ำได้ โดยไม่ต้องยุ่งยากกับการขนไม้กอล์ฟลงไปจากกรุงเทพฯ`,
      },
    },
    ko: {
      title: `Hua Hin Korea Golf Club 그린피 — 800바트 올인클루시브 18홀 코스 가이드`,
      meta_description: `Hua Hin Korea Golf Club 공표 요금은 그린피와 캐디, 카트를 모두 포함한 800바트 올인클루시브 패키지예요. 쁘라추압키리칸주 Pran Buri에 자리한 18홀 파 72 코스 정보와, 방콕에서 미리 챙기는 LENGOLF 클럽 대여를 안내해요.`,
      prose: {
        overview: `Hua Hin Korea Golf Club 코스는 태국에서 가장 저렴한 18홀 골프장 가운데 하나예요. 공표 요금은 그린피와 캐디, 카트를 모두 포함한 800바트 올인클루시브 패키지로, 태국 어디를 둘러봐도 손에 꼽을 만큼 저렴한 18홀 풀 라운딩 가격입니다. 이 코스의 출발점은 1992년 Bob McFarland 설계로 문을 연 Milford Golf Club입니다. 뒤쪽 티에서 전장 6,614야드, 파 72 규모예요. 이후 수십 년 동안 Milford Paradise, The Eagle Milford, Hua Hin Seoul Country Club 등으로 이름이 여러 차례 바뀌었고, 한국계 경영진이 리브랜딩하면서 지금의 Hua Hin Korea Golf Club 이름으로 자리 잡았어요. 위치는 후아힌 시내에서 남쪽으로 차로 약 40분 떨어진 쁘라추압키리칸주 Pran Buri 지역이고, 산으로 둘러싸인 해안 골짜기에 자리해 가격에 비해 경관이 훌륭합니다. 예산을 빠듯하게 잡은 골퍼나, 고급 코스 특유의 부담 없이 가볍게 라운딩하고 싶은 분에게는 충분히 쓸 만한 선택이에요. 다만 관리 수준은 소박한 편이라, 잘 손질된 코스에 익숙하다면 기대치를 그에 맞춰 두는 편이 좋아요.`,
        layout_and_experience: `원래 Milford Golf Club 시절부터 이어져 온 McFarland 레이아웃은 골짜기의 자연 지형을 그대로 활용해요. 서쪽으로는 산 능선, 동쪽으로는 해안 저지대가 펼쳐져 시각적으로 제법 변화가 있는 코스가 만들어졌습니다. 전장 6,614야드에 파 72라 길이는 부담 없는 중간 수준이고, 티에서 그린까지 정직한 샷 메이킹을 요구하는 파 4 홀과 장타자에게 버디 기회를 열어 주는 파 5 홀이 섞여 있어요. 산을 배경으로 삼은 풍경은 실제로 보기 좋고, 저렴한 요금에서 짐작하는 것보다 훨씬 극적인 인상을 줍니다. 다만 투자 규모가 크지 않은 운영이라는 현실도 감안해야 해요. 비가 온 뒤 물이 고인 벙커, 페어웨이 곳곳의 얇거나 손질이 덜 된 잔디, 느리거나 고르지 않은 그린을 지적한 후기가 여럿 있습니다. 대신 붐비는 일이 거의 없다는 점은 분명한 장점이라, 진행이 빠르고 분위기도 여유로워요.`,
        tips: `Hua Hin Korea Golf Club 코스를 찾는 가장 큰 이유는 가격이에요. 그린피와 캐디, 카트를 묶은 800바트 올인클루시브 패키지는 태국 전역을 통틀어도 가장 저렴한 축에 드는 18홀 라운딩 요금입니다. 이 가성비는 실제로 체감되지만 기대치는 조절하는 편이 좋아요. 코스 상태가 들쭉날쭉하고, 후아힌 일대 다른 클럽보다 못하다는 평이 여러 후기에서 반복됩니다. 물이 고인 벙커와 물러진 페어웨이를 피하려면 11~2월 건기에 방문하세요. 붐비지 않는 코스라 진행이 대체로 빠르고, 앞 팀을 지나가거나 앞서 나가며 도는 경우도 많아요. 예약은 전화(+66 63 218 6636)나 Facebook 페이지로 하면 되고, 워크인도 대개 받아 주지만 미리 전화해 두는 편이 안전합니다. 코스 안의 식음료 시설이 제한적이니 물과 간식은 챙겨 가세요. 캐디 인원이 많지 않아서, 일행이 많다면 미리 배정 가능 여부를 확인해 두세요.`,
        location_and_access: `Hua Hin Korea Golf Club 주소는 174 Moo 1, Pak Nam Pran, Pran Buri, Prachuap Khiri Khan 77220입니다. 후아힌 시내 중심부에서 차로 남쪽으로 약 40분 거리예요. 방콕에서는 4번 국도(Phetkasem Road) 경로로 약 255km, 세 시간 반쯤 걸립니다. 후아힌 시내에서 택시나 Grab 이용 요금은 200~300바트 정도이고, 셔틀 서비스는 없어요. GPS 좌표는 12.4332, 99.9767입니다. 큰길에서 코스 안내 표지가 눈에 잘 띄지 않으니 GPS 내비게이션을 쓰는 편이 좋아요.`,
        rental_cta_context: `Hua Hin Korea Golf Club 라운딩을 계획 중이라면 LENGOLF 클럽 대여를 활용해 보세요. 품질 좋은 대여 세트를 갖추고 있어, 방콕에서 골프백을 들고 내려가는 번거로움 없이 전체 비용을 낮게 유지할 수 있어요.`,
      },
    },
    zh: {
      title: `Hua Hin Korea Golf Club果岭费与球场攻略 — 800泰铢全包18洞`,
      meta_description: `Hua Hin Korea Golf Club公布价为800泰铢全包，含果岭费、球童与球车。这座18洞标准杆72的球场位于华欣以南的Pran Buri，另附从曼谷出发前就能备好的LENGOLF球杆租借。`,
      prose: {
        overview: `Hua Hin Korea Golf Club是泰国最便宜的18洞球场之一，公布的全包套餐只要800泰铢，果岭费、球童与球车全都包含在内——放眼全泰国，打满18洞的价格也很少低于这个数。这座球场最初于1992年以Milford Golf Club的名字开门，由Bob McFarland设计，后发球台量起6,614码，标准杆72。此后数十年里它几度易名，先后叫过Milford Paradise、The Eagle Milford与Hua Hin Seoul Country Club，直到韩资管理层将它更名为如今的Hua Hin Korea Golf Club。球场位于华欣镇以南约40分钟车程的巴蜀府Pran Buri，坐落在群山环抱的沿海谷地里，就这个价位而言景色相当出色。如果你预算吃紧，或者只想轻松打一场、不必承受高端球场的压力，这里是个可行的选择——但养护标准只算一般，习惯了精致草况的球友最好先把期待值放到合适的位置。`,
        layout_and_experience: `这条出自McFarland之手、最初属于Milford Golf Club的布局，充分借用了谷地的天然地势：西边是山脊，东边是沿海低地，视觉上因此有了不错的变化。全长6,614码、标准杆72，整体属于长度适中、打起来不吃力的路线，既有需要从发球台到果岭老老实实推进的4杆洞，也有让长打者抓鸟的5杆洞。以群山为背景的画面确实好看，比这个平价费率让人预期的更有气势。不过也要做好心理准备：这是一座投入有限的球场，不少球友提到雨后沙坑积水、球道上有草皮稀疏或疏于修剪的地块，果岭有时偏慢或不平整。好在这里几乎不拥挤，这是实实在在的优点，打球节奏顺畅，气氛也轻松。`,
        tips: `来Hua Hin Korea Golf Club打球最充分的理由就是价格：800泰铢的全包套餐（果岭费、球童与球车）属于全泰国最便宜的18洞行情之一。这份超值是真的，但期待值要放平——草况时好时坏，多位球友都说不如华欣一带的其他球会。建议挑11月–2月的旱季前来，可以降低沙坑积水和球道松软的概率。因为球场很少客满，打球节奏通常很快，你多半能越过前组或走在其他组前面。预订可以打电话（+66 63 218 6636）或通过Facebook页面；一般也接受现场登记，不过提前致电更稳妥。场内餐饮设施有限，水和零食最好自己带上。球童人数不多，若是人多的团体，建议提前确认能否安排。`,
        location_and_access: `Hua Hin Korea Golf Club的地址是174 Moo 1, Pak Nam Pran, Pran Buri, Prachuap Khiri Khan 77220，从华欣镇中心驾车向南约40分钟即到。从曼谷出发全程约255公里，走4号公路（Phetkasem Road），车程约三个半小时。从华欣镇打车或叫Grab到球场大约200–300泰铢，没有接驳班车。GPS坐标为12.4332, 99.9767。球场在主干道上的指示牌并不显眼，建议用GPS导航。`,
        rental_cta_context: `准备去Hua Hin Korea Golf Club打一场？LENGOLF提供品质可靠的租借球杆套组，让你把全包成本继续压低，也省去从曼谷把球杆一路扛下去的麻烦。`,
      },
    },
    ja: {
      title: `Hua Hin Korea Golf Club（ホアヒン）— グリーンフィー・コース紹介・クラブレンタル`,
      meta_description: `公表料金はグリーンフィー・キャディー・カート込みで800THBのオールインパッケージ。Hua Hin Korea Golf Clubはホアヒンの南、プラチュアップキリカン県プランブリーにある18ホール・パー72のコースです。バンコクで用意できるLENGOLFのクラブレンタルもご案内します。`,
      prose: {
        overview: `Hua Hin Korea Golf Clubは、タイでもっとも安い18ホールコースのひとつです。公表されているグリーンフィー・キャディー・カート込みのオールインパッケージはわずか800THBで、フル18ホールのラウンド料金としてはタイ全土でも最安クラスに入ります。開場は1992年、当時の名称はMilford Golf Clubで、設計はBob McFarlandが手がけました。バックティーからの全長は6,614ヤード、パー72です。その後の数十年でMilford Paradise、The Eagle Milford、Hua Hin Seoul Country Clubと何度か名前が変わり、韓国系の経営陣によるリブランドを経て今のHua Hin Korea Golf Clubになりました。所在地はホアヒンの町から南へ車で約40分、プラチュアップキリカン県のプランブリー。山に囲まれた海沿いの谷あいに広がっており、料金を考えれば景観はかなり贅沢です。予算をできるだけ抑えたい方や、高級コース特有の緊張感なしに気軽に回りたい方には十分に現実的な選択肢といえます。ただし整備の水準は控えめで、手入れの行き届いたコンディションに慣れている方は期待値を調整しておくとよいでしょう。`,
        layout_and_experience: `もともとMilford Golf Clubとして造られたMcFarland設計のレイアウトは、谷の自然地形をそのまま生かしています。西側に山の稜線、東側に海沿いの低地という配置が、視覚的な変化をほどよく生み出しました。全長6,614ヤード、パー72という数字どおり距離は無理のないミドルレンジで、ティーからグリーンまで素直なショットメイキングを求められるパー4と、飛ばし屋にバーディーチャンスが開けるパー5が組み合わされています。山を背にした眺めは実際に美しく、料金の安さから想像するよりもずっとドラマチックな印象を受けるはずです。一方で、投資規模の大きくない運営であることは頭に入れておきたいところ。雨のあと水の残るバンカー、フェアウェイの薄い芝や手入れの行き届かない部分、遅かったり不均一だったりするグリーンを指摘する声も少なくありません。混雑がほとんどないのは確かな利点で、プレーのペースは速く、雰囲気もゆったりしています。`,
        tips: `Hua Hin Korea Golf Clubを選ぶ最大の理由は料金です。グリーンフィー・キャディー・カートを含む800THBのオールインパッケージは、タイ国内で手に入る18ホールのラウンド料金として最安クラスに入ります。このコストパフォーマンスは本物ですが、期待値の調整は必要。コンディションにはばらつきがあり、ホアヒン周辺のほかのクラブより見劣りするという声が複数寄せられています。バンカーの水たまりやぬかるんだフェアウェイのリスクを下げたいなら、11月〜2月の乾季に訪れるのがおすすめです。混み合うことが少ないため進行は概して速く、前の組を追い越したり先行したりする場面も多くなります。予約は電話（+66 63 218 6636）またはFacebookページから。ウォークインもたいてい受け付けてもらえますが、事前に電話を入れておくと安心です。コース内の飲食設備は限られているので、水や軽食は持参しましょう。キャディーの人数は多くないため、大人数で回る場合は事前に手配できるかどうか確認してください。`,
        location_and_access: `Hua Hin Korea Golf Clubの所在地は174 Moo 1, Pak Nam Pran, Pran Buri, Prachuap Khiri Khan 77220。ホアヒンの町の中心部から車で南へ約40分です。バンコクからは国道4号線（Phetkasem Road）経由で約255km、所要時間はおよそ3時間30分。ホアヒンの町からタクシーまたはGrabを利用した場合の料金はおおむね200〜300THBで、シャトルサービスはありません。GPS座標は12.4332, 99.9767。幹線道路からの案内表示が目立たないため、GPSナビの利用をおすすめします。`,
        rental_cta_context: `Hua Hin Korea Golf Clubでのラウンドをお考えなら、LENGOLFのレンタルクラブをご利用ください。品質の確かなレンタルセットをご用意しているので、バンコクから自分のクラブを運ぶ手間をかけずに、オールインの費用を低く抑えたまま出かけられます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-20',
}
