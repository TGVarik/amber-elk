var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var DPR = window.devicePixelRatio || 1;

var render = function() {
  var delta = clock.getDelta();
  renderer.clear();
  renderer.autoClear = false;
  composer.render(delta);
};

var animate = function(){
  requestAnimationFrame(animate);
  player.animate();
  render();
};

var onClick = function(e){
  e.preventDefault();
  player.levelUp();
};

var onContextMenu = function(e){
  e.preventDefault();
  player.levelDown();
};

var lights = [];
var i;
var bgColor = 0x000511;
var sunColor = 0xffee00;
var renderer = new THREE.WebGLRenderer({precision: 'highp', preserveDrawingBuffer: true});
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera (90, window.innerWidth / window.innerHeight, 5, 1300);
var renderModel = new THREE.RenderPass(scene, camera);
var effectBloom = new THREE.BloomPass(1);
var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
var effectCopy = new THREE.ShaderPass(THREE.CopyShader);

var clock = new THREE.Clock();
var controls = new THREE.OrbitControls(camera);
var player = new PlayerCharacter();
player.max();
renderer.setClearColor(bgColor, 1);
renderer.setSize(SCREEN_WIDTH * DPR, SCREEN_HEIGHT * DPR);
renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.autoClear = false;
renderer.sortObjects = false;
camera.position.set(10.490308050952303, -56.82337156353004, 45.438516236508654);
camera.rotation.set(0.8962719778045327, 0.14319631595243898, -0.1766042862304935);
camera.lookAt(scene.position);
lights.push(new THREE.SpotLight(0xffffff,1,300,45,1));
lights.push(new THREE.SpotLight(0xffffff,1,300,45,1));
lights.push(new THREE.SpotLight(0xffffff,1,300,45,1));
lights[0].position.set(-100,100,100);
lights[1].position.set(100,100,100);
lights[2].position.set(100,-100,100);
for (i = 0; i < lights.length; i++){
  lights[i].castShadow = true;
  lights[i].shadowDarkness = 0.5;
  scene.add(lights[i]);
}
scene.add(player);

var composer = new THREE.EffectComposer(renderer);
effectFXAA.uniforms['resolution'].value = new THREE.Vector2(1/(SCREEN_WIDTH * DPR), 1/(SCREEN_HEIGHT * DPR));
effectCopy.renderToScreen = true;
composer.setSize(SCREEN_WIDTH * DPR, SCREEN_HEIGHT * DPR);
composer.addPass(renderModel);
composer.addPass(effectBloom);
composer.addPass(effectFXAA);
composer.addPass(effectCopy);

document.body.appendChild(renderer.domElement);
controls.addEventListener('change', render);
document.body.addEventListener('click', onClick);
document.body.addEventListener('contextmenu', onContextMenu);

render();
animate();

