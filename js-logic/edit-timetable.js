/* edit-timetable.js 
- INPUT: object timetableData
    - timetableData.classInfos: [{"courseCode": "MPU32013", "classLocation": "LDK3", ... }, ...]
    - timetableData.courseNames: {"FHMM1024": "MATHEMATICS II", "FHSC1034": "ORGANIC CHEMISTRY", ...}
*/

import { createAlertText, removeAlertText } from "../js-ui/ui.js";
import Sortable from "https://cdn.jsdelivr.net/npm/sortablejs@latest/modular/sortable.esm.js";

export function renderTimetableEditor(timetableData) {
    hideInitialUI();
    renderEditorTemplate();

    // Creates the UI that allows users to edit timetable/semester data.
    createCourseNameEditor(timetableData);
    createCalendarSubjectToggler(timetableData);
    createSemesterInfoEditor();

    // Creates a method for timetableData object that help writes calendar event subjects.
    createWriteEventMethod(timetableData);

    // Initialise Timetable Preview UI.
    initialiseTimetablePreview(timetableData);

    // Creates a button that validates any input that are still unchecked, then inserts them into timetableData.
    // After that, allows user to proceed to the Exporting step.
    createSubmitButton(timetableData);
}



// Hides away the instructions and HTML input field.
function hideInitialUI() {
    let infoDisplay = document.getElementsByClassName("info-display")[0];
    let dataInput = document.getElementsByClassName("data-input")[0];
    let sections = [infoDisplay, dataInput];

    let transitionsDone = 0;
    for (let section of sections) {
        section.classList.remove("show");
        section.addEventListener("transitionend", () => {
            section.classList.add("d-none");
            transitionsDone++;
            
            if (transitionsDone === sections.length) {
                window.scrollTo({ top: 0, behavior: "smooth"});
            }
        }, { once: true });
    }
}



// Clones the timetable editor template to the HTML.
function renderEditorTemplate() {
    let editTimetableDiv = document.getElementsByClassName("data-edit")[0];
    editTimetableDiv.innerHTML = "";

    let editorTemplate = document.getElementById("data-edit-template");
    editTimetableDiv.appendChild(editorTemplate.content.cloneNode(true));
}



// Creates a table element that contains course code and name info for viewing.
// Also allows users to edit/save their own custom course names that they desire.
// It will also change the names in timetableData.courseNames with user's input and thus update timetable preview.
function createCourseNameEditor(timetableData) {
    let editNameDiv = document.getElementsByClassName("edit-course-name")[0];

    let courseNameTable = document.createElement("table");
    courseNameTable.classList.add("table", "table-striped", "border", "table-rounded");

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
    
    editNameDiv.appendChild(courseNameTable);
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


    // below code is for <td> elements only
    // adding text wraps to <td> containing coursenames so that overly long inputs wont overflow container
    tableRow.cells[1].classList.add("text-wrap");

    // create action button for users to edit/save course names
    let editButton = document.createElement("button");
    editButton.classList.add("btn", "btn-outline-light");
    editButton.textContent = "Edit";

    editButton.addEventListener("click", () => {
        let editNameDiv = document.getElementsByClassName("edit-course-name")[0]; // for sending alerts if input wrong
        let editingCell = tableRow.cells[1];

            if (editButton.textContent === "Edit") {
                let currentCourseName = editingCell.textContent;

                editingCell.textContent = "";
                let inputField = document.createElement("input");
                inputField.classList.add("form-control");
                inputField.type = "text"
                inputField.value = currentCourseName;
                editingCell.appendChild(inputField)
                
                editButton.textContent = "Save";
                removeAlertText(editNameDiv);
            }

        else {
            let courseCode = tableRow.cells[0].textContent;

            // overwrite name for front-end HTML viewing, dont allow blank inputs
            let input = editingCell.querySelector("input");
            let newName = input.value.trim().toUpperCase();

            if (newName === "" || newName.length > 100) {
                newName = timetableData.courseNames[courseCode];

                let alertText = "Course name cannot be blank / exceed 100 characters.";
                createAlertText(editNameDiv, alertText, "alert-danger");
            }

            editingCell.textContent = newName;
            editButton.textContent = "Edit"

            // overwrite current name inside of timetableData.courseNames
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
- Creates a HTML list element that displays items to be included or not by user in the calendar event subjects.
- Creates two new properties for timetableData: 
    - subjectItemsStatus is an object that have the item ids as keys and checked status as values
    - subjectItemOrder is an array containing the order of the item ids.

- Users can check/uncheck the items to decide whether or not to put them inside of the subjects, 
  which updates timetable preview and timetableData.subjectItemsStatus
- Users can also drag the items to change the order of the content in the subjects, 
  which updates timetable preview and timetableData.subjectItemsOrder 
*/
function createCalendarSubjectToggler(timetableData) {
    let editCalendarSubjectDiv = document.getElementsByClassName("edit-calendar-subject")[0];

    // create new properties for timetableData
    timetableData["subjectItemsStatus"] = {};
    timetableData["subjectItemsOrder"] = [];

    // create the HTML list
    let subjectItemsList = document.createElement("ul");
    subjectItemsList.classList.add("list-group");

    let subjectItemsId = ["course-code", "course-name", "class-type", "class-group", "class-location"];
    let subjectItemsDescription = ["Course Code", "Course Name", "Class Type", "Class Group", "Class Location"];
    
    subjectItemsId.forEach((id, index) => {
        let item = document.createElement("li");
        item.classList.add("list-group-item");
        
        // creating the input checkbox form
        let checkboxInput = document.createElement("input");
        checkboxInput.classList.add("form-check-input", "me-2");
        checkboxInput.type = "checkbox";
        checkboxInput.id = id;
        checkboxInput.checked = true;
        item.appendChild(checkboxInput);

        let labelCheckbox = document.createElement("label");
        labelCheckbox.classList.add("form-check-label", "main-body-text");
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
                let alertText = "You must have at least one item checked.";
                createAlertText(subjectItemsList, alertText, "alert-danger");

                e.target.checked = true;
            }
            else {
                removeAlertText(subjectItemsList);

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

    editCalendarSubjectDiv.appendChild(subjectItemsList);
}

// Helper function for createCalendarSubjectToggler
// Tracks the order of the calendar subject items by querying the div.
// Triggered when user drag/drop the items. New order is updated to timetableData.subjectItemsOrder
function updateItemsOrder(timetableData) {
    let subjectEditorDiv = document.getElementsByClassName("edit-calendar-subject")[0];
    let subjectItems = subjectEditorDiv.querySelectorAll("input");

    timetableData["subjectItemsOrder"] = [];
    Array.from(subjectItems).forEach(subjectItem => {
        timetableData["subjectItemsOrder"].push(subjectItem.id);
    });
}



// Creates two input fields that allow users to input relevant semester infos.
// Validity of the input will be checked at the end, when the user presses the complete edit button.
function createSemesterInfoEditor() {
    let editSemesterInfoDiv = document.getElementsByClassName("edit-semester-info")[0];

    // create the input field for users to input their semester start date
    let startDateLabel = document.createElement("label");
    startDateLabel.classList.add("form-label", "main-body-text");
    startDateLabel.htmlFor = "start-date-input";
    startDateLabel.textContent = "Enter Date of the Semester's Week 1 Monday:"
    editSemesterInfoDiv.appendChild(startDateLabel);

    let startDateInput = document.createElement("input");
    startDateInput.classList.add("form-control");
    startDateInput.id = "start-date-input";
    startDateInput.type = "date";
    editSemesterInfoDiv.appendChild(startDateInput);

    editSemesterInfoDiv.appendChild(document.createElement("br"));

    // create the input field for users to input their number of weeks (duration) of semester
    let semesterLengthLabel = document.createElement("label");
    semesterLengthLabel.classList.add("form-label", "main-body-text");
    semesterLengthLabel.htmlFor = "semester-length-input";
    semesterLengthLabel.textContent = "Enter Duration of Semester (in weeks): "
    editSemesterInfoDiv.appendChild(semesterLengthLabel);

    let semesterLengthInput = document.createElement("input");
    semesterLengthInput.classList.add("form-control");
    semesterLengthInput.id = "semester-length-input";
    semesterLengthInput.type = "number";
    editSemesterInfoDiv.appendChild(semesterLengthInput);
}



// Creates a new method for timetableData. This method helps write subject for calendar events.
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
        events.id = `${day.toLowerCase()}-events`; // id is dynamically generated so that later program can remove days with no events via the same way but reversed.
        dayRow.append(events);

        previewTimetableDiv.appendChild(dayRow);
    }

    // Iterates over classInfos to create calendar events, and append them to their respective day divs.
    timetableData.classInfos.forEach((classInfo, index) => { 
        let calendarEventDiv = document.createElement("div");
        calendarEventDiv.classList.add("calendar-event");

        let eventSubject = document.createElement("p");
        eventSubject.classList.add("event-subject");
        eventSubject.id = `event-${index}`; // this id is dynamically generated using index of classInfos so that it can be accessed the same way later.
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



// The final part of edit-timetable.js 
// If there is no problems with user inputs, let them proceed to the Exporting section.
function createSubmitButton(timetableData) {
    let submitDiv = document.getElementsByClassName("submit-edit")[0];

    let submitButton = document.createElement("button");
    submitButton.classList.add("btn", "main-text-btn", "fs-5");
    submitButton.textContent = "Finish Editing";

    submitButton.addEventListener("click", () => {
        if (validateSemesterInfo(timetableData) === true) {
            console.log("Step done. Now continue to Exporting step"); // TODO
        }
    });

    submitDiv.appendChild(submitButton);
}

// Helper function for createSubmitButton for validating inputs by user in Edit Semester Info section.
// If all inputs are valid, adds/updates property semesterInfo to timetableData and returns true.
// Object semesterInfo contains the information text as keys and their respective data as values.
function validateSemesterInfo(timetableData) {
    let editSemesterInfoDiv = document.getElementsByClassName("edit-semester-info")[0];
    let startDate = document.getElementById("start-date-input").value;
    let semesterLength = document.getElementById("semester-length-input").value;

    let startDateAlert = "";
    let semesterLengthAlert = "";

    if (!startDate || isNaN(Date.parse(startDate))) {
        startDateAlert = "Invalid date.";
    }
    else if (new Date(startDate).getDay() != 1) {
        startDateAlert = "Date is not Monday.";
    }

    if (!semesterLength || !Number.isFinite(+semesterLength)) {
        semesterLengthAlert = "Invalid format for duration.";
    }
    else if (+semesterLength <= 0 || +semesterLength > 30 || !Number.isInteger(+semesterLength)) {
        semesterLengthAlert = "Duration must be an integer and in the range of 1 to 30.";
    }

    
    if (startDateAlert === "" && semesterLengthAlert === "") {
        // create the new property for timetableData
        timetableData["semesterInfo"] = {};
        timetableData.semesterInfo["startDate"] = startDate;
        timetableData.semesterInfo["semesterLength"] = semesterLength;

        removeAlertText(editSemesterInfoDiv);
        return true;
    }
    else {
        let alertText = (startDateAlert + " " + semesterLengthAlert).trim()
        createAlertText(editSemesterInfoDiv, alertText, "alert-danger");
        return false;
    }
}