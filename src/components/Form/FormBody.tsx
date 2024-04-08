import React from 'react';
import styles from './Form.module.css';
import FormLabel from './FormLabel';
import FormInput from './FormInput';

const FormBody: React.FC = () => {
    return (
        <>
            <FormLabel label="pxid" /><br/>
            <FormInput id="pxid" />
            <br/><br/>
            <FormLabel label="clinicid" /><br/>
            <FormInput id="clinicid" />
            <br/><br/>
            <FormLabel label="doctorid" /><br/>
            <FormInput id="doctorid" />
            <br/><br/>
            <FormLabel label="status" /><br/>
            <select id="type" className={styles.select} required>
                <option value="Complete">Complete</option>
                <option value="Serving">Serving</option>
                <option value="Queued">Queued</option>
                <option value="NoShow">No Show</option>
                <option value="Skip">Skip</option>
                <option value="Cancel">Cancel</option>
            </select>
            <br/><br/>
            <FormLabel label="queuedate" /><br/>
            <FormInput id="queuedate" />
            <br/><br/>
            <FormLabel label="starttime" /><br/>
            <FormInput id="starttime" />
            <br/><br/>
            <FormLabel label="endttime" /><br/>
            <FormInput id="endttime" />
            <br/><br/>
            <FormLabel label="type" /><br/>
            <select id="type" className={styles.select} required>
                <option value="Consultation">Consultation</option>
                <option value="Inpatient">Inpatient</option>
            </select>
            <br/><br/>
            <FormLabel label="virtual" /><br/>
            <FormInput id="virtual" />
            <br/><br/>
            <FormLabel label="apptid" /><br/>
            <FormInput id="apptid" />
        </>
    );
}

export default FormBody;