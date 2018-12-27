// This code is from discoverthree.com-examples by `looeee` on Github.
const app = new OrbitApp('container')
window.app = app

function createCube() {
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

    return mesh
}

function initMeshes() {
    const cube = createCube()
    app.scene.add(cube)
}

function init() {

    app.init()

    initMeshes();

    app.container.addEventListener('click', () =>
        app.running ? app.stop() : app.start()
    )
    app.start();

}

// call the init function to set everything up
init();