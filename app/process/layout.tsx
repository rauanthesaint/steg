'use client'

import { ReactNode } from 'react'
import { siteConfig } from '@/shared/config/siteConfig'
import { Header, Toolbar } from '@/widgets'
import { Container } from '@/shared/components'

export default function Layout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <Header />
            <Toolbar tools={siteConfig.tools} />
            <Container>{children}</Container>
        </>
    )
}
