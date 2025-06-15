'use client'
import { Frame } from '@/shared/components'
import { DecryptionForm, FilePreview } from '@/widgets'
import styles from './page.module.scss'
import { useUploadedFile } from '@/app/providers/StoreProvider'

export default function Page() {
    const { uploadedFile } = useUploadedFile()
    return (
        <main>
            <h1>Decrypt your message</h1>
            <Frame className={styles.content}>
                <DecryptionForm />
                <FilePreview uploadedFile={uploadedFile} />
            </Frame>
        </main>
    )
}
