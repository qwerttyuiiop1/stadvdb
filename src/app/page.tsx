"use client";

import React, { useState } from 'react';
import styles from "./page.module.css";
import Table from "@/components/Table/Table";
import { Appointment }  from '@/components/Table/TableRow';
import Form from '@/components/Form/Form'

const sample_appointments: Appointment[] = [
  {
    pxid: "EF196B348A49FB32DABC9834DC4FAAD9",
    clinicid: "ADF7EE2DCF142B0E11888E72B43FCB75",
    doctorid: "BB04AF0F7ECAEE4AAE62035497DA1387",
    status: "Queued",
    timequeued: "2018-04-11 01:59:58",
    queuedate: "2018-04-10 16:00:00",
    starttime: null,
    endtime: null,
    type: "Consultation",
    virtual: null,
    apptid: "C1CC0949B93D00A559F7A0BD38361E80",
  },
  {
    
    pxid: "EAE3C87D0B33351272F2E9B9B1B56217",
    clinicid: "02A0236D8F72C01A9FE264152E30BEC8",
    doctorid: "82AA4B0AF34C2313A562076992E50AA3",
    status: "Complete",
    timequeued: "2018-04-10 10:34:16",
    queuedate: "2018-04-08 16:00:00",
    starttime: "2018-04-09 10:33:00",
    endtime: "2018-04-12 05:29:58",
    type: "Inpatient",
    virtual: null,
    apptid: "6585A31C60A1886FBA1433C50012B504",
  },
  {
    pxid: "7C5C93809D626CC702D08F33985B2B58",
    clinicid: "02A0236D8F72C01A9FE264152E30BEC8",
    doctorid: "82AA4B0AF34C2313A562076992E50AA3",
    status: "Complete",
    timequeued: "2018-04-03 15:26:20",
    queuedate: "2018-03-30 16:00:00",
    starttime: "2018-03-31 15:25:00",
    endtime: "2018-04-05 15:51:48",
    type: "Inpatient",
    virtual: null,
    apptid: "7250DCFF615E6580295C7E6ED4322371",
  },
  {
    pxid: "C300C2B9E0E5D4C46E8093BCDBFA05CA",
    clinicid: "0050F1E87CEA6C50B311A43B12CEA2C8",
    doctorid: "AD61AB143223EFBC24C7D2583BE69251",
    status: "Cancel",
    timequeued: "2015-11-24 08:01:14",
    queuedate: null,
    starttime: null,
    endtime: null,
    type: "Consultation",
    virtual: null,
    apptid: "F5BBDCC08E39332F0AC27BB95CF1396A",
  },
  {
    pxid: "E649637106C9182BD4FAD1592B57A4B9",
    clinicid: "6690F091F4D8B3DE28E157A5DC26C059",
    doctorid: "6EB887126D24E8F1CD8AD5033482C781",
    status: "Complete",
    timequeued: "2020-08-03 02:05:14",
    queuedate: "2020-08-04 16:00:00",
    starttime: "2020-08-05 11:00:10",
    endtime: "2020-08-05 11:15:10",
    type: "Consultation",
    virtual: null,
    apptid: "67E082BF267D1DEEE048310D30859880",
  },	
  {
    pxid: "ABE33A26DE672C90C7723CC0C969F6D7",
    clinicid: "6690F091F4D8B3DE28E157A5DC26C059",
    doctorid: "6EB887126D24E8F1CD8AD5033482C781",
    status: "Complete",
    timequeued: "2021-01-12 09:55:08",
    queuedate: "2021-01-12 16:00:00",
    starttime: "2021-01-13 13:00:00",
    endtime: "2021-01-13 13:15:00",
    type: "Consultation",
    virtual: 0,
    apptid: "3A7180C2F79177D754415AE9A662145F",
  },
  {
    pxid: "AEDCF41DC52D12E251432E7AD7F1B63D",
    clinicid: "6690F091F4D8B3DE28E157A5DC26C059",
    doctorid: "6EB887126D24E8F1CD8AD5033482C781",
    status: "Complete",
    timequeued: "2021-02-03 04:57:56",
    queuedate: "2021-02-02 16:00:00",
    starttime: "2021-02-03 05:30:00",
    endtime: "2021-02-03 05:45:00",
    type: "Consultation",
    virtual: 1,
    apptid: "3C97ED8DEB47F647CCB03EBD4EF29454",
  },
];

export default function Home() {
  const [rowData, setRowData] = useState<Appointment | null>(null);
  const [rowNumber, setrowNumber] = useState<number>(0);
  const [appointments, setAppointments] = useState<Appointment[]>(sample_appointments)
  
  const handleEdit = async ( rowData: Appointment, rowNumber: number ) => {
    setRowData(rowData);
    setrowNumber(rowNumber);
  }
  
  const handleDelete = async ( rowData: Appointment ) => {
    const updatedAppointments = appointments.filter(appointment => appointment.apptid !== rowData.apptid);
    setAppointments(updatedAppointments);
  }



  return (
    <main className={styles.main}>
      <div className={styles.top_container}>
        <h1>Appointments Table</h1>
        <button className={styles.searchButton}>Search</button>
      </div>
      <div className={styles.container}>
        <Table data={appointments} onEditClick={handleEdit} onDeleteClick={handleDelete} />
        <Form data={rowData} rowNumber={rowNumber}/>
      </div>
    </main>
  );
}
