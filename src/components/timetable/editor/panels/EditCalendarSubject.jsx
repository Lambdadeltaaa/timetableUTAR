import { useState, useRef } from "react";

import { ReactSortable } from "react-sortablejs";
import Alert from "../../../common/Alert/Alert.jsx";

// allow user to change the order of the subject item and whether or now to show them on the event subject
export default function EditCalendarSubject({ timetableData, setTimetableData }) {
    const alertRef = useRef(null);
    const [localStatus, setLocalStatus] = useState(timetableData.subjectItemsStatus);
    const [localOrder, setLocalOrder] = useState(timetableData.subjectItemsOrder);

    const handleStatusChange = (item, checked) => {
        const nextLocalStatus = {...localStatus, [item]: checked}; 

        let somethingChecked = false
        Object.values(nextLocalStatus).forEach(value => {
            if (value === true) somethingChecked = true;
        });
        
        // revert new status to original values if invalid input before updating to local and global states
        // IMPORTANTTT: local MUST BE UPDATED regardless of valid/invalid input because it has not be updated yet
        if (!somethingChecked) {
            alertRef.current.createAlert("danger", "You must have at least one item checked.");

            nextLocalStatus[item] = true;
            setLocalStatus(nextLocalStatus);
        }
        else {
            alertRef.current.deleteAlert();

            setLocalStatus(nextLocalStatus);
            setTimetableData(prev => ({
                ...prev, 
                subjectItemsStatus: {...prev.subjectItemsStatus, [item]: nextLocalStatus[item]}
            }));
        }
    }

    const handleOrderChange = (order) => {
        const nextOrder = order.map(item => String(item)); // need to do this as setList return a weird array format

        setLocalOrder(nextOrder);
        setTimetableData(prev => ({
            ...prev,
            subjectItemsOrder: nextOrder
        }));
    }

    
    return (
        <div className="edit-calendar-subject mb-5">
            <h3 className="secondary-header-text">Calendar Subjects Includes:</h3>
            <p className="main-body-text">You can drag and drop to change the order.</p>

            <ReactSortable 
                list={localOrder} 
                setList={(order) => handleOrderChange(order)} 
                animation={150} 
                ghostClass="blue-background-class" 
                className="list-group"
            >
                {localOrder.map(item => 
                    <li className="list-group-item" key={item}>
                        <input 
                            className="form-check-input me-2"
                            type="checkbox"
                            id={item}
                            checked={localStatus[item]}
                            onChange={(e) => handleStatusChange(item, e.target.checked)}
                        />

                        <label htmlFor={item} className="form-check-label main-body-text">
                            {/* Convert camel casing to spaces */}
                            {item.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                        </label>
                    </li>
                )}
            </ReactSortable>

            <Alert ref={alertRef} />
        </div>
    )
}