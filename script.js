/* ============================================
   Ribba Wood Working LLC - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // Current Year
    // ============================================
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTop');

    function handleScroll() {
        const scrolled = window.scrollY > 80;
        navbar.classList.toggle('scrolled', scrolled);
        scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ============================================
    // Scroll to Top
    // ============================================
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // Mobile Navigation
    // ============================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ============================================
    // Active Nav Link on Scroll
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function setActiveNav() {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNav, { passive: true });

    // ============================================
    // Carousel
    // ============================================
    const carousel = document.getElementById('carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    let currentSlide = 0;
    let carouselInterval;
    const slideInterval = 6000;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startCarousel() {
        carouselInterval = setInterval(nextSlide, slideInterval);
    }

    function resetCarousel() {
        clearInterval(carouselInterval);
        startCarousel();
    }

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetCarousel();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetCarousel();
    });

    startCarousel();

    // Touch support for carousel
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
            resetCarousel();
        }
    }, { passive: true });

    // ============================================
    // Portfolio Modal
    // ============================================
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalCounter = document.getElementById('modalCounter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    let portfolioImages = [];
    let currentImageIndex = 0;

    // Collect all portfolio images
    portfolioItems.forEach((item, index) => {
        const img = item.querySelector('img');
        portfolioImages.push({
            src: img.src,
            alt: img.alt
        });
    });

    window.openModal = function(item) {
        const img = item.querySelector('img');
        currentImageIndex = portfolioImages.findIndex(i => i.src === img.src);
        updateModal();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    window.navigateModal = function(direction) {
        currentImageIndex = (currentImageIndex + direction + portfolioImages.length) % portfolioImages.length;
        updateModal();
    };

    function updateModal() {
        modalImg.src = portfolioImages[currentImageIndex].src;
        modalImg.alt = portfolioImages[currentImageIndex].alt;
        modalCaption.textContent = portfolioImages[currentImageIndex].alt;
        modalCounter.textContent = `${currentImageIndex + 1} / ${portfolioImages.length}`;
    }

    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') navigateModal(-1);
        if (e.key === 'ArrowRight') navigateModal(1);
    });

    // ============================================
    // Language Switcher
    // ============================================
    let currentLang = localStorage.getItem('ribba-lang') || 'en';

    function switchLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('ribba-lang', lang);

        // Update buttons
        document.getElementById('btn-en').classList.toggle('active', lang === 'en');
        document.getElementById('btn-es').classList.toggle('active', lang === 'es');

        // Update all translatable elements
        document.querySelectorAll('[data-en]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            }
        });

        // Update HTML lang
        document.documentElement.lang = lang;

        // Update meta tags
        const metaTitle = document.getElementById('meta-title');
        const metaDescription = document.getElementById('meta-description');
        if (metaTitle) {
            metaTitle.textContent = lang === 'es'
                ? 'Ribba Wood Working LLC | Carpintería Personalizada en Parsippany, NJ'
                : 'Ribba Wood Working LLC | Custom Carpentry & Woodworking in Parsippany, NJ';
        }
        if (metaDescription) {
            metaDescription.content = lang === 'es'
                ? 'Ribba Wood Working LLC ofrece carpintería experta, gabinetes personalizados, remodelación y servicios de woodworking en Parsippany, NJ. Artesanía de calidad para cocinas, baños, terrazas y más.'
                : 'Ribba Wood Working LLC offers expert carpentry, custom cabinetry, remodeling, and woodworking services in Parsippany, NJ. Quality craftsmanship for kitchens, bathrooms, decks, and more.';
        }

        // Update HTML dir if needed
        document.documentElement.dir = 'ltr';
    }

    // Make switchLanguage globally accessible
    window.switchLanguage = switchLanguage;

    // Initialize language
    switchLanguage(currentLang);

    // ============================================
    // Scroll Animations (Intersection Observer)
    // ============================================
    const animatedElements = document.querySelectorAll(
        '.service-card, .testimonial-card, .portfolio-item, .contact-item, .about-content, .about-images'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ============================================
    // Smooth scroll for anchor links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

});
