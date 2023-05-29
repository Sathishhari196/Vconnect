//Instance of socket
var socket = io();   
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);
//Camera
const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 40, BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);
const axes = new BABYLON.AxesViewer(scene, 2); 
//Light
var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
light.intensity=0.7;
//Floor
const groundMat = new BABYLON.StandardMaterial("groundMat");
groundMat.diffuseColor = new BABYLON.Color3(0.64, 0.64, 0.57, 0.35);

const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:150, height:150},scene);
ground.material = groundMat;

scene.clearColor =new BABYLON.Color3(0.75, 0.89, 0.92, 0.84);

//3D aaset
var createbox=(X,Y,Z)=>{
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(7, 1, 0)
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {});
    sphere.position.x=X;
    sphere.position.y=Y;
    sphere.position.z=Z;
    sphere.material = groundMat; 
       
    
return sphere;     
}

const frontEndPlayers = {}
//Received from server side
socket.on('updateUsers', (backEndUsers) => {
    for (const id in backEndUsers) {
        const backEndPlayer = backEndUsers[id]
        if (!frontEndPlayers[id]) {
            frontEndPlayers[id] = createbox(backEndPlayer.x,backEndPlayer.y,backEndPlayer.z);
        }else {
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
            delete frontEndPlayers[id]
        } 
    }
    console.log(frontEndPlayers); 
    changeCurrentUserColor(); 
         
})

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

//const sceneToRender = createScene()
engine.runRenderLoop(function () {
    scene.render();
    
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

frontenduser()

// function avatar(X,Y,Z){

//   BABYLON.SceneLoader.ImportMesh("", "https://assets.babylonjs.com/meshes/", "HVGirl.glb", BABYLON.scene, function (newMeshe, particleSystems, skeletons, animationGroups) {
//   var sales = newMeshe[0];
//   sales.position = new BABYLON.Vector3(X,Y,Z);
//   sales.scaling = new BABYLON.Vector3(0.2,0.2,0.2);
//   });

// }

//   avatar()

