import step1 from '../../../assets/instructions/parse-html/step-1.png';
import step2 from '../../../assets/instructions/parse-html/step-2.png';
import step3 from '../../../assets/instructions/parse-html/step-3.png';


export default function ParseInstructions() {
    const formatText = "main-body-text fs-3 col-md-8 mx-auto";
    const formatImage = "col-12 col-md-8 border border-light border-3 rounded"

    return (
        <section className="parse-instructions mb-2">
            <hr style={{color: "lightgray"}} />
            <h3 className="main-header-text fw-semibold display-3 mb-5">Instructions:</h3>

            <p className={formatText}>1. Log in to{" "}
                <a href="https://portal.utar.edu.my" target="_blank" className="main-header-text">UTAR Portal</a>
                { } and open up your timetable webpage.</p>
            <img src={step1} alt="step1-visual-aid" className={`${formatImage} mb-6`} />

            <p className={formatText}>2. Press Ctrl+S (Windows) or ⌘+S (Mac) to save the webpage. Ensure that the webpage is saved as { }
                'Webpage, Complete' (not 'HTML only').</p>
            <img src={step2} alt='step2-visual-aid' className={`${formatImage} mb-6`} />

            <p className={formatText}>3. Upload the file named 'index' inside of the newly downloaded folder to the input box below.</p>
            <img src={step3} alt="step3-visual-aid" className={`${formatImage} mb-5`} />
        </section>
    )
}