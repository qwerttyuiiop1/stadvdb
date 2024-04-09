import React, { InputHTMLAttributes } from 'react';
import styles from './Form.module.css';

type Input = InputHTMLAttributes<HTMLInputElement>;
const FormInput: React.FC<Input & {id: string}> = (props) => {
    return (
        <input type="text" className={styles.input} name={props.id} {...props}></input>
    );
}

export default FormInput;