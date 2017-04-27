class SpaceSimulation {
    constructor(canvasID) {
        let canvas = document.getElementById(canvasID);
        this.engine = new BABYLON.Engine(canvas, true, {stencil: true});
        this.scene = new BABYLON.Scene(this.engine);
        this.spaceBodies = [];
        this.lastFrame = performance.now();
        this.isPaused = false;

        this.engine.displayLoadingUI();
        this.engine.loadingUIText = 'Loading components...';
        this.scene.executeWhenReady(() => this.engine.hideLoadingUI());

        let skySphere = new SkySphere(200000000000000, '/../images/StarField/mw.jpg', this.scene);

        let camera = new BABYLON.ArcRotateCamera('Camera', 0, 0, 0, BABYLON.Vector3.Zero(), this.scene);
        camera.setPosition(new BABYLON.Vector3(0, 20, -25));
        camera.lowerRadiusLimit = 12;
        camera.upperRadiusLimit = 500;
        camera.maxZ = 100000000;
        camera.attachControl(canvas, true);

        window.addEventListener('resize', () => this.engine.resize());

        let sun = new CelestialBody(1000, 695.7, '/../images/simulationAssets/sun.jpg', this.scene, 'star',
                                    'ccw', 0.0005);
        this.spaceBodies.push(sun);

        let earth = new CelestialBody(0, 6.371, '/../images/simulationAssets/earth.jpg', this.scene, 'planet',
                                      'ccw', 0.005, 'ccw', 0.05 , sun);
        this.spaceBodies.push(earth);

        let moon = new CelestialBody(15, 1.737, '/../images/simulationAssets/moon.jpg', this.scene, 'moon',
                                      'ccw', 0.01, 'ccw', 0.09, earth);
        this.spaceBodies.push(moon);

        this.alpha = 0;
    }
    render(){
        this.scene.beforeRender = () => {
            let currFrame = performance.now();
            let deltaT = (currFrame - this.lastFrame) / 100;
            this.lastFrame = currFrame;
            this.alpha += 0.001;

            if(this.isPaused) return;
            _.forEach(this.spaceBodies, (spaceBody) => {
                spaceBody.moveBody(deltaT, this.alpha);
            });
        };

        this.engine.runRenderLoop(() => this.scene.render());
    }
}