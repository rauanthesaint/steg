import s from './Input.module.scss'
import { FC } from 'react'
import { InputProps } from './Input.types'
import TextareaAutosize, {
    TextareaAutosizeProps,
} from 'react-textarea-autosize'

const Input: FC<InputProps & TextareaAutosizeProps> = ({
    placeholder,
    name,
    label,
    maxRows,
    minRows,
    readOnly,
    onChange,
    value,
    register,
    error,
}) => {
    return (
        <label htmlFor={name} className={s.container}>
            {label && <span className={`${s.label} text-sm`}>{label}</span>}
            <TextareaAutosize
                maxRows={maxRows}
                id={name}
                placeholder={placeholder}
                minRows={minRows}
                readOnly={readOnly}
                value={value}
                onChange={onChange}
                {...register}
            />
            {error && <span className={s.error}>{error.message}</span>}
        </label>
    )
}

export default Input
