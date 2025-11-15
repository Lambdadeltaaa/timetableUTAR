submitHTMLButton = document.getElementById("html-submit");
submitHTMLButton.addEventListener("click", parseHTML);

function parseHTML() {
    let htmlInput = document.getElementById("html-input").value;

    let parser = new DOMParser();
    let parsedDocument = parser.parseFromString(htmlInput, 'text/html');

    return extractTimetableData(parsedDocument);
}



function extractTimetableData(timetableHTML) {
    timetables = timetableHTML.getElementsByClassName("tbltimetable");
    graphicalTimetable = timetables[0];
    tabularTimetable = timetables[1];

    classLocations = extractRoomLocation(graphicalTimetable);
    classInfos = extractRemainingInformation(tabularTimetable);
    
    // enrich classInfos with their respective class locations
    for (let i = 0; i < classInfos.length; i++) {
        classInfos[i]["roomLocation"] = classLocations[classInfos[i]["courseCode"]][classInfos[i]["classType"]];
    }

    console.log(classInfos);
}

// Helper function for extractTimetableData.
// Extract the room location for each of the class that the user have.
function extractRoomLocation(graphicalTimetable) {
    let classUnits = graphicalTimetable.getElementsByClassName("unit");
    let classLocations = {};

    for (let classUnit of classUnits) {
        let textInfo = classUnit.querySelector("span").innerHTML; // contains course code and class type
        let separator = textInfo.indexOf("(");

        let courseCode = textInfo.slice(0, separator);
        let classType = textInfo[separator + 1];
        let roomNumber = classUnit.firstChild.textContent;

        if (!classLocations[courseCode]) {
            classLocations[courseCode] = {};
        }

        classLocations[courseCode][classType] = roomNumber;
    }

    return classLocations;
}

// Helper function for extractTimetableData.
// Extract the remaining important infos for each of the class that the user have.
function extractRemainingInformation(tabularTimetable) {
    let tableRows = tabularTimetable.querySelector("tbody").rows;

    let infoHeaders = ["number", "courseCode", "name", "classType", "classGroup", "attendance", "day", "time", "duration"];
    let classInfos = [];

    // i = 1 to skip the header
    for (let i = 1; i < tableRows.length; i++) {
        let tableCells = tableRows[i].cells;
        let rowspan = tableCells[0].rowSpan ? +tableCells[0].rowSpan : 1;

        let classInfo = {};
        Array.from(tableCells).forEach((value, index) => {
            let data = value.querySelector("a")?.innerHTML || value.innerHTML;
            classInfo[infoHeaders[index]] = data;
        });
        classInfos.push({...classInfo});

        // multiple rows share same certain values case
        // the remaining rows in the rowspan only have day/time/duration values
        // thus classInfo will be overwritten with these values in a loop
        if (rowspan > 1) {
            for (let j = i + 1; j < i + rowspan; j++) {
                tableCells = tableRows[j].cells;
                classInfo["day"] = tableCells[0].innerHTML;
                classInfo["time"] = tableCells[1].innerHTML;
                classInfo["duration"] = tableCells[2].innerHTML;

                classInfos.push({...classInfo});
            }

            i += (rowspan - 1);
        }
    }

    return classInfos;
}