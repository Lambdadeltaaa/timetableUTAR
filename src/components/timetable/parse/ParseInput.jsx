import { useState } from "react";

import Dropzone from "react-dropzone";
import TextButton from "../../common/TextButton/TextButton.jsx";

// get input from user and pass it to parent function to parse when the button is pressed.
export default function ParseInput({ processHTMLInput }) {
    const [htmlInput, setHTMLInput] = useState(null);

    return (
        <footer className="parse-input mb-5 col-12 col-md-8 mx-auto">
            <Dropzone
                onDrop={files => setHTMLInput(files[0])}
                accept={{"text/html": [".html", ".htm"]}}    
                maxFiles={1}
            >
                {({getRootProps, getInputProps}) => (
                    <div {...getRootProps({
                        className: "form-control text-center p-5 mb-4"
                    })}>
                        <input {...getInputProps()} />
                        
                        <p className="main-body-text mb-1 fs-5" style={{ opacity:0.5 }}>
                            {htmlInput
                                ? `✅ Selected: ${htmlInput.name}`
                                : "⬆️ Drag & drop your timetable HTML file here, or click to browse files."}
                        </p>

                        <p className="main body-text small mb-0" style={{ opacity:0.5 }}>
                            Upload only ONE file, and in (.html or .htm) format.
                        </p>
                    </div>
                )}
            </Dropzone>

            <TextButton text={"Begin Processing"} performAction={() => {processHTMLInput(htmlInput)}} />
        </footer>
    )
}