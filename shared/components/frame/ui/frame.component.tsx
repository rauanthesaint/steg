import { ReactNode } from 'react'
import styles from './frame.styles.module.scss'
import clsx from 'clsx'

const Frame = ({
    children,
    className,
}: {
    children: ReactNode
    className?: string
}) => {
    return (
        <section className={clsx(styles.frame, className)}>{children}</section>
    )
}

export default Frame
