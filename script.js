/* ═══════════════════════════════════════════════════════
   VALORANT THEME — JavaScript Interactions
   Su Nandar Htet (Suzie) Portfolio
   ═══════════════════════════════════════════════════════ */

// ── Wait for DOM ──
document.addEventListener('DOMContentLoaded', () => {

    // ════════════════════════════════════
    // LOADER
    // ════════════════════════════════════
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 2200);
    });

    // Fallback: hide loader after 4s
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 4000);

    // ════════════════════════════════════
    // PARTICLES
    // ════════════════════════════════════
    const particlesContainer = document.getElementById('particles-container');
    
    function createParticles() {
        const count = window.innerWidth < 768 ? 25 : 50;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;

            // Random colors: red, teal, or white
            const colors = ['#ff4655', '#00d4aa', 'rgba(236,232,225,0.3)'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];

            particlesContainer.appendChild(particle);
        }
    }
    createParticles();

    // ════════════════════════════════════
    // CURSOR TRAIL (Desktop only)
    // ════════════════════════════════════
    if (window.innerWidth > 1024) {
        const trailContainer = document.getElementById('cursor-trail');
        let mouseX = 0, mouseY = 0;
        const dots = [];
        const dotCount = 12;

        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('cursor-dot');
            dot.style.opacity = (1 - i / dotCount) * 0.5;
            dot.style.width = (6 - i * 0.4) + 'px';
            dot.style.height = dot.style.width;
            trailContainer.appendChild(dot);
            dots.push({ el: dot, x: 0, y: 0 });
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateDots() {
            let x = mouseX;
            let y = mouseY;

            dots.forEach((dot, i) => {
                const nextX = x;
                const nextY = y;
                
                dot.x += (nextX - dot.x) * (0.35 - i * 0.02);
                dot.y += (nextY - dot.y) * (0.35 - i * 0.02);

                dot.el.style.left = dot.x + 'px';
                dot.el.style.top = dot.y + 'px';

                x = dot.x;
                y = dot.y;
            });

            requestAnimationFrame(animateDots);
        }
        animateDots();
    }

    // ════════════════════════════════════
    // NAVIGATION
    // ════════════════════════════════════
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNav();

        // Back to top button visibility
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });

    // Back to Top click
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Burger menu
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Active nav link on scroll
    function updateActiveNav() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ════════════════════════════════════
    // SCROLL REVEAL ANIMATIONS
    // ════════════════════════════════════
    function initAnimations() {
        // Add reveal classes to elements
        const revealElements = [
            { selector: '.about-image-col', class: 'reveal-left' },
            { selector: '.about-content-col', class: 'reveal-right' },
            { selector: '.detail-card', class: 'reveal' },
            { selector: '.radar-card', class: 'reveal-left' },
            { selector: '.skills-tools', class: 'reveal-right' },
            { selector: '.portfolio-item', class: 'reveal' },
            { selector: '.contact-info', class: 'reveal-left' },
            { selector: '.contact-form-wrapper', class: 'reveal-right' },
            { selector: '.social-card', class: 'reveal' },
        ];

        revealElements.forEach(item => {
            document.querySelectorAll(item.selector).forEach((el, i) => {
                el.classList.add(item.class);
                el.style.transitionDelay = (i * 0.1) + 's';
            });
        });

        // Intersection Observer for reveals
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
            observer.observe(el);
        });

        // Skill bars animation
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('.skill-item');
                    items.forEach((item, i) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, i * 150);
                    });
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.skill-bars').forEach(el => {
            skillObserver.observe(el);
        });
    }

    // ════════════════════════════════════
    // COUNTER ANIMATION
    // ════════════════════════════════════
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    let current = 0;
                    const increment = target / 60;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target;
                            clearInterval(timer);
                        } else {
                            el.textContent = Math.floor(current);
                        }
                    }, 30);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }
    animateCounters();

    // ════════════════════════════════════
    // LIGHTBOX
    // ════════════════════════════════════
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    document.querySelectorAll('.portfolio-card').forEach(card => {
        const img = card.querySelector('.portfolio-img');
        if (!img) return;

        card.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.closest('.lightbox-close')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // ════════════════════════════════════
    // CONTACT FORM
    // ════════════════════════════════════
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('.btn-submit');
        const originalText = btn.querySelector('.btn-text').textContent;
        btn.querySelector('.btn-text').textContent = 'MESSAGE SENT! ✓';
        btn.style.borderColor = '#00d4aa';
        btn.querySelector('.btn-bg').style.left = '0';
        btn.querySelector('.btn-bg').style.background = '#00d4aa';
        
        setTimeout(() => {
            btn.querySelector('.btn-text').textContent = originalText;
            btn.style.borderColor = '';
            btn.querySelector('.btn-bg').style.left = '-100%';
            btn.querySelector('.btn-bg').style.background = '';
            contactForm.reset();
        }, 3000);
    });

    // ════════════════════════════════════
    // PARALLAX EFFECT ON HERO
    // ════════════════════════════════════
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const hero = document.querySelector('.hero-section');
            if (hero) {
                const radialGlow = hero.querySelector('.radial-glow');
                if (radialGlow) {
                    radialGlow.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
            }
        });
    }

    // ════════════════════════════════════
    // TILT EFFECT ON HERO IMAGE
    // ════════════════════════════════════
    if (window.innerWidth > 1024) {
        const imageFrame = document.querySelector('.image-frame');
        if (imageFrame) {
            imageFrame.addEventListener('mousemove', (e) => {
                const rect = imageFrame.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                imageFrame.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
            });

            imageFrame.addEventListener('mouseleave', () => {
                imageFrame.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
                imageFrame.style.transition = 'transform 0.5s ease';
            });

            imageFrame.addEventListener('mouseenter', () => {
                imageFrame.style.transition = 'none';
            });
        }
    }

    // ════════════════════════════════════
    // TYPING EFFECT FOR TAG TEXT
    // ════════════════════════════════════
    const tagText = document.querySelector('.tag-text');
    if (tagText) {
        const text = tagText.textContent;
        tagText.textContent = '';
        let charIndex = 0;

        setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (charIndex < text.length) {
                    tagText.textContent += text[charIndex];
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, 1500);
    }

    // ════════════════════════════════════
    // RANDOM GLITCH EFFECT
    // ════════════════════════════════════
    function randomGlitch() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        setInterval(() => {
            if (Math.random() > 0.85) {
                heroTitle.style.textShadow = `
                    2px 0 #ff4655,
                    -2px 0 #00d4aa,
                    0 0 10px rgba(255, 70, 85, 0.3)
                `;
                setTimeout(() => {
                    heroTitle.style.textShadow = 'none';
                }, 100);
            }
        }, 2000);
    }
    randomGlitch();

});
