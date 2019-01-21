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

    // we are using the world positions
    root.updateMatrixWorld(true)

    // TODO: Error checking for arguments

    const generateNodeGeometry = object => {
        // TODO: validation, error checking, convert geometery into buffer

        const nodeGeometry = createNodeGeometry(object)
        nodeGeometry.applyMatrix(object.matrixWorld)

        return nodeGeometry
    }

    // list of all nodes in the tree
    const nodeList = []
    // map object id's to their index in the nodeList
    const idIndexMap = {}
    root.traverse(object => {
        const index = nodeList.push(object) - 1
        idIndexMap[object.id] = index
    })

    // crate a parallel array of bones
    const boneList = nodeList.map(object => {
        const bone = new THREE.Bone()
        bone.userData.parallelId = object.id
        return bone
    })

    // setup parallel relationship tree
    boneList.forEach((bone, index) => {
        const parallelObject = nodeList[index]

        // get parallel object parent
        const parent = parallelObject.parent
        if (!parent)
            return;

        // add bone to parallel parent
        const parentIndex = idIndexMap[parent.id]
        const parentBone = boneList[parentIndex]
        parentBone.add(bone)
    })

    // position bones locally
    boneList.forEach((bone, index) => {
        const object = nodeList[index]
        bone.position.copy(object.position)
    })

    // update global postions
    const rootBoneIndex = idIndexMap[root.id]
    const rootBone = boneList[rootBoneIndex]
    rootBone.updateMatrixWorld()

    // create geometries
    const geometries = nodeList.map(generateNodeGeometry)
    const geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, true)

    const groups = geometry.groups
    const position = geometry.attributes.position

    const skinIndices = []
    const skinWeights = []

    // def. `index`
    // This consists of the "index of each vertex for each triangular face"
    // => index.count / 3 = # of triangles
    // => index[i] = "index of some vertex for some triangle"
    // => now, these things _index_ the attribute arrays.

    // Now, `groups`, partitions `index` into three sections that represent the
    // three separate cubes.

    const groupForAttributeIndex = (() => {

        // A map from from atribute index to any index in `index`.
        // Is not necisarily injective.
        const indexMap = {}
        geometry.getIndex().array.forEach((index, i) => indexMap[index] = i)

        const groupContainsAttributeIndex = (group, i) => {
            const j = indexMap[i]
            return group.start <= j && j < group.start + group.count
        }

        return i => {
            const matches = groups.filter(group => groupContainsAttributeIndex(group, i))
            if (matches.length === 0)
                return null
            else
                return matches[0]
        }
    })()

    // This is the meat.
    const count = geometry.getAttribute('position').count // 72
    for (let i = 0; i < count; i++) {

        const group = groupForAttributeIndex(i)
        const skinIndex = group.materialIndex // index of bone in bones
        const skinWeight = 1

        skinIndices.push(skinIndex, 0, 0, 0)
        skinWeights.push(skinWeight, 0, 0, 0)
    }
    geometry.addAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4))
    geometry.addAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4))

    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        skinning: true
    });
    const mesh = new THREE.SkinnedMesh(geometry, material)

    const skeleton = new THREE.Skeleton(boneList)

    mesh.add(rootBone)
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