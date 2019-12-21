import * as THREE from "three";

const screenRatio = window.innerWidth / window.innerHeight;
const imageSize = 1;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, screenRatio, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();

let plane, planeMaterial;
let planeGeometry = new THREE.PlaneBufferGeometry(imageSize * screenRatio, imageSize);
loader.load(
    "textures/IMG_6831.jpeg",
    (texture) => {
        planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);
        scene.add(plane);
    }
)

camera.position.z = 0.5;

const animate = function () {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
};

animate();