import * as THREE from "three";

// === Init ===
const SLIDE_STEP = 0.01;

const screenRatio = window.innerWidth / window.innerHeight;
const imageSize = 1;
let slideProgress = 0.0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, screenRatio, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();
let texture1 = loader.load("textures/IMG_6899.jpeg");
let texture2 = loader.load("textures/IMG_1355.jpeg");

const planeGeometry = new THREE.PlaneBufferGeometry(imageSize * screenRatio, imageSize);

const uniforms = {
    uTexture1: { value: texture1 },
    uTexture2: { value: texture2 },
    uSlideProgress: { value: slideProgress }
};

const planeMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: fragmentShader(),
    vertexShader: vertexShader()
});


const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

camera.position.z = 0.5;

// === Start app ===
animate();

// === Functions ===
function vertexShader() {
    return `
        varying vec2 vUv; 
        varying vec3 vPos;

        void main() {
            vUv = uv; 
            vPos = position + 0.5; //map to range [0,1]

            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition; 
        }
    `;
}

function fragmentShader() {
    return `
        #define SLIDE_FALLOFF 0.05

        uniform sampler2D uTexture1; 
        uniform sampler2D uTexture2;
        uniform float uSlideProgress;
        varying vec2 vUv;
        varying vec3 vPos;

        void main() {
            vec4 color1 = texture2D(uTexture1, vUv);
            vec4 color2 = texture2D(uTexture2, vUv);
            float progress = 1.0 - uSlideProgress;
            //float step = uSlideProgress * vPos.x - vUv.y * vPos.y + vUv.x * vPos.z;
            float step = smoothstep(progress - SLIDE_FALLOFF, progress + SLIDE_FALLOFF, vPos.y);
            vec4 fColor = mix(color1, color2, step);
            fColor.a = 1.0;
            gl_FragColor = fColor;
        }
    `;
}

function animate() {
    renderer.render(scene, camera);

    if (uniforms.uSlideProgress.value >= 1.0) {
        uniforms.uSlideProgress.value = 0.0;
    } else {
        uniforms.uSlideProgress.value += SLIDE_STEP;
    }

    requestAnimationFrame(animate);
};