import React from 'react';
import TableRow, { Appointment }  from '@/components/Table/TableRow';

const TableBody: React.FC<{
  data: Appointment[],
  onEditClick: (rowNumber: number) => void,
  onDelete: (appt: Appointment) => void
}> = ({ data, onEditClick, onDelete }) => {
    return(
      <tbody>
        {data.map((row, index) => (
          <TableRow key={index} data={row} rowNumber={index + 1} onEditClick={onEditClick} onDelete={onDelete} />
        )
        )}
      </tbody>
    );
}

export default TableBody;