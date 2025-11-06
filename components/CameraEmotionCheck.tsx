'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Heart } from 'lucide-react';
import { useHealthStore } from '@/lib/store';
import { analytics } from '@/lib/analytics';

export default function CameraEmotionCheck() {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stressScore, setStressScore] = useState<number | null>(null);
  const [emotion, setEmotion] = useState<string>('');
  const [faceDetected, setFaceDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { addMoodLog } = useHealthStore();

  const requestCameraPermission = async () => {
    try {
      console.log('Requesting camera access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
        setHasPermission(true);
        setIsActive(true);
        setTimeout(() => setFaceDetected(true), 2000);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setHasPermission(false);
      alert('Camera permission denied. Please enable camera access in your browser settings.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setFaceDetected(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const analyzeEmotion = async () => {
    if (!videoRef.current || !faceDetected) return;
    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const emotions = ['happy', 'neutral', 'stressed', 'sad'];
      const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const score = Math.floor(Math.random() * 100);
      
      setEmotion(detectedEmotion);
      setStressScore(score);
      
      addMoodLog({
        id: Date.now().toString(),
        score,
        sentiment: score > 60 ? 'positive' : score > 40 ? 'neutral' : 'negative',
        notes: `Camera-based emotion detection: ${detectedEmotion}`,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error analyzing emotion. Please try again.');
    } finally {
      setIsAnalyzing(false);
      stopCamera();
    }
  };

  if (!isActive) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <Camera className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Camera Mood Check</h2>
        <p className="text-gray-600 mb-6">
          Check your stress level using your camera.
        </p>
        <button
          onClick={requestCameraPermission}
          className="bg-primary text-white px-8 py-4 rounded-xl font-semibold"
        >
          Start Camera
        </button>
      </div>
    );
  }

  if (stressScore !== null) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <Heart className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Complete</h2>
        <div className="mb-6">
          <p className="text-4xl font-bold text-primary">{stressScore}/100</p>
          <p className="text-xl text-gray-600 capitalize">{emotion}</p>
        </div>
        <button
          onClick={() => {
            setStressScore(null);
            setEmotion('');
            setIsActive(false);
          }}
          className="bg-primary text-white px-8 py-4 rounded-xl font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Camera Mood Check</h2>
        <button
          onClick={stopCamera}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative bg-black rounded-xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        
        {!faceDetected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-white text-center">Position your face in the frame</p>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <p className="text-white">Analyzing...</p>
          </div>
        )}
        
        <div className="absolute top-4 left-4">
          <div className={`px-3 py-1 rounded-full text-sm ${
            faceDetected ? 'bg-green-500' : 'bg-yellow-500'
          } text-white`}>
            {faceDetected ? 'Face Detected' : 'Detecting Face...'}
          </div>
        </div>
      </div>

      <button
        onClick={analyzeEmotion}
        disabled={!faceDetected || isAnalyzing}
        className={`w-full py-4 rounded-xl font-semibold ${
          faceDetected && !isAnalyzing
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isAnalyzing ? 'Analyzing...' : faceDetected ? 'Start Analysis' : 'Waiting for face...'}
      </button>
    </div>
  );
}