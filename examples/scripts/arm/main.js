// This code is from discoverthree.com-examples by `looeee` on Github.
const app = new App('container')
window.app = app

function initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    app.scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(10, 10, 10);

    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(-10, 10, -10);

    app.scene.add(frontLight, backLight);
}

function initMeshes() {
    // create a geometry
    const geometry = new THREE.BoxBufferGeometry(2, 2, 2);

    // create a purple Standard material
    const material = new THREE.MeshStandardMaterial({
        color: 0x800080
    });

    // create a Mesh containing the geometry and material
    const mesh = new THREE.Mesh(geometry, material);

    // increase the mesh's rotation each frame
    mesh.userData.onUpdate = () => {
        mesh.rotation.z += 0.01;
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
    }

    // add the mesh to the scene object
    app.scene.add(mesh);
}

function init() {

    app.init();

    app.scene.background = new THREE.Color(0x8FBCD4);
    app.camera.position.set(0, 0, 10);
    app.camera.far = 100;
    app.camera.updateProjectionMatrix();

    initLights();
    initMeshes();

    app.start();

    app.container.addEventListener('click', () => {
        app.running ? app.stop() : app.start();
    });
}

// call the init function to set everything up
init();