import { UploadedFile, useUploadedFile } from '@/app/providers/StoreProvider'
import { formatFileSize } from '@/shared/utils/formatters.util'
import Image from 'next/image'
import styles from './filePreview.styles.module.scss'
import {
    CameraSolid,
    FileNotFound,
    MusicNoteSolid,
    Page,
    TextSquareSolid,
} from 'iconoir-react'

const getIcon = (type: string) => {
    switch (type) {
        case 'audio':
            return <MusicNoteSolid />
        case 'video':
            return <CameraSolid />
        case 'text':
            return <TextSquareSolid />
        case 'document':
            return <Page />
        default:
            return <FileNotFound />
    }
}

export default function FilePreview({
    uploadedFile,
}: {
    uploadedFile: UploadedFile | null
}) {
    const { isImage } = useUploadedFile()

    if (!uploadedFile?.dataUrl) {
        return (
            <section className={styles.preview__no_content}>
                <p>No image uploaded</p>
            </section>
        )
    }

    const { name, type, size } = uploadedFile.file
    const height = uploadedFile.dimensions?.height
    const width = uploadedFile.dimensions?.width

    return (
        <section className={styles.preview}>
            <div className={styles.imageContainer}>
                {isImage() ? (
                    <Image
                        src={uploadedFile.dataUrl}
                        alt="Preview"
                        width={100}
                        height={100}
                        className={styles.preview__image}
                    />
                ) : (
                    <div className={styles.badge}>
                        {getIcon(uploadedFile.fileType)}
                    </div>
                )}
            </div>
            <footer className={styles.description}>
                <span>{name}</span>
                <div className={styles.details}>
                    <span>{formatFileSize(size)}</span>
                    <span>{type}</span>
                    {uploadedFile.dimensions && (
                        <span>
                            {width}x{height}px
                        </span>
                    )}
                </div>
            </footer>
        </section>
    )
}
