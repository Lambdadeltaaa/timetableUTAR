/* edit-timetable.js 
- INPUT: object timetableData
- timetableData.classInfos: array of lessons (objects), these lessons contains info s.a. time as keys and their data as values.
- timetableData.courseNames: an object that containing course codes as keys and course names as values
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


    // creates a method that help writes calendar event subject for timetableData object.
    createWriteEventMethod(timetableData);

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

                editingCell.textContent = "";
                let inputField = document.createElement("input");
                inputField.type = "text"
                inputField.classList.add("edit-name-input");
                inputField.value = currentCourseName;
                editingCell.appendChild(inputField)
                
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



/*
- Creates a HTML list element that displays items to be included or not by user in the calendar event subjects
- Creates two new properties for timetableData: 
    - subjectItemsStatus is an object that have the item ids as keys and checked status as values
    - subjectItemOrder is an array containing the order of the item ids.

- Users can check/uncheck the items to decide whether or not to put them inside of the subjects, 
  which updates timetable preview and timetableData.subjectItemsStatus
- Users can also drag the items to change the order of the content in the subjects, 
  which updates timetable preview and timetableData.subjectItemsOrder 
*/
function createCalendarSubjectToggler(timetableData) {
    let subjectItemsId = ["course-code", "course-name", "class-type", "class-group", "class-location"];
    let subjectItemsDescription = ["Course Code", "Course Name", "Class Type", "Class Group", "Class Location"];

    // create new properties for timetableData
    timetableData["subjectItemsStatus"] = {};
    timetableData["subjectItemsOrder"] = [];

    // create the HTML list
    let subjectItemsList = document.createElement("ul");
    subjectItemsList.classList.add("subject-items-list")
    
    subjectItemsId.forEach((id, index) => {
        let item = document.createElement("li");
        
        // creating the input checkbox form
        let checkboxInput = document.createElement("input");
        checkboxInput.type = "checkbox";
        checkboxInput.id = id;
        checkboxInput.checked = true;
        item.appendChild(checkboxInput);

        item.appendChild(document.createTextNode(" "));

        let labelCheckbox = document.createElement("label");
        labelCheckbox.htmlFor = id;
        labelCheckbox.textContent = subjectItemsDescription[index];
        item.appendChild(labelCheckbox);

        // populate newly generated properties of timetableData
        timetableData["subjectItemsStatus"][id] = true;
        timetableData["subjectItemsOrder"].push(id);
    
        // prevents user from checking no items, if no problems then updates the timetable preview and timetableData.subjectItemsStatus.
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
                timetableData["subjectItemsStatus"][e.target.id] = e.target.checked;
                updateTimetablePreview(timetableData);
            }
        });

        subjectItemsList.appendChild(item);
    });

    // enable drag and drop reordering to modify timetable preview and timetableData.subjectItemsOrder, imported from Sortable.js
    new Sortable(subjectItemsList, {
        animation: 150,
        ghostClass: "blue-background-class",
        onEnd: () => {updateItemsOrder(timetableData); updateTimetablePreview(timetableData);}
    });

    return subjectItemsList;
}

// Helper function for createCalendarSubjectToggler
// Tracks the order of the calendar subject items by querying the div.
// Triggered when user drag/drop the items.
function updateItemsOrder(timetableData) {
    let subjectEditor = document.getElementsByClassName("edit-calendar-subject")[0];
    let subjectItems = subjectEditor.querySelectorAll("input");

    timetableData["subjectItemsOrder"] = [];
    Array.from(subjectItems).forEach(subjectItem => {
        timetableData["subjectItemsOrder"].push(subjectItem.id);
    });
}



// Creates a new method for timetableData. 
// Used by {initialise/update}TimetablePreview and can be used in exporting CSV.
// Queries this.subjectItemsOrder, containing the id of items to be wrote in subject in order.
// Checks with this.subjectItemsStatus, append the corresponding item data into the subject if user checked it.
function createWriteEventMethod(timetableData) {
    timetableData["writeEventSubject"] = function (classInfo) {
        let courseNames = this.courseNames;
        let classTypeMap = {"L": "LECTURE", "P": "PRACTICAL", "T": "TUTORIAL"};

        let timetableFieldMap = {
            "course-code": classInfo.courseCode, 
            "course-name": courseNames[classInfo.courseCode], 
            "class-type": classTypeMap[classInfo.classType], 
            "class-group": `(GROUP ${classInfo.classGroup})`, 
            "class-location": classInfo.classLocation
        };

        let subjectItemsStatus = this.subjectItemsStatus;
        let subjectItemsOrder = this.subjectItemsOrder;

        let textContent = "";
        for (let subjectItem of subjectItemsOrder) {
            if (subjectItemsStatus[subjectItem] === true) textContent += `${timetableFieldMap[subjectItem]} `
        }

        return textContent.trim();
    };
}



// Builds the DIV that shows the timetable preview.
// Loops over timetableData.classInfos to build calendar events div blocks.
// Each calendar events contains calendar subjects and calendar time.
function initialiseTimetablePreview(timetableData) {
    let previewTimetableDiv = document.getElementsByClassName("preview-timetable")[0];

    let previewTimetableHeader = document.createElement("h4");
    previewTimetableHeader.textContent = "Timetable Preview:";
    previewTimetableDiv.appendChild(previewTimetableHeader);

    // Creates rows that groups each calendar events with their respective day.
    let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (let day of days) {
        let dayRow = document.createElement("div");
        dayRow.classList.add("row", "day-row");

        let label = document.createElement("div");
        label.classList.add("col-2", "day-row-label");
        let labelText = document.createElement("p");
        labelText.textContent = `${day}`;
        label.appendChild(labelText);
        dayRow.append(label);

        let events = document.createElement("div");
        events.classList.add("col-10", "day-row-events");
        events.id = `${day.toLowerCase()}-events`;
        dayRow.append(events);

        previewTimetableDiv.appendChild(dayRow);
    }

    // Iterates over classInfos to create calendar events, and append them to their respective day divs.
    timetableData.classInfos.forEach((classInfo, index) => { 
        let calendarEventDiv = document.createElement("div");
        calendarEventDiv.classList.add("calendar-event");

        let eventSubject = document.createElement("p");
        eventSubject.classList.add("event-subject");
        eventSubject.id = `event-${index}`;
        eventSubject.textContent = timetableData.writeEventSubject(classInfo);
        calendarEventDiv.appendChild(eventSubject);

        let eventTime = document.createElement("p");
        eventTime.classList.add("event-time");
        eventTime.textContent = `${classInfo.startTime} - ${classInfo.endTime}`;
        calendarEventDiv.appendChild(eventTime);

        let eventDay = classInfo.day;
        let dayEventsRow = document.getElementById(`${eventDay.toLowerCase()}-events`);
        dayEventsRow.append(calendarEventDiv);
    });

    // Deletes any day rows that are empty (no events)
    let eventRows = document.getElementsByClassName("day-row-events");
    Array.from(eventRows).forEach(eventRow => {
        if (eventRow.childElementCount === 0) {
            eventRow.parentElement.remove();
        }
    });
}

// Updates the subject text of each event whenever an user modification is identified.
function updateTimetablePreview(timetableData) {
    timetableData.classInfos.forEach((classInfo, index) => {
        let eventSubjectId = `event-${index}`;
        let eventSubject = document.getElementById(eventSubjectId);
        eventSubject.textContent = timetableData.writeEventSubject(classInfo);
    });
}