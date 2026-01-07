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
            <h2 className="main-body-text fw-normal mx-auto mb-6 col-md-6">Process your timetable in just a few clicks 
                and makes it Google-Calendar ready along with customisable options.</h2>
            
            <p className="text-warning fw-semibold fs-5 mb-3">⚠️ Desktop only — this web app does not support 
                mobile or tablet devices.</p>
            
            <a href="https://github.com/Lambdadeltaaa/timetableUTAR" target="_blank" className="link-secondary fs-5">View the source code</a>
            <p className="text-secondary mb-3">This is an independent, unofficial tool and is not affiliated with or endorsed by UTAR.</p>
            <img src={arrowDownIcon} alt="arrow-down-icon"></img>
        </header>
    )
}