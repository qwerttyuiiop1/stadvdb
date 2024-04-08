import React from 'react';
import styles from './Form.module.css';

const FormLabel: React.FC<{ label: string }> = ({ label }) => {
    return (
        <label>{label}</label>
    );
}

export default FormLabel;