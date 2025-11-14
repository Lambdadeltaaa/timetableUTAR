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
    console.log(classLocations);
}

// Helper function for extractTimetableData.
// Extract the room location for each of the class that the user have.
function extractRoomLocation(graphicalTimetable) {
    let classUnits = graphicalTimetable.getElementsByClassName("unit");
    let classLocations = {};

    for (let classUnit of classUnits) {
        let textInfo = classUnit.querySelector("span").innerHTML;
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