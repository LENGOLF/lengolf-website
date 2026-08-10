import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import RawLink from 'next/link'
import { Link } from '@/i18n/navigation'
import { hasTranslationForLocale } from '@/lib/translated-routes'
import { SOCIAL_LINKS, BUSINESS_INFO, storageUrl } from '@/lib/constants'
import { FacebookIcon, LineIcon, InstagramIcon } from '@/components/shared/SocialIcons'

const FOOTER_MENU_KEYS = [
  { key: 'home', href: '/' as const },
  { key: 'aboutUs', href: '/about-us' as const },
  { key: 'simulatorBays', href: '/golf' as const },
  { key: 'events', href: '/events' as const },
  { key: 'lessons', href: '/lessons' as const },
  { key: 'foodDrinks', href: '/menu' as const },
  { key: 'clubsAtLengolf', href: '/golf-club-rental' as const },
  { key: 'clubsCourseRental', href: '/golf-course-club-rental' as const },
  { key: 'blog', href: '/blog' as const },
] as const

const DISCOVER_LINKS = [
  { key: 'thingsToDoLink', href: '/activities/' as const },
  { key: 'planningLink', href: '/golf-in-thailand-guide/' as const },
  { key: 'golfCoursesLink', href: '/golf-courses/' as const },
  { key: 'hotelsLink', href: '/hotels/' as const },
  { key: 'faqLink', href: '/faq/' as const },
] as const

const linkStyle = {
  fontFamily: '"Poppins", sans-serif',
  fontWeight: 400,
  color: '#333333',
  fontSize: '14px',
  paddingTop: '7px',
  paddingBottom: '7px',
} as const

export default async function Footer() {
  const locale = await getLocale()
  const t = await getTranslations('Footer')
  const tNav = await getTranslations('Nav')

  return (
    <footer>
      {/* Main footer */}
      <div
        style={{
          backgroundColor: '#F6FFFA',
          borderTop: '1px solid #9DCCA880',
        }}
      >
        <div
          className="flex flex-col items-center text-center lg:flex-row lg:items-start lg:text-left"
          style={{
            paddingTop: '5%',
            paddingBottom: '5%',
            paddingLeft: '6%',
            paddingRight: '6%',
            gap: '30px',
          }}
        >
          {/* Col 1: Logo, Address & Hours — 36% */}
          <div className="w-full lg:w-[36%] flex-shrink-0">
            <Image
              src={storageUrl('branding/logo.png')}
              alt="LENGOLF"
              width={194}
              height={26}
              className="mx-auto h-auto w-[160px] lg:mx-0 lg:w-[180px]"
            />
            <p
              className="mt-4 whitespace-pre-line"
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 400,
                color: '#333333',
                fontSize: '14px',
                lineHeight: '22px',
              }}
            >
              {t('address')}
            </p>
            <p
              className="mt-2"
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 500,
                color: '#005a32',
                fontSize: '14px',
                lineHeight: '22px',
              }}
            >
              {t('hoursInline')}
            </p>
            {/*
              Registered entity block. Kept deliberately: card acquirers and other
              KYC reviewers require the legal name and registered address to be
              findable on every page, and match it against the company affidavit.
              Do not collapse this into the venue address above — they are the same
              building under two different names, and only this one is registered.
            */}
            <p
              className="mt-3"
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 400,
                color: '#6b7280',
                fontSize: '12px',
                lineHeight: '18px',
              }}
            >
              {BUSINESS_INFO.legalName}
              <br />
              {BUSINESS_INFO.registeredAddress}
              <br />
              {t('taxId')}: {BUSINESS_INFO.taxId}
            </p>
          </div>

          {/* Col 2: Menu — 22% */}
          <div className="w-full lg:w-[22%]">
            <h3
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: '18px',
                fontWeight: 600,
                color: '#005a32',
                marginBottom: '12px',
              }}
            >
              {t('menu')}
            </h3>
            <ul>
              {FOOTER_MENU_KEYS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block transition-colors hover:text-[#005a32]"
                    style={linkStyle}
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Discover More — 20% */}
          <div className="w-full lg:w-[20%]">
            <h3
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: '18px',
                fontWeight: 600,
                color: '#005a32',
                marginBottom: '12px',
              }}
            >
              {t('discoverMore')}
            </h3>
            <ul>
              {DISCOVER_LINKS.map((item) => {
                // DERIVED, not a hand-maintained flag. The locale-aware Link
                // prefixes every href; for a target with no translation in
                // this locale the middleware then 301s it straight back to
                // English — a wasted hop on every page in the site, since the
                // footer renders on all of them. Three of these five are
                // currently untranslated in all four locales
                // (/activities/, /golf-in-thailand-guide/, /hotels/), and a
                // hand-kept flag had already drifted to covering only one.
                // Deriving it means the hop disappears the moment a section
                // IS translated, with nothing to remember.
                const LinkTag = hasTranslationForLocale(locale, item.href)
                  ? Link
                  : RawLink
                return (
                  <li key={item.href}>
                    <LinkTag
                      href={item.href}
                      className="block transition-colors hover:text-[#005a32]"
                      style={linkStyle}
                    >
                      {t(item.key)}
                    </LinkTag>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Col 4: Keep in Touch — 22% */}
          <div className="w-full lg:w-[22%]">
            <h3
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: '18px',
                fontWeight: 600,
                color: '#005a32',
                marginBottom: '12px',
              }}
            >
              {t('keepInTouch')}
            </h3>
            <div className="flex flex-col items-center lg:items-start">
              <a
                href={`tel:${BUSINESS_INFO.phoneRaw}`}
                className="block transition-colors hover:text-[#005a32]"
                style={linkStyle}
              >
                {BUSINESS_INFO.phone}
              </a>
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="block transition-colors hover:text-[#005a32]"
                style={linkStyle}
              >
                {BUSINESS_INFO.email}
              </a>
              <div className="flex items-center mt-3" style={{ gap: '5px' }}>
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FacebookIcon size={22} color="#007429" />
                </a>
                <a href={SOCIAL_LINKS.line} target="_blank" rel="noopener noreferrer" aria-label="LINE">
                  <LineIcon size={22} color="#007429" />
                </a>
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramIcon size={22} color="#007429" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-primary/10 bg-[#f0f9f4] px-[6%] py-4">
        <div className="flex flex-col items-center gap-2 text-center text-xs text-foreground/70 sm:flex-row sm:justify-between sm:text-left">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="transition-colors hover:text-primary">{t('privacyPolicy')}</Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-primary">{t('termsOfService')}</Link>
            <Link href="/golf-course-club-rental-agreement" className="transition-colors hover:text-primary">{t('rentalAgreement')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
