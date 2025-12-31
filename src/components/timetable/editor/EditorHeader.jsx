import TextButton from "../../common/TextButton/TextButton.jsx"

export default function EditorHeader({ backPreviousScreen }) {
    return (
        <header className="editor-header d-flex flex-column flex-md-row align-items-md-center justify-content-md-between mb-5">
            <TextButton text="Back to Menu" performAction={backPreviousScreen} className="mb-3 mb-md-0 align-self-start" />
            <h2 className="main-header-text fw-semibold display-2 text-center">Edit Your Timetable Settings</h2>
            <div className="spacer d-none d-md-block" style={{width: "120px"}}></div>
        </header>
    )
}