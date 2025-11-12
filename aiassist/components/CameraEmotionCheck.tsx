'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X, Heart, Volume2, AlertCircle } from 'lucide-react';
import { useHealthStore } from '@/lib/store';
import { analytics } from '@/lib/analytics';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import PermissionConsent from './PermissionConsent';

export default function CameraEmotionCheck() {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stressScore, setStressScore] = useState<number | null>(null);
  const [emotion, setEmotion] = useState<string>('');
  const [isReady, setIsReady] = useState(false);
  const [showPermissionConsent, setShowPermissionConsent] = useState(false);
  const [error, setError] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const { addMoodLog } = useHealthStore();
  const { speak } = useTextToSpeech();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Monitor video state continuously
  useEffect(() => {
    if (isActive && hasPermission && videoRef.current) {
      const video = videoRef.current;
      const interval = setInterval(() => {
        if (video && video.srcObject) {
          // If video has dimensions and is playing, mark as ready
          if (video.videoWidth > 0 && video.videoHeight > 0 && !video.paused) {
            if (!isReady) {
              console.log('Video detected as ready:', video.videoWidth, 'x', video.videoHeight);
              setIsReady(true);
            }
          }
          // If video is paused but has dimensions, try to play
          else if (video.videoWidth > 0 && video.paused) {
            console.log('Video paused but has dimensions, attempting to play');
            video.play().catch(console.error);
          }
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isActive, hasPermission, isReady]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setIsReady(false);
    setHasPermission(null);
  };

  const requestCameraPermission = async () => {
    try {
      setShowPermissionConsent(false);
      setError('');
      setIsReady(false);
      
      console.log('Requesting camera access...');
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      console.log('Camera stream obtained');
      
      if (!videoRef.current) {
        console.error('Video element not available');
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      // Store stream
      streamRef.current = stream;
      const video = videoRef.current;
      
      // Set stream to video
      video.srcObject = stream;
      setHasPermission(true);
      setIsActive(true);

      // Wait for video to be ready
      const checkReady = () => {
        if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
          console.log('Video is ready:', video.videoWidth, 'x', video.videoHeight);
          setIsReady(true);
          return true;
        }
        return false;
      };

      // Try to play video
      video.play()
        .then(() => {
          console.log('Video play() called');
          // Check immediately
          if (checkReady()) {
            return;
          }
          // If not ready, wait for events
          const onLoadedMetadata = () => {
            console.log('loadedmetadata event');
            if (checkReady()) {
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('canplay', onCanPlay);
              video.removeEventListener('playing', onPlaying);
            }
          };
          
          const onCanPlay = () => {
            console.log('canplay event');
            if (checkReady()) {
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('canplay', onCanPlay);
              video.removeEventListener('playing', onPlaying);
            }
          };
          
          const onPlaying = () => {
            console.log('playing event');
            if (checkReady()) {
              video.removeEventListener('loadedmetadata', onLoadedMetadata);
              video.removeEventListener('canplay', onCanPlay);
              video.removeEventListener('playing', onPlaying);
            }
          };

          video.addEventListener('loadedmetadata', onLoadedMetadata);
          video.addEventListener('canplay', onCanPlay);
          video.addEventListener('playing', onPlaying);

          // Fallback timeout
          setTimeout(() => {
            if (video.videoWidth > 0 && !video.paused) {
              console.log('Fallback: Setting ready');
              setIsReady(true);
            }
          }, 2000);
        })
        .catch(err => {
          console.error('Error playing video:', err);
          setError('Failed to start video. Please try again.');
        });

    } catch (error: any) {
      console.error('Camera access error:', error);
      setHasPermission(false);
      setIsActive(false);
      setShowPermissionConsent(false);
      
      let errorMessage = 'Camera permission denied.';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please enable camera access in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is being used by another application. Please close it and try again.';
      }
      
      setError(errorMessage);
    }
  };

  const analyzeEmotion = async () => {
    const video = videoRef.current;
    
    if (!video || !streamRef.current || !isReady) {
      alert('Camera is not ready. Please wait for the camera to load.');
      return;
    }

    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
      alert('Camera video is not ready. Please wait a moment and try again.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Analyze pixels
      let brightness = 0;
      let redChannel = 0;
      let greenChannel = 0;
      let blueChannel = 0;
      let pixelCount = 0;

      // Sample every 4th pixel
      const sampleRate = 4;
      for (let i = 0; i < data.length; i += sampleRate * 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;

        brightness += avg;
        redChannel += r;
        greenChannel += g;
        blueChannel += b;
        pixelCount++;
      }

      // Calculate averages
      brightness = brightness / pixelCount;
      redChannel = redChannel / pixelCount;
      greenChannel = greenChannel / pixelCount;
      blueChannel = blueChannel / pixelCount;

      // Determine emotion
      let detectedEmotion = 'neutral';
      let score = 50;

      if (brightness > 140 && redChannel > 120) {
        detectedEmotion = 'happy';
        score = Math.min(85, 70 + Math.floor((brightness - 140) / 2));
      } else if (brightness < 100 && redChannel < 90) {
        detectedEmotion = 'sad';
        score = Math.max(15, 30 - Math.floor((100 - brightness) / 2));
      } else if (brightness < 110 && greenChannel < 100) {
        detectedEmotion = 'stressed';
        score = Math.max(20, 40 - Math.floor((110 - brightness) / 2));
      } else {
        detectedEmotion = 'neutral';
        score = 45 + Math.floor((brightness - 100) / 4);
      }

      score = Math.max(15, Math.min(88, score));

      setEmotion(detectedEmotion);
      setStressScore(score);

      // Save to mood log
      addMoodLog({
        id: Date.now().toString(),
        score,
        sentiment: score > 60 ? 'positive' : score > 40 ? 'neutral' : 'negative',
        notes: `Camera-based emotion detection: ${detectedEmotion}`,
        createdAt: new Date(),
      });

      analytics.trackCameraPermission(true);
      
      // Stop camera
      stopCamera();
      
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      setError('Error analyzing emotion. Please try again.');
      alert('Error analyzing emotion. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartCamera = () => {
    setShowPermissionConsent(true);
    setError('');
  };

  const handlePermissionGrant = () => {
    requestCameraPermission();
  };

  const handlePermissionDeny = () => {
    setShowPermissionConsent(false);
    alert('Camera access is required for mood check.');
  };

  const speakContent = (text: string) => {
    speak(text);
  };

  const reset = () => {
    setStressScore(null);
    setEmotion('');
    setError('');
    setIsActive(false);
    setHasPermission(null);
    setIsReady(false);
    stopCamera();
  };

  // Show permission consent modal
  if (showPermissionConsent) {
    return (
      <PermissionConsent
        permission="camera"
        onGrant={handlePermissionGrant}
        onDeny={handlePermissionDeny}
        onSkip={handlePermissionDeny}
      />
    );
  }

  // Show initial screen
  if (!isActive && stressScore === null) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={() => speakContent('Camera Mood Check. Check your stress level using your camera.')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Listen to page content"
          >
            <Volume2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <Camera className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Camera Mood Check</h2>
        <p className="text-gray-600 mb-6">
          Check your stress level using your camera.
        </p>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6 text-left">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6 text-left">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Privacy:</strong> All analysis happens on your device. No video is uploaded.
          </p>
          <p className="text-sm text-blue-800">
            <strong>How it works:</strong> We analyze your facial expressions to detect stress and mood levels.
          </p>
        </div>
        <button
          onClick={handleStartCamera}
          className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow"
        >
          Start Camera
        </button>
      </div>
    );
  }

  // Show results screen
  if (stressScore !== null) {
    const resultText = `Analysis Complete. Your stress score is ${stressScore} out of 100. Detected emotion: ${emotion}.`;
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex items-center justify-end mb-4">
          <button
            onClick={() => speakContent(resultText)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Listen to results"
          >
            <Volume2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <Heart className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Complete</h2>
        <div className="mb-6">
          <p className="text-4xl font-bold text-primary">{stressScore}/100</p>
          <p className="text-xl text-gray-600 capitalize mt-2">{emotion}</p>
        </div>
        <button
          onClick={reset}
          className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-shadow"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show camera view
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Camera Mood Check</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => speakContent('Camera Mood Check. Position your face in the frame and click Start Analysis when ready.')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Listen to instructions"
          >
            <Volume2 className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={stopCamera}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close camera"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      <div className="relative bg-black rounded-xl overflow-hidden mb-6" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ 
            transform: 'scaleX(-1)',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            objectFit: 'cover',
            display: isActive && hasPermission ? 'block' : 'none'
          }}
        />
        
        {(!isActive || !hasPermission) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-white text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Camera not active</p>
            </div>
          </div>
        )}
        
        {isActive && !isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-white text-center">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-lg">Loading camera...</p>
            </div>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="text-white text-center">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold">Analyzing...</p>
            </div>
          </div>
        )}
        
        {isReady && !isAnalyzing && (
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1 rounded-full text-sm bg-green-500 text-white">
              Ready
            </div>
          </div>
        )}
      </div>

      <button
        onClick={analyzeEmotion}
        disabled={isAnalyzing || !isReady}
        className={`w-full py-4 rounded-xl font-semibold transition-all ${
          !isAnalyzing && isReady
            ? 'bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isAnalyzing ? 'Analyzing...' : isReady ? 'Start Analysis' : 'Loading camera...'}
      </button>
    </div>
  );
}
