import { FC, InputHTMLAttributes } from 'react'
import s from './component.module.scss'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface FileInputProps {
    register?: UseFormRegisterReturn
    error?: FieldError
}

const FileInput: FC<InputHTMLAttributes<HTMLInputElement> & FileInputProps> = ({
    name,
    onChange,
    children,
    register,
    error,
}) => {
    return (
        <label className={s.container} htmlFor={name}>
            {children}
            <input
                id={name}
                type="file"
                name={name}
                {...register}
                onChange={(e) => {
                    register?.onChange?.(e)
                    onChange?.(e)
                }}
            />
            {error && <span className={s.error}>{error.message}</span>}
        </label>
    )
}

export default FileInput
