'use client'

import { Frame } from '@/shared/components'
import { EncryptionForm, FilePreview } from '@/widgets'
import styles from './page.module.scss'
import { useUploadedImage } from '@/app/providers/StoreProvider'

export default function Page() {
    const { uploadedImage } = useUploadedImage()

    return (
        <main>
            <h1>Encrypt your message</h1>
            <Frame className={styles.content}>
                <EncryptionForm />
                <FilePreview uploadedImage={uploadedImage} />
            </Frame>
            <Frame className={styles.description}>
                <h2>How to Use?</h2>
                <ul>
                    <li>Step 1: Upload the Image</li>
                    <li>Step 2: Enter the Text to encrypt</li>
                    <li>Step 3: Click the Encrypt button</li>
                </ul>
            </Frame>
        </main>
    )
}
