/**
 * MODERN PROFESSIONAL PORTFOLIO - FULLY OPTIMIZED JAVASCRIPT
 * Author: Manish Shrestha
 * Performance Engineer: Enhanced for 60fps on all devices
 * 
 * FIXES APPLIED:
 * - Issue #1: Quick links navigation with proper offset
 * - Issue #2: Counter "+" suffix on scroll trigger
 * - Issue #3: Counter always lands on correct final number
 * - Issue #4: View counter starting from 640
 * - Issue #5: AI Chat contact response fixed completely
 * - Issue #7: Smooth performance on all devices
 * - Issue #8: Signature code removed
 */

'use strict';

// ========================================
// PERFORMANCE CORE - DOM SCHEDULER
// ========================================
const DOMScheduler = (() => {
    const readQueue = [];
    const writeQueue = [];
    let scheduled = false;

    function flush() {
        let task;
        while (task = readQueue.shift()) task();
        while (task = writeQueue.shift()) task();
        scheduled = false;
    }

    function schedule() {
        if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(flush);
        }
    }

    return {
        read(fn) { readQueue.push(fn); schedule(); },
        write(fn) { writeQueue.push(fn); schedule(); },
        measure(readFn, writeFn) {
            let result;
            this.read(() => result = readFn());
            this.write(() => writeFn(result));
        }
    };
})();

// ========================================
// DEVICE ADAPTIVE PERFORMANCE
// ========================================
class PerformanceAdaptor {
    constructor() {
        this.tier = this.detectTier();
        this.applyOptimizations();
    }

    detectTier() {
        const cores = navigator.hardwareConcurrency || 2;
        const memory = navigator.deviceMemory || 2;
        const connection = navigator.connection?.effectiveType || '4g';

        if (memory <= 2 || cores <= 2 || connection === '2g' || connection === 'slow-2g') {
            return 'low';
        }
        if (memory <= 4 || cores <= 4 || connection === '3g') {
            return 'medium';
        }
        return 'high';
    }

    applyOptimizations() {
        document.documentElement.dataset.perfTier = this.tier;

        if (this.tier === 'low') {
            window.PARTICLE_COUNT = 30;
            window.ANIMATION_DURATION = 0.4;
            window.ENABLE_CUSTOM_CURSOR = false;
            window.TYPING_SPEED = 80;
            window.ENABLE_PARALLAX = false;
        } else if (this.tier === 'medium') {
            window.PARTICLE_COUNT = 50;
            window.ANIMATION_DURATION = 0.6;
            window.ENABLE_CUSTOM_CURSOR = true;
            window.TYPING_SPEED = 100;
            window.ENABLE_PARALLAX = true;
        } else {
            window.PARTICLE_COUNT = 60;
            window.ANIMATION_DURATION = 0.8;
            window.ENABLE_CUSTOM_CURSOR = true;
            window.TYPING_SPEED = 100;
            window.ENABLE_PARALLAX = true;
        }
    }
}

const perfAdaptor = new PerformanceAdaptor();

// ========================================
// UTILITY FUNCTIONS
// ========================================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle = false;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ========================================
// GLOBAL STATE
// ========================================
const CHATBOT_CONFIG = {
    botName: 'Manish AI',
    ownerName: 'Manish Shrestha',
    ownerEmail: 'ca.manish.shrestha@gmail.com',
    typingDelay: 800,
    emailNotifications: true,
    welcomeShown: false
};

let chatState = {
    isOpen: false,
    messageCount: 0,
    conversationHistory: [],
    visitorInfo: {
        startTime: new Date(),
        questionsAsked: []
    },
    welcomeShown: false
};

let globalObservers = [];

// ========================================
// KNOWLEDGE BASE - COMPLETE (Issue #5 FIXED)
// ========================================
const knowledgeBase = {
    greeting: {
        keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'namaste', 'namaskar'],
        response: `👋 Hello! Welcome to Manish Shrestha's portfolio!

I'm his AI assistant and I can help you learn about:

📜 **Certifications** - CA, CISA, ISO Lead Auditor (75+ certs)
🎖️ **Credly Badges** - Verified digital credentials
💼 **Experience** - 8+ years in audit & finance
🚀 **Projects** - 40+ completed projects
🎯 **Skills** - Audit, Compliance, GRC
📧 **Contact** - How to reach Manish

What would you like to know?`
    },

    // ISSUE #5 FIX: Contact MUST be checked BEFORE experience
    // Moved contact to be the first category checked
    contact: {
        keywords: ['contact', 'email', 'phone', 'reach', 'hire', 'available', 'connect', 'talk', 'call', 'message', 'number', 'mail', 'whatsapp', 'linkedin'],
        response: `📧 **Contact Information**

**Email:**
✉️ ca.manish.shrestha@gmail.com (Primary)
✉️ manish.shrestha5396@gmail.com

**Phone:**
📞 +977 9843676945
📞 +977 9803456703

**Location:**
📍 Satdobato, Lalitpur, Nepal

**Social:**
🔗 LinkedIn: linkedin.com/in/manish-shrestha-cisa-grc
💻 GitHub: github.com/camanishshrestha

**Availability:**
✅ Open for consulting & audit opportunities
✅ Available for professional collaborations

Would you like me to help you send a message to Manish?`
    },

    badges: {
        keywords: ['badge', 'credly', 'verified', 'digital credential', 'blockchain', 'verify'],
        response: `🎖️ **Credly Verified Badges (9 Total)**

**Featured Badges:**
🏆 **Chartered Accountant (CA)** - ICAN, Qualified December 2024
🛡️ **CISA - Certified Information Systems Auditor** - ISACA, Score 625/800

**Professional Certifications:**
✅ ISO/IEC 27001:2022 Lead Auditor (95%)
✅ ISO/IEC 42001:2023 Lead Auditor (84%)

**Security & AI:**
✅ AI Security Governance
✅ Ethical Hacker (Cisco)
✅ ISC2 Candidate

**Technology:**
✅ Proofpoint AI Agent Security Specialist
✅ QuickBooks Online Certification Level 1

All badges are cryptographically verified through Credly's blockchain-backed platform!`
    },

    certifications: {
        keywords: ['certification', 'certified', 'cisa', 'iso', 'qualified', 'credentials', 'certificate', 'ca', 'chartered accountant', 'qualifications'],
        response: `📜 **Professional Certifications (75+)**

**Elite Qualifications:**
🏆 **Chartered Accountant (CA)** - ICAN, Dec 2024
🛡️ **CISA** - Score 625/800 (ID: 262979122)

**ISO Lead Auditor:**
✅ ISO/IEC 27001:2022 - 95% (ISMS)
✅ ISO/IEC 42001:2023 - 84% (AI Management)

**Security & Compliance (14 certs):**
• Certified Phishing Prevention Specialist
• PCI DSS, GDPR, HIPAA Compliance
• Digital Forensics & Incident Investigation

**AI & Technology (12 certs):**
• Google Gemini Certified (2025-2028)
• AI Fluency for Educators (Anthropic)

**Cloud & Database (3 certs):**
• PingCAP Certified TiDB Practitioner - 95%

**Cybersecurity (6 certs):**
• TryHackMe Bronze League - 1st Ranked

Want details on any specific certification?`
    },

    experience: {
        keywords: ['experience', 'work', 'job', 'career', 'worked', 'position', 'role', 'employment', 'company', 'sanima', 'bank'],
        response: `💼 **Professional Experience (8+ Years)**

**Current Role:**
🔹 **Head of Internal Audit & Compliance**
   Sanima Group (9 companies) | Apr 2025 - Present
   • Leading audit operations across entire group
   • Designed Internal Audit Manual 2025

**Previous Roles:**
🔹 **Junior Officer - Finance** | Garima Bikas Bank (2024-2025)
🔹 **Junior Officer - Finance** | Lumbini Bikas Bank (2022-2024)
   🏆 2x Bronze Award Winner
🔹 **Internal Audit Team Leader** | MR Associates (2021-2022)
   • Audited 60+ branches of Citizens Bank
🔹 **Audit Professional** | SAR Associates (2016-2020)
   ⭐ Top 4 Employee Star 2019
🔹 **IFRS Implementor** | SAR Associates (Part-time, 2017-2019)
   🏆 First-time IFRS Implementor in Nepal

Which role would you like to know more about?`
    },

    projects: {
        keywords: ['project', 'portfolio', 'achievement', 'completed', 'work done', 'accomplishment'],
        response: `🚀 **Major Projects & Achievements (40+)**

**IFRS Convergence:**
✅ 20+ financial institutions converted
✅ Including NABIL, Citizens, Sanima Bank

**Internal Audit:**
✅ Citizens Bank - 60+ branches audited
✅ Internal Audit Manual 2025 - Sanima Group

**IT/IS Audit:**
✅ IT GAP Assessment - Sanima Group (9 companies)
✅ ISO 27001 Annex A Controls evaluation

**Financial Projects:**
✅ Annual Book Preparation - Garima Bikas Bank
✅ IFRS 9 ECL Model Implementation
✅ 10-Year Financial Projection - Lumbini Bikas Bank

**Awards:**
🏆 Best Presented Annual Report FY 2021/22 (Bronze)
🏆 Best Presented Annual Report FY 2022/23 (Bronze)

Want details on any specific project?`
    },

    skills: {
        keywords: ['skill', 'expertise', 'good at', 'specialization', 'proficient', 'capable', 'ability'],
        response: `🎯 **Professional Skills**

**Audit & Assurance:**
• Internal Audit - 95% (Expert)
• IS Audit (CISA) - 92% (Expert)
• Risk-Based Audit - 88%

**Financial Management:**
• IFRS/NFRS Reporting - 95%
• Financial Analysis - 93%
• Treasury Management - 85%

**Compliance & Risk:**
• ISO 27001 (ISMS) - 95%
• ISO 42001 (AI Management) - 84%
• GRC - 93%

**Technology:**
• Banking Software (Pumori, Finacle, T24) - 92%
• Power BI & Analytics - 85%

Any specific skill you'd like to discuss?`
    },

    education: {
        keywords: ['education', 'study', 'degree', 'university', 'college', 'academic', 'school'],
        response: `🎓 **Educational Background**

**Professional:**
🏆 **Chartered Accountant (CA)**
   Institute of Chartered Accountants of Nepal (ICAN)
   Qualified: December 2024

**Academic:**
📚 **MA Economics** (In Progress) - Tribhuvan University

**Specialized Training:**
• 100+ hours IT Training (ICAN)
• GMCS - General Management & Communication Skills
• Multiple professional development courses`
    },

    awards: {
        keywords: ['award', 'achievement', 'recognition', 'prize', 'win', 'honor', 'accolade'],
        response: `🏆 **Awards & Recognition**

🥉 Best Presented Award (BPA) - FY 2021/22 (Bronze) - Lumbini Bikas Bank
🥉 Best Presented Award (BPA) - FY 2022/23 (Bronze) - Lumbini Bikas Bank
⭐ Top 4 Employee Star 2019 - SAR Associates (among 100+ staff)
🥇 TryHackMe Bronze League - 1st Ranked`
    },

    iso: {
        keywords: ['iso 27001', 'iso 42001', 'iso 9001', 'information security', 'isms', 'ai management', 'lead auditor', 'quality management'],
        response: `🔒 **ISO Certifications**

**ISO/IEC 27001:2022 Lead Auditor** - Score: 95%
Information Security Management Systems (ISMS)
Valid: Dec 2025 - Dec 2028 🎖️ Verified on Credly!

**ISO/IEC 42001:2023 Lead Auditor** - Score: 84%
AI Management Systems (AIMS)
One of the first in Nepal! 🎖️ Verified on Credly!

**ISO 9001 QMS Associate** - Quality Management Systems`
    },

    currentRole: {
        keywords: ['current', 'now', 'present', 'today', 'doing', 'working on'],
        response: `💼 **Current Position**

**Head of Internal Audit & Compliance**
🏢 Sanima Group | April 2025 - Present

• Leading internal audit across 9 group companies
• Designed Internal Audit Manual 2025
• IT GAP Assessment (ISO 27001 aligned)
• Mentoring aspiring Chartered Accountants`
    },

    services: {
        keywords: ['service', 'offer', 'provide', 'help', 'consulting', 'consultancy'],
        response: `🛠️ **Professional Services**

**Audit Services:** Internal Audit, IS/IT Audit, Risk-Based Audit
**Compliance:** ISO 27001/42001, NRB/SEBON, GRC Frameworks
**Financial:** IFRS/NFRS Convergence, Financial Projections
**Consulting:** Policy Development, Audit Manual Creation

📧 Contact: ca.manish.shrestha@gmail.com`
    },

    about: {
        keywords: ['about', 'who', 'tell me about', 'introduce', 'background', 'profile'],
        response: `👤 **About Manish Shrestha**

Elite Finance & IT Audit Professional with 8+ years of experience.

**Current:** Head of Internal Audit & Compliance at Sanima Group

**Highlights:**
✅ Chartered Accountant (ICAN) - Dec 2024
✅ CISA Certified (625/800)
✅ ISO 27001 & 42001 Lead Auditor
✅ 75+ professional certifications
✅ 40+ projects completed
✅ 2x ICAN Award Winner
✅ First-time IFRS Implementor in Nepal 🇳🇵`
    },

    cybersecurity: {
        keywords: ['cybersecurity', 'security', 'hacking', 'pentesting', 'ethical hacker', 'tryhackme'],
        response: `🔐 **Cybersecurity Expertise**

**Credly Verified:**
🎖️ Ethical Hacker (Cisco)
🎖️ AI Security Governance

**Offensive Security:**
🥇 TryHackMe Bronze League - 1st Ranked
• Ethical Hacking - 19 Hours

**Defensive Security:**
• Certified Phishing Prevention Specialist
• Digital Forensics & Incident Investigation
• Vulnerability Management (Qualys)`
    },

    location: {
        keywords: ['location', 'where', 'based', 'live', 'address', 'nepal', 'kathmandu', 'lalitpur'],
        response: `📍 **Location**

**Current Location:** Satdobato, Lalitpur, Nepal
**Work Location:** Sanima Group Corporate Office

**Availability:**
• In-person meetings in Kathmandu Valley
• Virtual meetings globally
• Site visits across Nepal`
    },

    thanks: {
        keywords: ['thank', 'thanks', 'appreciate', 'grateful', 'helpful'],
        response: `😊 You're welcome! Is there anything else you'd like to know about Manish's professional background, certifications, or how to contact him?`
    },

    goodbye: {
        keywords: ['bye', 'goodbye', 'see you', 'later', 'exit', 'quit', 'close'],
        response: `👋 Thank you for visiting!

**Quick Contact:**
📧 ca.manish.shrestha@gmail.com
📱 +977 9843676945

Have a great day! 🌟`
    },

    hire: {
        keywords: ['hire', 'recruit', 'job offer', 'opportunity', 'vacancy', 'position open'],
        response: `💼 **Interested in Hiring Manish?**

📧 Email: ca.manish.shrestha@gmail.com
📱 Phone: +977 9843676945

✅ Open to new opportunities
✅ Available for consulting
✅ Interested in challenging roles`
    },

    pricing: {
        keywords: ['price', 'cost', 'fee', 'rate', 'charge', 'budget', 'payment'],
        response: `💰 **Consulting Rates**

Rates vary based on project scope & complexity.

**To Get a Quote:**
📧 Email: ca.manish.shrestha@gmail.com

Please include project description, timeline, and requirements.`
    },

    website: {
        keywords: ['website', 'site', 'built', 'made', 'develop', 'portfolio site', 'technology used'],
        response: `💻 **About This Website**

This portfolio was built with **HTML, CSS, and JavaScript** — designed with ❤️ for technology by CA Manish Shrestha himself!

**Features:**
• Interactive particle background
• AI chat assistant (that's me! 🤖)
• Dynamic counters & animations
• Project filtering system
• Responsive design for all devices
• Dark/Light/B&W theme modes
• 60fps butter-smooth animations`
    },

    default: {
        keywords: [],
        response: `🤔 I'm not sure I understand that question.

I can help you with:

📜 **Certifications** - "What certifications do you have?"
💼 **Experience** - "Tell me about your experience"
🚀 **Projects** - "What projects have you completed?"
📧 **Contact** - "How can I contact you?"
🎯 **Skills** - "What are your skills?"
🔐 **Security** - "Tell me about cybersecurity expertise"

Try asking about any of these topics!`
    }
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    requestAnimationFrame(() => {
        initializeApp();
    });
});

function initializeApp() {
    // Phase 1: Critical UI
    requestAnimationFrame(() => {
        initNavigation();
        initThemeToggle();
        loadTheme();
    });

    // Phase 2: Interactive features
    setTimeout(() => {
        initTypingEffect();
        initHeroCounters();
        initScrollCounters();
        initScrollAnimations();
    }, 100);

    // Phase 3: Forms and filters
    setTimeout(() => {
        initProjectFilters();
        initContactForm();
        initScrollToTop();
    }, 200);

    // Phase 4: Visual enhancements
    setTimeout(() => {
        initCustomCursor();
        initSkillBars();
        initGeometricPhotoEffect();
    }, 300);

    // Phase 5: Heavy components
    setTimeout(() => {
        initBadgesSection();
        initAIChatbot();
        initViewCounter();
    }, 400);
}

// ========================================
// ISSUE #4: VIEW COUNTER - Start from 640
// ========================================
function initViewCounter() {
    const counterElement = document.getElementById('view-count');
    if (!counterElement) return;

    const BASE_VIEWS = 640;

    fetch('https://api.counterapi.dev/v1/camanishshrestha.com.np/views/up')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data && typeof data.count === 'number') {
                var totalViews = BASE_VIEWS + data.count;
                counterElement.textContent = totalViews.toLocaleString();
            } else {
                fallbackViewCounter();
            }
        })
        .catch(function() {
            fallbackViewCounter();
        });

    function fallbackViewCounter() {
        var stored = localStorage.getItem('camanishshrestha_view_offset');
        var offset = stored ? parseInt(stored) : 0;
        offset++;
        localStorage.setItem('camanishshrestha_view_offset', offset.toString());
        var totalViews = BASE_VIEWS + offset;
        counterElement.textContent = totalViews.toLocaleString();
    }
}

// ========================================
// ISSUE #2 & #3: HERO STAT COUNTERS WITH "+"
// These are the stat-item h3 counters in the hero
// They animate on page load with proper suffix
// ========================================
function initHeroCounters() {
    const statItems = document.querySelectorAll('.stat-item h3');

    statItems.forEach(function(counter) {
        const originalText = counter.textContent.trim();
        // Extract number and suffix (e.g., "8+" -> 8 and "+", "100+" -> 100 and "+")
        const match = originalText.match(/^(\d+)(.*)$/);
        if (match) {
            const target = parseInt(match[1]);
            const suffix = match[2] || '';
            counter.setAttribute('data-target', target);
            counter.setAttribute('data-suffix', suffix);
        }
    });

    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-item h3[data-target]');
                counters.forEach(function(counter) {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const suffix = counter.getAttribute('data-suffix') || '';
                    animateNumber(counter, target, suffix, 1500);
                });
            }
        });
    }, { threshold: 0.3 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
        globalObservers.push(heroObserver);
    }
}

// ========================================
// ISSUE #2 & #3: SCROLL-TRIGGERED COUNTERS
// For .projects-stats-summary and .tech-stats-bar
// Always shows correct final number with suffix
// ========================================
function initScrollCounters() {
    var sections = document.querySelectorAll('.projects-stats-summary, .tech-stats-bar');

    var counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var counters = entry.target.querySelectorAll('.stat-number, .tech-stat-number');
                counters.forEach(function(counter) {
                    var targetAttr = counter.getAttribute('data-target');
                    var suffix = counter.getAttribute('data-suffix') || '';
                    var target = parseInt(targetAttr);

                    if (!isNaN(target)) {
                        animateNumber(counter, target, suffix, 1500);
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(function(section) {
        counterObserver.observe(section);
    });

    globalObservers.push(counterObserver);
}

// ========================================
// SHARED COUNTER ANIMATION FUNCTION
// Issue #3: ALWAYS lands on correct final number
// ========================================
function animateNumber(element, target, suffix, duration) {
    if (!element || isNaN(target)) return;

    var startTime = null;
    duration = duration || 1500;

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    // Reset to 0
    element.textContent = '0' + suffix;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var easedProgress = easeOutQuart(progress);
        var current = Math.floor(target * easedProgress);

        if (progress < 1) {
            element.textContent = current + suffix;
            requestAnimationFrame(step);
        } else {
            // GUARANTEE final value is exact (Issue #3)
            element.textContent = target + suffix;
        }
    }

    requestAnimationFrame(step);
}

// ========================================
// BADGES SECTION - OPTIMIZED
// ========================================
function initBadgesSection() {
    const badgeCards = document.querySelectorAll('.badge-card');
    if (badgeCards.length === 0) return;

    const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 80);
                badgeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px'
    });

    badgeCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        card.style.transition = `opacity ${window.ANIMATION_DURATION || 0.8}s ease, transform ${window.ANIMATION_DURATION || 0.8}s ease`;
        badgeObserver.observe(card);
    });

    globalObservers.push(badgeObserver);
}

// ========================================
// AI CHATBOT - ISSUE #5 COMPLETELY FIXED
// ========================================
function initAIChatbot() {
    loadChatState();

    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    if (!chatState.welcomeShown) {
        setTimeout(() => {
            showChatNotification();
        }, 5000);
    }
}

function toggleChat() {
    const chatContainer = document.getElementById('ai-chat-container');
    const toggleBtn = document.getElementById('chatToggleBtn');
    if (!chatContainer) return;

    chatState.isOpen = !chatState.isOpen;

    if (chatState.isOpen) {
        chatContainer.classList.remove('hidden');

        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) input.focus();
        }, 300);

        const badge = toggleBtn?.querySelector('.chat-badge');
        if (badge) {
            badge.style.opacity = '0';
            setTimeout(() => { badge.style.display = 'none'; }, 300);
        }

        chatState.welcomeShown = true;
        saveChatState();
    } else {
        chatContainer.classList.add('hidden');
    }
}

function closeChat() {
    const chatContainer = document.getElementById('ai-chat-container');
    if (chatContainer) {
        chatContainer.classList.add('hidden');
        chatState.isOpen = false;
    }
}

function showChatNotification() {
    const toggleBtn = document.getElementById('chatToggleBtn');
    if (!toggleBtn) return;
    const badge = toggleBtn.querySelector('.chat-badge');
    if (badge) {
        badge.style.display = 'block';
        badge.textContent = '👋 Ask me!';
        badge.style.opacity = '1';
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';

    chatState.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
    });
    chatState.visitorInfo.questionsAsked.push(message);

    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        const response = getBotResponse(message);
        addMessage(response, 'bot');

        chatState.conversationHistory.push({
            role: 'bot',
            content: response,
            timestamp: new Date()
        });
        chatState.messageCount++;
        saveChatState();

        if (CHATBOT_CONFIG.emailNotifications && chatState.messageCount <= 3) {
            sendEmailNotification(message, response);
        }
    }, CHATBOT_CONFIG.typingDelay);
}

function askQuestion(question) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = question;
        sendMessage();
    }
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'bot'
        ? '<i class="fas fa-robot"></i>'
        : '<i class="fas fa-user"></i>';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const textP = document.createElement('p');
    const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    textP.innerHTML = formattedText;

    contentDiv.appendChild(textP);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);

    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    messagesContainer.appendChild(messageDiv);

    requestAnimationFrame(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    hideTypingIndicator();

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// ========================================
// ISSUE #5 FIX: getBotResponse - PRIORITY ORDER
// Contact is checked FIRST so it never returns experience
// ========================================
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();

    // PRIORITY ORDER: Check contact FIRST (Issue #5 fix)
    const priorityOrder = [
        'contact',    // Must be first — fixes the bug
        'greeting',
        'badges',
        'certifications',
        'iso',
        'currentRole',
        'experience',
        'projects',
        'skills',
        'education',
        'awards',
        'services',
        'about',
        'cybersecurity',
        'location',
        'hire',
        'pricing',
        'website',
        'thanks',
        'goodbye'
    ];

    for (const category of priorityOrder) {
        const data = knowledgeBase[category];
        if (!data) continue;

        for (const keyword of data.keywords) {
            if (message.includes(keyword.toLowerCase())) {
                return data.response;
            }
        }
    }

    // Fuzzy matching for question-style queries
    if (message.match(/^(what|who|how|where|when|why|tell|show|can|do|does|is|are)/)) {
        for (const category of priorityOrder) {
            const data = knowledgeBase[category];
            if (!data) continue;
            for (const keyword of data.keywords) {
                if (keyword.length > 3 && message.includes(keyword.substring(0, 4))) {
                    return data.response;
                }
            }
        }
    }

    return knowledgeBase.default.response;
}

// ========================================
// EMAIL NOTIFICATION (WEB3FORMS)
// ========================================
function sendEmailNotification(userQuestion, botResponse) {
    const formData = new FormData();
    formData.append('access_key', '36e8d043-01c0-41d2-99b4-0fda13264c67');
    formData.append('subject', '🤖 New Chat - ' + new Date().toLocaleString());
    formData.append('from_name', 'Portfolio AI Chatbot');
    formData.append('email', 'ca.manish.shrestha@gmail.com');
    formData.append('message', `
📬 NEW CHAT NOTIFICATION

👤 Visitor Question: ${userQuestion}
🤖 Bot Response: ${botResponse.substring(0, 500)}${botResponse.length > 500 ? '...' : ''}

📊 Session Info:
• Total Messages: ${chatState.messageCount + 1}
• Time: ${new Date().toLocaleString()}
• Session Duration: ${getSessionDuration()}

📝 Questions Asked:
${chatState.visitorInfo.questionsAsked.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Sent from: ${window.location.href}
    `);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            storeNotificationLocally(userQuestion, botResponse);
        }
    })
    .catch(() => {
        storeNotificationLocally(userQuestion, botResponse);
    });
}

function storeNotificationLocally(question, response) {
    try {
        const notifications = JSON.parse(localStorage.getItem('chatNotifications') || '[]');
        notifications.push({
            question,
            response: response.substring(0, 200),
            timestamp: new Date().toISOString(),
            messageCount: chatState.messageCount
        });
        if (notifications.length > 50) notifications.shift();
        localStorage.setItem('chatNotifications', JSON.stringify(notifications));
    } catch(e) { /* silently fail */ }
}

function getSessionDuration() {
    const now = new Date();
    const start = new Date(chatState.visitorInfo.startTime);
    const diff = Math.floor((now - start) / 1000);
    return `${Math.floor(diff / 60)}m ${diff % 60}s`;
}

function saveChatState() {
    try {
        sessionStorage.setItem('chatState', JSON.stringify({
            messageCount: chatState.messageCount,
            welcomeShown: chatState.welcomeShown,
            visitorInfo: chatState.visitorInfo
        }));
    } catch (e) { /* silently fail */ }
}

function loadChatState() {
    try {
        const saved = sessionStorage.getItem('chatState');
        if (saved) {
            const parsed = JSON.parse(saved);
            chatState.messageCount = parsed.messageCount || 0;
            chatState.welcomeShown = parsed.welcomeShown || false;
            chatState.visitorInfo = parsed.visitorInfo || { startTime: new Date(), questionsAsked: [] };
        }
    } catch (e) { /* silently fail */ }
}

// ========================================
// GEOMETRIC PHOTO EFFECT - OPTIMIZED
// Issue #8: No signature references
// ========================================
function initGeometricPhotoEffect() {
    const photoContainer = document.querySelector('.geometric-photo-container');
    const photo = document.querySelector('.pop-out-photo');
    const frame = document.querySelector('.geometric-frame');

    if (!photoContainer || !photo || !frame) return;

    // Skip on touch devices for performance
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let animationFrameId = null;

    photoContainer.addEventListener('mousemove', (e) => {
        const rect = photoContainer.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }, { passive: true });

    function animatePhoto() {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;

        photo.style.transform = `
            translateY(-8px) scale(1.03)
            rotateY(${currentX * 5}deg)
            rotateX(${-currentY * 5}deg)
        `;
        frame.style.transform = `
            translate(-50%, -50%)
            rotateY(${currentX * 3}deg)
            rotateX(${-currentY * 3}deg)
        `;

        if (Math.abs(currentX - mouseX) > 0.001 || Math.abs(currentY - mouseY) > 0.001) {
            animationFrameId = requestAnimationFrame(animatePhoto);
        }
    }

    photoContainer.addEventListener('mouseenter', () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(animatePhoto);
    });

    photoContainer.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;

        function resetPhoto() {
            currentX += (0 - currentX) * 0.1;
            currentY += (0 - currentY) * 0.1;

            photo.style.transform = `
                translateY(-8px) scale(1.03)
                rotateY(${currentX * 5}deg)
                rotateX(${-currentY * 5}deg)
            `;
            frame.style.transform = `
                translate(-50%, -50%)
                rotateY(${currentX * 3}deg)
                rotateX(${-currentY * 3}deg)
            `;

            if (Math.abs(currentX) > 0.001 || Math.abs(currentY) > 0.001) {
                animationFrameId = requestAnimationFrame(resetPhoto);
            } else {
                photo.style.transform = '';
                frame.style.transform = 'translate(-50%, -50%)';
            }
        }

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(resetPhoto);
    });
}

// ========================================
// NAVIGATION - OPTIMIZED (Issue #1 FIXED)
// ========================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', throttle(() => {
        if (navbar) {
            if (window.pageYOffset > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }, 100), { passive: true });

    // Hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu?.classList.toggle('active');
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', throttle(() => {
        const scrollY = window.pageYOffset;
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink?.classList.add('active');
            }
        });
    }, 150), { passive: true });

    // ISSUE #1 FIX: Smooth scroll with proper navbar offset
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navbarHeight = navbar ? navbar.offsetHeight + 10 : 80;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// THEME TOGGLE - OPTIMIZED
// ========================================
function initThemeToggle() {
    const themeButtons = document.querySelectorAll('.theme-btn');

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            setTheme(theme, true);
        });
    });
}

function setTheme(theme, showNotificationFlag = false) {
    document.body.classList.remove('light-mode', 'blackwhite-mode');
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));

    if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('theme-light')?.classList.add('active');
    } else if (theme === 'blackwhite') {
        document.body.classList.add('blackwhite-mode');
        document.getElementById('theme-bw')?.classList.add('active');
    } else {
        document.getElementById('theme-dark')?.classList.add('active');
    }

    localStorage.setItem('theme', theme);

    if (showNotificationFlag) {
        const themeNames = { 'dark': 'Dark Mode', 'light': 'Light Mode', 'blackwhite': 'Black & White Mode' };
        showNotification(`Switched to ${themeNames[theme]} ✨`, 'success');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme, false);
}

// ========================================
// TYPING EFFECT - OPTIMIZED
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
    let typingSpeed = window.TYPING_SPEED || 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = window.TYPING_SPEED || 100;
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
// SCROLL ANIMATIONS - OPTIMIZED (Issue #7)
// ========================================
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.qual-card, .cert-card, .timeline-item, .skill-category, ' +
        '.project-card, .info-card, .about-text, .geometric-photo-container'
    );

    // Don't re-animate badge-cards — they have their own observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
    });

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px) scale(0.98)';
        element.style.transition = `opacity ${window.ANIMATION_DURATION || 0.8}s ease, transform ${window.ANIMATION_DURATION || 0.8}s ease`;
        observer.observe(element);
    });

    globalObservers.push(observer);
}

// ========================================
// PROJECT FILTERS - OPTIMIZED
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

            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ========================================
// SKILL BARS - OPTIMIZED
// ========================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetWidth = entry.target.style.width;
                entry.target.style.width = '0';
                entry.target.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';

                setTimeout(() => {
                    entry.target.style.width = targetWidth;
                }, 100);

                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => skillObserver.observe(bar));
    globalObservers.push(skillObserver);
}

// ========================================
// CONTACT FORM - OPTIMIZED
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
            await sendContactEmail(formData);
            showNotification('✅ Message sent successfully!', 'success');
            contactForm.reset();
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            setTimeout(() => { submitBtn.innerHTML = originalText; }, 2000);
        } catch (error) {
            showNotification('❌ Failed to send. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
        }
    });
}

function sendContactEmail(data) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('access_key', '36e8d043-01c0-41d2-99b4-0fda13264c67');
        formData.append('subject', '📩 Contact: ' + data.subject);
        formData.append('from_name', data.name);
        formData.append('email', data.email);
        formData.append('message', `
From: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

Sent from: ${window.location.href}
Time: ${new Date().toLocaleString()}
        `);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) resolve(result);
            else reject(new Error(result.message));
        })
        .catch(error => {
            // Fallback to mailto
            const mailtoLink = `mailto:ca.manish.shrestha@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message)}%0D%0AFrom: ${encodeURIComponent(data.name)} (${encodeURIComponent(data.email)})`;
            window.location.href = mailtoLink;
            resolve();
        });
    });
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 10000;
        animation: slideIn 0.4s ease;
        max-width: 350px;
        font-size: 0.9rem;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Notification animation styles
(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideOutDown {
            from { opacity: 1; transform: translateY(0) scale(1); }
            to { opacity: 0; transform: translateY(30px) scale(0.95); }
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
        .notification-close:hover { opacity: 1; }
    `;
    document.head.appendChild(style);
})();

// ========================================
// SCROLL TO TOP - OPTIMIZED
// ========================================
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('active');
            scrollTopBtn.classList.remove('visible');
        }
    }, 150), { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// CUSTOM CURSOR - OPTIMIZED (Issue #7)
// Only on desktop with fine pointer
// ========================================
function initCustomCursor() {
    // Skip on touch devices, small screens, or low-end devices
    if (window.innerWidth < 1024 || !window.ENABLE_CUSTOM_CURSOR) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

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

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    }, { passive: true });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }

    animateFollower();

    const interactiveElements = document.querySelectorAll(
        'a, button, .btn, .project-card, .cert-card, .qual-card, .badge-card, ' +
        '.info-card, .tech-item, .filter-btn, .social-links a, ' +
        'input, textarea, .nav-link, .theme-btn, .hamburger, ' +
        '.geometric-photo-container, .chat-toggle-btn, ' +
        '.suggestion-btn, .chat-send-btn, .chat-input, .badge-verify-btn'
    );

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
            cursor.style.background = 'rgba(0, 245, 255, 0.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.8)';
        });

        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'var(--accent-purple)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    }, { passive: true });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
    }, { passive: true });
}

// ========================================
// PARALLAX - PERFORMANCE GATED (Issue #7)
// ========================================
function initParallax() {
    if (!window.ENABLE_PARALLAX) return;
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;

    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }, 16), { passive: true });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;

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
    globalObservers.push(imageObserver);
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeChat();
            document.getElementById('hamburger')?.classList.remove('active');
            document.getElementById('nav-menu')?.classList.remove('active');
            const notification = document.querySelector('.notification');
            if (notification) notification.remove();
        }

        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            toggleChat();
        }
    });
}

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
// ANALYTICS TRACKING (silent)
// ========================================
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, { 'event_category': category, 'event_label': label || '' });
    }
}

// ========================================
// CLEANUP
// ========================================
function cleanup() {
    globalObservers.forEach(obs => obs.disconnect());
    globalObservers = [];
}

window.addEventListener('beforeunload', cleanup);

// ========================================
// LOAD EVENT - FINAL INITIALIZATIONS
// ========================================
window.addEventListener('load', () => {
    initLazyLoading();
    initParallax();
    initPageVisibility();
    initKeyboardShortcuts();

    // Remove loader if any
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.transition = 'opacity 0.5s ease';
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
});

// ========================================
// ERROR HANDLING (silent in production)
// ========================================
window.addEventListener('error', (e) => {
    console.error('Error:', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise Error:', e.reason);
});
