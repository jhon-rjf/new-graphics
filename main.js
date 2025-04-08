// 이 파일에는 Three.js를 이용한 3D 갤러리 전시관을 구현하기 위한 코드가 포함됩니다.
// 각 역할별로 담당 부분을 주석으로 명시하였습니다.

// ============================================
// 팀장 & 코어 개발자 담당: 씬, 카메라, 빛, 전반적인 모든 요소 구성 [천효민] - 시작
// ============================================

// 기본 변수 선언
let scene, camera, renderer, controls;
let clock = new THREE.Clock();
let mixers = [];

// 조명 변수들을 전역으로 선언
let ambientLight, directionalLight, spotLight1, spotLight2, spotLight3;

// 전시물 객체들을 전역으로 선언
let cube, sphere, cone;

// 씬 초기화 함수
function initScene() {
  // 씬 생성
  scene = new THREE.Scene();
  
  // 카메라 설정
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 10);
  
  // 렌더러 설정
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  
  // 브라우저 리사이즈 대응
  window.addEventListener('resize', onWindowResize, false);
  
  // 로딩 화면 제거
  setTimeout(() => {
    document.getElementById('loading').style.display = 'none';
  }, 1000);
}

// 브라우저 크기 변경 시 대응
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  
  // 믹서 업데이트 (애니메이션)
  for (const mixer of mixers) {
    mixer.update(delta);
  }
  
  // OrbitControls 업데이트
  if (controls) controls.update();
  
  // 렌더링
  renderer.render(scene, camera);
}

// 메인 초기화 함수
function init() {
  initScene();
  
  // 각 역할별 초기화 함수 호출
  initControls();
  createGallery();
  setupLighting();
  applyTextures();
  setupInteractions();
  
  // 애니메이션 시작
  animate();
}

// 페이지 로드 완료 시 초기화 함수 호출
window.addEventListener('load', init);

// ============================================
// 팀장 & 코어 개발자 담당: 씬, 카메라, 빛, 전반적인 모든 요소 구성 [천효민] - 끝
// ============================================

// ============================================
// 3D 모델링 담당: 지오메트리 생성 및 텍스처 [서윤찬, 김수현] - 시작
// ============================================

// 갤러리 기본 구조 생성
function createGallery() {
  // 바닥 생성
  const floorGeometry = new THREE.PlaneGeometry(30, 30);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  
  // 벽 생성
  createWalls();
  
  // 전시물 생성
  createExhibits();
}

// 벽 생성 함수
function createWalls() {
  // 벽 geometry와 material 생성 
  const wallGeometry = new THREE.BoxGeometry(30, 10, 0.5);
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  
  // 뒷벽
  const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
  backWall.position.set(0, 5, -15);
  backWall.castShadow = true;
  backWall.receiveShadow = true;
  scene.add(backWall);
  
  // 좌측벽
  const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
  leftWall.position.set(-15, 5, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.castShadow = true;
  leftWall.receiveShadow = true;
  scene.add(leftWall);
  
  // 우측벽
  const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
  rightWall.position.set(15, 5, 0);
  rightWall.rotation.y = Math.PI / 2;
  rightWall.castShadow = true;
  rightWall.receiveShadow = true;
  scene.add(rightWall);
}

// 전시물 생성 함수
function createExhibits() {
  // 전시대 생성
  const pedestalGeometry = new THREE.BoxGeometry(2, 1, 2);
  const pedestalMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  
  // 전시물 1: 금성
  const pedestal1 = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal1.position.set(-8, 0.5, -10);
  pedestal1.castShadow = true;
  pedestal1.receiveShadow = true;
  scene.add(pedestal1);
  
  const textureLoader = new THREE.TextureLoader();
  const venusTexture = textureLoader.load('./textures/venus.jpg');
  
  const venusGeometry = new THREE.SphereGeometry(1, 32, 32);
  const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
  venus = new THREE.Mesh(venusGeometry, venusMaterial);
  venus.position.set(-8, 2, -10);
  venus.castShadow = true;
  venus.userData = { type: 'exhibit', name: '구체작품', description: '금성 모형 전시물물입니다.' };
  scene.add(venus);
  
  // 전시물 2: 벽돌블럭
  const pedestal2 = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal2.position.set(0, 0.5, -10);
  pedestal2.castShadow = true;
  pedestal2.receiveShadow = true;
  scene.add(pedestal2);
  
  const brickTexture = textureLoader.load('./textures/brick.jpg');
  const brickGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5); 
  const brickMaterial = new THREE.MeshStandardMaterial({ map: brickTexture });
  brick = new THREE.Mesh(brickGeometry, brickMaterial);
  brick.position.set(0, 2, -10);
  brick.castShadow = true;
  brick.userData = { type: 'exhibit', name: '큐브작품', description: '벽돌블럭 전시물물입니다.' };
  scene.add(brick);
  
  
  // 전시물 3: 축구공
  const pedestal3 = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
  pedestal3.position.set(8, 0.5, -10);
  pedestal3.castShadow = true;
  pedestal3.receiveShadow = true;
  scene.add(pedestal3);

  const ballTexture = textureLoader.load('./textures/ball.png');
  
  const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({ map: ballTexture });
  ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(8, 2, -10);
  ball.castShadow = true;
  ball.userData = { type: 'exhibit', name: '구체작품', description: '축구공 전시물입니다다.' };
  scene.add(ball);
}

// ============================================
// 3D 모델링 담당: 지오메트리 생성 및 텍스처 [서윤찬, 김수현] - 끝
// ============================================

// ============================================
// 환경 및 조명 담당: dat.GUI 조명 실시간 조정 [정윤걸] - 시작
// ============================================

// 조명 설정 함수
function setupLighting() {
  // 앰비언트 라이트 (전체 조명)
  ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);
  
  // 디렉셔널 라이트 (태양광 같은 직사광)
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 15);
  directionalLight.castShadow = true;
  
  // 그림자 품질 설정
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -25;
  directionalLight.shadow.camera.right = 25;
  directionalLight.shadow.camera.top = 25;
  directionalLight.shadow.camera.bottom = -25;
  
  scene.add(directionalLight);
  
  // 스팟라이트 (전시물 강조)
  spotLight1 = new THREE.SpotLight(0xffffff, 1);
  spotLight1.position.set(-8, 10, -8);
  spotLight1.angle = Math.PI / 8;
  spotLight1.penumbra = 0.2;
  spotLight1.castShadow = true;
  spotLight1.target.position.set(-8, 0, -10);
  scene.add(spotLight1);
  scene.add(spotLight1.target);
  
  spotLight2 = new THREE.SpotLight(0xffffff, 1);
  spotLight2.position.set(0, 10, -8);
  spotLight2.angle = Math.PI / 8;
  spotLight2.penumbra = 0.2;
  spotLight2.castShadow = true;
  spotLight2.target.position.set(0, 0, -10);
  scene.add(spotLight2);
  scene.add(spotLight2.target);
  
  spotLight3 = new THREE.SpotLight(0xffffff, 1);
  spotLight3.position.set(8, 10, -8);
  spotLight3.angle = Math.PI / 8;
  spotLight3.penumbra = 0.2;
  spotLight3.castShadow = true;
  spotLight3.target.position.set(8, 0, -10);
  scene.add(spotLight3);
  scene.add(spotLight3.target);

  // dat.GUI를 통한 조명 컨트롤 설정
  setupLightingControls();
}

// dat.GUI를 이용한 조명 컨트롤 설정 함수
function setupLightingControls() {
  const gui = new dat.GUI();
  
  // 각 조명의 활성화 상태를 저장하는 객체
  const lightControls = {
    ambientLightOn: true,
    directionalLightOn: true,
    spotLight1On: true,
    spotLight2On: true,
    spotLight3On: true,
    // 와이어프레임 모드 토글 상태 추가
    cubeWireframe: false,
    sphereWireframe: false,
    coneWireframe: false
  };
  
  // 앰비언트 라이트 컨트롤 (간소화)
  const ambientFolder = gui.addFolder('환경광 (Ambient Light)');
  ambientFolder.add(lightControls, 'ambientLightOn').name('활성화').onChange((value) => {
    ambientLight.visible = value;
  });
  ambientFolder.addColor({ color: 0x404040 }, 'color').name('색상').onChange((value) => {
    ambientLight.color.set(value);
  });
  ambientFolder.add(ambientLight, 'intensity', 0, 1, 0.01).name('강도');
  ambientFolder.open();
  
  // 디렉셔널 라이트 컨트롤 (간소화)
  const directionalFolder = gui.addFolder('직사광 (Directional Light)');
  directionalFolder.add(lightControls, 'directionalLightOn').name('활성화').onChange((value) => {
    directionalLight.visible = value;
  });
  directionalFolder.addColor({ color: 0xffffff }, 'color').name('색상').onChange((value) => {
    directionalLight.color.set(value);
  });
  directionalFolder.add(directionalLight, 'intensity', 0, 2, 0.01).name('강도');
  directionalFolder.open();
  
  // 스팟라이트 컨트롤 (간소화)
  const spotlightsFolder = gui.addFolder('스팟라이트');
  
  // 스팟라이트 1 (좌측)
  spotlightsFolder.add(lightControls, 'spotLight1On').name('좌측 조명 활성화').onChange((value) => {
    spotLight1.visible = value;
  });
  
  // 스팟라이트 2 (중앙)
  spotlightsFolder.add(lightControls, 'spotLight2On').name('중앙 조명 활성화').onChange((value) => {
    spotLight2.visible = value;
  });
  
  // 스팟라이트 3 (우측)
  spotlightsFolder.add(lightControls, 'spotLight3On').name('우측 조명 활성화').onChange((value) => {
    spotLight3.visible = value;
  });
  
  spotlightsFolder.open();
  
  // 와이어프레임 모드 토글 추가
  const wireframeFolder = gui.addFolder('와이어프레임 모드');
  
  // 큐브 와이어프레임 토글
  wireframeFolder.add(lightControls, 'cubeWireframe').name('큐브 와이어프레임').onChange((value) => {
    cube.material.wireframe = value;
  });
  
  // 구체 와이어프레임 토글
  wireframeFolder.add(lightControls, 'sphereWireframe').name('구체 와이어프레임').onChange((value) => {
    sphere.material.wireframe = value;
  });
  
  // 원뿔 와이어프레임 토글
  wireframeFolder.add(lightControls, 'coneWireframe').name('원뿔 와이어프레임').onChange((value) => {
    cone.material.wireframe = value;
  });
  
  wireframeFolder.open();
  
  // 그림자 토글 컨트롤
  const shadowFolder = gui.addFolder('그림자 설정');
  shadowFolder.add({ enableShadows: true }, 'enableShadows').onChange((value) => {
    directionalLight.castShadow = value;
    spotLight1.castShadow = value;
    spotLight2.castShadow = value;
    spotLight3.castShadow = value;
  }).name('그림자 활성화');
  shadowFolder.open();
  
  // 전체 씬 조명 프리셋
  const presetFolder = gui.addFolder('조명 프리셋');
  const presets = {
    '기본 설정': function() {
      // 모든 조명 활성화
      ambientLight.visible = true;
      directionalLight.visible = true;
      spotLight1.visible = true;
      spotLight2.visible = true;
      spotLight3.visible = true;
      
      // 색상 및 강도 초기화
      ambientLight.color.set(0x404040);
      ambientLight.intensity = 0.5;
      directionalLight.color.set(0xffffff);
      directionalLight.intensity = 0.8;
      spotLight1.color.set(0xffffff);
      spotLight1.intensity = 1;
      spotLight2.color.set(0xffffff);
      spotLight2.intensity = 1;
      spotLight3.color.set(0xffffff);
      spotLight3.intensity = 1;
      
      // 와이어프레임 모드 초기화
      cube.material.wireframe = false;
      sphere.material.wireframe = false;
      cone.material.wireframe = false;
      lightControls.cubeWireframe = false;
      lightControls.sphereWireframe = false;
      lightControls.coneWireframe = false;
      
      // GUI 업데이트
      updateGUI();
    },
    '환경광만': function() {
      ambientLight.visible = true;
      directionalLight.visible = false;
      spotLight1.visible = false;
      spotLight2.visible = false;
      spotLight3.visible = false;
      
      ambientLight.intensity = 0.8;
      
      updateGUI();
    },
    '스팟라이트만': function() {
      ambientLight.visible = false;
      directionalLight.visible = false;
      spotLight1.visible = true;
      spotLight2.visible = true;
      spotLight3.visible = true;
      
      spotLight1.intensity = 1.5;
      spotLight2.intensity = 1.5;
      spotLight3.intensity = 1.5;
      
      updateGUI();
    },
    '드라마틱 조명': function() {
      ambientLight.visible = true;
      ambientLight.intensity = 0.1;
      
      directionalLight.visible = false;
      
      spotLight1.visible = true;
      spotLight1.color.set(0xff0000);
      spotLight1.intensity = 2;
      
      spotLight2.visible = true;
      spotLight2.color.set(0x00ff00);
      spotLight2.intensity = 2;
      
      spotLight3.visible = true;
      spotLight3.color.set(0x0000ff);
      spotLight3.intensity = 2;
      
      updateGUI();
    },
    '전체 와이어프레임': function() {
      // 와이어프레임 모드 활성화
      cube.material.wireframe = true;
      sphere.material.wireframe = true;
      cone.material.wireframe = true;
      
      // 조명 설정
      ambientLight.visible = true;
      ambientLight.intensity = 1;
      directionalLight.visible = true;
      directionalLight.intensity = 0.5;
      spotLight1.visible = false;
      spotLight2.visible = false;
      spotLight3.visible = false;
      
      // 컨트롤 값 업데이트
      lightControls.cubeWireframe = true;
      lightControls.sphereWireframe = true;
      lightControls.coneWireframe = true;
      
      updateGUI();
    }
  };
  
  // GUI 컨트롤 업데이트 함수
  function updateGUI() {
    // 체크박스 상태 업데이트
    lightControls.ambientLightOn = ambientLight.visible;
    lightControls.directionalLightOn = directionalLight.visible;
    lightControls.spotLight1On = spotLight1.visible;
    lightControls.spotLight2On = spotLight2.visible;
    lightControls.spotLight3On = spotLight3.visible;
    
    // 와이어프레임 체크박스 상태 업데이트
    lightControls.cubeWireframe = cube.material.wireframe;
    lightControls.sphereWireframe = sphere.material.wireframe;
    lightControls.coneWireframe = cone.material.wireframe;
    
    // GUI 리프레시 (dat.GUI는 자동 업데이트를 지원하지 않음)
    for (const controller of gui.__controllers) {
      controller.updateDisplay();
    }
    for (const folder of Object.values(gui.__folders)) {
      for (const controller of folder.__controllers) {
        controller.updateDisplay();
      }
    }
  }
  
  presetFolder.add(presets, '기본 설정');
  presetFolder.add(presets, '환경광만');
  presetFolder.add(presets, '스팟라이트만');
  presetFolder.add(presets, '드라마틱 조명');
  presetFolder.add(presets, '전체 와이어프레임');
  presetFolder.open();
}

// ============================================
// 환경 및 조명 담당: dat.GUI 조명 실시간 조정 [정윤걸] - 끝
// ============================================

// ============================================
// 텍스처 및 머티리얼 담당: 전시관 텍스처 [천효민] - 시작
// ============================================

// 텍스처 적용 함수
function applyTextures() {
  // 이 함수에서는 실제로 텍스처를 로드하고 적용하는 코드를 작성합니다.
  // 실제 구현 시에는 이미지 파일이 필요합니다.
  
  // 텍스처 로더 생성
  const textureLoader = new THREE.TextureLoader();
  
  // 바닥 텍스처 적용 예시
  // textureLoader.load('textures/floor.jpg', function(texture) {
  //   texture.wrapS = THREE.RepeatWrapping;
  //   texture.wrapT = THREE.RepeatWrapping;
  //   texture.repeat.set(10, 10);
  //   
  //   const floorMaterial = new THREE.MeshStandardMaterial({
  //     map: texture,
  //     roughness: 0.8,
  //     metalness: 0.2
  //   });
  //   
  //   // 바닥을 찾아 텍스처 적용
  //   scene.traverse(function(child) {
  //     if (child instanceof THREE.Mesh && child.position.y === 0) {
  //       child.material = floorMaterial;
  //     }
  //   });
  // });
  
  // 여기서는 간단한 색상만 변경하는 코드로 대체
  // 실제 구현 시에는 위의 주석 처리된 코드와 같이 텍스처를 로드하고 적용해야 합니다.
  const floor = scene.children.find(child => 
    child instanceof THREE.Mesh && 
    child.rotation.x === -Math.PI / 2
  );
  
  if (floor) {
    floor.material = new THREE.MeshStandardMaterial({
      color: 0x808080,
      roughness: 0.8,
      metalness: 0.2
    });
  }
}

// ============================================
// 텍스처 및 머티리얼 담당: 전시관 텍스처 [천효민] - 끝
// ============================================

// 컨트롤 설정 함수
function initControls() {
  // OrbitControls 설정
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 20;
  controls.maxPolarAngle = Math.PI / 2;
}

// 인터랙션 설정 함수
function setupInteractions() {
  // 레이캐스터 생성
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  // 마우스 이동 이벤트
  window.addEventListener('mousemove', function(event) {
    // 마우스 좌표 정규화
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // 레이캐스팅
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    
    // 커서 스타일 변경
    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (object.userData && object.userData.type === 'exhibit') {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    } else {
      document.body.style.cursor = 'default';
    }
  });
  
  // 클릭 이벤트
  window.addEventListener('click', function() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    
    if (intersects.length > 0) {
      const object = intersects[0].object;
      if (object.userData && object.userData.type === 'exhibit') {
        // 전시물 클릭 시 작품 정보 표시
        const info = document.getElementById('info');
        info.textContent = `${object.userData.name}: ${object.userData.description}`;
        
        // 3초 후 원래 제목으로 복귀
        setTimeout(() => {
          info.textContent = '나만의 3D 갤러리 전시관';
        }, 3000);
      }
    }
  });
}
