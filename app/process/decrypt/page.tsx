'use client'

import clsx from 'clsx'
import s from './page.module.scss'
import { FileInput, Button, Textarea, Modal } from '@/ui'
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { FormEvent, useState } from 'react'
import Image from 'next/image'
import { Message } from '@/components'
import axios from 'axios'

export default function Page() {
    const [file, setFile] = useState<File>()
    const [previewUrl, setPreviewUrl] = useState('')
    const [uploading, setUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<{
        status: 'warning' | 'success' | 'error'
        message: string
    }>({ status: 'error', message: '' })
    const [responseData, setResponseData] = useState<string>('')

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

            const response = await axios.post(
                'http://localhost:7777/api/decrypt',
                formData
            )

            const json = response.data
            setResponseData(json.extractedMessage)
            if (response.status === 200) {
                setModal(true)
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

    const [modal, setModal] = useState<boolean>(false)
    const handleModal = () => {
        setModal(!modal)
        window.location.reload()
    }
    return (
        <main className="container">
            <h1 className={clsx('heading-md', s.title)}>Decrypt your text</h1>

            <Modal className={s.result} open={modal} onClose={handleModal}>
                <h1 className="heading-md">Extracted text</h1>

                <Textarea
                    maxRows={15}
                    name="text"
                    id="text"
                    placeholder="e.g: Lorem Ipsum..."
                    label="Text to encrypt"
                    minRows={5}
                    value={responseData}
                    readOnly
                />
            </Modal>
            <section className={s.content}>
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

                    <div className={s.block}>
                        <p className="text-sm text-muted">
                            By&nbsp;clicking &laquo;Decrypt&raquo; you consent
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
                        <h1 className="heading-sm">How to decrypt?</h1>
                        <span>
                            To&nbsp;decode a&nbsp;hidden message from
                            an&nbsp;image, just choose an&nbsp;image and hit the{' '}
                            <span className="text-accent">Decode</span> button
                        </span>
                    </section>
                </section>
            </section>
        </main>
    )
}
