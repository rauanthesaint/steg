import { SelectOptionType } from '@/shared/types/components.types'
import { ReactNode } from 'react'

export interface SelectProps {
    data: SelectOptionType[]
    label?: string
    leading?: ReactNode
}
