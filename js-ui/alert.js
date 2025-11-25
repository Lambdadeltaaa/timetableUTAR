// Appends a alert text to target element using Bootstrap to notify users on something.
export function createAlertText(appendLocation, text, alertType) {
    removeAlertText(appendLocation);
    
    let alertDiv = document.createElement("div");
    alertDiv.classList.add("alert", alertType, "alert-dismissible");
    alertDiv.classList.add("d-flex", "align-items-center", "mt-3");
    alertDiv.role = "alert";

    let svgIcon = mapAlertIcon(alertType);
    if (svgIcon) alertDiv.appendChild(svgIcon);

    let textDiv = document.createElement("div");
    textDiv.textContent = text;
    alertDiv.appendChild(textDiv);

    let closeButton = document.createElement("button");
    closeButton.classList.add("btn-close");
    closeButton.type = "button";
    closeButton.setAttribute("data-bs-dismiss", "alert");
    alertDiv.appendChild(closeButton);
    
    appendLocation.appendChild(alertDiv);
    alertDiv.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Helper function that generates a small icon related to the alert next to the text content.
function mapAlertIcon(alertType) {
    const svgNS = "http://www.w3.org/2000/svg";
    const checkIcon = `M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z`;
    const exclaimationIcon = `M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z`;
    const infoIcon =  `M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z`;

    const iconMap = {
        "alert-primary": infoIcon,
        "alert-secondary": infoIcon,
        "alert-info": infoIcon,
        "alert-light": infoIcon,
        "alert-dark": infoIcon,
        "alert-success": checkIcon,
        "alert-danger": exclaimationIcon,
        "alert-warning": exclaimationIcon,
    }

    if (!(alertType in iconMap)) {
        return null;
    }

    let svgIcon = document.createElementNS(svgNS, "svg");
    svgIcon.classList.add("bi", "flex-shrink-0", "me-2");
    svgIcon.role = "img";
    svgIcon.setAttribute("width", "1em");
    svgIcon.setAttribute("height", "1em");
    svgIcon.setAttribute("viewBox", "0 0 16 16");
    svgIcon.setAttribute("fill", "currentColor");
    svgIcon.innerHTML = iconMap[alertType];

    let path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", iconMap[alertType]);
    svgIcon.appendChild(path);
    
    return svgIcon;
}


// Removes the alert text from target element.
export function removeAlertText(appendLocation) {
    if (appendLocation.getElementsByClassName("alert").length != 0) {
        let alertsDiv = appendLocation.getElementsByClassName("alert");
        Array.from(alertsDiv).forEach(alert => {
            alert.remove();
        });
    }
}