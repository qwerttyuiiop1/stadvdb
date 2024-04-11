import React, { useState, useEffect } from 'react';
import styles from '@/components/Form/Form.module.css';
import FormBody from './FormBody';
import { Appointment }  from '@/components/Table/TableRow';

const Form: React.FC<{
  data: Appointment | null,
  rowNumber: number,
  mode: 'add' | 'edit' | 'search',
  setFormMode: (mode: 'add' | 'edit' | 'search') => void,
  setFormData: (data: Appointment) => void,
  formData: Appointment,
  initialData: Appointment,
  onUpdate: (data: Appointment) => void,
  onAdd: (data: Appointment) => void,
  onSearch: (data: Appointment) => void
}> = ({ data, rowNumber, mode, setFormMode, setFormData, formData, initialData, onUpdate, onAdd, onSearch }) => {
  
    useEffect(() => {
      if (data) {
        setFormMode('edit');
        setFormData({...data});
      } else {
        setFormMode('add');
        setFormData({...initialData})
      }
    }, [data, initialData, setFormData, setFormMode]);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

	    const data = {} as Appointment;
      for (const key in initialData) {
        const value = (document.getElementById(key)! as HTMLInputElement).value;
        (data as any)[key] = value;
      }

      data.apptid = formData.apptid;
      console.log('submit', data);

      // Edit mode
      if (mode === 'edit') {
        try {
          const response: Response = await fetch(`/api/appointments/${data?.apptid}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

        const json = await response.json();
        if (!response.ok)
          throw json;
          onUpdate(json.appointment);
        } catch (error) {
          console.error(error);
        }

      // Add mode
      } else if (mode === 'add') {
        const response: Response = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const json = await response.json();
        if (!response.ok)
          throw json;
        onAdd(json.appointment);
      } else {
		onSearch(data);
	  }
    }

    return(
      <form onSubmit={handleSubmit} className={mode === 'add' ? `${styles.form_container} ${styles.form_container_add}` : mode === 'edit' ? `${styles.form_container} ${styles.form_container_edit}` : `${styles.form_container} ${styles.form_container_search}`}>
        <h2>{mode === 'add' ? 'Add Row' : mode === 'edit' ? `Edit - Row #${rowNumber}` : 'Search'}</h2>
        <br/><hr/><br/>
        <FormBody formData={formData} setFormData={setFormData} />
        <button type="submit" className={mode === 'add' ? styles.addButton : mode === 'edit' ? styles.saveButton : styles.searchButton}>{mode === 'add' ? 'Add' : mode === 'edit' ? 'Edit' : 'Search'}</button>
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