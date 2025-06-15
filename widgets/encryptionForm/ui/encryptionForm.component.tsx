'use client'
import { FileInput, Input, Textarea } from '@/ui'
import styles from './encryptionForm.styles.module.scss'
import { Key, Upload } from 'iconoir-react/regular'
import { Spark } from 'iconoir-react/solid'
import { useForm } from 'react-hook-form'
import { useCallback, useState } from 'react'
import {
    useUploadedFile,
    // useUploadedImage,
    useUploadStatus,
} from '@/app/providers/StoreProvider'
// import { getImageDimensions } from '@/entity/imageFile/lib/utils'
import { encryptData } from '@/shared/utils/api/requests'
import { downloadFile } from '@/shared/utils/api/downloadFile'
import { useNotifications } from '@/app/providers/NotificationProvider'
import { createUploadedFile } from '@/app/providers/StoreProvider'

import { Button } from '@/shared/components'

type Values = {
    text: string
    file: File
    password: string
}

export default function EncryptionForm() {
    const { setUploadedFile, clearFile, uploadedFile } = useUploadedFile()
    const { setIsUploading } = useUploadStatus()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { addNotification } = useNotifications()

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

        console.log(submitData)

        setIsSubmitting(true)
        try {
            const result = await encryptData(submitData)
            if (result) {
                addNotification({
                    type: 'success',
                    title: 'Success!',
                    message: 'Message Encrypted successfully',
                })
                const { file } = result.data
                downloadFile(file.content, file.filename, file.mimetype) // Handle success (e.g., show success message, download file, etc.)
                clearFile()
            }
        } catch (error) {
            console.error('Encryption failed:', error)
            addNotification({
                type: 'error',
                title: 'Error!',
                message: 'Failed to encrypt data. Please try again',
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
                <Button asDiv variant="secondary">
                    <span>Upload your File</span>
                    <Upload />
                </Button>
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

            <Input
                type="password"
                label="Password"
                placeholder="Optional"
                leading={<Key />}
                register={register('password')}
            />

            {errors.root && (
                <div className={styles.errorMessage}>{errors.root.message}</div>
            )}

            <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                isFullWidth
            >
                <span>Encrypt</span>
                <Spark />
            </Button>
        </form>
    )
}
