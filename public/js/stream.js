
//Which media to stream
const constraints = window.constraints = {
  audio: true,
  video: false
};
    
navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      //Audio will be played to user itself
      //var bjsSound = new BABYLON.Sound("mic", stream, scene); 
      //bjsSound.play();

      console.log('Got MediaStream:', stream);

      const icsconfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
      };

      const signaler = new SignalingChannel();
      const peerConnection = new RTCPeerConnection(icsconfig);

      // Add the audio track to the peer connection
        Stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, Stream);
        });

      // Create an offer and set it as the local description
      peerConnection.createOffer()
      .then(offer => {
        peerConnection.setLocalDescription(offer);
       
      });

    })
    .catch(error => {
      console.error('Error accessing media devices.', error);
    });

    