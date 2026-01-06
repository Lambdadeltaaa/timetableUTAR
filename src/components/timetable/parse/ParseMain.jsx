import { useRef } from "react";

import parseTimetableHTML from "../../../logic/parseTimetableHTML.js";
import enrichTimetableData from "../../../logic/enrichTimetableData.js";

import ParseInstructions from "./ParseInstructions.jsx";
import ParseInput from "./ParseInput.jsx";
import Alert from "../../common/Alert/Alert.jsx";

// MAIN FUNCTION:
// Process timetable file input from the parse input component, then enrich with relevant info 
// After that, passes it to parent component and proceeds to "edit"
// refer to both parseTimetableHTML and enrichTimetableData functions for more further understanding of timetableData structure
export default function ParseMain({ setTimetableData, changeScreen }) {
    const alertRef = useRef(null);

    const processHTMLInput = async (htmlInput) => {
        // the regex expression checks if the file name ends with .html or .htm extension
        if (!(htmlInput instanceof File) || !(/\.(html?|htm)$/i.test(htmlInput.name))) {
            alertRef.current.createAlert("danger", "Timetable HTML file is not uploaded or detected. Please upload the correct file.")
            return;
        }
        const htmlString = await htmlInput.text();
        
        const timetableData = parseTimetableHTML(htmlString);
        if (timetableData.error) {
            alertRef.current.createAlert("danger", timetableData.error);
            return;
        }

        const updatedTimetableData = enrichTimetableData(timetableData);
        if (updatedTimetableData.error) {
            alertRef.current.createAlert("danger", updatedTimetableData.error)
            return;
        }

        alertRef.current.deleteAlert();
        setTimetableData({...updatedTimetableData});
        changeScreen("editor");
    }

    return (
        <div className="parse-main container mb-5 text-center">
            <ParseInstructions />
            <ParseInput processHTMLInput={processHTMLInput} />
            <Alert ref={alertRef} className={"col-12 col-md-9 mx-auto"}/>
        </div>
    )
}