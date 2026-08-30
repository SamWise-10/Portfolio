// Mobile menu toggle logic
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close sidebar if user clicks outside of it on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    }
});

// Galaxy Starfield Animation using HTML5 Canvas
const canvas = document.getElementById('galaxy-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];

function init() {
    resize();
    window.addEventListener('resize', resize);
    
    // Create stars
    for(let i = 0; i < 500; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.2,
            speed: Math.random() * 0.4 + 0.05,
            opacity: Math.random()
        });
    }
    animate();
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Subtle deep space radial gradient
    let gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
    gradient.addColorStop(0, '#0a0d1f'); // Deep blue core
    gradient.addColorStop(1, '#03040b'); // Dark edges
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw and move stars
    for(let i = 0; i < stars.length; i++) {
        let s = stars[i];
        
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Move star up slowly to simulate traveling through space
        s.y -= s.speed;
        
        // Twinkle effect
        s.opacity += (Math.random() - 0.5) * 0.05;
        if(s.opacity < 0.1) s.opacity = 0.1;
        if(s.opacity > 1) s.opacity = 1;

        // Reset if it goes off top of screen
        if(s.y < 0) {
            s.y = height;
            s.x = Math.random() * width;
        }
    }
    requestAnimationFrame(animate);
}

init();
