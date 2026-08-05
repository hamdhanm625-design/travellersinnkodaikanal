/* ==========================================================================
   TRAVELLERS INN TOURS AND TRAVELS - KODAIKANAL
   3D Interactive Kodaikanal Map & Route Experience (Three.js)
   ========================================================================== */

(function () {
  const container = document.getElementById('map-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const landmarksData = [
    {
      id: 'coakers-walk',
      name: "Coaker's Walk",
      distance: '1.2 km from Town',
      desc: '1-kilometer paved pedestrian path constructed on the slopes of Mount Nebo with breathless misty valley views.',
      pos: { x: -6, z: -2 },
      color: 0x0d9488,
    },
    {
      id: 'kodaikanal-lake',
      name: 'Kodaikanal Lake',
      distance: '0.5 km from Town',
      desc: 'Iconic star-shaped man-made lake surrounded by lush Palani Hills, row boating, and scenic cycling paths.',
      pos: { x: -2, z: 4 },
      color: 0x0284c7,
    },
    {
      id: 'pillar-rocks',
      name: 'Pillar Rocks',
      distance: '7.5 km from Town',
      desc: 'Three giant vertical granite rock pillars standing 400 feet high, enveloped in thick mountain mist.',
      pos: { x: 5, z: -5 },
      color: 0xf59e0b,
    },
    {
      id: 'guna-caves',
      name: 'Guna Caves (Devil’s Kitchen)',
      distance: '8.2 km from Town',
      desc: 'Mysterious rock formations between three main giant boulders, famous for pine forest trails.',
      pos: { x: 8, z: -2 },
      color: 0x10b981,
    },
    {
      id: 'pine-forest',
      name: 'Pine Forest',
      distance: '6.0 km from Town',
      desc: 'Tall, serene timber forest planted in 1906, popular film shooting destination with romantic pine aroma.',
      pos: { x: 2, z: 2 },
      color: 0x15803d,
    },
    {
      id: 'silver-cascade',
      name: 'Silver Cascade Falls',
      distance: '8.0 km from Ghat Road',
      desc: 'Spectacular 180-foot waterfall overflowing from Kodai Lake, welcoming travellers as they enter Kodaikanal.',
      pos: { x: -8, z: -8 },
      color: 0x38bdf8,
    },
  ];

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x061412);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 18, 18);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lights
  const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambLight);

  const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  // 1. TERRAIN BASE PLATE (KODAIKANAL TOPOGRAPHY)
  const terrainGeo = new THREE.PlaneGeometry(30, 24, 32, 32);
  
  // Height displacement map simulation
  const posAttr = terrainGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    const zVal = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 1.8 + Math.sin(x * 0.1) * 2;
    posAttr.setZ(i, zVal);
  }
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x0f2d26,
    roughness: 0.8,
    metalness: 0.1,
    wireframe: false,
  });

  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.rotation.x = -Math.PI / 2;
  scene.add(terrainMesh);

  // Grid Helper overlay
  const gridHelper = new THREE.GridHelper(30, 30, 0x0d9488, 0x134e4a);
  gridHelper.position.y = 0.05;
  scene.add(gridHelper);

  // 2. LANDMARK HOTSPOTS (3D BEACON PINS)
  const pinsGroup = new THREE.Group();
  const pinsList = [];

  landmarksData.forEach((lm) => {
    const pinGeo = new THREE.CylinderGeometry(0.1, 0.4, 1.8, 8);
    const pinMat = new THREE.MeshStandardMaterial({
      color: lm.color,
      emissive: lm.color,
      emissiveIntensity: 0.4,
    });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.set(lm.pos.x, 1.2, lm.pos.z);
    pin.userData = lm;

    // Glowing Sphere Cap
    const capGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const capMat = new THREE.MeshBasicMaterial({ color: lm.color });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(lm.pos.x, 2.2, lm.pos.z);
    pinsGroup.add(cap);

    pinsGroup.add(pin);
    pinsList.push(pin);
  });

  scene.add(pinsGroup);

  // Camera Orbit Control state
  let targetCamX = 0;
  let targetCamZ = 18;

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);

    // Subtle pins bobbing
    pinsList.forEach((pin, idx) => {
      pin.position.y = 1.2 + Math.sin(Date.now() * 0.003 + idx) * 0.15;
    });

    // Smooth camera panning
    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.z += (targetCamZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Raycasting for clicking 3D pins
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener('click', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pinsList);

    if (intersects.length > 0) {
      const clickedLM = intersects[0].object.userData;
      selectLandmark(clickedLM.id);
    }
  });

  // Global Function to Select Landmark from HTML list
  window.selectLandmark = function (id) {
    const lm = landmarksData.find((item) => item.id === id);
    if (!lm) return;

    // Highlight HTML list item and announce selected location
    document.querySelectorAll('.landmark-item').forEach((el) => {
      const isActive = el.dataset.landmark === id;
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      if (isActive) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Pan 3D camera towards landmark
    targetCamX = lm.pos.x * 0.8;
    targetCamZ = 12 + lm.pos.z * 0.5;

    // Toast notification
    if (window.showToast) {
      window.showToast(`📍 Selected ${lm.name} (${lm.distance})`);
    }
  };

  // Resize Listener
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
})();
