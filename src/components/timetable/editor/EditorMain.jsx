import EditorHeader from "./EditorHeader.jsx"
import EditorPanel from "./EditorPanel.jsx";
import EditCourseName from "./panels/EditCourseName.jsx";
import EditCalendarSubject from "./panels/EditCalendarSubject.jsx";
import EditSemesterInfo from "./panels/EditSemesterInfo.jsx";
import TextButton from "../../common/TextButton/TextButton.jsx";
import TimetablePreview from "./TimetablePreview.jsx";

// MAIN FUNCTION:
// Renders the editor UI and allow users to update timetableData passed from parent function, and also timetable preview
// Once complete editing button is pressed, proceeds to "export" screen
export default function EditorMain({ timetableData, setTimetableData, changeScreen }) {
    const backPreviousScreen = () => {changeScreen("parse")};
    const toNextScreen = () => {changeScreen("export")};

    return (
        <div className="editor-main container mt-5 mb-5">
            <EditorHeader backPreviousScreen={backPreviousScreen} />

            <section className="row">
                <EditorPanel>
                    <EditCourseName timetableData={timetableData} setTimetableData={setTimetableData} />
                    <EditCalendarSubject timetableData={timetableData} setTimetableData={setTimetableData} />
                    <EditSemesterInfo timetableData={timetableData} setTimetableData={setTimetableData} />
                    <TextButton text="Finish Editing" performAction={toNextScreen} className="float-end mb-5" />
                </EditorPanel>

                <TimetablePreview timetableData={timetableData} />
            </section>
        </div>
    )
}