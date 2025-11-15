submitHTMLButton = document.getElementById("html-submit");
submitHTMLButton.addEventListener("click", parseHTML);

function parseHTML() {
    let htmlInput = document.getElementById("html-input").value;

    let parser = new DOMParser();
    let parsedDocument = parser.parseFromString(htmlInput, 'text/html');

    extractTimetableData(parsedDocument);
}


// Assumptions:
// The timetable element has class "tbltimetable"
// Each row of the timetable contain a <th> cell with class "day", indicating which day it is.
// Each row of the timetable contains <td> cells with class "unit", which represents classes.
// Each "unit" contains:
//     - First child with textContent containing location of the class
//     - <span> element with textContent in the EXACT format "COURSECODE(TYPE)(GROUP)"
function extractTimetableData(timetableHTML) {
    let timetable = timetableHTML.getElementsByClassName("tbltimetable")[0];
    let classInfos = [];

    // UTAR timetable HTML uses a 30-minute grid with each day starting at 7AM
    let dayTime = 7;           
    let periodDuration = 0.5;  

    let courseNames = getCourseNames(timetableHTML);
    let days = timetable.getElementsByClassName("day");

    for (let day of days) {
        let tableRow = day.parentElement;
        let tableCells = tableRow.cells;

        let currentPeriod = -1; // Starts at -1 because the table header is counted in the cells
        for (let cell of tableCells) {
            if (!cell.classList.contains("unit")) {
                currentPeriod += 1;
                continue;
            }
            
            let info = {};
    
            info["classLocation"] = cell.firstChild.textContent;
            info["day"] = day.textContent;

            let textInfo = cell.querySelector("span").textContent; 
            let separator = textInfo.indexOf("(");
            info["courseCode"] = textInfo.slice(0, separator);
            info["courseName"] = courseNames[info["courseCode"]];
            info["classType"] = textInfo[separator + 1];
            info["classGroup"] = textInfo.slice(separator + 4, -1);

            let numberPeriods = +cell.colSpan;
            info["duration"] = (numberPeriods * periodDuration).toFixed(1);

            info["startTime"] = formatTime(dayTime, currentPeriod, periodDuration);
            currentPeriod += numberPeriods;
            info["endTime"] = formatTime(dayTime, currentPeriod, periodDuration);

            classInfos.push({...info});
        }
    }

    console.log(classInfos);
}

// Helper function for extractTimetableData
// Format time in 24h format
function formatTime(dayTime, currentPeriod, periodDuration) {
    let currentTime = dayTime + (currentPeriod * periodDuration);
    let hour = Math.trunc(currentTime);
    let minute = (currentTime % 1) * 60;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// Helper function for extractTimetableData
// Assumption: The table element containing Course Code and Course Name data has class "tblnoborder"
function getCourseNames(timetableHTML) {
    let courseTable = timetableHTML.getElementsByClassName("tblnoborder")[0];
    let tableRows = courseTable.querySelector("tbody").rows;

    let courseNames = {};

    // i = 1 to skip the first row as it is the table header
    for (let i = 1; i < tableRows.length; i++) {
        if (tableRows[i].cells.length === 0) {
            continue;
        }

        // Table headers => No. , Course Code , Course Name , Paper Type
        // Thus, index 1 and 2 are used respectively to get the desired data, which is to map courseCode to courseName.
        let tableCells = tableRows[i].cells;
        let courseCode = tableCells[1].querySelector("a").textContent;
        let courseName = tableCells[2].textContent;
        courseNames[courseCode] = courseName;
    }

    return courseNames;
}