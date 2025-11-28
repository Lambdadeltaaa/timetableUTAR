import { parseHTML } from "./parse-timetable.js";
import { renderTimetableEditor } from "./edit-timetable.js";
import { renderExportScreen } from "./export-timetable.js";

import { createAlertText, removeAlertText } from "../js-ui/ui-manager.js";

// once the user submits the HTML and click, the whole timetable data processing logic runs.
let submitHTMLButton = document.getElementById("html-submit");
submitHTMLButton.addEventListener("click", main);

function main() {
    let HTMLInput = document.getElementById("html-input").value;
    
    let timetableData = parseHTML(HTMLInput);
    if (handleParseResult(timetableData)) {
        renderTimetableEditor(timetableData, () => {
            renderExportScreen(timetableData);
        });
    }
}



// Acts as a bridger between parse-timetable.js and edit-timetable.js for main.
// Provide alerts to notify the user on the outcome of parsing. Returns true if parsing success, and false if it fails.
function handleParseResult(timetableData) {
    if (timetableData.error) { 
        let dataInputDiv = document.getElementsByClassName("parse-fail-alert")[0];
        createAlertText(dataInputDiv, timetableData.error, "alert-danger");
        return false;
    }
    else { 
        let parseSuccessDiv = document.getElementsByClassName("parse-success-alert")[0];
        let successText = "Timetable successfully processed!";

        createAlertText(parseSuccessDiv, successText, "alert-success");
        setTimeout(() => {removeAlertText(parseSuccessDiv)}, 3000);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return true;
    }
}