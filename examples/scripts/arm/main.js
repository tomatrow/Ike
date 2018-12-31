// This code is from discoverthree.com-examples by `looeee` on Github.
const app = new OrbitApp('container')
window.app = app

function initMeshes() {}

function init() {

    app.init();

    app.container.addEventListener('click', () => {
        app.running ? app.stop() : app.start();
    });

    app.start();
}

// call the init function to set everything up
init();