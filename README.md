#  HerSafety — Her Safety  (Frontend Project)

**HerSafety** is a mobile-style frontend web application designed to simulate a personal safety system.  
It allows users to log in, track location, manage emergency contacts, and trigger a simulated SOS system using browser APIs.

Built using **HTML, CSS, and JavaScript (no frameworks)** with a focus on **UI/UX design and browser API integration**.

---
##  Live Demo

 https://harmannmahna.github.io/HerSafety/
---
#  Features

##  Authentication System (Frontend Only)

- Simple login using **Name and Email**
- Data stored in `localStorage`
- Auto redirect to Home page after login
- Persistent session until logout

---

##  Home Dashboard

- Personalized greeting: **Hello, [Name]**
- Live location using **Geolocation API**
- Central animated **SOS button**

###  SOS System (Simulation)

On activation:

- Full-screen emergency alert overlay
- Simulated actions:
  - Location sharing with emergency contacts
  - Emergency call to **112 (simulation only)**
  - Audio recording using **MediaRecorder API (if supported)**
- Option to cancel alert

---

##  Quick Actions

- Start audio recording
- Start video recording (MediaDevices API if supported)
- ### Smart Escape Call simulation:
  - Plays pre-recorded audio (Mom/Friend)
  - Timer options: **10s / 15s / 20s**
###  Smart Fake Call (AI Voice Simulation)

- Simulates an incoming call during emergency situations
- Plays pre-recorded AI-generated voice message:
  - “Hi, I will reach your location soon” (English)
  - Same message in Hindi for multilingual support
- Designed to give a realistic emergency reassurance experience
- Currently integrated inside the Home page only under Quick Actions
---

##  Map Module

- ### Embedded or placeholder map (Delhi region)
- Safety zones:
  - 🔴 High Risk
  - 🟡 Medium Risk
  - 🟢 Safe Area
- Dynamic safety status message based on zone

---

##  Emergency Contacts

- Add contacts (Name + Phone Number)
- Stored in `localStorage`
- View saved contacts list
- Delete contacts option

---

##  Profile Page

- Displays user details (Name, Email)
- Logout functionality (clears `localStorage`)

---

##  Voice Activation (Experimental)

- Uses **Web Speech API (if supported)**
- Detects keyword: **"help me"**
- Automatically triggers SOS system

---

#  UI/UX Design

- Mobile-first responsive layout
- Clean card-based interface
- Soft gradient color theme
- Rounded buttons and components
- Bottom navigation bar:
  - Home
  - Map
  - Contacts
  - Profile
- Smooth animations and transitions

---

#  Tech Stack

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript

### Browser APIs Used:
- Geolocation API
- Web Speech API
- MediaDevices API
- MediaRecorder API
- LocalStorage API

---
# 📂 Project Structure


```
HerSafety/
│
├── index.html          # Login Page
├── home.html           # Home Dashboard (SOS + actions)
├── map.html            # Safety Map Page
├── contacts.html       # Emergency Contacts Page
├── profile.html        # User Profile Page
│
├── style.css           # Global Stylesheet
├── script.js           # Main JavaScript Logic
│
└── HerSafety.png       # Logo 
```



---

# ⚠️ Important Notes

- All emergency features are **simulated only**
- No real calls or emergency services are triggered
- Built for **learning and UI/UX development**

---

# Screenshots



## 📸 Screenshots

### 1) Login Page
Simple login system with name and email authentication stored in localStorage.

<div align="center">
  <img src="assets/login.png" width="45%">
</div>

---

### 2) Home Page (SOS Dashboard)
Main dashboard with greeting, location tracking, and emergency SOS system.

<div align="center">
  <img src="assets/home.png" width="45%">
</div>

---

### 3) Emergency Alert System
Full-screen SOS activation with simulated emergency response actions.

<div align="center">
  <img src="assets/emergency.png" width="45%">
</div>

---

### 4) Map Page
Displays safety zones (Safe / Medium / High risk areas).

<div align="center">
  <img src="assets/map.png" width="45%">
</div>

---

### 5) Contacts Page
Manage emergency contacts stored in localStorage.

<div align="center">
  <img src="assets/contacts.png" width="45%">
</div>

---

### 6) Profile Page
Displays user details with logout functionality.

<div align="center">
  <img src="assets/profile.png" width="45%">
</div>
---

#  Future Improvements

- Backend authentication system
- Real-time location sharing
- Push notifications
- Dark mode support
- Cloud-based contact storage
-  Expand Fake Call feature with multiple languages support
    Future updates will include multiple global languages for better accessibility and realism
---

#  Author 
## Harmann Kaur

Built as a frontend project focused on:

- UI/UX design
- Browser API usage
- Mobile-first development

----

#  Inspiration

Inspired by real-world safety applications, built to explore how frontend technologies can simulate emergency response systems.



