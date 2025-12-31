import step1 from '../../../assets/instructions/import-google-cal/step-1.png';
import step2 from '../../../assets/instructions/import-google-cal/step-2.png';
import step3 from '../../../assets/instructions/import-google-cal/step-3.png';
import step4 from '../../../assets/instructions/import-google-cal/step-4.png';

export default function ExportInstructions() {
    const formatText = "main-body-text fs-3 col-md-8 mx-auto";
    const formatImage = "col-12 col-md-8 border border-light border-3 rounded mb-6";

    return (
        <section className="export-instructions text-center mb-5">
            <hr style={{color: "lightgray"}} />
            <h3 className="main-header-text fw-semibold display-3 mb-5">How to Import?</h3>

            <p className={formatText}>1. Open your { }
                <a href="https://calendar.google.com" target='_blank' className="link-primary">Google Calendar</a> 
                { } and go to Settings.</p>
            <img src={step1} alt="step1-visual-aid" className={formatImage} />

            <p className={formatText}>2. Go to the 'Add Calendar' section and then click 'Create new Calendar'. Create your new calendar.</p>
            <img src={step2} alt="step2-visual-aid" className={formatImage} />

            <p className={formatText}>3. Under the 'Import & Export' section, go to 'Import' and upload the timetable you have
                downloaded. Select your newly created calendar from the dropdown list and press 'Import'.</p>
            <img src={step3} alt="step3-visual-aid" className={formatImage} />

            <p className={formatText}>Congrats! Your timetable has been successfully implemented.</p>
            <img src={step4} alt="step4-visual-aid" className={formatImage} />
        </section>
    )
}