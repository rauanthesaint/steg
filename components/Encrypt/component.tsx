import { FormEvent, useState } from 'react'
import { Button, FileInput, Textarea } from '@/ui'
import s from './component.module.scss'
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Message from '../Message'

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

        if (!file) {
            setUploadStatus({
                message: 'Please upload a file before submitting.',
                status: 'warning',
            })
            return
        }

        setUploading(true)
        setUploadStatus({ message: '', status: 'error' })

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('http://localhost:7777/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                const data = await response.json()
                setUploadStatus({
                    message: 'File uploaded successfully!',
                    status: 'success',
                })
                console.log('File response:', data)
            } else {
                const error = await response.json()
                setUploadStatus({
                    message: `Failed to upload file: ${error.message}`,
                    status: 'error',
                })
            }
        } catch (error) {
            console.error('Error uploading file:', error)
            setUploadStatus({
                message:
                    'An error occurred while uploading the file. Please try again',
                status: 'error',
            })
        } finally {
            setUploading(false)
        }
    }

    return (
        <section className={s.component}>
            {/* Page Title */}
            <section className={s.content}>
                <form onSubmit={handleFormSubmit} className={s.form}>
                    <FileInput id="file" name="file">
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

                    <Textarea
                        maxRows={15}
                        name="text"
                        id="text"
                        placeholder="e.g: Lorem Ipsum..."
                        label="Text to encrypt"
                        minRows={5}
                    />

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
                            <span>Encrypt</span>
                        </Button>
                    </div>
                    {uploadStatus.message && (
                        <Message status={uploadStatus.status}>
                            {uploadStatus.message}
                        </Message>
                    )}
                </form>
                <section>
                    {file && previewUrl && (
                        <div className={s.preview}>
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
                        </div>
                    )}
                    <section className={s.description}>
                        <h1 className="heading-sm">How to encrypt?</h1>
                        <span>
                            To&nbsp;encode a&nbsp;message into an&nbsp;image:
                        </span>
                        <ol>
                            <li>
                                &nbsp;&nbsp;&nbsp;&nbsp;1. choose the image you
                                want to&nbsp;use;
                            </li>
                            <li>
                                &nbsp;&nbsp;&nbsp;&nbsp;2. enter your text and
                                hit the{' '}
                                <span className="text-accent">Encode</span>{' '}
                                button;
                            </li>
                        </ol>

                        <p>
                            Save the last image, it&nbsp;will contain your
                            hidden message
                        </p>
                        <p className="text-callout">
                            Remember, the more text you want to&nbsp;hide, the
                            larger the image has to&nbsp;be. In&nbsp;case you
                            chose an&nbsp;image that is&nbsp;too small
                            to&nbsp;hold your message you will be&nbsp;informed
                        </p>
                        <p className="text-muted">
                            Neither the image nor the message you hide will be
                            at any moment transmitted over the web, all the
                            magic happens within your browser.
                        </p>
                    </section>
                </section>
            </section>
        </section>
    )
}
