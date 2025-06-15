'use client'

import { Stack } from '@/widgets'
import React, { createContext, useContext, useState, useCallback } from 'react'

// Types
export interface Notification {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
}

interface NotificationContextType {
    notifications: Notification[]
    addNotification: (notification: Omit<Notification, 'id'>) => void
    removeNotification: (id: string) => void
    clearAll: () => void
}

// Context
const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
)

// Provider Component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([])

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, [])

    const clearAll = useCallback(() => {
        setNotifications([])
    }, [])

    const addNotification = useCallback(
        (notification: Omit<Notification, 'id'>) => {
            const id =
                Date.now().toString() + Math.random().toString(36).substr(2, 9)
            const newNotification = { ...notification, id }

            setNotifications((prev) => [...prev, newNotification])

            // Auto remove after duration (default 5 seconds)
            if (notification.duration !== 0) {
                setTimeout(() => {
                    removeNotification(id)
                }, notification.duration || 3000)
            }
        },
        [removeNotification]
    )

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                removeNotification,
                clearAll,
            }}
        >
            {children}
            <Stack />
        </NotificationContext.Provider>
    )
}
// Hook
export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error(
            'useNotifications must be used within NotificationProvider'
        )
    }
    return context
}
