export function setupCopyButton() {
    const copyButton = document.getElementById("copy-cmd-btn");
    let isBusy = false;
    
    copyButton.addEventListener("click", () => {
        const value = document.getElementById("copy-cmd").textContent.trim();
        navigator.clipboard.writeText(value);

        if (isBusy) return;

        let originalIcon = copyButton.innerHTML;
        isBusy = true;
        
        // turns it into a check icon
        copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                            </svg>`;
        
        setTimeout(() => {
            copyButton.innerHTML = originalIcon;
            isBusy = false;
        }, 1200);
    });
}