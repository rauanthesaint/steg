'use client'
import { Button, FileInput, Textarea } from '@/ui'
import styles from './encryptionForm.styles.module.scss'
import { Upload } from 'iconoir-react/regular'
import { Spark } from 'iconoir-react/solid'
import { useForm } from 'react-hook-form'
import { useCallback, useState } from 'react'
import {
    useUploadedImage,
    useUploadStatus,
} from '@/app/providers/StoreProvider'
import { getImageDimensions } from '@/entity/imageFile/lib/utils'
import { encryptData } from '@/shared/utils/api/requests'

type Values = {
    text: string
    file: File
}

const downloadFile = (base64Data: string, filename: string) => {
    try {
        // Convert base64 to blob
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'image/png' })

        // Create download link
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename

        // Trigger download
        document.body.appendChild(link)
        link.click()

        // Cleanup
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Error downloading file:', error)
    }
}

export default function EncryptionForm() {
    const { setUploadedImage, clearImage, uploadedImage } = useUploadedImage()
    const { setIsUploading } = useUploadStatus()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<Values>({ mode: 'onSubmit' })

    const onSubmit = async (data: Values) => {
        if (!uploadedImage) {
            setError('file', {
                type: 'required',
                message: 'File is required',
            })
            return
        }

        const submitData = {
            ...data,
            file: uploadedImage.file,
        }

        setIsSubmitting(true)
        try {
            const result = await encryptData(submitData)
            if (result) {
                console.log('Success:', result.message)
                downloadFile(result.outputFile, result.filename) // Handle success (e.g., show success message, download file, etc.)
            }
        } catch (error) {
            console.error('Encryption failed:', error)
            // Handle error (e.g., show error message to user)
            setError('root', {
                type: 'server',
                message: 'Failed to encrypt data. Please try again.',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileChange = useCallback(
        async (file: File | null) => {
            if (file) {
                setIsUploading(true)
                clearErrors('file') // Clear file validation error
                try {
                    const dimensions = await getImageDimensions(file)
                    const reader = new FileReader()
                    const dataUrl = await new Promise<string>(
                        (resolve, reject) => {
                            reader.onload = (e) => {
                                const result = e.target?.result as string
                                resolve(result)
                            }
                            reader.onerror = (error) => {
                                reject(error)
                            }
                            reader.readAsDataURL(file)
                        }
                    )
                    const imageData = {
                        file,
                        dataUrl,
                        dimensions,
                    }
                    setUploadedImage(imageData)
                } catch (error) {
                    console.error('Error processing image:', error)
                } finally {
                    setIsUploading(false)
                }
            } else {
                clearImage()
            }
        },
        [setUploadedImage, clearImage, setIsUploading, clearErrors]
    )

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <FileInput
                register={register('file', {
                    required: 'File is required',
                })}
                error={errors.file}
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0])
                    } else {
                        handleFileChange(null)
                    }
                }}
            >
                <div className={styles.uploadButton}>
                    <span>Upload Image</span>
                    <Upload />
                </div>
            </FileInput>

            <Textarea
                register={register('text', {
                    required: 'Text to encrypt is required',
                })}
                error={errors.text}
                minRows={10}
                label="Text to encrypt"
                placeholder="Lorem Ipsum..."
            />

            {errors.root && (
                <div className={styles.errorMessage}>{errors.root.message}</div>
            )}

            <Button type="submit" isFullWidth disabled={isSubmitting}>
                <span>{isSubmitting ? 'Encrypting...' : 'Encrypt'}</span>
                <Spark />
            </Button>
        </form>
    )
}
