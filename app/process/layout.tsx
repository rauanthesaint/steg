'use client'

import { ReactNode, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import s from './layout.module.scss'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
export default function Layout({
    children,
}: Readonly<{ children: ReactNode }>) {
    const router = useRouter()
    const [tabWidth, setTabWidth] = useState<number>(0)
    const ref = useCallback((node: HTMLElement | null) => {
        if (node !== null) {
            setTabWidth(node.clientWidth)
        }
    }, [])
    const [active, setActive] = useState<number>(0)
    const handleActive = (index: number, url: string) => {
        setActive(index)
        router.push(url)
    }

    return (
        <div>
            <section className={`${s.tabsContainer} container`}>
                <div className={s.tabs}>
                    <div
                        className={clsx(s.tab, active === 0 && s.active)}
                        ref={ref}
                        onClick={() => handleActive(0, '/process/encrypt')}
                    >
                        <span>Encrypt</span>
                    </div>
                    <div
                        className={clsx(s.tab, active === 0 && s.active)}
                        onClick={() => handleActive(1, '/process/decrypt')}
                    >
                        <span>Decrypt</span>
                    </div>
                    <motion.div
                        style={{ width: tabWidth }}
                        animate={{
                            left: active * tabWidth + 4 * active + 4,
                        }}
                        className={s.curtain}
                    />
                </div>
            </section>
            {children}
        </div>
    )
}
