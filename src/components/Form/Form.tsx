import React, { useState, useEffect, useMemo } from 'react';
import styles from '@/components/Form/Form.module.css';
import FormBody from './FormBody';
import { Appointment }  from '@/components/Table/TableRow';

const Form: React.FC<{
  data: Appointment | null,
  rowNumber: number,
  mode: 'add' | 'edit' | 'search',
  setFormMode: (mode: 'add' | 'edit' | 'search') => void,
  onUpdate: (data: Appointment) => void,
	onAdd: (data: Appointment) => void
}> = ({ data, rowNumber, mode, setFormMode, onUpdate, onAdd }) => {
  
    const initialData: Appointment = useMemo(() => ({
        pxid: '',
        clinicid: '',
        doctorid: '',
        status: '',
        timequeued: null,
        queuedate: null,
        starttime: null,
        endtime: null,
        type: '',
        virtual: null,
        apptid: ''
    }), []);

    const [formData, setFormData] = useState<Appointment>(initialData);

    useEffect(() => {
      if (data) {
        setFormMode('edit');
        setFormData({...data});
      } else {
        setFormMode('add');
        setFormData({...initialData, apptid: ''})
      }
    }, [data, initialData]);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);
	  const data = Object.fromEntries(formData.entries()) as unknown as Appointment;

	  console.log('submit', data);
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
      }
    }

    return(
      <form onSubmit={handleSubmit} className={mode === 'add' ? `${styles.form_container} ${styles.form_container_add}` : mode === 'edit' ? `${styles.form_container} ${styles.form_container_edit}` : `${styles.form_container} ${styles.form_container_search}`}>
        <h2>{mode === 'add' ? 'Add Row' : mode === 'edit' ? `Edit - Row #${rowNumber}` : 'Search'}</h2>
        <br/><hr/><br/>
        <FormBody formData={formData} setFormData={setFormData} />
        <button type="submit" className={mode === 'add' ? styles.addButton : mode === 'edit' ? styles.saveButton : styles.searchButton}>{mode === 'add' ? 'Add' : 'Search'}</button>
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