'use client'

import clsx from 'clsx'
import s from './Button.module.scss'
import { FC } from 'react'
import { motion } from 'framer-motion'
import { ButtonProps } from './Button.types'

const Button: FC<ButtonProps> = ({
    type = 'button',
    title,
    children,
    isLoading,
    disabled,
    isFullWidth,
    as: Component = 'button',
    onClick,
    variant = 'primary',
    download,
    href,
    size = 'md',
    isIconOnly,
}) => {
    return (
        <Component
            type={type}
            title={title}
            disabled={disabled}
            onClick={onClick}
            className={clsx(
                s.button,
                isFullWidth && s.fullWidth,
                s[variant],
                s[size],
                isIconOnly && s.iconOnly
            )}
            href={href}
            download={download}
        >
            {children}
            {isLoading && (
                <div className={s.loading}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            repeat: Infinity,
                            type: 'keyframes',
                            duration: 1,
                        }}
                        className={s.icon}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            id="Loading--Streamline-Ultimate"
                            height="24"
                            width="24"
                        >
                            <desc>
                                Loading Streamline Icon:
                                https://streamlinehq.com
                            </desc>
                            <path
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 0.746948V4.49695"
                                strokeWidth="1.5"
                            ></path>
                            <path
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 23.2469v-3.75"
                                strokeWidth="1.5"
                            ></path>
                            <path
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.04501 4.04199 2.652 2.652"
                                strokeWidth="1.5"
                            ></path>
                            <path
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m19.955 19.952 -2.652 -2.651"
                                strokeWidth="1.5"
                            ></path>
                            <path
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M0.75 11.9969H4.5"
                                strokeWidth="1.5"
                            ></path>
                            <path
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M23.25 11.9969H19.5"
                                strokeWidth="1.5"
                            ></path>
                            <path
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m4.04501 19.952 2.652 -2.651"
                                strokeWidth="1.5"
                            ></path>
                            <path
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m19.955 4.04199 -2.652 2.652"
                                strokeWidth="1.5"
                            ></path>
                        </svg>
                    </motion.div>
                    <span>Loading...</span>
                </div>
            )}
        </Component>
    )
}

export default Button
