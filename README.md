# UTAR Timetable Maker

A web app that allows UTAR students to convert their timetable from the UTAR portal into Google Calendar with customizable options like renaming courses and toggling event details.

Click the icon below to open the web app:
[![Calendar Icon](./images/calendar-icon.png)](https://lambdadeltaaa.github.io/timetableUTAR/)



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



## Contributing

Contributions are welcome! If you are a UTAR student and you want to help improve UTAR Timetable Maker, follow these steps:

- Fork the project
- Create a new branch (```git checkout -b feature/your-feature-name```)
- Commit your changes (```git commit -m "Added a feature"```)
- Push to your branch (```git push origin feature/your-feature-name```)
- Open a Pull Request