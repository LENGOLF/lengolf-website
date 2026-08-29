import type { GolfCourse } from '@/types/golf-courses'

export const course: GolfCourse = {
  slug: 'gassan-lake-city-golf-club',
  region: 'chiang-mai',
  name: `Gassan Legacy Golf Club`,
  province: `Lamphun`,
  designer: `Schmidt-Curley Design (renovation 2014)`,
  holes: 18,
  par: 72,
  year_opened: 2005,
  green_fee_weekday_thb: 4000,
  green_fee_weekend_thb: 4000,
  // All-in package, per this file's own EN prose: all-in green fee ~4,000-4,200 THB including caddie and cart. The rate
  // basis above is unchanged; this only stops generated copy calling the
  // number a bare "green fee".
  fee_is_package: true,
  // Zero, not null: the caddie costs this golfer nothing on top of the package.
  caddie_fee_thb: 0,
  // Zero for the same reason as caddie_fee_thb above — bundled into the package.
  cart_fee_thb: 0,
  caddie_required: true,
  cart_required: true,
  driving_range: true,
  website: 'https://www.gassangolf.com/gassan-legacy/en',
  phone: '+66 53 507 006',
  latitude: 18.5083,
  longitude: 99.0167,
  distance_from_bangkok_km: 700,
  drive_time_from_bangkok_min: null,
  google_maps_url: null,
  club_rental_available: true,
  club_rental_fee_thb: null,
  club_rental_brands: null,
  schema_markup: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"GolfCourse\",\n  \"name\": \"Gassan Legacy Golf Club\",\n  \"url\": \"https://len.golf/golf-courses/chiang-mai/gassan-lake-city-golf-club\",\n  \"description\": null,\n  \"address\": {\n    \"@type\": \"PostalAddress\",\n    \"addressLocality\": \"Lamphun\",\n    \"addressCountry\": \"TH\"\n  },\n  \"geo\": {\n    \"@type\": \"GeoCoordinates\",\n    \"latitude\": 18.5083,\n    \"longitude\": 99.0167\n  },\n  \"telephone\": \"+66 53 507 006\",\n  \"priceRange\": \"฿฿฿\",\n  \"sameAs\": [\n    \"https://www.gassangolf.com/gassan-legacy/en\"\n  ],\n  \"amenityFeature\": [\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Driving Range\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Caddie Required\",\n      \"value\": true\n    },\n    {\n      \"@type\": \"LocationFeatureSpecification\",\n      \"name\": \"Golf Cart\",\n      \"value\": true\n    }\n  ]\n}",
  prose: {
    overview: `Gassan Lake City Golf Club — now operating as Gassan Legacy Golf Club — is an 18-hole championship course in Ban Thi, Lamphun province, approximately 30 minutes south of Chiang Mai International Airport. Originally opened in 2005, the course was closed in 2013 for a full-scale renovation by American design firm Schmidt-Curley and relaunched in 2014 under the Legacy name. The renovation transformed a dated layout into one of the most water-intensive courses in Northern Thailand, with water hazards appearing on every hole — a design feature that demands accurate iron play and careful course management throughout the round. The course is part of the Gassan Golf Group, which operates three courses in the Lamphun/Chiang Mai area. At 6,852 yards and par 72, Gassan Legacy plays to a demanding standard and draws both local members and visiting golfers looking for a well-conditioned, challenging layout that contrasts with the more forested mountain settings of the Gassan Khuntan and Panorama properties.`,
    layout_and_experience: `The Schmidt-Curley renovation was designed around a central lake complex that anchors the middle section of the course. The routing uses the water strategically: from the opening holes, which establish a parkland rhythm through tree-lined fairways, the layout progressively introduces water as a central threat, culminating in a mid-round stretch where approach shots must carry or thread past lake edges on virtually every hole.

The par-72 layout includes five par-3s of varying length and five par-5s that offer risk-reward options for players willing to challenge the wet margins. The fairways are generous by Northern Thailand standards, but the combination of water on both sides of approach corridors and firm, fast greens means that accurate ball-striking is rewarded and mis-hits are costly.

Greens were designed with Tiff Dwarf bermuda grass for good speed and resilience through the tropical growing season. The course condition has been consistently praised since the 2014 reopening. Caddie service is compulsory, and local caddie knowledge of the correct landing zones can save several shots for first-time visitors.`,
    tips: `The all-in package rate (approximately 4,000–4,200 THB including caddie and cart) is the standard rate — confirm pricing on booking as season rates vary. A caddie tip of 400 THB is expected and payable in cash to the caddie after the round. Play conservatively on the approach shots — the water margins offer limited recovery options and double-bogey territory is close on many holes. Carry a spare sleeve of balls. The course is approximately 30 minutes from CNX airport, making it a practical first or last round on a Chiang Mai golf trip.`,
    location_and_access: `Gassan Legacy Golf Club is located in Ban Thi, Lamphun province, approximately 30 minutes by car south of Chiang Mai International Airport (CNX). Visitors from Bangkok fly to CNX (approximately 1 hour 10 minutes from Suvarnabhumi or Don Mueang) — driving the 700 kilometres from Bangkok is not practical. The course is accessible by Grab taxi or private car from Chiang Mai city or the airport; the Gassan Group can arrange transfers on request.`,
    rental_cta_context: `Playing Gassan Legacy Golf Club on your Chiang Mai trip? Rent premium clubs in Bangkok — delivered to your hotel before you fly — so you can focus on the course's famous water hazards without worrying about baggage fees.`,
  },
  locales: {
    en: {
      title: `Gassan Legacy Golf Club — Green Fees, Course Guide & Golf Club Rentals`,
      meta_description: `Gassan Legacy Golf Club green fees, course overview, tips, and how to arrange golf club rentals delivered to your Bangkok hotel.`,
    },
    th: {
      title: `Gassan Legacy Golf Club ลำพูน — แพ็กเกจรวมทุกอย่าง รีวิวสนาม และเช่าไม้กอล์ฟ`,
      meta_description: `แพ็กเกจรวมทุกอย่างที่ Gassan Legacy Golf Club ประมาณ 4,000-4,200 บาท รวมค่ากรีนฟี แคดดี้ และรถกอล์ฟ สนาม 18 หลุมที่ Schmidt-Curley รีโนเวต ตั้งอยู่ที่บ้านธิ จังหวัดลำพูน ห่างจากท่าอากาศยานเชียงใหม่ประมาณ 30 นาที พร้อมบริการเช่าไม้กอล์ฟส่งถึงโรงแรมในกรุงเทพฯ`,
      prose: {
        overview: `Gassan Lake City Golf Club ซึ่งปัจจุบันเปิดดำเนินการในชื่อ Gassan Legacy Golf Club เป็นสนามระดับแชมเปียนชิพ 18 หลุมในอำเภอบ้านธิ จังหวัดลำพูน ห่างลงมาทางใต้ของท่าอากาศยานนานาชาติเชียงใหม่ประมาณ 30 นาที สนามเปิดครั้งแรกในปี 2005 จากนั้นปิดในปี 2013 เพื่อรีโนเวตครั้งใหญ่โดย Schmidt-Curley บริษัทออกแบบสัญชาติอเมริกัน และกลับมาเปิดอีกครั้งในปี 2014 ภายใต้ชื่อ Legacy การปรับปรุงครั้งนั้นเปลี่ยนเลย์เอาต์ที่ล้าสมัยให้กลายเป็นหนึ่งในสนามที่มีน้ำเป็นองค์ประกอบมากที่สุดในภาคเหนือของไทย โดยมีอุปสรรคน้ำปรากฏอยู่ในทุกหลุม ซึ่งเป็นลักษณะการออกแบบที่เรียกร้องทั้งความแม่นยำของช็อตเหล็กและการวางแผนการเล่นอย่างรอบคอบตลอดทั้งรอบ สนามแห่งนี้อยู่ในเครือ Gassan Golf Group ซึ่งบริหารสนามสามแห่งในพื้นที่ลำพูนและเชียงใหม่ ด้วยระยะ 6,852 หลาและพาร์ 72 Gassan Legacy จึงเล่นในมาตรฐานที่ท้าทาย และดึงดูดทั้งสมาชิกท้องถิ่นและนักกอล์ฟที่เดินทางมาเยือนซึ่งมองหาเลย์เอาต์ที่ดูแลสภาพได้ดีและมีความท้าทาย ต่างจากบรรยากาศภูเขาที่มีป่าไม้หนาแน่นกว่าของ Gassan Khuntan และ Gassan Panorama`,
        layout_and_experience: `การรีโนเวตของ Schmidt-Curley ออกแบบโดยยึดกลุ่มทะเลสาบตรงกลางซึ่งเป็นแกนของช่วงกลางสนาม เส้นทางของสนามใช้น้ำอย่างมีชั้นเชิง เริ่มจากหลุมแรก ๆ ที่วางจังหวะแบบพาร์กแลนด์ผ่านแฟร์เวย์ที่มีแนวต้นไม้ขนาบ จากนั้นเลย์เอาต์ก็ค่อย ๆ นำน้ำเข้ามาเป็นภัยคุกคามหลัก จนถึงช่วงกลางรอบที่ช็อตแอพโพรชต้องข้ามหรือเลาะริมทะเลสาบแทบทุกหลุม

เลย์เอาต์พาร์ 72 ประกอบด้วยพาร์ 3 ห้าหลุมที่มีระยะแตกต่างกัน และพาร์ 5 อีกห้าหลุมที่เปิดทางเลือกแบบเสี่ยงแลกผลตอบแทนสำหรับผู้เล่นที่กล้าท้าทายขอบน้ำ แฟร์เวย์ถือว่ากว้างเมื่อเทียบกับมาตรฐานของภาคเหนือ แต่การมีน้ำขนาบทั้งสองด้านของแนวแอพโพรช บวกกับกรีนที่แน่นและเร็ว ทำให้การตีลูกอย่างแม่นยำได้รับรางวัล ส่วนช็อตที่พลาดต้องจ่ายราคาแพง

กรีนใช้หญ้าเบอร์มิวดาพันธุ์ Tiff Dwarf เพื่อความเร็วที่ดีและความทนทานตลอดฤดูการเจริญเติบโตในเขตร้อน สภาพสนามได้รับคำชมอย่างสม่ำเสมอนับตั้งแต่กลับมาเปิดในปี 2014 การใช้แคดดี้เป็นข้อบังคับ และความรู้ของแคดดี้ท้องถิ่นเรื่องจุดตกลูกที่ถูกต้องช่วยประหยัดสกอร์ได้หลายช็อตสำหรับผู้ที่มาเล่นครั้งแรก`,
        tips: `ค่ากรีนฟีแบบเหมารวมทุกอย่าง (ประมาณ 4,000-4,200 บาท รวมแคดดี้และรถกอล์ฟ) คืออัตรามาตรฐาน ควรยืนยันราคาอีกครั้งตอนจอง เพราะอัตราจะเปลี่ยนไปตามฤดูกาล ทิปแคดดี้ 400 บาทเป็นธรรมเนียมที่ควรเตรียมไว้ และจ่ายเป็นเงินสดให้แคดดี้หลังจบรอบ ควรเล่นช็อตแอพโพรชอย่างระมัดระวัง เพราะขอบน้ำเปิดทางให้แก้เกมได้จำกัด และหลายหลุมอยู่ใกล้โซนดับเบิลโบกี้มาก ควรพกลูกกอล์ฟสำรองติดตัวไปด้วยสักหนึ่งสลีฟ สนามอยู่ห่างจากสนามบิน CNX ประมาณ 30 นาที จึงเหมาะกับการเป็นรอบแรกหรือรอบสุดท้ายของทริปกอล์ฟเชียงใหม่`,
        location_and_access: `Gassan Legacy Golf Club ตั้งอยู่ในอำเภอบ้านธิ จังหวัดลำพูน ห่างลงมาทางใต้ของท่าอากาศยานนานาชาติเชียงใหม่ (CNX) ประมาณ 30 นาทีโดยรถยนต์ ผู้ที่เดินทางจากกรุงเทพฯ ใช้วิธีบินไป CNX (ประมาณ 1 ชั่วโมง 10 นาทีจากสนามบินสุวรรณภูมิหรือสนามบินดอนเมือง) เพราะการขับรถระยะทาง 700 กิโลเมตรจากกรุงเทพฯ ไม่สะดวกในทางปฏิบัติ สนามเดินทางไปถึงได้ด้วย Grab หรือรถส่วนตัวจากตัวเมืองเชียงใหม่หรือจากสนามบิน และ Gassan Group สามารถจัดรถรับส่งให้ได้หากแจ้งล่วงหน้า`,
        rental_cta_context: `วางแผนออกรอบที่ Gassan Legacy Golf Club ระหว่างทริปเชียงใหม่ของคุณอยู่ใช่ไหม เช่าไม้กอล์ฟคุณภาพพรีเมียมที่กรุงเทพฯ พร้อมบริการส่งถึงโรงแรมก่อนคุณขึ้นเครื่อง ให้คุณโฟกัสกับอุปสรรคน้ำอันเลื่องชื่อของสนามนี้ได้เต็มที่โดยไม่ต้องกังวลเรื่องค่าธรรมเนียมโหลดกระเป๋ากอล์ฟ`,
      },
    },
    ko: {
      title: `Gassan Legacy Golf Club 올인클루시브 패키지 — 람푼 18홀 코스 가이드와 클럽 대여`,
      meta_description: `Gassan Legacy Golf Club 올인클루시브 패키지는 약 4,000~4,200바트로 그린피와 캐디, 카트가 모두 포함돼요. Schmidt-Curley가 리노베이션한 람푼주 18홀 코스, 치앙마이 공항에서 약 30분 거리 접근법, 그리고 방콕 호텔로 배달되는 LENGOLF 클럽 대여를 정리했어요.`,
      prose: {
        overview: `Gassan Lake City Golf Club은 지금은 Gassan Legacy Golf Club이라는 이름으로 운영되는 18홀 챔피언십 코스예요. 람푼주 Ban Thi에 자리하고 있고, 치앙마이 국제공항에서 남쪽으로 약 30분 거리입니다. 2005년에 처음 문을 열었다가 2013년에 전면 리노베이션을 위해 문을 닫았고, 미국 설계사 Schmidt-Curley의 손을 거쳐 2014년 Legacy라는 이름으로 다시 문을 열었어요. 이 리노베이션은 낡았던 레이아웃을 태국 북부에서도 손꼽히게 물이 많은 코스로 바꿔 놓았습니다. 모든 홀에 워터 해저드가 등장하는 설계라, 정확한 아이언 샷과 라운딩 내내 이어지는 세심한 코스 매니지먼트를 요구해요. 이 코스는 람푼과 치앙마이 일대에서 세 개의 코스를 운영하는 Gassan Golf Group 소속입니다. 6,852야드, 파 72의 Gassan Legacy 코스는 만만치 않은 수준을 요구하며, 관리 상태가 좋고 도전적인 레이아웃을 찾는 현지 회원과 외지 골퍼를 두루 불러 모아요. 숲이 더 우거진 산악 분위기의 Gassan Khuntan, Gassan Panorama와는 결이 다른 코스입니다.`,
        layout_and_experience: `Schmidt-Curley의 리노베이션은 코스 중반부를 붙잡아 주는 중앙 호수 지대를 축으로 설계됐어요. 루팅은 물을 전략적으로 활용합니다. 나무가 늘어선 페어웨이를 지나며 파크랜드의 리듬을 잡아 주는 초반 홀에서 출발해, 레이아웃은 점차 물을 핵심 위협으로 끌어들이고, 어프로치 샷이 사실상 모든 홀에서 호숫가를 넘기거나 그 곁을 스치듯 지나가야 하는 중반 구간에서 절정에 이릅니다.

파 72 레이아웃에는 길이가 제각각인 파 3 다섯 홀과, 물가를 과감히 공략할 마음이 있는 플레이어에게 리스크와 리워드의 선택지를 주는 파 5 다섯 홀이 들어 있어요. 페어웨이는 태국 북부의 기준으로 보면 넉넉한 편이지만, 어프로치 통로 양쪽에 물이 있고 그린이 단단하고 빠르다 보니 정확한 볼 스트라이킹은 보답을 받고 미스 샷의 대가는 큽니다.

그린은 열대 생육기 내내 좋은 스피드와 회복력을 낼 수 있도록 Tiff Dwarf 버뮤다그래스로 조성했어요. 2014년 재개장 이후 코스 컨디션은 꾸준히 좋은 평가를 받아 왔습니다. 캐디 동반은 의무이고, 올바른 랜딩 존을 아는 현지 캐디의 조언은 처음 찾는 골퍼에게 몇 타를 아껴 줄 수 있어요.`,
        tips: `올인클루시브 그린피(캐디와 카트를 포함해 약 4,000~4,200바트)가 표준 요금이에요. 시즌에 따라 요금이 달라지니 예약할 때 가격을 확인해 두세요. 캐디 팁은 400바트가 관례이고, 라운딩이 끝난 뒤 캐디에게 현금으로 건네면 됩니다. 어프로치 샷은 보수적으로 가져가세요. 물가에서는 리커버리 선택지가 제한적이고, 여러 홀에서 더블보기 구간이 코앞이에요. 여분의 볼 한 슬리브는 챙겨 가는 편이 좋습니다. 코스가 CNX 공항에서 약 30분 거리라, 치앙마이 골프 여행의 첫 라운딩이나 마지막 라운딩으로 넣기에 실용적이에요.`,
        location_and_access: `Gassan Legacy Golf Club은 람푼주 Ban Thi에 있고, 치앙마이 국제공항(CNX)에서 남쪽으로 차로 약 30분 거리예요. 방콕에서 오는 분은 CNX행 항공편이 기본이며, 수완나품 공항이나 돈므앙 공항에서 약 1시간 10분 걸립니다. 방콕에서 700km를 차로 달리는 건 현실적이지 않아요. 치앙마이 시내나 공항에서 Grab 택시 또는 개인 차량으로 갈 수 있고, 요청하면 Gassan Group에서 픽업 차량을 준비해 줍니다.`,
        rental_cta_context: `치앙마이 여행 중 Gassan Legacy Golf Club 라운딩을 계획하고 있다면, 방콕에서 프리미엄 클럽을 빌리는 방법이 편해요. 비행기를 타기 전 방콕 호텔까지 배달해 드리니, 수하물 요금 걱정 없이 이 코스의 이름난 워터 해저드에 집중할 수 있습니다.`,
      },
    },
    zh: {
      title: `Gassan Legacy Golf Club全包套餐与球场攻略 — 南奔18洞与球杆租借`,
      meta_description: `Gassan Legacy Golf Club全包套餐约4,000–4,200泰铢，已含果岭费、球童与球车。球场由Schmidt-Curley操刀改造，位于南奔府，距清迈国际机场约30分钟车程，另附登机前送抵曼谷酒店的LENGOLF球杆租借。`,
      prose: {
        overview: `Gassan Lake City Golf Club如今以Gassan Legacy Golf Club的名义运营，是一座位于南奔府Ban Thi的18洞锦标赛级球场，在清迈国际机场以南约30分钟车程处。球场最初于2005年开业，2013年停业进行全面改造，由美国设计公司Schmidt-Curley操刀，2014年以Legacy之名重新开放。这次改造把一套过时的布局，变成了泰国北部水景最密集的球场之一：每一个洞都有水障碍，这样的设计要求你整场球都保持精准的铁杆击球与缜密的球场管理。球场隶属Gassan Golf Group，该集团在南奔与清迈一带经营三座球场。全长6,852码、标准杆72杆，Gassan Legacy的要求标准不低，既吸引本地会员，也吸引专程前来、想找一座维护到位又具挑战性布局的球手——与林木更为茂密的Gassan Khuntan和Gassan Panorama那种山地氛围形成对比。`,
        layout_and_experience: `Schmidt-Curley的改造围绕一片位于球场中段、起到中枢作用的中央湖区展开。路线对水的运用很有章法：开局几洞先用林木夹道的球道立起园林式的节奏，随后布局逐步把水推成核心威胁，直到中段那一串球洞——攻果岭球几乎在每个洞都必须飞越湖岸，或者贴着湖边穿过去。

这套标准杆72杆的布局里有五个长度各异的3杆洞，以及五个5杆洞，愿意去挑战水线的球手可以在这里做风险与回报的取舍。以泰国北部的标准来看球道算是宽绰，但攻果岭的通道两侧都是水，加上果岭偏硬偏快，精准的击球会得到回报，失误的代价则很高。

果岭铺的是Tiff Dwarf百慕大草，在热带生长季里能保持不错的速度与恢复力。自2014年重新开放以来，球场状态一直广受好评。球童为强制安排，而熟悉正确落点区的本地球童，往往能替第一次来的球手省下好几杆。`,
        tips: `全包套餐（约4,000–4,200泰铢，已含果岭费、球童与球车）是标准价格，不过季节性价格会有浮动，预订时请再确认一次。球童小费按惯例是400泰铢，打完球后以现金交给球童。攻果岭球要打得保守一些——水线附近可以补救的余地有限，很多洞离双柏忌只有一步之遥。记得多带一筒备用球。球场距CNX机场约30分钟车程，很适合安排成清迈高尔夫行程的第一场或最后一场球。`,
        location_and_access: `Gassan Legacy Golf Club位于南奔府Ban Thi，在清迈国际机场（CNX）以南约30分钟车程处。从曼谷前来通常是飞往CNX，自素万那普机场或廊曼机场出发约1小时10分钟；从曼谷开车700公里并不现实。从清迈市区或机场都可以叫Grab或安排私家车前往，Gassan Group也可以应要求安排接送。`,
        rental_cta_context: `打算在清迈行程里到Gassan Legacy Golf Club打一场吗？可以在曼谷租借高级球杆——登机前送到你在曼谷的酒店——这样就不必操心航空公司的球包托运费用，可以专心应付这座球场著名的水障碍。`,
      },
    },
    ja: {
      title: `Gassan Legacy Golf Club（ランプーン）— パッケージ料金・コース紹介・クラブレンタル`,
      meta_description: `オールインクルーシブのパッケージ料金は約4,000〜4,200THBで、グリーンフィーにキャディーとカートが含まれます。Gassan Legacy Golf ClubはSchmidt-Curleyが改修したランプーン県の18ホールで、チェンマイ国際空港から約30分。搭乗前にバンコクのホテルへ届くLENGOLFのクラブレンタルもご案内します。`,
      prose: {
        overview: `Gassan Lake City Golf Clubは、現在Gassan Legacy Golf Clubとして運営されている18ホールのチャンピオンシップコースです。ランプーン県バーンティに位置し、チェンマイ国際空港から南へ約30分。2005年に開場したのち、2013年に全面改修のため一度クローズし、アメリカの設計会社Schmidt-Curleyの手を経て2014年にLegacyの名で再スタートしました。この改修は、古びていたレイアウトをタイ北部でも屈指の水の多いコースへと変貌させています。すべてのホールにウォーターハザードが現れる設計で、正確なアイアンショットと、ラウンドを通した緻密なコースマネジメントが求められます。コースはランプーンとチェンマイ一帯で3つのコースを運営するGassan Golf Groupの一員。6,852ヤード、パー72のGassan Legacyは要求度の高いコースで、地元メンバーからも、コンディションの良い挑戦的なレイアウトを求めて訪れるゴルファーからも支持を集めています。より森の深い山岳の趣を持つGassan KhuntanやGassan Panoramaとは対照的な一面です。`,
        layout_and_experience: `Schmidt-Curleyによる改修は、コース中盤を束ねる中央のレイク群を軸に設計されました。ルーティングは水を戦略的に使います。木々に縁取られたフェアウェイでパークランドのリズムを整える序盤のホールから始まり、レイアウトは徐々に水を中心的な脅威として引き込み、アプローチショットがほぼすべてのホールでレイクの縁を越える、あるいはその際を縫うことを求められる中盤の連続でクライマックスを迎えます。

パー72のレイアウトには、距離の異なるパー3が5ホールと、水際を攻める気のあるプレーヤーにリスクとリワードの選択肢を与えるパー5が5ホール含まれます。フェアウェイはタイ北部の基準では広めですが、アプローチの通り道の両側に水があり、グリーンが硬く速いことも相まって、正確なボールストライキングは報われ、ミスヒットの代償は大きくなります。

グリーンは熱帯の生育期を通して良好なスピードと回復力を保てるよう、Tiff Dwarfバミューダグラスで造成されています。2014年の再オープン以降、コースコンディションは一貫して高い評価を受けてきました。キャディーの帯同は必須で、正しい落としどころを知る地元キャディーの知識は、初めて訪れるゴルファーのスコアを何打も助けてくれます。`,
        tips: `オールインクルーシブのグリーンフィー（キャディーとカート込みで約4,000〜4,200THB）が標準料金です。シーズンによって料金が変わるため、予約時に価格をご確認ください。キャディーへのチップは400THBが目安で、ラウンド後に現金でキャディーへお渡しします。アプローチショットは慎重に。水際はリカバリーの選択肢が限られ、多くのホールでダブルボギーが目の前にあります。予備のボールを1スリーブ持っていきましょう。コースはCNX空港から約30分の距離にあり、チェンマイのゴルフ旅行の初日または最終日のラウンドとして組み込みやすい立地です。`,
        location_and_access: `Gassan Legacy Golf Clubはランプーン県バーンティにあり、チェンマイ国際空港（CNX）から南へ車でおよそ30分です。バンコクからはCNXへの空路が基本で、スワンナプーム空港またはドンムアン空港から約1時間10分。バンコクから700kmを車で走るのは現実的ではありません。チェンマイ市内や空港からはGrabタクシーや自家用車でアクセスでき、Gassan Groupにリクエストすれば送迎の手配も可能です。`,
        rental_cta_context: `チェンマイ滞在中にGassan Legacy Golf Clubでのラウンドを予定しているなら、バンコクでのプレミアムクラブレンタルが便利です。搭乗前にバンコクのホテルまでお届けするので、手荷物料金を気にせず、このコースで名高いウォーターハザードに集中できます。`,
      },
    },
  },
  status: 'published',
  published_at: '2026-04-21',
}
