/* edit-timetable.js 
- INPUT: object timetableData
- timetableData.classInfos: array of lessons (objects), containing informations such as time as keys, and their data as values
- timetableData.courseNames: an object with course code as keys, and course name as values
*/

import Sortable from "https://cdn.jsdelivr.net/npm/sortablejs@latest/modular/sortable.esm.js";

export function renderTimetableEditor(timetableData) {
    // The DIV section for editing course names.
    let editNameDiv = document.getElementsByClassName("edit-course-name")[0];

    let courseNameHeader = document.createElement("h4");
    courseNameHeader.textContent = "Edit Course Name:"
    editNameDiv.appendChild(courseNameHeader);

    let courseNameTable = createNameTable(timetableData)
    editNameDiv.appendChild(courseNameTable);


    // The DIV section for editing calendar subject.
    let editCalendarSubjectDiv = document.getElementsByClassName("edit-calendar-subject")[0];

    let calendarSubject = document.createElement("h4");
    calendarSubject.textContent = "Calendar Subjects Includes:"
    editCalendarSubjectDiv.appendChild(calendarSubject);

    let calendarSubjectToggler = createCalendarSubjectToggler(timetableData);
    editCalendarSubjectDiv.appendChild(calendarSubjectToggler);


    // Initialise Timetable Preview.
    initialiseTimetablePreview(timetableData);
}


// Creates a table element that contains course code and name info for viewing.
// Also allows users to edit/save their own custom course names that they desire.
// It will also change the names in timetableData.courseNames with user's input.
function createNameTable(timetableData) {
    let courseNameTable = document.createElement("table");
    courseNameTable.classList.add("table", "table-striped");

    let tableHeader = document.createElement("thead");
    let headerData = ["Course Code", "Course Name", "Action"];
    let headerRow = createTableRow(headerData, "th", timetableData);
    tableHeader.appendChild(headerRow);
    courseNameTable.appendChild(tableHeader);

    let tableBody = document.createElement("tbody");
    for (let courseCode of Object.keys(timetableData.courseNames)) {
        let bodyData = [courseCode, timetableData.courseNames[courseCode]];
        let bodyRow = createTableRow(bodyData, "td", timetableData);
        tableBody.appendChild(bodyRow);
    }
    courseNameTable.appendChild(tableBody);
    
    return courseNameTable;
}

// Helper function for createNameTable for creating header and body rows of the table.
// For body rows, adds a Edit/Save button for courseName. 
// On save, updates new value back to the cell, timetableData.courseNames[courseCode] and timetable preview.
function createTableRow(rowData, cellType, timetableData) {
    let tableRow = document.createElement("tr");
    
    // create info cells that show course code and name
    for (let data of rowData) {
        let cell = document.createElement(cellType);
        cell.textContent = data;
        tableRow.appendChild(cell);
    }

    // early return since headers doesnt need to be modified
    if (cellType === "th") return tableRow;

    // create action button for users to edit/save course names
    let editButton = document.createElement("button");
    editButton.classList.add("btn", "btn-primary");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => {
        let editingCell = tableRow.cells[1];

        if (editButton.textContent === "Edit") {
            let currentCourseName = editingCell.textContent;
            editingCell.innerHTML = `<input type="text" class="edit-name-input" value="${currentCourseName}">`;
            editButton.textContent = "Save";
        }
        else {
            // overwrite name for front-end HTML viewing
            let input = editingCell.querySelector("input");
            let newName = input.value.trim().toUpperCase();
            editingCell.textContent = newName;
            editButton.textContent = "Edit"

            // overwrite current name inside of timetableData.courseNames
            let courseCode = tableRow.cells[0].textContent;
            timetableData.courseNames[courseCode] = newName;

            // also update timetable preview 
            updateTimetablePreview(timetableData);
        }
    });

    let buttonCell = document.createElement(cellType);
    buttonCell.appendChild(editButton);
    tableRow.append(buttonCell);

    return tableRow;
}


// Creates a list element that contains items to be included in the Subject section of the calendar
// Users can check/uncheck the items to decide whether or not to put them inside of the Subject, which changes timetable preview
// Users can also drag the items to change the order of the content later in the Subject, which changes timetable preview as well
function createCalendarSubjectToggler(timetableData) {
    let subjectItemsId = ["course-code", "course-name", "class-type", "class-group", "class-location"];
    let subjectItemsDescription = ["Course Code", "Course Name", "Class Type", "Class Group", "Class Location"];

    let subjectItemsList = document.createElement("ul");
    subjectItemsList.classList.add("subject-items-list")
    
    subjectItemsId.forEach((id, index) => {
        let item = document.createElement("li");
        
        item.innerHTML = `<input type="checkbox" id="${id}" checked>
                            <label for="${id}">${subjectItemsDescription[index]}</label>`;
    
        // prevents user from checking no items, if no problems then modifys the timetable preview.
        item.addEventListener("change", e => {
            let nodes = subjectItemsList.querySelectorAll("input");
            let somethingChecked = false;

            for (let node of nodes) {
                if (node.checked === true) somethingChecked = true;
            }

            if (!somethingChecked) {
                alert("You must have at least one item checked.");
                e.target.checked = true;
            }
            else {
                updateTimetablePreview(timetableData);
            }
        });

        subjectItemsList.appendChild(item);
    });

    // enable drag and drop reordering to modify timetable preview, imported from Sortable.js
    new Sortable(subjectItemsList, {
        animation: 150,
        ghostClass: "blue-background-class",
        onEnd: () => updateTimetablePreview(timetableData)
    });

    return subjectItemsList;
}


// Builds the DIV that shows the timetable preview.
// Loops over timetableData.classInfos to build calendar events div blocks.
// Each calendar events contains calendar subjects and calendar time.
function initialiseTimetablePreview(timetableData) {
    let previewTimetableDiv = document.getElementsByClassName("preview-timetable")[0];

    let previewTimetableHeader = document.createElement("h4");
    previewTimetableHeader.textContent = "Timetable Preview:";
    previewTimetableDiv.appendChild(previewTimetableHeader);

    timetableData.classInfos.forEach((classInfo, index) => { 
        let calendarEventDiv = document.createElement("div");
        calendarEventDiv.classList.add("calendar-event");

        let eventSubject = document.createElement("p");
        eventSubject.classList.add("event-subject");
        eventSubject.id = `event-${index}`;
        eventSubject.textContent = writeEventSubject(classInfo, timetableData.courseNames);
        calendarEventDiv.appendChild(eventSubject);

        let eventTime = document.createElement("p");
        eventTime.classList.add("event-time");
        eventTime.textContent = `${classInfo.startTime} - ${classInfo.endTime}`;
        calendarEventDiv.appendChild(eventTime);

        previewTimetableDiv.appendChild(calendarEventDiv);
    });
}

// Updates the subject text of each event whenever an user modification is identified.
function updateTimetablePreview(timetableData) {
    timetableData.classInfos.forEach((classInfo, index) => {
        let eventSubjectId = `event-${index}`;
        let eventSubject = document.getElementById(eventSubjectId);
        eventSubject.textContent = writeEventSubject(classInfo, timetableData.courseNames);
    });
}

// Helper function for {initialise/update}TimetablePreview.
// Queries all elements <input> ids in order, contained inside the edit calendar subject div.
// Appends the corresponding classData into subject for all checked inputs.
function writeEventSubject(classInfo, courseNames) {
    let classTypeMap = {
    "L": "LECTURE",
    "P": "PRACTICAL",
    "T": "TUTORIAL"
    };

    let timetableFieldMap = {
        "course-code": classInfo.courseCode, 
        "course-name": courseNames[classInfo.courseCode], 
        "class-type": classTypeMap[classInfo.classType], 
        "class-group": `(GROUP ${classInfo.classGroup})`, 
        "class-location": classInfo.classLocation
    };

    let subjectEditor = document.getElementsByClassName("edit-calendar-subject")[0];
    let subjectItems = subjectEditor.querySelectorAll("input");

    let textContent = ""
    for (let subjectItem of subjectItems) {
        if (subjectItem.checked === true) textContent += `${timetableFieldMap[subjectItem.id]} `;
    }

    return textContent;
}