const app = new OrbitApp('container')
window.app = app

async function initInsect() {
    const path = 'assets/Stick Closed.glb' //'assets/Stick Closed.gltf'
    const importedObject = await load(path)
    // we are trying to import an armature initially,
    // the actual mesh is one of it's children
    const insectMesh = importedObject.getObjectByName('Body')
    return insectMesh
}

async function initGraph() {
    // import the stick bug
    const insect = await initInsect()
    const rootObject = new THREE.Object3D()
    const geometryMap = () => insect.geometry
    const skinnedMesh = createAutoSkinnedMesh(rootObject, geometryMap)
    // add to scene
    app.scene.add(skinnedMesh)
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