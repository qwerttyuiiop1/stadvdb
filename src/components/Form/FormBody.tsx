import React from 'react';
import styles from './Form.module.css';
import FormLabel from './FormLabel';
import FormInput from './FormInput';
import { Appointment }  from '@/components/Table/TableRow';

const FormBody: React.FC<{ formData: Appointment, setFormData: (data: Appointment ) => void }> = ({ formData }) => {
    return (
        <>
            <FormLabel label="apptid" /><br/>
            <FormInput id="apptid" defaultValue={formData.apptid} />
            <br/><br/>
            <FormLabel label="pxid" /><br/>
            <FormInput id="pxid" defaultValue={formData.pxid} />
            <br/><br/>
            <FormLabel label="clinicid" /><br/>
            <FormInput id="clinicid" defaultValue={formData.clinicid} />
            <br/><br/>
            <FormLabel label="doctorid" /><br/>
            <FormInput id="doctorid" defaultValue={formData.doctorid} />
            <br/><br/>
            <FormLabel label="status" /><br/>
            <select id="status" className={styles.select}>
				<option value={formData.status || ''}>{formData.status}</option>
                <option value=""></option>
                <option value="Complete">Complete</option>
                <option value="Serving">Serving</option>
                <option value="Queued">Queued</option>
                <option value="NoShow">NoShow</option>
                <option value="Skip">Skip</option>
                <option value="Cancel">Cancel</option>
            </select>
            <br/><br/>
            <FormLabel label="timequeued" /><br/>
            <FormInput id="timequeued" defaultValue={formData.timequeued || ''} />
            <br/><br/>
            <FormLabel label="queuedate" /><br/>
            <FormInput id="queuedate" defaultValue={formData.queuedate || ''} />
            <br/><br/>
            <FormLabel label="starttime" /><br/>
            <FormInput id="starttime" defaultValue={formData.starttime || ''} />
            <br/><br/>
            <FormLabel label="endtime" /><br/>
            <FormInput id="endtime" defaultValue={formData.endtime || ''} />
            <br/><br/>
            <FormLabel label="type" /><br/>
            <select id="type" className={styles.select}>
				<option value={formData.type || ''}>{formData.type}</option>
                <option value=""></option>
                <option value="Consultation">Consultation</option>
                <option value="Inpatient">Inpatient</option>
            </select>
            <br/><br/>
            <FormLabel label="virtual" /><br/>
            <select id="virtual" className={styles.select}>
				<option value={formData.virtual || ''}>{formData.virtual}</option>
                <option value=""></option>
                <option value="0">0</option>
                <option value="1">1</option>
            </select>
        </>
    );
}

export default FormBody;