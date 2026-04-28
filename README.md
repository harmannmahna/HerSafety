HerSafety

A responsive frontend web application designed as a mobile-style personal safety system. Built using HTML, CSS, and JavaScript without any frameworks. The project simulates emergency safety features with a focus on UI/UX design and browser API integration.

Live Demo

Add your deployed GitHub Pages link here:

https://your-username.github.io/HerSafety/
Screenshots

Add your screenshots in a folder named assets/ in your repository.

Login Page

Displays a simple authentication interface with name and email input stored in localStorage.

assets/login.png
Home Page

Main dashboard with greeting, location display, and SOS emergency button.

assets/home.png
Emergency Call Interface

Full-screen SOS alert simulation showing emergency activation workflow.

assets/emergency.png
Map Page

Displays safety zones with simulated risk levels (Safe, Moderate, High Risk).

assets/map.png
Contacts Page

Allows users to add, view, and delete emergency contacts stored locally.

assets/contacts.png
Profile Page

Displays user information with logout functionality.

assets/profile.png
Features
Authentication (Frontend Simulation)
Login using name and email
Data stored using localStorage
Automatic redirection to home page after login
Home Dashboard
Personalized greeting based on user input
Current location using Geolocation API
Central SOS button for emergency simulation
SOS Functionality
Full-screen emergency alert overlay
Simulated actions:
Location sharing
Emergency call initiation (112 simulation)
Audio recording using MediaRecorder API (if supported)
Cancel emergency option
Quick Actions
Audio recording feature
Video recording using MediaDevices API (if supported)
Smart escape call simulation with timed playback options
Map Module
Embedded or placeholder map of Delhi
Risk zones displayed as:
Safe
Moderate
High Risk
Dynamic status message based on zone
Contacts Management
Add emergency contacts (name and phone number)
Store data in localStorage
View and delete saved contacts
Profile Section
Displays stored user details
Logout functionality (clears localStorage)
Voice Activation (Experimental)
Uses Web Speech API (if available in browser)
Detects keyword “help me”
Automatically triggers SOS alert simulation
UI/UX Design
Mobile-first responsive layout
Clean card-based design
Rounded buttons and containers
Soft gradient styling
Fixed bottom navigation bar:
Home
Map
Contacts
Profile
Tech Stack
HTML5
CSS3 (Flexbox, Grid, Animations)
Vanilla JavaScript
Browser APIs:
Geolocation API
Web Speech API
MediaDevices API
MediaRecorder API
LocalStorage API
Project Structure
HerSafety/
│
├── index.html        # Login Page
├── home.html         # Home Dashboard
├── map.html          # Map Page
├── contacts.html     # Contacts Page
├── profile.html      # Profile Page
│
├── style.css         # Global Styles
├── script.js         # JavaScript Logic
│
└── assets/
    ├── login.png
    ├── home.png
    ├── emergency.png
    ├── map.png
    ├── contacts.png
    └── profile.png
Important Notes
All emergency features are simulated for demonstration purposes only.
No real emergency services are contacted.
The project is intended for educational and UI/UX learning purposes.
Future Improvements
Backend integration for authentication
Real-time location sharing
Push notification support
Dark mode implementation
Cloud storage for contacts
Author

This project was built as a frontend learning exercise focusing on:

UI/UX design principles
Browser API integration
Mobile-first responsive development
