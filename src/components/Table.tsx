import React from 'react';
import styles from './Table.module.css'
import { Appointment }  from '@/components/TableRow';
import TableHeader from '@/components/TableHeader';
import TableBody from '@/components/TableBody';

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

export default Table;