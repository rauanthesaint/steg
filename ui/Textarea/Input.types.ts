import { InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    leading?: ReactNode
}
