'use client';

import React from 'react';
import styles from './Table.module.css'

export interface Appointment {
    pxid: string;
    clinicid: string;
    doctorid: string;
    status: string;
    queuedate: string | null;
    starttime: string | null;
    endtime: string | null;
    type: string;
    virtual: number | null;
    apptid: string;
  }


const TableRow: React.FC<{
  data: Appointment, rowNumber: number,
  onEditClick: (appt: Appointment) => void,
  onDeleteClick: (appt: Appointment) => void
}> = ({ data, rowNumber, onEditClick, onDeleteClick }) => {

  const handleEdit = async () => {
    onEditClick(data);
  }
  
  const handleDelete = async () => {
    try {
      const response: Response = await fetch(`/api/appointments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apptid: data.apptid }),
      });

      // onDeleteClick(data);
  
      // rest of your code...
    } catch (error) {
      console.error(error);
    }
  }

  
    return(
      <tr className={styles.tr}>
        <td className={styles.rowNumberCell}>{rowNumber}</td>
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