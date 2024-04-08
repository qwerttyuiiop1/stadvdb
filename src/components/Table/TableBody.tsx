import React from 'react';
import TableRow, { Appointment }  from '@/components/Table/TableRow';

const TableBody: React.FC<{ data: Appointment[] }> = ({ data }) => {
    return(
      <tbody>
        {data.map((row, index) => (
          <TableRow key={index} data={row} rowNumber={index + 1}/>
        )
        )}
      </tbody>
    );
}

export default TableBody;