// Centralised configs for parsing, edit here if official timetable HTML changes.
// REMEMBER to change the comments on ASSUMPTIONS for the functions if configs are edited. 
const CLASSNAMES = {
    timetableTable: "tbltimetable",
    courseTable: "tblnoborder",
    dayHeader: "day",
    unitCell: "unit"
};
const TIMETABLE = {
    startHour: 7,
    periodDuration: 0.5
};


/**
 * @param {string} HTMLInput - Raw HTML string copied from UTAR timetable page.
 * 
 * @returns {{
 *  classInfos: Array<{
 *      classLocation: string,
 *      day: string,
 *      courseCode: string,
 *      classType: string,
 *      classGroup: string,
 *      startTime: string,
 *      endTime: string
 *  }>,
 *  courseNames: {[courseCode: string]: string }    // maps courseCode -> courseName.
 * } | {
 *  error: string
 * }}
 * - On success: returns object with properties 'classInfos' and 'courseNames'
 * - On failure: returns object with 'error' describing what went wrong.
 */

export default function parseTimetableHTML(HTMLInput) {
    let parser = new DOMParser();
    let parsedDocument = parser.parseFromString(HTMLInput, 'text/html');

    // Stops the parsing code if important HTML classes or tags used in the timetable cannot be found. 
    let timetable = parsedDocument.getElementsByClassName(CLASSNAMES.timetableTable)[0];
    let courseTable = parsedDocument.getElementsByClassName(CLASSNAMES.courseTable)[0];
    if (!timetable || !courseTable) {
        return { error: "Could not detect timetable. Make sure you have pasted the correct UTAR timetable webpage."};
    }

    let days = timetable.getElementsByClassName(CLASSNAMES.dayHeader);
    if (days.length === 0) {
        return { error: "No days in timetable found. The timetable's HTML design may have been changed."};
    }
    let units = timetable.getElementsByClassName(CLASSNAMES.unitCell);
    if (units.length === 0) {
        return { error: "No classes/units found in timetable. The timetable's HTML design may have changed, or you have no classes at all."}
    }

    // Proceed if everything is fine.
    try {
        let classInfos = extractTimetableData(parsedDocument);
        let courseNames = getCourseNames(parsedDocument);
        
        let timetableData = {classInfos, courseNames};
        return timetableData;
    }
    catch (err) {
        console.error("Unknown error has occured:", err);
        return { error: "An unknown error has occured. Please try again."};
    }
}



/* Assumptions:
- The timetable element has class "tbltimetable"
- Each row of the timetable contain a <th> cell with class "day", indicating which day it is.
- Each row of the timetable contains <td> cells with class "unit", which represents classes.

- Each "unit" contains:
    - First child with textContent containing location of the class
    - <span> element with textContent in the EXACT format "COURSECODE(TYPE)(GROUP)"

- UTAR timetable HTML uses a 30-minute grid with each day starting at 7AM 
*/
function extractTimetableData(timetableHTML) {
    let timetable = timetableHTML.getElementsByClassName(CLASSNAMES.timetableTable)[0];
    
    let classInfos = [];

    let dayStartHour = TIMETABLE.startHour;           
    let periodDuration = TIMETABLE.periodDuration;  

    let days = timetable.getElementsByClassName(CLASSNAMES.dayHeader);

    for (let day of days) {
        let tableRow = day.parentElement;
        let tableCells = tableRow.cells;

        let currentPeriod = 0;
        for (let cell of tableCells) {
            if (cell.tagName == "TH") continue; // skips table header
            
            if (!cell.classList.contains(CLASSNAMES.unitCell)) { // skips periods with no class
                currentPeriod += 1;
                continue;
            }
            
            let info = {};
    
            info["classLocation"] = cell.firstChild.textContent.split(" ")[0];
            info["day"] = day.textContent;

            let textInfo = cell.querySelector("span").textContent; 
            let separator = textInfo.indexOf("(");
            info["courseCode"] = textInfo.slice(0, separator);
            info["classType"] = textInfo[separator + 1];
            info["classGroup"] = textInfo.slice(separator + 4, -1);

            let numberPeriods = +(cell.colSpan || 1); // example: if a unit has colspan 3, it lasts 3 periods * 30 min = 1h30min
            info["startTime"] = formatTime(dayStartHour, currentPeriod, periodDuration);
            currentPeriod += numberPeriods;
            info["endTime"] = formatTime(dayStartHour, currentPeriod, periodDuration);

            classInfos.push({...info});
        }
    }

    return classInfos;
}

// Helper function for extractTimetableData, formats time in 24h format
function formatTime(dayStartHour, currentPeriod, periodDuration) {
    let currentTime = dayStartHour + (currentPeriod * periodDuration);
    let hour = Math.trunc(currentTime);
    let minute = (currentTime % 1) * 60;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`; 
}



/* Assumptions: 
- The table element containing Course Code and Course Name data has class "tblnoborder" and has a tbody.
- Table headers => No. , Course Code , Course Name , Paper Type
- Thus, index 1 and 2 will be used to get the desired data, which is to map courseCode to courseName.
*/
function getCourseNames(timetableHTML) {
    let courseTable = timetableHTML.getElementsByClassName(CLASSNAMES.courseTable)[0];
    let tableRows = courseTable.querySelector("tbody").rows;

    let courseNames = {};

    // i = 1 to skip the first row as it is the table header
    for (let i = 1; i < tableRows.length; i++) {
        if (tableRows[i].cells.length === 0) {
            continue;
        }

        let tableCells = tableRows[i].cells;
        let courseCode = tableCells[1].querySelector("a").textContent;
        let courseName = tableCells[2].textContent;
        courseNames[courseCode] = courseName;
    }

    return courseNames;
}