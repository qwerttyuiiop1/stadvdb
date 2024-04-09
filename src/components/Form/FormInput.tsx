import React from 'react';
import styles from './Form.module.css';

const FormInput: React.FC<{ id: string, value: string }> = ({ id, value }) => {
    return (
        <input type="text" id={id} className={styles.input} value={value}></input>
    );
}

export default FormInput;