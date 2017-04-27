class SkySphere {
    constructor(radius, texture, scene) {
        this.body = BABYLON.Mesh.CreateSphere('milkyWay', 0, radius, scene, true, BABYLON.Mesh.BACKSIDE);
        this.body.position = BABYLON.Vector3.Zero();
        let skySphereMaterial = new BABYLON.StandardMaterial('milkyWay', scene);
        skySphereMaterial.backFaceCulling = false;
        skySphereMaterial.diffuseTexture = new BABYLON.Texture(texture, scene);
        skySphereMaterial.specularColor = new BABYLON.Color3.Black();
        this.body.material = skySphereMaterial;
    }
}