// 'use client'
// import { Button, FileInput } from '@/ui'
// import styles from './decryptionForm.styles.module.scss'
// import { Upload } from 'iconoir-react/regular'
// import { Key } from 'iconoir-react/regular'
// import { useForm } from 'react-hook-form'
// import { useCallback, useState } from 'react'
// import {
//     useUploadedImage,
//     useUploadStatus,
// } from '@/app/providers/StoreProvider'
// import { getImageDimensions } from '@/entity/imageFile/lib/utils'
// import { decryptData } from '@/shared/utils/api/requests'
// import { downloadFile } from '@/shared/utils/api/downloadFile'

// type Values = {
//     file: File
// }

// const validatePNGFile = async (file: File): Promise<boolean> => {
//     return new Promise((resolve) => {
//         const reader = new FileReader()
//         reader.onload = (e) => {
//             const arrayBuffer = e.target?.result as ArrayBuffer
//             const uint8Array = new Uint8Array(arrayBuffer.slice(0, 8))

//             // PNG signature: 89 50 4E 47 0D 0A 1A 0A
//             const pngSignature = [
//                 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
//             ]
//             const isValidPNG = pngSignature.every(
//                 (byte, index) => uint8Array[index] === byte
//             )

//             resolve(isValidPNG)
//         }
//         reader.onerror = () => resolve(false)
//         reader.readAsArrayBuffer(file.slice(0, 8))
//     })
// }

// export default function DecryptionForm() {
//     const { setUploadedImage, clearImage, uploadedImage } = useUploadedImage()
//     const { setIsUploading } = useUploadStatus()
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     // const [decryptedText, setDecryptedText] = useState<string>('')

//     const {
//         register,
//         handleSubmit,
//         setError,
//         clearErrors,
//         formState: { errors },
//     } = useForm<Values>({ mode: 'onSubmit' })

//     // Function to trigger file download

//     const onSubmit = async () => {
//         if (!uploadedImage) {
//             setError('file', {
//                 type: 'required',
//                 message: 'File is required',
//             })
//             return
//         }

//         const submitData = {
//             file: uploadedImage.file,
//         }

//         setIsSubmitting(true)
//         try {
//             const result = await decryptData(submitData)
//             if (result) {
//                 console.log('Success:', result.message)

//                 if (result.outputFile && result.filename) {
//                     downloadFile(
//                         result.outputFile,
//                         result.filename,
//                         'text/plain'
//                     )
//                     console.log(
//                         `File "${result.filename}" downloaded successfully!`
//                     )
//                     clearImage()
//                 }

//                 clearErrors('root')
//             }
//         } catch (error) {
//             console.error('Decryption failed:', error)
//             setError('root', {
//                 type: 'server',
//                 message:
//                     'Failed to decrypt data. Please ensure this is a valid encrypted PNG file.',
//             })
//         } finally {
//             setIsSubmitting(false)
//         }
//     }

//     const handleFileChange = useCallback(
//         async (file: File | null) => {
//             if (file) {
//                 setIsUploading(true)
//                 clearErrors('file')

//                 try {
//                     if (
//                         !file.type.includes('png') &&
//                         !file.name.toLowerCase().endsWith('.png')
//                     ) {
//                         setError('file', {
//                             type: 'validation',
//                             message: 'Only PNG files are supported',
//                         })
//                         setIsUploading(false)
//                         return
//                     }

//                     const isValidPNG = await validatePNGFile(file)
//                     if (!isValidPNG) {
//                         setError('file', {
//                             type: 'validation',
//                             message:
//                                 'Invalid PNG file. Please upload a valid PNG image.',
//                         })
//                         setIsUploading(false)
//                         return
//                     }

//                     console.log('File validation passed:', {
//                         name: file.name,
//                         type: file.type,
//                         size: file.size,
//                     })

//                     const dimensions = await getImageDimensions(file)
//                     const reader = new FileReader()
//                     const dataUrl = await new Promise<string>(
//                         (resolve, reject) => {
//                             reader.onload = (e) => {
//                                 const result = e.target?.result as string
//                                 resolve(result)
//                             }
//                             reader.onerror = (error) => {
//                                 reject(error)
//                             }
//                             reader.readAsDataURL(file)
//                         }
//                     )
//                     const imageData = {
//                         file,
//                         dataUrl,
//                         dimensions,
//                     }
//                     setUploadedImage(imageData)
//                 } catch (error) {
//                     console.error('Error processing image:', error)
//                     setError('file', {
//                         type: 'validation',
//                         message: 'Error processing the image file',
//                     })
//                 } finally {
//                     setIsUploading(false)
//                 }
//             } else {
//                 clearImage()
//             }
//         },
//         [setUploadedImage, clearImage, setIsUploading, clearErrors, setError]
//     )

//     return (
//         <div className={styles.container}>
//             <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
//                 <FileInput
//                     register={register('file', {
//                         required: 'File is required',
//                     })}
//                     error={errors.file}
//                     accept=".png,image/png"
//                     onChange={(e) => {
//                         if (e.target.files && e.target.files[0]) {
//                             handleFileChange(e.target.files[0])
//                         } else {
//                             handleFileChange(null)
//                         }
//                     }}
//                 >
//                     <div className={styles.uploadButton}>
//                         <span>Upload Encrypted PNG</span>
//                         <Upload />
//                     </div>
//                 </FileInput>

//                 {errors.root && (
//                     <div className={styles.errorMessage}>
//                         {errors.root.message}
//                     </div>
//                 )}

//                 <Button type="submit" isFullWidth disabled={isSubmitting}>
//                     <span>{isSubmitting ? 'Decrypting...' : 'Decrypt'}</span>
//                     <Key />
//                 </Button>
//             </form>
//         </div>
//     )
// }
