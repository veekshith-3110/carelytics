# Carelytics — AI Smart Health & Wellness Assistant

A comprehensive, multilingual health platform with AI symptom checking, risk assessment, medication management, and mental health tracking. Available as both a **Next.js web application** and an **Expo React Native mobile app**.

![TypeScript](https://img.shields.io/badge/TypeScript-98.6%25-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![Expo](https://img.shields.io/badge/Expo-54.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Overview

Carelytics is an AI-powered health companion that provides:
- **AI Symptom Checker** with multilingual support
- **Risk Assessment Dashboard** for health metrics
- **Medication Management** with reminders
- **Mental Health Tracking** and support
- **Doctor Directory** with location services
- **BMI Calculator** with personalized diet plans
- **Google OAuth Authentication** for secure login

## 📁 Project Structure

```
carelytics/
├── aiassist/                    # Main application directory
│   ├── app/                     # Next.js web app (App Router)
│   │   ├── login/               # Login page with Google OAuth
│   │   ├── page.tsx             # Home dashboard
│   │   └── layout.tsx           # Root layout
│   ├── components/              # React components
│   ├── lib/                     # Utilities and stores
│   ├── hooks/                   # Custom React hooks
│   ├── public/                  # Static assets
│   └── carelytic/               # Expo mobile app
│       ├── app/                 # Expo Router pages
│       ├── components/          # React Native components
│       └── lib/                 # Mobile app utilities
├── START_APP.bat               # Windows batch script to start web app
├── START_APP.ps1               # PowerShell script to start web app
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm 9+
- **For mobile app**: Expo Go app on your phone (iOS/Android)

### Web Application (Next.js)

1. **Navigate to the web app directory:**
   ```bash
   cd aiassist
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the `aiassist` directory:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=862611167571-l7fevev7mq9v53n3isbohghp3emlkjng.apps.googleusercontent.com
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Local: http://localhost:3000
   - Network: http://[your-ip]:3000

**Or use the helper scripts:**
- Windows: Double-click `START_APP.bat` or run `.\START_APP.ps1`

### Mobile Application (Expo)

1. **Navigate to the mobile app directory:**
   ```bash
   cd aiassist/carelytic
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Expo:**
   ```bash
   npm start
   ```

4. **Scan QR code:**
   - **Android**: Open Expo Go app and scan the QR code
   - **iOS**: Use the Camera app to scan the QR code

## ✨ Features

### Core Features

1. **🔐 Google OAuth Authentication**
   - Secure login with Google account
   - Available on both web and mobile
   - Client ID: `862611167571-l7fevev7mq9v53n3isbohghp3emlkjng.apps.googleusercontent.com`

2. **🤖 AI Symptom Checker**
   - Text and voice input support
   - Multilingual support (English, Kannada, Tamil, Telugu, Hindi)
   - Real-time symptom analysis with confidence scores
   - Nearby clinic suggestions

3. **📊 Risk Score Dashboard**
   - Comprehensive health risk assessment
   - Cardiovascular, diabetes, and respiratory risk metrics
   - Visual trend charts and risk breakdown
   - Personalized recommendations

4. **💊 Medication Management**
   - Add, edit, and track medications
   - Customizable reminder times
   - Browser push notifications
   - Medication history tracking

5. **🧠 Mental Health & Stress Analyzer**
   - Mood tracking with sentiment analysis
   - Breathing exercises and calming activities
   - Helpline numbers and crisis support
   - Motivational content

6. **👨‍⚕️ Doctor Directory**
   - Search nearby clinics
   - Filter by specialty
   - Contact information and directions
   - Google Maps integration

7. **📈 Health History Tracker**
   - Complete health log storage
   - Export to CSV/JSON
   - Symptom, mood, and medication history
   - Trend visualization

8. **📏 BMI Calculator & Diet Recommendations**
   - Instant BMI calculation
   - Personalized diet plans
   - 3-day meal plans based on BMI category
   - Preventive lifestyle tips

## 🛠️ Tech Stack

### Web Application
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand with persistence
- **Charts**: Recharts
- **Icons**: Lucide React
- **OAuth**: @react-oauth/google

### Mobile Application
- **Framework**: Expo 54 (React Native)
- **Router**: Expo Router
- **State Management**: Zustand
- **Storage**: AsyncStorage
- **Maps**: React Native Maps
- **OAuth**: expo-auth-session

## 📝 Environment Variables

### Web App (`aiassist/.env.local`)
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure the OAuth consent screen
6. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - Your production domain
7. Add redirect URIs:
   - `http://localhost:3000`
   - Your production domain
8. Copy the Client ID to your `.env.local` file

## 🚢 Deployment

### Web App (Vercel)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Mobile App (Expo)

1. Build for production:
   ```bash
   cd aiassist/carelytic
   expo build:android
   expo build:ios
   ```

2. Or use EAS Build:
   ```bash
   eas build --platform android
   eas build --platform ios
   ```

## 📱 Supported Languages

- 🇬🇧 English (en)
- 🇮🇳 Kannada (kn)
- 🇮🇳 Tamil (ta)
- 🇮🇳 Telugu (te)
- 🇮🇳 Hindi (hi)

Language preference is saved and persists across sessions.

## 🔒 Security & Privacy

- All data is stored locally in your browser/device
- Google OAuth for secure authentication
- No sensitive data sent to external servers (in current implementation)
- Clear privacy policy and consent flow
- Medical disclaimers prominently displayed
- Emergency helpline numbers provided

## ⚠️ Medical Disclaimer

**Important**: This application provides informational suggestions only. It is not a medical diagnosis tool. Always consult with a qualified healthcare provider for proper medical diagnosis and treatment.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support, please:
- Create an issue in the [GitHub repository](https://github.com/veekshith-3110/carelytics/issues)
- Contact the development team

## 🔗 Links

- **Repository**: [https://github.com/veekshith-3110/carelytics](https://github.com/veekshith-3110/carelytics)
- **Web App**: Run locally at http://localhost:3000
- **Mobile App**: Scan QR code with Expo Go

## 📊 Project Status

✅ **Production Ready**
- Web app: Fully functional
- Mobile app: Fully functional
- Google OAuth: Configured and working
- All features: Implemented and tested

## 🙏 Acknowledgments

Built with ❤️ for better healthcare accessibility

---

**Last Updated**: November 2024  
**Version**: 1.0.0

