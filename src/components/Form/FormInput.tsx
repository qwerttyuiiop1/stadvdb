import React from 'react';
import styles from './Form.module.css';

const FormInput: React.FC<{ id: string, defaultValue: string }> = ({ id, defaultValue }) => {
    return (
        <input type="text" id={id} className={styles.input} defaultValue={defaultValue}></input>
    );
}

export default FormInput;