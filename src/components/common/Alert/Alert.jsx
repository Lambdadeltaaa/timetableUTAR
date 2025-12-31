import { useState, useRef, useImperativeHandle, useEffect } from "react";

export default function Alert({ ref, className }) {
    const alertRef = useRef(null);
    const [alertInfo, setAlertInfo] = useState({ type: "", message: "", visible: false, key: 0});

    // expose these functions for easy alert creation
    useImperativeHandle(ref, () => {
        return {
            createAlert(type, message, autoClose=false) {
                const id = crypto.randomUUID();
                setAlertInfo({type, message, autoClose, visible: true, key: id});

                if (autoClose) {
                    setTimeout(() => {
                        setAlertInfo(prev => {
                            if (prev.key === id && prev.visible) {
                                return {...prev, visible: false};
                            }
                            return prev;
                        })
                    }, 3000);
                }
            },

            deleteAlert() {
                setAlertInfo(prev => ({...prev, visible: false}));
            }
        }
    });


    useEffect(() => {
        if (!alertInfo.visible) return;
        alertRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [alertInfo.visible, alertInfo.key]);


    if (!alertInfo.visible) {
        return null;
    }

    return (
        <div ref={alertRef} className={`alert alert-${alertInfo.type} d-flex align-items-center mt-3 ${className || ""}`} role="alert">
            <AlertIcon type={alertInfo.type} />
            <div>{alertInfo.message}</div>
            <button className="btn-close ms-auto" type="button" onClick={() => {setAlertInfo((prev) => ({...prev, visible: false}))}}></button>
        </div>
    )
}

// Helper component that generates a small icon related to the alert next to the message.
function AlertIcon({ type }) {
    const checkIcon = `M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z`;
    const exclaimationIcon = `M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z`;
    const infoIcon =  `M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z`;

    const iconMap = {
        "primary": infoIcon,
        "secondary": infoIcon,
        "info": infoIcon,
        "light": infoIcon,
        "dark": infoIcon,
        "success": checkIcon,
        "danger": exclaimationIcon,
        "warning": exclaimationIcon,
    }

    if (!(Object.keys(iconMap).includes(type))) {
        return null;
    }
    
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" className="bi flex-shrink-0 me-2" viewBox="0 0 16 16" fill="currentColor" role="img">
            <path d={iconMap[type]}></path>
        </svg>
    )
}