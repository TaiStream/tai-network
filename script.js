// Tai Network Interactive Scripts

// 1. Three.js Background Animation
function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particles (Nodes)
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // Random positions spread out
        posArray[i] = (Math.random() - 0.5) * 25;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material
    const material = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00f2ea,
        transparent: true,
        opacity: 0.8,
    });

    // Mesh
    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // Lines connecting nearby particles (The "Network" effect)
    // - Doing this properly in raw Three.js is heavy on CPU. 
    // - We'll use a simpler "Fog" rotation for visual effect instead of per-frame connectivity calculation for performance.

    camera.position.z = 5;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    function animate() {
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        const elapsedTime = clock.getElapsedTime();

        // Rotate entire constellation slowly
        particlesMesh.rotation.y += 0.002;
        particlesMesh.rotation.x += 0.001;

        // Mouse influence easing
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

        // Wave effect
        // Animate individual positions if we had shader material, 
        // but for MVP just general rotation looks "space-like" and modern.

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// 2. Demo Page Logic (File Upload)
document.addEventListener('DOMContentLoaded', () => {
    initBackground();

    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');

    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => fileInput.click());

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                handleFiles(e.dataTransfer.files);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (fileInput.files.length) {
                handleFiles(fileInput.files);
            }
        });
    }
});

async function handleFiles(files) {
    const file = files[0];
    if (!file) return;

    // UI Updates
    document.querySelector('.upload-text').textContent = `Processing: ${file.name}`;
    document.querySelector('.progress-bar').style.display = 'block';
    const fill = document.querySelector('.progress-fill');

    // MOCK UPLOAD for Demo Visuals (Real SDK logic is in separate module)
    // We visually simulate the chunking/uploading to show the "Experience"
    // In demo.html, we will try to actually call the backend if available.

    // Simulate progress
    for (let i = 0; i <= 100; i += 5) {
        fill.style.width = `${i}%`;
        await new Promise(r => setTimeout(r, 100)); // fast visual feedback
    }

    // Trigger success state
    document.querySelector('.upload-text').innerHTML = `✅ Uploaded! <br> <span style="font-size:0.8em; opacity:0.7">Manifest ID: generated_on_walrus...</span>`;

    // Show Player (Mockup for landing animation, but in demo.html it will be real)
    const playerContainer = document.getElementById('demo-player');
    if (playerContainer) {
        playerContainer.style.display = 'block';
        playerContainer.scrollIntoView({ behavior: 'smooth' });
    }
}
