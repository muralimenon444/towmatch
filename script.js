document.addEventListener('DOMContentLoaded', () => {
    console.log("[DOMContentLoaded] Page loaded. Initializing.");

    // This function will attach event listeners to elements that might be on the current page.
    initializeEventListeners();

    // Page specific initializations can go here
    if (document.getElementById('resumeBuilderPage')) {
        addWorkExperience(); // Add one empty experience section by default
    }
    if (document.getElementById('driverDashboardPage')) {
        renderSavedJobs(); // Render saved jobs on the driver dashboard
    }
});

// Store data that might persist across a session (using localStorage for prototype)
let savedJobsData = JSON.parse(localStorage.getItem('savedJobs')) || []; 

// Function to open a modal
function openModal(modalId) {
    console.log(`[openModal] Attempting to open modal: ${modalId}`);
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
        targetModal.style.display = 'flex';
        targetModal.classList.add('active');
        console.log(`[openModal] Successfully opened modal: ${modalId}`);
    } else {
        console.error(`[openModal] Modal ID "${modalId}" not found.`);
    }
}

// Function to close a modal
function closeModal(modalId) {
    console.log(`[closeModal] Attempting to close modal: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        console.log(`[closeModal] Successfully closed modal: ${modalId}`);
    } else {
        console.warn(`[closeModal] Modal ID "${modalId}" not found during close.`);
    }
}

// Function to show a temporary notification
function showNotification(message, duration = 3000) {
    console.log(`[showNotification] Displaying: "${message}"`);
    const notificationArea = document.getElementById('notificationArea');
    const notificationMessage = document.getElementById('notificationMessage');
    if (notificationArea && notificationMessage) {
        notificationMessage.textContent = message;
        notificationArea.style.display = 'block';
        setTimeout(() => {
            notificationArea.style.display = 'none';
        }, duration);
    }
}

// Handle login form submission
function handleLoginFormSubmit(event) {
    event.preventDefault();
    showNotification('Login successful! (Prototype)', 2000);
    closeModal('loginModal');
    // Redirect to driver dashboard after a short delay
    setTimeout(() => {
        window.location.href = 'driver-dashboard.html';
    }, 500);
}

// Handle signup form submission
function handleSignupFormSubmit(event) {
    event.preventDefault();
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    if (agreeTermsCheckbox && !agreeTermsCheckbox.checked) {
        showNotification('You must agree to the Terms of Service and Privacy Policy.', 3000);
        return;
    }
    const userTypeSelected = document.getElementById('signupRole')?.value;
    if (!userTypeSelected) {
        showNotification('Please select your role.', 3000);
        return;
    }

    showNotification('Sign up successful! Redirecting...', 2000);
    closeModal('signupModal');

    // Redirect based on role
    setTimeout(() => {
        if (userTypeSelected === 'owner') {
            window.location.href = 'company-dashboard.html';
        } else if (userTypeSelected === 'dispatcher') {
            window.location.href = 'dispatcher-dashboard.html';
        } else {
            window.location.href = 'driver-dashboard.html';
        }
    }, 500);
}

// Mock function to apply for a job
function applyForJob(jobTitle) {
    showNotification(`Successfully applied for ${jobTitle}! (Prototype)`, 3000);
    // Optionally, redirect back to the dashboard
    setTimeout(() => {
        window.location.href = 'driver-dashboard.html';
    }, 1000);
}

// Dynamically add a work experience block to the resume builder
let experienceCount = 0;
function addWorkExperience() {
    experienceCount++;
    const container = document.getElementById('workExperienceContainer');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'p-4 border border-gray-200 rounded-md';
    div.innerHTML = `
        <h4 class="text-md font-semibold text-gray-700 mb-2">Experience #${experienceCount}</h4>
        <div class="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div class="sm:col-span-3">
                <label class="block text-sm font-medium leading-6 text-gray-900">Company Name</label>
                <input type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2">
            </div>
            <div class="sm:col-span-3">
                <label class="block text-sm font-medium leading-6 text-gray-900">Location</label>
                <input type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2">
            </div>
             <div class="sm:col-span-3">
                <label class="block text-sm font-medium leading-6 text-gray-900">Job Title</label>
                <input type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2">
            </div>
            <div class="sm:col-span-3">
                <label class="block text-sm font-medium leading-6 text-gray-900">Start Date</label>
                <input type="text" placeholder="MM/YYYY" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2">
            </div>
            <div class="sm:col-span-3">
                <label class="block text-sm font-medium leading-6 text-gray-900">End Date</label>
                <input type="text" placeholder="MM/YYYY or Present" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2">
            </div>
            <div class="col-span-full">
                <label class="block text-sm font-medium leading-6 text-gray-900">Key Responsibilities</label>
                <textarea rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 p-2"></textarea>
            </div>
        </div>
    `;
    container.appendChild(div);
}

// Save a job to localStorage and re-render the list
function saveJob(jobTitle, companyName) {
    if (!savedJobsData.some(job => job.title === jobTitle && job.company === companyName)) {
        savedJobsData.push({ title: jobTitle, company: companyName });
        localStorage.setItem('savedJobs', JSON.stringify(savedJobsData));
        showNotification(`Job "${jobTitle}" saved!`, 2000);
        renderSavedJobs();
    } else {
        showNotification(`Job "${jobTitle}" is already saved.`, 2000);
    }
}

// Render the list of saved jobs
function renderSavedJobs() {
    const container = document.getElementById('savedJobsList');
    if (!container) return; // Only run on pages with the saved jobs list
    container.innerHTML = '';
    if (savedJobsData.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No jobs saved yet.</p>';
        return;
    }
    savedJobsData.forEach(job => {
        const div = document.createElement('div');
        div.className = 'border-b pb-2 mb-2';
        div.innerHTML = `
            <h5 class="font-semibold text-slate-700">${job.title}</h5>
            <p class="text-sm text-gray-600">${job.company}</p>
            <button class="removeSavedJobBtn text-xs text-red-500 hover:underline mt-1" data-job-title="${job.title}" data-company-name="${job.company}">Remove</button>
        `;
        container.appendChild(div);
    });
}

// Remove a job from localStorage and re-render the list
function removeSavedJob(jobTitle, companyName) {
    savedJobsData = savedJobsData.filter(job => !(job.title === jobTitle && job.company === companyName));
    localStorage.setItem('savedJobs', JSON.stringify(savedJobsData));
    showNotification(`Job "${jobTitle}" removed from saved list.`, 2000);
    renderSavedJobs();
}

// Attaches all event listeners for the site
function initializeEventListeners() {
    // Use event delegation on the body for dynamically added elements and general clicks
    document.body.addEventListener('click', function(event) {
        const target = event.target;
        const targetId = target.id;

        // --- Modals ---
        if (targetId === 'navLoginBtn') { openModal('loginModal'); }
        if (targetId === 'navSignupBtn') { openModal('signupModal'); }
        if (targetId === 'landingCompanySignupBtn' || targetId === 'landingDriverSignupBtn' || targetId === 'landingDispatcherSignupBtn') { openModal('signupModal'); }
        if (targetId === 'closeLoginModalBtn') { closeModal('loginModal'); }
        if (targetId === 'closeSignupModalBtn') { closeModal('signupModal'); }
        if (targetId === 'switchToSignupLink') { event.preventDefault(); closeModal('loginModal'); openModal('signupModal'); }
        if (targetId === 'switchToLoginLink') { event.preventDefault(); closeModal('signupModal'); openModal('loginModal'); }

        // --- Page redirections from buttons ---
        if (targetId === 'driverDashboardResumeBtn') { window.location.href = 'resume-builder.html'; }
        if (targetId === 'driverDashboardReviewBtn') { window.location.href = 'submit-review.html'; }
        if (targetId === 'findMoreJobsBtn') { window.location.href = 'job-listings.html'; }
        if (targetId === 'companyDashboardPostJobBtn') { window.location.href = 'post-job.html'; }
        if (targetId === 'companyDashboardEditProfileBtn') { window.location.href = 'edit-company-profile.html'; }
        if (targetId === 'viewApplicantsBackBtn') { window.location.href = 'company-dashboard.html'; }
        if (target.matches('.editJobBtn')) { window.location.href = 'edit-job.html'; }
        if (target.matches('.viewApplicantsBtn')) { window.location.href = 'view-applicants.html'; }
        if (target.matches('.viewApplyBtn')) { window.location.href = 'job-listings.html'; }
        if (targetId === 'postJobProceedBtn') { window.location.href = 'payment.html'; }
        if (target.matches('.pricingBtn')) { window.location.href = 'payment.html';}
        
        // --- Dynamic Actions ---
        if (target.matches('.saveJobBtn')) {
            saveJob(target.dataset.jobTitle, target.dataset.companyName);
        }
        if (target.matches('.removeSavedJobBtn')) {
            removeSavedJob(target.dataset.jobTitle, target.dataset.companyName);
        }
        if (target.matches('.applyForJobBtn')) {
            applyForJob(target.dataset.jobTitle);
        }
        if (targetId === 'addExperienceBtn') {
            addWorkExperience();
        }
    });

    // --- Form Submissions ---
    document.getElementById('loginForm')?.addEventListener('submit', handleLoginFormSubmit);
    document.getElementById('signupForm')?.addEventListener('submit', handleSignupFormSubmit);
    
    // Resume Builder Form
    document.getElementById('resumeBuilderForm')?.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        showNotification('Resume saved successfully! (Prototype)', 3000); 
        setTimeout(() => window.location.href = 'driver-dashboard.html', 1000);
    });
    
    // Company Review Form
    document.getElementById('companyReviewForm')?.addEventListener('submit', (e) => { 
        e.preventDefault(); 
        showNotification(`Review submitted! (Prototype)`, 3000);
        e.target.reset();
        setTimeout(() => window.location.href = 'driver-dashboard.html', 1000);
    });

    // Payment Form
    document.getElementById('paymentForm')?.addEventListener('submit', (e) => {
         e.preventDefault();
         showNotification(`Payment successful! (Prototype)`, 4000);
         setTimeout(() => window.location.href = 'company-dashboard.html', 1000);
    });

    // Edit Company Profile Form
    document.getElementById('editCompanyProfileForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Company profile updated successfully!', 3000);
        setTimeout(() => window.location.href = 'company-dashboard.html', 1000);
    });

    // Edit Job Form
    document.getElementById('editJobForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Job details saved successfully!', 3000);
        setTimeout(() => window.location.href = 'company-dashboard.html', 1000);
    });
}

