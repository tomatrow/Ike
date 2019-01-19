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

/* Generates a skinned mesh based on an object graph
 * @param root The root node of the graph
 * @param createNodeGeometry Makes a geometry based on an object in the graph.
 *        Internally, this is always converted to a buffer geometry.
 * @return A Skinnedmesh isomorphic to the graph so that each node has a
 *         geometry provided by the factory function.
 */
function createAutoSkinnedMesh(
    root = new THREE.Object3D(),
    createNodeGeometry = object => new THREE.BoxBufferGeometry(1, 1, 1)
) {
    // TODO: Error checking for arguments
    const geometries = []

    const generateNodeGeometry = object => {
        // TODO: check nodeGeometry for nilness, is a grwomtry, transform it
        //       into a buffer geometry

        // create a node at the objects location
        const nodeGeometry = createNodeGeometry(object)

        // We mirror positions in the real world
        nodeGeometry.applyMatrix(object.matrixWorld)

        // save it
        geometries.push(nodeGeometry)
    }

    const generateNodeBone = object => {
        // TODO: Actually implement this
    }
    const work = object => {
        generateNodeGeometry(object)
        generateNodeBone(object)
    }
    root.traverse(work);

    // let's see hoe I can get vertex groups from mergeBufferGeometries
    // So, each geometry in geometries is mapped to a _group_ where the index of
    // of the geometry is preserved in a property called `materialIndex` on the
    // group. E.g. `geometries`, `geometry.groups` are paraelle.

    // So, maybe I should do the following:
    // (1) flatten the object tree into `objects`
    // (2) make a dict if "id of object" -> "index in objects"
    // (3) create `geometry` from `objects` // now groups
    // (4) given a `object` in `objects`
    //     (a) create a bone at the same positon as object in world
    //     (b) asssociate verticies from paraelle group in `geometry.groups`
    //     (b) parent bone to boneOf(object.parent)
    const geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, true)
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });
    const mesh = new THREE.SkinnedMesh(geometry, material)

    // TODO: Create a skeleton and apply it
    const bone = new THREE.Bone()
    const skeleton = new THREE.Skeleton([bone])

    mesh.add(root)
    mesh.bind(skeleton)

    return mesh
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

    // apply the changes we made in the local matricies to the world ones
    root.updateMatrixWorld()

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