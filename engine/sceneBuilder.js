var sceneBuilder = (function () {

    var t = 0;
    var scene, camera, center;
    var mouse = new THREE.Vector2();
    var raycaster;
    var intersected;
    var demoMode = true;

    function getCenter(model) {
        var maxX = _.max(model.atoms, function (atom) { return atom.position.x; }).position.x;
        var minX = _.min(model.atoms, function (atom) { return atom.position.x; }).position.x;
        var maxY = _.max(model.atoms, function (atom) { return atom.position.y; }).position.y;
        var minY = _.min(model.atoms, function (atom) { return atom.position.y; }).position.y;
        var maxZ = _.max(model.atoms, function (atom) { return atom.position.z; }).position.z;
        var minZ = _.min(model.atoms, function (atom) { return atom.position.z; }).position.z;
        config.cameraPositionScale = _.max([maxX - minX, maxY - minY, maxZ - minZ]) * config.cameraScale;
        return {
            x: (maxX + minX) / 2,
            y: (maxY + minY) / 2,
            z: (maxZ + minZ) / 2
        }
    }

    var light = function (x, y, z) {
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(x, y, z);
        spotLight.castShadow = true;
        spotLight.shadowCameraNear = 500;
        spotLight.shadowCameraFar = 500;
        spotLight.shadowCameraFov = 100;
        scene.add(spotLight);
    }

    function animate() {
        camera.position.x = center.x + (Math.sin(Math.PI * 2 * t) * config.cameraPositionScale);
        camera.position.y = center.y + (Math.cos(Math.PI * 2 * t) * config.cameraPositionScale);
        camera.position.z = center.z + (Math.cos(Math.PI * 2 * t) * config.cameraPositionScale);
        camera.lookAt(center);
        t += 1 / config.timeStep;

        selectedObject();
        renderer.render(scene, camera);

        if (demoMode) {
						setTimeout(function () {
								requestAnimationFrame(animate);
        		}, 1000 / 60);
        }
    }
    

    var selectedObject = function () {
        raycaster.setFromCamera(mouse, camera);    
        var intersects = raycaster.intersectObjects(scene.children);
        var material;
        if (intersects.length > 0) {
            if (intersected != intersects[0].object) {
                if (intersected)
                    intersected.material.color.setHex(intersected.currentHex);
                intersected = intersects[0].object;
                intersected.currentHex = intersected.material.color.getHex();
                intersected.material.color.setHex(0xff0000);
                
                var atom = modelHelper.getAtomByPosition(model, intersected.position);
                if (atom) 
                    console.log(atom);
            }
        } else {
            if (intersected)
                intersected.material.color.setHex(intersected.currentHex);
            intersected = null;
        }
    }

    var mouseMove = function (event) {
        event.preventDefault();
        var divElement = document.getElementById("molecula");
        mouse.x = ((event.clientX - divElement.offsetLeft) / divElement.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - divElement.offsetTop) / divElement.clientHeight) * 2 + 1;
    }

    var renderScene = function (model) {
        raycaster = new THREE.Raycaster();
        scene = new THREE.Scene();
        modelBuilder.getModel(model.atoms, model.connections, scene);
        center = getCenter(model);
        setCamera();
        light(10, 10, 10);
        light(-10, -10, -10);
        light(10, -10, -10);
        light(-10, 10, 10);
        $("#molecula").show();

			  //controls
        controls = new THREE.OrbitControls(camera);
        controls.damping = 0.1;
        controls.addEventListener('change', function () { renderer.render(scene, camera); });

        animate();
    }

    var setCamera = function () {
        camera = new THREE.PerspectiveCamera(45, config.W / config.H, 1, 100);
    }

    return {
        renderScene: renderScene,
        mouseMove: mouseMove
    }
})();