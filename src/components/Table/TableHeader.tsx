import React from 'react';
import styles from './Table.module.css'

const TableHeader = () => {
    return(
      <thead>
        <tr>
          <th className={styles.rowNumberCellHeader}>#</th>
          <th className={styles.th}>pxid</th>
          <th className={styles.th}>clinicid</th>
          <th className={styles.th}>doctorid</th>
          <th className={styles.th}>status</th>
          <th className={styles.th}>queuedate</th>
          <th className={styles.th}>starttime</th>
          <th className={styles.th}>endtime</th>
          <th className={styles.th}>type</th>
          <th className={styles.th}>virtual</th>
          <th className={styles.th}>apptid</th>
          <th className={styles.actionCellHeader}>Actions</th>
        </tr>
      </thead>
    );
}

export default TableHeader;