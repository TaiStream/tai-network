function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const points = 340;
    const geometry = new THREE.BufferGeometry();
    const pos = new Float32Array(points * 3);

    for (let i = 0; i < points; i++) {
        const i3 = i * 3;
        pos[i3] = (Math.random() - 0.5) * 22;
        pos[i3 + 1] = (Math.random() - 0.5) * 16;
        pos[i3 + 2] = (Math.random() - 0.5) * 16;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const material = new THREE.PointsMaterial({
        size: 0.06,
        color: 0x6fdcff,
        transparent: true,
        opacity: 0.8,
    });

    const cloud = new THREE.Points(geometry, material);
    scene.add(cloud);
    camera.position.z = 7;

    let mx = 0;
    let my = 0;

    window.addEventListener('mousemove', (event) => {
        mx = (event.clientX / window.innerWidth - 0.5) * 0.35;
        my = (event.clientY / window.innerHeight - 0.5) * 0.35;
    });

    function animate() {
        cloud.rotation.y += 0.0009;
        cloud.rotation.x += 0.00045;
        cloud.rotation.y += (mx - cloud.rotation.y) * 0.018;
        cloud.rotation.x += (my - cloud.rotation.x) * 0.018;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initReveal() {
    const nodes = document.querySelectorAll('.reveal');
    if (!nodes.length) return;

    const obs = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        }
    }, { threshold: 0.12 });

    nodes.forEach((node, i) => {
        node.style.transitionDelay = `${Math.min(i * 70, 420)}ms`;
        obs.observe(node);
    });
}

function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('[data-nav-links]');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        links.classList.toggle('is-open');
    });

    links.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            links.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function initDemoUploadInteractions() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');

    if (!uploadZone || !fileInput) return;

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

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFiles(fileInput.files);
        }
    });
}

async function handleFiles(files) {
    const file = files[0];
    if (!file) return;

    const uploadText = document.querySelector('.upload-text');
    const progressBar = document.querySelector('.progress-bar');
    const fill = document.querySelector('.progress-fill');

    if (!uploadText || !progressBar || !fill) return;

    uploadText.textContent = `Processing: ${file.name}`;
    progressBar.style.display = 'block';

    for (let i = 0; i <= 100; i += 5) {
        fill.style.width = `${i}%`;
        await new Promise((resolve) => setTimeout(resolve, 90));
    }

    uploadText.innerHTML = 'Upload simulation complete';
}

document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    initReveal();
    initMobileMenu();
    initDemoUploadInteractions();
});
