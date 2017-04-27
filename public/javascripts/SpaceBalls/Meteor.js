class Meteor {
    constructor(positionX, positionY, positionZ, texture, scene, player) {
        this.body = BABYLON.Mesh.CreateSphere('meteor', 0, randomNum(50, 150), scene);
        this.body.position = new BABYLON.Vector3(positionX, positionY, positionZ);
        let material = new BABYLON.StandardMaterial(name + 'Surface', scene);
        material.diffuseTexture = new BABYLON.Texture(texture, scene);
        this.body.material = material;
        this.body.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        this.body.material.specularColor = new BABYLON.Color3(0, 0, 0);


        this.body.actionManager = new BABYLON.ActionManager(scene);
        let trigger = {trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: player.body};
        let hitPlayer = new BABYLON.ExecuteCodeAction(trigger, (e) => {
            player.getHit();
        });
        this.body.actionManager.registerAction(hitPlayer);
    }
}