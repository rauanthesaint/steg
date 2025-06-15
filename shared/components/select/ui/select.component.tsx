'use client'

import { FC, useState } from 'react'
import { SelectProps } from '../select.types'
import { SelectOptionType } from '@/shared/types/components.types'
import { AnimatePresence, motion, Variants } from 'framer-motion'
// Styles
import styles from './select.styles.module.scss'

const isDefault = (option: SelectOptionType) => {
    return option.default === true
}

const listAnimationVariants: Variants = {
    active: { y: 0, opacity: 1, scale: 1 },
    inactive: { y: 10, opacity: 0, scale: 0.99 },
}

const Select: FC<SelectProps> = (props) => {
    const Label = props.label && <span>{props.label}</span>

    const defaultOption = props.data.find(isDefault)

    const [current, setCurrent] = useState<SelectOptionType>(
        defaultOption || ({} as SelectOptionType)
    )
    const [isActive, setIsActive] = useState<boolean>(false)

    return (
        <div className={styles.container}>
            {Label}
            <div
                tabIndex={0}
                className={styles.contentContainer}
                onClick={() => setIsActive((prev) => !prev)}
            >
                {props.leading}
                <span>{current.title}</span>
            </div>

            <AnimatePresence>
                {isActive && (
                    <>
                        <motion.div
                            variants={listAnimationVariants}
                            initial="inactive"
                            animate="active"
                            exit="inactive"
                            className={styles.list}
                        >
                            {props.data.map((item, index) => {
                                return (
                                    <div
                                        className={styles.listItem}
                                        role="button"
                                        key={`option-${index}`}
                                        onClick={() => setCurrent(item)}
                                    >
                                        {item.title}
                                    </div>
                                )
                            })}
                        </motion.div>
                        <motion.div
                            className={styles.curtain}
                            onClick={() => setIsActive((prev) => !prev)}
                        />
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Select
