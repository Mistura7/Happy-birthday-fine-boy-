// Force remove loading screen after 2 seconds as a fallback
setTimeout(() => {
    const loader = document.getElementById('loading');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }
}, 2000);

// Remove Loading Screen normally when everything is ready
window.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loading');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }
});

// Audio Controller
const audio = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
let isPlaying = false;

if (muteBtn && audio) {
    muteBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            audio.play().catch(e => console.log("Audio play blocked"));
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        isPlaying = !isPlaying;
    });
}

// Gift Button & Reveal
const giftBtn = document.getElementById('gift-btn');
if (giftBtn) {
    giftBtn.addEventListener('click', () => {
        // Confetti Explosion
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#ff9a9e', '#fecfef', '#d4af37', '#ffffff']
            });
        }

        // Start Music
        if (audio && !isPlaying) {
            audio.play().catch(e => console.log("Audio play blocked"));
            isPlaying = true;
            if (muteBtn) muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }

        // GSAP Transition
        gsap.to('#landing', {
            opacity: 0,
            y: -50,
            duration: 1,
            onComplete: () => {
                document.getElementById('landing').classList.add('hidden');
                const main = document.getElementById('main-content');
                if (main) main.classList.remove('hidden');
                
                // Initialize AOS
                if (typeof AOS !== 'undefined') {
                    AOS.init({
                        duration: 1000,
                        once: false,
                        mirror: true
                    });
                }

                // Trigger Bouquet Animation
                buildBouquet();
            }
        });
    });
}

// Digital Bouquet Generator
const words = ["LOVE", "JOY", "PEACE", "SUCCESS", "GOOD HEALTH", "FAVOUR", "LONG LIFE", "LAUGHTER"];
function buildBouquet() {
    const bouquet = document.getElementById('bouquet');
    if (!bouquet) return;
    
    bouquet.innerHTML = ''; // Clear old ones
    words.forEach((word) => {
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.innerText = word;
        bouquet.appendChild(flower);
    });

    gsap.to('.flower', {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });
}

// Hidden Love Notes Logic
const notes = [
    document.getElementById('note-1'),
    document.getElementById('note-2'),
    document.getElementById('note-3'),
    document.getElementById('note-4'),
    document.getElementById('note-5')
];

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    notes.forEach((note, index) => {
        if (!note) return;
        if (scrollY > (index + 1) * 600 && scrollY < (index + 1) * 600 + 400) {
            note.style.top = `${20 + (index * 10)}%`;
            note.style.left = index % 2 === 0 ? '10%' : '60%';
            note.style.opacity = '1';
        } else {
            note.style.opacity = '0';
        }
    });
});

// Three.js Background Particles
try {
    const canvas = document.getElementById('bg-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 150;
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.04,
            color: 0xd4af37,
            transparent: true,
            opacity: 0.6
        });

        const particlesMesh = new THREE.Points(particlesGeometry, material);
        scene.add(particlesMesh);
        camera.position.z = 5;

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            particlesMesh.rotation.y = elapsedTime * 0.05;
            particlesMesh.rotation.x = elapsedTime * 0.02;
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
} catch (e) {
    console.log("Three.js skipped or unsupported on this browser context.");
}
  
