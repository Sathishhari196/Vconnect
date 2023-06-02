const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
scene.collisionsEnabled = true;

// Camera
const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 40, BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);

// Light
const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity = 0.7;



scene.clearColor = new BABYLON.Color3(0.75, 0.89, 0.92, 0.84);

BABYLON.SceneLoader.ImportMesh("", "./Assets/", "floor.glb", BABYLON.scene, function (newMeshe, particleSystems, skeletons, animationGroups) {
var sales = newMeshe[0];
sales.position = new BABYLON.Vector3(0,0,0);
sales.scaling = new BABYLON.Vector3(14,14,14);
 });

 BABYLON.SceneLoader.ImportMesh("", "./Assets/", "Tree.glb", BABYLON.scene, function (newMeshe, particleSystems, skeletons, animationGroups) {
  var sales = newMeshe[0];
  sales.position = new BABYLON.Vector3(0,9,40);
  sales.scaling = new BABYLON.Vector3(7,7,7);
   });

   BABYLON.SceneLoader.ImportMesh("", "./Assets/", "Tree.glb", BABYLON.scene, function (newMeshe, particleSystems, skeletons, animationGroups) {
    var sales = newMeshe[0];
    sales.position = new BABYLON.Vector3(50,14,40);
    sales.scaling = new BABYLON.Vector3(7,7,7);
     });

     BABYLON.SceneLoader.ImportMesh("", "./Assets/", "Tree.glb", BABYLON.scene, function (newMeshe, particleSystems, skeletons, animationGroups) {
      var sales = newMeshe[0];
      sales.position = new BABYLON.Vector3(-50,14,40);
      sales.scaling = new BABYLON.Vector3(7,7,7);
       });

       BABYLON.SceneLoader.ImportMesh("", "./Assets/", "Tree.glb", BABYLON.scene, function (newMeshe, particleSystems, skeletons, animationGroups) {
        var sales = newMeshe[0];
        sales.position = new BABYLON.Vector3(-50,14,-40);
        sales.scaling = new BABYLON.Vector3(7,7,7);
         });
      
         BABYLON.SceneLoader.ImportMesh("", "./Assets/", "Queen Palm Tree.glb", BABYLON.scene, function (newMeshe, particleSystems, skeletons, animationGroups) {
          var sales = newMeshe[0];
          sales.position = new BABYLON.Vector3(-30,0,-40);
          sales.scaling = new BABYLON.Vector3(1,1,1);
           });

           BABYLON.SceneLoader.ImportMesh("", "./Assets/", "Rock.glb", BABYLON.scene, function (newMeshe, particleSystems, skeletons, animationGroups) {
            var sales = newMeshe[0];
            sales.position = new BABYLON.Vector3(20,1,30);
            sales.scaling = new BABYLON.Vector3(10,10,10);
             });

// 3D asset
const createSphere = (X, Y, Z) => {
  const groundMat = new BABYLON.StandardMaterial("groundMat");
  groundMat.diffuseColor = new BABYLON.Color3(7, 1, 0);
  
  const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {}, scene);
  sphere.position = new BABYLON.Vector3(X, Y, Z);
  sphere.material = groundMat;
  // BABYLON.SceneLoader.ImportMesh("", "./Assets/", "Man_idle.glb", BABYLON.scene, function (newMeshe, particleSystems, skeletons, animationGroups) {
  // var sphere = newMeshe[0];
  // sphere.position = new BABYLON.Vector3(X,Y,Z);
  // sphere.scaling = new BABYLON.Vector3(1,1,1);
  //  });
  return sphere;
};

const frontEndPlayers = {};

// Received from server side
socket.on('updateUsers', (backEndUsers) => {
  for (const id in backEndUsers) {
    const backEndPlayer = backEndUsers[id];
    
    if (!frontEndPlayers[id]) {
      frontEndPlayers[id] = createSphere(backEndPlayer.x, backEndPlayer.y, backEndPlayer.z);
    } else {
      // Update the position of the existing front-end player mesh
      const frontEndPlayer = frontEndPlayers[id];
      frontEndPlayer.position.x = backEndPlayer.x;
      frontEndPlayer.position.y = backEndPlayer.y;
      frontEndPlayer.position.z = backEndPlayer.z;
    }
  }

  for (const id in frontEndPlayers) {
    if (!backEndUsers[id]) {
      frontEndPlayers[id].dispose();
      delete frontEndPlayers[id];
    }
  }

  changeCurrentUserColor();
});

// Keyboard event listener
scene.onKeyboardObservable.add((kbInfo) => {
  const currentUser = frontEndPlayers[socket.id]; // Declare currentUser outside the switch statement
  if (!currentUser) return;

  switch (kbInfo.type) {
    case BABYLON.KeyboardEventTypes.KEYDOWN:
      switch (kbInfo.event.key) {
        case "a":
        case "A":
          currentUser.position.x -= 0.3;
          socket.emit("updatePosition", {
            x: currentUser.position.x,
            y: currentUser.position.y,
            z: currentUser.position.z,
          });
          break;
        case "d":
        case "D":
          currentUser.position.x += 0.3;
          socket.emit("updatePosition", {
            x: currentUser.position.x,
            y: currentUser.position.y,
            z: currentUser.position.z,
          });
          break;
        case "w":
        case "W":
          currentUser.position.z += 0.3;
          socket.emit("updatePosition", {
            x: currentUser.position.x,
            y: currentUser.position.y,
            z: currentUser.position.z,
          });
          break;
        case "s":
        case "S":
          currentUser.position.z -= 0.3;
          socket.emit("updatePosition", {
            x: currentUser.position.x,
            y: currentUser.position.y,
            z: currentUser.position.z,
          });
          break;
      }
      break;
  }
});

function changeCurrentUserColor() {
  const currentUser = frontEndPlayers[socket.id];
  if (currentUser) {
    const groundMat = currentUser.material;
    groundMat.diffuseColor = new BABYLON.Color3(0.22, 0.81, 0.32);
  }
}

engine.runRenderLoop(() => {
  scene.render();
  const currentUserSphere = frontEndPlayers[socket.id];

  if (currentUserSphere) {
    camera.setTarget(currentUserSphere.position);
  }
});

function frontenduser() {
  for (const id in frontEndPlayers) {
    const frontEndPlayer = frontEndPlayers[id];
    // Update the position of the existing front-end player mesh
    const backEndPlayer = backEndUsers[id];
    frontEndPlayer.position.x = backEndPlayer.x;
    frontEndPlayer.position.y = backEndPlayer.y;
    frontEndPlayer.position.z = backEndPlayer.z;
  }
}

frontenduser();

function avatar(X,Y,Z){

BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "HVGirl.glb", BABYLON.scene, function (newMeshe, particleSystems, skeletons, animationGroups) {
var sales = newMeshe[0];
sales.position = new BABYLON.Vector3(X,Y,Z);
sales.scaling = new BABYLON.Vector3(0.2,0.2,0.2);
 });

}

//   avatar()

