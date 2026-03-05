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
    initParticleBackground();
    initGeometricPhotoEffect();
    
    // Load saved theme (WITHOUT showing notification)
    loadTheme();
}

// ========================================
// GEOMETRIC PHOTO POP-OUT EFFECT
// ========================================
function initGeometricPhotoEffect() {
    const photoContainer = document.querySelector('.geometric-photo-container');
    const photo = document.querySelector('.pop-out-photo');
    const frame = document.querySelector('.geometric-frame');
    
    if (!photoContainer || !photo || !frame) {
        console.warn('⚠️ Geometric photo elements not found');
        return;
    }
    
    // Add subtle parallax effect on mouse move
    photoContainer.addEventListener('mousemove', (e) => {
        const rect = photoContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        // Apply subtle tilt effect
        photo.style.transform = `
            translateY(-8px) 
            scale(1.03) 
            rotateY(${deltaX * 5}deg) 
            rotateX(${-deltaY * 5}deg)
        `;
        
        frame.style.transform = `
            translate(-50%, -50%) 
            rotateY(${deltaX * 3}deg) 
            rotateX(${-deltaY * 3}deg)
        `;
    });
    
    // Reset on mouse leave
    photoContainer.addEventListener('mouseleave', () => {
        photo.style.transform = '';
        frame.style.transform = 'translate(-50%, -50%)';
    });
    
    // Add loading state for photo
    photo.addEventListener('load', () => {
        photo.style.opacity = '1';
        console.log('✨ Geometric photo loaded successfully');
    });
    
    // Fallback if photo fails to load
    photo.addEventListener('error', () => {
        console.error('❌ Failed to load profile photo');
        photo.style.opacity = '0.5';
    });
    
    // Intersection Observer for entrance animation
    const photoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInRight 1s ease forwards';
                photoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    photoObserver.observe(photoContainer);
    
    console.log('✨ Geometric photo pop-out effect initialized!');
}

// ========================================
// PARTICLE NETWORK BACKGROUND
// ========================================
function initParticleBackground() {
    if (window.innerWidth <= 768) {
        console.log('📱 Particle background disabled on mobile');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');

    const CONFIG = {
        particleCount   : 90,
        minRadius       : 1.5,
        maxRadius       : 3,
        speed           : 0.4,
        connectDistance : 160,
        mouseRadius     : 180,
        mouseStrength   : 0.012,
        minConnections  : 2,
        maxConnections  : 5,
        opacityDot      : 0.75,
        opacityLine     : 0.25,
    };

    function getThemeColour() {
        const body = document.body;
        if (body.classList.contains('blackwhite-mode')) {
            return { dot: '120,120,120', line: '100,100,100' };
        }
        if (body.classList.contains('light-mode')) {
            return { dot: '123,47,247', line: '123,47,247' };
        }
        return { dot: '0,245,255', line: '0,245,255' };
    }

    const mouse = { x: -9999, y: -9999 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(randomPos = false) {
            this.x = randomPos
                ? Math.random() * canvas.width
                : Math.random() < 0.5 ? 0 : canvas.width;
            this.y = randomPos
                ? Math.random() * canvas.height
                : Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * CONFIG.speed * 2;
            this.vy = (Math.random() - 0.5) * CONFIG.speed * 2;
            this.r = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
            this.baseVx = this.vx;
            this.baseVy = this.vy;
        }

        update() {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CONFIG.mouseRadius && dist > 0) {
                const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                this.vx += (dx / dist) * force * CONFIG.mouseStrength * 20;
                this.vy += (dy / dist) * force * CONFIG.mouseStrength * 20;
            }

            this.vx += (this.baseVx - this.vx) * 0.03;
            this.vy += (this.baseVy - this.vy) * 0.03;

            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            const maxSpeed = CONFIG.speed * 4;
            if (speed > maxSpeed) {
                this.vx = (this.vx / speed) * maxSpeed;
                this.vy = (this.vy / speed) * maxSpeed;
            }

            this.x += this.vx;
            this.y += this.vy;

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

    let particles = [];

    function initParticles() {
        particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles(colour) {
        for (let i = 0; i < particles.length; i++) {
            const a = particles[i];

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

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const colour = getThemeColour();

        connectParticles(colour);

        for (const p of particles) {
            p.update();
            p.draw(colour);
        }

        requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

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
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    
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
// MULTI-THEME TOGGLE (DARK/LIGHT/B&W) - FIXED!
// ========================================
function initThemeToggle() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            setTheme(theme, true); // Show notification only on manual click
        });
    });
}

function setTheme(theme, showNotificationFlag = false) {
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
    
    // Show notification ONLY if user manually switched (not on page load)
    if (showNotificationFlag) {
        const themeNames = {
            'dark': 'Dark Mode',
            'light': 'Light Mode',
            'blackwhite': 'Black & White Mode'
        };
        showNotification(`Switched to ${themeNames[theme]}`, 'success');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme, false); // DO NOT show notification on page load
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
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    type();
}

// ========================================
// COUNTER ANIMATION
// ========================================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const increment = target / (duration / 16);
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
        '.project-card, .info-card, .about-text, .geometric-photo-container'
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
            filterBtns.forEach(b => b.classList.remove('active'));
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
        
        const submitBtn = contactForm.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            await simulateFormSubmission(formData);
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again or email directly.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Form Data:', data);
            const mailtoLink = `mailto:ca.manish.shrestha@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(data.name)} (${encodeURIComponent(data.email)})`;
            window.location.href = mailtoLink;
            resolve();
        }, 1000);
    });
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
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
        <button class="notification-close" onclick="this.parentElement.remove()" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
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
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Add notification animations
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
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
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
// CUSTOM CURSOR
// ========================================
function initCustomCursor() {
    if (window.innerWidth < 1024) {
        return;
    }
    
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
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    function animateFollower() {
        const speed = 0.15;
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    const interactiveElements = document.querySelectorAll(
        'a, button, .btn, .project-card, .cert-card, .qual-card, ' +
        '.info-card, .tech-item, .filter-btn, .social-links a, ' +
        'input, textarea, .nav-link, .theme-btn, .hamburger, ' +
        '.geometric-photo-container, .pop-out-photo'
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
        
        element.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
        });
        
        element.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
    
    document.body.style.cursor = 'none';
    
    interactiveElements.forEach(element => {
        element.style.cursor = 'none';
    });
    
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
// PAGE VISIBILITY API
// ========================================
function initPageVisibility() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.body.style.animationPlayState = 'paused';
        } else {
            document.body.style.animationPlayState = 'running';
        }
    });
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('name')?.focus();
        }
        
        if (e.key === 'Escape') {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('nav-menu');
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            
            // Also close any notifications
            const notification = document.querySelector('.notification');
            if (notification) notification.remove();
        }
        
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
// ANALYTICS TRACKING
// ========================================
function initAnalytics() {
    trackPageView();
    
    const trackButtons = document.querySelectorAll('[data-track]');
    trackButtons.forEach(button => {
        button.addEventListener('click', () => {
            const eventName = button.getAttribute('data-track');
            trackEvent('Button Click', eventName);
        });
    });
    
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', () => {
            trackEvent('Form Submit', form.id || 'contact-form');
        });
    });
}

function trackPageView() {
    console.log('Page View Tracked:', window.location.pathname);
}

function trackEvent(category, action, label = '') {
    console.log('Event Tracked:', { category, action, label });
    
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
    
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    console.log('✅ All features loaded successfully!');
});

// ========================================
// SERVICE WORKER (PWA)
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
