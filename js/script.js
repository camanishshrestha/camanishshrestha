/**
 * MODERN PROFESSIONAL PORTFOLIO - JAVASCRIPT
 * Author: Manish Shrestha
 * Description: Interactive functionality for portfolio website
 */

// ========================================
// INITIALIZATION & DOM CONTENT LOADED
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initNavigation();
    initThemeToggle();
    initTypingEffect();
    initCounters();
    initScrollAnimations();
    initProjectFilters();
    initContactForm();
    initScrollToTop();
    initCustomCursor();
    initSkillBars();
    // initMouseInteractiveBackground(); // REMOVED: Replaced by the new particle background
    initParticleBackground(); // ADDED: Your new particle background
    
    // Load saved theme
    loadTheme();
}

// ========================================
// PARTICLE NETWORK BACKGROUND - NEW!
// ========================================
function initParticleBackground() {
    // Only enable on desktop for better performance and consistency
    if (window.innerWidth <= 768) {
        return;
    }

    /* ---------- canvas setup ---------- */
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.prepend(canvas); // first child of body, ensuring it's behind everything
    const ctx = canvas.getContext('2d');

    /* ---------- config ---------- */
    const CONFIG = {
        particleCount   : 90,          // total dots
        minRadius       : 1.5,         // dot size min
        maxRadius       : 3,           // dot size max
        speed           : 0.4,         // base movement speed
        connectDistance : 160,         // max px to draw a line
        mouseRadius     : 180,         // mouse influence radius
        mouseStrength   : 0.012,       // how hard mouse pushes dots
        minConnections  : 2,           // minimum lines per dot
        maxConnections  : 5,           // maximum lines per dot
        opacityDot      : 0.75,
        opacityLine     : 0.25,
    };

    /* ---------- theme-aware colours ---------- */
    function getThemeColour() {
        const body = document.body;
        if (body.classList.contains('blackwhite-mode')) {
            // Using a slightly lighter grey for BW mode for visibility
            return { dot: '120,120,120', line: '100,100,100' };
        }
        if (body.classList.contains('light-mode')) {
            // Adjusting light mode to be subtle but visible against light BG
            // Using a desaturated purple from your theme for light mode
            return { dot: '123,47,247', line: '123,47,247' }; // using primary var from light theme
        }
        /* default dark mode */
        return { dot: '0,245,255', line: '0,245,255' }; // var(--primary) for dark theme
    }

    /* ---------- mouse tracking ---------- */
    const mouse = { x: -9999, y: -9999 }; // Initialize off-screen

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    /* ---------- resize handler ---------- */
    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles(); // Re-initialize particles on resize for better distribution
    });

    /* ---------- Particle Class Definition ---------- */
    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(randomPos = false) {
            this.x = randomPos
                ? Math.random() * canvas.width
                : Math.random() < 0.5 ? 0 : canvas.width; // Start from random edge
            this.y = randomPos
                ? Math.random() * canvas.height
                : Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * CONFIG.speed * 2;
            this.vy = (Math.random() - 0.5) * CONFIG.speed * 2;
            this.r = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
            this.baseVx = this.vx; // Store base velocity for drift
            this.baseVy = this.vy;
        }

        update() {
            /* mouse repulsion logic */
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.mouseRadius && dist > 0) {
                const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                this.vx += (dx / dist) * force * CONFIG.mouseStrength * 20; // Increased strength
                this.vy += (dy / dist) * force * CONFIG.mouseStrength * 20;
            }

            /* gentle drift back to base speed */
            this.vx += (this.baseVx - this.vx) * 0.03;
            this.vy += (this.baseVy - this.vy) * 0.03;

            /* clamp velocity to prevent excessive speeds */
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            const maxSpeed = CONFIG.speed * 4; // Max speed is 4x base speed
            if (speed > maxSpeed) {
                this.vx = (this.vx / speed) * maxSpeed;
                this.vy = (this.vy / speed) * maxSpeed;
            }

            this.x += this.vx;
            this.y += this.vy;

            /* wrap around edges */
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw(colour) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${colour.dot},${CONFIG.opacityDot})`;
            ctx.fill();
        }
    }

    /* ---------- particles array and initialization ---------- */
    let particles = [];

    function initParticles() {
        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    /* ---------- connect dots (2-5 nearest) ---------- */
    function connectParticles(colour) {
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];

            /* collect neighbours sorted by distance */
            const neighbours = [];
            for (let j = 0; j < particles.length; j++) {
                if (i === j) continue;
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < CONFIG.connectDistance) {
                    neighbours.push({ particle: b, dist: d });
                }
            }

            /* sort closest first, then pick 2-5 */
            neighbours.sort((x, y) => x.dist - y.dist);

            const limit = Math.min(
                neighbours.length,
                CONFIG.minConnections + Math.floor(Math.random() * (CONFIG.maxConnections - CONFIG.minConnections + 1))
            );

            for (let k = 0; k < limit; k++) {
                const { particle: b, dist } = neighbours[k];
                const alpha = CONFIG.opacityLine * (1 - dist / CONFIG.connectDistance);

                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(${colour.line},${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }

    /* ---------- main animation loop ---------- */
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        const colour = getThemeColour(); // Get current theme color for particles

        connectParticles(colour); // Draw lines first (so they are behind dots)

        for (const p of particles) {
            p.update(); // Update particle position
            p.draw(colour); // Draw particle
        }

        requestAnimationFrame(animate); // Loop
    }

    /* ---------- boot up the background ---------- */
    resize(); // Set initial canvas size
    initParticles(); // Create initial particles
    animate(); // Start the animation loop

    console.log('✨ Particle Network Background initialized!');
}


// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    
    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink?.classList.add('active');
            }
        });
    });
    
    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// MULTI-THEME TOGGLE (DARK/LIGHT/B&W)
// ========================================
function initThemeToggle() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            setTheme(theme);
        });
    });
}

function setTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove('light-mode', 'blackwhite-mode');
    
    // Remove active class from all buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Apply selected theme
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('theme-light')?.classList.add('active');
    } else if (theme === 'blackwhite') {
        document.body.classList.add('blackwhite-mode');
        document.getElementById('theme-bw')?.classList.add('active');
    } else {
        // Dark mode (default)
        document.getElementById('theme-dark')?.classList.add('active');
    }
    
    // Save preference
    localStorage.setItem('theme', theme);
    
    // Show notification
    const themeNames = {
        'dark': 'Dark Mode',
        'light': 'Light Mode',
        'blackwhite': 'Black & White Mode'
    };
    showNotification(`Switched to ${themeNames[theme]}`, 'success');
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

// ========================================
// TYPING EFFECT
// ========================================
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    
    if (!typingText) return;
    
    const texts = [
        'Chartered Accountant (CA)',
        'CISA Certified Professional',
        'Internal Audit Expert',
        'ISO 27001 Lead Auditor',
        'Compliance Specialist',
        'GRC Professional'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next text
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing effect
    type();
}

// ========================================
// COUNTER ANIMATION
// ========================================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.qual-card, .cert-card, .timeline-item, .skill-category, ' +
        '.project-card, .info-card, .about-text'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// ========================================
// PROJECT FILTERS
// ========================================
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterBtns.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ========================================
// SKILL BARS ANIMATION
// ========================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 100);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// ========================================
// CONTACT FORM
// ========================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual API call)
            await simulateFormSubmission(formData);
            
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
        } catch (error) {
            // Show error message
            showNotification('Failed to send message. Please try again or email directly.', 'error');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Simulate form submission (replace with actual API)
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Form Data:', data);
            
            // For now, open email client as fallback
            const mailtoLink = `mailto:ca.manish.shrestha@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(data.name)} (${encodeURIComponent(data.email)})`;
            window.location.href = mailtoLink;
            
            resolve();
        }, 1000);
    });
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations to stylesheet dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// SCROLL TO TOP BUTTON
// ========================================
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// CUSTOM CURSOR - FIXED VERSION
// ========================================
function initCustomCursor() {
    // Only enable on desktop
    if (window.innerWidth < 1024) {
        return;
    }
    
    // Create cursor elements if they don't exist
    let cursor = document.querySelector('.cursor');
    let cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);
    }
    
    if (!cursorFollower) {
        cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        document.body.appendChild(cursorFollower);
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    
    // Update cursor position on mouse move
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update main cursor immediately
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Smooth follower animation
    function animateFollower() {
        const speed = 0.15;
        
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Cursor interactions on hover
    const interactiveElements = document.querySelectorAll(
        'a, button, .btn, .project-card, .cert-card, .qual-card, ' +
        '.info-card, .tech-item, .filter-btn, .social-links a, ' +
        'input, textarea, .nav-link, .theme-btn, .hamburger'
    );
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
            cursor.style.background = 'rgba(0, 245, 255, 0.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.8)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'var(--primary)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Add click effect
        element.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });
        
        element.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
    
    // Hide default cursor on body
    document.body.style.cursor = 'none';
    
    // Also hide cursor on all interactive elements
    interactiveElements.forEach(element => {
        element.style.cursor = 'none';
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
    });
}

// ========================================
// LAZY LOADING IMAGES
// ========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ========================================
// PARALLAX EFFECT
// ========================================
function initParallax() {
    const heroBackground = document.querySelector('.hero-background');
    
    if (!heroBackground) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
}

// ========================================
// COPY EMAIL ON CLICK
// ========================================
function initCopyEmail() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const email = link.textContent;
                
                navigator.clipboard.writeText(email).then(() => {
                    showNotification(`Email "${email}" copied to clipboard!`, 'success');
                });
            }
        });
    });
}

// ========================================
// PAGE VISIBILITY API (Performance)
// ========================================
function initPageVisibility() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when tab is not visible
            document.body.style.animationPlayState = 'paused';
        } else {
            // Resume animations
            document.body.style.animationPlayState = 'running';
        }
    });
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K: Focus contact form
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('name')?.focus();
        }
        
        // Escape: Close mobile menu
        if (e.key === 'Escape') {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('nav-menu');
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
        
        // Arrow keys: Navigate sections
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                navigateSections(e.key === 'ArrowDown' ? 'next' : 'prev');
            }
        }
    });
}

function navigateSections(direction) {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const currentScroll = window.pageYOffset;
    
    let currentSection = sections.findIndex(section => {
        const rect = section.getBoundingClientRect();
        return rect.top >= -100 && rect.top <= 100;
    });
    
    if (currentSection === -1) currentSection = 0;
    
    const targetIndex = direction === 'next' 
        ? Math.min(currentSection + 1, sections.length - 1)
        : Math.max(currentSection - 1, 0);
    
    const targetSection = sections[targetIndex];
    
    if (targetSection) {
        window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// ========================================
// ANALYTICS TRACKING (Optional)
// ========================================
function initAnalytics() {
    // Track page views
    trackPageView();
    
    // Track button clicks
    const trackButtons = document.querySelectorAll('[data-track]');
    trackButtons.forEach(button => {
        button.addEventListener('click', () => {
            const eventName = button.getAttribute('data-track');
            trackEvent('Button Click', eventName);
        });
    });
    
    // Track form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', () => {
            trackEvent('Form Submit', form.id || 'contact-form');
        });
    });
}

function trackPageView() {
    // Google Analytics or custom tracking
    console.log('Page View Tracked:', window.location.pathname);
}

function trackEvent(category, action, label = '') {
    console.log('Event Tracked:', { category, action, label });
    
    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
function optimizePerformance() {
    // Defer non-critical CSS
    const deferredStyles = [
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
    ];
    
    deferredStyles.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    });
    
    // Preload critical resources
    const preloadResources = [
        { href: 'images/ms.jpg', as: 'image' }
    ];
    
    preloadResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;
        document.head.appendChild(link);
    });
}

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', (e) => {
    console.error('Global Error:', e.message);
    // Optionally send to error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ========================================
// BROWSER COMPATIBILITY CHECK
// ========================================
function checkBrowserCompatibility() {
    const isModernBrowser = 
        'IntersectionObserver' in window &&
        'Promise' in window &&
        'fetch' in window;
    
    if (!isModernBrowser) {
        console.warn('Your browser may not support all features.');
        // Show notification to upgrade browser
        showNotification('For the best experience, please use a modern browser.', 'error');
    }
}

// ========================================
// INITIALIZE ADDITIONAL FEATURES
// ========================================
window.addEventListener('load', () => {
    initLazyLoading();
    initParallax();
    initCopyEmail();
    initPageVisibility();
    initKeyboardShortcuts();
    initAnalytics();
    optimizePerformance();
    checkBrowserCompatibility();
    
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
});

// ========================================
// SERVICE WORKER (PWA - Optional)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    });
}

// ========================================
// EXPORT FUNCTIONS (For Testing)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        showNotification,
        trackEvent
    };
}

// ========================================
// CONSOLE SIGNATURE
// ========================================
console.log(
    '%c👋 Welcome to Manish Shrestha\'s Portfolio!',
    'color: #00f5ff; font-size: 20px; font-weight: bold;'
);
console.log(
    '%c🚀 Built with passion for excellence in audit & compliance',
    'color: #7b2ff7; font-size: 14px;'
);
console.log(
    '%c📧 Interested in collaboration? Email: ca.manish.shrestha@gmail.com',
    'color: #10b981; font-size: 12px;'
);
