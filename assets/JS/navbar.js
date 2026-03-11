import { logoutUser } from "./script.js";

window.addEventListener("DOMContentLoaded", async function () {
    const logoutBtn = document.querySelector(".navbar-end .button.is-dark");
    setupLogout(logoutBtn);
});

function setupLogout(logoutBtn) {
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async function () {
        try {
            await logoutUser();
        }
        catch (error) {
            console.error("Logout failed", error);
        }
    });
}
