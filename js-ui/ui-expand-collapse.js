/* collapseUI and expandUI parameters:
- sections: array of DOM elements (sections) to hide or unhide them.
- scrollTop (default false): boolean, to decide whether the window should scroll back to top of the page after transitions complete.
*/

export function collapseUI(sections, scrollTop=false) {
    let transitionsDone = 0;
    for (let section of sections) {
        section.classList.remove("show");

        section.addEventListener("transitionend", () => {
            section.classList.add("d-none");
            transitionsDone++;

            if ((transitionsDone === sections.length) && scrollTop) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }, { once: true});
    }
}

export function expandUI(sections, scrollTop=false) {
    let transitionsDone = 0;

    for (let section of sections) {
        section.classList.remove("d-none");

        requestAnimationFrame(() => {
            section.classList.add("show");
        });

        section.addEventListener("transitionend", () => {
            transitionsDone++;
            if ((transitionsDone === sections.length) && scrollTop) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }, { once: true });
    }
}