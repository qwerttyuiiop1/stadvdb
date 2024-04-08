import React from 'react';
import styles from './Table.module.css'
import { Appointment }  from '@/components/Table/TableRow';
import TableHeader from '@/components/Table/TableHeader';
import TableBody from '@/components/Table/TableBody';

const Table: React.FC<{ data: Appointment[] }> = ({ data }) => {
    return(
      <div className={styles.table_container}>
        <div className={styles.scroll_container}>
          <table>
            <TableHeader />
            <TableBody data={data} />
          </table>
        </div>
      </div>
    );
}

export default Table;