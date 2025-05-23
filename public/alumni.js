document.addEventListener('DOMContentLoaded', function() {
    const PASSWORD = "admin123"; // Change this to your desired password
    
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
    
    function showPasswordPrompt(onSuccess) {
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
                    <form id="add-form">
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
                            <label for="image">Image URL:</label>
                            <input type="url" id="image" name="image" required>
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
            const data = Object.fromEntries(formData);
            
            if (validateForm(data)) {
                addAlumni(data);
                closeModal();
            }
        });
        
        // Also handle button click for backwards compatibility
        saveBtn.addEventListener('click', (e) => {
            if (e.target.type !== 'submit') {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                if (validateForm(data)) {
                    addAlumni(data);
                    closeModal();
                }
            }
        });
        
        // Allow Enter key to submit in text inputs
        const inputs = form.querySelectorAll('input');
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
            image: 'Image URL',
            achievement: 'Achievement'
        };
        
        const isTextarea = field === 'achievement';
        const inputType = field === 'image' ? 'url' : 'text';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Edit ${fieldLabels[field]}</h3>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="edit-field">${fieldLabels[field]}:</label>
                        ${isTextarea ? 
                            `<textarea id="edit-field" required>${currentValue}</textarea>` : 
                            `<input type="${inputType}" id="edit-field" value="${currentValue}" required>`
                        }
                    </div>
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
        
        function closeModal() {
            modal.remove();
        }
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        saveBtn.addEventListener('click', () => {
            const newValue = input.value.trim();
            if (newValue) {
                updateAlumni(cardId, field, newValue);
                closeModal();
            }
        });
        
        // Focus input after modal appears
        setTimeout(() => input.focus(), 100);
        
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
    
    async function addAlumni(data) {
        try {
            const response = await fetch('/add/alumni', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                location.reload(); // Refresh page to show new alumni
            } else {
                alert('Error adding alumni');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding alumni');
        }
    }
    
    async function updateAlumni(cardId, field, newValue) {
        try {
            const response = await fetch(`/alumni/${cardId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: newValue })
            });
            
            if (response.ok) {
                // Update the display immediately
                const card = document.querySelector(`[data-card-id="${cardId}"]`).closest('.card');
                updateCardDisplay(card, field, newValue);
                
                // Add success animation
                card.classList.add('success-animation');
                setTimeout(() => card.classList.remove('success-animation'), 300);
            } else {
                alert('Error updating alumni');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating alumni');
        }
    }
    
    function updateCardDisplay(card, field, newValue) {
        const cardBack = card.querySelector('.card-back');
        let element;
        
        switch(field) {
            case 'name':
                element = cardBack.querySelector('.card-name');
                element.firstChild.textContent = newValue;
                break;
            case 'college':
                element = cardBack.querySelector('.card-college');
                element.firstChild.textContent = newValue;
                break;
            case 'year':
                element = cardBack.querySelector('.card-year');
                element.firstChild.textContent = newValue;
                break;
            case 'major':
                element = cardBack.querySelector('.card-major');
                element.firstChild.textContent = newValue;
                break;
            case 'achievement':
                element = cardBack.querySelector('.card-achievement');
                element.firstChild.textContent = newValue;
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
    
    async function deleteAlumni(cardId) {
        try {
            const response = await fetch(`/delete/alumni/${cardId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Remove card with animation
                const card = document.querySelector(`[data-card-id="${cardId}"]`).closest('.card');
                card.style.transform = 'scale(0)';
                card.style.opacity = '0';
                setTimeout(() => card.remove(), 300);
            } else {
                alert('Error deleting alumni');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting alumni');
        }
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.remove();
        }
    });
});