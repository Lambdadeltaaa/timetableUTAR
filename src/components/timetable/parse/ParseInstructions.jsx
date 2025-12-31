import CopyButton from '../../common/CopyButton/CopyButton.jsx';
import step1 from '../../../assets/instructions/parse-html/step-1.png';
import step2 from '../../../assets/instructions/parse-html/step-2.gif';
import step3 from '../../../assets/instructions/parse-html/step-3.gif';
import step4 from '../../../assets/instructions/parse-html/step-4.gif';

export default function ParseInstructions() {
    const formatText = "main-body-text fs-3 col-md-8 mx-auto";
    const formatImage = "col-12 col-md-8 border border-light border-3 rounded mb-6"

    const consoleCode = `copy((window.name === "mainFrame" ? document : document.getElementsByName("mainFrame")[0]?.contentWindow?.document || document ).documentElement.outerHTML)`;

    return (
        <section className="parse-instructions mb-2">
            <hr style={{color: "lightgray"}} />
            <h3 className="main-header-text fw-semibold display-3 mb-5">Instructions:</h3>

            <p className={formatText}>1. Log in to{" "}
                <a href="https://portal.utar.edu.my" target="_blank" className="link-primary">UTAR Portal</a>.</p>
            <img src={step1} alt="step1-visual-aid" className={formatImage} />

            <p className={formatText}>2. Open up your timetable webpage.</p>
            <img src={step2} alt="step2-visual-aid" className={formatImage} />

            <p className={formatText}>3. Press F12, or right click then select inspect to open developer tools. Click on the 'Console' tab.</p>
            <img src={step3} alt="step3-visual-aid" className={formatImage} />

            <p className={formatText}>4. Copy the command below and paste it into the console.</p>
            <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                <code className="secondary-bg text-wrap rounded fs-5 p-2 col-12 col-md-9">{consoleCode}</code>
                <CopyButton data={consoleCode} />
            </div>
            <img src={step4} alt="step4-visual-aid" className={formatImage} />

            <p className={formatText}>5. Timetable data output is now saved to your clipboard. Paste it below to begin processing.</p>
        </section>
    )
}