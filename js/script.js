/**
 * PREMIUM PORTFOLIO - MANISH SHRESTHA
 * Interactive JavaScript with Particles, Animations & 3D Effects
 */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    particles: {
        count: 60, // Reduced for smoother performance
        speed: 0.3, // Slower, more elegant movement
        size: 2,
        connectionDistance: 120, // Shorter connections for cleaner look
        color: 'rgba(0, 212, 255, 0.4)' // Slightly more subtle
    },
    typing: {
        texts: [
            'Chartered Accountant (CA)',
            'CISA Certified Professional',
            'Internal Audit Expert',
            'IT Audit Specialist',
            'Compliance Leader',
            'Risk Management Expert',
            'ISO 27001 Lead Auditor',
            'Financial Consultant'
        ],
        typingSpeed: 80, // Slightly faster typing
        deletingSpeed: 40, // Faster deleting
        pauseTime: 2000
    },
    scroll: {
        offset: 100,
        animationDelay: 80 // Faster stagger for smoother feel
    }
};

// ============================================
// PARTICLE SYSTEM
// ============================================
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
        this.setupEvents();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        const count = Math.min(CONFIG.particles.count, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * CONFIG.particles.speed,
                vy: (Math.random() - 0.5) * CONFIG.particles.speed,
                size: Math.random() * CONFIG.particles.size + 1
            });
        }
    }
    
    setupEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = CONFIG.particles.color;
        this.ctx.fill();
    }
    
    connectParticles(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < CONFIG.particles.connectionDistance) {
            const opacity = 1 - (distance / CONFIG.particles.connectionDistance);
            this.ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.2})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
        }
    }
    
    updateParticle(particle) {
        // Mouse interaction
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const directionX = dx / distance;
                const directionY = dy / distance;
                
                particle.vx -= directionX * force * 0.5;
                particle.vy -= directionY * force * 0.5;
            }
        }
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > this.canvas.width) {
            particle.vx *= -1;
        }
        if (particle.y < 0 || particle.y > this.canvas.height) {
            particle.vy *= -1;
        }
        
        // Friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });
        
        // Connect particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                this.connectParticles(this.particles[i], this.particles[j]);
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// TYPING ANIMATION
// ============================================
class TypingAnimation {
    constructor(element) {
        this.element = element;
        this.texts = CONFIG.typing.texts;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.isDeleting ? CONFIG.typing.deletingSpeed : CONFIG.typing.typingSpeed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = CONFIG.typing.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }
    
    init() {
        this.observeElements();
        window.addEventListener('scroll', () => this.handleScroll());
        this.handleScroll();
    }
    
    observeElements() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('aos-animate');
                        }, index * CONFIG.scroll.animationDelay);
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        this.elements.forEach(el => observer.observe(el));
    }
    
    handleScroll() {
        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-count]');
        this.animated = new Set();
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animateCounter(entry.target);
                        this.animated.add(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        this.counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ============================================
// SKILL BAR ANIMATION
// ============================================
class SkillBarAnimation {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress[data-progress]');
        this.animated = new Set();
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animated.has(entry.target)) {
                        this.animateBar(entry.target);
                        this.animated.add(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        this.skillBars.forEach(bar => observer.observe(bar));
    }
    
    animateBar(element) {
        const progress = element.getAttribute('data-progress');
        setTimeout(() => {
            element.style.width = progress + '%';
        }, 200);
    }
}

// ============================================
// NAVIGATION
// ============================================
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });
        
        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.navMenu.classList.remove('active');
                this.navToggle.classList.remove('active');
                
                // Smooth scroll
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
                
                // Update active link
                this.updateActiveLink(link);
            });
        });
        
        // Update active link on scroll
        window.addEventListener('scroll', () => this.updateActiveOnScroll());
    }
    
    updateActiveLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    updateActiveOnScroll() {
        const sections = document.querySelectorAll('.section, .hero');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ============================================
// BACK TO TOP
// ============================================
class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }
    
    init() {
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// 3D CARD TILT EFFECT
// ============================================
class CardTiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.card-3d');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMove(e, card));
            card.addEventListener('mouseleave', () => this.handleLeave(card));
        });
    }
    
    handleMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    }
    
    handleLeave(card) {
        card.style.transform = '';
    }
}

// ============================================
// PARALLAX EFFECT
// ============================================
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.floating-shapes');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        
        this.elements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    const offsetTop = target.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
class LazyLoadImages {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        this.images.forEach(img => observer.observe(img));
    }
}

// ============================================
// CURSOR TRAIL EFFECT
// ============================================
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 20;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (this.trail.length > this.maxTrail) {
                this.trail.shift();
            }
            
            this.draw();
        });
    }
    
    draw() {
        // Optional: Add visual cursor trail effect
        // Implementation can be added based on preference
    }
}

// ============================================
// CUSTOM CURSOR
// ============================================
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.cursorDot = document.querySelector('.custom-cursor-dot');
        this.cursorPos = { x: 0, y: 0 };
        this.cursorDotPos = { x: 0, y: 0 };
        this.mousePos = { x: 0, y: 0 };
        
        if (this.cursor && this.cursorDot) {
            this.init();
        }
    }
    
    init() {
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });
        
        // Detect hover on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .card-3d, .nav-link, .social-link');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                this.cursor.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
                this.cursor.style.borderColor = '#00f2ea';
                this.cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                this.cursor.style.backgroundColor = 'transparent';
                this.cursor.style.borderColor = '#00d4ff';
                this.cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
        
        // Animate cursor with smooth trailing
        this.animate();
    }
    
    animate() {
        // Smooth cursor follow
        const speed = 0.15;
        const dotSpeed = 0.6;
        
        this.cursorPos.x += (this.mousePos.x - this.cursorPos.x) * speed;
        this.cursorPos.y += (this.mousePos.y - this.cursorPos.y) * speed;
        
        this.cursorDotPos.x += (this.mousePos.x - this.cursorDotPos.x) * dotSpeed;
        this.cursorDotPos.y += (this.mousePos.y - this.cursorDotPos.y) * dotSpeed;
        
        this.cursor.style.left = this.cursorPos.x + 'px';
        this.cursor.style.top = this.cursorPos.y + 'px';
        
        this.cursorDot.style.left = this.cursorDotPos.x + 'px';
        this.cursorDot.style.top = this.cursorDotPos.y + 'px';
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Debounce resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // Reduce animations on low-end devices
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-base', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
        }
    }
    
    handleResize() {
        // Trigger resize-dependent features
        window.dispatchEvent(new Event('optimizedResize'));
    }
}

// ============================================
// INITIALIZE APPLICATION
// ============================================
class App {
    constructor() {
        this.init();
    }
    
    async init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    start() {
        console.log('🚀 Initializing Premium Portfolio...');
        
        try {
            // Initialize custom cursor
            new CustomCursor();
            console.log('✓ Custom cursor initialized');
            
            // Initialize particle system
            const canvas = document.getElementById('particles-canvas');
            if (canvas) {
                new ParticleSystem(canvas);
                console.log('✓ Particle system initialized');
            }
            
            // Initialize typing animation
            const typingElement = document.querySelector('.typing-text');
            if (typingElement) {
                new TypingAnimation(typingElement);
                console.log('✓ Typing animation initialized');
            }
            
            // Initialize scroll animations
            new ScrollAnimations();
            console.log('✓ Scroll animations initialized');
            
            // Initialize counter animations
            new CounterAnimation();
            console.log('✓ Counter animations initialized');
            
            // Initialize skill bar animations
            new SkillBarAnimation();
            console.log('✓ Skill bar animations initialized');
            
            // Initialize navigation
            new Navigation();
            console.log('✓ Navigation initialized');
            
            // Initialize back to top button
            new BackToTop();
            console.log('✓ Back to top initialized');
            
            // Initialize 3D card tilt effect
            new CardTiltEffect();
            console.log('✓ Card tilt effect initialized');
            
            // Initialize parallax effect
            new ParallaxEffect();
            console.log('✓ Parallax effect initialized');
            
            // Initialize smooth scroll
            new SmoothScroll();
            console.log('✓ Smooth scroll initialized');
            
            // Initialize lazy loading
            new LazyLoadImages();
            console.log('✓ Lazy loading initialized');
            
            // Initialize performance optimizer
            new PerformanceOptimizer();
            console.log('✓ Performance optimizer initialized');
            
            console.log('✨ Portfolio ready! Welcome to an amazing experience.');
            
        } catch (error) {
            console.error('❌ Initialization error:', error);
        }
    }
}

// ============================================
// START APPLICATION
// ============================================
const app = new App();
