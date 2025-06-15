// app/providers/StoreProvider.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

// Generic File type for any file
export interface UploadedFile {
    file: File
    dataUrl?: string // Optional for non-displayable files
    objectUrl?: string // For better performance
    dimensions?: {
        width: number
        height: number
    } // Only for images
    metadata: {
        name: string
        size: number
        type: string
        lastModified: number
    }
    fileType: 'image' | 'audio' | 'video' | 'text' | 'document' | 'other'
}

// Store Context Interface
interface StoreContextType {
    // State
    uploadedFile: UploadedFile | null
    isUploading: boolean

    // Actions
    setUploadedFile: (file: UploadedFile | null) => void
    setIsUploading: (loading: boolean) => void
    clearFile: () => void

    // Utility methods
    isImage: () => boolean
    isAudio: () => boolean
    isVideo: () => boolean
    isText: () => boolean
    getFileSize: () => string
    getFileExtension: () => string
}

// File type detection utility
const detectFileType = (mimeType: string): UploadedFile['fileType'] => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('text/')) return 'text'
    if (
        mimeType.includes('pdf') ||
        mimeType.includes('document') ||
        mimeType.includes('spreadsheet') ||
        mimeType.includes('presentation') ||
        mimeType.includes('msword') ||
        mimeType.includes('officedocument')
    )
        return 'document'
    return 'other'
}

// File size formatter
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get file extension
const _getFileExtension = (filename: string): string => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

// Create Context
const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Provider Component
interface StoreProviderProps {
    children: ReactNode
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const clearFile = () => {
        if (uploadedFile?.objectUrl) {
            URL.revokeObjectURL(uploadedFile.objectUrl)
        }
        setUploadedFile(null)
    }

    // Utility methods
    const isImage = () => uploadedFile?.fileType === 'image'
    const isAudio = () => uploadedFile?.fileType === 'audio'
    const isVideo = () => uploadedFile?.fileType === 'video'
    const isText = () => uploadedFile?.fileType === 'text'

    const getFileSize = () => {
        return uploadedFile
            ? formatFileSize(uploadedFile.metadata.size)
            : '0 Bytes'
    }

    const getFileExtension = () => {
        return uploadedFile ? _getFileExtension(uploadedFile.metadata.name) : ''
    }

    const value: StoreContextType = {
        uploadedFile,
        isUploading,
        setUploadedFile,
        setIsUploading,
        clearFile,
        isImage,
        isAudio,
        isVideo,
        isText,
        getFileSize,
        getFileExtension,
    }

    return (
        <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    )
}

// Custom Hook to use the store
export const useStore = (): StoreContextType => {
    const context = useContext(StoreContext)
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider')
    }
    return context
}

// Specific hooks for easier usage
export const useUploadedFile = () => {
    const {
        uploadedFile,
        setUploadedFile,
        clearFile,
        isImage,
        isAudio,
        isVideo,
        isText,
        getFileSize,
        getFileExtension,
    } = useStore()

    return {
        uploadedFile,
        setUploadedFile,
        clearFile,
        isImage,
        isAudio,
        isVideo,
        isText,
        getFileSize,
        getFileExtension,
    }
}

export const useUploadStatus = () => {
    const { isUploading, setIsUploading } = useStore()
    return { isUploading, setIsUploading }
}

// Legacy hooks for backward compatibility (if needed)
// export const useUploadedImage = () => {
//     const { uploadedFile, setUploadedFile, clearFile, isImage } = useStore()

//     // Return only if it's an image, otherwise null
//     const uploadedImage = isImage()
//         ? {
//               file: uploadedFile!.file,
//               dataUrl: uploadedFile!.dataUrl || '',
//               dimensions: uploadedFile!.dimensions || { width: 0, height: 0 },
//           }
//         : null

//     return {
//         uploadedImage,
//         setUploadedImage: setUploadedFile,
//         clearImage: clearFile,
//     }
// }

// Helper function to create UploadedFile from File
export const createUploadedFile = async (
    file: File,
    options: {
        generateDataUrl?: boolean
        generateObjectUrl?: boolean
        getDimensions?: boolean
    } = {}
): Promise<UploadedFile> => {
    const {
        generateDataUrl = false,
        generateObjectUrl = true,
        getDimensions = true,
    } = options

    const fileType = detectFileType(file.type)

    let dataUrl: string | undefined
    let objectUrl: string | undefined
    let dimensions: { width: number; height: number } | undefined

    // Generate object URL (lightweight)
    if (generateObjectUrl) {
        objectUrl = URL.createObjectURL(file)
    }

    // Generate data URL (heavier, only when needed)
    if (generateDataUrl) {
        dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target?.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    // Get image dimensions (only for images)
    if (fileType === 'image' && getDimensions && objectUrl) {
        dimensions = await new Promise<{ width: number; height: number }>(
            (resolve, reject) => {
                const img = new Image()
                img.onload = () =>
                    resolve({ width: img.width, height: img.height })
                img.onerror = reject
                img.src = objectUrl!
            }
        )
    }

    return {
        file,
        dataUrl,
        objectUrl,
        dimensions,
        metadata: {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
        },
        fileType,
    }
}

// Export utilities
export { detectFileType, formatFileSize, _getFileExtension }
