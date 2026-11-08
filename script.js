// ==========================================================================
// Harsamer R. Jumad — Smooth 300-Frame Scroll Animation & Portfolio Engine
// Pure Vanilla JavaScript (Zero jQuery)
// ==========================================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// --------------------------------------------------------------------------
// 1. Mobile Navigation Toggle
// --------------------------------------------------------------------------
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });
}

// --------------------------------------------------------------------------
// 2. 300-Frame High-DPI Canvas Scroll Scrubber (LERP Smoothed)
// --------------------------------------------------------------------------
const TOTAL_FRAMES = 300;
const FRAME_FOLDER = 'ezgif-172bc903c5a9236f-jpg';
const seqCanvas = document.getElementById('sequence-canvas');
const seqCtx = seqCanvas ? seqCanvas.getContext('2d', { alpha: false }) : null;
const frameCounterEl = document.getElementById('frame-counter');

const frames = new Array(TOTAL_FRAMES);
let loadedCount = 0;
let currentFrame = 0;
let targetFrame = 0;
let lastRenderedFrameIndex = -1;
let pointerXRatio = 0.5;

function getFramePath(index) {
    const padded = String(index + 1).padStart(3, '0');
    return `${FRAME_FOLDER}/ezgif-frame-${padded}.jpg`;
}

// Find the closest loaded frame so scrubbing is instantaneous even while loading
function getClosestLoadedImage(index) {
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
    if (frames[clamped] && frames[clamped].complete && frames[clamped].naturalWidth > 0) {
        return frames[clamped];
    }
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = clamped - offset;
        const next = clamped + offset;
        if (prev >= 0 && frames[prev] && frames[prev].complete && frames[prev].naturalWidth > 0) {
            return frames[prev];
        }
        if (next < TOTAL_FRAMES && frames[next] && frames[next].complete && frames[next].naturalWidth > 0) {
            return frames[next];
        }
    }
    return null;
}

function drawSequenceFrame(frameIndex) {
    if (!seqCanvas || !seqCtx) return;
    const img = getClosestLoadedImage(frameIndex);
    if (!img) return;

    const cw = seqCanvas.width;
    const ch = seqCanvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Responsive cover fit with upper-center framing for portrait focus
    const scale = Math.max(cw / iw, ch / ih);
    const drawW = iw * scale;
    const drawH = ih * scale;
    const drawX = (cw - drawW) * 0.5;
    const drawY = (ch - drawH) * 0.35;

    seqCtx.fillStyle = '#03040b';
    seqCtx.fillRect(0, 0, cw, ch);
    seqCtx.imageSmoothingEnabled = true;
    seqCtx.imageSmoothingQuality = 'high';
    seqCtx.drawImage(img, drawX, drawY, drawW, drawH);
}

function updateTargetFrameFromScroll() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 80) {
        const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
        targetFrame = progress * (TOTAL_FRAMES - 1);
    } else {
        // On compact subpages, blend subtle scroll + pointer parallax
        targetFrame = pointerXRatio * (TOTAL_FRAMES - 1);
    }
}

function preloadSequence() {
    if (!seqCanvas) return;

    // Build two-pass load order: every 8th keyframe first for instant scrubbing, then fill all frames
    const loadOrder = [];
    const seen = new Set();

    for (let stride of [15, 5, 1]) {
        for (let i = 0; i < TOTAL_FRAMES; i += stride) {
            if (!seen.has(i)) {
                seen.add(i);
                loadOrder.push(i);
            }
        }
    }

    let queuePos = 0;
    const CONCURRENCY = 8;

    function loadNext() {
        if (queuePos >= loadOrder.length) return;
        const frameIdx = loadOrder[queuePos++];
        const img = new Image();
        img.decoding = 'async';
        img.src = getFramePath(frameIdx);

        img.onload = () => {
            frames[frameIdx] = img;
            loadedCount++;
            if (loadedCount === 1 || Math.abs(frameIdx - Math.round(currentFrame)) <= 2) {
                lastRenderedFrameIndex = -1;
            }
            loadNext();
        };

        img.onerror = () => {
            loadNext();
        };
    }

    for (let c = 0; c < CONCURRENCY; c++) {
        loadNext();
    }
}

window.addEventListener('scroll', updateTargetFrameFromScroll, { passive: true });
window.addEventListener('pointermove', (e) => {
    if (window.innerWidth > 0) {
        pointerXRatio = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 80 && !prefersReducedMotion.matches) {
            updateTargetFrameFromScroll();
        }
    }
}, { passive: true });

// --------------------------------------------------------------------------
// 3. Galaxy Starfield Overlay + Unified Render Loop
// --------------------------------------------------------------------------
const galaxyCanvas = document.getElementById('galaxy-canvas');
const galaxyCtx = galaxyCanvas ? galaxyCanvas.getContext('2d') : null;

let width = window.innerWidth;
let height = window.innerHeight;
let stars = [];

function resizeCanvases() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (seqCanvas) {
        seqCanvas.width = Math.floor(width * dpr);
        seqCanvas.height = Math.floor(height * dpr);
        lastRenderedFrameIndex = -1;
        drawSequenceFrame(Math.round(currentFrame));
    }

    if (galaxyCanvas) {
        galaxyCanvas.width = width;
        galaxyCanvas.height = height;
    }
}

function initParticles() {
    stars = [];
    const starColors = ['#ffffff', '#00d2ff', '#ff2e55', '#e0f2fe'];
    const count = width < 768 ? 110 : 220;
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.4 + 0.3,
            speed: Math.random() * 0.28 + 0.04,
            opacity: Math.random() * 0.75 + 0.15,
            color: starColors[Math.floor(Math.random() * starColors.length)]
        });
    }
}

function renderLoop() {
    // 1. Smoothly damp currentFrame toward targetFrame (LERP)
    if (prefersReducedMotion.matches) {
        currentFrame = targetFrame;
    } else {
        const diff = targetFrame - currentFrame;
        if (Math.abs(diff) > 0.01) {
            currentFrame += diff * 0.14;
        } else {
            currentFrame = targetFrame;
        }
    }

    const roundedFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrame)));
    if (roundedFrame !== lastRenderedFrameIndex) {
        drawSequenceFrame(roundedFrame);
        lastRenderedFrameIndex = roundedFrame;
        if (frameCounterEl) {
            const frameNum = String(roundedFrame + 1).padStart(3, '0');
            frameCounterEl.textContent = `FRAME ${frameNum} / ${TOTAL_FRAMES}`;
        }
    }

    // 2. Render subtle dual-tone galaxy particles
    if (galaxyCtx) {
        galaxyCtx.clearRect(0, 0, width, height);
        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            galaxyCtx.globalAlpha = s.opacity;
            galaxyCtx.fillStyle = s.color;
            galaxyCtx.beginPath();
            galaxyCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            galaxyCtx.fill();

            if (!prefersReducedMotion.matches) {
                s.y -= s.speed;
                if (s.y < 0) {
                    s.y = height;
                    s.x = Math.random() * width;
                }
            }
        }
        galaxyCtx.globalAlpha = 1;
    }

    requestAnimationFrame(renderLoop);
}

// --------------------------------------------------------------------------
// 4. Progressive Enhancement Fallbacks for CSS Scroll-Driven Animations
// --------------------------------------------------------------------------
function setupScrollDrivenFallbacks() {
    // Fallback 1: Scroll Progress Indicator
    if (!CSS.supports('animation-timeline', 'scroll()')) {
        const progress = document.querySelector('#progress');
        if (progress) {
            window.addEventListener('scroll', () => {
                const scrollable = document.documentElement.scrollHeight - window.innerHeight;
                const scrolled = window.scrollY;
                const progressPercentage = scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 0;
                progress.style.transform = `scaleX(${progressPercentage})`;
            }, { passive: true });
        }
    }

    // Fallback 2: Shrinking Header + Scrollytelling Cards
    if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
        const header = document.querySelector('header.top-nav');
        if (header) {
            const initialHeight = 88;
            const finalHeight = 64;
            const scrollDistance = 150;

            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                const scrollPercent = Math.min(1, Math.max(0, scrollY / scrollDistance));
                const newHeight = initialHeight - (initialHeight - finalHeight) * scrollPercent;
                header.style.height = `${newHeight}px`;
            }, { passive: true });
        }

        const trackedSteps = document.querySelectorAll('#tracked .scroll-step');
        if (trackedSteps.length > 0 && !prefersReducedMotion.matches) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const card = entry.target.querySelector('.story-card');
                    if (!card) return;
                    const ratio = entry.intersectionRatio;
                    const eased = Math.min(1, ratio * 1.6);
                    card.style.opacity = String(Math.max(0.15, eased));
                    card.style.transform = `translateY(${(1 - eased) * 28}px) scale(${0.95 + eased * 0.05})`;
                });
            }, { threshold: Array.from({ length: 101 }, (_, i) => i / 100) });

            trackedSteps.forEach((step) => observer.observe(step));
        }
    }
}

// Initialize everything
resizeCanvases();
initParticles();
updateTargetFrameFromScroll();
preloadSequence();
setupScrollDrivenFallbacks();
window.addEventListener('resize', () => {
    resizeCanvases();
    initParticles();
    updateTargetFrameFromScroll();
});
requestAnimationFrame(renderLoop);
