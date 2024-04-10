"use client";

import React, { useState, useMemo } from 'react';
import styles from "./page.module.css";
import Table from "@/components/Table/Table";
import { Appointment }  from '@/components/Table/TableRow';
import Form from '@/components/Form/Form'

export default function Home() {
  const [rowNumber, setrowNumber] = useState<number>(0);
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [formMode, setFormMode] = useState<'add' | 'edit' | 'search'>('add');
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
  const [searchParams, setSearchParams] = useState<Appointment>(initialData);

  const [formData, setFormData] = useState<Appointment>(initialData);
  const [page, setPage] = useState<number>(1);
  
  React.useEffect(() => {
	const params = new URLSearchParams();
	const any = searchParams as any;
	for (const key in searchParams)
		if (any[key]) { // ts error
			params.append(key, any[key]);
	}
	params.append('limit', '15');
	params.append('page', page.toString());
    fetch('/api/appointments?' + params.toString())
      .then(response => response.json())
      .then(data => {
		setAppointments(data.appointments)
		setrowNumber(0);
  	  });
  }, [page, searchParams]);

  
  const handleEditClick = async ( rowNumber: number ) => {
    setrowNumber(rowNumber);
  }
  
  const handleDelete = async ( rowData: Appointment ) => {
    const updatedAppointments = appointments.filter(appointment => appointment.apptid !== rowData.apptid);
    setAppointments(updatedAppointments);
  }
  const handleUpdate = async ( rowData: Appointment ) => {
	  const updatedAppointments = appointments.map(appointment => appointment.apptid === rowData.apptid ? rowData : appointment);
	  setAppointments(updatedAppointments);
	  setrowNumber(0);
  }
  const handleAdd = async ( rowData: Appointment ) => {
    const updatedAppointments = appointments.concat(rowData);
    setAppointments(updatedAppointments);
    setrowNumber(0);
  }

  const handleSearchClick = () => {
    setFormMode('search');
    setFormData(initialData);
  }
  const handleSearch = (app: Appointment) => {
	setSearchParams(app);
	setPage(1);
  }


  return (
    <main className={styles.main}>
      <div className={styles.top_container}>
        <h1>Appointments Table</h1>
        <button className={styles.searchButton} onClick={handleSearchClick}>🔍 Search</button>
      </div>
      <div className={styles.container}>
        <Table data={appointments} onEditClick={handleEditClick} onDelete={handleDelete} />
        <Form data={rowNumber ? appointments[rowNumber-1] : null} mode={formMode} setFormMode={setFormMode} setFormData={setFormData} formData={formData} initialData={initialData} rowNumber={rowNumber} onUpdate={handleUpdate} onAdd={handleAdd} onSearch={handleSearch} />
      </div>
    </main>
  );
}
