import { CSSProperties } from 'react'

const styles: CSSProperties = {
    width: 'min(95%, 1280px)',
    marginRight: 'auto',
    marginLeft: 'auto',
}

const Container = ({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) => {
    return (
        <div style={styles} className={className}>
            {children}
        </div>
    )
}

export default Container
