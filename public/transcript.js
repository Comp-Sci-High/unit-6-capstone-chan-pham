document.addEventListener('DOMContentLoaded', function() {
    // Get all form elements
    const requestTypeSelect = document.getElementById('request-type');
    const fileUploadGroup = document.getElementById('file-upload-group');
    const transcriptFileInput = document.getElementById('transcript-file');
    const form = document.getElementById('transcript-form');
    const submitButton = document.getElementById('submit-btn');
    const recipientEmailInput = document.getElementById('recipient-email');

    // Set default recipient email
    recipientEmailInput.value = 'brandon.thomas25@compscihigh.org';

    // Handle request type change
    requestTypeSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        
        console.log('Request type changed to:', selectedValue);
        
        if (selectedValue === 'send') {
            // Show file upload for sending transcripts
            fileUploadGroup.classList.add('show');
            transcriptFileInput.setAttribute('required', 'required');
            submitButton.textContent = 'Send Transcript';
        } else if (selectedValue === 'request') {
            // Hide file upload for requesting transcripts
            fileUploadGroup.classList.remove('show');
            transcriptFileInput.removeAttribute('required');
            transcriptFileInput.value = '';
            submitButton.textContent = 'Request Transcript';
        } else {
            // Default state
            fileUploadGroup.classList.remove('show');
            transcriptFileInput.removeAttribute('required');
            submitButton.textContent = 'Submit Request';
        }
    });

    // File input validation
    transcriptFileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/jpg',
                'image/png'
            ];
            const maxSize = 10 * 1024 * 1024; // 10MB

            if (!allowedTypes.includes(file.type)) {
                showMessage('Please select a valid file type (PDF, DOC, DOCX, JPG, PNG).', 'error');
                this.value = '';
                return;
            }

            if (file.size > maxSize) {
                showMessage('File size must be less than 10MB.', 'error');
                this.value = '';
                return;
            }

            showMessage(`File "${file.name}" selected successfully.`, 'success');
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            requestType: requestTypeSelect.value,
            fullName: document.getElementById('full-name').value,
            graduationYear: document.getElementById('graduation-year').value,
            userEmail: document.getElementById('email').value,
            recipientEmail: recipientEmailInput.value,
            file: transcriptFileInput.files[0] || null
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Create email content
        const emailContent = createEmailContent(formData);
        
        // Send email using mailto (for client-side solution)
        sendEmailViaMailto(emailContent, formData);
        
        // Show success message
        showMessage('Email client opened. Please send the email from your email application.', 'success');
        
        // Reset form after delay
        setTimeout(() => {
            resetForm();
        }, 2000);
    });

    // Form validation
    function validateForm(formData) {
        if (!formData.requestType) {
            showMessage('Please select a request type.', 'error');
            return false;
        }

        if (!formData.fullName.trim()) {
            showMessage('Please enter your full name.', 'error');
            return false;
        }

        if (!formData.graduationYear || formData.graduationYear < 1900 || formData.graduationYear > new Date().getFullYear()) {
            showMessage('Please enter a valid graduation year.', 'error');
            return false;
        }

        if (!formData.userEmail.trim()) {
            showMessage('Please enter your email address.', 'error');
            return false;
        }

        if (!formData.recipientEmail.trim()) {
            showMessage('Please enter recipient email address.', 'error');
            return false;
        }

        if (formData.requestType === 'send' && !formData.file) {
            showMessage('Please upload a transcript file to send.', 'error');
            return false;
        }

        return true;
    }

    // Create email content
    function createEmailContent(formData) {
        const isRequest = formData.requestType === 'request';
        const subject = isRequest 
            ? `Transcript Request - ${formData.fullName}`
            : `Transcript Submission - ${formData.fullName}`;

        const body = `
Hello,

${isRequest ? 'I am requesting' : 'I am sending'} my transcript with the following details:

Full Name: ${formData.fullName}
Graduation Year: ${formData.graduationYear}
Email Address: ${formData.userEmail}
Request Type: ${isRequest ? 'Request Transcript' : 'Send Transcript'}

${isRequest 
    ? 'Please send my transcript to the email address provided above.' 
    : 'Please find my transcript attached to this email.'}

Thank you for your assistance.

Best regards,
${formData.fullName}
        `.trim();

        return { subject, body };
    }

    // Send email via mailto
    function sendEmailViaMailto(emailContent, formData) {
        const encodedSubject = encodeURIComponent(emailContent.subject);
        const encodedBody = encodeURIComponent(emailContent.body);
        const mailtoLink = `mailto:${formData.recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;
        
        // Open default email client
        window.location.href = mailtoLink;
    }

    // Show message to user
    function showMessage(text, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;

        // Insert message at top of form
        form.insertBefore(messageDiv, form.firstChild);

        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }

    // Reset form
    function resetForm() {
        form.reset();
        fileUploadGroup.classList.remove('show');
        transcriptFileInput.removeAttribute('required');
        submitButton.textContent = 'Submit Request';
        recipientEmailInput.value = 'brandon.thomas25@compscihigh.org';
        
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
    }

    // Initialize form state
    fileUploadGroup.classList.remove('show');
});