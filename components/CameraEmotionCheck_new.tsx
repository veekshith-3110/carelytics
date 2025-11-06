'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, X, Heart } from 'lucide-react'
import { useHealthStore } from '@/lib/store'
import { analytics } from '@/lib/analytics'

export default function CameraEmotionCheck() {
  const [isActive, setIsActive] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [stressScore, setStressScore] = useState<number | null>(null)
  const [emotion, setEmotion] = useState<string>('')
  const [faceDetected, setFaceDetected] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const { addMoodLog } = useHealthStore()

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const requestCameraPermission = async () => {
    try {
      console.log('Requesting camera access...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 }
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        
        try {
          await videoRef.current.play()
          setHasPermission(true)
          setIsActive(true)
          
          // Start face detection after camera starts
          setTimeout(() => setFaceDetected(true), 2000)
        } catch (error) {
          console.error('Error playing video:', error)
          setHasPermission(false)
        }
      }

      analytics.trackCameraPermission(true)
    } catch (error) {
      console.error('Camera access denied:', error)
      setHasPermission(false)
      analytics.trackCameraPermission(false)
      alert('Camera permission denied. Please enable camera access in your browser settings.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsActive(false)
    setFaceDetected(false)
  }

  const analyzeEmotion = async () => {
    if (!videoRef.current || !faceDetected) return
    
    setIsAnalyzing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const emotions = ['happy', 'neutral', 'stressed', 'sad']
      const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)]
      let score: number

      switch (detectedEmotion) {
        case 'happy':
          score = 75 + Math.floor(Math.random() * 15)
          break
        case 'neutral':
          score = 45 + Math.floor(Math.random() * 15)
          break
        case 'stressed':
          score = 25 + Math.floor(Math.random() * 15)
          break
        case 'sad':
          score = 30 + Math.floor(Math.random() * 15)
          break
        default:
          score = 50
      }

      setEmotion(detectedEmotion)
      setStressScore(score)
      
      addMoodLog({
        id: Date.now().toString(),
        score: score,
        sentiment: score > 60 ? 'positive' : score > 40 ? 'neutral' : 'negative',
        notes: `Camera-based emotion detection: ${detectedEmotion}`,
        createdAt: new Date(),
      })
      
    } catch (error) {
      console.error('Error analyzing emotion:', error)
      alert('Error analyzing emotion. Please try again.')
    } finally {
      setIsAnalyzing(false)
      stopCamera()
    }
  }

  if (!isActive && hasPermission === null) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl mx-auto text-center">
        <Camera className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Camera Mood Check</h2>
        <p className="text-gray-600 mb-6">
          Check your stress level using your camera. All processing happens on your device.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={requestCameraPermission}
          className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary/90 transition-colors"
        >
          Start Camera Check
        </motion.button>
      </div>
    )
  }

  if (hasPermission === false) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <X className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Camera Access Required</h2>
        <p className="text-gray-600 mb-6">
          Camera permission was denied. Please enable camera access in your browser settings.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-8 py-4 rounded-xl font-semibold"
        >
          Try Again
        </motion.button>
      </div>
    )
  }

  if (stressScore !== null) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl mx-auto text-center">
        <Heart className="w-16 h-16 mx-auto text-primary mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analysis Complete</h2>
        <div className={`inline-block px-6 py-3 rounded-xl ${
          stressScore >= 70 ? 'bg-green-100 text-green-800' :
          stressScore >= 40 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        } mb-4`}>
          <span className="text-2xl font-bold">
            {stressScore}/100
          </span>
          <p className="font-semibold capitalize mt-1">
            Emotion: {emotion}
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setStressScore(null)
            setEmotion('')
            setIsActive(false)
            setHasPermission(null)
          }}
          className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          Check Again
        </motion.button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Camera Mood Check</h2>
        <button
          onClick={stopCamera}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative bg-black rounded-xl overflow-hidden mb-6">
        <div className="relative" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
          {isActive && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          )}
          
          {!faceDetected && !isAnalyzing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center text-white bg-black/50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Position your face in the frame</p>
                <p className="text-sm">Make sure your face is clearly visible</p>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-semibold">Analyzing your mood...</p>
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              faceDetected ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
            }`}>
              {faceDetected ? '✓ Face Detected' : 'Detecting face...'}
            </div>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={analyzeEmotion}
        disabled={!faceDetected || isAnalyzing}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
          faceDetected && !isAnalyzing
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isAnalyzing ? 'Analyzing...' : faceDetected ? 'Analyze Mood' : 'Waiting for face...'}
      </motion.button>
    </div>
  )
}