import googleCalendarIcon from '../../../assets/icons/google-calendar-icon.png';

export default function ExportActions({ handleExport }) {
    return (
        <nav className="export-actions d-flex justify-content-center mb-5">
            <div className="google-calendar text-center border border-light rounded p-5">
                <img src={googleCalendarIcon} alt="google-calendar-icon" className="w-100 mb-5" />
                <br />
                <button className="btn btn-success fs-5 fw-semibold mb-2" onClick={() => handleExport("csv")}>
                    Export to Google Calendar
                </button>
                <p className="main-body-text mb-0">(Export as .csv file)</p>
            </div>
        </nav>
    )
}