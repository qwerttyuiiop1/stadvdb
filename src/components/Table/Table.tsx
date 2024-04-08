import React from 'react';
import styles from './Table.module.css'
import { Appointment }  from '@/components/Table/TableRow';
import TableHeader from '@/components/Table/TableHeader';
import TableBody from '@/components/Table/TableBody';

const Table: React.FC<{ data: Appointment[] }> = ({ data }) => {
    return(
      <div className={styles.table_container}>
        <table>
          <TableHeader />
          <TableBody data={data} />
        </table>
      </div>
    );
}

export default Table;