import { UploadedImage } from '@/app/providers/StoreProvider'
import { formatFileSize } from '@/shared/utils/formatters.util'
import Image from 'next/image'
import styles from './filePreview.styles.module.scss'
import clsx from 'clsx'

export default function FilePreview({
    uploadedImage,
}: {
    uploadedImage: UploadedImage | null
}) {
    return (
        <section
            className={clsx(styles.preview, !uploadedImage && styles.inactive)}
        >
            {uploadedImage ? (
                <div className={styles.preview__card}>
                    <Image
                        src={uploadedImage.dataUrl}
                        alt="Preview"
                        width={96}
                        height={96}
                        className={styles.preview__image}
                    />
                    <ul className={styles.fileInfo}>
                        <li>File name: {uploadedImage.file.name}</li>
                        <li>Size: {formatFileSize(uploadedImage.file.size)}</li>
                        <li>Type: {uploadedImage.file.type}</li>
                        <li>
                            Dimensions: {uploadedImage.dimensions.height}x
                            {uploadedImage.dimensions.width}px
                        </li>
                    </ul>
                </div>
            ) : (
                <p>No image uploaded</p>
            )}
        </section>
    )
}
