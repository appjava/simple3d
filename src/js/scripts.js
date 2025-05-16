/*
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
*/
    // Función para cargar el modelo desde strings  
    // Al inicio del archivo, después de las variables globales existentes
    let mtlEnabled = true;
    let currentMtlString = null;
    let currentObjString = null;
    let urlDefault = "model/model.zip" ;
    let color1 = "gray";
    let color2 = "teal";
    let textureColor = color2;

    // Variables globales
    let scene, camera, renderer, controls, model, modelo, isMobile;

    document.getElementById("changeColorObj").style.backgroundColor = color2;

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
        //loadModel("model/model.mtl", "model/model.obj");
        //modelo = "model";
        loadFromURL();

        // Ajustar tamaño al cambiar ventana
        window.addEventListener("resize", onWindowResize);

        animate();
        fadeOutLoader();
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
        currentMtlString = mtlPath;
        currentObjString = objPath;
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
        document.getElementById("donate").style.display = "none";
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    init();
    //fadeOutLoader();


// Función para manejar el archivo ZIP seleccionado  
function handleZipFile(file) {  
    
    if (!file) return;  
      
    document.getElementById("loader").style.opacity = "1";  
    document.getElementById("loader").style.display = "flex";  
     
    if (file.name.includes(".zip")){
    const zip = new JSZip();  
      
    zip.loadAsync(file)  
        .then(function(contents) {  
            let objFile = null;  
            let mtlFile = null;  
            let textureFiles = {};  
              
            Object.keys(contents.files).forEach(function(filename) {  
                // Ignorar archivos de la carpeta __MACOSX
                if (filename.startsWith('__MACOSX') || filename.includes('/._')) {
                    return;
                }
                  
                const lowerFileName = filename.toLowerCase();  
                const fileExt = lowerFileName.split('.').pop();  
                  
                if (fileExt === 'obj') {  
                    objFile = contents.files[filename];  
                } else if (fileExt === 'mtl') {  
                    mtlFile = contents.files[filename];  
                } else if (['jpg', 'jpeg', 'png'].includes(fileExt)) {  
                    const baseName = filename.split('/').pop();  
                    textureFiles[baseName] = contents.files[filename];  
                }  
            });  
              
            // Verificar si se encontró el archivo OBJ  
            if (!objFile) {  
                alert("No se encontró ningún archivo OBJ en el ZIP.");  
                fadeOutLoader();  
                return;  
            }
            if (!mtlFile){
                document.getElementById("mtlToggle").style.display = "none";
                console.log("Only OBJ")
            } else {
                document.getElementById("mtlToggle").style.display = "inline";
                console.log("With texture");
            }
              
            // Extraer los archivos  
            const promises = [  
                objFile.async("string"),  
                mtlFile ? mtlFile.async("string") : Promise.resolve(null)  
            ];  
              
            // Extraer todas las texturas  
            const texturePromises = [];  
            const textureDataUrls = {};  
              
            Object.entries(textureFiles).forEach(([name, file]) => {  
                const promise = file.async("base64").then(data => {  
                    const ext = name.split('.').pop().toLowerCase();  
                    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';  
                    textureDataUrls[name] = `data:${mimeType};base64,${data}`;  
                });  
                texturePromises.push(promise);  
            });  
              
            // Esperar a que se extraigan todos los archivos  
            return Promise.all([  
                Promise.all(promises),  
                Promise.all(texturePromises)  
            ]).then(function([[objContent, mtlContent]]) {  
                // Si hay un archivo MTL, modificarlo para usar las texturas extraídas  
                if (mtlContent && Object.keys(textureDataUrls).length > 0) {  
                    // Reemplazar referencias a texturas en el MTL  
                    Object.entries(textureDataUrls).forEach(([name, dataUrl]) => {  
                        const regex = new RegExp(`map_Kd\\s+.*${name.replace(/\./g, '\\.')}`, 'gi');  
                        mtlContent = mtlContent.replace(regex, `map_Kd ${dataUrl}`);  
                    });  
                }  
                  
                // Cargar el modelo  
                loadModelFromStrings(mtlContent, objContent);  
            });  
        })  
        .catch(function(error) {  
            console.error("Error al procesar el archivo ZIP:", error);  
            alert("Error al procesar el archivo ZIP: " + error.message);  
            fadeOutLoader();  
        });
        console.log("Archivo ZIP");
        } else if(file.name.includes(".obj")){
                
                const objLoader = new THREE.OBJLoader();
                objLoader.load(file, (object) => {
                    object.scale.set(1, 1, 1);
                    object.position.set(0, 0, 0);
                    model = object;
                    scene.add(model);
                    adjustCamera(model);
                    fadeOutLoader();
                });
                console.log("Archivo OBJ");
                console.log(file);

        }
    
}

function loadModelFromStrings(mtlString, objString) {  
    // Guardar las strings para poder alternar después
    currentMtlString = mtlString;
    currentObjString = objString;
    
    
    // Si hay un modelo previo, eliminarlo  
    if (model) {  
        scene.remove(model);  
    }  
      
    // Crear un objeto de materiales a partir del string MTL  
    const mtlLoader = new THREE.MTLLoader();  
      
    if (mtlString && mtlEnabled) {  
        // Parsear el string MTL directamente  
        let materials = mtlLoader.parse(mtlString);  
        materials.preload();  
          
        // Crear un objeto a partir del string OBJ  
        const objLoader = new THREE.OBJLoader();  
        objLoader.setMaterials(materials);  
          
        // Parsear el string OBJ directamente  
        const object = objLoader.parse(objString);  
        
        object.scale.set(1, 1, 1);  
        object.position.set(0, 0, 0);  
        model = object;  
        scene.add(model);  
        adjustCamera(model);  
        fadeOutLoader();
        console.log("Modelo cargado con materiales");
    } else {  
        // Cargar solo el objeto sin materiales  
        const objLoader = new THREE.OBJLoader();  
        const object = objLoader.parse(objString);  
        
        // Aplicar material por defecto
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({
                    color: textureColor,
                    side: THREE.DoubleSide
                });
            }
        });
        
        object.scale.set(1, 1, 1);  
        object.position.set(0, 0, 0);  
        model = object;  
        
        scene.add(model);  
        adjustCamera(model);  
        fadeOutLoader();
        console.log("Modelo cargado sin materiales");
    }  
}

function toggleMaterials() {
    mtlEnabled = !mtlEnabled;
    document.getElementById('mtlToggle').textContent = `Texture: ${mtlEnabled ? 'ON' : 'OFF'}`;
    
    let mtlString = currentMtlString;
    let objString = currentObjString;

    // Si hay un modelo previo, eliminarlo  
    if (model) {  
        scene.remove(model);  
    }  
      
    // Crear un objeto de materiales a partir del string MTL  
    const mtlLoader = new THREE.MTLLoader();  
      
    if (mtlString && mtlEnabled) {  
        // Parsear el string MTL directamente  
        let materials = mtlLoader.parse(mtlString);  
        materials.preload();  
          
        // Crear un objeto a partir del string OBJ  
        const objLoader = new THREE.OBJLoader();  
        objLoader.setMaterials(materials);  
          
        // Parsear el string OBJ directamente  
        const object = objLoader.parse(objString);  
        
        //object.scale.set(1, 1, 1);  
        //object.position.set(0, 0, 0);  
        model = object;  
        scene.add(model);  
        //adjustCamera(model);  
        fadeOutLoader();
        console.log("Texturas ON");
        //document.getElementById("changeColorObj").style.display = "none";
    } else {  
        // Cargar solo el objeto sin materiales  
        const objLoader = new THREE.OBJLoader();  
        const object = objLoader.parse(objString);  
        
        // Aplicar material por defecto
        object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.material = new THREE.MeshPhongMaterial({
                    color: textureColor,
                    side: THREE.DoubleSide
                });
            }
        });
        
        //object.scale.set(1, 1, 1);  
        //object.position.set(0, 0, 0);  
        model = object;  
        scene.add(model);  
        //adjustCamera(model);  
        fadeOutLoader();
        console.log("Texturas OFF");

        //document.getElementById("changeColorObj").style.display = "inline";
    }  

}


async function loadFromURL() {
    let url;
    let urlInput = document.getElementById('urlInput');
    
    if (urlInput.value === ""){
        url = urlDefault;
        console.log("IF");
    } else {
        url = urlInput.value.trim();
        console.log("ELSE");
    }
    console.log(url);

    if (!url) {
        alert('Por favor, ingresa una URL válida');
        return;
    }

    document.getElementById("loader").style.opacity = "1";  
    document.getElementById("loader").style.display = "flex";

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al descargar el archivo');
        
        const blob = await response.blob();
        const file = new File([blob], 'model.zip', { type: 'application/zip' });
        
        handleZipFile(file);
    } catch (error) {
        console.error('Error al cargar desde URL:', error);
        alert('Error al cargar el modelo desde la URL: ' + error.message);
        fadeOutLoader();
    }
    urlDefault = "";
}

function showLocalUpload() {
    document.getElementById('localUploadContainer').style.display = 'block';
    document.getElementById('urlUploadContainer').style.display = 'none';
}

function showUrlInput() {
    document.getElementById('urlUploadContainer').style.display = 'block';
    document.getElementById('localUploadContainer').style.display = 'none';
}

function cancelUpload(type) {
    if (type === 'local') {
        document.getElementById('localUploadContainer').style.display = 'none';
        document.getElementById('zipFileInput').value = '';
    } else {
        document.getElementById('urlUploadContainer').style.display = 'none';
        document.getElementById('urlInput').value = '';
    }
}

//--------
function changeColorObj(){
    textureColor = document.getElementById("changeColorObj").style.backgroundColor;
    if(textureColor === color2){
        textureColor = color2;
        document.getElementById("changeColorObj").style.backgroundColor = color1;
    } else {
        textureColor = color1;
        document.getElementById("changeColorObj").style.backgroundColor = color2;
    }
    
    
    // Cargar solo el objeto sin materiales 
    scene.remove(model);
    const objLoader = new THREE.OBJLoader();  
    const object = objLoader.parse(currentObjString);  
    
    // Aplicar material por defecto
    object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshPhongMaterial({
                color: textureColor,
                side: THREE.DoubleSide
            });
        }
    });
    
    //object.scale.set(1, 1, 1);  
    //object.position.set(0, 0, 0);  
    model = object;  
    scene.add(model);  
    //adjustCamera(model);  
    fadeOutLoader();
    console.log("Cambio Color Textura");
}