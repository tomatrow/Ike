// This code is from discoverthree.com-examples by `looeee` on Github.
const app = new OrbitApp('container')
window.app = app

function createCube(radius = 1) {
    return new THREE.Mesh()
}

/* Crates an Arm with `segmentCount+1` joints.
 * The start is the _base_ and the end is the _tip_.
 */
function createArm(segmentLength = 2, segmentCount = 2) {
    return new THREE.Object3D()
}

/* Creates an easily recognizable skinned arm.
 * Each joint has a bone. The object graph is: root -> [skeleton,cubes]
 * where |skeleton| == |cubes|.
 * createJoint is (radius: Int) -> Mesh
 */
function initArm(createJoint = createCube) {
    return new THREE.Object3D()
}

function initGraph() {
    const arm = initArm()
    app.scene.add(arm)
}

function init() {

    app.init();

    initGraph()

    app.container.addEventListener('click', () => {
        app.running ? app.stop() : app.start();
    });

    app.start();
}

// call the init function to set everything up
init();