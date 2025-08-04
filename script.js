function parseHTML() {
    let htmlInput = document.getElementById("html-input").value;

    let parser = new DOMParser();
    let parsedDocument = parser.parseFromString(htmlInput, 'text/html');

    return extractTimetableData(parsedDocument);
}

function extractTimetableData(timetableHTML) {
    let timetables = timetableHTML.getElementsByClassName("tbltimetable");
    let visualTimetable = timetables[0]; // mainly used to extract the room number of each class
    let textTimetable = timetables[1]; // used to extract the all the remaining data of each class

    // the code chunk below maps the room number to its lesson type, which is mapped to its course code
    let days = visualTimetable.getElementsByClassName("day");
    let courseRooms = {};

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

            if (!(courseCode in courseRooms)) {
                courseRooms[courseCode] = {};
            }

            courseRooms[courseCode][lessonType] = lessonRoom;
        }
    }

    // the code chunk below now gets all the remaining datas of a class period, bundles them in an object and appends them to a list
    let courseTableRows = textTimetable.querySelectorAll("tr");
    let courseTableHeaders = ["number", "courseCode", "courseName", "lessonType", "classGroup", "attendance", "day", "time", 'hours'];
    let courseSchedules = [];

    for (let i = 1; i < courseTableRows.length; i++) {
        let courseDatas = courseTableRows[i].querySelectorAll("td");
        let rowSpanLength = +courseDatas[0].getAttribute("rowspan");

        if (rowSpanLength > 1) {
            // populate shared data list, puts empty string if its not shared
            let sharedDatas = Array.from(courseDatas).map((value) => (
                (+value.getAttribute("rowspan") === rowSpanLength) ? value : ""
            ))

            // begin transferring the data to the main array for storage
            for (let j = i; j < i + rowSpanLength; j++) {
                let uniqueDatas = courseTableRows[j].querySelectorAll("td:not([rowspan])");
                let unique_ptr = 0;

                let schedule = Object.fromEntries(
                    courseTableHeaders.map((header, index) => (
                        (sharedDatas[index] === "") 
                            ? [header, extractInnerHTML(uniqueDatas[unique_ptr++])] 
                            : [header, extractInnerHTML(sharedDatas[index])]
                    ))
                )
                courseSchedules.push(schedule);
            }
            
            // to sync the iterator again after repeated looping
            i += rowSpanLength - 1;
        }
            
        else {
            let schedule = {};
            for (let k = 0; k < courseDatas.length; k++) {
                schedule[courseTableHeaders[k]] = extractInnerHTML(courseDatas[k]);
            }
            courseSchedules.push(schedule);
        }
    }

    // enrich the data with their respective room location
    for (let courseSchedule of courseSchedules) {
        courseSchedule["roomNumber"] = courseRooms[courseSchedule.courseCode]?.[courseSchedule.lessonType] ?? "N/A";
    }

    
    // debugging purposes
    for (schedule of courseSchedules) {
        console.log(schedule);
    }
}

function extractInnerHTML(data) {
    return data.querySelector('a')?.innerHTML ?? data.innerHTML;
}