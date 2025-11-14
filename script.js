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

    classLocations = extractRoomNumber(graphicalTimetable);
}

// Helper function for extractTimetableData.
// Extract the room location for each of the class that the user have.
function extractRoomNumber(graphicalTimetable) {
    classUnits = graphicalTimetable.getElementsByClassName("unit");
    classLocations = {};

    for (let i = 0; i < classUnits.length; i++) {
        console.log(classUnits[i].firstChild);
    }
}