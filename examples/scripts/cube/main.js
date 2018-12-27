// This code is from discoverthree.com-examples by `looeee` on Github.
const app = new OrbitApp('container')
window.app = app

function createCube() {
    // make a new skeleton
    const skeleton = new THREE.Skeleton([new THREE.Bone()])

    // create a geometry
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)

    // rig it
    const constantIndex = () => [0]
    const constantWeight = () => 1
    rig(cubeGeometry, skeleton.bones, constantIndex, constantWeight)
    const cubeBufferGeometry = new THREE.BufferGeometry().fromGeometry(cubeGeometry)

    // create a purple Standard material
    const material = new THREE.MeshStandardMaterial({
        color: 0x800080,
        skinning: true
    });

    // create a Mesh containing the geometry and material
    const cube = new THREE.SkinnedMesh(cubeBufferGeometry, material);

    // apply rig
    cube.add(skeleton.bones[0]) // add root
    cube.bind(skeleton)

    return cube
}

function initCube() {
    // create the cube in shape and form
    const cube = createCube()

    // rotate it on update
    const root = cube.skeleton.bones[0]
    root.userData.onUpdate = () => {
        root.rotation.z += 0.01;
        root.rotation.x += 0.01;
        root.rotation.y += 0.01;
    }

    // add to scene
    app.scene.add(cube)
}

function initMeshes() {
    initCube()
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