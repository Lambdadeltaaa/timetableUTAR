import { parseHTML } from "./parse-timetable.js";
import { renderTimetableEditor } from "./edit-timetable.js";

import { createAlertText, removeAlertText } from "../js-ui/ui.js";

// once the user submits the HTML and click, the whole timetable data processing logic runs.
let submitHTMLButton = document.getElementById("html-submit");
submitHTMLButton.addEventListener("click", main);

function main() {
    let HTMLInput = document.getElementById("html-input").value;
    
    let timetableData = parseHTML(HTMLInput);
    if (handleParseResult(timetableData)) {
        renderTimetableEditor(timetableData);
    }
}



// Acts as a bridger between parse-timetable.js and edit-timetable.js for main.
// Provide alerts to notify the user on the outcome of parsing. Returns true if parsing success, and false if it fails.
function handleParseResult(timetableData) {
    let alertDiv = document.getElementsByClassName("data-input-alert")[0];

    if (timetableData.error) { // parsing fails
        createAlertText(alertDiv, timetableData.error, "alert-danger");
        return false;
    }
    else { // parsing succeeds
        let successText = "Timetable successfully processed!";
        createAlertText(alertDiv, successText, "alert-success");
        setTimeout(() => {removeAlertText(alertDiv)}, 2000);
        return true;
    }
}