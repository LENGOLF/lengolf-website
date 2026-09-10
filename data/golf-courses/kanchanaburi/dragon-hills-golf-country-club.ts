import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'dragon-hills-golf-country-club',
  region: 'kanchanaburi',
  name: `Dragon Hills Golf & Country Club`,
  province: `Ratchaburi`,
  designer: `Jim Engh`,
  holes: 18,
  par: 72,
  year_opened: 1994,
  // Official foreigner all-in rate (green fee + caddie + cart), dragonhillsgolf.com
  // promotion page updated Mar 2026. Thai nationals pay less (dual pricing).
  green_fee_weekday_thb: 1560,
  green_fee_weekend_thb: 1750,
  // All-in package per this file's own EN prose: the posted rate bundles the
  // caddie (and cart where the course has one). Stops generated copy calling
  // the number a bare "green fee", which would tell a reader they pay extra.
  fee_is_package: true,
  fees_verified_at: '2026-07-30',
  // Zero, not null: the comment on green_fee_weekday_thb above already calls
  // 1,560/1,750 the "official foreigner all-in rate (green fee + caddie + cart)".
  // These were 300 and 700, contradicting that comment two lines up.
  caddie_fee_thb: 0,
  cart_fee_thb: 0,
  caddie_required: false,
  cart_required: false,
  driving_range: true,
  website: 'https://www.dragonhillsgolf.com',
  phone: '+66 32 917698',
  latitude: 13.439604,
  longitude: 99.60416,
  coordinates_verified_at: '2026-08-10',
  distance_from_bangkok_km: null,
  drive_time_from_bangkok_min: 90,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: 500,
  club_rental_brands: null,
  schema_markup: "{\"@context\":\"https://schema.org\",\"@type\":\"GolfCourse\",\"name\":\"Dragon Hills Golf & Country Club\",\"url\":\"https://len.golf/golf-courses/kanchanaburi/dragon-hills-golf-country-club\",\"description\":null,\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"Pak Tho\",\"addressRegion\":\"Ratchaburi\",\"addressCountry\":\"TH\"},\"geo\":{\"@type\":\"GeoCoordinates\",\"latitude\":null,\"longitude\":null},\"telephone\":\"+66 32 917698\",\"priceRange\":\"฿\",\"sameAs\":[\"https://www.dragonhillsgolf.com\"],\"amenityFeature\":[{\"@type\":\"LocationFeatureSpecification\",\"name\":\"Driving Range\",\"value\":true},{\"@type\":\"LocationFeatureSpecification\",\"name\":\"Caddie Required\",\"value\":false},{\"@type\":\"LocationFeatureSpecification\",\"name\":\"Golf Cart\",\"value\":true}]}",
  prose: {
    overview: `Dragon Hills Golf & Country Club is a Jim Engh design built across 1,500 acres of jungle-clad mountainside in Pak Tho District, Ratchaburi Province — though it is consistently grouped with Kanchanaburi and River Kwai courses on booking platforms due to its location and character. The course opened in 1994 and remains one of the most geographically dramatic layouts within 90 minutes of Bangkok, where the official visitor package of 1,560 THB on weekdays and 1,750 THB on weekends — including caddie and cart — places it among the best-value serious golf experiences in the region. (Thai nationals pay lower dual-pricing rates.) The site's elevation and forested terrain produce a playing experience far removed from the flat parkland courses that dominate Bangkok's closer suburbs, making it a frequent destination for golfers who want meaningful terrain without a long drive.`,
    layout_and_experience: `Engh's routing across the mountainside creates significant changes in elevation throughout the round. The signature hole is the 12th, a downhill par-3 of approximately 170 yards played to an island green — one of the more demanding short holes in the region, where club selection must account for the drop in elevation and any crosswind. The 1,500-acre site gives the layout a sense of space and separation between holes that is rare for a course this accessible from the capital. A driving range supports warm-up. Club rental is available at 500 THB per round, keeping the total cost per player well below what equivalent terrain would command at a resort course. The course appeals particularly to golfers who prefer course character over manicured uniformity.`,
    tips: `Hole 12 is the one to prepare for: the downhill approach to the island green rewards conservative club selection and punishes anything long or left. The significant elevation changes make the cart included in the visitor package genuinely useful, particularly in the afternoon heat. At 1,560 THB weekday all-in for Jim Engh mountain terrain, Dragon Hills offers serious value — but confirm current pricing with the club directly, as fees change between seasons. The 90-minute drive from Bangkok makes it feasible as an early-departure day trip without requiring an overnight stay.`,
    location_and_access: `Dragon Hills is located in Pak Tho District, Ratchaburi Province, administratively distinct from Kanchanaburi but commonly grouped with the River Kwai region. From Bangkok, the drive takes approximately 90 minutes — notably shorter than courses in Saiyoke or Bo Phloi Districts. The route south and west from Bangkok via Highway 35 or Highway 4 connects to Pak Tho; private car is the practical option. Ratchaburi province borders Kanchanaburi to the south, and the mountainous terrain in this part of the province produces the elevated course character that distinguishes Dragon Hills from lowland alternatives closer to the city.`,
    rental_cta_context: `Dragon Hills Golf & Country Club offers on-site club rental at 500 THB, and golfers coming from Bangkok can also arrange rental sets through LENGOLF near BTS Chidlom before making the 90-minute drive to Dragon Hills.`,
  },
  locales: {
    en: {
      title: `Dragon Hills Golf & Country Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Dragon Hills Golf Club: Jim Engh design on 1,500 acres of mountainside in Ratchaburi. Visitor packages from 1,560 THB incl caddie & cart. Island-green par-3 signature hole. 90 mins from Bangkok.`,
    },
    th: {
      title: `Dragon Hills Golf & Country Club ราชบุรี — แพ็กเกจรวมทุกอย่าง รีวิวสนามและเช่าไม้กอล์ฟ`,
      meta_description: `Dragon Hills Golf Club สนามออกแบบโดย Jim Engh บนไหล่เขา 1,500 เอเคอร์ในจังหวัดราชบุรี แพ็กเกจสำหรับผู้มาเยือนเริ่มต้น 1,560 บาท รวมค่าแคดดี้และรถกอล์ฟ พาร์ 3 กรีนเกาะเป็นหลุมซิกเนเจอร์ ห่างจากกรุงเทพฯ 90 นาที`,
      prose: {
        overview: `Dragon Hills Golf & Country Club เป็นสนามที่ออกแบบโดย Jim Engh สร้างขึ้นบนไหล่เขาปกคลุมด้วยป่า 1,500 เอเคอร์ในอำเภอปากท่อ จังหวัดราชบุรี แม้จะถูกจัดกลุ่มร่วมกับสนามในกาญจนบุรีและแนวแม่น้ำแควอยู่เสมอบนแพลตฟอร์มจองเนื่องด้วยทำเลและบุคลิกของสนาม สนามเปิดในปี 1994 และยังคงเป็นหนึ่งในเลย์เอาต์ที่มีภูมิประเทศดรามาติกที่สุดในระยะ 90 นาทีจากกรุงเทพฯ โดยแพ็กเกจสำหรับผู้มาเยือนอย่างเป็นทางการที่ 1,560 บาทในวันธรรมดา และ 1,750 บาทในวันเสาร์อาทิตย์ ซึ่งรวมค่าแคดดี้และรถกอล์ฟแล้ว จัดให้ที่นี่อยู่ในกลุ่มประสบการณ์กอล์ฟจริงจังที่คุ้มค่าที่สุดในภูมิภาค (ข้อมูล ณ กรกฎาคม 2026) (คนไทยจ่ายในอัตราสองราคาที่ถูกกว่า) ระดับความสูงและภูมิประเทศที่เต็มไปด้วยป่าสร้างประสบการณ์การเล่นที่ต่างไกลจากสนามพาร์กแลนด์ราบเรียบที่มีอยู่ทั่วชานเมืองใกล้กรุงเทพฯ ทำให้เป็นจุดหมายประจำของนักกอล์ฟที่ต้องการภูมิประเทศที่มีความหมายโดยไม่ต้องขับรถไกล`,
        layout_and_experience: `การวางเลย์เอาต์ของ Engh บนไหล่เขาสร้างการเปลี่ยนระดับความสูงอย่างมากตลอดทั้งรอบ หลุมซิกเนเจอร์คือหลุม 12 พาร์ 3 ดาวน์ฮิลล์ระยะราว 170 หลา เล่นเข้าสู่กรีนเกาะ นับเป็นหนึ่งในหลุมสั้นที่ท้าทายที่สุดในภูมิภาค ซึ่งการเลือกไม้ต้องคำนึงถึงระดับที่ลดต่ำลงและกระแสลมขวาง พื้นที่ 1,500 เอเคอร์มอบความรู้สึกกว้างขวางและการแยกตัวระหว่างหลุมที่หาได้ยากสำหรับสนามที่เข้าถึงได้ง่ายจากเมืองหลวงเช่นนี้ มีสนามไดรฟ์รองรับการวอร์มอัพ บริการเช่าไม้กอล์ฟอยู่ที่ 500 บาทต่อรอบ ช่วยให้ต้นทุนรวมต่อผู้เล่นต่ำกว่าที่ภูมิประเทศเทียบเท่าจะเรียกเก็บที่สนามรีสอร์ตมาก สนามนี้ตอบโจทย์นักกอล์ฟที่ให้ความสำคัญกับบุคลิกของสนามมากกว่าความเรียบเนียนสม่ำเสมอเป็นพิเศษ`,
        tips: `หลุม 12 คือหลุมที่ต้องเตรียมตัว ช็อตเข้าดาวน์ฮิลล์สู่กรีนเกาะให้รางวัลกับการเลือกไม้แบบระมัดระวัง และลงโทษลูกที่ยาวเกินหรือไปทางซ้าย การเปลี่ยนระดับความสูงอย่างมากทำให้รถกอล์ฟที่รวมอยู่ในแพ็กเกจมีประโยชน์จริง โดยเฉพาะในช่วงบ่ายที่อากาศร้อน ที่ 1,560 บาทวันธรรมดาแบบรวมทุกอย่างสำหรับภูมิประเทศภูเขาสไตล์ Jim Engh Dragon Hills ให้ความคุ้มค่าอย่างจริงจัง แต่ควรสอบถามราคาปัจจุบันกับสนามโดยตรง เพราะค่าธรรมเนียมเปลี่ยนแปลงตามฤดูกาล การขับรถ 90 นาทีจากกรุงเทพฯ ทำให้เป็นทริปไปกลับในวันเดียวได้หากออกเดินทางแต่เช้า โดยไม่ต้องค้างคืน`,
        location_and_access: `Dragon Hills ตั้งอยู่ในอำเภอปากท่อ จังหวัดราชบุรี ซึ่งในทางปกครองแยกจากกาญจนบุรี แต่มักถูกจัดกลุ่มร่วมกับแนวแม่น้ำแคว จากกรุงเทพฯ การขับรถใช้เวลาประมาณ 90 นาที สั้นกว่าสนามในอำเภอไทรโยคหรือบ่อพลอยอย่างเห็นได้ชัด เส้นทางมุ่งใต้และตะวันตกจากกรุงเทพฯ ผ่านทางหลวงหมายเลข 35 หรือทางหลวงหมายเลข 4 เชื่อมต่อสู่ปากท่อ รถยนต์ส่วนตัวเป็นทางเลือกที่เหมาะสม จังหวัดราชบุรีมีอาณาเขตติดกาญจนบุรีทางทิศใต้ และภูมิประเทศภูเขาในส่วนนี้ของจังหวัดสร้างบุคลิกสนามบนที่สูงซึ่งทำให้ Dragon Hills แตกต่างจากทางเลือกในพื้นที่ราบที่อยู่ใกล้เมืองมากกว่า`,
        rental_cta_context: `Dragon Hills Golf & Country Club มีบริการเช่าไม้กอล์ฟในสนามในราคา 500 บาท ส่วนนักกอล์ฟที่เดินทางมาจากกรุงเทพฯ ยังจัดเตรียมชุดไม้เช่าผ่าน LENGOLF ใกล้ BTS ชิดลม ก่อนออกเดินทาง 90 นาทีสู่ Dragon Hills ได้เช่นกัน`,
      },
    },
    ja: {
      title: `Dragon Hills Golf & Country Club（ラーチャブリー）— パッケージ料金・コース紹介・クラブレンタル`,
      meta_description: `Dragon Hills Golf ClubはラーチャブリーのJim Engh設計、1,500エーカーの山腹に広がるコース。ビジター向けパッケージはキャディーとカート込みで1,560THB〜。名物はアイランドグリーンのパー3。バンコクから約90分。`,
      prose: {
        overview: `Dragon Hills Golf & Country Clubは、ラーチャブリー県パークトー郡のジャングルに覆われた山腹1,500エーカーに広がるJim Engh設計のコースです。ただしその立地と性格から、予約サイトでは一貫してカンチャナブリーやRiver Kwai周辺のコースと同じくくりで扱われています。1994年に開場し、バンコクから90分圏内では地形的に最も劇的なレイアウトのひとつであり続けています。平日1,560THB、週末1,750THBというビジター向けの公式パッケージはキャディーとカートを含み、この地域で本格的なゴルフを楽しめるなかでも屈指のコストパフォーマンスに位置づけられます（2026年7月現在）。（タイ国籍の方はこれより安いデュアルプライシング料金が適用されます。）敷地の標高と森林の地形が、バンコク近郊に多い平坦なパークランドコースとはかけ離れたプレー体験を生み出しており、長距離を運転せずに変化に富んだ地形を求めるゴルファーにとって定番の目的地になっています。`,
        layout_and_experience: `Enghの山腹に沿ったルーティングは、ラウンドを通じて大きな高低差を生み出します。名物ホールは12番で、アイランドグリーンへ打ち下ろす約170ヤードのパー3です。この地域でも指折りの難しいショートホールのひとつで、クラブ選択にあたっては高低差の落ち込みと横風を計算に入れる必要があります。1,500エーカーの敷地は、首都からこれほどアクセスしやすいコースとしては珍しい、ゆとりとホール間の距離感をレイアウトに与えています。ウォームアップにはドライビングレンジが使えます。クラブレンタルは1ラウンド500THBで利用でき、プレーヤー1人あたりの総額を、同等の地形をリゾートコースで求めた場合よりもかなり低く抑えられます。丹念に整えられた均一さよりも、コースそのものの個性を好むゴルファーに特に響くコースです。`,
        tips: `備えておきたいのは12番ホールです。アイランドグリーンへの打ち下ろしのアプローチは、控えめなクラブ選択に報い、長すぎるショットや左へのミスには容赦がありません。大きな高低差があるため、ビジターパッケージに含まれるカートは、特に午後の暑さのなかでは実際に役立ちます。Jim Enghの山岳地形を平日1,560THBのオールインで回れるDragon Hillsは、確かな価値があります（2026年7月現在）。ただし料金は季節によって変わるため、最新の価格はクラブへ直接ご確認ください。バンコクから90分のドライブなので、宿泊なしの早朝出発の日帰りでも十分に組めます。`,
        location_and_access: `Dragon Hillsはラーチャブリー県パークトー郡に位置し、行政上はカンチャナブリーとは別ですが、一般にはRiver Kwai周辺のくくりで扱われます。バンコクからの所要時間は約90分で、サイヨーク郡やボープロイ郡のコースよりも明らかに短いです。バンコクから南西へ、国道35号線または国道4号線を経てパークトーへつながります。移動は自家用車が現実的です。ラーチャブリー県は南でカンチャナブリーと接しており、県のこの一帯の山がちな地形が、市街に近い低地の選択肢とDragon Hillsを分ける、標高の高いコースらしさを生み出しています。`,
        rental_cta_context: `Dragon Hills Golf & Country Clubでは敷地内で500THBのクラブレンタルを提供しています。バンコクから向かうゴルファーは、Dragon Hillsまで90分のドライブに出発する前に、BTSチットロム駅近くのLENGOLFでレンタルセットを手配することもできます。`,
      },
    },
    ko: {
      title: `Dragon Hills Golf & Country Club 올인클루시브 패키지 — 랏차부리 코스 가이드와 클럽 대여`,
      meta_description: `Dragon Hills Golf & Country Club은 Jim Engh가 랏차부리 산지 1,500에이커에 설계한 코스예요. 방문객 패키지는 평일 1,560바트부터로 캐디와 카트 포함(2026년 7월 기준). 아일랜드 그린 파3 시그니처 홀, 방콕에서 90분.`,
      prose: {
        overview: `Dragon Hills Golf & Country Club은 Jim Engh이 랏차부리주 Pak Tho 지구의 정글로 뒤덮인 산비탈 1,500에이커에 설계한 코스예요. 다만 위치와 성격 때문에 예약 플랫폼에서는 늘 깐짜나부리·River Kwai 코스들과 한데 묶여 소개됩니다. 1994년에 문을 연 이곳은 방콕에서 90분 이내에 있는 레이아웃 가운데 지형이 가장 극적인 축에 드는데, 캐디와 카트를 포함한 공식 방문객 패키지가 평일 1,560바트, 주말 1,750바트로(2026년 7월 기준) 이 지역에서 가성비 좋은 진지한 골프 경험 가운데 하나로 꼽힙니다. (태국 국적자는 이중 가격제로 더 낮은 요금을 냅니다.) 부지의 고도와 숲으로 덮인 지형은 방콕 가까운 근교를 지배하는 평탄한 파크랜드 코스와는 사뭇 다른 플레이 경험을 만들어 내, 먼 길을 가지 않고도 의미 있는 지형을 즐기고 싶은 골퍼가 자주 찾는 곳이 됩니다.`,
        layout_and_experience: `산비탈을 가로지르는 Engh의 루팅은 라운드 내내 상당한 고저 차를 만들어 냅니다. 시그니처 홀은 12번으로, 약 170야드 내리막 파3를 아일랜드 그린으로 쳐 넣어야 하는데, 고도 하강과 옆바람까지 고려해 클럽을 골라야 하는 이 지역에서 손꼽히게 까다로운 숏홀 가운데 하나예요. 1,500에이커 부지는 수도에서 이만큼 접근하기 쉬운 코스에서는 보기 드문, 홀 사이의 여유와 분리감을 레이아웃에 줍니다. 드라이빙 레인지가 있어 몸을 풀 수 있어요. 클럽 대여는 라운드당 500바트로 이용할 수 있어, 같은 지형을 리조트 코스에서 즐길 때 드는 비용보다 플레이어당 총액을 훨씬 낮게 유지해 줍니다. 이 코스는 다듬어진 균일함보다 코스의 개성을 선호하는 골퍼에게 특히 잘 맞습니다.`,
        tips: `준비해 둘 홀은 12번이에요. 아일랜드 그린으로 향하는 내리막 어프로치는 보수적인 클럽 선택에 보답하고, 길거나 왼쪽으로 빠진 샷에는 벌을 줍니다. 고저 차가 커서 방문객 패키지에 포함된 카트가 특히 오후 더위에 실제로 요긴해요. Jim Engh의 산지 코스를 평일 1,560바트 올인 요금에 즐길 수 있어 Dragon Hills는 가치가 상당하지만, 요금은 시즌마다 바뀌니 현재 가격은 클럽에 직접 확인하세요(2026년 7월 기준). 방콕에서 90분 거리라 하룻밤 묵지 않고 아침 일찍 출발하는 당일치기로도 다녀올 수 있습니다.`,
        location_and_access: `Dragon Hills는 랏차부리주 Pak Tho 지구에 있어 행정 구역상 깐짜나부리와는 구분되지만, 보통 River Kwai 지역과 한데 묶입니다. 방콕에서 차로 약 90분 걸리는데, Saiyoke 지구나 Bo Phloi 지구의 코스들보다 눈에 띄게 짧아요. 방콕에서 남서쪽으로 35번 고속도로나 4번 고속도로를 타면 Pak Tho로 이어지며, 자가용이 현실적인 방법입니다. 랏차부리주는 남쪽으로 깐짜나부리와 접해 있고, 주의 이 일대 산악 지형이 Dragon Hills를 도시에 가까운 저지대 대안들과 구별해 주는 고지대 코스 성격을 만들어 냅니다.`,
        rental_cta_context: `Dragon Hills Golf & Country Club은 현장에서 500바트에 클럽 대여를 제공하고, 방콕에서 오는 골퍼라면 Dragon Hills까지 90분을 운전하기 전에 BTS 칫롬역 근처의 LENGOLF에서 대여 세트를 준비할 수도 있어요.`,
      },
    },
    zh: {
      title: `Dragon Hills Golf & Country Club全包套餐 — 叻丕Jim Engh设计山地球场攻略与球杆租借`,
      meta_description: `Dragon Hills Golf & Country Club是Jim Engh在叻丕1,500英亩山坡上打造的球场，访客全包套餐1,560泰铢起，含球童与球车，标志洞是攻岛屿果岭的三杆洞，距曼谷90分钟车程。`,
      prose: {
        overview: `Dragon Hills Golf & Country Club是Jim Engh在叻丕府Pak Tho县1,500英亩丛林覆盖的山坡上打造的球场——不过因为它的位置与气质，在各订球平台上总是和北碧、River Kwai一带的球场归在一起。球场1994年开放，至今仍是曼谷90分钟车程内地势最富戏剧性的布局之一：官方访客套餐平日1,560泰铢、周末1,750泰铢——含球童与球车——让它跻身本地区最超值的正经高尔夫体验之列，截至2026年7月。（泰国本国人适用较低的双重定价。）这片场地的海拔与林地地形，带来的体验与主宰曼谷近郊的那些平坦林间公园式球场相去甚远，也让它成为想要有分量的地势、又不愿长途驱车的球手常去的去处。`,
        layout_and_experience: `Engh在山坡上的布线，让整整一场球都伴随着显著的高低起伏。标志洞是第12洞，一个约170码的下坡三杆洞，打向一片岛屿果岭——是本地区要求最高的短洞之一，选杆时既要算上落差，也要把任何侧风考虑进去。1,500英亩的场地，让各洞之间有一种开阔与彼此分隔的感觉，这对一座从首都如此易达的球场而言并不多见。场内设有练习场供热身。球杆租借每场500泰铢，让每位球手的总花费远低于同等地势在度假型球场会开出的价码。这座球场尤其吸引那些看重球场性格、而非修剪得整齐划一的球手。`,
        tips: `第12洞是需要提前做准备的一洞：打向岛屿果岭的下坡攻击，会奖励保守的选杆，也会惩罚任何偏长或偏左的球。显著的高低落差，让套餐里已含的球车真正派上用场，午后暑热中尤其如此。以平日1,560泰铢全包玩到Jim Engh的山地地形，Dragon Hills堪称超值——但请直接向球会确认当前价格，因为费用会随季节变化，截至2026年7月。从曼谷90分钟的车程，让它作为清早出发的一日游完全可行，无需过夜。`,
        location_and_access: `Dragon Hills位于叻丕府Pak Tho县，行政上与北碧分属不同辖区，但通常被归入River Kwai一带。从曼谷出发，车程约90分钟——明显短于Saiyoke或Bo Phloi等县的球场。从曼谷往南、往西，经35号或4号公路接入Pak Tho；自驾是现实的选择。叻丕府南面与北碧接壤，这一带的山地地形造就了Dragon Hills那种抬升的球场性格，把它和更靠近城市的低地选择区分开来。`,
        rental_cta_context: `Dragon Hills Golf & Country Club提供场内球杆租借，每套500泰铢；从曼谷过来的球手，也可以在踏上前往Dragon Hills那90分钟车程之前，先在BTS Chidlom附近的LENGOLF租一套球杆。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-20',
}
