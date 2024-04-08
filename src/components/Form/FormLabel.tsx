import React from 'react';
import styles from './Form.module.css';

const FormLabel: React.FC<{ label: string }> = ({ label }) => {
    return (
        <label className={styles.label}>{label}</label>
    );
}

export default FormLabel;