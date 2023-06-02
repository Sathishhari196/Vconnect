let localStream, remoteStream;

// Media constraints
const constraints = {
  audio: true,
  video: false
};

navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    console.log('Got MediaStream:', stream);
    localStream = stream;

    const iceConfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };

    const peerConnection = new RTCPeerConnection(iceConfig);
   
    // Add the audio track to the peer connection
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Listen for ICE candidates
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        console.log('Got ICE candidate:', event.candidate);
        socket.emit('ice-candidate', event.candidate);
      } else {
        console.log('ICE candidate not gathered');
      }
    };

    // Listen for the negotiationneeded event
    peerConnection.onnegotiationneeded = () => {
      // Create an offer and set it as the local description
      peerConnection.createOffer()
        .then(offer => {
          peerConnection.setLocalDescription(offer);
          console.log('Got offer:', offer);
          socket.emit('offer', offer);
        });
    };

    // Listen for incoming tracks
    peerConnection.ontrack = event => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
    };

  
    // Listen for incoming messages from the remote user
    socket.on('offer', data => {
      // If the message is an offer, create an answer and send it to the remote user
      if (data.type === 'offer') {
        const answer = peerConnection.createAnswer();
        peerConnection.setLocalDescription(answer);
        socket.emit('answer', answer);
      } else if (data.type === 'candidate') {
        // If the message is a candidate, add it to the peer connection
        peerConnection.addIceCandidate(data.candidate);
      }
    });

   










  })
  .catch(error => {
    console.error('Error accessing media devices.', error);
  });
