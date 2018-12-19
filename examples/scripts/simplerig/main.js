// This code is from discoverthree.com-examples by `looeee` on Github.
const app = new App('container')
window.app = app

function initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    app.scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(10, 10, 10);

    const backLight = new THREE.DirectionalLight(0xffffff, 1);
    backLight.position.set(-10, 10, -10);

    app.scene.add(frontLight, backLight);
}

function initMeshes() {
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

    // add the mesh to the scene object
    app.scene.add(mesh);
}


async function initModels() {
    const riggedSimple = await load('assets/RiggedSimple.glb')

    const object = riggedSimple.children[0]
    const objectHelper = new THREE.SkeletonHelper(object)
    objectHelper.material.lineWidth = 5
    app.scene.add(objectHelper)

    const skinnedCylinder = riggedSimple.children[1]
    const cylinderHelper = new THREE.SkeletonHelper(skinnedCylinder)
    cylinderHelper.material.lineWidth = 3
    app.scene.add(cylinderHelper)

    app.scene.add(riggedSimple)

    // Wiggle object on axis according to curve.
    const wiggle = (object, axis, curve) => {
        curve = curve ? curve : Math.sin
        axis = axis ? axis : 'x'
        const position = object.position
        const originalPosition = position.clone()
        let acc = 0
        const upper = axis.charAt(0).toUpperCase()
        const lower = upper.charAt(0).toLowerCase()
        return delta => {
            acc += delta
            const modifier = curve(acc)
            position['set' + upper](originalPosition[lower] + modifier)
        }
    }

    skinnedCylinder.userData.onUpdate = (() => {
        const bone = skinnedCylinder.skeleton.bones[1]
        const xWiggle = wiggle(bone)
        const yWiggle = wiggle(bone, 'y', Math.cos)

        return delta => {
            xWiggle(delta)
            yWiggle(delta)
        }
    })()
}

function load(asset) {
    const onProgress = xhr => console.log(`${xhr.loaded/xhr.total*100} % loaded`)

    return new Promise((resolve, reject) => {
        const onLoad = gltf => resolve(gltf.scene.children[0])
        const onError = error => reject(error)
        app.loader.load(asset, onLoad, onProgress, onError);
    })
}


function initHelpers() {
    console.log('Looking for helpers.')
    const children = app.scene.children
}

function init() {

    app.init();

    app.scene.background = new THREE.Color(0x8FBCD4);
    app.camera.position.set(0, 0, 10);
    app.camera.far = 100;
    app.camera.updateProjectionMatrix();

    initLights();
    initMeshes();
    initModels();

    app.start();

    app.container.addEventListener('click', () => {
        app.running ? app.stop() : app.start();
    });
}

// call the init function to set everything up
init();