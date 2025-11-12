1 — MVP (must-have for hackathon demo)

Focus on delivering a reliable, polished demo with these core items:

AI Symptom Checker (text + local-language voice)

Risk Score Dashboard + BMI calculator

Preventive Suggestions + diet recommendation

Medication list & reminders (with notifications)

Local-language Smart Chatbot (Kannada / Tamil / Telugu / Hindi) — text and simple voice

Health History Tracker (store logs securely)

Simple Doctor Directory / nearest clinic lookup

Basic Mental Health & Stress Analyzer (sentiment/mood tracker + calming suggestions)

2 — User Stories (short)

As a villager, I can describe symptoms in my local language (text or voice) to receive likely causes and nearest clinic info.

As a user, I can calculate BMI and get diet recommendations for my goal.

As a user, I can add medicines and get timely reminders.

As a caregiver, I can view a patient’s health history and risk dashboard.

As a user feeling stressed, I can chat with the mental-health bot and get calming exercises.

3 — Functional Requirements (feature-by-feature)
A. AI Symptom Checker

Input: free-text symptoms (multilingual) + optional wearable data (HR, steps) + basic profile (age, gender, weight, height, medical history, allergies).

Output: ranked list of possible conditions with confidence scores, short explanation, suggested next steps (home care / see doctor / emergency).

UI: simple symptom entry box, symptom suggestions (autocomplete), follow-up questions to refine (dynamic).

Backend: inference API that maps symptom vectors to condition probabilities (model + rules).

B. Personalized Risk Score Dashboard

Compute composite risk score from: age, BMI, family history, smoking status, chronic conditions, wearable vitals.

Show component scores (cardiovascular risk, diabetes risk, respiratory risk).

Visuals: gauge + trend lines + simple explanation + suggested urgency.

C. BMI Calculator & Diet Recommendation

BMI = weight(kg) / (height(m))^2. Show BMI category and simple actionable advice.

Diet recommendations: short plan depending on BMI & condition (e.g., low-sugar for diabetic risk). Provide 3 meal suggestions + local-ingredient swap (important for rural users).

D. Preventive Suggestions

For each risk or probable condition, show 3 tiers: Home care, Preventive lifestyle tips, When to see doctor.

Provide local-plant remedies as informational suggestions (see safety section) — map plant names to local availability.

E. Health History Tracker

Store dated symptom entries, risk scores, BMI snapshots, medication logs.

Allow export (CSV) and simple charts.

F. Doctor Directory & Teleconsult Link

Search nearby clinics by geolocation or village name.

Provide contact, hours, and a “Call / Directions” CTA.

Teleconsultation: either link to third-party video (Zoom/Jitsi) or a built-in simple WebRTC call.

G. Local-Language Smart Chatbot (voice + text)

Support Kannada, Tamil, Telugu, Hindi.

Modes: symptom intake, medication queries, diet questions, mental health check-in.

When user speaks, transcribe → NLP intent + slot filling → respond in same language (TTS optional).

Provide fallback to English or human-assisted contact.

H. Medication Management & Reminders

Let user add medicines: name, dose, frequency, start/end date, notes.

Schedule local notifications (browser push + SMS optionally).

Warning if interactions suspected (basic drug-interaction DB or simple flag for duplicate active ingredients).

I. Mental Health & Stress Analyzer

Short mood survey + conversational mood check.

Sentiment analysis on user responses; if stress above threshold show calming activities, helpline numbers, or escalation options.

Provide breathing exercises, short guided audio, motivational quotes.

4 — Non-functional Requirements

Languages: English + Kannada, Tamil, Telugu, Hindi localizations.

Performance: symptom query response < 3s (demo), pages load fast on low bandwidth.

Offline support: basic symptom logging offline, sync later.

Accessibility: large fonts, voice input, screen-reader compatibility, contrast ratios.

Security: encrypted storage (at rest + in transit), authentication (OTP + optional accounts).

Privacy: minimal PII; opt-in for sharing location/wearable data.

5 — Data, ML & Models
Models & Data needed

Symptom-to-condition model: classifier or probabilistic model trained on symptom-condition mappings (e.g., open datasets like CDC symptom lists, symptom-checker datasets). Use a hybrid approach: rule-based mapping (for safety & explainability) + ML model (for ranking).

NLP pipeline per language: tokenization + intent classification + NER for symptoms/meds. Use pretrained multilingual models (mBERT, XLM-R) and fine-tune on medical QA datasets if available.

Speech recognition: language-specific ASR (use Google Speech-to-Text, Vosk offline, or Hugging Face ASR models for Indian languages).

TTS (optional): for voice replies in local languages (Google Cloud TTS / open-source alternatives).

Sentiment/Mood model: light sentiment classifier trained on emotion datasets; thresholding for escalation.

Risk score model: rule-based clinical calculators (e.g., QDiabetes, Framingham-like simplified models) — use transparent logic rather than opaque black-box.

Datasets & Sources (for demo)

Symptom-condition mapping: WHO fact sheets, Mayo Clinic symptom indexes, public symptom-checker corpora.

Local plant database: compile small curated CSV mapping local names to properties (informational only).

Mental health prompts: public emotion/sentiment datasets + curated supportive content.

Note: For safety/legal compliance, models should be presented as advisory only with clear disclaimers.

6 — Architecture & APIs
High-level architecture

Frontend: React (or Next.js) PWA (offline-capable) + mobile-friendly responsive UI.

Backend: Node.js/Express or Python Flask/FastAPI for APIs.

ML inference: separate microservice (Python) using FastAPI — hosts NLP models and symptom inference.

Database: PostgreSQL for structured data + Redis for caching + optionally encrypted blob storage for logs.

Push notifications: Firebase Cloud Messaging (web + Android) / local SMS via Twilio for critical alerts.

Auth: OTP via SMS or email; optional stored profiles.

Core API endpoints (examples)

POST /api/symptom-check — input: {text, language, age, sex, vitals} → returns conditions list + suggestions + riskScore.

POST /api/chat — conversational chatbot endpoint (session-based).

POST /api/asr — if server-side ASR used (or do ASR in client).

GET /api/doctors?lat=&lng=&radius= — return nearby clinics.

POST /api/meds — add medication.

GET /api/reminders — list reminders.

POST /api/mood — mood input → returns mood score + activities.

7 — UI / UX Guidelines (make it awesome & user-friendly)

Simplicity: one action per screen. Big buttons, minimal text.

Conversational flow: make symptom entry feel like chatting (chatbot persona).

Local-first language toggle: prominent language switcher; show flag + language name.

Visual clarity: use cards, large icons, and progress indicators (risk gauge).

Accessibility: voice input CTA on every major screen, large tap targets, readable fonts (≥16px), colorblind-friendly palette.

Onboarding: 3-step onboarding: 1) Purpose, 2) Language choice, 3) Privacy consent.

Error handling: friendly prompts on network loss with offline capability.

Colors/Typeface: calming palette (blues/greens), high contrast CTAs, friendly sans-serif (e.g., Inter / Poppins).

Illustrations & microcopy: human-centered microcopy — “Tell me what’s wrong” vs “Enter symptoms”.

Animations: subtle transitions; animate the risk gauge and charts when loading.

Suggested screens & flow

Landing / Onboarding (lang select + consent)

Home Dashboard (Risk score, Quick Actions: “Describe Symptom”, “Calculate BMI”, “Add Medicine”, “Mood Check”)

Chat/Symptom Screen (chat interface with language switcher + voice input)

Symptom Result Screen (conditions, confidence, next steps, local clinic CTA)

Risk Dashboard (detailed scores + historical trend)

BMI & Diet Screen (BMI, category, 3-day diet plan with local ingredients)

Medicine Management (list, add med, schedule)

Reminders / Notifications (upcoming meds)

History / Export

Settings / Help / Helplines

8 — Integrations & Tools (practical recommendations)

NLP & Chat: Hugging Face Transformers (XLM-R / IndicBERT) + Rasa/Dialogflow for intent flow. Dialogflow easier but less customizable; Rasa allows on-prem offline.

ASR: Google Speech-to-Text (best), Vosk (offline), or Hugging Face wav2vec2 models for Indian languages.

TTS: Google Cloud TTS or gTTS for demo (Hugging Face TTS models also possible).

Push Notifications: Firebase Cloud Messaging.

Maps / Clinics: Google Maps Places API or OpenStreetMap + Nominatim for offline-friendly.

Auth / SMS: Firebase Auth + Twilio for SMS OTP.

Hosting: Vercel/Netlify for frontend, Render/Heroku/AWS for backend; ML inference on a small GPU instance if needed (or host models on Hugging Face Inference API for speed).

Database: Supabase (Postgres + Auth) is an excellent fast choice for hackathon.

9 — Privacy, Safety & Legal

Clear medical disclaimer: “This app provides informational suggestions only. Not a medical diagnosis. See a professional for diagnosis.”

Consent: explicit consent for data collection and voice recording. Keep privacy policy accessible.

Data minimization: avoid storing unnecessary PII. Use anonymized IDs when possible.

Encryption: TLS for transport; encrypt sensitive fields at rest.

Escalation: if mental health model indicates danger (self-harm), show immediate helpline and ask to call emergency services.

Medicinal advice caution: do not prescribe drugs automatically. Provide OTC suggestions or traditional plant info only as informational, with clear warnings and to consult a practitioner. For drug interactions, avoid definitive claims unless backed by a reliable database.

10 — Testing & Evaluation

Functional QA: test language flows, ASR accuracy, chat fallbacks.

Model evaluation: use small holdout dataset to check symptom->condition accuracy; log false positives/negatives.

Usability testing: 5–10 user tests with local-language speakers. Observe where confusion arises.

Performance tests: simulate slow network and offline behavior.

Accessibility audit: Lighthouse + screen reader tests.

11 — Metrics to show judges (and implement)

Avg symptom-check response time.

Accuracy/precision of top-3 predictions (if you have labeled data).

Number of local-language successful sessions.

Medication reminder delivery success rate.

User retention (in demo, show mock weekly use scenario).

12 — MVP vs Stretch Goals (prioritize)

MVP (24–48 hours hackathon):

Frontend PWA with language switcher and polished UX.

Text-based chatbot + symptom checker (English + 1 local language).

BMI calculator + simple diet suggestions.

Medication entry + browser push reminders.

Health history storage and risk dashboard (simple rule-based).

Doctor directory (static seed data for demo).

Stretch (if time allows):

Add voice ASR & TTS.

Additional local languages.

Wearable data integration (mock data feed).

Drug-interaction checks with a mini DB.

Push/SMS reminders via Twilio.

Offline-first sync.

13 — Database Schema (minimal)

users (id, phone, language, location, created_at)

profiles (user_id, dob, sex, height_cm, weight_kg, medical_history json)

symptom_logs (id, user_id, text, language, inferred_conditions json, risk_score, created_at)

medications (id, user_id, name, dose, frequency, times json, start_date, end_date)

reminders (id, med_id, user_id, next_time, status)

clinics (id, name, lat, lng, phone, specialties, village)

mood_logs (id, user_id, mood_score, notes, created_at)

14 — UI Design Quick Style Guide

Primary color: soft teal (#0ea5a4) or blue-green; Accent: warm orange for CTAs.

Fonts: Poppins / Inter (friendly + readable).

Iconography: rounded, friendly icons (meds, stethoscope, chat bubble).

Buttons: big primary CTA, secondary ghost buttons for low-noise actions.

Spacing: comfortable margins (16–24px).

Tone: empathetic — microcopy like “I’m here to help — tell me your symptoms”.

15 — Example User Flow (symptom check)

User taps “Describe symptoms” → chooses language (Kannada) → speaks or types symptoms.

ASR (if voice) transcribes → bot asks 2–3 clarifying Qs (age, fever? duration?) → user answers.

System returns top 3 probable conditions + local clinic suggestion + risk score.

User can “Add to history” or “Book consult” or “Save to meds”.

If risk high → show “See doctor now” with clinic phone button and call option.

16 — Build Checklist (practical)

 Setup repo + CI, project scaffolding (React + Tailwind).

 Implement onboarding & language toggle.

 Build chat UI + symptom input + follow-up Qs.

 Implement symptom-check API (simple rule-based engine first).

 Add BMI calculator & diet card.

 Build medication add/edit UI + local reminder scheduler.

 Implement push notifications (FCM).

 Create Doctor Directory seed data and clinic search.

 Add Mood Check screen + calming activities modal.

 Polish UI, add icons/illustrations, ensure mobile responsiveness.

 Add legal / privacy text, helpline numbers.

 End-to-end demo script & short video/screenshots.

17 — Demo & Pitch Tips (hackathon)

Begin with a short user story (e.g., “Raju, a farmer in a small village, can now describe symptoms in Kannada and find help…”).

Live demo: show symptom chat in local language → get risk score → add medicine and set reminder → mood check → call clinic.

Show technical depth: mention multilingual ASR/NLP, rule+ML hybrid, offline-first PWA, secure storage.

Show impact estimate: number of potential users, accessibility, real-world use cases.

Have a 1-slide roadmap for scaling (wearables, federated learning with clinics, plant DB partnerships).

18 — Safety & Ethical Notes (must include in product)

Use medical disclaimers everywhere.

Provide easy access to emergency services & helplines.

Keep human-in-the-loop for high-risk flags.


Carelytics — Update Requirements (No Code)
0) Branding & Copy

Rename everywhere: “Carelytics — AI Smart Health & Wellness Assistant.”

Update: site title, header caption, favicon/logo, Open Graph meta, app manifest.

Consistency check: no old name (“gopalen”) remains in UI, meta, or URLs.

1) Language System (Fix + Auto-Detect + Full Localisation)

Goal: UI and chatbot work in English, Kannada, Tamil, Telugu, Hindi. Detect user language automatically; allow manual switch.

Scope

UI translations: all visible text moved to language files; toggle updates instantly.

Auto-detect input language in chat and respond in the same language; user can override.

Right voices & date/number formats per language/locale.

Acceptance criteria

Changing the language re-renders every screen (menus, buttons, errors, chatbot).

Typing/speaking in any supported language yields a reply in that language.

Language preference persists across sessions.

Fallback: clear message if a string isn’t translated.

QA checklist

Smoke test each page in all languages.

Mixed-language message still handled (uses last predominant language).

Low bandwidth: language files still load quickly.

2) Chatbot: Voice In ↔ Voice Out (ASR + TTS) with Language ID

Goal: One tap mic input; automatic language identification; spoken replies optional.

Scope

Voice input button in chat: press-and-hold to record; clear permission prompts.

Auto language ID on each message.

Text-to-Speech button on bot messages (“Listen”); uses the correct language voice.

Graceful fallback if device/browser doesn’t support voice features (show message + keep text chat working).

Acceptance criteria

Mic works on Android Chrome and desktop Chrome/Edge; shows unsupported message on Safari iOS (acceptable).

“Listen” speaks in the same language as the message.

Errors are user-friendly (e.g., “Microphone access denied. Tap to enable in settings.”).

QA checklist

Background noise test.

Long message test (>30s).

Interrupt/stop speaking test.

Accessibility: keyboard and screen reader can trigger Listen.

3) Entry Animation (Health + AI)

Goal: Engaging, fast, skippable animated intro on first visit.

Scope

Lightweight animation (Lottie or short muted video) on load with “Skip / Continue”.

Remember choice (local storage) to avoid replay on future visits.

Show one-line caption and accessibility alt text.

Acceptance criteria

First contentful paint stays fast; animation lazy-loads.

Works offline after first visit (cached).

Skip button responds instantly.

QA checklist

Low-end device playback.

Offline revisit plays from cache.

Animation doesn’t trap focus for screen readers.

4) Camera-Based Emotion & Stress Check

Goal: Private, on-device mood detection → stress score → actionable suggestions.

UX

Home CTA: “Check Mood with Camera”.

Flow: Consent screen → camera preview → 5–10s scan → stress score (Low/Medium/High) → suggestions (breathing, hydration, short break, helplines if High).

Privacy note: “Video stays on your device; nothing is uploaded.”

Scope

Detect face presence and basic emotions (neutral, happy, sad, angry, fear).

Compute stress level from negative emotion signals and stability of expressions.

Offer 1–3 quick actions (breathing timer, calming audio, helpline numbers).

Acceptance criteria

If camera permission denied, show text-only mood survey as fallback.

No photo/video stored or sent by default.

Processing is smooth on mid-range Android.

QA checklist

Low light and backlight.

Multiple faces (prompt to show one face).

Motion blur; user wearing glasses/mask.

Stress suggestions vary with results.

5) Medication Alerts via Phone Number

Goal: Collect phone number once to enable medication reminders.

Scope

Prompt: “Add your phone number to get medication reminders (SMS/push).”

Consent & verification (OTP) before enabling alerts.

Medication screen includes schedule, frequency, dosage; supports multiple times/day.

Reminders via push notifications; SMS fallback if user opted in.

Acceptance criteria

Phone saved only after OTP verified.

Clear opt-out and delete number options.

Reminder reliability shown (last sent status).

QA checklist

Wrong OTP path.

Timezone handling (user’s local).

DND hours respected if enabled.

6) Background Visuals & Theming

Goal: Friendly, calm look with subtle animated medical illustrations.

Scope

Animated background (subtle loop, low CPU) on landing and dashboard.

High contrast, motion-reduced mode (respects “reduce motion” OS setting).

Mobile performance preserved.

Acceptance criteria

Animation never blocks input or reading.

Motion can be disabled in Settings.

QA checklist

Battery impact on mobile.

Contrast passes WCAG AA.

RTL or future language direction doesn’t break layout.

7) Doctor Directory & Local Remedies (Informational)

Goal: Show nearby clinics and local medicinal plant info with clear disclaimers.

Scope

Location permission request; fallback to manual area entry.

Clinic cards: name, distance, hours, call/directions button.

Local plants/remedies: show as informational only with a bold disclaimer to consult a professional.

Acceptance criteria

If location blocked, manual search works.

No medical claims presented as prescriptions.

Emergency CTA (call local emergency/helpline) always visible where relevant.

QA checklist

Poor GPS accuracy handling.

Closed clinic state (show hours and “closed now” badge).

8) BMI & Diet Recommendations

Goal: Simple, clear calculator and culturally relevant diet cards.

Scope

BMI calculator with unit switch (kg/cm ↔ lb/ft+in).

Category result (Underweight/Normal/Overweight/Obese) with 3 concise diet tips.

Diet tips localized and tailored (e.g., millets, lentils, locally available vegetables).

Acceptance criteria

Instant calculation and category label.

Diet tips are readable, non-medicalized, and localized.

QA checklist

Edge values (very tall/short).

Unit conversion consistency.

9) Accessibility, Privacy, Safety

Accessibility

Large tap targets, readable fonts, keyboard navigation, alt text.

Voice features optional; text always available.

Privacy

Clear policies for mic/camera/location/phone number.

Minimal data storage; end-to-end encryption in transit.

Local camera analysis only (no upload) unless user opts in.

Safety

Prominent medical disclaimer (“informational, not a diagnosis”).

Mental health escalation: if high stress or crisis keywords → show helplines and emergency prompt.

10) Performance & Offline

PWA: add to home screen; cache static assets, language files, and last session.

Fast first load (target <2s on 4G).

Low-bandwidth mode: reduced animation and smaller images.

Acceptance criteria

Lighthouse performance ≥ 85 on mobile.

Key flows usable offline: viewing history, meds list, BMI; queued messages sync later.

11) Analytics & Monitoring (privacy-respecting)

Track: language used, feature usage (chat, BMI, meds, mood), reminder success.

Anonymized events; no raw audio/text stored without consent.

Error logging for voice and camera failures.

12) Rollout Plan (Simple)

Phase A (Bug fixes): Language toggle; rename branding; stabilize chat text flow.

Phase B (Voice & TTS): Mic input, auto language detection, Listen button.

Phase C (Onboarding polish): Entry animation, background visuals, updated copy.

Phase D (Health add-ons): BMI + diet, phone number & OTP, reminders.

Phase E (Mood camera): Camera consent → stress scoring → suggestions.

Phase F (Directory & remedies): Clinics + local informational plants with disclaimers.

13) Acceptance Demo Script (What you’ll show judges/stakeholders)

Landing plays skippable animation → choose Telugu → home dashboard.

Chat: speak symptoms in Telugu → bot replies in Telugu → tap Listen.

Tap BMI & Diet → see category and 3 relevant diet tips.

Add a medication → verify phone with OTP → show upcoming reminder.

Check Mood → camera scan → stress = Medium → breathing exercise starts.

Nearby Clinics → allow location → call/directions visible.

Toggle language to Kannada → UI and bot switch instantly.

14) Final QA Sign-off Checklist

 No old branding remains.

 UI fully translated; no missing keys.

 Voice in/out works; clear fallbacks.

 Camera feature private and stable; no uploads.

 Phone number verified; opt-out works; reminders deliver.

 Disclaimers and helplines present.

 Performance, accessibility, and offline pass thresholds.