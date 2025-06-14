import { InputHTMLAttributes, ReactNode } from 'react'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

export interface InputProps extends InputHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    leading?: ReactNode

    register?: UseFormRegisterReturn
    error?: FieldError
}
