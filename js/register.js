let users = []

/**
 * This function is used to initialize the registration process
 *  by invoking the loadUsers function
 */
function initRegister() {
    loadUsers();
}

/**
 * This function loads user data from the remote storage
 */
async function loadUsers() {
    try {
        let parseStorage = await getItem('users');
        users = JSON.parse(parseStorage.data.value);
    } catch (e) {
        console.warning('Loading error:', e);
    }
}

/**
 * This function handles the registration process 
 * It checks for password matching
 * pushes user data
 * resets the registration form
 * and displays a success overlay
 * @returns cancels the function if the password inputs of the user don't match
 */
function register() {
    if (!passwordMatching()) {
        return;
    }
    if (!checkAcceptance()) {
        acceptMsg.style.display = "flex";

        setTimeout(function () {
            acceptMsg.style.display = "";
        }, 2000);

        return;
    }

    usersPush();
    resetForm();
    successfulRegistration();
}

/**
 * This function adds the current user's data to the users array and 
 * updates the remote storage with the new user information
 */
async function usersPush() {
    users.push({
        name: userNameInput.value,
        email: userEmailInput.value,
        password: userPasswordInput.value,
    });
    await setItem('users', JSON.stringify(users));
}

/**
 * This function displays a success overlay, hides it after a short delay,
 * and redirects the user to the index.html page
 */
function successfulRegistration() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "flex";

    setTimeout(function () {
        overlay.style.display = "none";
        window.location.href = 'index.html';
    }, 700);
}

/**
 * This function checks the acceptance box status and displays a message for the user
 * to accept the privacy policy
 */
function checkAcceptance() {
    let acceptBoxChecked = document.getElementById('acceptBoxChecked');

    if (acceptBoxChecked.style.display === "block") {
        return true;
    } else {
        return false;
    }
}

/**
 * This function checks if the entered password matches the confirmed password
 * It updates the visual representation of the password confirmation field and
 * displays an error message if the passwords do not match
 * @returns {boolean} - True if passwords match, false otherwise
 */
function passwordMatching() {
    let userPasswordInput = document.getElementById("userPasswordInput");
    let confirmPasswordInput = document.getElementById("confirmPasswordInput");
    let confirmPasswordContainer = document.getElementById("confirmPasswordContainer");
    let confirmMsg = document.getElementById("confirmMsg");
    let password = userPasswordInput.value;
    let confirmPassword = confirmPasswordInput.value;

    if (password !== confirmPassword) {
        confirmPasswordContainer.style.borderColor = "red";
        confirmMsg.style.display = "block";
        return false;
    } else {
        confirmPasswordContainer.style.borderColor = "";
        confirmMsg.style.display = "none";
        return true;
    }
}

/**
 * This function toggles the visual representation of the acceptance checkbox
 * between checked and unchecked states 
 * It also calls the checkAcceptance function to update the registration button status accordingly
 */
function toggleAcceptCheckbox() {
    let checkedBox = document.getElementById('acceptBoxChecked');
    let uncheckedBox = document.getElementById('acceptBoxUnchecked');

    if (checkedBox.style.display === "" || checkedBox.style.display === "none") {
        checkedBox.style.display = "block";
        uncheckedBox.style.display = "none";
    } else {
        checkedBox.style.display = "none";
        uncheckedBox.style.display = "block";
    }

    checkAcceptance();
}

/**
 * This function resets the values of the user email and password input fields
 */
function resetForm() {
    userEmailInput.value = '';
    userPasswordInput.value = '';
}