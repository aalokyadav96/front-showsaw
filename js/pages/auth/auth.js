import { login, signup } from "../../services/auth/authService.js";

async function Auth(isLoggedIn, contentContainer) {
    displayAuthSection(isLoggedIn, contentContainer);
}

function displayAuthSection(isLoggedIn, contentContainer) {
    // Clear container
    contentContainer.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.minHeight = '100vh';
    wrapper.style.backgroundColor = '#f9f9f9';
    wrapper.style.padding = '2rem';

    const authBox = document.createElement('div');
    authBox.style.backgroundColor = '#fff';
    authBox.style.padding = '2rem';
    authBox.style.borderRadius = '8px';
    authBox.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    authBox.style.width = '100%';
    authBox.style.maxWidth = '360px';
    authBox.style.boxSizing = 'border-box';

    if (isLoggedIn) {
        const welcomeMessage = document.createElement("h2");
        welcomeMessage.textContent = "Welcome back!";
        welcomeMessage.style.textAlign = 'center';
        authBox.appendChild(welcomeMessage);
    } else {
        // LOGIN FORM
        const loginTitle = document.createElement("h2");
        loginTitle.textContent = "Login";
        loginTitle.style.marginBottom = '1rem';
        authBox.appendChild(loginTitle);

        const loginForm = document.createElement("form");
        loginForm.style.display = 'flex';
        loginForm.style.flexDirection = 'column';
        loginForm.style.gap = '0.75rem';

        const loginUsername = document.createElement("input");
        loginUsername.type = "text";
        loginUsername.id = "login-username";
        loginUsername.placeholder = "Username";
        loginUsername.autocomplete = "username";

        const loginPassword = document.createElement("input");
        loginPassword.type = "password";
        loginPassword.id = "login-password";
        loginPassword.placeholder = "Password";
        loginPassword.autocomplete = "current-password";

        const loginButton = document.createElement("button");
        loginButton.type = "submit";
        loginButton.textContent = "Login";
        loginButton.style.marginTop = '0.5rem';

        loginForm.appendChild(loginUsername);
        loginForm.appendChild(loginPassword);
        loginForm.appendChild(loginButton);
        authBox.appendChild(loginForm);

        // SEPARATOR
        const separator = document.createElement("hr");
        separator.style.margin = '2rem 0';
        authBox.appendChild(separator);

        // SIGNUP FORM
        const signupTitle = document.createElement("h2");
        signupTitle.textContent = "Signup";
        signupTitle.style.marginBottom = '1rem';
        authBox.appendChild(signupTitle);

        const signupForm = document.createElement("form");
        signupForm.style.display = 'flex';
        signupForm.style.flexDirection = 'column';
        signupForm.style.gap = '0.75rem';

        const signupUsername = document.createElement("input");
        signupUsername.type = "text";
        signupUsername.id = "signup-username";
        signupUsername.placeholder = "Username";

        const signupEmail = document.createElement("input");
        signupEmail.type = "email";
        signupEmail.id = "signup-email";
        signupEmail.placeholder = "Email";

        const signupPassword = document.createElement("input");
        signupPassword.type = "password";
        signupPassword.id = "signup-password";
        signupPassword.placeholder = "Password";
        signupPassword.autocomplete = "new-password";

        const signupButton = document.createElement("button");
        signupButton.type = "submit";
        signupButton.textContent = "Signup";
        signupButton.style.marginTop = '0.5rem';

        signupForm.appendChild(signupUsername);
        signupForm.appendChild(signupEmail);
        signupForm.appendChild(signupPassword);
        signupForm.appendChild(signupButton);
        authBox.appendChild(signupForm);

        // Attach handlers
        loginForm.addEventListener("submit", login);
        signupForm.addEventListener("submit", signup);
    }

    wrapper.appendChild(authBox);
    contentContainer.appendChild(wrapper);
}

export { Auth };

// import { login, signup } from "../../services/auth/authService.js"; // Import login/signup functions


// async function Auth(isLoggedIn, contentContainer) {
//     displayAuthSection(isLoggedIn, contentContainer)
// }

// function displayAuthSection(isLoggedIn, contentContainer) {
//     const authSection = document.createElement('div');
//     authSection.className = "onepadd";
//     contentContainer.appendChild(authSection);

//     // Clear previous content
//     authSection.innerHTML = '';

//     if (isLoggedIn) {
//         // Create a welcome message
//         const welcomeMessage = document.createElement("h2");
//         welcomeMessage.textContent = "Welcome back!";
//         authSection.appendChild(welcomeMessage);
//     } else {
//         // Create the login section
//         const loginTitle = document.createElement("h2");
//         loginTitle.textContent = "Login";
//         authSection.appendChild(loginTitle);

//         const loginForm = document.createElement("form");
//         loginForm.id = "login-form";
//         loginForm.classList = "auth-form";

//         const loginUsername = document.createElement("input");
//         loginUsername.type = "text";
//         loginUsername.id = "login-username";
//         loginUsername.placeholder = "Username";
//         loginUsername.autocomplete="login-username"
//         loginForm.appendChild(loginUsername);

//         const loginPassword = document.createElement("input");
//         loginPassword.type = "password";
//         loginPassword.id = "login-password";
//         loginPassword.placeholder = "Password";
//         loginPassword.autocomplete="current-password"
//         loginForm.appendChild(loginPassword);

//         const loginButton = document.createElement("button");
//         loginButton.type = "submit";
//         loginButton.className = "auth-btn centered-txt";
//         loginButton.textContent = "Login";
//         loginForm.appendChild(loginButton);

//         authSection.appendChild(loginForm);

//         // Create the signup section
//         const signupTitle = document.createElement("h2");
//         signupTitle.textContent = "Signup";
//         authSection.appendChild(signupTitle);

//         const signupForm = document.createElement("form");
//         signupForm.id = "signup-form";
//         signupForm.classList = "auth-form";

//         const signupUsername = document.createElement("input");
//         signupUsername.type = "text";
//         signupUsername.id = "signup-username";
//         signupUsername.placeholder = "Username";
//         signupForm.appendChild(signupUsername);

//         const signupEmail = document.createElement("input");
//         signupEmail.type = "email";
//         signupEmail.id = "signup-email";
//         signupEmail.placeholder = "Email";
//         signupForm.appendChild(signupEmail);

//         const signupPassword = document.createElement("input");
//         signupPassword.type = "password";
//         signupPassword.id = "signup-password";
//         signupPassword.placeholder = "Password";
//         signupPassword.autocomplete="signup-password"
//         signupForm.appendChild(signupPassword);

//         const signupButton = document.createElement("button");
//         signupButton.type = "submit";
//         signupButton.className = "auth-btn centered-txt";
//         signupButton.textContent = "Signup";
//         signupForm.appendChild(signupButton);

//         authSection.appendChild(signupForm);

//         // Attach event listeners for the forms
//         loginForm.addEventListener("submit", login);
//         signupForm.addEventListener("submit", signup);
//     }
// }


// export { Auth };
