# UTAR Timetable Maker

A web app that allows UTAR students to convert their timetable from the UTAR portal into Google Calendar with customizable options like renaming courses and toggling event details.

[Click here to open the web app:](https://lambdadeltaaa.github.io/timetableUTAR/)
<p align="center">
  <a href="https://lambdadeltaaa.github.io/timetableUTAR/">
    <img src="./images/calendar-icon.png" alt="Calendar Icon" width="256">
  </a>
</p>



## Usage

Simply open the app via the [live link](https://lambdadeltaaa.github.io/timetableUTAR/) above and follow the on-screen guidance to:
- Import your UTAR timetable
- Customize course names and event details
- Export your timetable to Google Calendar or CSV



## Project Structure

### Built With:
- HTML
- Bootstrap 5
- CSS
- Javascript

### File Structure:
```
timetableUTAR/
├─ index.html                 # Main HTML page
├─ images/                    # Image assets
├─ css/                       # CSS styles
│  ├─ base.css                # Base styles for site
│  └─ timetable.css           # Timetable rendering specific styles         
├─ js-logic/                  # JavaScript logic for timetable program
│  ├─ main.js                 # Entry point for timetable logic
│  ├─ parse-timetable.js
│  ├─ edit-timetable.js
│  └─ export-timetable.js
├─ js-ui/                     # JavaScript for UI related things
│  ├─ ui-manager.js           # Main UI management, entry point
│  ├─ ui-alerts.js
│  ├─ ui-expand-collapse.js
│  └─ setup-copy-button.js           
├─ .gitignore    
├─ README.md                 
└─ LICENSE                 
```



## Roadmap

- Implement React into the stack
- Easier method to get HTML of timetable (reduce complexity)
- Add even more customisation options
- Able to export to other Calendar apps (eg. Apple Calendar)
- Make exporting to Calendar apps even easier (maybe via APIs)



## Contributing

Contributions are welcome! If you are a UTAR student and you want to help improve UTAR Timetable Maker, follow these steps:

- Fork the project
- Create a new branch (```git checkout -b feature/your-feature-name```)
- Commit your changes (```git commit -m "Added a feature"```)
- Push to your branch (```git push origin feature/your-feature-name```)
- Open a Pull Request