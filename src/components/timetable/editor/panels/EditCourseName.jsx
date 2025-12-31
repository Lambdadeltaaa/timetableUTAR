import { useState, useRef } from "react";

import Alert from "../../../common/Alert/Alert.jsx";

// basically allows modifying object courseNames key:value pairs in object timetableData
export default function EditCourseName({ timetableData, setTimetableData }) {
    const alertRef = useRef(null);
    const [courseNamesDraft, setCourseNamesDraft] = useState(() => 
        Object.fromEntries(Object.keys(timetableData.courseNames).map(code => [code, timetableData.courseNames[code]]))
    );
    const [editStatus, setEditStatus] = useState(() => 
        Object.fromEntries(Object.keys(timetableData.courseNames).map(code => [code, false]))
    );

    const handleEditSave = (code) => {
        // -- SWITCH TO EDIT MODE --
        if (!editStatus[code]) {
            alertRef.current.deleteAlert();
            setEditStatus(prev => ({ ...prev, [code]: true }));
            return;
        }

        // -- SWITCH TO SAVE MODE -- 
        // reverts new name back to original value before updating it to draft and global states
        // IMPORTANTTT: draft MUST BE UPDATED regardless of valid/invalid input because it has not be updated yet
        let newName = courseNamesDraft[code].trim().toUpperCase();
        
        if (newName === "" || newName.length > 100) {
            alertRef.current.createAlert("danger", "Course name cannot be blank / exceed 100 characters.");

            newName = timetableData.courseNames[code];
            setCourseNamesDraft(prev => ({...prev, [code]: newName}))
        }
        else {
            setCourseNamesDraft(prev => ({...prev, [code]: newName}))
            setTimetableData(prev => ({
                ...prev, courseNames: {...prev.courseNames, [code]: newName}
            }));
        }

        setEditStatus(prev => ({ ...prev, [code]: false }));
    };

    
    // created a helper renderer for tbody otherwise indentation going to be too much 
    const createTableBody = () => (
        Object.keys(timetableData.courseNames).map((code) => (
            <tr key={code}>
                <td className="text-nowrap">{code}</td>

                <td className="text-wrap w-100">
                    {!editStatus[code] ?
                        timetableData.courseNames[code] :
                        <input 
                            type="text" 
                            className="form-control"
                            value={courseNamesDraft[code]}
                            onChange={(e) => setCourseNamesDraft(prev => ({...prev, [code]: e.target.value}))}
                        /> 
                    }
                </td>

                <td className="text-nowrap">
                    <button className="btn btn-outline-light" onClick={() => {handleEditSave(code)}} >
                        {!editStatus[code] ? "Edit" : "Save"}
                    </button>
                </td>
            </tr>
        ))
    );

    return (
        <div className="edit-course-name mb-5">
            <h3 className="secondary-header-text">Edit Course Name:</h3>
            
            <table className="table table-striped border table-rounded">
                <thead>
                    <tr>
                        <td className="text-nowrap">Course Code</td>
                        <td className="text-nowrap">Course Name</td>
                        <td className="text-nowrap">Action</td>
                    </tr>
                </thead>

                <tbody>
                    {createTableBody()}
                </tbody>
            </table>

            <Alert ref={alertRef} />
        </div>
    )
}