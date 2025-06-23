document.addEventListener('DOMContentLoaded', function() {
    const PASSWORD = "admin123"; // Change this to your desired password
    
    // Initialize college management when DOM loads
    initializeCollegeManagement();
    
    // Smooth scrolling for college logos to their respective alumni sections
    const collegeItems = document.querySelectorAll('.college-item');
    
    collegeItems.forEach(item => {
        item.addEventListener('click', function() {
            const universityId = this.querySelector('img').alt.toLowerCase().replace(/\s+/g, '-');
            const targetSection = document.getElementById(universityId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the section briefly
                targetSection.style.backgroundColor = 'rgba(58, 139, 79, 0.1)';
                setTimeout(() => {
                    targetSection.style.backgroundColor = 'transparent';
                }, 2000);
            }
        });
    });
    
    // Card flip functionality - changed from hover to click
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't flip if clicking on edit icons or delete button
            if (e.target.classList.contains('edit-icon') || 
                e.target.classList.contains('delete-btn') ||
                e.target.closest('.delete-btn') ||
                e.target.closest('.edit-icon')) {
                return;
            }
            
            const cardInner = this.querySelector('.card-inner');
            cardInner.classList.toggle('flipped');
        });
    });
    
    // Add button functionality
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', showAddModal);
    }
    
    // Edit functionality
    const editIcons = document.querySelectorAll('.edit-icon');
    editIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const field = this.dataset.field;
            const cardId = this.dataset.cardId;
            const currentValue = this.dataset.currentValue;
            showEditModal(field, cardId, currentValue);
        });
    });
    
    // Delete functionality
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const cardId = this.dataset.cardId;
            showDeleteConfirmation(cardId);
        });
    });
    
    // Modal functions
    function showAddModal() {
        showPasswordPrompt(() => {
            const modal = createAddModal();
            document.body.appendChild(modal);
            modal.style.display = 'block';
        });
    }
    
    function showEditModal(field, cardId, currentValue) {
        showPasswordPrompt(() => {
            const modal = createEditModal(field, cardId, currentValue);
            document.body.appendChild(modal);
            modal.style.display = 'block';
        });
    }
    
    function showDeleteConfirmation(cardId) {
        showPasswordPrompt(() => {
            if (confirm('Are you sure you want to delete this alumni card?')) {
                deleteAlumni(cardId);
            }
        });
    }
    
    // Password prompt function - shared by both alumni and college functions
    window.showPasswordPrompt = function(onSuccess) {
        const modal = createPasswordModal(onSuccess);
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }
    
    function createPasswordModal(onSuccess) {
        const modal = document.createElement('div');
        modal.className = 'modal password-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Enter Password</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="password">Password:</label>
                        <input type="password" id="password" placeholder="Enter password">
                        <div class="error" id="password-error"></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
                    <button type="button" class="btn btn-primary confirm-btn">Confirm</button>
                </div>
            </div>
        `;
        
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const confirmBtn = modal.querySelector('.confirm-btn');
        const passwordInput = modal.querySelector('#password');
        const errorDiv = modal.querySelector('#password-error');
        
        function closeModal() {
            modal.remove();
        }
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        confirmBtn.addEventListener('click', () => {
            const enteredPassword = passwordInput.value;
            if (enteredPassword === PASSWORD) {
                closeModal();
                onSuccess();
            } else {
                errorDiv.textContent = 'Incorrect password';
                passwordInput.classList.add('error');
            }
        });
        
        passwordInput.addEventListener('input', () => {
            errorDiv.textContent = '';
            passwordInput.classList.remove('error');
        });
        
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                confirmBtn.click();
            }
        });
        
        // Focus password input after modal appears
        setTimeout(() => passwordInput.focus(), 100);
        
        return modal;
    }
    
    function createAddModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Add New Alumni</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="add-form" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="name">Name:</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="college">College:</label>
                            <input type="text" id="college" name="college" required>
                        </div>
                        <div class="form-group">
                            <label for="year">Year:</label>
                            <input type="text" id="year" name="year" required>
                        </div>
                        <div class="form-group">
                            <label for="major">Major:</label>
                            <input type="text" id="major" name="major" required>
                        </div>
                        <div class="form-group">
                            <label for="image">Profile Image:</label>
                            <input type="file" id="image" name="image" accept="image/*" required>
                            <small class="form-text">Choose an image file from your computer</small>
                        </div>
                        <div class="form-group">
                            <label for="achievement">Achievement:</label>
                            <textarea id="achievement" name="achievement" required></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
                    <button type="submit" form="add-form" class="btn btn-primary save-btn">Add Alumni</button>
                </div>
            </div>
        `;
        
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const saveBtn = modal.querySelector('.save-btn');
        const form = modal.querySelector('#add-form');
        
        function closeModal() {
            modal.remove();
        }
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            
            if (validateFormWithFile(formData)) {
                addAlumni(formData);
                closeModal();
            }
        });
        
        // Also handle button click for backwards compatibility
        saveBtn.addEventListener('click', (e) => {
            if (e.target.type !== 'submit') {
                e.preventDefault();
                const formData = new FormData(form);
                
                if (validateFormWithFile(formData)) {
                    addAlumni(formData);
                    closeModal();
                }
            }
        });
        
        // Allow Enter key to submit in text inputs (but not file inputs)
        const inputs = form.querySelectorAll('input[type="text"], textarea');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    form.dispatchEvent(new Event('submit'));
                }
            });
        });
        
        return modal;
    }
    
    function createEditModal(field, cardId, currentValue) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const fieldLabels = {
            name: 'Name',
            college: 'College',
            year: 'Year',
            major: 'Major',
            image: 'Profile Image',
            achievement: 'Achievement'
        };
        
        const isTextarea = field === 'achievement';
        const isImage = field === 'image';
        
        let inputHTML;
        if (isImage) {
            inputHTML = `
                <input type="file" id="edit-field" accept="image/*" required>
                <small class="form-text">Choose a new image file from your computer</small>
                <div class="current-image-preview">
                    <p>Current image:</p>
                    <img src="${currentValue}" alt="Current image" style="max-width: 100px; max-height: 100px; object-fit: cover; border-radius: 4px;">
                </div>
            `;
        } else if (isTextarea) {
            inputHTML = `<textarea id="edit-field" required>${currentValue}</textarea>`;
        } else {
            inputHTML = `<input type="text" id="edit-field" value="${currentValue}" required>`;
        }
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Edit ${fieldLabels[field]}</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="edit-form" ${isImage ? 'enctype="multipart/form-data"' : ''}>
                        <div class="form-group">
                            <label for="edit-field">${fieldLabels[field]}:</label>
                            ${inputHTML}
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
                    <button type="button" class="btn btn-primary save-btn">Save Changes</button>
                </div>
            </div>
        `;
        
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const saveBtn = modal.querySelector('.save-btn');
        const input = modal.querySelector('#edit-field');
        const form = modal.querySelector('#edit-form');
        
        function closeModal() {
            modal.remove();
        }
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        saveBtn.addEventListener('click', () => {
            if (isImage) {
                const file = input.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('image', file);
                    updateAlumniWithFile(cardId, field, formData);
                    closeModal();
                } else {
                    alert('Please select an image file');
                }
            } else {
                const newValue = input.value.trim();
                if (newValue) {
                    updateAlumni(cardId, field, newValue);
                    closeModal();
                }
            }
        });
        
        // Focus input after modal appears (but not for file inputs)
        if (!isImage) {
            setTimeout(() => input.focus(), 100);
        }
        
        return modal;
    }
    
    function validateForm(data) {
        for (let key in data) {
            if (!data[key].trim()) {
                alert(`Please fill in the ${key} field`);
                return false;
            }
        }
        return true;
    }
    
    function validateFormWithFile(formData) {
        const requiredFields = ['name', 'college', 'year', 'major', 'achievement'];
        
        for (let field of requiredFields) {
            const value = formData.get(field);
            if (!value || !value.toString().trim()) {
                alert(`Please fill in the ${field} field`);
                return false;
            }
        }
        
        const imageFile = formData.get('image');
        if (!imageFile || imageFile.size === 0) {
            alert('Please select an image file');
            return false;
        }
        
        // Check if it's actually an image
        if (!imageFile.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return false;
        }
        
        return true;
    }
    
  function updateCardDisplay(card, field, newValue) {
    const cardBack = card.querySelector('.card-back');
    let element;
    
    switch(field) {
        case 'name':
            element = cardBack.querySelector('.card-name');
            // Update the text content directly, preserving the edit icon
            const nameEditIcon = element.querySelector('.edit-icon');
            element.innerHTML = newValue;
            element.appendChild(nameEditIcon);
            break;
        case 'college':
            element = cardBack.querySelector('.card-college');
            // Update the text content directly, preserving the edit icon
            const collegeEditIcon = element.querySelector('.edit-icon');
            element.innerHTML = newValue;
            element.appendChild(collegeEditIcon);
            break;
        case 'year':
            element = cardBack.querySelector('.card-year');
            // Update the text content directly, preserving the edit icon
            const yearEditIcon = element.querySelector('.edit-icon');
            element.innerHTML = newValue;
            element.appendChild(yearEditIcon);
            break;
        case 'major':
            element = cardBack.querySelector('.card-major');
            // Update the text content directly, preserving the edit icon
            const majorEditIcon = element.querySelector('.edit-icon');
            element.innerHTML = newValue;
            element.appendChild(majorEditIcon);
            break;
        case 'achievement':
            element = cardBack.querySelector('.card-achievement');
            // Update the text content directly, preserving the edit icon
            const achievementEditIcon = element.querySelector('.edit-icon');
            element.innerHTML = newValue;
            element.appendChild(achievementEditIcon);
            break;
        case 'image':
            const cardFront = card.querySelector('.card-front img');
            cardFront.src = newValue;
            break;
    }
    
    // Update data attributes for edit icons
    const editIcon = card.querySelector(`[data-field="${field}"]`);
    if (editIcon) {
        editIcon.dataset.currentValue = newValue;
    }
}
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.remove();
        }
    });
});

// API Functions for Alumni Management
async function deleteAlumni(id) {
    try {
        await fetch('/delete/alumni/' + id, {method:'DELETE'});
        window.location.href="/alumni";
    } catch (error) {
        console.error('Error deleting alumni:', error);
        alert('Failed to delete alumni');
    }
}

// Fixed updateAlumni function for text fields
async function updateAlumni(id, field, newValue) {
    try {
        const updateData = {};
        updateData[field] = newValue;
        
        await fetch('/alumni/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });

        window.location.href = '/alumni';
    } catch (error) {
        console.error('Error updating alumni:', error);
        alert('Failed to update alumni');
    }
}

// New function for updating alumni with file upload
async function updateAlumniWithFile(id, field, formData) {
    try {
        await fetch(`/alumni/${id}/${field}`, {
            method: 'PATCH',
            body: formData // Don't set Content-Type header - let browser set it for multipart/form-data
        });

        window.location.href = '/alumni';
    } catch (error) {
        console.error('Error updating alumni with file:', error);
        alert('Failed to update alumni');
    }
}

// Updated addAlumni function to handle FormData
async function addAlumni(formData) {
    try {
        const response = await fetch('/add/alumni', {
            method: 'POST',
            body: formData // Don't set Content-Type header - let browser set it for multipart/form-data
        });
        
        if (response.ok) {
            window.location.href = '/alumni';
        } else {
            alert('Failed to add alumni');
        }
    } catch (error) {
        console.error('Error adding alumni:', error);
        alert('Failed to add alumni');
    }
}

// College Management Functions
function initializeCollegeManagement() {
    console.log('Initializing college management...');
    
    // Add college button
    const collegeAddBtn = document.querySelector('.college-add-btn');
    if (collegeAddBtn) {
        console.log('Found college add button');
        collegeAddBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('College add button clicked');
            showAddCollegeModal();
        });
    } else {
        console.log('College add button not found');
    }
    
    // College edit buttons
    const collegeEditBtns = document.querySelectorAll('.college-edit-btn');
    console.log('Found', collegeEditBtns.length, 'college edit buttons');
    collegeEditBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const collegeId = this.dataset.collegeId;
            const currentName = this.dataset.currentName;
            const currentImage = this.dataset.currentImage;
            const currentCount = this.dataset.currentCount;
            console.log('Editing college:', collegeId, currentName);
            showEditCollegeModal(collegeId, currentName, currentImage, currentCount);
        });
    });
    
    // College delete buttons
    const collegeDeleteBtns = document.querySelectorAll('.college-delete-btn');
    console.log('Found', collegeDeleteBtns.length, 'college delete buttons');
    collegeDeleteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const collegeId = this.dataset.collegeId;
            console.log('Deleting college:', collegeId);
            showDeleteCollegeConfirmation(collegeId);
        });
    });
}

function showAddCollegeModal() {
    console.log('Showing add college modal');
    showPasswordPrompt(() => {
        const modal = createAddCollegeModal();
        document.body.appendChild(modal);
        modal.style.display = 'block';
    });
}

function showEditCollegeModal(collegeId, currentName, currentImage, currentCount) {
    console.log('Showing edit college modal for:', collegeId);
    showPasswordPrompt(() => {
        const modal = createEditCollegeModal(collegeId, currentName, currentImage, currentCount);
        document.body.appendChild(modal);
        modal.style.display = 'block';
    });
}

function showDeleteCollegeConfirmation(collegeId) {
    console.log('Showing delete confirmation for college:', collegeId);
    showPasswordPrompt(() => {
        if (confirm('Are you sure you want to delete this college?')) {
            deleteCollege(collegeId);
        }
    });
}

function createAddCollegeModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Add New College</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <form id="add-college-form" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="college-name">College Name:</label>
                        <input type="text" id="college-name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="college-image">College Logo:</label>
                        <input type="file" id="college-image" name="imageUrl" accept="image/*" required>
                        <small class="form-text">Choose a logo image file from your computer</small>
                    </div>
                    <div class="form-group">
                        <label for="college-count">Alumni Count:</label>
                        <input type="number" id="college-count" name="count" min="0" value="0" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
                <button type="submit" form="add-college-form" class="btn btn-primary save-btn">Add College</button>
            </div>
        </div>
    `;
    
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = modal.querySelector('#add-college-form');
    
    function closeModal() {
        modal.remove();
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        if (validateCollegeFormWithFile(formData)) {
            addCollege(formData);
            closeModal();
        }
    });
    
    // Focus first input after modal appears
    setTimeout(() => {
        const firstInput = modal.querySelector('#college-name');
        if (firstInput) firstInput.focus();
    }, 100);
    
    return modal;
}

function createEditCollegeModal(collegeId, currentName, currentImage, currentCount) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Edit College</h3>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <form id="edit-college-form" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="edit-college-name">College Name:</label>
                        <input type="text" id="edit-college-name" name="name" value="${currentName}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-college-image">College Logo:</label>
                        <input type="file" id="edit-college-image" name="imageUrl" accept="image/*">
                        <small class="form-text">Choose a new logo image file (leave empty to keep current logo)</small>
                        <div class="current-image-preview">
                            <p>Current logo:</p>
                            <img src="${currentImage}" alt="Current logo" style="max-width: 100px; max-height: 100px; object-fit: cover; border-radius: 4px;">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit-college-count">Alumni Count:</label>
                        <input type="number" id="edit-college-count" name="count" value="${currentCount}" min="0" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary cancel-btn">Cancel</button>
                <button type="submit" form="edit-college-form" class="btn btn-primary save-btn">Save Changes</button>
            </div>
        </div>
    `;
    
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = modal.querySelector('#edit-college-form');
    
    function closeModal() {
        modal.remove();
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        if (validateCollegeFormForEdit(formData)) {
            updateCollege(collegeId, formData);
            closeModal();
        }
    });
    
    // Focus first input after modal appears
    setTimeout(() => {
        const firstInput = modal.querySelector('#edit-college-name');
        if (firstInput) firstInput.focus();
    }, 100);
    
    return modal;
}

function validateCollegeForm(data) {
    for (let key in data) {
        if (!data[key].toString().trim()) {
            alert(`Please fill in the ${key} field`);
            return false;
        }
    }
    
    // Validate count is a positive number
    if (parseInt(data.count) < 0) {
        alert('Alumni count cannot be negative');
        return false;
    }
    
    return true;
}

function validateCollegeFormWithFile(formData) {
    const name = formData.get('name');
    const count = formData.get('count');
    const imageFile = formData.get('imageUrl');
    
    if (!name || !name.toString().trim()) {
        alert('Please fill in the college name');
        return false;
    }
    
    if (!count || parseInt(count) < 0) {
        alert('Please provide a valid alumni count (0 or greater)');
        return false;
    }
    
    if (!imageFile || imageFile.size === 0) {
        alert('Please select a logo image file');
        return false;
    }
    
    if (!imageFile.type.startsWith('image/')) {
        alert('Please select a valid image file for the logo');
        return false;
    }
    
    return true;
}

function validateCollegeFormForEdit(formData) {
    const name = formData.get('name');
    const count = formData.get('count');
    const imageFile = formData.get('imageUrl');
    
    if (!name || !name.toString().trim()) {
        alert('Please fill in the college name');
        return false;
    }
    
    if (!count || parseInt(count) < 0) {
        alert('Please provide a valid alumni count (0 or greater)');
        return false;
    }
    
    // For edit, image is optional
    if (imageFile && imageFile.size > 0 && !imageFile.type.startsWith('image/')) {
        alert('Please select a valid image file for the logo');
        return false;
    }
    
    return true;
}

// API Functions for College Management - Updated to handle FormData
async function addCollege(formData) {
    try {
        console.log('Adding college with form data');
        const response = await fetch('/add/college', {
            method: 'POST',
            body: formData // Don't set Content-Type header - let browser set it for multipart/form-data
        });
        
        if (response.ok) {
            console.log('College added successfully');
            window.location.href = '/alumni';
        } else {
            console.error('Failed to add college:', response.status);
            alert('Failed to add college');
        }
    } catch (error) {
        console.error('Error adding college:', error);
        alert('Failed to add college');
    }
}

async function updateCollege(collegeId, formData) {
    try {
        console.log('Updating college:', collegeId);
        const response = await fetch(`/college/${collegeId}`, {
            method: 'PATCH',
            body: formData // Don't set Content-Type header - let browser set it for multipart/form-data
        });
        
        if (response.ok) {
            console.log('College updated successfully');
            window.location.href = '/alumni';
        } else {
            console.error('Failed to update college:', response.status);
            alert('Failed to update college');
        }
    } catch (error) {
        console.error('Error updating college:', error);
        alert('Failed to update college');
    }
}

async function deleteCollege(collegeId) {
    try {
        console.log('Deleting college:', collegeId);
        const response = await fetch(`/delete/college/${collegeId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            console.log('College deleted successfully');
            window.location.href = '/alumni';
        } else {
            console.error('Failed to delete college:', response.status);
            alert('Failed to delete college');
        }
    } catch (error) {
        console.error('Error deleting college:', error);
        alert('Failed to delete college');
    }
}