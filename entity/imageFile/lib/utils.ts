export const getImageDimensions = (
    file: File
): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
        const img: HTMLImageElement = new window.Image()

        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight,
            })
        }

        img.src = URL.createObjectURL(file)
    })
}
