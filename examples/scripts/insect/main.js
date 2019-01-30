const app = new OrbitApp('container')
window.app = app

async function initInsect() {
    const path = 'assets/Stick Closed.gltf'
    const importedObject = await load(path)
    // we are trying to import an armature initially,
    // the actual mesh is one of it's children
    const insectMesh = importedObject.getObjectByName('Body')
    return insectMesh
}

async function initGraph() {
    // import the stick bug
    const insect = await initInsect()
    // add to scene
    app.scene.add(insect)
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