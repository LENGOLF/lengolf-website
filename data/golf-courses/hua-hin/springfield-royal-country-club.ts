import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'springfield-royal-country-club',
  region: 'hua-hin',
  name: `Springfield Royal Country Club`,
  province: `Phetchaburi`,
  designer: `Jack Nicklaus`,
  holes: 27,
  par: 72,
  year_opened: 1993,
  green_fee_weekday_thb: 1600,
  green_fee_weekend_thb: 1600,
  caddie_fee_thb: 350,
  // Prose quotes "1,600 THB walking or 2,400 THB with a cart", so this file
  // asserts a cart of 2,400 - 1,600 = 800. 850 made the rendered fee card sum
  // to 2,450, contradicting the prose two elements above it.
  cart_fee_thb: 800,
  caddie_required: true,
  cart_required: false,
  driving_range: true,
  website: 'https://www.springfieldresort.com/golf/',
  phone: '+66 32 709 256',
  latitude: 12.7098,
  longitude: 99.8655,
  distance_from_bangkok_km: 200,
  drive_time_from_bangkok_min: 150,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: 900,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Springfield Royal Country Club\",\n  \"url\": \"https://len.golf/golf-courses/hua-hin/springfield-royal-country-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Phetchaburi\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 12.7098,\n    \"longitude\": 99.8655\n  },\n  \"telephone\": \"+66 32 709 256\",\n  \"priceRange\": \"฿฿฿\",\n  \"sameAs\": [\n    \"https://maps.google.com/?q=12.7098,99.8655\",\n    \"https://www.springfieldresort.com/golf/\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": false\n    }\n  ]\n}",
  prose: {
    overview: `Springfield Royal Country Club carries the distinction of being one of only a handful of Jack Nicklaus-designed courses in Thailand. The original 18-hole layout opened in 1993 in Cha-am, Phetchaburi, and a third nine was added in 2005 to bring the complex to 27 holes. Springfield has been ranked in the top 10 best golf courses in Thailand by Golf Digest, a recognition that reflects both the quality of the Nicklaus design and the course's consistent maintenance. The layout is set within the Springfield Resort complex, which includes hotel accommodation, restaurants, a spa, and swimming pools, making it a viable base for a multi-day golf trip. At 1,600 THB walking or 2,400 THB with a cart (caddie compulsory at 350 THB), Springfield sits in the mid-range of Hua Hin area pricing, offering genuine championship credentials at an accessible price point.`,
    layout_and_experience: `Nicklaus's design at Springfield makes excellent use of the terrain north of Hua Hin, which transitions from flat coastal plains to gently rolling hillside as you move inland toward the Tenasserim mountain range. The course features five sets of tees, making it accessible for a wide range of handicaps while offering a stern test from the championship markers. The 27 holes are divided into three named nines — A, B, and C — that can be combined in any pairing for an 18-hole round. The design hallmarks of the Nicklaus style are evident throughout: generous fairway landing zones that tighten on approach, strategically positioned water hazards that reward precise shot-making, and large, contoured putting surfaces that require careful reading. The mountain backdrop creates a scenic setting distinct from the more coastal layouts in the region. The third nine added in 2005 is generally considered the most challenging of the three loops, with tighter fairways and more demanding approach angles. Golf Academy facilities are available for players wanting coaching before or after their round.`,
    tips: `Springfield's location in Cha-am, approximately 30 minutes north of central Hua Hin, makes it a natural pairing with Palm Hills Golf Club, which is nearby. Plan transfers accordingly if combining the two courses in one trip. The Nicklaus-designed layout rewards course management rather than power — take note of caddie advice on club selection and green reading, as the large putting surfaces can be deceptive in their slope. Cha-am is slightly more exposed to coastal breezes than courses further inland; factor wind direction into club selection on the more open holes. The twilight rate (1,250 THB from 14:00) offers excellent value but leaves limited time to complete a full 18 holes comfortably in daylight; arrive no later than 13:45. During the golf festival periods (typically August–September), the course offers promotional rates.`,
    location_and_access: `Springfield Royal Country Club is located at 208 Moo 2, Sampraya, Cha-am, Phetchaburi, approximately 200 kilometres south of Bangkok. The drive from central Bangkok takes approximately 2.5 hours via Highway 4. The course is around 30 minutes north of Hua Hin town by taxi or Grab. Minivan services from Victory Monument in Bangkok connect to both Cha-am and Hua Hin several times daily. The resort complex offers on-site accommodation for golfers seeking a multi-night stay.`,
    rental_cta_context: `Playing the Jack Nicklaus-designed Springfield Royal Country Club without your own clubs? LENGOLF rental sets travel with you — arrive at this championship layout fully equipped and ready to compete.`,
  },
  locales: {
    en: {
      title: `Springfield Royal Country Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Springfield Royal Country Club green fees, course overview, tips, and how to arrange golf club rentals delivered to your Bangkok hotel.`,
    },
    th: {
      title: `Springfield Royal Country Club ชะอำ — ค่ากรีนฟี รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `ค่ากรีนฟี Springfield Royal Country Club อยู่ที่ 1,600 บาทแบบเดิน และ 2,400 บาทเมื่อใช้รถกอล์ฟ (แคดดี้เป็นข้อบังคับ 350 บาท) รีวิวสนาม 27 หลุมของ Jack Nicklaus ที่ชะอำ พร้อมเช่าไม้กอล์ฟส่งถึงโรงแรมในกรุงเทพฯ`,
      prose: {
        overview: `Springfield Royal Country Club โดดเด่นในฐานะหนึ่งในไม่กี่สนามกอล์ฟที่ออกแบบโดย Jack Nicklaus ในประเทศไทย เลย์เอาต์ 18 หลุมดั้งเดิมเปิดให้บริการในปี 1993 ที่ชะอำ จังหวัดเพชรบุรี และมีการเพิ่ม 9 หลุมชุดที่สามในปี 2005 ทำให้คอมเพล็กซ์แห่งนี้มีครบ 27 หลุม Springfield เคยติดอันดับ 10 สนามกอล์ฟที่ดีที่สุดในประเทศไทยจากการจัดอันดับของ Golf Digest ซึ่งเป็นการยอมรับที่สะท้อนทั้งคุณภาพของงานออกแบบโดย Nicklaus และการดูแลสภาพสนามอย่างสม่ำเสมอ ตัวสนามตั้งอยู่ภายในคอมเพล็กซ์ Springfield Resort ซึ่งมีทั้งที่พักระดับโรงแรม ร้านอาหาร สปา และสระว่ายน้ำ จึงใช้เป็นฐานสำหรับทริปกอล์ฟหลายวันได้จริง ด้วยราคา 1,600 บาทแบบเดิน หรือ 2,400 บาทเมื่อใช้รถกอล์ฟ (แคดดี้เป็นข้อบังคับ ค่าแคดดี้ 350 บาท) Springfield จึงอยู่ในระดับกลางของราคาสนามย่านหัวหิน พร้อมมอบคุณสมบัติระดับแชมเปียนชิพของแท้ในราคาที่เข้าถึงได้`,
        layout_and_experience: `งานออกแบบของ Nicklaus ที่ Springfield ใช้ประโยชน์จากภูมิประเทศทางเหนือของหัวหินได้อย่างยอดเยี่ยม พื้นที่บริเวณนี้เปลี่ยนจากที่ราบชายฝั่งอันราบเรียบไปสู่เนินเขาลาดเอียงอย่างนุ่มนวลเมื่อเคลื่อนเข้าสู่พื้นที่ตอนในไปทางเทือกเขาตะนาวศรี สนามมีแท่นทีให้เลือกถึงห้าชุด จึงรองรับนักกอล์ฟได้หลากหลายระดับแฮนดิแคป ขณะเดียวกันก็เป็นบททดสอบที่เข้มข้นเมื่อเล่นจากแท่นทีแชมเปียนชิพ ทั้ง 27 หลุมแบ่งออกเป็นสามลูป 9 หลุมที่มีชื่อว่า A, B และ C ซึ่งจับคู่กันแบบใดก็ได้เพื่อเล่นให้ครบ 18 หลุม เอกลักษณ์ของสไตล์ Nicklaus ปรากฏชัดตลอดทั้งสนาม ทั้งพื้นที่ลงลูกบนแฟร์เวย์ที่กว้างขวางแต่บีบแคบลงเมื่อเข้าใกล้กรีน อุปสรรคน้ำที่วางตำแหน่งอย่างมีกลยุทธ์ซึ่งให้รางวัลแก่ช็อตที่แม่นยำ และกรีนขนาดใหญ่ที่มีลอนคลื่นซึ่งต้องอ่านไลน์อย่างพิถีพิถัน ฉากหลังที่เป็นแนวภูเขาสร้างบรรยากาศงดงามและแตกต่างจากสนามที่อยู่ใกล้ชายฝั่งกว่าในภูมิภาคนี้ ส่วน 9 หลุมชุดที่สามซึ่งเพิ่มเข้ามาในปี 2005 โดยทั่วไปถือกันว่าท้าทายที่สุดในสามลูป ด้วยแฟร์เวย์ที่แคบกว่าและมุมเข้ากรีนที่เรียกร้องมากกว่า นอกจากนี้ยังมีสิ่งอำนวยความสะดวกของ Golf Academy ไว้บริการผู้เล่นที่ต้องการเรียนกอล์ฟก่อนหรือหลังออกรอบ`,
        tips: `ทำเลของ Springfield ที่ชะอำ ซึ่งอยู่ห่างจากใจกลางหัวหินขึ้นไปทางเหนือประมาณ 30 นาที ทำให้จับคู่กับ Palm Hills Golf Club ที่อยู่ใกล้เคียงได้อย่างลงตัว หากวางแผนเล่นทั้งสองสนามในทริปเดียว ควรจัดตารางรถรับส่งให้สอดคล้องกัน เลย์เอาต์ที่ออกแบบโดย Nicklaus ให้รางวัลกับการวางแผนการเล่นมากกว่าพลัง จึงควรรับฟังคำแนะนำของแคดดี้เรื่องการเลือกไม้และการอ่านกรีน เพราะกรีนขนาดใหญ่เหล่านี้อาจหลอกตาในเรื่องความลาดเอียงได้ ชะอำเปิดรับลมทะเลมากกว่าสนามที่อยู่ลึกเข้าไปในแผ่นดินอยู่เล็กน้อย จึงควรนำทิศทางลมมาคิดในการเลือกไม้บนหลุมที่เปิดโล่ง อัตราทไวไลท์ (1,250 บาท ตั้งแต่ 14:00 น.) ให้ความคุ้มค่าสูงมาก แต่เหลือเวลาไม่มากนักสำหรับการเล่นครบ 18 หลุมอย่างสบาย ๆ ในช่วงที่ยังมีแสง จึงควรไปถึงไม่เกิน 13:45 น. และในช่วงเทศกาลกอล์ฟ (โดยทั่วไปคือสิงหาคม-กันยายน) สนามมีอัตราค่าบริการโปรโมชันให้ด้วย`,
        location_and_access: `Springfield Royal Country Club ตั้งอยู่เลขที่ 208 หมู่ 2 ตำบลสามพระยา อำเภอชะอำ จังหวัดเพชรบุรี ห่างจากกรุงเทพฯ ลงมาทางใต้ประมาณ 200 กิโลเมตร การขับรถจากใจกลางกรุงเทพฯ ใช้เวลาประมาณ 2.5 ชั่วโมงผ่านทางหลวงหมายเลข 4 ส่วนจากตัวเมืองหัวหินขึ้นมาทางเหนือใช้เวลาราว 30 นาทีโดยแท็กซี่หรือ Grab นอกจากนี้ยังมีรถตู้โดยสารจากอนุสาวรีย์ชัยสมรภูมิในกรุงเทพฯ ไปยังทั้งชะอำและหัวหินหลายเที่ยวต่อวัน และคอมเพล็กซ์รีสอร์ตยังมีที่พักภายในพื้นที่สำหรับนักกอล์ฟที่ต้องการค้างคืนหลายคืน`,
        rental_cta_context: `กำลังจะไปเล่น Springfield Royal Country Club สนามที่ออกแบบโดย Jack Nicklaus แต่ไม่ได้พกไม้กอล์ฟของตัวเองไปด้วยใช่ไหม LENGOLF มีชุดไม้กอล์ฟให้เช่าส่งถึงโรงแรมของคุณในกรุงเทพฯ ให้คุณไปถึงสนามระดับแชมเปียนชิพแห่งนี้พร้อมอุปกรณ์ครบมือ`,
      },
    },
    ko: {
      title: `Springfield Royal Country Club 그린피 — 차암 27홀 잭 니클라우스 코스`,
      meta_description: `Springfield Royal Country Club 그린피는 걸어서 돌면 1,600바트, 카트를 쓰면 2,400바트예요. 캐디는 필수이고 350바트입니다. 차암에 자리한 27홀 잭 니클라우스 설계 코스의 레이아웃과 라운딩 팁, 방콕 호텔로 배달되는 LENGOLF 클럽 대여를 안내해요.`,
      prose: {
        overview: `Springfield Royal Country Club 코스는 태국에 몇 곳 없는 잭 니클라우스 설계 코스 가운데 하나예요. 원래의 18홀 레이아웃은 1993년 펫차부리주 차암에서 문을 열었고, 2005년에 세 번째 나인이 더해지면서 전체가 27홀 규모가 되었습니다. Springfield 코스는 골프 다이제스트가 꼽은 태국 최고의 골프 코스 10위 안에 이름을 올린 적이 있는데, 니클라우스 설계의 완성도와 꾸준한 코스 관리가 함께 반영된 평가예요. 레이아웃은 Springfield Resort 복합단지 안에 자리하고, 단지에는 호텔 숙소와 레스토랑, 스파, 수영장이 갖춰져 있어 며칠에 걸친 골프 여행의 거점으로 삼기에도 충분합니다. 요금은 걸어서 돌면 1,600바트, 카트를 이용하면 2,400바트이고 캐디는 필수로 350바트예요. 후아힌 일대 시세에서는 중간 가격대에 해당하니, 진짜 챔피언십 코스의 격을 부담 없는 값에 만나 볼 수 있는 셈이죠.`,
        layout_and_experience: `Springfield에서 니클라우스의 설계는 후아힌 북쪽 지형을 훌륭하게 살려 냈어요. 이 일대는 내륙의 테나세림 산맥(Tenasserim) 쪽으로 들어갈수록 평탄한 해안 평야에서 완만하게 굽이치는 구릉지로 바뀝니다. 코스에는 티잉 구역이 다섯 세트나 마련돼 있어 폭넓은 핸디캡대의 골퍼가 즐길 수 있고, 챔피언십 티에서는 만만치 않은 시험대가 돼요. 27홀은 A, B, C 이름이 붙은 세 개의 나인으로 나뉘고, 어떤 조합으로 묶어도 18홀 라운딩이 완성됩니다. 니클라우스 스타일의 특징은 코스 전반에서 뚜렷하게 드러나요. 티샷 낙하 지점은 넉넉하지만 그린으로 갈수록 좁아지고, 워터 해저드는 전략적인 위치에 놓여 정교한 샷에 보답하며, 넓고 굴곡진 퍼팅 면은 라인을 꼼꼼히 읽어야 합니다. 배경으로 펼쳐지는 산줄기는 이 지역의 해안 쪽 코스들과는 다른 경관을 만들어 줘요. 2005년에 더해진 세 번째 나인은 세 루프 가운데 가장 어렵다는 평가를 받는데, 페어웨이가 더 좁고 그린을 공략하는 각도도 한층 까다롭기 때문이에요. 라운딩 전후에 레슨을 받고 싶다면 Golf Academy 시설도 이용할 수 있습니다.`,
        tips: `Springfield 코스는 후아힌 도심에서 북쪽으로 약 30분 거리인 차암에 있어서, 가까운 Palm Hills Golf Club 코스와 묶기에 자연스러워요. 한 번의 여행에서 두 코스를 함께 돌 생각이라면 이동 차량 일정을 그에 맞춰 짜 두세요. 니클라우스가 설계한 이 레이아웃은 힘보다 코스 매니지먼트에 보답하니, 클럽 선택과 그린 읽기에 관한 캐디의 조언에 귀를 기울이세요. 넓은 퍼팅 면은 경사가 눈에 보이는 것과 다를 수 있거든요. 차암은 더 내륙에 있는 코스들보다 바닷바람에 조금 더 노출돼 있어서, 트인 홀에서는 바람 방향까지 감안해 클럽을 고르는 편이 좋아요. 트와일라잇 요금은 14:00부터 1,250바트로 값어치가 아주 좋지만, 해가 떠 있는 동안 18홀을 여유롭게 마치기에는 시간이 빠듯해요. 늦어도 13:45까지는 도착하세요. 골프 페스티벌 기간(보통 8~9월)에는 프로모션 요금도 나옵니다.`,
        location_and_access: `Springfield Royal Country Club 코스는 208 Moo 2, Sampraya, Cha-am, Phetchaburi 주소에 자리해요. 방콕에서 남쪽으로 약 200km 떨어져 있습니다. 방콕 도심에서 차로 가면 4번 국도를 이용해 약 2시간 30분 걸려요. 후아힌 시내에서 북쪽으로는 택시나 Grab 차량으로 약 30분 거리입니다. 방콕 빅토리 모뉴먼트에서는 차암과 후아힌 양쪽으로 향하는 미니밴이 하루에 여러 차례 운행해요. 리조트 복합단지 안에 숙소가 마련돼 있어 며칠 묵어 가려는 골퍼에게도 편합니다.`,
        rental_cta_context: `잭 니클라우스가 설계한 Springfield Royal Country Club 코스를 내 클럽 없이 즐길 계획인가요? LENGOLF에서 대여 클럽 세트를 방콕 호텔까지 보내 드리니, 이 챔피언십 레이아웃에 장비를 완벽히 갖추고 나설 수 있어요.`,
      },
    },
    zh: {
      title: `Springfield Royal Country Club果岭费与球场攻略 — 差安27洞尼克劳斯球场`,
      meta_description: `Springfield Royal Country Club果岭费步行为1,600泰铢，用球车为2,400泰铢，球童强制，费用350泰铢。这座位于佛丕府差安的27洞球场出自杰克·尼克劳斯（Jack Nicklaus）之手，另附送到曼谷酒店的LENGOLF球杆租借。`,
      prose: {
        overview: `Springfield Royal Country Club拥有一个不多见的头衔：它是泰国屈指可数的几座杰克·尼克劳斯（Jack Nicklaus）设计球场之一。最初的18洞布局1993年在佛丕府差安开放，2005年又增建了第三组九洞，整座球场因此扩充到27洞。Springfield曾被《高尔夫文摘》列入泰国十大最佳高尔夫球场，这份肯定既来自尼克劳斯设计本身的水准，也来自球场一贯到位的养护。球场坐落在Springfield Resort综合度假区之内，区内配有酒店客房、餐厅、水疗与游泳池，作为多日高尔夫行程的落脚点相当实际。价格方面，步行下场1,600泰铢，使用球车2,400泰铢，球童为强制配置，费用350泰铢——在华欣一带的行情里属于中间价位，让你以够得着的价钱体验一座名副其实的锦标赛级球场。`,
        layout_and_experience: `尼克劳斯在Springfield的设计，把华欣以北的地形用得恰到好处——这一带从平坦的滨海平原起，随着往内陆靠近德林达依山脉（Tenasserim）而渐渐转为起伏和缓的丘陵。球场设有五组发球台，既照顾得到差点跨度很大的球手，从锦标赛发球台打起又是一道硬考题。27洞分成A、B、C三组各有其名的九洞，任意两组搭配起来就是一轮完整的18洞。尼克劳斯风格的标志贯穿全场：球道落点区宽绰，越靠近果岭却越收窄；水障碍摆在颇具战术意味的位置，回报击球精准的人；果岭面积大、起伏多，读线必须格外仔细。以群山为背景的画面，也让这里有别于本地区那些更贴近海岸的布局。2005年增建的第三组九洞，一般被认为是三条环线里最难的一组，球道更窄，攻果岭的角度也更苛刻。想在下场前后上课的球友，还可以使用场内的Golf Academy设施。`,
        tips: `Springfield位于差安，距华欣市中心往北约30分钟，和附近的Palm Hills Golf Club天然是一对组合。如果打算一趟行程里把两座球场都打下来，接送车辆的时间要提前排好。尼克劳斯设计的这套布局回报的是打球思路而不是力量——球童在选杆与读果岭上的建议值得留心，因为这些大果岭的坡度很容易看走眼。差安比更靠内陆的球场稍微多几分海风，开阔的球洞上选杆时记得把风向算进去。黄昏时段费率（14:00起1,250泰铢）性价比很高，但要在天黑前从容打完完整的18洞，时间会比较紧，最晚13:45就该到场。高尔夫节庆期间（一般是8–9月），球场还会推出优惠价格。`,
        location_and_access: `Springfield Royal Country Club的地址是208 Moo 2, Sampraya, Cha-am, Phetchaburi，位于曼谷以南约200公里。从曼谷市中心自驾走4号公路约需2.5小时。从华欣镇往北，搭出租车或Grab约30分钟。曼谷胜利纪念碑（Victory Monument）每天有多班小巴开往差安与华欣。度假区内设有住宿，适合想连住几晚的球友。`,
        rental_cta_context: `打算去打这座由杰克·尼克劳斯（Jack Nicklaus）设计的Springfield Royal Country Club，却没带自己的球杆？LENGOLF的租借球杆可以送到你的曼谷酒店，让你装备齐整地站上这座锦标赛级球场。`,
      },
    },
    ja: {
      title: `Springfield Royal Country Club（チャアム）— グリーンフィー・コース紹介・クラブレンタル`,
      meta_description: `グリーンフィーは歩きで1,600THB、カートを使うと2,400THB。キャディーは必須で350THBです。Springfield Royal Country Clubはペッチャブリー県チャアムにあるJack Nicklaus設計の27ホール。バンコクのホテルへ届くLENGOLFのクラブレンタルもご案内します。`,
      prose: {
        overview: `Springfield Royal Country Clubは、タイでも数えるほどしかないJack Nicklaus設計コースのひとつという肩書を持ちます。当初の18ホールレイアウトは1993年、ペッチャブリー県チャアムに開場し、2005年には3つ目の9ホールが加わって全27ホールの規模になりました。Springfieldはゴルフダイジェストによるタイのベストゴルフコース10傑に選ばれた実績があり、これはNicklaus設計の質と、コンディションを保ち続ける管理の両方が評価された結果です。レイアウトはSpringfield Resortの複合施設内に広がり、敷地にはホテル客室、レストラン、スパ、プールが揃っているため、数日がかりのゴルフ旅行の拠点としても十分に成り立ちます。料金は歩きで1,600THB、カートを使う場合は2,400THB、キャディーは必須で350THB。ホアヒン一帯の相場では中位に位置し、本格的なチャンピオンシップコースの資質を手の届く価格で味わえます。`,
        layout_and_experience: `SpringfieldにおけるNicklausの設計は、ホアヒン北側の地形を実に巧みに生かしています。この一帯は、内陸のテナセリム山脈へ向かうにつれて、平坦な海岸平野から緩やかに起伏する丘陵へと表情を変えていきます。ティーは5種類。幅広いハンディキャップのゴルファーが楽しめる一方、チャンピオンシップティーからは厳しい試練となります。27ホールはA、B、Cと名付けられた3つの9ホールに分かれ、どの組み合わせでも18ホールのラウンドが成立します。Nicklausスタイルの特徴はコース全体に表れており、ティーショットの落としどころはゆったりしているのにグリーンへ近づくほど狭まり、戦略的に配されたウォーターハザードは精度の高いショットに報い、大きくうねるパッティング面は入念なライン読みを求めます。山並みを背にした景観は、この地域の海寄りのレイアウトとは異なる趣。2005年に加わった3つ目の9ホールは、フェアウェイがより狭く、グリーンを狙う角度も一段と厳しいことから、3つのループのなかで最も難しいと一般に見なされています。ラウンドの前後にレッスンを受けたい方には、Golf Academyの施設も用意されています。`,
        tips: `Springfieldはホアヒン中心部から北へ約30分のチャアムに位置しており、近隣のPalm Hills Golf Clubと組み合わせるのに向いた立地です。1回の旅行で2コースを回るなら、送迎の手配もそれに合わせて考えておきましょう。Nicklaus設計のレイアウトが評価するのは、パワーよりコースマネジメント。クラブ選択やグリーンの読みについては、キャディーの助言に耳を傾けてください。大きなパッティング面は、傾斜が見た目どおりとは限りません。チャアムは、より内陸のコースに比べて海風の影響をわずかに受けやすいため、開けたホールではクラブ選択に風向きも織り込みましょう。トワイライト料金は14:00から1,250THBと値打ちがありますが、明るいうちに18ホールを余裕をもって終えるには時間が限られます。遅くとも13:45には到着してください。ゴルフフェスティバルの時期（おおむね8月〜9月）には、プロモーション料金も設定されます。`,
        location_and_access: `Springfield Royal Country Clubの所在地は208 Moo 2, Sampraya, Cha-am, Phetchaburi。バンコクから南へ約200kmの距離です。バンコク中心部からは国道4号線経由で車でおよそ2.5時間かかります。ホアヒンの街からは北へ、タクシーまたはGrabで約30分。バンコクのビクトリーモニュメントからは、チャアムとホアヒンの双方へミニバンが1日数便運行しています。リゾートの複合施設には宿泊施設もあり、数泊したいゴルファーにも便利です。`,
        rental_cta_context: `Jack Nicklaus設計のSpringfield Royal Country Clubを、自分のクラブなしでプレーする予定ですか。LENGOLFならレンタルセットをバンコクのホテルまでお届けしますので、このチャンピオンシップレイアウトに万全の装備で臨めます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-19',
}
