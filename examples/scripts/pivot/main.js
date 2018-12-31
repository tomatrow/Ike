// This code is from discoverthree.com-examples by `looeee` on Github.
const app = new OrbitApp('container')
window.app = app

/* Concerning `initThing` vs `createThing`:
    create* is for the minimum amount of setup to add it to the object graph
    init* is for everything else, e.g. behavior.*/

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

function createPivot() {
    const sphereGeometry = new THREE.SphereGeometry()
    const material = new THREE.MeshStandardMaterial({
        color: 0xffff00
    })
    const sphere = new THREE.Mesh(sphereGeometry, material)
    return sphere
}

function initCube() {
    // create the cube in shape and form
    const cube = createCube()
    return cube
}

function initPivot() {
    const pivot = createPivot()

    // rotate it on update
    pivot.userData.onUpdate = () => {
        pivot.rotation.z += 0.01;
        pivot.rotation.x += 0.01;
        pivot.rotation.y += 0.01;
    }

    return pivot
}

function initGraph() {
    // cube diameter is 2
    const cube = initCube()
    cube.position.setX(2)
    const pivot = initPivot()

    pivot.add(cube)
    app.scene.add(pivot)
}

function init() {

    app.init()

    initGraph();

    app.container.addEventListener('click', () =>
        app.running ? app.stop() : app.start()
    )
    app.start();

}

// call the init function to set everything up
init();