import { redirect } from 'next/navigation'
import { siteConfig } from '@/shared/config/siteConfig'

export default function Page() {
    redirect(siteConfig.tools[0].href)
}
