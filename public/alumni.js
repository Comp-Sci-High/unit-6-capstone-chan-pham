document.addEventListener('DOMContentLoaded', function() {
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
    
    // Add hover effects to college logos
    const collegeLogos = document.querySelectorAll('.college-logo');
    
    collegeLogos.forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Card flip functionality is handled via CSS with the onclick event
});