// EmailJS Configuration
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'xyULo6OElxKrIjRxQ',      // Your EmailJS public key
    SERVICE_ID: 'service_wv9ojz2',        // Your EmailJS service ID
    TEMPLATE_ID: 'template_xufwfvh'       // Your EmailJS template ID
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    // Get form elements
    const form = document.getElementById('transcript-form');
    const submitButton = document.getElementById('submit-btn');
    const recipientEmailInput = document.getElementById('recipient-email');

    // Set default recipient email
    recipientEmailInput.value = 'brandon.thomas25@compscihigh.org';

    // Rate limiting to prevent spam
    let lastSubmissionTime = 0;
    const SUBMISSION_COOLDOWN = 30000; // 30 seconds between submissions

    // Handle form submission with EmailJS
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Always prevent default form submission

        // Check rate limiting
        const now = Date.now();
        if (now - lastSubmissionTime < SUBMISSION_COOLDOWN) {
            const remainingTime = Math.ceil((SUBMISSION_COOLDOWN - (now - lastSubmissionTime)) / 1000);
            showMessage(`Please wait ${remainingTime} seconds before submitting again.`, 'error');
            return;
        }

        // Get form data for validation
        const formData = {
            fullName: document.getElementById('full-name').value,
            graduationYear: document.getElementById('graduation-year').value,
            userEmail: document.getElementById('email').value,
            recipientEmail: recipientEmailInput.value
        };

        // Validate form before submission
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Prepare email data
            const emailData = {
                request_type: 'request',
                full_name: formData.fullName,
                graduation_year: formData.graduationYear,
                user_email: formData.userEmail,
                recipient_email: formData.recipientEmail,
                subject: `Transcript Request - ${formData.fullName}`,
                message: createEmailMessage(formData)
            };

            console.log('Sending email with data:', emailData);

            // Send email using EmailJS
            const response = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                emailData
            );

            console.log('EmailJS response:', response);

            if (response.status === 200) {
                lastSubmissionTime = now; // Update last submission time
                showMessage('Transcript request sent successfully! The recipient should receive it shortly.', 'success');
                resetForm();
            } else {
                throw new Error('Failed to send email');
            }

        } catch (error) {
            console.error('EmailJS Error:', error);
            let errorMessage = 'Failed to send transcript request. Please try again or contact support.';
            
            // More specific error messages
            if (error.text) {
                errorMessage = `Error: ${error.text}`;
            } else if (error.message) {
                errorMessage = `Error: ${error.message}`;
            }
            
            showMessage(errorMessage, 'error');
        } finally {
            setLoadingState(false);
        }
    });

    // Form validation
    function validateForm(formData) {
        if (!formData.fullName.trim()) {
            showMessage('Please enter your full name.', 'error');
            return false;
        }

        if (!formData.graduationYear || formData.graduationYear < 1900 || formData.graduationYear > new Date().getFullYear() + 5) {
            showMessage('Please enter a valid graduation year.', 'error');
            return false;
        }

        if (!formData.userEmail.trim()) {
            showMessage('Please enter your email address.', 'error');
            return false;
        }

        if (!isValidEmail(formData.userEmail)) {
            showMessage('Please enter a valid email address.', 'error');
            return false;
        }

        if (!formData.recipientEmail.trim()) {
            showMessage('Please enter recipient email address.', 'error');
            return false;
        }

        if (!isValidEmail(formData.recipientEmail)) {
            showMessage('Please enter a valid recipient email address.', 'error');
            return false;
        }

        return true;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Create email message content
    function createEmailMessage(formData) {
        let message = `
TRANSCRIPT REQUEST

Student Information:
- Name: ${formData.fullName}
- Graduation Year: ${formData.graduationYear}
- Email: ${formData.userEmail}

Recipient: ${formData.recipientEmail}

This is a request for transcript delivery. Please process this request and send the transcript to the recipient email address above.

Please contact ${formData.userEmail} if you have any questions about this request.
        `.trim();

        return message;
    }

    // Set loading state
    function setLoadingState(isLoading) {
        submitButton.disabled = isLoading;
        
        if (isLoading) {
            submitButton.innerHTML = '<span class="loading-spinner"></span>Sending...';
        } else {
            submitButton.textContent = 'Request Transcript';
        }
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

        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Reset form
    function resetForm() {
        form.reset();
        submitButton.disabled = false;
        recipientEmailInput.value = 'brandon.thomas25@compscihigh.org';
        
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
    }
});