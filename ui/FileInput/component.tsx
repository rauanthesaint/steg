import { FC, InputHTMLAttributes } from 'react'
import s from './component.module.scss'

const FileInput: FC<InputHTMLAttributes<HTMLInputElement>> = ({
    name,
    onChange,
    children,
}) => {
    return (
        <label className={s.container} htmlFor={name}>
            {children}
            <input onChange={onChange} id={name} type="file" name={name} />
        </label>
    )
}

export default FileInput
