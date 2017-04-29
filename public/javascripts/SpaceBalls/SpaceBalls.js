class SpaceBalls {
    constructor(canvasID) {
        let canvas = document.getElementById(canvasID);
        this.engine = new BABYLON.Engine(canvas, true, {stencil: true});
        this.scene = new BABYLON.Scene(this.engine);
        this.score = new Score();
        this.level = 0;
        this.lastFrame = performance.now();
        this.isPaused = true;

        let skySphere = new SkySphere(2000000000000000000, '/../images/StarField/mw.jpg', this.scene);
        this.music = new BABYLON.Sound("background", "sounds/background.mp3", this.scene, null, { loop: true, autoplay: true});

        this.camera = new BABYLON.FreeCamera('Camera', new BABYLON.Vector3(0, 0, -10), this.scene);
        this.camera.speed = 4;
        this.camera.setTarget(new BABYLON.Vector3(0, 0, 20));
        this.camera.maxZ = 2000000000000000000000;

        this.player = new Player('/../images/gameAssets/player.png', this.scene, this.camera, 0.1);

        window.addEventListener('resize', () => this.engine.resize());
        window.addEventListener('blur', () => {
            this.isPaused = true;
            this.music.pause();
        });
        window.addEventListener("keydown", (e) => {
            if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);
        canvas.addEventListener('click', () => {
            if(this.player.isHit) {
                this.scene.meshes.splice(2, this.scene.meshes.length - 2);
                this.player.resetPosition();
            }
            this.isPaused = false;
            if(this.music.isPaused) {
                this.music.play();
            }
        });

        configEvents(this);

        setInterval(() => {
            if(!this.isPaused && this.player.alive) {
                let minZ = this.camera.position.z + 500,
                    maxZ = this.camera.position.z + 1500,
                    minX = this.camera.position.x - 500,
                    maxX = this.camera.position.x + 500,
                    minY = this.camera.position.y - 300,
                    maxY = this.camera.position.y + 300;

                new Meteor(randomNum(minX, maxX), randomNum(minY, maxY), randomNum(minZ, maxZ),
                    '/../images/gameAssets/meteor1.jpg', this.scene, this.player);
            }
        }, 200);

        this.engine.displayLoadingUI();
        this.engine.loadingUIText = 'Loading components...';
        this.scene.executeWhenReady(() => {
            window.dispatchEvent(new Event('gameLoaded'));
            this.engine.hideLoadingUI();
        });
    }
    render(){
        this.scene.beforeRender = () => {
            let currFrame = performance.now();
            let deltaT = (currFrame - this.lastFrame) / 100;
            this.lastFrame = currFrame;

            if(!this.isPaused) {
                if(this.player.alive) {
                    this.score.increaseScore(deltaT);
                    let fullNumScore = Math.round(this.score.score);
                    if(fullNumScore % 150 === 0 && fullNumScore !== 0) {
                        this.score.score = fullNumScore + 1;
                        window.dispatchEvent(new Event('levelUp'));
                    }
                    this.player.move(deltaT);
                }
                else {
                    window.dispatchEvent(new Event('gameOver'));
                }
            }
        };

        this.engine.runRenderLoop(() => this.scene.render());
    }
    resetGame() {
        this.level = 0;
        this.scene.meshes.splice(2, this.scene.meshes.length);
        this.score.score = 0;
        this.isPaused = true;
        window.dispatchEvent(new Event('reset'));
    }
}
