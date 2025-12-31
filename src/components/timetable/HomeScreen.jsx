import calendarIcon from '../../assets/icons/calendar-icon.png';
import arrowDownIcon from '../../assets/icons/arrow-down-icon.png';

export default function HomeScreen() {
    // (100vh - {MARGINTOP}rem) to make the entire viewport the header 
    const marginTop = 6;
    const headerClass = `home-screen container mt-${marginTop} text-center`;
    const headerStyle = {minHeight: `calc(100vh - ${marginTop}rem)`};
    
    return (
        <header className={headerClass} style={headerStyle}>
            <img src={calendarIcon} alt="calendar-icon" className='mb-3 col-6 col-md-3' />
            <h1 className="main-header-text fw-semibold display-1 mb-3">UTAR Timetable Maker</h1>
            <h2 className="main-body-text fw-normal mx-auto mb-6 col-md-6">Process your timetable in just a few clicks and makes it Google-Calendar ready along with customisable options.</h2>
            <a href="https://github.com/Lambdadeltaaa/timetableUTAR" target="_blank" className="link-secondary mb-3 fs-5">View the source code</a><br></br>
            <img src={arrowDownIcon} alt="arrow-down-icon"></img>
        </header>
    )
}