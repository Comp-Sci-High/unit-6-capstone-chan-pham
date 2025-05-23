// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const transcriptForm = document.getElementById('transcript-form');
    
    if (transcriptForm) {
        transcriptForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Your transcript request has been submitted successfully!');
            transcriptForm.reset();
        });
    }
});