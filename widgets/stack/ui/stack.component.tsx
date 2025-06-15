'use client'

import { motion } from 'framer-motion'
import {
    Notification,
    useNotifications,
} from '@/app/providers/NotificationProvider'
import styles from './stack.styles.module.scss'
import {
    CheckCircleSolid,
    MessageAlertSolid,
    WarningTriangleSolid,
    InfoCircleSolid,
    IconoirProvider,
    Xmark,
} from 'iconoir-react'
import { useState, useEffect } from 'react'

export default function Stack() {
    const {
        notifications,
        //  clearAll
    } = useNotifications()
    if (notifications.length === 0) {
        return null
    }

    return (
        <section className={styles.container}>
            {/* <div onClick={clearAll}>Clear All</div> */}
            {notifications.map((item, index) => {
                return (
                    <NotificationItem
                        notification={item}
                        key={`item-${index}`}
                    />
                )
            })}
        </section>
    )
}

const OPACITY = 0.15

const getIcon = (type: string) => {
    switch (type) {
        case 'success':
            return <CheckCircleSolid />
        case 'error':
            return <MessageAlertSolid />
        case 'warning':
            return <WarningTriangleSolid />
        case 'info':
            return <InfoCircleSolid />
    }
}

const getBgColor = (type: string) => {
    switch (type) {
        case 'success':
            return `hsla(var(--success), ${OPACITY})`
        case 'error':
            return `hsla(var(--error), ${OPACITY})`
        case 'warning':
            return `hsl(var(--warning), ${OPACITY})`
        case 'info':
            return `hsl(var(--info), ${OPACITY})`
    }
}

const getColor = (type: string) => {
    switch (type) {
        case 'success':
            return `hsla(var(--success))`
        case 'error':
            return `hsla(var(--error))`
        case 'warning':
            return `hsl(var(--warning))`
        case 'info':
            return `hsl(var(--info))`
    }
}
interface NotificationItemProps {
    notification: Notification
}
const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
}) => {
    const { removeNotification } = useNotifications()
    const [progress, setProgress] = useState(100)
    const [isPaused, setIsPaused] = useState(false)

    const duration = notification.duration || 3000 // Default 5 seconds
    const shouldShowProgress = duration > 0

    useEffect(() => {
        if (!shouldShowProgress || isPaused) return

        const startTime = Date.now()
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime
            const remaining = Math.max(0, duration - elapsed)
            const progressPercent = (remaining / duration) * 100

            setProgress(progressPercent)

            if (remaining <= 0) {
                clearInterval(interval)
            }
        }, 50) // Update every 50ms for smooth animation

        return () => clearInterval(interval)
    }, [duration, shouldShowProgress, isPaused])

    const handleMouseEnter = () => {
        setIsPaused(true)
    }

    const handleMouseLeave = () => {
        setIsPaused(false)
    }

    return (
        <motion.article
            style={{
                backgroundColor: getBgColor(notification.type),
                color: getColor(notification.type),
            }}
            className={styles.item}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
        >
            <IconoirProvider iconProps={{ width: 20, height: 20 }}>
                {getIcon(notification.type)}
            </IconoirProvider>

            <div className={styles.content}>
                <span className={styles.title}>{notification.title}</span>
                {notification.message && (
                    <p className={styles.message}>{notification.message}</p>
                )}
            </div>

            <button
                type="button"
                title="Remove"
                onClick={() => removeNotification(notification.id)}
                className={styles.closeButton}
            >
                <Xmark width={16} height={16} />
            </button>

            {/* Duration Progress Bar */}
            {shouldShowProgress && (
                <div className={styles.progressContainer}>
                    <motion.div
                        className={styles.progressBar}
                        style={{
                            backgroundColor: getColor(notification.type),
                            opacity: isPaused ? 0.3 : 0.6,
                        }}
                        initial={{ width: '100%' }}
                        animate={{
                            width: `${progress}%`,
                            transition: {
                                duration: isPaused ? 0 : 0.05,
                                ease: 'linear',
                            },
                        }}
                    />
                </div>
            )}
        </motion.article>
    )
}
