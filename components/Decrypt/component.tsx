import { Button, FileInput, Textarea } from '@/ui'
import s from './component.module.scss'
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { FormEvent, useState } from 'react'
import Message from '../Message'
import Image from 'next/image'

export default function Component() {
    const [file, setFile] = useState<File>()
    const [previewUrl, setPreviewUrl] = useState('')
    const [uploading, setUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<{
        status: 'warning' | 'success' | 'error'
        message: string
    }>({ status: 'error', message: '' })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0]

        if (uploadedFile) {
            setFile(uploadedFile)

            // Create a file preview
            const reader = new FileReader()
            reader.onload = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(uploadedFile)
        }
    }

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault()
    }
    return (
        <section className={s.component}>
            {/* Page Title */}
            <header>
                <h1 className="heading-md">Decrypt your text</h1>
            </header>

            <section className={s.content}>
                {/* Form */}
                <form onSubmit={handleFormSubmit} className={s.form}>
                    <FileInput
                        id="file"
                        name="file"
                        onChange={handleFileChange}
                    >
                        <Button
                            variant="secondary"
                            as={'div'}
                            disabled
                            isFullWidth
                        >
                            <ArrowUpOnSquareIcon />
                            <span>Upload file</span>
                        </Button>
                    </FileInput>

                    {/* <Input
                        name="key"
                        id="key"
                        label={
                            <span>
                                Secret Key{' '}
                                <span className="text-muted">(optional)</span>
                            </span>
                        }
                        placeholder="e.g: slow_motion"
                        leading={<KeyIcon />}
                    /> */}

                    <div className={s.block}>
                        <p className="text-sm text-muted">
                            By&nbsp;clicking &laquo;Encrypt&raquo; you consent
                            to&nbsp;the processing of&nbsp;the image.
                        </p>
                        <Button isLoading={uploading} type="submit">
                            <span>Decrypt</span>
                        </Button>
                    </div>
                    {uploadStatus.message && (
                        <Message status={uploadStatus.status}>
                            {uploadStatus.message}
                        </Message>
                    )}
                </form>

                {/* Description */}
                <section>
                    <Textarea
                        maxRows={15}
                        name="text"
                        id="text"
                        placeholder="e.g: Lorem Ipsum..."
                        label="Text to encrypt"
                        readOnly
                        minRows={5}
                    />
                    {file && previewUrl && (
                        <header className={s.preview}>
                            {file.type.startsWith('image/') && (
                                <Image
                                    src={previewUrl}
                                    alt="File Preview"
                                    width={100}
                                    height={100}
                                    className={s.image}
                                />
                            )}

                            <div className={s.details}>
                                <p className="text-sm text-muted">
                                    File Preview
                                </p>
                                <p className="text-sm">
                                    File Name:{' '}
                                    <span className="text-accent">
                                        {file.name}
                                    </span>
                                </p>
                                <p className="text-sm">
                                    File Size: {Math.round(file.size / 1024)} KB
                                </p>
                            </div>
                        </header>
                    )}

                    <section className={s.description}>
                        <h1 className="heading-sm">How to decrypt?</h1>
                        <p>
                            To&nbsp;decode a&nbsp;hidden message from
                            an&nbsp;image, just choose an&nbsp;image and hit the{' '}
                            <span className="text-accent">Decode</span> button
                        </p>
                        <p className="text-muted">
                            Neither the image nor the message that has been
                            hidden will be&nbsp;at&nbsp;any moment transmitted
                            over the web, all the magic happens within your
                            browser.
                        </p>
                    </section>
                </section>
            </section>
        </section>
    )
}
