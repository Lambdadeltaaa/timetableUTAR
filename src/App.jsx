import { useState } from "react";

import HomeScreen from "./components/timetable/HomeScreen.jsx";
import ParseMain from "./components/timetable/parse/ParseMain.jsx";
import EditorMain from "./components/timetable/editor/EditorMain.jsx";
import ExportMain from "./components/timetable/export/ExportMain.jsx";

export default function App() {
    const [timetableData, setTimetableData] = useState({}); 
    
    const [currentScreen, setCurrentScreen] = useState("parse");
    const [isFading, setIsFading] = useState(false);

    const changeScreen = (screen) => {
        if (screen === currentScreen) return;
        setIsFading(true);

        // the interval should match the fade transition duration defined in index.css
        setTimeout(() => {
            setCurrentScreen(screen);
            window.scrollTo({ top: 0, behavior: "smooth" });
            setIsFading(false);
        }, 500)
    };

    const screens = {
        "parse": <> {/* process user input, then write to timetableData state */}
            <HomeScreen />
            <ParseMain setTimetableData={setTimetableData} changeScreen={changeScreen} />
        </>,

        "editor": <> {/* allow users to modify timetableData state */ }
            <EditorMain timetableData={timetableData} setTimetableData={setTimetableData} changeScreen={changeScreen} />
        </>,

        "export": <> {/* process timetableData state into exportable formats */}
            <ExportMain timetableData={timetableData} changeScreen={changeScreen} />
        </>
    }

    return (
        <div className={`screen-container fade ${isFading ? "" : "show"}`}>
            {screens[currentScreen]}
        </div>
    )
}