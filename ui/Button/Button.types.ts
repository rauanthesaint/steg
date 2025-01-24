import { ButtonHTMLAttributes, ElementType } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean
    isFullWidth?: boolean
    as?: ElementType

    variant?: 'primary' | 'secondary' | 'tertiary'
    download?: boolean
    href?: string
    target?: string
    rel?: string

    isIconOnly?: boolean

    size?: 'sm' | 'md'
}
