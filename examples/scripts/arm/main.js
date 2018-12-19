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

function initMeshes() {}

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