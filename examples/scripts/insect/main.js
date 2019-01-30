const app = new OrbitApp('container')
window.app = app

function initGraph() {}

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