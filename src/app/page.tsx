import styles from "./page.module.css";
import Table from "@/components/Table/Table";
import { Appointment }  from '@/components/Table/TableRow';
import Form from '@/components/Form/Form'

const appointments: Appointment[] = [
  {
    pxid: "EF196B348A49FB32DABC9834DC4FAAD9",
    clinicid: "ADF7EE2DCF142B0E11888E72B43FCB75",
    doctorid: "BB04AF0F7ECAEE4AAE62035497DA1387",
    status: "Queued",
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
    queuedate: "2020-08-04 16:00:00",
    starttime: "2020-08-05 11:00:10",
    endtime: "2020-08-05 11:15:10",
    type: "Consultation",
    virtual: null,
    apptid: "67E082BF267D1DEEE048310D30859880",
  },	
  {
    pxid: "EF196B348A49FB32DABC9834DC4FAAD9",
    clinicid: "ADF7EE2DCF142B0E11888E72B43FCB75",
    doctorid: "BB04AF0F7ECAEE4AAE62035497DA1387",
    status: "Queued",
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
    queuedate: "2020-08-04 16:00:00",
    starttime: "2020-08-05 11:00:10",
    endtime: "2020-08-05 11:15:10",
    type: "Consultation",
    virtual: null,
    apptid: "67E082BF267D1DEEE048310D30859880",
  },									
];

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Appointments Table</h1>
      <div className={styles.container}>
        <Table data={appointments} />
        <Form />
      </div>
    </main>
  );
}
