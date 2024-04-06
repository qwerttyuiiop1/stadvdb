import React from 'react';
import TableRow, { Appointment }  from '@/components/TableRow';

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

export default TableBody;