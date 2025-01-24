import { Variants } from 'framer-motion'

const inactive = { opacity: 0, bottom: -100 }
const active = { opacity: 1, bottom: 0 }

export const fadeUpVariants: Variants = {
    initial: inactive,
    animate: active,
}
