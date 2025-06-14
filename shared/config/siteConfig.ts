import { Metadata } from 'next'
import { Tool } from '../types'

type Site = {
    tools: Tool[]
} & Metadata

export const siteConfig: Site = {
    title: 'Diploma',

    tools: [
        {
            title: 'Encrypt',
            href: '/process/encrypt',
        },
        {
            title: 'Decrypt',
            href: '/process/decrypt',
        },
    ],
}
