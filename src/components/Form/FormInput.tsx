import React from 'react';
import styles from './Form.module.css';

const FormInput: React.FC<{ id: string }> = ({ id }) => {
    return (
        <input type="text" id={id} className={styles.input}></input>
    );
}

export default FormInput;