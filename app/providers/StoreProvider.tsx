// app/providers/StoreProvider.tsx
'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

// Simple Image type for MVP
export interface UploadedImage {
    file: File
    dataUrl: string
    dimensions: {
        width: number
        height: number
    }
}

// Store Context Interface
interface StoreContextType {
    // State
    uploadedImage: UploadedImage | null
    isUploading: boolean

    // Actions
    setUploadedImage: (image: UploadedImage | null) => void
    setIsUploading: (loading: boolean) => void
    clearImage: () => void
}

// Create Context
const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Provider Component
interface StoreProviderProps {
    children: ReactNode
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
    const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
        null
    )
    const [isUploading, setIsUploading] = useState(false)

    const clearImage = () => {
        if (uploadedImage?.dataUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(uploadedImage.dataUrl)
        }
        setUploadedImage(null)
    }

    const value: StoreContextType = {
        uploadedImage,
        isUploading,
        setUploadedImage,
        setIsUploading,
        clearImage,
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
export const useUploadedImage = () => {
    const { uploadedImage, setUploadedImage, clearImage } = useStore()
    return { uploadedImage, setUploadedImage, clearImage }
}

export const useUploadStatus = () => {
    const { isUploading, setIsUploading } = useStore()
    return { isUploading, setIsUploading }
}
