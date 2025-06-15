import { MouseEventHandler, ReactNode } from 'react'

export interface ButtonProps {
    className?: string
    id?: string
    type?: 'submit' | 'button' | 'reset'
    title?: string
    children: ReactNode
    disabled?: boolean
    isLoading?: boolean
    isFullWidth?: boolean
    variant?: 'primary' | 'secondary'
    asDiv?: boolean

    onClick?: MouseEventHandler<HTMLElement> | undefined
}
