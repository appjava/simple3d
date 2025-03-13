//------------------- PWA -----------------------------//
if ("serviceWorker" in navigator) {
	  window.addEventListener("load", function() {
		navigator.serviceWorker
		  .register("./pwa/serviceWorker.js")
		  .then(res => console.log("service worker registered"))
		  .catch(err => console.log("service worker not registered", err))
	  })
	}
//----------------------------------------------------//

    let scene, camera, renderer, controls, model, modelo, isMobile;

    function detectDevice() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    function init() {

        isMobile = detectDevice();
        
        scene = new THREE.Scene();

        // Configurar controles según el dispositivo
        if (isMobile) {
            document.getElementById("mobile-guide").style.display = "block";
            document.getElementById("desktop-guide").style.display = "none";
        } else {
            document.getElementById("mobile-guide").style.display = "none";
            document.getElementById("desktop-guide").style.display = "block";
        }

        // Configuración de cámara
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.set(5, 5, 10);

        // Renderizador
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        // Controles de órbita
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.minDistance = 2;
        controls.maxDistance = 1200;

        // Iluminación mejorada
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(10, 10, 10);
        dirLight.castShadow = true;
        scene.add(dirLight);

        // Cargar modelo
        loadModel("model/model.mtl", "model/model.obj");
        modelo = "model";

        // Ajustar tamaño al cambiar ventana
        window.addEventListener("resize", onWindowResize);

        animate();
    }

    function switchModel(){
        if (modelo == "model2") {
            scene.remove(model);
            loadModel("model1/model.mtl", "model1/model.obj");
            modelo = "model1";
        } else if (modelo == "model1"){
            scene.remove(model);
            loadModel("model2/model.mtl", "model2/model.obj");
            modelo = "model2";
        }
    }

    function loadModel(mtlPath, objPath) {
        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.load(mtlPath, (materials) => {
            materials.preload();
            const objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(objPath, (object) => {
                object.scale.set(1, 1, 1);
                object.position.set(0, 0, 0);
                model = object;
                scene.add(model);
                adjustCamera(model);
                fadeOutLoader();
            });
        });
    }

    function adjustCamera(object) {
        const box = new THREE.Box3().setFromObject(object);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        controls.target.copy(center);
        camera.position.set(center.x + size * 1, center.y + size * 1, center.z + size * -1);
        camera.lookAt(center);
    }

    function setView(view) {
    if (!model) return;

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length() * 0.7;

    let targetPosition = new THREE.Vector3();
    let targetQuaternion = new THREE.Quaternion();

    if (view === "iso") {
        targetPosition.set(center.x + size * 1, center.y + size * 1, center.z + size * -1);
        camera.lookAt(center);
        document.getElementById("guide").style.display = "block";
        document.getElementById("donate").style.display = "none";
    } else if (view === "front") {
        targetPosition.set(center.x, center.y, center.z + size+500);
        camera.lookAt(center);
        document.getElementById("guide").style.display = "none";
        document.getElementById("donate").style.display = "block";
    } else if (view === "side") {
        targetPosition.set(center.x + size+500, center.y, center.z);
        camera.lookAt(center);
        document.getElementById("guide").style.display = "none";
        document.getElementById("donate").style.display = "block";
    } else if (view === "top") {
        if (isMobile) {
            targetPosition.set(center.x, center.y + size+500, center.z);
            document.getElementById("guide").style.display = "none";
            document.getElementById("donate").style.display = "block";
        } else {
            targetPosition.set(center.x + size * 0.01, center.y + size * 1, center.z + size * 0);
            document.getElementById("guide").style.display = "none";
            document.getElementById("donate").style.display = "block";
        }
        
        // 🔄 Vista superior sin rotación en Y (sólo mira hacia abajo)
        let targetRotation = new THREE.Euler(-Math.PI / 2, 0, 0);
        targetQuaternion.setFromEuler(targetRotation);
    }

    animateCamera(camera.position.clone(), targetPosition, camera.quaternion.clone(), targetQuaternion, 0.8);
    controls.target.copy(center);
}

function animateCamera(startPos, endPos, startQuat, endQuat, duration) {
    let startTime = performance.now();

    function animate() {
        let elapsed = (performance.now() - startTime) / 1000;
        if (elapsed > duration) elapsed = duration;

        // Interpolamos posición
        camera.position.lerpVectors(startPos, endPos, elapsed / duration);
        
        // 🔄 Interpolamos rotación suavemente
        THREE.Quaternion.slerp(startQuat, endQuat, camera.quaternion, elapsed / duration);

        if (elapsed < duration) requestAnimationFrame(animate);
    }
    animate();
}

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function fadeOutLoader() {
        const loader = document.getElementById("loader");
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 500);
        }, 500);
        document.getElementById("brand").style.display = "block";
        document.getElementById("guide").style.display = "block";
        document.getElementById("controls").style.display = "block";
        
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    init();
