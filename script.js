function parseHTML() {
    let htmlInput = document.getElementById("html-input").value;

    let parser = new DOMParser();
    let parsedDocument = parser.parseFromString(htmlInput, 'text/html');

    return getTimetableData(parsedDocument);
}

function getTimetableData(timetableHTML) {
    let timetables = timetableHTML.getElementsByClassName("tbltimetable");
    let visualTimetable = timetables[0]; // mainly used to extract the room number of the class
    let textTimetable = timetables[1]; // used to extract the rest of the data

    // the code below maps the room number to its lesson type, which is mapped to its course code
    let days = visualTimetable.getElementsByClassName("day");
    let coursesRoomNumber = {};

    for (let day of days) {
        let lessons = day.parentElement.getElementsByClassName("unit");
        
        for (let lesson of lessons) {
            let lessonInfos = String(lesson.querySelector("#unit").innerHTML);
            let indexDelimiter = lessonInfos.indexOf("(");

            if (indexDelimiter === -1) {
                continue;
            }

            let courseCode = lessonInfos.slice(0, indexDelimiter);
            let lessonType = lessonInfos[indexDelimiter + 1];
            let lessonRoom = String(lesson.firstChild.data);

            if (!(courseCode in coursesRoomNumber)) {
                coursesRoomNumber[courseCode] = {};
            }

            coursesRoomNumber[courseCode][lessonType] = lessonRoom;
        }
    }

    // the code below now gets all the relevant datas of a class period, bundles them in an object and appends them to a list
    let coursesRow = textTimetable.querySelectorAll("tr");
    let coursesCleansedRow = [];

    for (let i = 1; i < coursesRow.length; i++) {
        let courseData = coursesRow[i].querySelectorAll("td");

        rowSpan = +courseData[0].getAttribute("rowspan");
        if (rowSpan > 1) {   // Have row Spanning condition
            let cleansedRow = {}
            let savedCourseCode = (cleansedRow["courseCode"] = courseData[1].querySelector("a").innerHTML);
            let savedCourseName = (cleansedRow["courseName"] = courseData[2].innerHTML);
            let savedClassType = (cleansedRow["classType"] = courseData[3].innerHTML);
            let savedClassGroup = (cleansedRow["classGroup"] = courseData[4].innerHTML);
            cleansedRow["day"] = courseData[6].innerHTML;
            cleansedRow["time"] = courseData[7].innerHTML;
            coursesCleansedRow.push(cleansedRow);

            for (let j = i+1; j < i+rowSpan; j++) {
                let courseData = coursesRow[j].querySelectorAll("td");
                let cleansedRow = {}

                cleansedRow["courseCode"] = savedCourseCode;
                cleansedRow["courseName"] = savedCourseName;
                cleansedRow["classType"] = savedClassType;
                cleansedRow["classGroup"] = savedClassGroup;
                cleansedRow["day"] = courseData[0].innerHTML;
                cleansedRow["time"] = courseData[1].innerHTML;
                coursesCleansedRow.push(cleansedRow);
            }

            i += rowSpan - 1;
            continue;
        }

        else {    // No row spanning condition
            let cleansedRow = {}
            cleansedRow["courseCode"] = courseData[1].querySelector("a").innerHTML;
            cleansedRow["courseName"] = courseData[2].innerHTML;
            cleansedRow["classType"] = courseData[3].innerHTML;
            cleansedRow["classGroup"] = courseData[4].innerHTML;
            cleansedRow["day"] = courseData[6].innerHTML;
            cleansedRow["time"] = courseData[7].innerHTML;
            coursesCleansedRow.push(cleansedRow);
        }
    }

    // enrich rows with their respective locations
    for (let courseCleansedRow of coursesCleansedRow) {
        let courseCode = courseCleansedRow["courseCode"];
        let classType = courseCleansedRow["classType"];
        
        if (classType in coursesRoomNumber[courseCode]) {
            courseCleansedRow["roomNumber"] = coursesRoomNumber[courseCode][classType];
        }
        else {
            courseCleansedRow["roomNumber"] = "";
        }
    }

    for (let course of coursesCleansedRow) {
        console.log(course);
    }
}