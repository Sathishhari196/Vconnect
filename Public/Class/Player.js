class User {
    constructor(X, Y, Z) {
      const groundMat = new BABYLON.StandardMaterial("groundMat");
      groundMat.diffuseColor = new BABYLON.Color3(7, 1, 0);
      this.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {});
      this.sphere.position.x = X;
      this.sphere.position.y = Y;
      this.sphere.position.z = Z;
      this.sphere.material = groundMat;
    }
  }
  