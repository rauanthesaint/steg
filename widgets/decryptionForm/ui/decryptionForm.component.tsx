'use client'
import { FileInput, Input } from '@/ui'
import styles from './decryptionForm.styles.module.scss'
import { CheckCircle, Copy, Upload } from 'iconoir-react/regular'
import { useForm } from 'react-hook-form'
import { useCallback, useState } from 'react'
import {
    createUploadedFile,
    useUploadedFile,
    useUploadStatus,
} from '@/app/providers/StoreProvider'
import { decryptData } from '@/shared/utils/api/requests'
import { Key, SparkSolid } from 'iconoir-react'
import { Button } from '@/shared/components'

type Values = {
    file: File
    password: string
    algorithm: string
}

export default function DecryptionForm() {
    const { setUploadedFile, clearFile, uploadedFile } = useUploadedFile()
    const { setIsUploading } = useUploadStatus()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState<string>()
    const [isCopied, setIsCopied] = useState(false)
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<Values>({ mode: 'onSubmit' })

    const onSubmit = async (data: Values) => {
        if (!uploadedFile) {
            setError('file', {
                type: 'required',
                message: 'File is required',
            })
            return
        }

        const submitData = {
            ...data,
            file: uploadedFile.file,
        }

        setIsSubmitting(true)
        try {
            const result = await decryptData(submitData)
            if (result) {
                setMessage(result.data.message)
                clearFile()

                clearErrors('root')
            }
        } catch (error) {
            console.error('Decryption failed:', error)
            setError('root', {
                type: 'server',
                message:
                    'Failed to decrypt data. Please ensure this is a valid encrypted PNG file.',
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
                    const uploadedFile = await createUploadedFile(file, {
                        generateDataUrl: true, // You're using dataUrl in your form
                        generateObjectUrl: true, // Better performance for display
                        getDimensions: true, // You need dimensions for images
                    })
                    setUploadedFile(uploadedFile)
                } catch (error) {
                    console.error('Error processing image:', error)
                    setError('file', {
                        type: 'manual',
                        message: 'Failed to process image',
                    })
                } finally {
                    setIsUploading(false)
                }
            } else {
                clearFile()
            }
        },
        [setUploadedFile, clearFile, setIsUploading, clearErrors, setError]
    )
    const handleCopy = useCallback(async () => {
        if (!message) return

        try {
            // Modern Clipboard API (preferred)
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(message)
            }

            // Show success feedback
            setIsCopied(true)

            // Reset the copied state after 2 seconds
            setTimeout(() => {
                setIsCopied(false)
            }, 2000)
        } catch (error) {
            console.error('Failed to copy message:', error)
            // You could show an error message here if needed
            // setError('root', { type: 'manual', message: 'Failed to copy message' })
        }
    }, [message])
    return (
        <div className={styles.container}>
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
                    <Button asDiv variant="secondary">
                        <span>Upload your File</span>
                        <Upload />
                    </Button>
                </FileInput>

                <Input
                    label="Password"
                    placeholder="Optional"
                    type="password"
                    leading={<Key />}
                    register={register('password')}
                />

                <Input
                    label="Algorithm"
                    placeholder="lsb"
                    register={register('algorithm', {
                        required: 'Algorithm is required',
                    })}
                    error={errors.algorithm}
                />

                {errors.root && (
                    <div className={styles.errorMessage}>
                        {errors.root.message}
                    </div>
                )}

                <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    isFullWidth
                >
                    <span>Encrypt</span>
                    <SparkSolid />
                </Button>
                {message && (
                    <div className={styles.messageContainer}>
                        <h3>Decoded Message</h3>
                        <div>{message}</div>
                        <Button onClick={handleCopy} variant="secondary">
                            <span>{isCopied ? 'Copied!' : 'Copy message'}</span>
                            {isCopied ? <CheckCircle /> : <Copy />}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    )
}
