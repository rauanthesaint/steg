import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:7777/api',
})

export const encryptData = async (data: { file: File; text: string }) => {
    try {
        // Create FormData object
        const formData = new FormData()
        formData.append('file', data.file)
        formData.append('text', data.text)

        const result = await axiosInstance.post('/encode', formData, {
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
export const decryptData = async (data: { file: File }) => {
    try {
        // Create FormData object
        const formData = new FormData()
        formData.append('file', data.file)

        const result = await axiosInstance.post('/decrypt', formData, {
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
