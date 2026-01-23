## 🧩 Problem Statement (PS)
Healthcare systems today are fragmented — patient records, vitals, mental health data, treatments, and follow-ups are stored across disconnected systems, leading to poor adherence, missed risks, manual workload for doctors, and lack of continuous care outside hospitals.

## 🚀 Our Solution — DrGuide
DrGuide is a unified healthcare companion that combines physical health, mental wellness, treatment workflows, emergency response, and AI assistance into a single platform for doctors, patients, nurses, caretakers, and admins.

It enables:
- Unified patient health records (physical + mental)
- Smart tracking, risk alerts, and notifications
- Digital prescriptions & follow-ups
- AI-based mental wellness and media verification
- Teleconsultation & remote patient monitoring

## ✨ Key Features
**Doctor**
- Unified health records (physical + mental)
- Digital prescriptions & treatment plans
- Smart appointment scheduling & dashboards
- Teleconsultation with clinical notes
- Patient progression alerts

**Patient**
- View personal records, prescriptions, & reports
- Log vitals, symptoms, and mood
- Medication & appointment reminders
- Mental wellness chatbot
- SOS alerts with live location

**Nurse / Staff**
- Update vitals & medical history
- Upload lab reports & documents
- Support doctors in monitoring workflows

**Caretaker**
- Medication & appointment notifications
- Emergency alerts

**Admin**
- Role-based access & system monitoring
- Critical alert escalation
- Appointment flow management

## 💎 Unique Selling Points (USPs)
- AI-based media & report verification
- AI-optimized appointment scheduling
- RAG-based mental wellness chatbot with patient context
- SOS module with live location sharing
- Peer-to-peer clinical knowledge sharing
- Cognitive mini-games for neurodiverse users
- Daily quizzes with leaderboards for awareness
- Patient community support space
- Smart medication adherence reminders

## 🏗 Core Components (Short)

- **Frontend**
  - Web (Next.js) and Mobile (React Native) interfaces for all users

- **Backend APIs**
  - Node.js REST services for health records, schedules, prescriptions, and roles

- **AI Services**
  - RAG chatbot, media verification, risk detection, and smart scheduling

- **Game Engine**
  - Mini-games + quizzes + leaderboards for cognitive & awareness features

- **Database**
  - MongoDB for structured data, Cloudinary for medical docs/media

- **Telehealth Layer**
  - Jitsi for video consults + realtime alerts/updates

- **Security & Access**
  - Role-based access control and secure medical data handling

## 🛠 How to Use / Run the Project

### 1. Clone the Repo
git clone https://github.com/DikshaP-2506/Codechamps_HackCrypt

### 2. Install & Run Each Service

cd backend  
npm install  
npm run dev  

cd ai-backend  
npm install  
npm run dev  

cd games-backend  
npm install  
npm run dev  

cd frontend  
npm install  
npm run dev  

cd hackcryptapp  
npm install  
npx expo start  

### 3. Environment Variables (.env)

Create `.env` inside these folders:
- backend
- ai-backend
- games-backend

Common keys to include:
MONGO_URI=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
GROQ_API_KEY=
JWT_SECRET=
JITSI_SERVER=




