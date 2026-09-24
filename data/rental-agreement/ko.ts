import { BUSINESS_INFO } from '@/lib/constants'
import type { RentalAgreementContent } from './types'

// Korean translation of ./en.ts (the governing text; §12). Decisions a later
// editor should know before touching this file:
//
// - Register is formal 합니다체 contract style throughout, NOT the glossary's
//   default 해요체: this is legal text, and the site's rental copy
//   (CourseClubRental.prepaymentNote, CourseClubRentalFaq.a6) is 합니다체 too.
// - Defined terms, rendered the same way every time: this "Agreement" = 본 약관
//   (head noun matches Footer.rentalAgreement "대여 약관"); the "Equipment" =
//   장비; you/the "Renter" = 귀하/임차인; "we"/"us" = 당사, while every place
//   the English names LENGOLF keeps LENGOLF. EN's two pronouns ("we", "us")
//   collapse into one Korean term, 당사.
// - "case by case" (4x) = 사안별로. "reasonable" = 합리적인. "fair replacement
//   value" = 공정한 교체 가액 (deliberately not an insurance term of art).
// - Section cross-references use 제N조. Numbers are Arabic digits and the digit
//   multiset per section matches EN (validate-i18n enforces it), so do not
//   write "1일" for "day" or add a floor number to the venue name.
// - lastUpdated uses the Korean date form (2026년 8월 7일). The parity check
//   accepts the agreement date with a numeric month on this one line.
// - Particles after Latin names: LENGOLF reads 렌골프 (vowel-final), so it takes
//   는/가/와. Every other Latin token (LINE @lengolf, booking.len.golf, VAT,
//   The Mercury Ville) is followed by a comma, a parenthesis, a Korean noun or
//   a consonant-invariant particle (에서/에/의), never by an allomorphic one.
// - Reused site wording: §9's bold sentence is CourseClubRental
//   .heroCancellationNote with a 합니다체 ending; 정상 마모 / 수리 비용 / 보증금
//   follow CourseClubRentalFaq a2/a16; the pickup-cash clause follows
//   CourseClubRental.paymentDesc; 개인정보 처리방침 and 사업자등록번호 (Tax ID)
//   follow the Footer namespace rendered on the same page; 전화 / 이메일 labels
//   follow CourseClubRental.contact*Label.
// - Currency is spelled 바트 (glossary); Latin "THB" is not used in prose.
export const ko: RentalAgreementContent = {
  sourceVersion: '2026-08-07',
  title: '골프장 클럽 대여 약관',
  metaTitle: '골프장 클럽 대여 약관',
  metaDescription:
    'LENGOLF 골프장 클럽 대여 약관: 모든 외부(골프장) 골프 클럽 대여에 적용되는 조건입니다.',
  lastUpdated: '최종 수정일: 2026년 8월 7일',
  notice: {
    text: '이 한국어 번역본은 편의를 위해 제공되며, 영문본과 내용이 상충하는 경우 영문본이 우선합니다.',
    linkText: '영문본 보기',
  },
  intro: [
    '본 약관은 LENGOLF CO., LTD.(이하 "LENGOLF" 또는 "당사")가 골프장에서의 외부 사용을 위하여 귀하(이하 "임차인")에게 골프 클럽 세트 및 관련 장비(이하 "장비")를 대여하는 것에 관하여 규정합니다. 본 약관은 booking.len.golf, LINE, 전화, 이메일 또는 직접 방문 중 어떤 방법으로 예약하든, 귀하가 당사와 진행하는 모든 외부(골프장) 대여에 적용됩니다. 실내 및 매장 내 시뮬레이터용 클럽 대여에는 본 약관이 적용되지 않습니다.',
    '당사와 골프장용 클럽 대여 예약을 확정함으로써 귀하는 본 약관에 동의합니다.',
  ],
  sections: [
    {
      heading: '1. 대여',
      items: [
        '당사는 예약 확인서에 표시된 클럽 세트와 추가 품목을, 예약 확인서에 명시된 대여 기간(시작 일시부터 반납 일시까지) 동안 귀하에게 대여합니다.',
        '장비는 항상 LENGOLF의 소유입니다.',
        '귀하는 LENGOLF(BTS 칫롬역 The Mercury Ville)에서 장비를 수령하거나 배송을 요청할 수 있습니다(제7조 참조).',
      ],
    },
    {
      heading: '2. 요금 및 결제',
      items: [
        '대여 요금, 배송비 및 추가 품목 가격은 예약 시 표시된 금액이며, 태국 바트 기준 VAT 포함 가격입니다. 결제는 예약 시점에 결제 단계에서 제공되는 결제 수단 중 하나를 이용하여 온라인으로 이루어집니다. 배송 주문은 온라인 선결제가 필요하며, 픽업 주문은 픽업 시 현금 결제도 선택할 수 있습니다.',
        '보증금은 필요하지 않습니다.',
        '결제를 완료하실 때까지 예약은 최대 2시간 동안 유지됩니다. 이 시간 내에 결제가 완료되지 않으면 예약은 자동으로 취소되며 장비 확보도 해제됩니다.',
      ],
    },
    {
      heading: '3. 인도 시 상태',
      items: [
        `장비를 수령하거나 배송받으실 때 장비를 점검해 주십시오. 누락되었거나 손상되었거나 예상과 다른 부분이 있으면 사용하기 전에 당사에 알려 주십시오(LINE @lengolf, ${BUSINESS_INFO.phone} 또는 ${BUSINESS_INFO.email}).`,
        '사용 전에 문제를 알리지 않으시면, 장비는 빠짐없이 양호한 상태로 수령된 것으로 간주됩니다.',
      ],
    },
    {
      heading: '4. 귀하의 책임',
      items: [
        '장비는 통상적인 방법으로 골프를 치는 용도로만 사용하여야 하며, 대여 기간 동안 귀하의 소지 및 관리하에 두어야 합니다.',
        '장비를 합리적인 주의를 기울여 관리하고, 분실, 도난 및 피할 수 있는 손상으로부터 보호하여야 합니다.',
        '장비를 다른 사람에게 판매하거나, 재대여하거나, 빌려주거나, 넘겨주어서는 안 됩니다.',
        '골프백과 모든 클럽 및 추가 품목을 포함한 세트 전체를 합의된 반납 시간까지 반납하여야 합니다.',
      ],
    },
    {
      heading: '5. 정상 마모',
      paragraphs: [
        '가벼운 긁힘, 그립 마모, 표면 자국 등 일반적인 골프 사용으로 인한 정상 마모는 예상되는 것이며 LENGOLF가 부담합니다. 이에 대한 비용은 귀하에게 청구되지 않습니다.',
      ],
    },
    {
      heading: '6. 분실, 도난 또는 손상',
      items: [
        '귀하는 장비가 귀하의 관리하에 있는 동안 발생한, 정상 마모(제5조)를 넘어서는 장비의 분실, 도난 또는 손상에 대하여 책임을 집니다.',
        '장비가 손상된 경우, 귀하는 합리적인 수리 비용을 지불하는 데 동의합니다. 품목이 분실 또는 도난되거나 경제적으로 수리할 수 없을 정도로 손상된 경우, 귀하는 해당 품목의 공정한 교체 가액을 지불하는 데 동의합니다. 당사는 수리 비용과 공정한 교체 가액을 사안별로 산정하며, 비용을 부과하기 전에 모든 청구 금액을 귀하에게 설명합니다.',
        '장비가 분실, 도난 또는 손상된 경우 가능한 한 빨리 당사에 알려 주십시오.',
      ],
    },
    {
      heading: '7. 배송 및 픽업',
      items: [
        '당사는 협의에 따라 방콕 및 인근 지역 내에서 배송합니다. 배송 및 반납 픽업 시간과 장소는 예약 시 합의합니다. 방콕 광역권 외의 지역은 사안별로 처리되므로 당사에 문의해 주십시오.',
        '배송 시 장비를 수령하고 반납 픽업 시 장비를 돌려주기 위해, 합의된 장소와 시간에 누군가가 대기하고 있어야 합니다.',
        '대기하는 사람이 없거나 제공된 정보가 잘못되어 당사가 배송 또는 픽업을 완료할 수 없는 경우, 추가 요금이 부과되거나 지연이 발생할 수 있습니다.',
      ],
    },
    {
      heading: '8. 반납 지연',
      items: [
        '장비는 합의된 반납 일시까지 반납되어야 합니다. 그보다 오래 보유하시는 경우, 반납될 때까지 추가되는 하루(또는 하루 중 일부)마다 표준 일일 요금으로 추가 대여료가 부과됩니다.',
        '장비가 반납되지 않고 당사가 귀하와 연락이 닿지 않는 경우, 당사는 제6조에 따라 해당 장비를 분실된 것으로 처리할 수 있습니다.',
      ],
    },
    {
      heading: '9. 취소 및 환불',
      items: [
        `**대여 시작 24시간 전까지 무료 취소가 가능합니다.** 대여 기간 시작 24시간 이상 전에 취소하시면 취소 수수료 없이 결제하신 금액 전액을 환불해 드립니다. 취소하시려면 LINE @lengolf, 전화(${BUSINESS_INFO.phone}) 또는 이메일(${BUSINESS_INFO.email})로 당사에 연락해 주십시오.`,
        '대여 기간 시작까지 24시간 미만을 남기고 이루어진 취소는 사안별로 검토됩니다. 당사는 환불을 처리하기 전에 환불되는 금액이 있는지, 있다면 무엇이 환불되는지를 귀하에게 알려 드립니다.',
        '귀하가 장비를 수령하지 않거나 장비를 받을 수 있도록 대기하지 않는 경우(노쇼), 해당 예약은 취소된 것으로 처리될 수 있으며, 환불은 사안별로 처리됩니다.',
        '환불은 예약 시 사용한 원래 결제 수단으로 이루어집니다. 카드 환불은 일반적으로 당사가 환불을 처리한 날로부터 영업일 기준 5~10일 이내에 귀하의 은행을 통해 반영됩니다.',
        '귀하가 예약한 장비를 당사가 제공할 수 없는 경우, 귀하는 이용 가능한 대체 장비 또는 전액 환불 중에서 선택할 수 있습니다.',
      ],
    },
    {
      heading: '10. 본인 책임하의 사용 및 책임의 제한',
      items: [
        '골프는 신체 활동을 수반하며 고유한 위험이 따릅니다. 귀하는 본인의 위험 부담으로 장비를 사용하며, 본인의 역량에 맞게 안전하고 적절하게 장비를 사용할 책임이 있습니다.',
        '장비는 여가 목적의 골프용으로 "있는 그대로" 제공됩니다. 법률이 허용하는 범위 내에서, LENGOLF는 귀하의 장비 사용으로 인해 발생하는 어떠한 부상, 손실 또는 손해에 대해서도, 그리고 어떠한 간접적 손실 또는 결과적 손실에 대해서도 책임을 지지 않습니다.',
        '본 약관의 어떠한 내용도 태국 법률에 따라 배제될 수 없는 귀하의 권리를 제한하지 않습니다.',
      ],
    },
    {
      heading: '11. 개인정보',
      paragraphs: [
        '당사는 귀하의 대여 이행을 위해 귀하가 제공한 개인정보를 당사의 개인정보 처리방침(len.golf/privacy-policy)에 따라 처리합니다.',
      ],
    },
    {
      heading: '12. 준거법 및 언어',
      items: [
        '본 약관은 태국 법률을 준거법으로 하며, 모든 분쟁은 태국 법원의 관할에 따릅니다.',
        '본 약관은 영어로 작성되었습니다. 모든 번역본은 편의를 위해서만 제공되며, 내용이 상충하는 경우 영문본이 우선합니다.',
      ],
    },
    {
      heading: '13. 연락처',
      items: [
        `LINE: @lengolf · 전화: ${BUSINESS_INFO.phone} · 이메일: ${BUSINESS_INFO.email}`,
        `${BUSINESS_INFO.legalName} (사업자등록번호 ${BUSINESS_INFO.taxId}), ${BUSINESS_INFO.registeredAddress}.`,
      ],
    },
    {
      heading: '14. 동의',
      paragraphs: [
        '온라인, LINE, 전화, 이메일 또는 직접 방문 중 어떤 방법으로든 LENGOLF와 골프장용 클럽 대여 예약을 확정함으로써, 귀하는 본 약관을 읽고 이해하였으며 이에 동의함을 확인합니다.',
      ],
    },
  ],
  closing: [
    '당사는 본 약관을 수시로 변경할 수 있으며, 귀하가 예약할 당시 시행 중인 버전의 약관이 해당 대여에 적용됩니다.',
  ],
}
