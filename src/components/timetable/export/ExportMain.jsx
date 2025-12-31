import { useRef } from "react";

import exportTimetableData from "../../../logic/exportTimetableData.js";

import ExportHeader from "./ExportHeader.jsx";
import ExportActions from "./ExportActions.jsx";
import ExportInstructions from "./ExportInstructions.jsx";
import Alert from "../../common/Alert/Alert.jsx";

// MAIN FUNCTION:
// Formats timetableData and allow for export in file format user desires
// Returns a alert to signify success/failure
export default function ExportMain({ timetableData, changeScreen }) {
    const alertRef = useRef(alert);
    const backPreviousScreen = () => {changeScreen("editor")};

    const handleExport = (format) => {
        const status = exportTimetableData(timetableData, format)
        if (status.error) {
            alertRef.current.createAlert("danger", status.error);
        }
        else {
            alertRef.current.createAlert("success", status.success);
        }
    };

    return (
        <div className="export-main container mt-5 mb-5">
            <ExportHeader backPreviousScreen={backPreviousScreen} />
            <ExportActions handleExport={handleExport} />
            <Alert ref={alertRef} className="mb-5" />
            <ExportInstructions />
        </div>
    )
}