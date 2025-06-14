import type { Metadata } from 'next'

import '@/public/static/styles/globals.scss'
import '@/public/static/styles/variables.scss'
import '@/public/static/styles/normalize.scss'
import '@/public/static/styles/typography.scss'

import { siteConfig } from '@/shared/config/siteConfig'
import { StoreProvider } from './providers/StoreProvider'

export const metadata: Metadata = {
    title: siteConfig.title,
    description: siteConfig.description,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <StoreProvider>{children}</StoreProvider>
            </body>
        </html>
    )
}
