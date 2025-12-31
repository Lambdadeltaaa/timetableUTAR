/* 
- INPUT: 
    object timetableData
        - timetableData.classInfos: example [{"courseCode": "MPU32013", "classLocation": "LDK3", ... }, ...]
        - timetableData.courseNames: example {"FHMM1024": "MATHEMATICS II", "FHSC1034": "ORGANIC CHEMISTRY", ...}

- OUTPUT:
    IF SUCCESS:
    adds the follow properties and method to object timetableData:
        - timetableData.subjectItemsStatus = example {"courseCode": true, "classLocation": "false", ...}
        - timetableData.subjectItemsOrder = example ["classLocation", "classGroup", ...]
        - timetableData.semesterInfo = example {"semesterLength": 12, "startDate": 2025-11-03}
        - timetableData.writeEventSubject

    IF FAIL:
    object {error: message to user}
*/

export default function enrichTimetableData(timetableData) {
    if (!timetableData || !timetableData.classInfos || !timetableData.courseNames) {
        return {error: "Processed timetable is not found. Please try again."};
    }

    // DO NOT CHANGE THIS subjectItems INITIALISATION, WILL BREAK CODE FOR writeEventSubject AND OTHERS!!
    const subjectItems = ["courseCode", "courseName", "classType", "classGroup", "classLocation"];
    
    timetableData["subjectItemsStatus"] = Object.fromEntries(subjectItems.map(item => [item, true]));
    timetableData["subjectItemsOrder"] = subjectItems;


    // Goes through subjectItemsStatus in order via subjectItemsOrder
    // Append the data into the event subject being written if user checked it
    timetableData["writeEventSubject"] = function (classInfo) {
        let courseNames = this.courseNames;

        let classTypeMap = {
            "L": "LECTURE", 
            "P": "PRACTICAL", 
            "T": "TUTORIAL"
        };

        // did this so that only need to change subjectItems array element at the above as the key names depend on it
        let timetableFieldMap = {
            [subjectItems[0]]: classInfo.courseCode, 
            [subjectItems[1]]: courseNames[classInfo.courseCode], 
            [subjectItems[2]]: classTypeMap[classInfo.classType], 
            [subjectItems[3]]: `(GROUP ${classInfo.classGroup})`, 
            [subjectItems[4]]: classInfo.classLocation
        };

        
        let subjectItemsStatus = this.subjectItemsStatus;
        let subjectItemsOrder = this.subjectItemsOrder;

        let textContent = "";
        for (let subjectItem of subjectItemsOrder) {
            if (subjectItemsStatus[subjectItem] === true) textContent += `${timetableFieldMap[subjectItem]} `
        }

        return textContent.trim();
    };

    
    timetableData["semesterInfo"] = {
        "semesterLength": 14,
        
        // Compute most recent Monday in ISO format
        "startDate": (() => {
            const date = new Date();
            const day = date.getDay();
            const diff = (day + 6) % 7;
            date.setDate(date.getDate() - diff);

            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        })()
    }


    return timetableData;
}