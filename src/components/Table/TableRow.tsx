'use client';

import React from 'react';
import styles from './Table.module.css'

export interface Appointment {
    pxid: string;
    clinicid: string;
    doctorid: string;
    status: string | null;
    timequeued: string | null;
    queuedate: string | null;
    starttime: string | null;
    endtime: string | null;
    type: string | null;
    virtual: number | null;
    apptid: string;
  }


const TableRow: React.FC<{
  data: Appointment, rowNumber: number,
  onEditClick: (rowNumber: number) => void,
  onDelete: (appt: Appointment) => void
}> = ({ data, rowNumber, onEditClick, onDelete }) => {

  const handleEdit = async () => {
    onEditClick(rowNumber);
  }
  
  const handleDelete = async () => {
    try {
      const response: Response = await fetch(`/api/appointments/${data.apptid}`, {
        method: 'DELETE',
      });
	  if (!response.ok)
		throw await response.json();
      onDelete(data);
    } catch (error) {
      console.error(error);
    }
  }

  
    return(
      <tr className={styles.tr}>
        <td className={styles.rowNumberCell}>{rowNumber}</td>
        <td>{data.apptid}</td>
        <td>{data.pxid}</td>
        <td>{data.clinicid}</td>
        <td>{data.doctorid}</td>
        <td>{data.status}</td>
        <td>{data.timequeued}</td>
        <td>{data.queuedate}</td>
        <td>{data.starttime}</td>
        <td>{data.endtime}</td>
        <td>{data.type}</td>
        <td>{data.virtual}</td>
        <td className={styles.actionCell}>
          <button className={styles.editButton} onClick={handleEdit}>Edit</button>
          <button className={styles.deleteButton} onClick={handleDelete}>Delete</button>
        </td>
      </tr>
    );
}

export default TableRow;