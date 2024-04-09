import React from 'react';
import TableRow, { Appointment }  from '@/components/Table/TableRow';

const TableBody: React.FC<{
  data: Appointment[],
  onEditClick: (rowNumber: number) => void,
  onDeleteClick: (appt: Appointment) => void
}> = ({ data, onEditClick, onDeleteClick }) => {
    return(
      <tbody>
        {data.map((row, index) => (
          <TableRow key={index} data={row} rowNumber={index + 1} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
        )
        )}
      </tbody>
    );
}

export default TableBody;