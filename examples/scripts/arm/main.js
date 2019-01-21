// This code is from discoverthree.com-examples by `looeee` on Github.
const app = new OrbitApp('container')
window.app = app

class Arm extends THREE.SkinnedMesh {
    constructor(segmentLength = 2, segmentCount = 2, createJointGeometry = () => new THREE.BoxBufferGeometry(1, 1, 1)) {

        const geometry = Arm.createGeometry(createJointGeometry, segmentLength, segmentCount)
        const material = new THREE.MeshBasicMaterial({
            color: 0xffff00
        });
        super(geometry, material)

        // make the armature
        // TODO: use geometry.groups to define the control each bone should have
        const root = new THREE.Bone()
        const skeleton = new THREE.Skeleton([root])

        this.add(root)
        this.bind(skeleton)
    }

    // creates a chain of size segmentCount+1
    static createGeometry(createJointGeometry, segmentLength, segmentCount) {
        const geometries = []
        for (let i = 0; i <= segmentCount; i++) {
            const jointGeometry = createJointGeometry()
            const matrix = new THREE.Matrix4().makeTranslation(0, i * segmentLength, 0)
            jointGeometry.applyMatrix(matrix)
            geometries.push(jointGeometry)
        }
        const geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, true)
        return geometry
    }

}


function initArm() {
    const arm = new Arm()
    return arm
}

function initGraph() {

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

    // test this chain
    app.scene.add(createAutoSkinnedMesh(root))
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