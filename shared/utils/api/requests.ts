import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:7777/api/v1/steganography/',
    timeout: 10000,
})

export const encryptData = async (data: {
    file: File
    text: string
    password?: string
}) => {
    try {
        // Create FormData object
        const formData = new FormData()
        formData.append('file', data.file)
        formData.append('message', data.text)
        if (data.password) {
            formData.append('password', data.password)
        }

        const result = await axiosInstance.post('/embed', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        if (result.status === 200) {
            return result.data
        }
        return null
    } catch (error) {
        console.error(error)
        throw error // Re-throw to handle in the component
    }
}
export const decryptData = async (data: {
    file: File
    password?: string
    algorithm: string
}) => {
    try {
        // Create FormData object
        const formData = new FormData()
        formData.append('file', data.file)
        formData.append('algorithm', data.algorithm)
        if (data.password) {
            formData.append('password', data.password)
        }
        const result = await axiosInstance.post('/extract', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        if (result.status === 200) {
            return result.data
        }
        return null
    } catch (error) {
        console.error(error)
        throw error // Re-throw to handle in the component
    }
}
