import React from 'react';

const FormInput: React.FC<{ label: string, id: string }> = ({ label, id }) => {
    return (
        <>
            <label>{label}</label>
            <input type="text" id={id}></input>
        </>
    );
}

export default FormInput;