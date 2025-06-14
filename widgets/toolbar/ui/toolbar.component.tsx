'use client'

import styles from './toolbar.styles.module.scss'
import { Tool } from '@/shared/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Container } from '@/shared/components'

interface ToolbarProps {
    tools: Tool[]
}

export default function Toolbar({ tools }: ToolbarProps) {
    const pathname = usePathname()

    const isSelected = (route: string) => {
        return pathname === route
    }

    return (
        <section className={styles.container}>
            <Container className={styles.content}>
                {tools.map((item, index) => {
                    return (
                        <Link
                            key={`tool-${index}`}
                            href={item.href}
                            className={styles.item}
                        >
                            {isSelected(item.href) && (
                                <motion.div
                                    layoutId="underline"
                                    className={styles.underline}
                                />
                            )}
                            {item.title}
                        </Link>
                    )
                })}
            </Container>
        </section>
    )
}
