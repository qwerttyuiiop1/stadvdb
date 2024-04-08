import React from 'react';
import styles from '@/components/Form/Form.module.css';
import FormBody from './FormBody';

const Form: React.FC = () => {
    return(
      <form className={styles.form_container}>
        <h2>Add</h2>
        <FormBody />
        <button type="submit"></button>
      </form>
    );
}

export default Form;