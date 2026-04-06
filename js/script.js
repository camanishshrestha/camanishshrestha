/**
 * MODERN PROFESSIONAL PORTFOLIO - JAVASCRIPT
 * Author: Manish Shrestha
 * Description: Interactive functionality for portfolio website
 * Features: AI Chatbot, Email Notifications, Particle Background, Credly Badges, and more
 * Performance: Optimized for 60fps animations and butter-smooth interactions
 */

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ========================================
// INITIALIZATION & DOM CONTENT LOADED
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components with stagger for smooth load
    requestAnimationFrame(() => {
        initNavigation();
        initThemeToggle();
        loadTheme(); // Load saved theme first
    });
    
    setTimeout(() => {
        initTypingEffect();
        initCounters();
        initScrollAnimations();
    }, 100);
    
    setTimeout(() => {
        initProjectFilters();
        initContactForm();
        initScrollToTop();
    }, 200);
    
    setTimeout(() => {
        initCustomCursor();
        initSkillBars();
        initGeometricPhotoEffect();
    }, 300);
    
    setTimeout(() => {
        initParticleBackground();
        initBadgesSection();
        initAIChatbot();
    }, 400);
    
    console.log('✅ Portfolio initialized successfully!');
}

// ========================================
// NEW: CREDLY BADGES SECTION (ULTRA-SMOOTH)
// ========================================
function initBadgesSection() {
    console.log('🎖️ Initializing Badges section...');
    
    const badgeCards = document.querySelectorAll('.badge-card');
    
    if (badgeCards.length === 0) {
        console.warn('⚠️ No badge cards found');
        return;
    }
    
    // Smooth stagger animation on scroll
    const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 80); // Reduced delay for smoother feel
                
                badgeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05, // Earlier trigger
        rootMargin: '0px 0px -30px 0px'
    });
    
    badgeCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'; // Smooth easing
        badgeObserver.observe(card);
    });
    
    // Track badge clicks
    const verifyButtons = document.querySelectorAll('.badge-verify-btn');
    verifyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const badgeName = e.target.closest('.badge-card').querySelector('h4').textContent;
            trackEvent('Badges', 'Verify Click', badgeName);
            
            // Smooth feedback
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
            
            console.log('🔗 Verifying badge:', badgeName);
        });
    });
    
    // Smooth badge hover effects with transform optimization
    badgeCards.forEach(card => {
        const glow = card.querySelector('.badge-glow');
        
        card.addEventListener('mouseenter', () => {
            if (glow) {
                glow.style.transition = 'opacity 0.4s ease';
                glow.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });
    
    console.log(`✅ ${badgeCards.length} badges initialized with smooth animations!`);
}

// ========================================
// AI CHATBOT - COMPLETE IMPLEMENTATION
// ========================================

// Chatbot Configuration
const CHATBOT_CONFIG = {
    botName: 'Manish AI',
    ownerName: 'Manish Shrestha',
    ownerEmail: 'ca.manish.shrestha@gmail.com',
    typingDelay: 800,
    emailNotifications: true,
    welcomeShown: false
};

// Knowledge Base - All information about you
const knowledgeBase = {
    // Greetings
    greeting: {
        keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'namaste', 'namaskar'],
        response: `👋 Hello! Welcome to Manish Shrestha's portfolio!

I'm his AI assistant and I can help you learn about:

📜 **Certifications** - CA, CISA, ISO Lead Auditor (75+ certs)
🎖️ **Credly Badges** - Verified digital credentials
💼 **Experience** - 8+ years in audit & finance
🚀 **Projects** - 60+ completed projects
🎯 **Skills** - Audit, Compliance, GRC
📧 **Contact** - How to reach Manish

What would you like to know?`
    },

    // NEW: Credly Badges
    badges: {
        keywords: ['badge', 'credly', 'verified', 'digital credential', 'blockchain', 'verify'],
        response: `🎖️ **Credly Verified Badges (9 Total)**

**Featured Badges:**
🏆 **Chartered Accountant (CA)**
   ICAN - Qualified December 2024

🛡️ **CISA - Certified Information Systems Auditor**
   ISACA - Score 625/800

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

**Verification:**
All badges are cryptographically verified through Credly's blockchain-backed platform. Click "Verify Badge" on any badge to see official credentials!

Would you like to see specific badge details?`
    },

    // Certifications (Updated to mention Credly)
    certifications: {
        keywords: ['certification', 'certified', 'cisa', 'iso', 'qualified', 'credentials', 'certificate', 'ca', 'chartered accountant', 'qualifications'],
        response: `📜 **Professional Certifications (75+)**

**Elite Qualifications:**
🏆 **Chartered Accountant (CA)** - ICAN, Dec 2024
🛡️ **CISA** - Score 625/800 (ID: 262979122)

**Credly Verified Badges:**
Check the "Badges" section to see 9 verified digital credentials with blockchain verification!

**ISO Lead Auditor:**
✅ ISO/IEC 27001:2022 - 95% (ISMS)
✅ ISO/IEC 42001:2023 - 84% (AI Management)
✅ ISO 9001 Quality Management Systems Associate

**Security & Compliance (14 certs):**
• Certified Phishing Prevention Specialist (CPPS)
• Certified Ransomware Protection Officer (R-CRPO)
• PCI DSS Compliance Training
• GDPR Foundations
• HIPAA Compliance Training
• Vulnerability Management (Qualys)
• Digital Forensics & Incident Investigation
• Malware Analysis
• Ethical Hacker (Cisco)

**AI & Technology (12 certs):**
• Google Gemini Certified (2025-2028)
• AI Fluency for Educators (Anthropic)
• Google Certified Educator Level 1 & 2
• AI Security and Governance (Securiti AI)
• Foundations of Generative AI

**Cloud & Database (3 certs):**
• PingCAP Certified TiDB Practitioner - 95%
• Graph Data Science (Neo4j)
• Cloud Computing (CodeRed)

**Cybersecurity (6 certs):**
• TryHackMe Bronze League - 1st Ranked
• Ethical Hacking - 19 Hours (TryHackMe)
• In-house Hacking & Pentesting Labs

**Data Analytics (7 certs):**
• Power BI (Multiple certifications)
• Google Analytics Certified
• AI-Powered Performance Ads

**Finance & Accounting (12 certs):**
• IFRS 9: Expected Credit Losses
• QuickBooks Online Certified
• Xero Advisor Certified
• Tally ERP 9 Course

Want details on any specific certification?`
    },

    // Experience
    experience: {
        keywords: ['experience', 'work', 'job', 'career', 'worked', 'position', 'role', 'employment', 'company', 'sanima', 'bank'],
        response: `💼 **Professional Experience (8+ Years)**

**Current Role:**
🔹 **Head of Internal Audit & Compliance**
   Sanima Group (9 companies) | Apr 2025 - Present
   • Leading audit operations across entire group
   • Designed Internal Audit Manual 2025
   • IT GAP Assessment (ISO 27001)

**Previous Roles:**
🔹 **Junior Officer - Finance** | Garima Bikas Bank (2024-2025)
🔹 **Junior Officer - Finance** | Lumbini Bikas Bank (2022-2024)
   🏆 2x Bronze Award Winner - Best Presented Annual Report
🔹 **Internal Audit Team Leader** | MR Associates (2021-2022)
   • Audited 60+ branches of Citizens Bank
🔹 **Audit Professional** | SAR Associates (2016-2020)
   ⭐ Top 4 Employee Star 2019
🔹 **IFRS Implementor** | SAR Associates (Part-time, 2017-2019)
   🏆 First-time IFRS Implementor in Nepal

Which role would you like to know more about?`
    },

    // Projects
    projects: {
        keywords: ['project', 'portfolio', 'achievement', 'completed', 'work done', 'accomplishment'],
        response: `🚀 **Major Projects & Achievements**

**IFRS Convergence:**
✅ 20+ financial institutions converted
✅ Including NABIL, Citizens, Sanima Bank

**Internal Audit:**
✅ Citizens Bank - 60+ branches audited
✅ Risk-based audit frameworks

**IT/IS Audit:**
✅ IT GAP Assessment - Sanima Group (9 companies)
✅ ISO 27001 Annex A Controls evaluation
✅ IS Audit - Citizens International Bank

**Financial Projects (NEW):**
✅ Annual Book Preparation - Garima Bikas Bank FY 2023/24
✅ Annual Budget Finalization - Garima FY 2024/25
✅ IFRS 9 ECL Model - Garima Bikas Bank
✅ 10-Year Financial Projection - Lumbini Bikas Bank

**Policy & Strategic:**
✅ Zero-Based Budgeting - Lumbini Bikas Bank
✅ 5-Year Strategic Plan implementation

**Awards:**
🏆 Best Presented Annual Report FY 2021/22 (Bronze)
🏆 Best Presented Annual Report FY 2022/23 (Bronze)

**Other:**
✅ Debenture Issuance (LBBLD89) - 10-year projections
✅ Internal Audit Manual 2025

Want details on any specific project?`
    },

    // Skills
    skills: {
        keywords: ['skill', 'expertise', 'good at', 'specialization', 'proficient', 'capable', 'ability'],
        response: `🎯 **Professional Skills**

**Audit & Assurance:**
• Internal Audit - 95% (Expert)
• IS Audit (CISA) - 90% (Expert)
• Risk-Based Audit - 88%
• Statutory Audit - 85%

**Financial Management:**
• IFRS/NFRS Reporting - 95%
• Financial Projections - 90%
• Treasury Management - 85%
• Budget Preparation - 92%

**Compliance & Risk:**
• ISO 27001 (ISMS) - 95%
• ISO 42001 (AI Management) - 84%
• GRC - 90%
• NRB/SEBON Compliance - 93%

**Technology:**
• Banking Software (Pumori, Finacle, T24) - 90%
• Power BI & Analytics - 80%
• Cybersecurity Tools - 78%
• AI & Machine Learning - 70%

Any specific skill you'd like to discuss?`
    },

    // Contact
    contact: {
        keywords: ['contact', 'email', 'phone', 'reach', 'hire', 'available', 'connect', 'talk', 'call', 'message'],
        response: `📧 **Contact Information**

**Email:**
• ca.manish.shrestha@gmail.com (Primary)
• manish.shrestha5396@gmail.com

**Phone:**
• +977 9843676945
• +977 9803456703

**Location:**
📍 Satdobato, Lalitpur, Nepal

**Social:**
• LinkedIn: linkedin.com/in/manish-shrestha-cisa-grc
• GitHub: github.com/camanishshrestha

**Availability:**
✅ Open for consulting & audit opportunities
✅ Available for professional collaborations

Would you like me to help you send a message to Manish?`
    },

    // Education
    education: {
        keywords: ['education', 'study', 'degree', 'university', 'college', 'academic', 'school'],
        response: `🎓 **Educational Background**

**Professional:**
🏆 **Chartered Accountant (CA)**
   Institute of Chartered Accountants of Nepal (ICAN)
   Qualified: December 2024

**Academic:**
📚 **MA Economics** (In Progress)
   Tribhuvan University, Nepal

**Specialized Training:**
• 100+ hours IT Training (ICAN)
• GMCS - General Management & Communication Skills
• Multiple professional development courses
• Continuous CPE compliance

Manish believes in lifelong learning and continuously updates his skills!`
    },

    // Awards
    awards: {
        keywords: ['award', 'achievement', 'recognition', 'prize', 'win', 'honor', 'accolade'],
        response: `🏆 **Awards & Recognition**

**ICAN Awards:**
🥉 Best Presented Award (BPA) - FY 2021/22 (Bronze)
   Lumbini Bikas Bank Annual Report

🥉 Best Presented Award (BPA) - FY 2022/23 (Bronze)
   Lumbini Bikas Bank Annual Report

**Professional Recognition:**
⭐ Top 4 Employee Star 2019
   S.A.R Associates (among 100+ staff)

**Competition Awards:**
🥇 TryHackMe Bronze League - 1st Ranked

These awards reflect dedication to excellence in financial reporting and professional conduct!`
    },

    // ISO Certifications
    iso: {
        keywords: ['iso 27001', 'iso 42001', 'iso 9001', 'information security', 'isms', 'ai management', 'lead auditor', 'quality management'],
        response: `🔒 **ISO Certifications**

**ISO/IEC 27001:2022 Lead Auditor**
📊 Score: 95%
📋 Information Security Management Systems (ISMS)
🏢 Provider: Mastermind Assurance, USA
⏱️ Valid: Dec 2025 - Dec 2028
🎖️ **Verified on Credly!**

**ISO/IEC 42001:2023 Lead Auditor**
📊 Score: 84%
🤖 AI Management Systems (AIMS)
🏢 Provider: Mastermind Assurance, USA
⭐ One of the first in Nepal with this certification!
🎖️ **Verified on Credly!**

**ISO 9001 QMS Associate**
📋 Quality Management Systems Foundation
🏢 Provider: SkillFront

These certifications enable Manish to lead audits for organizations seeking ISO compliance.`
    },

    // Current Role
    currentRole: {
        keywords: ['current', 'now', 'present', 'today', 'doing', 'working on'],
        response: `💼 **Current Position**

**Head of Internal Audit & Compliance**
🏢 Sanima Group | April 2025 - Present

**Responsibilities:**
• Leading internal audit across 9 group companies
• Designed Internal Audit Manual 2025
• IT GAP Assessment (ISO 27001 aligned)
• Mentoring aspiring Chartered Accountants
• Risk-based audit framework implementation

**Companies Under Audit:**
Sanima Jum Hydropower and 8 other entities

This role combines financial expertise with IT audit skills!`
    },

    // Services
    services: {
        keywords: ['service', 'offer', 'provide', 'help', 'consulting', 'consultancy'],
        response: `🛠️ **Professional Services**

Manish can help with:

**Audit Services:**
• Internal Audit
• IS/IT Audit
• Risk-Based Audit
• Statutory Audit Support

**Compliance:**
• ISO 27001 Implementation/Audit
• ISO 42001 (AI Management)
• ISO 9001 Quality Management
• NRB/SEBON Compliance
• GRC Frameworks

**Financial:**
• IFRS/NFRS Convergence
• Financial Projections
• Strategic Planning
• Budget Development

**Consulting:**
• Policy Development
• Audit Manual Creation
• Control Framework Design

Interested in any of these services?`
    },

    // About
    about: {
        keywords: ['about', 'who', 'tell me about', 'introduce', 'background', 'profile'],
        response: `👤 **About Manish Shrestha**

Elite Finance & IT Audit Professional with 8+ years of experience spanning Financial Auditing, Information Systems Auditing, and Governance, Risk & Compliance (GRC).

**Current:** Head of Internal Audit & Compliance at Sanima Group

**Highlights:**
✅ Chartered Accountant (ICAN) - Dec 2024
✅ CISA Certified (625/800)
✅ ISO 27001 & 42001 Lead Auditor
✅ 75+ professional certifications
✅ 9 Credly verified badges
✅ 60+ projects completed
✅ 100+ companies audited
✅ 2x Award Winner (ICAN)

**Interests:**
🔐 Cybersecurity
🤖 AI & Machine Learning
💰 FinTech
📊 Data Analytics

Passionate about bridging finance and technology!`
    },

    // Google Certifications
    google: {
        keywords: ['google', 'gemini', 'educator', 'analytics', 'ads'],
        response: `🔷 **Google Certifications**

**Google Gemini Certified**
📅 Valid: 2025-2028
🆔 Credential: 167374784

**Google Certified Educator:**
• Level 2 (Advanced) - ID: 176453114
• Level 1 (Foundation)

**Google Analytics Certification**
📊 Data-driven decision making
🆔 Credential: 149829970

**AI-Powered Performance Ads**
🎯 Digital marketing with AI
🆔 Credential: 150502706

All certifications demonstrate proficiency in Google's ecosystem!`
    },

    // Microsoft Certifications
    microsoft: {
        keywords: ['microsoft', 'power bi', 'azure', 'ai concepts'],
        response: `🔷 **Microsoft Certifications**

**Power BI:**
• Getting Started with Power BI
• Discover Data Achievements

**Security:**
• Ransomware and Extortion - Security Threats

**AI:**
• Introduction to AI Concepts

These certifications validate expertise in Microsoft's data and AI platforms!`
    },

    // Cybersecurity
    cybersecurity: {
        keywords: ['cybersecurity', 'security', 'hacking', 'pentesting', 'ethical hacker', 'tryhackme'],
        response: `🔐 **Cybersecurity Expertise**

**Credly Verified:**
🎖️ Ethical Hacker (Cisco)
🎖️ AI Security Governance

**Offensive Security:**
🥇 TryHackMe Bronze League - 1st Ranked
• Ethical Hacking - 19 Hours (THM)
• Ethical Hacker for Beginners - 21 Hours
• In-house Hacking & Pentesting Labs

**Defensive Security:**
• Certified Phishing Prevention Specialist (CPPS)
• Certified Ransomware Protection Officer (R-CRPO)
• Digital Forensics & Incident Investigation
• Malware Analysis
• Vulnerability Management (Qualys)

**Compliance:**
• PCI DSS Compliance Training
• GDPR Foundations
• HIPAA Compliance Training

Manish combines offensive knowledge with defensive strategy for comprehensive security!`
    },

    // TiDB/Database
    database: {
        keywords: ['tidb', 'database', 'neo4j', 'graph', 'sql', 'distributed'],
        response: `💾 **Database Certifications**

**PingCAP Certified TiDB Practitioner**
📊 Score: 95%
🆔 Credential: 672e-62ec-7a12-107b
📋 Distributed SQL Database Expert

**Neo4j Graph Data Science**
🕸️ Graph algorithms & analytics
🆔 Credential: 4ac51e03-050b-4552-901c-7fe487a607ed

**Capabilities:**
• TiDB architecture & deployment
• HTAP workloads
• Graph data modeling
• Community detection algorithms

These skills enable work with modern, scalable database systems!`
    },

    // Accounting Software
    accounting: {
        keywords: ['quickbooks', 'xero', 'tally', 'accounting software', 'bookkeeping'],
        response: `💼 **Accounting Software Expertise**

**QuickBooks Online Certification Level 1**
🏢 Intuit Certified
📅 Valid: Jun 2025 - Jul 2026
🎖️ **Verified on Credly!**

**Xero Advisor Certified**
🆔 Credential: 11801003
☁️ Cloud accounting expert

**Tally ERP 9 Course**
🏢 Henry Harvin Education
📊 Comprehensive accounting & GST

**Skills:**
• Bookkeeping & reconciliation
• Financial reporting
• Inventory management
• Payroll processing
• GST compliance

Proficient in leading accounting platforms for SMEs!`
    },

    // AI & Generative AI
    ai: {
        keywords: ['artificial intelligence', 'generative ai', 'llm', 'prompt engineering', 'dubai ai'],
        response: `🤖 **AI & Generative AI Expertise**

**Credly Verified:**
🎖️ AI Security Governance
🎖️ Proofpoint AI Agent Security Specialist

**AI Certifications:**
• AI Fluency for Educators (Anthropic)
• AI Security and Governance (Securiti AI)
• Saviynt Identity Security for AI Age
• Foundations of Generative AI (Analytics Vidhya)
• 1 Million Promptors - Dubai Center for AI

**AI Learning:**
• Demystifying Generative AI for Leaders (Infosys)
• Introduction to AI Concepts (Microsoft)
• AI Risks, Rewards & Responsibilities (Alan Turing Institute)
• Digital Skills: AI (Accenture)

**Skills:**
• Prompt engineering
• LLM applications
• AI governance frameworks
• Responsible AI implementation
• AI risk management

Passionate about ethical and practical AI adoption!`
    },

    // Professional Development
    development: {
        keywords: ['training', 'course', 'professional development', 'skill development', 'learning'],
        response: `📚 **Professional Development**

**Management & Communication:**
• GMCS - General Management & Communication Skills (ICAN)
• Crisis Communication (Saylor Academy)
• The Journey to Taming our Biases (UNICEF)

**Business:**
• Foundations of Business & Entrepreneurship (SkillFront)
• Sales Forecasting (HP Foundation)
• Investment Banking Job Simulation (JPMorgan)
• Climate Change in Financial Services (Oliver Wyman)

**Technical:**
• IT Training - 100+ Hours (ICAN)
• Cloud Computing (CodeRed)
• Blockchain Basics (Cyfrin Updraft)

**Memberships:**
🎖️ ISC2 Candidate (Credly Verified)
• ISACA Member

Committed to continuous learning and professional growth!`
    },

    // Location
    location: {
        keywords: ['location', 'where', 'based', 'live', 'address', 'nepal', 'kathmandu', 'lalitpur'],
        response: `📍 **Location**

**Current Location:**
Satdobato, Lalitpur, Nepal

**Work Location:**
Sanima Group Corporate Office

**Availability:**
• In-person meetings in Kathmandu Valley
• Virtual meetings globally
• Site visits across Nepal

Would you like to schedule a meeting?`
    },

    // Thanks
    thanks: {
        keywords: ['thank', 'thanks', 'appreciate', 'grateful', 'helpful'],
        response: `😊 You're welcome!

Is there anything else you'd like to know about Manish's:
• Professional background
• 75+ Certifications
• 9 Credly Verified Badges
• Projects
• Services
• Contact information

Feel free to ask anything!`
    },

    // Goodbye
    goodbye: {
        keywords: ['bye', 'goodbye', 'see you', 'later', 'exit', 'quit', 'close'],
        response: `👋 Thank you for visiting Manish Shrestha's portfolio!

**Quick Contact:**
📧 ca.manish.shrestha@gmail.com
📱 +977 9843676945

Feel free to return anytime. Have a great day! 🌟`
    },

    // Hire
    hire: {
        keywords: ['hire', 'recruit', 'job offer', 'opportunity', 'vacancy', 'position open'],
        response: `💼 **Interested in Hiring Manish?**

Great! Here's how to proceed:

**For Job Opportunities:**
📧 Email: ca.manish.shrestha@gmail.com
📱 Phone: +977 9843676945

**What to Include:**
• Position/Role details
• Company information
• Key responsibilities
• Expected timeline

**Current Status:**
✅ Open to new opportunities
✅ Available for consulting
✅ Interested in challenging roles

Would you like me to help you send a message directly to Manish?`
    },

    // Pricing
    pricing: {
        keywords: ['price', 'cost', 'fee', 'rate', 'charge', 'budget', 'payment'],
        response: `💰 **Consulting Rates**

Rates vary based on:
• Project scope & complexity
• Duration of engagement
• Type of service required

**To Get a Quote:**
📧 Email: ca.manish.shrestha@gmail.com

Please include:
• Project description
• Expected timeline
• Any specific requirements

Manish provides competitive rates for quality professional services!`
    },

    // Default response
    default: {
        keywords: [],
        response: `🤔 I'm not sure I understand that question.

I can help you with:

📜 **Certifications** - "What certifications do you have?"
🎖️ **Badges** - "Tell me about Credly badges"
💼 **Experience** - "Tell me about your experience"
🚀 **Projects** - "What projects have you completed?"
🎯 **Skills** - "What are your skills?"
📧 **Contact** - "How can I contact you?"
🛠️ **Services** - "What services do you offer?"
🔐 **Cybersecurity** - "Tell me about cybersecurity expertise"
🤖 **AI** - "What AI certifications do you have?"

Try asking about any of these topics!`
    }
};

// Chat State
let chatState = {
    isOpen: false,
    messageCount: 0,
    conversationHistory: [],
    visitorInfo: {
        startTime: new Date(),
        questionsAsked: []
    }
};

// Initialize AI Chatbot
function initAIChatbot() {
    console.log('🤖 Initializing AI Chatbot...');
    
    // Load chat state from session storage
    loadChatState();
    
    // Add event listener for Enter key in chat input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Show welcome message after a delay if first visit
    if (!chatState.welcomeShown) {
        setTimeout(() => {
            showChatNotification();
        }, 5000);
    }
    
    console.log('✅ AI Chatbot initialized successfully!');
}

// Toggle Chat Window (SMOOTH)
function toggleChat() {
    const chatContainer = document.getElementById('ai-chat-container');
    const toggleBtn = document.getElementById('chatToggleBtn');
    
    if (!chatContainer) return;
    
    chatState.isOpen = !chatState.isOpen;
    
    if (chatState.isOpen) {
        chatContainer.classList.remove('hidden');
        chatContainer.style.animation = 'slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Focus on input with smooth delay
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) input.focus();
        }, 300);
        
        // Hide badge
        const badge = toggleBtn.querySelector('.chat-badge');
        if (badge) {
            badge.style.transition = 'opacity 0.3s ease';
            badge.style.opacity = '0';
            setTimeout(() => badge.style.display = 'none', 300);
        }
        
        // Track event
        if (chatState.messageCount === 0) {
            trackEvent('AI Chat', 'Opened', 'First Time');
        }
        
        chatState.welcomeShown = true;
        saveChatState();
        
    } else {
        chatContainer.style.animation = 'slideOutDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            chatContainer.classList.add('hidden');
        }, 350);
    }
}

// Close Chat (SMOOTH)
function closeChat() {
    const chatContainer = document.getElementById('ai-chat-container');
    if (chatContainer) {
        chatContainer.style.animation = 'slideOutDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            chatContainer.classList.add('hidden');
            chatState.isOpen = false;
        }, 350);
    }
}

// Show Chat Notification
function showChatNotification() {
    const toggleBtn = document.getElementById('chatToggleBtn');
    if (!toggleBtn) return;
    
    const badge = toggleBtn.querySelector('.chat-badge');
    if (badge) {
        badge.style.display = 'block';
        badge.style.opacity = '0';
        badge.textContent = '👋 Ask me!';
        badge.style.transition = 'opacity 0.5s ease';
        
        requestAnimationFrame(() => {
            badge.style.opacity = '1';
        });
    }
}

// Send Message (SMOOTH)
function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    input.value = '';
    
    // Smooth input reset
    input.style.height = 'auto';
    
    // Store in conversation history
    chatState.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
    });
    
    chatState.visitorInfo.questionsAsked.push(message);
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get bot response after delay
    setTimeout(() => {
        hideTypingIndicator();
        const response = getBotResponse(message);
        addMessage(response, 'bot');
        
        // Store bot response
        chatState.conversationHistory.push({
            role: 'bot',
            content: response,
            timestamp: new Date()
        });
        
        chatState.messageCount++;
        saveChatState();
        
        // Send email notification if enabled and first few messages
        if (CHATBOT_CONFIG.emailNotifications && chatState.messageCount <= 3) {
            sendEmailNotification(message, response);
        }
        
        // Track event
        trackEvent('AI Chat', 'Message Sent', chatState.messageCount.toString());
        
    }, CHATBOT_CONFIG.typingDelay);
}

// Quick Question Handler
function askQuestion(question) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = question;
        sendMessage();
    }
}

// Add Message to Chat (ULTRA-SMOOTH)
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(15px)';
    messageDiv.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'bot' 
        ? '<i class="fas fa-robot"></i>' 
        : '<i class="fas fa-user"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textP = document.createElement('p');
    // Convert markdown-style bold to HTML
    const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    textP.innerHTML = formattedText;
    
    contentDiv.appendChild(textP);
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    messagesContainer.appendChild(messageDiv);
    
    // Trigger smooth fade-in animation
    requestAnimationFrame(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    });
    
    // Auto-scroll to bottom (SMOOTH)
    messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
    });
}

// Show Typing Indicator (SMOOTH)
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    // Remove existing indicator if any
    hideTypingIndicator();
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.style.opacity = '0';
    typingDiv.style.transform = 'translateY(10px)';
    typingDiv.style.transition = 'all 0.3s ease';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    
    requestAnimationFrame(() => {
        typingDiv.style.opacity = '1';
        typingDiv.style.transform = 'translateY(0)';
    });
    
    messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
    });
}

// Hide Typing Indicator (SMOOTH)
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(-10px)';
        setTimeout(() => indicator.remove(), 300);
    }
}

// Get Bot Response (AI Logic)
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Check each category in knowledge base
    for (const [category, data] of Object.entries(knowledgeBase)) {
        if (category === 'default') continue;
        
        for (const keyword of data.keywords) {
            if (message.includes(keyword.toLowerCase())) {
                return data.response;
            }
        }
    }
    
    // Check for specific patterns
    if (message.match(/^(what|who|how|where|when|why|tell|show|can|do|does|is|are)/)) {
        // Try to find partial matches
        for (const [category, data] of Object.entries(knowledgeBase)) {
            if (category === 'default') continue;
            
            for (const keyword of data.keywords) {
                if (keyword.length > 3 && message.includes(keyword.substring(0, 4))) {
                    return data.response;
                }
            }
        }
    }
    
    // Return default response
    return knowledgeBase.default.response;
}

// ========================================
// EMAIL NOTIFICATION SYSTEM (WEB3FORMS)
// ========================================

function sendEmailNotification(userQuestion, botResponse) {
    const formData = new FormData();
    formData.append('access_key', '36e8d043-01c0-41d2-99b4-0fda13264c67');
    formData.append('subject', '🤖 New Chat - ' + new Date().toLocaleString());
    formData.append('from_name', 'Portfolio AI Chatbot');
    formData.append('email', 'ca.manish.shrestha@gmail.com');
    formData.append('message', `
📬 NEW CHAT NOTIFICATION

👤 Visitor Question:
${userQuestion}

🤖 Bot Response:
${botResponse.substring(0, 500)}${botResponse.length > 500 ? '...' : ''}

📊 Session Info:
• Total Messages: ${chatState.messageCount + 1}
• Time: ${new Date().toLocaleString()}
• Session Duration: ${getSessionDuration()}

📝 Questions Asked in Session:
${chatState.visitorInfo.questionsAsked.map((q, i) => `${i + 1}. ${q}`).join('\n')}

---
Sent from: ${window.location.href}
    `);
    
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('✅ Email notification sent!');
        } else {
            console.warn('⚠️ Email failed:', data.message);
            storeNotificationLocally(userQuestion, botResponse);
        }
    })
    .catch(error => {
        console.error('❌ Email error:', error);
        storeNotificationLocally(userQuestion, botResponse);
    });
}

// Fallback: Store notifications locally
function storeNotificationLocally(question, response) {
    const notifications = JSON.parse(localStorage.getItem('chatNotifications') || '[]');
    notifications.push({
        question: question,
        response: response.substring(0, 200),
        timestamp: new Date().toISOString(),
        messageCount: chatState.messageCount
    });
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
        notifications.shift();
    }
    
    localStorage.setItem('chatNotifications', JSON.stringify(notifications));
    console.log('💾 Notification stored locally');
}

// Get Session Duration
function getSessionDuration() {
    const now = new Date();
    const start = new Date(chatState.visitorInfo.startTime);
    const diff = Math.floor((now - start) / 1000);
    
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    
    return `${minutes}m ${seconds}s`;
}

// Save Chat State
function saveChatState() {
    try {
        sessionStorage.setItem('chatState', JSON.stringify({
            messageCount: chatState.messageCount,
            welcomeShown: chatState.welcomeShown,
            visitorInfo: chatState.visitorInfo
        }));
    } catch (e) {
        console.warn('Could not save chat state');
    }
}

// Load Chat State
function loadChatState() {
    try {
        const saved = sessionStorage.getItem('chatState');
        if (saved) {
            const parsed = JSON.parse(saved);
            chatState.messageCount = parsed.messageCount || 0;
            chatState.welcomeShown = parsed.welcomeShown || false;
            chatState.visitorInfo = parsed.visitorInfo || { startTime: new Date(), questionsAsked: [] };
        }
    } catch (e) {
        console.warn('Could not load chat state');
    }
}

// ========================================
// GEOMETRIC PHOTO POP-OUT EFFECT (ULTRA-SMOOTH)
// ========================================
function initGeometricPhotoEffect() {
    const photoContainer = document.querySelector('.geometric-photo-container');
    const photo = document.querySelector('.pop-out-photo');
    const frame = document.querySelector('.geometric-frame');
    
    if (!photoContainer || !photo || !frame) {
        console.warn('⚠️ Geometric photo elements not found');
        return;
    }
    
    // Ultra-smooth parallax with requestAnimationFrame
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    
    photoContainer.addEventListener('mousemove', (e) => {
        const rect = photoContainer.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    
    function animatePhoto() {
        currentX += (mouseX - currentX) * 0.08; // Smooth interpolation
        currentY += (mouseY - currentY) * 0.08;
        
        photo.style.transform = `
            translateY(-8px) 
            scale(1.03) 
            rotateY(${currentX * 5}deg) 
            rotateX(${-currentY * 5}deg)
        `;
        
        frame.style.transform = `
            translate(-50%, -50%) 
            rotateY(${currentX * 3}deg) 
            rotateX(${-currentY * 3}deg)
        `;
        
        if (Math.abs(currentX - mouseX) > 0.001 || Math.abs(currentY - mouseY) > 0.001) {
            requestAnimationFrame(animatePhoto);
        }
    }
    
    photoContainer.addEventListener('mouseenter', () => {
        requestAnimationFrame(animatePhoto);
    });
    
    // Smooth reset on mouse leave
    photoContainer.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
        
        function resetPhoto() {
            currentX += (0 - currentX) * 0.1;
            currentY += (0 - currentY) * 0.1;
            
            photo.style.transform = `
                translateY(-8px) 
                scale(1.03) 
                rotateY(${currentX * 5}deg) 
                rotateX(${-currentY * 5}deg)
            `;
            
            frame.style.transform = `
                translate(-50%, -50%) 
                rotateY(${currentX * 3}deg) 
                rotateX(${-currentY * 3}deg)
            `;
            
            if (Math.abs(currentX) > 0.001 || Math.abs(currentY) > 0.001) {
                requestAnimationFrame(resetPhoto);
            } else {
                photo.style.transform = '';
                frame.style.transform = 'translate(-50%, -50%)';
            }
        }
        
        requestAnimationFrame(resetPhoto);
    });
    
    // Smooth photo load
    photo.addEventListener('load', () => {
        photo.style.transition = 'opacity 0.8s ease';
        photo.style.opacity = '1';
        console.log('✨ Geometric photo loaded');
    });
    
    console.log('✨ Geometric photo effect initialized with ultra-smooth parallax');
}

// ========================================
// PARTICLE NETWORK BACKGROUND (OPTIMIZED 60FPS)
// ========================================
function initParticleBackground() {
    if (window.innerWidth <= 768) {
        console.log('📱 Particle background disabled on mobile');
        return;
    }

    const canvas = document.getElementById('particle-canvas');
    if (!canvas) {
        console.warn('⚠️ Particle canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d', { alpha: true });

    const CONFIG = {
        particleCount: 90,
        minRadius: 1.5,
        maxRadius: 3,
        speed: 0.4,
        connectDistance: 160,
        mouseRadius: 180,
        mouseStrength: 0.012,
        minConnections: 2,
        maxConnections: 5,
        opacityDot: 0.75,
        opacityLine: 0.25,
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

    window.addEventListener('mousemove', throttle((e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, 16)); // 60fps throttle

    window.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', debounce(() => {
        resize();
        initParticles();
    }, 250));

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(randomPos = false) {
            this.x = randomPos ? Math.random() * canvas.width : (Math.random() < 0.5 ? 0 : canvas.width);
            this.y = randomPos ? Math.random() * canvas.height : Math.random() * canvas.height;
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

            // Wrap around edges
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

    let animationId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const colour = getThemeColour();
        connectParticles(colour);

        for (const p of particles) {
            p.update();
            p.draw(colour);
        }

        animationId = requestAnimationFrame(animate);
    }

    // Pause animation when tab not visible (performance)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });

    resize();
    initParticles();
    animate();

    console.log('✨ Particle background initialized (60fps optimized)');
}

// ========================================
// NAVIGATION (SMOOTH SCROLL)
// ========================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', throttle(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 16)); // 60fps
    
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
    
    window.addEventListener('scroll', throttle(() => {
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
    }, 100));
    
    // BUTTER-SMOOTH SCROLL TO SECTIONS
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                // Use native smooth scroll (hardware accelerated)
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// MULTI-THEME TOGGLE (SMOOTH)
// ========================================
function initThemeToggle() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            setTheme(theme, true);
            
            // Smooth button feedback
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

function setTheme(theme, showNotificationFlag = false) {
    // Smooth transition
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    document.body.classList.remove('light-mode', 'blackwhite-mode');
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
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
        const themeNames = {
            'dark': 'Dark Mode',
            'light': 'Light Mode',
            'blackwhite': 'Black & White Mode'
        };
        showNotification(`Switched to ${themeNames[theme]} ✨`, 'success');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme, false);
}

// ========================================
// TYPING EFFECT (SMOOTH)
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
// COUNTER ANIMATION (SMOOTH)
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
// SCROLL ANIMATIONS (ULTRA-SMOOTH)
// ========================================
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.qual-card, .cert-card, .badge-card, .timeline-item, .skill-category, ' +
        '.project-card, .info-card, .about-text, .geometric-photo-container'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }, index * 50); // Stagger
                
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
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });
}

// ========================================
// PROJECT FILTERS (SMOOTH)
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
            
            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, index * 50); // Smooth stagger
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ========================================
// SKILL BARS ANIMATION (SMOOTH)
// ========================================
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                entry.target.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                
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
// CONTACT FORM (WITH SMOOTH FEEDBACK)
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
        submitBtn.style.transform = 'scale(0.98)';
        
        try {
            await sendContactEmail(formData);
            showNotification('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Smooth success feedback
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
            }, 2000);
            
        } catch (error) {
            showNotification('❌ Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.style.transform = 'scale(1)';
        }
    });
}

// Send Contact Form via Web3Forms
function sendContactEmail(data) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('access_key', '36e8d043-01c0-41d2-99b4-0fda13264c67');
        formData.append('subject', '📩 Contact Form: ' + data.subject);
        formData.append('from_name', data.name);
        formData.append('email', data.email);
        formData.append('message', `
📩 NEW CONTACT FORM SUBMISSION

👤 From: ${data.name}
📧 Email: ${data.email}
📋 Subject: ${data.subject}

💬 Message:
${data.message}

---
Sent from: ${window.location.href}
Time: ${new Date().toLocaleString()}
        `);
        
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                console.log('✅ Contact form sent!');
                resolve(result);
            } else {
                console.error('❌ Contact form failed:', result);
                reject(new Error(result.message));
            }
        })
        .catch(error => {
            console.error('❌ Contact form error:', error);
            // Fallback to mailto
            const mailtoLink = `mailto:ca.manish.shrestha@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message)}%0D%0A%0D%0AFrom: ${encodeURIComponent(data.name)} (${encodeURIComponent(data.email)})`;
            window.location.href = mailtoLink;
            resolve();
        });
    });
}

// ========================================
// NOTIFICATION SYSTEM (ULTRA-SMOOTH)
// ========================================
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => existingNotification.remove(), 300);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.style.animation='slideOut 0.3s ease'; setTimeout(() => this.parentElement.remove(), 300)" aria-label="Close">
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
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
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
        transition: all 0.2s;
    }
    .notification-close:hover { 
        opacity: 1;
        transform: scale(1.1);
    }
`;
document.head.appendChild(notificationStyle);

// ========================================
// SCROLL TO TOP BUTTON (SMOOTH)
// ========================================
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    }, 100));
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Smooth click feedback
        scrollTopBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            scrollTopBtn.style.transform = 'scale(1)';
        }, 150);
    });
}

// ========================================
// CUSTOM CURSOR (ULTRA-SMOOTH 60FPS)
// ========================================
function initCustomCursor() {
    if (window.innerWidth < 1024) return;
    
    let cursor = document.querySelector('.cursor');
    let cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.className = 'cursor';
        cursor.style.willChange = 'transform'; // GPU acceleration
        document.body.appendChild(cursor);
    }
    
    if (!cursorFollower) {
        cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        cursorFollower.style.willChange = 'transform'; // GPU acceleration
        document.body.appendChild(cursorFollower);
    }
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor update (no delay)
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Smooth follower with RAF
    function animateFollower() {
        const speed = 0.12; // Adjusted for ultra-smooth feel
        followerX += (mouseX - followerX) * speed;
        followerY += (mouseY - followerY) * speed;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, .btn, .project-card, .cert-card, .qual-card, .badge-card, ' +
        '.info-card, .tech-item, .filter-btn, .social-links a, ' +
        'input, textarea, .nav-link, .theme-btn, .hamburger, ' +
        '.geometric-photo-container, .pop-out-photo, .chat-toggle-btn, ' +
        '.suggestion-btn, .chat-send-btn, .chat-input, .badge-verify-btn'
    );
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transition = 'transform 0.2s ease, background 0.2s ease';
            cursor.style.transform = 'translate(-50%, -50%) scale(1.8)';
            cursor.style.background = 'rgba(0, 245, 255, 0.5)';
            
            cursorFollower.style.transition = 'transform 0.2s ease';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.8)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'var(--accent-purple)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
    
    document.body.style.cursor = 'none';
    interactiveElements.forEach(el => el.style.cursor = 'none');
    
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
// UTILITY FUNCTIONS
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

function initParallax() {
    const heroBackground = document.querySelector('.hero-background');
    
    if (!heroBackground) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }, 16));
}

function initCopyEmail() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const email = link.textContent;
                
                navigator.clipboard.writeText(email).then(() => {
                    showNotification(`📧 Email "${email}" copied!`, 'success');
                });
            }
        });
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

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K: Focus contact form
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('name')?.focus();
        }
        
        // Escape: Close chat/menu
        if (e.key === 'Escape') {
            closeChat();
            document.getElementById('hamburger')?.classList.remove('active');
            document.getElementById('nav-menu')?.classList.remove('active');
            
            const notification = document.querySelector('.notification');
            if (notification) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }
        
        // Ctrl + /: Toggle chat
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            toggleChat();
        }
    });
}

// ========================================
// ANALYTICS TRACKING
// ========================================
function trackEvent(category, action, label = '') {
    console.log('📊 Event:', { category, action, label });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

function trackPageView() {
    console.log('📊 Page View:', window.location.pathname);
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
// ADDITIONAL INITIALIZATIONS
// ========================================
window.addEventListener('load', () => {
    initLazyLoading();
    initParallax();
    initCopyEmail();
    initPageVisibility();
    initKeyboardShortcuts();
    trackPageView();
    
    // Hide loader if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.transition = 'opacity 0.5s ease';
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    console.log('✅ All features loaded - ULTRA-SMOOTH mode activated!');
});

// ========================================
// CONSOLE SIGNATURE
// ========================================
console.log(
    '%c👋 Welcome to Manish Shrestha\'s Portfolio!',
    'color: #00f5ff; font-size: 20px; font-weight: bold;'
);
console.log(
    '%c🤖 AI Chatbot is ready to help!',
    'color: #7b2ff7; font-size: 14px;'
);
console.log(
    '%c📧 Contact: ca.manish.shrestha@gmail.com',
    'color: #10b981; font-size: 12px;'
);
console.log(
    '%c🎖️ 9 Credly Verified Badges!',
    'color: #ffd700; font-size: 12px; font-weight: bold;'
);
console.log(
    '%c📜 75+ Professional Certifications!',
    'color: #ff006e; font-size: 12px;'
);
console.log(
    '%c🚀 60fps animations | Hardware accelerated | Butter-smooth experience!',
    'color: #10b981; font-size: 11px; font-weight: bold;'
);
