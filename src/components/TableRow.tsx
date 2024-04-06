import React from 'react';

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
      </tr>
    );
}

export default TableRow;