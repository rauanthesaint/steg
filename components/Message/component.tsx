'use client'

import { FC, useEffect, useState } from 'react'
import s from './component.module.scss'
import { MessageProps } from './component.types'
import clsx from 'clsx'
import { AnimatePresence, motion, Variants } from 'framer-motion'

const animation: Variants = {
    inactive: { opacity: 0, y: -20 },
    active: { opacity: 1, y: 0 },
}

const indicatorAnimation: Variants = {
    default: { width: 0 },
    complete: { width: '100%' },
}

const Message: FC<MessageProps> = ({ children, status = 'success' }) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 5000) // 5 seconds

        return () => {
            clearTimeout(timer)
        }
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    variants={animation}
                    initial="inactive"
                    animate="active"
                    exit="inactive"
                    className={clsx(s.message, s[status])}
                >
                    <div className={s.content}>{children}</div>
                    <motion.div
                        variants={indicatorAnimation}
                        initial="default"
                        animate="complete"
                        className={s.indicator}
                        transition={{ duration: 5 }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Message
