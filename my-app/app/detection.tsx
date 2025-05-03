import { View, Text, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';

export default function ObstacleDetectionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setCameraReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission?.status !== 'granted') {
      requestPermission();
    }
  }, [permission]);

  const onCameraReady = () => {
    setCameraReady(true);
    console.log("Camera is ready");
  };

  const handleCaptureAndDetect = async () => {
    if (!cameraRef.current || !isCameraReady || isProcessing) return;
    setIsProcessing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: false });

      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        name: 'frame.jpg',
        type: 'image/jpeg',
      });

      const apiUrl = 'http://192.168.41.27:8000/detect'; // Replace with your IP

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      console.log('Detections:', result.detections);
      setDetections(result.detections);
    } catch (err) {
      console.error('Detection error:', err);
    }

    setIsProcessing(false);
  };

  if (!permission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Requesting permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No camera access</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        facing="back"
        onCameraReady={onCameraReady}
        style={{ flex: 1 }}
      />
      <View style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
      }}>
        <Text style={{ textAlign: 'center' }}>
          {isCameraReady ? 'Scanning for obstacles...' : 'Preparing camera...'}
        </Text>
        <Button title={isProcessing ? 'Processing...' : 'Detect Now'} onPress={handleCaptureAndDetect} />
        {detections.length > 0 && detections.map((d, idx) => (
          <Text key={idx} style={{ fontSize: 14 }}>{d.label} ({(d.confidence * 100).toFixed(1)}%)</Text>
        ))}
      </View>
    </View>
  );
}
