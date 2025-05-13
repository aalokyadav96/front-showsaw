import { displayJobs } from "../../services/jobs/jobs.js";

async function Jobs(isLoggedIn, contentContainer) {
    contentContainer.innerHTML = '';
    displayJobs(contentContainer, isLoggedIn);
}

export { Jobs };
