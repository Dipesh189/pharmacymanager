
import { useState } from 'react';
import Calendar from '../../../components/Calendar/Calendar'
import styles from './Holiday.module.css'


const Holiday = () => {
 
  const [
    selectedDates,
    setSelectedDates,
  ] = useState<Date[]>([]);
  return (
    <div className={styles.holidayContainer}>
        <h1>Holiday Request</h1>
        <div><Calendar
        multipleSelect
        selectedDates={
          selectedDates
        }
        onDatesSelect={
          setSelectedDates
        }
        days={30}
        disablePreviousMonths
      />

       <form action="" className={styles.holidayForm}>
        <div className={styles.dateInputs}
        >
        <div className={styles.timeInput}>
        <label htmlFor="startTime">Start Time</label>
       <input type="time" name="startTime" id="startTime" />
       </div>
       <div className={styles.timeInput}>
       <label htmlFor="endTime">End Time</label>
       <input type="time" name="endTime" id="endTime" />
       </div>
       </div>
        
        <button type="submit">Submit</button>
        </form></div>
        
    </div>
  )
}

export default Holiday