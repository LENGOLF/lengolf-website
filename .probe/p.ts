import { loadCourseFiles } from '../scripts/course-files'
import { popularityScore } from '../lib/golf-courses-derived'
import { PRICE_TIERS } from '../data/price-tiers'

async function main() {
  const files = await loadCourseFiles()
  const all = files.map(f => f.course)
  const pkg = all.filter(c => (c as any).fee_is_package)
  console.log('TOTAL COURSES:', all.length)
  console.log('PACKAGE:', pkg.map(c => `${c.slug} region=${c.region} wd=${c.green_fee_weekday_thb} we=${c.green_fee_weekend_thb} seasonal=${!!c.fee_is_seasonal}`))
  console.log('TIERS:', PRICE_TIERS.map(t => JSON.stringify(t).slice(0,200)))
}
main()
