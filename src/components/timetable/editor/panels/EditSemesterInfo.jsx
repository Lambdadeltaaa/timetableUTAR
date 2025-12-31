import { useState, useRef } from "react"

import Alert from "../../../common/Alert/Alert.jsx";

export default function EditSemesterInfo({ timetableData, setTimetableData }) {
    const alertRef = useRef(null);
    const [localInfo, setLocalInfo] = useState(timetableData.semesterInfo);

    // both input uses onBlur for better user typing experience
    // onChange edit the state and DOM, onBlur triggers this function and revert state if input invalid, otherwise edit global state
    // this function accepts e.target.value thus no need to be scared of async problems, DOM update is sync but state isnt
    const handleInfoChange = (info, id) => {
        const idToProperty = {
            "start-date-input": "startDate",
            "semester-length-input": "semesterLength"
        }

        let alertMessage = "";
        if (id === "start-date-input") {
            if (!info || isNaN(Date.parse(info))) alertMessage = "Invalid Date.";
            if (new Date(info).getDay() != 1) alertMessage = "Date is not Monday.";
        }
        if (id === "semester-length-input") {
            if (!info || !Number.isFinite(+info)) alertMessage = "Invalid format for duration";
            if (+info <= 0 || +info > 30 || !Number.isInteger(+info)) alertMessage = "Duration must be an integer in the range 1-30";
        }

        // revert local state to original state if invalid, else update new value to global state
        // local state DOES NOT need to be updated if input valid, since it is already updated on every onChange
        if (alertMessage != "") {
            alertRef.current.createAlert("danger", alertMessage);

            setLocalInfo((prev) => ({...prev, [idToProperty[id]]: timetableData.semesterInfo[idToProperty[id]]}))   
        }
        else {
            alertRef.current.deleteAlert();
            
            setTimetableData((prev) => ({
                ...prev,
                semesterInfo: {...prev.semesterInfo, [idToProperty[id]]: info}
            }))
        }
    }


    return (
        <div className="edit-semester-info mb-5">
            <h3 className="secondary-header-text">Semester Info:</h3>

            <label htmlFor="start-date-input" className="form-label main-body-text">
                Enter Date of the Semester's Week 1 Monday:
            </label>
            <input 
                type="date" 
                className="form-control" 
                id="start-date-input" 
                value={localInfo.startDate}
                onChange={(e) => setLocalInfo((prev) => ({...prev, startDate: e.target.value}))}
                onBlur={(e) => handleInfoChange(e.target.value, e.target.id)}
            />

            <br />

            <label htmlFor="semester-length-input" className="form-label main-body-text">
                Enter Duration of Semester (in weeks):
            </label>
            <input 
                type="number"
                min={1}
                className="form-control" 
                id="semester-length-input"
                value={localInfo.semesterLength}
                onChange={(e) => setLocalInfo((prev) => ({...prev, semesterLength: e.target.value}))}
                onBlur={(e) => handleInfoChange(e.target.value, e.target.id)}
            />

            <Alert ref={alertRef} />
        </div>
    )
}