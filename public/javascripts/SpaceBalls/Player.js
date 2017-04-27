class Player {
    constructor(texture, scene, camera, rotSpeed){
        this.body = BABYLON.Mesh.CreateSphere('player', 0, 1, scene);
        this.body.position = BABYLON.Vector3.Zero();
        let material = new BABYLON.StandardMaterial(name + 'Surface', scene);
        material.diffuseTexture = new BABYLON.Texture(texture, scene);
        this.body.material = material;
        this.body.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        this.body.material.specularColor = new BABYLON.Color3(0, 0, 0);

        this.camera = camera;
        this.rotSpeed =  -rotSpeed;

        this.light = new BABYLON.PointLight('Omni0', new BABYLON.Vector3(20, 0, 0), scene);
        this.light.diffuse = new BABYLON.Color3(1, 1, 1);
        this.glow = new BABYLON.HighlightLayer('starGlow', scene);
        this.glow.addMesh(this.body, BABYLON.Color3.White());

        this.isHit = false;
        this.alive = true;
        this.lives = 3;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.speed = 40;
        this.maneurSpeed = 40;
    }
    move(deltaT){
        if(this.moveRight) {
            this.body.position.x += this.maneurSpeed * deltaT;
            this.camera.position.x += this.maneurSpeed * deltaT;
        }
        if(this.moveLeft) {
            this.body.position.x -= this.maneurSpeed * deltaT;
            this.camera.position.x -= this.maneurSpeed * deltaT;
        }
        if(this.moveUp) {
            this.body.position.y += this.maneurSpeed * deltaT;
            this.camera.position.y += this.maneurSpeed * deltaT;
        }
        if(this.moveDown) {
            this.body.position.y -= this.maneurSpeed * deltaT;
            this.camera.position.y -= this.maneurSpeed * deltaT;
        }

        this.body.position.z += this.speed *  deltaT;
        this.camera.position.z += this.speed *  deltaT;
        this.body.rotation.y += this.rotSpeed * deltaT;
    }
    getHit() {
        this.lives -= 1;
        this.isHit = true;
        window.dispatchEvent(new Event('decrementLives'));
        if(this.lives <= 0) {
            this.alive = false;
        }
    }
    resetPosition() {
        this.isHit = false;
        this.body.position = BABYLON.Vector3.Zero();
        this.camera.position = new BABYLON.Vector3(0, 0, -10);
    }
    levelUp(level) {
        this.lives += 1;
        this.speed = 40 + 10 * level;
        this.maneurSpeed = 40 + 0.5 * level;
    }
    resetDefault() {
        this.isHit = false;
        this.resetPosition();
        this.alive = true;
        this.lives = 3;
        this.speed = 40;
        this.maneurSpeed = 40;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
    }
}
