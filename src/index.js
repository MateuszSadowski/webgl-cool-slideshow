import * as THREE from "three";

const screenRatio = window.innerWidth / window.innerHeight;
const imageSize = 1;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, screenRatio, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

let shadersSetUp = false;
let texture1, texture2;
const planeGeometry = new THREE.PlaneBufferGeometry(imageSize * screenRatio, imageSize);

loader.load(
    "textures/IMG_6831.jpeg",
    (texture) => {
        texture1 = texture;
    }
)
loader.load(
    "textures/IMG_6899.jpeg",
    (texture) => {
        texture2 = texture;
    }
)

const vertexShader = () => {
    return `
        varying vec2 vUv; 
        varying vec3 pos;

        void main() {
            vUv = uv; 
            pos = position;

            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition; 
        }
    `;
}

const fragmentShader = () => {
    return `
        uniform sampler2D texture1; 
        uniform sampler2D texture2; 
        varying vec2 vUv;
        varying vec3 pos;

        void main() {
            vec4 color1 = texture2D(texture1, vUv);
            vec4 color2 = texture2D(texture2, vUv);
            vec4 fColor = mix(color1, color2, pos.y);
            fColor.a = 1.0;
            gl_FragColor = fColor;
        }
    `;
}

camera.position.z = 0.5;

const animate = () => {
    if (texture1 && texture2) {
        if (!shadersSetUp) {
            const uniforms = {
                texture1: { value: texture1 },
                texture2: { value: texture2 }
            };

            const planeMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                fragmentShader: fragmentShader(),
                vertexShader: vertexShader()
            });

            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            scene.add(plane);

            shadersSetUp = true;
        }

        renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
};

animate();