const authSection = document.getElementById('authSection');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const jobBoard = document.getElementById('jobBoard');
const logoutBtn = document.getElementById('logoutBtn');
const jobList = document.getElementById('jobList');
const postJobBtn = document.getElementById('postJobBtn');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const searchBar = document.getElementById('searchBar');

const jobOverlay = document.getElementById('jobOverlay');
const closeOverlay = document.getElementById('closeOverlay');
const jobForm = document.getElementById('jobForm');

let jobs = JSON.parse(localStorage.getItem('jobs')) || [];
let currentUser = localStorage.getItem('user');

// Switch login/register
if (showRegister) {
    showRegister.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
}
if (showLogin) {
    showLogin.addEventListener('click', () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });
}

// Auto-login check
if (currentUser) {
    showJobBoard(currentUser);
}

function showJobBoard(user) {
    authSection.style.display = "none";
    jobBoard.style.display = "block";
    logoutBtn.style.display = "inline-block";
    postJobBtn.style.display = "inline-block";
    searchBar.style.display = "block";
    displayJobs();
}

// Register
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value;
        let users = JSON.parse(localStorage.getItem('users')) || {};

        if (users[username]) {
            alert("Username already taken!");
            return;
        }
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        alert("Registration successful! Please log in.");
        registerForm.reset();
        showLogin.click();
    });
}

// Login
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        let users = JSON.parse(localStorage.getItem('users')) || {};

        if (users[username] && users[username] === password) {
            currentUser = username;
            localStorage.setItem('user', username);
            showJobBoard(username);
        } else {
            alert("Invalid username or password!");
        }
    });
}

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    currentUser = null;
    jobBoard.style.display = "none";
    authSection.style.display = "block";
    logoutBtn.style.display = "none";
    postJobBtn.style.display = "none";
    searchBar.style.display = "none";
});

// Display jobs with search
function displayJobs() {
    jobList.innerHTML = '';
    const keyword = searchBar.value.toLowerCase();
    jobs
        .filter(job => 
            job.title.toLowerCase().includes(keyword) ||
            job.description.toLowerCase().includes(keyword)
        )
        .forEach((job, index) => {
            const jobDiv = renderJob(job, index);
            jobList.appendChild(jobDiv);
        });
}

function deleteJob(index) {
    jobs.splice(index, 1);
    localStorage.setItem('jobs', JSON.stringify(jobs));
    displayJobs();
}

// Post job overlay toggle
postJobBtn.addEventListener('click', () => {
    jobOverlay.style.display = "flex";
});

if (closeOverlay) {
    closeOverlay.addEventListener('click', () => {
        jobOverlay.style.display = "none";
    });
}

// Post job
if (jobForm) {
    jobForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const contact = document.getElementById('contact').value;
        const date = new Date().toLocaleString();

        jobs.push({ title, description, contact, postedBy: currentUser, date });
        localStorage.setItem('jobs', JSON.stringify(jobs));
        jobForm.reset();
        jobOverlay.style.display = "none";
        displayJobs();
    });
}

// Live search
searchBar.addEventListener('input', displayJobs);

// ========== Job rendering ==========
function renderJob(job, index) {
    const jobDiv = document.createElement('div');
    jobDiv.className = 'job';

    jobDiv.innerHTML = `
        <h3>${job.title}</h3>
        <p>${job.description}</p>
        <small>Contact: ${job.contact}</small><br>
        <small>Posted by: ${job.postedBy} on ${job.date}</small><br>
    `;

    if (job.postedBy === currentUser) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteJob(index);
        jobDiv.appendChild(deleteBtn);
    }

    return jobDiv;
}