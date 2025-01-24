import { ReactNode } from 'react'

export interface MessageProps {
    status?: 'warning' | 'success' | 'error'
    children: ReactNode
}
