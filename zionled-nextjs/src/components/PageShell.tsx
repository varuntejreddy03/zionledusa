import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import ContactSection from '@/components/sections/ContactSection'
import { getNavigationGroups, getSiteMeta } from '@/lib/data'
import type { NavigationGroup, SiteMeta } from '@/types/product'

interface PageShellProps {
  children: React.ReactNode
  showContact?: boolean
  mainClassName?: string
  meta?: SiteMeta
  navigation?: NavigationGroup[]
}

export default function PageShell({
  children,
  showContact = false,
  mainClassName,
  meta: propMeta,
  navigation: propNavigation,
}: PageShellProps) {
  const meta = propMeta ?? getSiteMeta()
  const navigation = propNavigation ?? getNavigationGroups()

  return (
    <>
      <Navbar meta={meta} navigation={navigation} />
      <main className={mainClassName}>
        {children}
        {showContact ? <ContactSection meta={meta} /> : null}
      </main>
      <Footer meta={meta} navigation={navigation} />
    </>
  )
}
