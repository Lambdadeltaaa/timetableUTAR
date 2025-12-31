import TextButton from "../../common/TextButton/TextButton"

export default function ExportHeader({ backPreviousScreen }) {
    return (
        <header className="export-header d-flex flex-column flex-md-row align-items-md-center justify-content-md-between mb-7">
            <TextButton text="Back to Edit" performAction={backPreviousScreen} className="mb-3 mb-md-0 align-self-start" />
            <h2 className="main-header-text fw-semibold display-2 text-center mb-0">Export Your Timetable</h2>
            <div className="spacer d-none d-md-block" style={{width: "120px"}}></div>
        </header>
    )
}
