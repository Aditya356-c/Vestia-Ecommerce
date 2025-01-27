import { RegisterUser } from "../modules/ApiService.js";
import { getFormLocalStorage, saveToLocalStorage } from "../modules/utility.js";

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Register Dialog
 * Handles the display, validation, and interaction logic for the register.
 */

export function handleRegisterDialog() {
  const dialog = document.getElementById("register-dialog");
  const openDialogBtn = document.getElementById("register_open-btn");
  const closeDialogBtn = document.getElementById("close-dialog");
  const emailInput = document.getElementById("register-input");
  const registerActionBtn = document.getElementById("register-btn");
  const userIcon = document.getElementById("user-Icon");
  const noRegister = document.getElementById("register-In");

  // Open the dialog and prevent page scrolling
  function openDialog() {
    dialog.showModal();
    document.body.style.overflow = "hidden";
    emailInput.focus();
  }
  // Close the dialog and restore page scrolling
  function closeDialog() {
    dialog.close();
    document.body.style.overflow = "auto";
  }

  // Initialize the UI based on whether the user is already registered
  function initialFormUi() {
    const storedUser = getFormLocalStorage();

    if (storedUser) {
      // User is registered
      userIcon.classList.remove("hide__element"); // show user icon when register
      noRegister.classList.add("hide__element"); // hide register button when register
      emailInput.value = storedUser.email; // show email by which user is register
      registerActionBtn.disabled = true;
      emailInput.readOnly = true;
    } else {
      // User is not registered
      userIcon.classList.add("hide"); // hide user icon when not register
      noRegister.classList.remove("hide"); // show register button when not register
      registerActionBtn.disabled = false;
      emailInput.readOnly = false;
    }
  }

  // Handle form submission on register button click
  async function handleRegister(event) {
    event.preventDefault(); // Prevent form from reloading the page
    const email = emailInput.value.trim();

    // Validate Email
    if (!email) {
      alert("⚠️ Email address is required.");
      return;
    }
    if (!isValidEmail(email)) {
      alert("⚠️ Please enter a valid email address.");
      return;
    }

    try {
      // Disable the button to prevent duplicate submissions
      registerActionBtn.disabled = true;

      const registerResponse = await RegisterUser(email);

      if (registerResponse.userId) {
        // Save user data
        saveToLocalStorage({
          userId: registerResponse.userId,
          email,
        });
        closeDialog();
        initialFormUi();

        alert(registerResponse.message || "✅ Registration successful!");
      } else {
        alert(
          registerResponse.error || "⛔ Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("⛔ An error occurred. Please try again later.");
    } finally {
      registerActionBtn.disabled = false;
    }
  }

  // Event Listeners
  openDialogBtn.addEventListener("click", openDialog);
  closeDialogBtn.addEventListener("click", closeDialog);
  if (dialog.hasAttribute("open")) {
    dialog.querySelector("form").addEventListener("submit", handleRegister);
  }

  // Initialize UI state on load
  initialFormUi();
}
