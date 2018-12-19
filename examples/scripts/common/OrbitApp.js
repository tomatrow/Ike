class OrbitApp extends App {

    constructor(containerID) {
        super(containerID)

    }

    init() {
        super.init()

        this.initLights()
        this.positionCamera()
    }

    initLights() {
        const color = 0xffffff
        const directionalLight = (...coords) => {
            const light = new THREE.DirectionalLight(color, 1)
            light.position.set(...coords)
            return light
        }

        this.light = {
            front: directionalLight(10, 10, 10),
            back: directionalLight(-10, 10, -10),
            ambient: new THREE.AmbientLight(color, 1)
        }

        const lights = Object.values(this.light)
        this.scene.add(...lights);
    }

    positionCamera() {
        this.scene.background = new THREE.Color(0x8FBCD4);
        this.camera.position.set(0, 0, 10);
        this.camera.far = 100;
        this.camera.updateProjectionMatrix();
    }

}