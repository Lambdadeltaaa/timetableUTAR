/**
 * @param {Object} timetableData - The timetable data object.
 * @param {string} format - Export format, e.g., 'csv' or 'ical'.
 * 
 * @returns {{success: string} | {error: string}} Returns an object with either a 'success' or 'error' message.
 */

export default function exportTimetableData(timetableData, format) {
    const formatsToFunctions = {
        "csv": () => exportAsCSV(formattedData),
    };

    if (!timetableData || !timetableData.classInfos || !timetableData.courseNames) {
        return {error: "Timetable data not found."}
    }

    if (!(Object.keys(formatsToFunctions).includes(format.toLowerCase()))) {
        return {error: "Invalid export file format. Please choose another option"};
    }


    // preparing some useful info for formatting
    for (let classInfo of timetableData.classInfos) {
        classInfo["eventSubject"] = timetableData.writeEventSubject(classInfo);
    }

    const firstMondayDate = new Date(timetableData.semesterInfo.startDate);
    const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    let firstWeekDates = {};
    week.forEach((day, index) => {
        let tempDate = new Date(firstMondayDate);
        tempDate.setDate(firstMondayDate.getDate() + index);
        firstWeekDates[day] = tempDate;
    });


    // begin the data formatting
    let formattedData = [];

    const semesterLength = +timetableData.semesterInfo.semesterLength;
    let addedDays = 0;
    for (let i = 0; i < semesterLength; i++) {
        for (let classInfo of timetableData.classInfos) {
            let row = {};

            row["Subject"] = classInfo.eventSubject;

            let dayDate = new Date(firstWeekDates[classInfo.day]); // gets the date of current day (first week)
            dayDate.setDate(dayDate.getDate() + addedDays) // add days to it according to what week is it now
            row["Start Date"] = dayDate.toISOString().split("T")[0];
            row["End Date"] = row["Start Date"];
            row["All Day Event"] = "False"

            row["Start Time"] = classInfo.startTime;
            row["End Time"] = classInfo.endTime;

            formattedData.push({...row})
        }

        addedDays += 7;
    }

    // go to their specific function based on which file format user selected
    return formatsToFunctions[format.toLowerCase()]();
}



function exportAsCSV(formattedData) {
    const header = Object.keys(formattedData[0]);
    const rows = formattedData.map(row => header.map(header => row[header]).join(','));
    const csvString = [header.join(','), ...rows].join('\n')

    try {
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "timetable.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return {"success": "File successfully downloaded! Please check your download section and follow the last few steps."};
    }
    
    catch (err) {
        console.error("An error has occured", err);
        return {error: "An error has occured. Please try again."};
    }
}