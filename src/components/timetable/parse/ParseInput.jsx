import { useState } from "react";

import TextButton from "../../common/TextButton/TextButton.jsx";

// get input from user and pass it to parent function to parse when the button is pressed.
export default function ParseInput({ processHTMLInput }) {
    const [htmlInput, setHTMLInput] = useState("");

    return (
        <footer className="parse-input mb-5 col-12 col-md-8 mx-auto">
            <textarea
                className="form-control main-body-text fs-5 border border-light border-3"
                rows="10"
                placeholder="Place output here..."
                value={htmlInput}
                onChange={(e) => setHTMLInput(e.target.value)}
            />

            <br />

            <TextButton text={"Begin Processing"} performAction={() => {processHTMLInput(htmlInput)}} />
        </footer>
    )
}