// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const updateFeed = document.getElementById('update-feed');
const infoCards = document.getElementById('info-cards');

// Modal elements
const updateModal = document.getElementById('update-modal');
const infoModal = document.getElementById('info-modal');
const adminModal = document.getElementById('admin-modal');
const updateForm = document.getElementById('update-form');
const infoForm = document.getElementById('info-form');
const adminForm = document.getElementById('admin-form');

// Admin system
let isAdminAuthenticated = false;
let pendingAdminAction = null;
const ADMIN_PASSWORD = 'admin123';

// Data arrays - now populated from backend
let updates = [];
let importantInfo = [];

let currentEditingUpdate = null;
let currentEditingInfo = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initPage();
    setupEventListeners();
});

function setupEventListeners() {
    // Existing event listeners
    hamburger.addEventListener('click', toggleMobileMenu);
    document.addEventListener('click', handleOutsideClick);
    window.addEventListener('scroll', handleScroll);

    // Admin-protected action listeners
    document.getElementById('add-update-btn').addEventListener('click', () => requireAdmin(() => openUpdateModal()));
    document.getElementById('add-info-btn').addEventListener('click', () => requireAdmin(() => openInfoModal()));
    
    // Modal close events
    document.getElementById('close-update-modal').addEventListener('click', closeUpdateModal);
    document.getElementById('close-info-modal').addEventListener('click', closeInfoModal);
    document.getElementById('close-admin-modal').addEventListener('click', closeAdminModal);
    document.getElementById('cancel-update').addEventListener('click', closeUpdateModal);
    document.getElementById('cancel-info').addEventListener('click', closeInfoModal);
    document.getElementById('cancel-admin').addEventListener('click', closeAdminModal);
    
    // Form submissions
    updateForm.addEventListener('submit', handleUpdateSubmit);
    infoForm.addEventListener('submit', handleInfoSubmit);
    adminForm.addEventListener('submit', handleAdminSubmit);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === updateModal) closeUpdateModal();
        if (e.target === infoModal) closeInfoModal();
        if (e.target === adminModal) closeAdminModal();
    });
}

function handleOutsideClick(e) {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
}

// Admin Authentication System
function requireAdmin(action) {
    if (isAdminAuthenticated) {
        action();
    } else {
        pendingAdminAction = action;
        openAdminModal();
    }
}

function openAdminModal() {
    adminModal.style.display = 'block';
    document.getElementById('admin-password').focus();
    hidePasswordError();
}

function closeAdminModal() {
    adminModal.style.display = 'none';
    adminForm.reset();
    pendingAdminAction = null;
    hidePasswordError();
}

function handleAdminSubmit(e) {
    e.preventDefault();
    
    const password = document.getElementById('admin-password').value;
    
    if (password === ADMIN_PASSWORD) {
        isAdminAuthenticated = true;
        closeAdminModal();
        
        // Execute pending action
        if (pendingAdminAction) {
            pendingAdminAction();
            pendingAdminAction = null;
        }
        
        // Auto-logout after 30 minutes of inactivity
        setTimeout(() => {
            isAdminAuthenticated = false;
        }, 30 * 60 * 1000);
        
    } else {
        showPasswordError();
        document.getElementById('admin-password').value = '';
        document.getElementById('admin-password').focus();
    }
}

function showPasswordError() {
    document.getElementById('password-error').style.display = 'block';
}

function hidePasswordError() {
    document.getElementById('password-error').style.display = 'none';
}

// Initialize page
async function initPage() {
    try {
        await loadUpdates();
        await loadInfo();
        animateResourceCards();
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

// API Functions for Updates
async function loadUpdates() {
    try {
        const response = await fetch('/api/updates');
        if (response.ok) {
            updates = await response.json();
            populateUpdatesFeed();
        } else {
            console.error('Failed to load updates');
        }
    } catch (error) {
        console.error('Error loading updates:', error);
    }
}

async function saveUpdate(updateData) {
    try {
        const response = await fetch('/api/updates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            const newUpdate = await response.json();
            updates.unshift(newUpdate);
            populateUpdatesFeed();
            return true;
        } else {
            console.error('Failed to save update');
            return false;
        }
    } catch (error) {
        console.error('Error saving update:', error);
        return false;
    }
}

async function updateUpdate(id, updateData) {
    try {
        const response = await fetch(`/api/updates/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            const updatedUpdate = await response.json();
            const index = updates.findIndex(u => u._id === id);
            if (index !== -1) {
                updates[index] = updatedUpdate;
                populateUpdatesFeed();
            }
            return true;
        } else {
            console.error('Failed to update');
            return false;
        }
    } catch (error) {
        console.error('Error updating:', error);
        return false;
    }
}

async function deleteUpdateFromServer(id) {
    try {
        const response = await fetch(`/api/updates/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            updates = updates.filter(u => u._id !== id);
            populateUpdatesFeed();
            return true;
        } else {
            console.error('Failed to delete update');
            return false;
        }
    } catch (error) {
        console.error('Error deleting update:', error);
        return false;
    }
}

// API Functions for Info
async function loadInfo() {
    try {
        const response = await fetch('/api/info');
        if (response.ok) {
            importantInfo = await response.json();
            populateInfoCards();
        } else {
            console.error('Failed to load info');
        }
    } catch (error) {
        console.error('Error loading info:', error);
    }
}

async function saveInfo(infoData) {
    try {
        const response = await fetch('/api/info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(infoData)
        });
        
        if (response.ok) {
            const newInfo = await response.json();
            importantInfo.unshift(newInfo);
            populateInfoCards();
            return true;
        } else {
            console.error('Failed to save info');
            return false;
        }
    } catch (error) {
        console.error('Error saving info:', error);
        return false;
    }
}

async function updateInfo(id, infoData) {
    try {
        const response = await fetch(`/api/info/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(infoData)
        });
        
        if (response.ok) {
            const updatedInfo = await response.json();
            const index = importantInfo.findIndex(i => i._id === id);
            if (index !== -1) {
                importantInfo[index] = updatedInfo;
                populateInfoCards();
            }
            return true;
        } else {
            console.error('Failed to update info');
            return false;
        }
    } catch (error) {
        console.error('Error updating info:', error);
        return false;
    }
}

async function deleteInfoFromServer(id) {
    try {
        const response = await fetch(`/api/info/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            importantInfo = importantInfo.filter(i => i._id !== id);
            populateInfoCards();
            return true;
        } else {
            console.error('Failed to delete info');
            return false;
        }
    } catch (error) {
        console.error('Error deleting info:', error);
        return false;
    }
}

// Updates CRUD Functions
function populateUpdatesFeed() {
    updateFeed.innerHTML = '';
    
    updates.forEach((update, index) => {
        const updateEl = document.createElement('div');
        updateEl.className = 'update-item';
        updateEl.style.animationDelay = `${index * 0.1}s`;
        
        const importantBadge = update.important ? '<span class="badge">Important</span>' : '';
        const formattedDate = formatDate(update.date);
        
        updateEl.innerHTML = `
            <div class="update-header">
                <h3>${update.title} ${importantBadge}</h3>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="requireAdmin(() => editUpdate('${update._id}'))">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="delete-btn" onclick="requireAdmin(() => deleteUpdate('${update._id}'))">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p>${update.content}</p>
            <div class="update-meta">
                <span class="date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                <a href="#" class="read-more">Read More</a>
            </div>
        `;
        
        if (update.important) {
            updateEl.classList.add('important');
        }
        
        updateFeed.appendChild(updateEl);
    });
}

function openUpdateModal(update = null) {
    currentEditingUpdate = update;
    const modalTitle = document.getElementById('update-modal-title');
    
    if (update) {
        modalTitle.textContent = 'Edit Update';
        document.getElementById('update-title').value = update.title;
        document.getElementById('update-content').value = update.content;
        document.getElementById('update-date').value = update.date;
        document.getElementById('update-important').checked = update.important;
    } else {
        modalTitle.textContent = 'Add Update';
        updateForm.reset();
        // Set default date to today
        document.getElementById('update-date').value = new Date().toISOString().split('T')[0];
    }
    
    updateModal.style.display = 'block';
}

function closeUpdateModal() {
    updateModal.style.display = 'none';
    currentEditingUpdate = null;
    updateForm.reset();
}

async function handleUpdateSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(updateForm);
    const updateData = {
        title: formData.get('title'),
        content: formData.get('content'),
        date: formData.get('date'),
        important: formData.has('important')
    };
    
    let success = false;
    
    if (currentEditingUpdate) {
        // Update existing
        success = await updateUpdate(currentEditingUpdate._id, updateData);
    } else {
        // Add new
        success = await saveUpdate(updateData);
    }
    
    if (success) {
        closeUpdateModal();
    } else {
        alert('Failed to save update. Please try again.');
    }
}

function editUpdate(id) {
    const update = updates.find(u => u._id === id);
    if (update) {
        openUpdateModal(update);
    }
}

async function deleteUpdate(id) {
    if (confirm('Are you sure you want to delete this update?')) {
        await deleteUpdateFromServer(id);
    }
}

// Important Info CRUD Functions
function populateInfoCards() {
    infoCards.innerHTML = '';
    
    importantInfo.forEach((info, index) => {
        const infoEl = document.createElement('div');
        infoEl.className = 'info-card';
        infoEl.style.animationDelay = `${index * 0.1}s`;
        
        const formattedDate = formatDate(info.date);
        
        infoEl.innerHTML = `
            <div class="info-header">
                <h3>${info.title}</h3>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="requireAdmin(() => editInfo('${info._id}'))">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="delete-btn" onclick="requireAdmin(() => deleteInfo('${info._id}'))">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p>${info.content}</p>
            <div class="info-meta">
                <span class="date">${formattedDate}</span>
            </div>
        `;
        
        infoCards.appendChild(infoEl);
    });
}

function openInfoModal(info = null) {
    currentEditingInfo = info;
    const modalTitle = document.getElementById('info-modal-title');
    
    if (info) {
        modalTitle.textContent = 'Edit Information';
        document.getElementById('info-title').value = info.title;
        document.getElementById('info-content').value = info.content;
        document.getElementById('info-date').value = info.date;
    } else {
        modalTitle.textContent = 'Add Information';
        infoForm.reset();
        // Set default date to today
        document.getElementById('info-date').value = new Date().toISOString().split('T')[0];
    }
    
    infoModal.style.display = 'block';
}

function closeInfoModal() {
    infoModal.style.display = 'none';
    currentEditingInfo = null;
    infoForm.reset();
}

async function handleInfoSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(infoForm);
    const infoData = {
        title: formData.get('title'),
        content: formData.get('content'),
        date: formData.get('date')
    };
    
    let success = false;
    
    if (currentEditingInfo) {
        // Update existing
        success = await updateInfo(currentEditingInfo._id, infoData);
    } else {
        // Add new
        success = await saveInfo(infoData);
    }
    
    if (success) {
        closeInfoModal();
    } else {
        alert('Failed to save information. Please try again.');
    }
}

function editInfo(id) {
    const info = importantInfo.find(i => i._id === id);
    if (info) {
        openInfoModal(info);
    }
}

async function deleteInfo(id) {
    if (confirm('Are you sure you want to delete this information?')) {
        await deleteInfoFromServer(id);
    }
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function animateResourceCards() {
    const cards = document.querySelectorAll('.resource-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    if (hamburger.classList.contains('active')) {
        hamburger.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        hamburger.children[1].style.opacity = '0';
        hamburger.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        hamburger.children[0].style.transform = 'none';
        hamburger.children[1].style.opacity = '1';
        hamburger.children[2].style.transform = 'none';
    }
}

function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    animateOnScroll();
}

function animateOnScroll() {
    const elements = document.querySelectorAll('.resources-grid, .info-cards, .update-feed');
    
    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            el.classList.add('animated');
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
});