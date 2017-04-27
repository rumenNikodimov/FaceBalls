class CelestialBody {
    constructor(positionX, radius, texture, scene, type, rotDir, rotSpeed, orbitDir, orbitSpeed, orbitsAround) {
        this.body = BABYLON.Mesh.CreateSphere('celestialBody' + type /*yes, this is correct*/, 0, radius, scene);
        this.body.position = new BABYLON.Vector3(positionX, 0, 0);
        let material = new BABYLON.StandardMaterial(name + 'Surface', scene);
        material.diffuseTexture = new BABYLON.Texture(texture, scene);
        this.body.material = material;
        this.body.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        this.body.material.specularColor = new BABYLON.Color3(0, 0, 0);
        /* if(orbitsAround) {
            this.body.parent = orbitsAround.body;
        } */

        this.rotSpeed = (rotDir === 'cw') ? -rotSpeed : rotSpeed;

        this.orbitsAround = orbitsAround;
        this.orbitSpeed = (orbitDir === 'cw') ? -orbitSpeed : orbitSpeed;
        this.radius = radius;
        this.type = type;

        if(type === 'star') {
            this.light = new BABYLON.PointLight('Omni0', new BABYLON.Vector3(20, 0, 0), scene);
            this.light.diffuse = new BABYLON.Color3(1, 1, 1);
            this.glow = new BABYLON.HighlightLayer('starGlow', scene);
            this.glow.addMesh(this.body, BABYLON.Color3.White()); //first argument takes the name property of the argument mesh
        }
    }
    moveBody(deltaT, alpha){
       if(this.orbitsAround) {

        }

        if(this.type === 'star') {
            this.glow.blurHorizontalSize = 2 + Math.cos(alpha) * 0.6;
            this.glow.blurVerticalSize = 2 + Math.sin(alpha / 3) * 0.6;
        }
        this.body.rotation.y += this.rotSpeed * deltaT;

    }
}