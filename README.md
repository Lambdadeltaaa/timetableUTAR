# UTAR Timetable Maker
A web app that allows UTAR students to convert their timetable from the UTAR portal into Google Calendar with customizable options like renaming courses and toggling event details.

> **Disclaimer:** <br>
> This project is an independent, unofficial tool and is not affiliated with, or endorsed by UTAR. <br>
> Timetable data may be inaccurate. Always verify with the official school portal.

[Click here to open the web app:](https://lambdadeltaaa.github.io/timetableUTAR/)
<p align="center">
  <a href="https://lambdadeltaaa.github.io/timetableUTAR/">
    <img src="./src/assets/icons/calendar-icon.png" alt="Calendar Icon" width="256">
  </a>
</p>



## Usage
Simply open the app via the [live link](https://lambdadeltaaa.github.io/timetableUTAR/) above and follow the on-screen guidance to:
- Import your UTAR timetable
- Customize course names and event details
- Export your timetable to Google Calendar or CSV



## Project Structure
### Built With:
- React + Vite
- Bootstrap 5

### File Structure:
```
src/
├─ App.jsx            # Main app component
├─ index.css          # Global styles
├─ main.jsx           # App entry point
│
├─ assets/            # Static files (images, gifs etc.)
│
├─ components/        
│  ├─ common/                  # Reusable common components
│  │   ├─ Alert/               
│  │   ├─ CopyButton/ 
│  │   └─ TextButton/ 
│  │
│  └─ timetable/               # Timetable components, each sections' entry point have 'Main' in their file names
│      ├─ HomeScreen.jsx       # Main timetable page
│      ├─ editor/              # Timetable editor components screen
│      ├─ export/              # Components for exporting timetable screen
│      └─ parse/               # Components for parsing timetable input screen
│
└─ logic/                      # Core application logic / helpers
    ├─ enrichTimetableData.js  # Adds extra data to timetable
    ├─ exportTimetableData.js  # Exports timetable in different formats
    └─ parseTimetableHTML.js   # Parses HTML input into timetable data              
```



## Roadmap
- [x] Rewrite codebase in React
- [ ] Ability to export to other Calendar apps (eg. Apple Calendar)
- [ ] Implement an easier version of retrieving user HTML
- [ ] Add even more customisation options
- [ ] Create Google Extension version



## Contributing
Contributions are welcome! If you are a UTAR student and you want to help improve UTAR Timetable Maker, follow these steps:

- Fork the project
- Create a new branch (```git checkout -b feature/your-feature-name```)
- Commit your changes (```git commit -m "Added a feature"```)
- Push to your branch (```git push origin feature/your-feature-name```)
- Open a Pull Request