import { parseHTML } from "./parse-timetable.js";
import { renderTimetableEditor } from "./edit-timetable.js";

let submitHTMLButton = document.getElementById("html-submit");
submitHTMLButton.addEventListener("click", main);

function main() {
    let HTMLInput = document.getElementById("html-input").value;
    let timetableData = parseHTML(HTMLInput);

    renderTimetableEditor(timetableData);
}
