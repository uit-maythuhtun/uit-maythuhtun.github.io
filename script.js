/* ═══════════════════════════════════════════
   SUZIE — VALORANT SCI-FI PORTFOLIO
   JavaScript Engine
   ═══════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── LOADER ─── */
    const loader = document.getElementById('loader');
    const progressFill = document.querySelector('.progress-fill');
    const progressPct = document.querySelector('.progress-pct');
    const statusText = document.querySelector('.status-text');
    const statuses = [
        'LOADING ASSETS...',
        'INITIALIZING HUD...',
        'SYNCING DATA...',
        'LOADING TEXTURES...',
        'COMPILING SHADERS...',
        'CONNECTING...',
        'DEPLOYING AGENT...',
        'READY'
    ];
    let loadProg = 0;

    function animateLoader() {
        const interval = setInterval(() => {
            loadProg += Math.random() * 8 + 2;
            if (loadProg > 100) loadProg = 100;
            progressFill.style.width = loadProg + '%';
            progressPct.textContent = Math.floor(loadProg) + '%';
            const sIdx = Math.min(Math.floor(loadProg / (100 / statuses.length)), statuses.length - 1);
            statusText.textContent = statuses[sIdx];
            if (loadProg >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loader.classList.add('hide');
                    document.body.style.overflow = '';
                    revealHero();
                }, 600);
            }
        }, 120);
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('load', () => setTimeout(animateLoader, 400));

    /* ─── HERO REVEAL ─── */
    function revealHero() {
        const rows = document.querySelectorAll('.hn-row');
        rows.forEach((r, i) => setTimeout(() => r.classList.add('show'), 200 + i * 250));
        animateCounters();
    }

    /* ─── CUSTOM CURSOR ─── */
    const ring = document.getElementById('cursorRing');
    const dot = document.getElementById('cursorDot');
    let mx = 0, my = 0, rx = 0, ry = 0;
    let cursorRAF = false;

    if (ring && dot && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
            if (!cursorRAF) {
                cursorRAF = true;
                requestAnimationFrame(() => {
                    dot.style.transform = `translate3d(${mx - 2.5}px, ${my - 2.5}px, 0)`;
                    cursorRAF = false;
                });
            }
        }, { passive: true });

        function cursorLoop() {
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            ring.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
            requestAnimationFrame(cursorLoop);
        }
        cursorLoop();

        // Hover effect on interactive elements
        const hovers = document.querySelectorAll('a, button, .pf-card, .ti, .abc, .soc-row, .pf-f');
        hovers.forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
        });
    }

    /* ─── PARTICLE CANVAS ─── */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas ? canvas.getContext('2d', { alpha: true }) : null;
    let particles = [];
    const isMobile = window.innerWidth <= 768;
    const PARTICLE_COUNT = isMobile ? Math.min(12, Math.floor(window.innerWidth / 40)) : Math.min(30, Math.floor(window.innerWidth / 50));
    let particlesRunning = true;

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 1.8 + 0.4,
                alpha: Math.random() * 0.3 + 0.05,
                color: Math.random() > 0.7 ? '#00d4aa' : '#ff4655',
            });
        }
    }

    function drawParticles() {
        if (!ctx || !particlesRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const len = particles.length;
        for (let i = 0; i < len; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Draw connections with optimized distance check
        const connDist = 100;
        const connDistSq = connDist * connDist;
        for (let i = 0; i < len; i++) {
            for (let j = i + 1; j < len; j++) {
                const dx = particles[i].x - particles[j].x;
                if (dx > connDist || dx < -connDist) continue;
                const dy = particles[i].y - particles[j].y;
                if (dy > connDist || dy < -connDist) continue;
                const distSq = dx * dx + dy * dy;
                if (distSq < connDistSq) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(255,70,85,' + (0.03 * (1 - Math.sqrt(distSq) / connDist)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawParticles);
    }

    if (canvas) {
        resizeCanvas();
        createParticles();
        drawParticles();
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => { resizeCanvas(); createParticles(); }, 250);
        }, { passive: true });
    }

    // Pause particles when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            particlesRunning = false;
        } else {
            particlesRunning = true;
            if (canvas) drawParticles();
        }
    });

    /* ─── NAVBAR ─── */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.sec, .hero');
    let scrollTicking = false;

    function onScroll() {
        const sy = window.scrollY;
        // Scrolled class
        if (navbar) navbar.classList.toggle('scrolled', sy > 60);
        // Back to top
        const btt = document.getElementById('btt');
        if (btt) btt.classList.toggle('show', sy > 500);
        // Active nav link
        let current = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 200;
            if (sy >= top) current = sec.getAttribute('id');
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
        scrollTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });

    /* ─── BURGER / MOBILE MENU ─── */
    const burger = document.getElementById('burger');
    const mobMenu = document.getElementById('mobMenu');
    const mobClose = document.getElementById('mobClose');
    const mobLinks = document.querySelectorAll('.mob-link');

    function closeMobMenu() {
        burger.classList.remove('open');
        mobMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (burger && mobMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('open');
            mobMenu.classList.toggle('open');
            document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
        });
        if (mobClose) mobClose.addEventListener('click', closeMobMenu);
        mobLinks.forEach(l => l.addEventListener('click', closeMobMenu));
    }

    /* ─── SCROLL REVEAL ─── */
    function initScrollReveal() {
        // Add .sr class to elements
        const targets = document.querySelectorAll(
            '.about-card, .about-txt-col, .abc, .sk-panel, .sk-tools, .pf-item, .ct-left, .ct-right, .sec-hdr'
        );
        targets.forEach(el => el.classList.add('sr'));

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.sr').forEach(el => obs.observe(el));
    }
    initScrollReveal();

    /* ─── SKILL BAR ANIMATION ─── */
    const skillObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const fills = e.target.querySelectorAll('.skf');
                fills.forEach((f, i) => setTimeout(() => f.classList.add('filled'), i * 120));
                skillObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });
    const skPanel = document.querySelector('.sk-panel');
    if (skPanel) skillObs.observe(skPanel);

    /* ─── COUNTER ANIMATION ─── */
    function animateCounters() {
        document.querySelectorAll('.hs-num').forEach(el => {
            const target = parseInt(el.dataset.target) || 0;
            const dur = 1800;
            const start = performance.now();
            function step(now) {
                const prog = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - prog, 3);
                el.textContent = Math.floor(eased * target);
                if (prog < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }

    /* ─── TYPING EFFECT ─── */
    const typeEl = document.querySelector('.ht-text');
    if (typeEl) {
        const txt = typeEl.textContent;
        typeEl.textContent = '';
        let ci = 0;
        function typeChar() {
            if (ci < txt.length) {
                typeEl.textContent += txt[ci];
                ci++;
                setTimeout(typeChar, 50 + Math.random() * 40);
            }
        }
        setTimeout(typeChar, 1800);
    }

    /* ─── LIGHTBOX ─── */
    const lb = document.getElementById('lb');
    const lbImg = document.getElementById('lbImg');
    const lbX = document.querySelector('.lb-x');

    document.querySelectorAll('.pf-exp').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const img = btn.closest('.pf-card').querySelector('.pf-img');
            if (img && lb && lbImg) {
                lbImg.src = img.src;
                lbImg.alt = img.alt;
                lb.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLb() {
        if (lb) {
            lb.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
    if (lbX) lbX.addEventListener('click', closeLb);
    if (lb) lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });

    /* ─── CONTACT FORM ─── */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-send .bv-txt');
            if (btn) {
                btn.textContent = 'TRANSMISSION SENT ✓';
                setTimeout(() => {
                    btn.textContent = 'SEND TRANSMISSION';
                    form.reset();
                }, 3000);
            }
        });
    }

    /* ─── BACK TO TOP ─── */
    const bttBtn = document.getElementById('btt');
    if (bttBtn) bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* ─── PARALLAX on Hero Glows ─── */
    let parallaxTicking = false;
    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768 || parallaxTicking) return;
        parallaxTicking = true;
        requestAnimationFrame(() => {
            const cx = (e.clientX / window.innerWidth - 0.5) * 2;
            const cy = (e.clientY / window.innerHeight - 0.5) * 2;
            const g1 = document.querySelector('.hero-glow.g1');
            const g2 = document.querySelector('.hero-glow.g2');
            if (g1) g1.style.transform = `translate3d(${cx * 20}px, ${cy * 15}px, 0)`;
            if (g2) g2.style.transform = `translate3d(${cx * -15}px, ${cy * -20}px, 0)`;
            parallaxTicking = false;
        });
    }, { passive: true });

    /* ─── TILT on Hero Frame ─── */
    const heroFrame = document.querySelector('.hero-frame');
    if (heroFrame && window.innerWidth > 768) {
        let tiltTicking = false;
        heroFrame.addEventListener('mousemove', (e) => {
            if (tiltTicking) return;
            tiltTicking = true;
            requestAnimationFrame(() => {
                const r = heroFrame.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                heroFrame.style.transform = `perspective(600px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateZ(0)`;
                tiltTicking = false;
            });
        }, { passive: true });
        heroFrame.addEventListener('mouseleave', () => {
            heroFrame.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateZ(0)';
            heroFrame.style.transition = 'transform .5s ease';
            setTimeout(() => heroFrame.style.transition = '', 500);
        });
    }

    /* ─── Smooth scroll for all anchor links ─── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ─── RANDOM GLITCH LINES (Valorant sci-fi) ─── */
    const glitchContainer = document.getElementById('glitchLines');
    const isMobileGlitch = window.innerWidth <= 768;
    if (glitchContainer) {
        // Pre-create a pool of reusable glitch line elements
        const glitchPool = [];
        const GLITCH_POOL_SIZE = isMobileGlitch ? 2 : 4;
        for (let i = 0; i < GLITCH_POOL_SIZE; i++) {
            const line = document.createElement('div');
            line.className = 'gl-line';
            line.style.display = 'none';
            glitchContainer.appendChild(line);
            glitchPool.push(line);
        }
        let glitchIdx = 0;

        function spawnGlitchLine() {
            const line = glitchPool[glitchIdx % GLITCH_POOL_SIZE];
            glitchIdx++;
            line.style.display = '';
            line.style.top = Math.random() * 100 + '%';
            line.style.height = (Math.random() * 2 + 0.5) + 'px';
            line.style.animationDuration = (Math.random() * 0.15 + 0.05) + 's';
            line.style.background = Math.random() > 0.6 ? 'rgba(0,212,170,.1)' : 'rgba(255,70,85,.12)';
            // Force reflow to restart animation
            line.style.animation = 'none';
            void line.offsetWidth;
            line.style.animation = '';
            setTimeout(() => { line.style.display = 'none'; }, 300);
        }

        function glitchLoop() {
            // Burst of 1-3 lines at random intervals
            const count = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < count; i++) {
                setTimeout(spawnGlitchLine, i * 30);
            }
            // Next burst: slower on mobile for perf
            const delay = isMobileGlitch ? (Math.random() * 6000 + 4000) : (Math.random() * 4000 + 2000);
            setTimeout(glitchLoop, delay);
        }
        setTimeout(glitchLoop, 3000);
    }

    /* ─── SECTION HEADER GLITCH on scroll into view ─── */
    const glitchHeaders = document.querySelectorAll('.glitch-hover');
    const isMobileView = window.innerWidth <= 768;
    const ghObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.remove('glitch-trigger');
                void e.target.offsetWidth; // reflow to restart
                e.target.classList.add('glitch-trigger');
                setTimeout(() => e.target.classList.remove('glitch-trigger'), 600);
                // On desktop, only trigger once; on mobile, keep retriggering on scroll
                if (!isMobileView) ghObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    glitchHeaders.forEach(h => ghObs.observe(h));

    /* ─── TOOL CARD GLITCH on hover/tap ─── */
    document.querySelectorAll('.ti').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.animation = 'toolGlitch .15s steps(2)';
            setTimeout(() => card.style.animation = '', 150);
        });
        // Touch support for mobile
        card.addEventListener('touchstart', () => {
            card.style.animation = 'toolGlitch .15s steps(2)';
            setTimeout(() => card.style.animation = '', 150);
        }, { passive: true });
    });

    /* ─── PORTFOLIO FILTER ─── */
    const filterBtns = document.querySelectorAll('.pf-f');
    const pfItems = document.querySelectorAll('.pf-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.filter;

            pfItems.forEach((item, i) => {
                const itemCat = item.dataset.cat;
                const shouldShow = cat === 'all' || itemCat === cat || !itemCat;
                // Stagger the transition
                item.style.transitionDelay = (i * 60) + 'ms';
                if (shouldShow) {
                    item.classList.remove('pf-hidden');
                } else {
                    item.classList.add('pf-hidden');
                }
            });

            // Reset delays after animation
            setTimeout(() => {
                pfItems.forEach(item => item.style.transitionDelay = '');
            }, 400);
        });
    });

    /* ─── PORTFOLIO CARD TILT (desktop) ─── */
    if (window.innerWidth > 768) {
        document.querySelectorAll('.pf-card').forEach(card => {
            let pfTilt = false;
            card.addEventListener('mousemove', (e) => {
                if (pfTilt) return;
                pfTilt = true;
                requestAnimationFrame(() => {
                    const r = card.getBoundingClientRect();
                    const px = (e.clientX - r.left) / r.width - 0.5;
                    const py = (e.clientY - r.top) / r.height - 0.5;
                    card.style.transform = `perspective(800px) rotateY(${px * 4}deg) rotateX(${-py * 4}deg) translateZ(0)`;
                    pfTilt = false;
                });
            }, { passive: true });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform .4s ease';
                setTimeout(() => card.style.transition = '', 400);
            });
        });
    }

})();
