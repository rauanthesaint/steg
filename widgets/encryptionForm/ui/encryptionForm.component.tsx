'use client'
import { FileInput, Textarea } from '@/ui'
import styles from './encryptionForm.styles.module.scss'
import { Puzzle, Upload } from 'iconoir-react/regular'
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
import Select from '@/shared/components/select/ui/select.component'
import { createUploadedFile } from '@/app/providers/StoreProvider'

import { Button } from '@/shared/components'

type Values = {
    text: string
    file: File
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

        setIsSubmitting(true)
        try {
            const result = await encryptData(submitData)
            if (result) {
                // addNotification({
                //     type: 'success',
                //     title: 'Success!',
                //     message: 'Message Encrypted successfully',
                // })
                // downloadFile(result.outputFile, result.filename, 'image/png') // Handle success (e.g., show success message, download file, etc.)
                // clearFile()
                console.log(result)
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

    // Add this import at the top of your file

    // Then replace your handleFileChange with this cleaner version:
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

            <Select
                leading={<Puzzle />}
                label="Select Encoding Algorithm"
                data={[
                    {
                        title: 'LSB',
                        value: 'lsb',
                    },
                    {
                        title: 'RSA',
                        value: 'rsa',
                    },
                    {
                        title: 'HI',
                        value: 'hi',
                        default: true,
                    },
                ]}
            />

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
