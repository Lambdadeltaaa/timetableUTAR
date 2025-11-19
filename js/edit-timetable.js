/* object timetableData
timetableData.classInfos: array of lessons (objects), containing informations such as time as keys, and their data as values
timetableData.courseNames: an object with course code as keys, and course name as values
*/

export function renderTimetableEditor(timetableData) {
    // The DIV section for editing course names.
    let editNameDiv = document.getElementsByClassName("edit-course-name")[0];

    let courseNameHeader = document.createElement("h4");
    courseNameHeader.textContent = "Edit Course Name:"
    editNameDiv.appendChild(courseNameHeader);

    let courseNameTable = createNameTable(timetableData)
    editNameDiv.appendChild(courseNameTable);

    // The DIV section for editing calendar subject.
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
// On save, updates new value back to the cell and timetableData.courseNames[courseCode].
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
            editingCell.innerHTML = `<input type="text" value="${currentCourseName}">`;
            editButton.textContent = "Save";
        }
        else {
            // overwrite name for front-end HTML viewing
            let input = editingCell.querySelector("input");
            let newName = input.value.trim();
            editingCell.textContent = newName;
            editButton.textContent = "Edit"

            // overwrite current name inside of timetableData.courseNames
            let courseCode = tableRow.cells[0].textContent;
            timetableData.courseNames[courseCode] = newName;
            console.log(timetableData.courseNames); // debugging purposes
        }
    });

    let buttonCell = document.createElement(cellType);
    buttonCell.appendChild(editButton);
    tableRow.append(buttonCell);

    return tableRow;
}