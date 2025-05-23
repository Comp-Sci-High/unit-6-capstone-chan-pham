// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const updateFeed = document.getElementById('update-feed');

// Sample updates data - this would typically come from a database or API
const updates = [
    {
        title: "New Career Workshop Series",
        content: "Join us for our new workshop series focused on emerging tech careers. Sessions will cover AI, blockchain, and cybersecurity career paths.",
        date: "May 15, 2025",
        important: true
    },
    {
        title: "Alumni Spotlight: Sarah Johnson",
        content: "Congratulations to our alumna Sarah Johnson for her recent promotion to CEO at Tech Innovations Inc. Read her success story on our blog.",
        date: "May 12, 2025",
        important: false
    },
    {
        title: "Scholarship Applications Open",
        content: "Applications for the 2025-2026 Alumni Merit Scholarships are now open. Deadline for submission is July 1, 2025.",
        date: "May 8, 2025",
        important: true
    },
    {
        title: "Campus Renovation Updates",
        content: "The renovation of the West Campus Library is now complete. The grand reopening ceremony will be held on May 30, 2025.",
        date: "May 5, 2025",
        important: false
    }
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the page
    initPage();

    // Toggle mobile menu when hamburger is clicked
    hamburger.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    // Change navbar on scroll
    window.addEventListener('scroll', handleScroll);
});

// Functions
function initPage() {
    // Populate updates feed
    populateUpdatesFeed();
    
    // Add animation to resource cards
    animateResourceCards();
}

function populateUpdatesFeed() {
    // Clear existing content
    updateFeed.innerHTML = '';
    
    // Add each update to the feed with staggered animation delay
    updates.forEach((update, index) => {
        const updateEl = document.createElement('div');
        updateEl.className = 'update-item';
        updateEl.style.animationDelay = `${index * 0.1}s`;
        
        // Add "important" badge if the update is marked as important
        const importantBadge = update.important ? '<span class="badge">Important</span>' : '';
        
        updateEl.innerHTML = `
            <div class="update-header">
                <h3>${update.title} ${importantBadge}</h3>
            </div>
            <p>${update.content}</p>
            <div class="update-meta">
                <span class="date"><i class="far fa-calendar-alt"></i> ${update.date}</span>
                <a href="#" class="read-more">Read More</a>
            </div>
        `;
        
        // Add highlight class for important updates
        if (update.important) {
            updateEl.classList.add('important');
        }
        
        updateFeed.appendChild(updateEl);
    });
}

function animateResourceCards() {
    const cards = document.querySelectorAll('.resource-card');
    
    cards.forEach((card, index) => {
        // Add staggered entrance animation
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
    // Toggle active class on mobile menu
    mobileMenu.classList.toggle('active');
    
    // Animate hamburger to X
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
    
    // Animate elements on scroll into view
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

// Additional styling for updates
document.head.insertAdjacentHTML('beforeend', `
<style>
.update-item.important {
    border-left: 4px solid var(--primary-color);
}

.badge {
    display: inline-block;
    background-color: var(--primary-color);
    color: white;
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 20px;
    margin-left: 10px;
    vertical-align: middle;
}

.read-more {
    color: var(--primary-color);
    font-weight: 500;
}

.read-more:hover {
    text-decoration: underline;
}

.resources-grid.animated .resource-card,
.info-cards.animated .info-card,
.update-feed.animated .update-item {
    opacity: 1;
    transform: translateY(0);
}
</style>
`);

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
            
            // Close mobile menu if open
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
});