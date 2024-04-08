import React from 'react';
import styles from '@/components/Form/Form.module.css';
import FormBody from './FormBody';

const Form: React.FC = () => {
    return(
      <form className={styles.form_container}>
        <h2>Add Row</h2>
        <br/><hr/><br/>
        <FormBody />
        <button type="submit" className={styles.button}>Add</button>
      </form>
    );
}

export default Form;