# Carelytics — AI Smart Health & Wellness Assistant

A comprehensive, multilingual health platform with AI symptom checking, risk assessment, medication management, and mental health tracking. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion for stunning animations and modern UI/UX.

## Features

### 🎯 Core Features

1. **AI Symptom Checker**
   - Text and voice input support
   - Multilingual support (English, Kannada, Tamil, Telugu, Hindi)
   - Real-time symptom analysis with confidence scores
   - Nearby clinic suggestions

2. **Risk Score Dashboard**
   - Comprehensive health risk assessment
   - Cardiovascular, diabetes, and respiratory risk metrics
   - Visual trend charts and risk breakdown
   - Personalized recommendations

3. **BMI Calculator & Diet Recommendations**
   - Instant BMI calculation
   - Personalized diet plans with local ingredient suggestions
   - 3-day meal plans based on BMI category
   - Preventive lifestyle tips

4. **Medication Management**
   - Add, edit, and track medications
   - Customizable reminder times
   - Browser push notifications
   - Medication history tracking

5. **Mental Health & Stress Analyzer**
   - Mood tracking with sentiment analysis
   - Breathing exercises and calming activities
   - Helpline numbers and crisis support
   - Motivational content

6. **Doctor Directory**
   - Search nearby clinics
   - Filter by specialty
   - Contact information and directions
   - Teleconsultation support

7. **Health History Tracker**
   - Complete health log storage
   - Export to CSV/JSON
   - Symptom, mood, and medication history
   - Trend visualization

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand with persistence
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd carelytics
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
carelytics/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── Onboarding.tsx       # Onboarding flow
│   ├── HomeDashboard.tsx    # Main dashboard
│   ├── SymptomChecker.tsx   # AI symptom checker
│   ├── BMICalculator.tsx    # BMI calculator
│   ├── MedicationManager.tsx # Medication tracking
│   ├── RiskDashboard.tsx    # Risk score dashboard
│   ├── MentalHealthChecker.tsx # Mental health analyzer
│   ├── DoctorDirectory.tsx  # Clinic directory
│   ├── HealthHistory.tsx     # Health history
│   └── LanguageSwitcher.tsx  # Language selector
├── lib/
│   ├── store.ts             # Zustand store
│   └── utils.ts             # Utility functions
└── requirements.md          # Project requirements
```

## Key Features Implementation

### Animations
- Smooth page transitions with Framer Motion
- Interactive hover effects
- Loading animations
- Progress indicators
- Animated charts and gauges

### UI/UX Highlights
- Modern gradient backgrounds
- Responsive design (mobile-first)
- Accessible color schemes
- Large, readable fonts (≥16px)
- Voice input support
- Offline-capable (PWA ready)

### Data Persistence
- Local storage with Zustand persist
- Health data saved securely
- Export functionality (CSV/JSON)

## Language Support

The platform supports multiple languages:
- English (en)
- Kannada (kn)
- Tamil (ta)
- Telugu (te)
- Hindi (hi)

Language preference is saved and persists across sessions.

## Medical Disclaimer

⚠️ **Important**: This application provides informational suggestions only. It is not a medical diagnosis tool. Always consult with a qualified healthcare provider for proper medical diagnosis and treatment.

## Safety & Privacy

- All data is stored locally in your browser
- No data is sent to external servers (in current implementation)
- Clear privacy policy and consent flow
- Medical disclaimers prominently displayed
- Emergency helpline numbers provided

## Future Enhancements

- Backend API integration
- Real-time doctor consultations
- Wearable device integration
- Advanced ML models for symptom analysis
- Offline-first PWA capabilities
- Push notifications via FCM
- Multi-user support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.

---

Built with ❤️ for better healthcare accessibility

