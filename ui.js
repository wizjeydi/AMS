// ui.js
// UI Effects, Navigation, Typing, Feature Content Handlers

export function showOCRContent() {
    document.getElementById('ocr-content').style.display = 'block';
    document.getElementById('dashboard-content').style.display = 'none';
    document.getElementById('ocr-content').scrollIntoView({ behavior: 'smooth' });
}

export function showDashboardContent() {
    document.getElementById('dashboard-content').style.display = 'block';
    document.getElementById('ocr-content').style.display = 'none';
    document.getElementById('dashboard-content').scrollIntoView({ behavior: 'smooth' });
}

export function hideFeatureContent() {
    document.getElementById('ocr-content').style.display = 'none';
    document.getElementById('dashboard-content').style.display = 'none';
}

export function addCardHoverEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}


export function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}



window.showOCRContent = showOCRContent;
window.showDashboardContent = showDashboardContent;
window.hideFeatureContent = hideFeatureContent;