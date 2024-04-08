'use client';

import React from 'react';
import styles from './Table.module.css'
import { PUT, DELETE } from '@/app/api/appointments/route';

export interface Appointment {
    pxid: string;
    clinicid: string;
    doctorid: string;
    status: string;
    queuedate: string | null;
    starttime: string | null;
    endtime: string | null;
    type: string;
    virtual: boolean | null;
    apptid: string;
  }


const TableRow: React.FC<{ data: Appointment }> = ({ data }) => {

  const handleEdit = async () => {
    try {
      const response = await fetch(`http://localhost:80/api/appointments/${data.apptid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('There was an error with the fetch call:', error);
    }
  };
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:80/api/appointments/${data.apptid}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('There was an error with the fetch call:', error);
    }
  };

  
    return(
      <tr>
        <td>{data.pxid}</td>
        <td>{data.clinicid}</td>
        <td>{data.doctorid}</td>
        <td>{data.status}</td>
        <td>{data.queuedate}</td>
        <td>{data.starttime}</td>
        <td>{data.endtime}</td>
        <td>{data.type}</td>
        <td>{data.virtual}</td>
        <td>{data.apptid}</td>
        <td className={styles.actionCell}>
          <button className={styles.editButton} onClick={handleEdit}>Edit</button>
          <button className={styles.deleteButton} onClick={handleDelete}>Delete</button>
        </td>
      </tr>
    );
}

export default TableRow;