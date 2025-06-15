import { ElementType, FC } from 'react'
import { ButtonProps } from '../button.types'
import styles from './button.styles.module.scss'
import clsx from 'clsx'
import { IconoirProvider, SystemRestart } from 'iconoir-react'

const generateClasses = (props: ButtonProps) => {
    const { className, isLoading, isFullWidth, variant = 'primary' } = props
    const loading = isLoading && styles.loading
    const fullWidth = isFullWidth && styles.fullWidth
    return clsx(styles.button, loading, fullWidth, styles[variant], className)
}

const Button: FC<ButtonProps> = (props) => {
    const { type = 'button', title = 'Button', isLoading, asDiv } = props

    const Component: ElementType = asDiv ? 'div' : 'button'

    return (
        <Component
            type={type}
            title={title}
            className={generateClasses(props)}
            id={props.id}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            <IconoirProvider iconProps={{ width: 20, height: 20 }}>
                {isLoading ? (
                    <SystemRestart className={styles.loader} />
                ) : (
                    props.children
                )}
            </IconoirProvider>
        </Component>
    )
}

export default Button
