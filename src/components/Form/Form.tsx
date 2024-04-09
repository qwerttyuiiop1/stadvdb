import React, { useState, useEffect } from 'react';
import styles from '@/components/Form/Form.module.css';
import FormBody from './FormBody';
import { Appointment }  from '@/components/Table/TableRow';

const Form: React.FC<{ data: Appointment | null }> = ({ data }) => {
    const initialData: Appointment = {
        pxid: '',
        clinicid: '',
        doctorid: '',
        status: '',
        queuedate: null,
        starttime: null,
        endtime: null,
        type: '',
        virtual: null,
        apptid: ''
    }

    const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
    const [formData, setFormData] = useState<Appointment>(initialData);

    useEffect(() => {
      if (data) {
        setFormMode('edit');
        setFormData(data);
      } else {
        setFormMode('add');
        setFormData(initialData)
      }
    }, [data]);

    return(
      <form className={formMode === 'add' ? `${styles.form_container} ${styles.form_container_add}` : `${styles.form_container} ${styles.form_container_edit}`}>
        <h2>{formMode === 'add' ? 'Add Row' : 'Edit Row'}</h2>
        <br/><hr/><br/>
        <FormBody formData={formData} />
        <button type="submit" className={formMode === 'add' ? styles.addButton : styles.saveButton}>{formMode === 'add' ? 'Add' : 'Save'}</button>
        <button
          type="reset" className={styles.discardButton}
          onClick={() => {
            setFormMode('add');
            setFormData(initialData);
          }}>Discard</button>
      </form>
    );
}

export default Form;