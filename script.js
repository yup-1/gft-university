// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const studentIdInput = document.getElementById('student-id');
const studentName = document.getElementById('student-name');
const logoutBtn = document.getElementById('logout-btn');

// ID Card Elements
const dormUploadArea = document.getElementById('dorm-upload-area');
const libraryUploadArea = document.getElementById('library-upload-area');
const gymUploadArea = document.getElementById('gym-upload-area');

const dormFileInput = document.getElementById('dorm-file');
const libraryFileInput = document.getElementById('library-file');
const gymFileInput = document.getElementById('gym-file');

const dormPreview = document.getElementById('dorm-preview');
const libraryPreview = document.getElementById('library-preview');
const gymPreview = document.getElementById('gym-preview');

// Save Buttons
const saveButtons = document.querySelectorAll('.save-btn');

// Current user
let currentUser = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkLoginStatus();
    
    // Setup event listeners
    setupEventListeners();
});

// Check if user is already logged in
function checkLoginStatus() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showDashboard();
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Login form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // File input clicks
    dormUploadArea.addEventListener('click', () => dormFileInput.click());
    libraryUploadArea.addEventListener('click', () => libraryFileInput.click());
    gymUploadArea.addEventListener('click', () => gymFileInput.click());
    
    // File input changes
    dormFileInput.addEventListener('change', function(e) {
        handleFileSelect(e, dormPreview);
    });
    
    libraryFileInput.addEventListener('change', function(e) {
        handleFileSelect(e, libraryPreview);
    });
    
    gymFileInput.addEventListener('change', function(e) {
        handleFileSelect(e, gymPreview);
    });
    
    // Drag and drop events for dorm
    setupDragAndDrop(dormUploadArea, dormFileInput);
    
    // Drag and drop events for library
    setupDragAndDrop(libraryUploadArea, libraryFileInput);
    
    // Drag and drop events for gym
    setupDragAndDrop(gymUploadArea, gymFileInput);
    
    // Save buttons
    saveButtons.forEach(button => {
        button.addEventListener('click', handleSaveId);
    });
}

// Setup drag and drop functionality
function setupDragAndDrop(uploadArea, fileInput) {
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    });
}

// Handle file selection
function handleFileSelect(event, previewElement) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElement.src = e.target.result;
            previewElement.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const studentId = studentIdInput.value.trim();
    
    if (studentId) {
        // In a real app, you would validate the student ID against a database
        // For this demo, we'll accept any non-empty ID
        currentUser = {
            id: studentId,
            name: `Student ${studentId}`
        };
        
        // Save current user to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Load saved ID cards if they exist
        loadSavedIdCards();
        
        showDashboard();
    } else {
        alert('Please enter your student ID');
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLogin();
}

// Show dashboard
function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    studentName.textContent = currentUser.name;
}

// Show login
function showLogin() {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    studentIdInput.value = '';
}

// Handle saving ID cards
function handleSaveId(e) {
    const idType = e.target.dataset.type;
    
    let previewElement;
    let fileInput;
    
    switch(idType) {
        case 'dorm':
            previewElement = dormPreview;
            fileInput = dormFileInput;
            break;
        case 'library':
            previewElement = libraryPreview;
            fileInput = libraryFileInput;
            break;
        case 'gym':
            previewElement = gymPreview;
            fileInput = gymFileInput;
            break;
    }
    
    if (previewElement.src && previewElement.src !== window.location.href) {
        // Save to localStorage
        saveIdCard(idType, previewElement.src);
        alert(`${getIdTypeName(idType)} saved successfully!`);
    } else {
        alert(`Please select an image for your ${getIdTypeName(idType)} first`);
    }
}

// Get ID type name for display
function getIdTypeName(idType) {
    switch(idType) {
        case 'dorm': return 'Dorm ID';
        case 'library': return 'Library ID';
        case 'gym': return 'Gym ID';
        default: return 'ID';
    }
}

// Save ID card to localStorage
function saveIdCard(idType, imageData) {
    if (!currentUser) return;
    
    const userId = currentUser.id;
    const storageKey = `idCards_${userId}`;
    
    // Get existing ID cards or initialize empty object
    let idCards = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    // Save the new ID card
    idCards[idType] = imageData;
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(idCards));
}

// Load saved ID cards
function loadSavedIdCards() {
    if (!currentUser) return;
    
    const userId = currentUser.id;
    const storageKey = `idCards_${userId}`;
    
    const idCards = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    // Load dorm ID if it exists
    if (idCards.dorm) {
        dormPreview.src = idCards.dorm;
        dormPreview.style.display = 'block';
    }
    
    // Load library ID if it exists
    if (idCards.library) {
        libraryPreview.src = idCards.library;
        libraryPreview.style.display = 'block';
    }
    
    // Load gym ID if it exists
    if (idCards.gym) {
        gymPreview.src = idCards.gym;
        gymPreview.style.display = 'block';
    }
}
