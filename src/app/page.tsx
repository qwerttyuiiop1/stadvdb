"use client";

import React, { useState } from 'react';
import styles from "./page.module.css";
import Table from "@/components/Table/Table";
import { Appointment }  from '@/components/Table/TableRow';
import Form from '@/components/Form/Form'

export default function Home() {
  const [rowNumber, setrowNumber] = useState<number>(-1);
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [page, setPage] = useState<number>(1);
  
  React.useEffect(() => {
	fetch('/api/appointments?limit=100&page=' + page)
	  .then(response => response.json())
	  .then((data: any) => {
		setAppointments(data.appointments)
		console.log('appointments', data)
  	  });
  }, [page]);

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
	setrowNumber(-1);
  }
  const handleAdd = async ( rowData: Appointment ) => {
	const updatedAppointments = appointments.concat(rowData);
	setAppointments(updatedAppointments);
	setrowNumber(-1);
  }

  console.log(appointments);

  return (
    <main className={styles.main}>
      <div className={styles.top_container}>
        <h1>Appointments Table</h1>
        <button className={styles.searchButton}>Search</button>
      </div>
      <div className={styles.container}>
        <Table data={appointments} onEditClick={handleEditClick} onDelete={handleDelete} />
        <Form data={rowNumber === -1 ? null : appointments[rowNumber]} rowNumber={rowNumber} onUpdate={handleUpdate} onAdd={handleAdd}/>
      </div>
    </main>
  );
}
