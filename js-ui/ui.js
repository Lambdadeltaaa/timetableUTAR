/* ui.js is the "coordinator" of the js-ui directory
- It serves two purposes:
    1. Re-exporting UI-related helper functions for other scripts to use.
    2. Importing and initialising certain UI components on page load.
*/

export * from "./alert.js";

import { setupCopyButton } from "./setup-copy-button.js";
setupCopyButton();