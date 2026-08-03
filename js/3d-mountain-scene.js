/* ==========================================================================
   TRAVELLERS INN TOURS AND TRAVELS - KODAIKANAL
   3D Scenic Mountain Road & Floating Cloud Canvas Engine (Three.js)
   ========================================================================== */

(function () {
  const container = document.getElementById('hero-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xe0f2fe, 0.018);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 8, 28);
  camera.lookAt(0, 2, 0);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xf59e0b, 1.3);
  sunLight.position.set(20, 35, 20);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  scene.add(sunLight);

  const skyLight = new THREE.HemisphereLight(0x0284c7, 0x14532d, 0.6);
  scene.add(skyLight);

  // 1. MOUNTAIN TERRAIN
  const mountainGroup = new THREE.Group();

  function createMountain(x, z, radius, height, color) {
    const geo = new THREE.ConeGeometry(radius, height, 8);
    const mat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.8,
      flatShading: true,
    });
    const mountain = new THREE.Mesh(geo, mat);
    mountain.position.set(x, height / 2 - 4, z);
    mountain.castShadow = true;
    mountain.receiveShadow = true;
    mountainGroup.add(mountain);
  }

  // Background Kodaikanal Mountain Peaks
  createMountain(-25, -20, 22, 28, 0x14532d); // Forest Green
  createMountain(-8, -30, 28, 35, 0x0f766e);  // Teal Green
  createMountain(18, -25, 25, 30, 0x166534);  // Pine Green
  createMountain(32, -35, 30, 38, 0x064e3b);  // Deep Emerald
  createMountain(0, -45, 40, 48, 0x0f172a);   // Dark Blue Distant

  // 2. PINE TREES
  function createPineTree(x, z) {
    const treeGroup = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 1.8, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.9;
    treeGroup.add(trunk);

    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      flatShading: true,
    });

    const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.2, 6), foliageMat);
    cone1.position.y = 2.2;
    treeGroup.add(cone1);

    const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.8, 6), foliageMat);
    cone2.position.y = 3.2;
    treeGroup.add(cone2);

    treeGroup.position.set(x, 0, z);
    mountainGroup.add(treeGroup);
  }

  // Scatter Pine Trees along mountain slopes
  for (let i = 0; i < 40; i++) {
    const tx = (Math.random() - 0.5) * 50;
    const tz = -5 - Math.random() * 25;
    if (Math.abs(tx) > 5) createPineTree(tx, tz);
  }

  scene.add(mountainGroup);

  // 3. WINDING MOUNTAIN ROAD
  const roadCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-25, 0, -15),
    new THREE.Vector3(-12, 1, -5),
    new THREE.Vector3(0, 0, 5),
    new THREE.Vector3(14, -1, 15),
    new THREE.Vector3(26, -2, 25),
  ]);

  const tubeGeo = new THREE.TubeGeometry(roadCurve, 64, 1.6, 8, false);
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.9,
  });
  const roadMesh = new THREE.Mesh(tubeGeo, roadMat);
  roadMesh.position.y = -0.6;
  roadMesh.receiveShadow = true;
  scene.add(roadMesh);

  // 4. 3D TOURIST VEHICLE (SUV / CAB)
  const carGroup = new THREE.Group();

  // Car Body
  const bodyGeo = new THREE.BoxGeometry(1.6, 0.9, 3.2);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc, // Clean White Cab
    metalness: 0.3,
    roughness: 0.2,
  });
  const carBody = new THREE.Mesh(bodyGeo, bodyMat);
  carBody.position.y = 0.7;
  carBody.castShadow = true;
  carGroup.add(carBody);

  // Car Cabin/Roof
  const cabinGeo = new THREE.BoxGeometry(1.4, 0.7, 1.8);
  const cabinMat = new THREE.MeshStandardMaterial({
    color: 0x0d9488, // Warm Teal Roof Accent
    metalness: 0.1,
    roughness: 0.3,
  });
  const carCabin = new THREE.Mesh(cabinGeo, cabinMat);
  carCabin.position.set(0, 1.3, -0.2);
  carGroup.add(carCabin);

  // Car Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

  const wheelPositions = [
    [-0.85, 0.35, 1.0],
    [0.85, 0.35, 1.0],
    [-0.85, 0.35, -1.0],
    [0.85, 0.35, -1.0],
  ];

  wheelPositions.forEach((pos) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(...pos);
    carGroup.add(wheel);
  });

  // Headlights
  const lightGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  const lightL = new THREE.Mesh(lightGeo, lightMat);
  lightL.position.set(-0.6, 0.7, 1.62);
  const lightR = new THREE.Mesh(lightGeo, lightMat);
  lightR.position.set(0.6, 0.7, 1.62);
  carGroup.add(lightL, lightR);

  scene.add(carGroup);

  // 5. FLOATING MIST / CLOUDS
  const cloudGroup = new THREE.Group();
  const cloudGeo = new THREE.DodecahedronGeometry(2.5, 1);
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
    roughness: 1,
  });

  const cloudPositions = [
    [-15, 6, -5],
    [10, 8, -12],
    [-5, 10, -20],
    [18, 5, 2],
    [-22, 12, -28],
  ];

  cloudPositions.forEach((pos) => {
    const cloud = new THREE.Mesh(cloudGeo, cloudMat);
    cloud.position.set(...pos);
    cloud.scale.set(1.5, 0.8, 1.2);
    cloudGroup.add(cloud);
  });

  scene.add(cloudGroup);

  // Animation Variables
  let progress = 0;
  let mouseX = 0;
  let mouseY = 0;

  // Interactivity (Mouse tilt effect)
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Render Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Drive Car smoothly along winding mountain road curve
    progress += 0.0018;
    if (progress > 1) progress = 0;

    const point = roadCurve.getPointAt(progress);
    const tangent = roadCurve.getTangentAt(progress);

    carGroup.position.copy(point);
    carGroup.position.y += 0.2;
    carGroup.lookAt(point.clone().add(tangent));

    // Floating Mist Animation
    cloudGroup.children.forEach((cloud, index) => {
      cloud.position.x += Math.sin(Date.now() * 0.0005 + index) * 0.01;
      cloud.rotation.y += 0.001;
    });

    // Parallax mouse tilt
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 2 + 8 - camera.position.y) * 0.03;
    camera.lookAt(0, 2, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Window Resize
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
})();
