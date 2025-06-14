'use client'

import { ReactNode } from 'react'
import { siteConfig } from '@/shared/config/siteConfig'
import { Toolbar } from '@/widgets'
import { Container } from '@/shared/components'

export default function Layout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <Toolbar tools={siteConfig.tools} />
            <Container>{children}</Container>
        </>
    )
}
