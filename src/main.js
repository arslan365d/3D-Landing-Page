import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const main = document.querySelector("#main")
const canvas = document.querySelector("canvas")

// Size of the container in which i apply 3D stuff
const size = {
  width: main.clientWidth,
  height: main.clientHeight,
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(size.width, size.height);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

// Loading the HDRI environment
const rgbeLoader = new RGBELoader();
rgbeLoader.load("rogland_clear_night_1k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = texture;
  scene.environment = texture;
});

// Loading the 3D Model
let model;
const loader = new GLTFLoader();
loader.load('/skull_downloadable.glb', function (gltf) {
  model = gltf.scene
  scene.add(model);
  model.scale.set(0.8, 0.8, 0.8)
}, undefined, function (error) {
  console.error(error);
})


// moving skull on mouse move
window.addEventListener("mousemove", (e) => {
  if (model) {
    let rotationY = (e.clientX / window.innerWidth - 0.5) * (Math.PI / 2 * 0.5)
    let rotationX = (e.clientY / window.innerHeight - 0.5) * (Math.PI / 2 * 0.5)

    model.rotation.x = rotationX;
    model.rotation.y = rotationY;
  }

})


function animate() {
  window.requestAnimationFrame(animate)
  renderer.render(scene, camera);

}
animate()