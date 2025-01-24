'use client'

import s from './Input.module.scss'
import { FC, useState } from 'react'
import { InputProps } from './Input.types'
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, Variants, motion } from 'framer-motion'

const variants: Variants = {
    badgeActive: { y: 0, opacity: 1, x: '-50%' },
    badgeInActive: { y: 20, opacity: 0, x: '-50%' },
}

const Input: FC<InputProps> = ({
    placeholder,
    name,
    label,
    type,
    leading,
    value,
    onChange,
    readOnly,
}) => {
    const [isCopied, setIsCopied] = useState<boolean>(false)
    const handleCopyButton = () => {
        if (value) {
            navigator.clipboard.writeText(value.toString())
            setIsCopied(true)

            const timer = setTimeout(() => {
                setIsCopied(false)
            }, 3000)

            return () => {
                clearTimeout(timer)
            }
        }
    }

    return (
        <label htmlFor={name} className={s.container}>
            {label && <span className={`${s.label} text-sm`}>{label}</span>}
            <div className={s.input}>
                {leading}
                <input
                    value={value}
                    onChange={onChange}
                    type={type}
                    placeholder={placeholder}
                    name={name}
                    readOnly={readOnly}
                />

                {readOnly && (
                    <button
                        title="Copy"
                        onClick={handleCopyButton}
                        className={s.button}
                        type="button"
                        disabled={isCopied}
                    >
                        {isCopied ? (
                            <CheckIcon className={s.icon} />
                        ) : (
                            <ClipboardDocumentIcon />
                        )}
                    </button>
                )}
            </div>

            {readOnly && (
                <AnimatePresence>
                    {isCopied && (
                        <motion.div
                            variants={variants}
                            initial="badgeInActive"
                            animate="badgeActive"
                            exit="badgeInActive"
                            className={s.badge}
                        >
                            <span className="text-sm">Copied</span>
                            <CheckIcon />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </label>
    )
}

export default Input
