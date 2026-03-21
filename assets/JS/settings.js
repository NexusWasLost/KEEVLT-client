import { getSession, logoutUser } from "./script.js";
import { showConfirm, showAlert } from "./alert_modal.js";

document.addEventListener("DOMContentLoaded", async function () {
    const session = await getSession();

    if (!session) {
        window.location.href = "/login.html";
        return;
    }

    setupSettingsLogout();
    setupUserInfo(session);
    setupDeleteUser(session.access_token);
});

function setupUserInfo(session){
    const emailSpan = document.querySelector("#email-span");
    emailSpan.textContent = session.user.email;

    const nameSpan = document.querySelector("#name-span");
    nameSpan.textContent = session.user.user_metadata.full_name;

    const createdAtSpan = document.querySelector("#created-at-span");
    createdAtSpan.textContent = session.user.created_at.split('T')[0];
}

function setupSettingsLogout() {
    const logoutBtn = document.querySelector("#settingsLogoutBtn");

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

function setupDeleteUser(token){
    const delBtn = document.querySelector("#deleteAccountBtn");

    if (!delBtn) return;

    delBtn.addEventListener("click", async function () {
        const confirmed = await showConfirm("Delete Account", "Are you sure you want to delete your account? This action cannot be undone !");
        if (!confirmed) return;

        try {
            const response = await fetch(`${baseURL}/api/del-user`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (!response.ok){
                await showAlert("Failed to delete account.");
                return;
            }
            await showAlert("Account deleted successfully.");
            await logoutUser();
        }
        catch (error){
            console.error("Delete account failed:", error);
            await showAlert("Network error while deleting account.");
        }
    });
}
