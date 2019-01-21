// This code is from discoverthree.com-examples by `looeee` on Github.
const app = new OrbitApp('container')
window.app = app

function initArm() {
    // create segments
    const root = new THREE.Object3D()
    const elbow = new THREE.Object3D()
    const hand = new THREE.Object3D()

    // setup relationships
    root.add(elbow)
    elbow.add(hand)

    // setup positioning via local transforms
    root.position.setY(0)
    elbow.position.setY(2)
    hand.position.setY(2)

    const arm = createAutoSkinnedMesh(root)
    return arm
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