import { Metadata } from 'next'
import { Tool } from '../types'

type Site = {
    tools: Tool[]
} & Metadata

export const siteConfig: Site = {
    title: 'Diploma',

    tools: [
        {
            title: 'Encode',
            href: '/process/encode',
        },
        {
            title: 'Decode',
            href: '/process/decode',
        },
    ],
}
