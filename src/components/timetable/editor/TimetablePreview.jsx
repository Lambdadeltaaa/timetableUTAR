export default function TimetablePreview({ timetableData }) {
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const eventsToDays = Object.fromEntries(DAYS.map(day => [day, []]));
    for (let classInfo of timetableData.classInfos) {
        if (eventsToDays[classInfo.day]) eventsToDays[classInfo.day].push(classInfo);
    }

    const nonEmptyDays = DAYS.filter(day => eventsToDays[day].length > 0)
        .map(day => [day, eventsToDays[day]]);

    
    return (
        <div className="timetable-preview col-12 col-md-6 mb-5">
            <h3 className="secondary-header-text">Timetable Preview:</h3>
            {nonEmptyDays.map(([day, events]) => (
                <div className="row mb-4" key={day}>
                    <div className="col-2 border-end border-light text-end">
                        <p className="main-body-text fw-bold">{day}</p>
                    </div>

                    <div className="col-10 text-start">
                        {events.map((classInfo, index) => (
                            <div
                                key={`${classInfo.day}-${classInfo.startTime}-${classInfo.endTime}`}
                                className={`secondary-bg w-100 text-wrap rounded-3 
                                    ${index === events.length - 1 ? "mb-0" : "mb-3"}`}
                            >
                                <p className="main-body-text px-3">{timetableData.writeEventSubject(classInfo)}</p>
                                <p className="main-body-text px-3 mb-0">{`${classInfo.startTime}-${classInfo.endTime}`}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}