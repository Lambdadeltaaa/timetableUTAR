/* export-timetable.js 
- INPUT: object timetableData (refer to edit-timetable.js)
- OUTPUT: csv file for google calendar

- This section compared to edit-timetable.js has no dynamic content that need to be generated
- Thus all we do here is build up the csv file and add event listeners for user clicks 
*/

import { expandUI, collapseUI, createAlertText, removeAlertText } from "../js-ui/ui-manager.js";

export function renderExportScreen(timetableData) {
    hidePreviousUI();
    renderExportTemplate();

    createBackButtonListener();
    createExportButtonListener(timetableData);
}



function hidePreviousUI() {
    let editorUI = document.getElementsByClassName("editor-ui")[0];
    collapseUI([editorUI])
}



function renderExportTemplate() {
    let exportUI = document.getElementsByClassName("export-ui")[0];
    exportUI.innerHTML = "";

    let exportTemplate = document.getElementById("export-ui-template");
    exportUI.appendChild(exportTemplate.content.cloneNode(true));

    requestAnimationFrame(() => {
        expandUI([exportUI], true);
    });
}



function createBackButtonListener() {
    let backButton = document.getElementById("back-edit");
    backButton.addEventListener("click", () => {
        let editorUI = document.getElementsByClassName("editor-ui")[0];
        expandUI([editorUI]);

        let exportUI = document.getElementsByClassName("export-ui")[0];
        collapseUI([exportUI], true);
    });
}



function createExportButtonListener(timetableData) {
    let exportCSVButton = document.getElementById("export-csv");

    exportCSVButton.addEventListener("click", () => {
        buildCSVFile(timetableData); // after that, downloads it
    });
}

function buildCSVFile(timetableData) {
    for (let classInfo of timetableData.classInfos) {
        classInfo["eventSubject"] = timetableData.writeEventSubject(classInfo);
    }

    let firstMondayDate = new Date(timetableData.semesterInfo.startDate);
    let firstWeekDates = {}

    let week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    week.forEach((day, index) => {
        let tempDate = new Date(firstMondayDate);
        tempDate.setDate(firstMondayDate.getDate() + index);
        firstWeekDates[day] = tempDate;
    });


    let csvArray = [];

    let semesterLength = +timetableData.semesterInfo.semesterLength;
    let addedDays = 0;
    for (let i = 0; i < semesterLength; i++) {
        for (let classInfo of timetableData.classInfos) {
            let csvEntry = {};

            csvEntry["Subject"] = classInfo.eventSubject;

            let dayDate = new Date(firstWeekDates[classInfo.day]); // gets the date of current day (first week)
            dayDate.setDate(dayDate.getDate() + addedDays) // add days to it according to what week is it now
            csvEntry["Start Date"] = dayDate.toISOString().split("T")[0];
            csvEntry["End Date"] = csvEntry["Start Date"];
            csvEntry["All Day Event"] = "False"

            csvEntry["Start Time"] = classInfo.startTime;
            csvEntry["End Time"] = classInfo.endTime;

            csvArray.push({...csvEntry})
        }

        addedDays += 7;
    }

    
    let header = Object.keys(csvArray[0]);
    let rows = csvArray.map(row => header.map(header => row[header]).join(','));
    let csvString = [header.join(','), ...rows].join('\n')
    
    downloadCSVFile(csvString);
}

function downloadCSVFile(csvString) {
    let exportAlertDiv = document.getElementsByClassName("export-alert")[0];
    
    try {
        let blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.href = url;
        a.download = "timetable.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        let successMessage = "File successfully downloaded! Please check your download section and follow the last few steps.";
        createAlertText(exportAlertDiv, successMessage, "alert-success");
    }
    
    catch (err) {
        let errorMessage = "An error has occured. Please try again.";
        createAlertText(exportAlertDiv, errorMessage, "alert-danger");
        console.error("An error has occured.", err);
    }
}