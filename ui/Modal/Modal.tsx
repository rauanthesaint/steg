'use client'

import { FC, ReactNode } from 'react'
import s from './Modal.module.scss'
import { AnimatePresence, Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import Button from '../Button'
import clsx from 'clsx'
import { XMarkIcon } from '@heroicons/react/24/outline'

const variants: Variants = {
    inactive: { right: '-100%', opacity: 0 },
    active: { right: 0, opacity: 1 },

    blurActive: { opacity: 1 },
    blurInActive: { opacity: 0 },
}

const Modal: FC<{
    children: ReactNode
    open: boolean
    onClose: () => void
    className?: string
}> = ({ children, open, onClose, className }) => {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        variants={variants}
                        initial="blurInActive"
                        animate="blurActive"
                        exit={'blurInActive'}
                        className={s.curtain}
                        onClick={onClose}
                    />
                    <motion.section
                        variants={variants}
                        initial="inactive"
                        animate="active"
                        exit={'inactive'}
                        className={s.component}
                    >
                        <header className={clsx(s.header, 'container')}>
                            <Button
                                variant="tertiary"
                                isIconOnly
                                size="sm"
                                onClick={onClose}
                            >
                                <XMarkIcon />
                            </Button>
                        </header>
                        <section
                            className={clsx(s.content, className, 'container')}
                        >
                            {children}
                        </section>
                    </motion.section>
                </>
            )}
        </AnimatePresence>
    )
}

export default Modal
