# 🗓️ UTAR Timetable Maker
A web app that allows UTAR students to convert their timetable from the UTAR portal into Google Calendar with customisable options like renaming courses and toggling event details.

Access the web app here: https://timetable-utar.pages.dev/

> 📌 **Disclaimer:**  
> This project is an independent, unofficial tool and is not affiliated with, or endorsed by UTAR.  
> Desktop browsers only. Mobile and tablet devices are not supported.



## Usage
Simply open the app via the live link above and follow the on-screen guidance to:
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
- [x] Implement an easier version of retrieving user HTML
- [ ] Ability to export to other Calendar apps (eg. Apple Calendar)
- [ ] Add even more customisation options



## Contributing (for Developers)
Contributions are welcome! If you are a UTAR student and want to help improve UTAR Timetable Maker, follow the steps below to set up the project and start contributing:

### Prerequisites
Ensure that you have installed: 
- NodeJS
- npm

### Setup
1. **Fork** the repository to your account then **clone** it locally.
```bash
git clone https://github.com/<your-username>/timetableUTAR.git
cd timetableUTAR
```

2. Install dependencies:
```
npm install
```

3. Create a new branch for your work:
```
git switch -c your-branch-name
```

4. Start the development server with hot-reload:
```
npm run dev
```

5. Commit and push your changes, then open a pull request:
```
git commit -m "Describe your changes"
git push origin your-branch-name
```