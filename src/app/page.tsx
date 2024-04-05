import styles from "./page.module.css";

const data = [
  ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5', 'Data 6', 'Data 7', 'Data 8', 'Data 9', 'Data 10'],
  ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5', 'Data 6', 'Data 7', 'Data 8', 'Data 9', 'Data 10']
]

interface Appointment {
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
];

const TableHeader = () => {
  return(
    <thead>
      <tr>
        <th>pxid</th>
        <th>clinicid</th>
        <th>doctorid</th>
        <th>status</th>
        <th>queuedate</th>
        <th>starttime</th>
        <th>endtime</th>
        <th>type</th>
        <th>virtual</th>
        <th>apptid</th>
      </tr>
    </thead>
  );
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

const TableBody: React.FC<{ data: Appointment[] }> = ( {data} ) => {
  return(
    <tbody>
      {data.map((row, index) => (
        <TableRow key={index} data={row} />
      )
      )}
    </tbody>
  );
}

const Table: React.FC<{ data: Appointment[] }> = ( {data} ) => {
  return(
    <div className={styles.table_container}>
      <table>
        <TableHeader />
        <TableBody data={data} />
      </table>
    </div>
  );
}

// const Form = () => {
//   return(
//     <form>
//       <label>Px Id</label>
//       <input type="text" id="pxid"></input><br/>

//       <label>Clinic Id</label>
//       <input type="text" id="clinicid"></input><br/>

//       <label>Doctor Id</label>
//       <input type="text" id="doctorid"></input><br/>

//       <label>Status</label>
//       <input type="text" id="status"></input><br/>

//       <button type="submit"></button>
//     </form>
//   );
// }

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Table data={appointments} />
        { /* <Form /> */ }
      </div>
    </main>
  );
}
