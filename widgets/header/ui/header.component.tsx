import { Container } from '@/shared/components'
import styles from './header.styles.module.scss'

export default function Header() {
    return (
        <header className={styles.header}>
            <Container className={styles.container}>
                <span className={styles.logo}>Diploma</span>
            </Container>
        </header>
    )
}
