/* HerSafety - shared scripts */

// ---------- Auth helpers ----------
const Auth = {
  get user() {
    try { return JSON.parse(localStorage.getItem("hs_user") || "null"); }
    catch { return null; }
  },
  save(user) { localStorage.setItem("hs_user", JSON.stringify(user)); },
  clear() { localStorage.removeItem("hs_user"); }
};

function requireAuth() {
  if (!Auth.user) {
    window.location.href = "index.html";
  }
}

// ---------- Toast ----------
function toast(msg, ms = 2400) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), ms);
}

// ---------- Login page ----------
function initLogin() {
  if (Auth.user) {
    window.location.href = "home.html";
    return;
  }
  const form = document.getElementById("login-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    if (!name || !email) return;
    Auth.save({ name, email });
    window.location.href = "home.html";
  });
}

// ---------- Geolocation ----------
function getLocationText(targetEl) {
  if (!navigator.geolocation) {
    targetEl.textContent = "Location unavailable";
    return;
  }
  targetEl.textContent = "Locating…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      targetEl.textContent = `📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      sessionStorage.setItem("hs_loc", `${latitude},${longitude}`);
    },
    () => { targetEl.textContent = "📍 Location permission denied"; },
    { timeout: 8000 }
  );
}
/* HerSafety - shared scripts */

// ---------- Auth helpers ----------
const Auth = {
  get user() {
    try { return JSON.parse(localStorage.getItem("hs_user") || "null"); }
    catch { return null; }
  },
  save(user) { localStorage.setItem("hs_user", JSON.stringify(user)); },
  clear() { localStorage.removeItem("hs_user"); }
};

function requireAuth() {
  if (!Auth.user) {
    window.location.href = "index.html";
  }
}

// ---------- Toast ----------
function toast(msg, ms = 2400) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), ms);
}

// ---------- Login page ----------
function initLogin() {
  if (Auth.user) {
    window.location.href = "home.html";
    return;
  }
  const form = document.getElementById("login-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    if (!name || !email) return;
    Auth.save({ name, email });
    window.location.href = "home.html";
  });
}

// ---------- Geolocation ----------
function getLocationText(targetEl) {
  if (!navigator.geolocation) {
    targetEl.textContent = "Location unavailable";
    return;
  }
  targetEl.textContent = "Locating…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      targetEl.textContent = `📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      sessionStorage.setItem("hs_loc", `${latitude},${longitude}`);
    },
    () => { targetEl.textContent = "📍 Location permission denied"; },
    { timeout: 8000 }
  );
}

// ---------- SOS ----------
let sosRecorder = null;
let sosStream = null;

function triggerSOS() {
  const overlay = document.getElementById("sos-overlay");
  overlay.classList.add("active");

  // Vibrate if possible
  if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);

  // Try to record audio
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        sosStream = stream;
        try {
          sosRecorder = new MediaRecorder(stream);
          sosRecorder.start();
        } catch (e) { /* ignore */ }
      })
      .catch(() => { /* simulated */ });
  }
}

function cancelSOS() {
  const overlay = document.getElementById("sos-overlay");
  overlay.classList.remove("active");
  if (sosRecorder && sosRecorder.state !== "inactive") {
    try { sosRecorder.stop(); } catch {}
  }
  if (sosStream) {
    sosStream.getTracks().forEach(t => t.stop());
    sosStream = null;
  }
  toast("Alert cancelled");
}

// ---------- Audio Recording ----------
let audioRec = null, audioStream = null;
async function toggleAudioRecording(btn) {
  if (audioRec && audioRec.state === "recording") {
    audioRec.stop();
    audioStream.getTracks().forEach(t => t.stop());
    audioRec = null; audioStream = null;
    btn.textContent = "🎙 Start Audio Recording";
    btn.classList.remove("listening");
    toast("Audio recording stopped");
    return;
  }
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioRec = new MediaRecorder(audioStream);
    audioRec.start();
    btn.textContent = "⏹ Stop Audio Recording";
    btn.classList.add("listening");
    toast("Recording audio…");
  } catch {
    toast("Mic unavailable — simulating recording");
  }
}

// ---------- Video Recording ----------
let videoRec = null, videoStream = null;
async function toggleVideoRecording(btn) {
  const preview = document.getElementById("video-preview");
  if (videoRec && videoRec.state === "recording") {
    videoRec.stop();
    videoStream.getTracks().forEach(t => t.stop());
    videoRec = null; videoStream = null;
    btn.textContent = "📹 Start Video Recording";
    btn.classList.remove("listening");
    if (preview) { preview.srcObject = null; preview.classList.remove("active"); }
    toast("Video recording stopped");
    return;
  }
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (preview) {
      preview.srcObject = videoStream;
      preview.muted = true;
      preview.play();
      preview.classList.add("active");
    }
    videoRec = new MediaRecorder(videoStream);
    videoRec.start();
    btn.textContent = "⏹ Stop Video Recording";
    btn.classList.add("listening");
    toast("Recording video…");
  } catch {
    toast("Camera unavailable — simulating");
  }
}

// ---------- Smart Escape Call ----------
function escapeCall(seconds) {
  toast(`📞 Incoming call from Mom… (${seconds}s)`, seconds * 1000);
  // Try to play a tone using WebAudio as a simulated ringtone
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeep = (delay) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + delay + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.4);
      o.start(ctx.currentTime + delay);
      o.stop(ctx.currentTime + delay + 0.45);
    };
    for (let i = 0; i < seconds; i++) playBeep(i * 0.8);
    setTimeout(() => ctx.close(), seconds * 1000 + 500);
  } catch {}
}

function showEscapeChoices() {
  const card = document.getElementById("escape-choices");
  if (card) card.style.display = card.style.display === "flex" ? "none" : "flex";
}

// ---------- AI Fake Call ----------
const AI_CALL_MESSAGES = {
  en: {
    lang: "en-US",
    name: "Mom (AI)",
    text: "Hey, I saw your location. I am already on the way and will reach there soon. Don't worry, and don't hang up the phone till I meet you."
  },
  hi: {
    lang: "hi-IN",
    name: "Maa (AI)",
    text: "Suno, maine tumhari location dekh li hai. Main pehle se hi raaste mein hoon aur jaldi pahunch jaungi. Chinta mat karo, aur jab tak main tumse na milun tab tak phone mat kaatna."
  }
};

let aiCallTimer = null;

function showAiCallChoices() {
  const card = document.getElementById("ai-call-choices");
  if (card) card.style.display = card.style.display === "flex" ? "none" : "flex";
}

function startAiCall(langKey) {
  const msg = AI_CALL_MESSAGES[langKey];
  if (!msg) return;

  // Hide chooser
  const chooser = document.getElementById("ai-call-choices");
  if (chooser) chooser.style.display = "none";

  const overlay = document.getElementById("ai-call-overlay");
  const nameEl = document.getElementById("ai-call-name");
  const statusEl = document.getElementById("ai-call-status");
  const transcriptEl = document.getElementById("ai-call-transcript");

  nameEl.textContent = msg.name;
  statusEl.textContent = "Ringing…";
  transcriptEl.textContent = "";
  overlay.classList.add("active");

  if (navigator.vibrate) navigator.vibrate([400, 200, 400, 200, 400]);

  // Simulated ringtone via WebAudio
  let ringCtx = null;
  try {
    ringCtx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < 3; i++) {
      const o = ringCtx.createOscillator();
      const g = ringCtx.createGain();
      o.frequency.value = 480;
      o.connect(g); g.connect(ringCtx.destination);
      const t = i * 0.9;
      g.gain.setValueAtTime(0.0001, ringCtx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.18, ringCtx.currentTime + t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ringCtx.currentTime + t + 0.5);
      o.start(ringCtx.currentTime + t);
      o.stop(ringCtx.currentTime + t + 0.55);
    }
  } catch {}

  // After ringing, "answer" and speak
  aiCallTimer = setTimeout(() => {
    if (ringCtx) { try { ringCtx.close(); } catch {} }
    statusEl.textContent = "Connected • 00:00";
    transcriptEl.textContent = msg.text;

    // Call duration counter
    const startedAt = Date.now();
    aiCallTimer = setInterval(() => {
      const s = Math.floor((Date.now() - startedAt) / 1000);
      const mm = String(Math.floor(s / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      statusEl.textContent = `Connected • ${mm}:${ss}`;
    }, 1000);

    speakAiCall(msg);
  }, 2800);
}

function speakAiCall(msg) {
  if (!("speechSynthesis" in window)) {
    toast("Voice playback not supported on this browser");
    return;
  }
  try { window.speechSynthesis.cancel(); } catch {}

  const speak = () => {
    const u = new SpeechSynthesisUtterance(msg.text);
    u.lang = msg.lang;
    u.rate = 0.95;
    u.pitch = 1.05;
    u.volume = 1;

    // Try to pick a matching voice
    const voices = window.speechSynthesis.getVoices();
    const match =
      voices.find(v => v.lang && v.lang.toLowerCase() === msg.lang.toLowerCase()) ||
      voices.find(v => v.lang && v.lang.toLowerCase().startsWith(msg.lang.split("-")[0]));
    if (match) u.voice = match;

    // Loop the message while the call is "active"
    u.onend = () => {
      const overlay = document.getElementById("ai-call-overlay");
      if (overlay && overlay.classList.contains("active")) {
        setTimeout(() => {
          if (document.getElementById("ai-call-overlay").classList.contains("active")) {
            window.speechSynthesis.speak(u);
          }
        }, 1200);
      }
    };
    window.speechSynthesis.speak(u);
  };

  // Voices may load async on some browsers
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      speak();
    };
    // Fallback in case the event never fires
    setTimeout(speak, 600);
  } else {
    speak();
  }
}

function endAiCall() {
  const overlay = document.getElementById("ai-call-overlay");
  if (overlay) overlay.classList.remove("active");
  if (aiCallTimer) { clearTimeout(aiCallTimer); clearInterval(aiCallTimer); aiCallTimer = null; }
  try { window.speechSynthesis.cancel(); } catch {}
  toast("Call ended");
}

// ---------- Voice activation ----------
let recognition = null;
function toggleVoiceListen(btn) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    toast("Voice recognition not supported in this browser");
    return;
  }
  if (recognition) {
    recognition.stop(); recognition = null;
    btn.textContent = "🎤 Voice Activation";
    btn.classList.remove("listening");
    return;
  }
  recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  recognition.onresult = (e) => {
    const text = Array.from(e.results).map(r => r[0].transcript).join(" ").toLowerCase();
    if (text.includes("help me")) {
      recognition.stop(); recognition = null;
      btn.textContent = "🎤 Voice Activation";
      btn.classList.remove("listening");
      triggerSOS();
    }
  };
  recognition.onend = () => {
    if (recognition) { try { recognition.start(); } catch {} }
  };
  try {
    recognition.start();
    btn.textContent = "🎤 Listening… (say 'help me')";
    btn.classList.add("listening");
  } catch {
    toast("Could not start microphone");
    recognition = null;
  }
}

// ---------- Home page init ----------
function initHome() {
  requireAuth();
  document.getElementById("greet-name").textContent = Auth.user.name;
  getLocationText(document.getElementById("greet-loc"));

  document.getElementById("sos-btn").addEventListener("click", triggerSOS);
  document.getElementById("cancel-sos").addEventListener("click", cancelSOS);
  document.getElementById("audio-btn").addEventListener("click", (e) => toggleAudioRecording(e.currentTarget));
  document.getElementById("video-btn").addEventListener("click", (e) => toggleVideoRecording(e.currentTarget));
  document.getElementById("escape-btn").addEventListener("click", showEscapeChoices);
  document.getElementById("voice-btn").addEventListener("click", (e) => toggleVoiceListen(e.currentTarget));

  document.querySelectorAll("[data-escape]").forEach(b => {
    b.addEventListener("click", () => escapeCall(parseInt(b.dataset.escape, 10)));
  });

  document.getElementById("ai-call-btn").addEventListener("click", showAiCallChoices);
  document.querySelectorAll("[data-ai-lang]").forEach(b => {
    b.addEventListener("click", () => startAiCall(b.dataset.aiLang));
  });
  document.getElementById("end-ai-call").addEventListener("click", endAiCall);

  // Pre-warm voice list (some browsers load async)
  if ("speechSynthesis" in window) { try { window.speechSynthesis.getVoices(); } catch {} }
}

// ---------- Map page init ----------
function initMap() {
  requireAuth();
  // Simulated zone classification
  const zones = ["safe", "warn", "risk"];
  const labels = {
    safe: "✅ You are in a Safe area",
    warn: "⚠️ You are in a Moderate risk area",
    risk: "🚨 You are in a High risk area"
  };
  const z = zones[Math.floor(Math.random() * zones.length)];
  const banner = document.getElementById("zone-status");
  banner.classList.add(z);
  banner.textContent = labels[z];
}

// ---------- Contacts ----------
function loadContacts() {
  try { return JSON.parse(localStorage.getItem("hs_contacts") || "[]"); }
  catch { return []; }
}
function saveContacts(arr) { localStorage.setItem("hs_contacts", JSON.stringify(arr)); }

function renderContacts() {
  const list = document.getElementById("contact-list");
  const contacts = loadContacts();
  if (!contacts.length) {
    list.innerHTML = `<div class="empty-state">No emergency contacts yet.<br>Add one above.</div>`;
    return;
  }
  list.innerHTML = contacts.map((c, i) => `
    <div class="contact-item">
      <div class="contact-avatar">${c.name.charAt(0).toUpperCase()}</div>
      <div class="contact-info">
        <div class="name">${escapeHtml(c.name)}</div>
        <div class="num">${escapeHtml(c.number)}</div>
      </div>
      <button class="contact-del" data-i="${i}" aria-label="Delete">🗑</button>
    </div>
  `).join("");
  list.querySelectorAll(".contact-del").forEach(btn => {
    btn.addEventListener("click", () => {
      const arr = loadContacts();
      arr.splice(parseInt(btn.dataset.i, 10), 1);
      saveContacts(arr);
      renderContacts();
      toast("Contact deleted");
    });
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function initContacts() {
  requireAuth();
  renderContacts();
  document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("c-name").value.trim();
    const number = document.getElementById("c-num").value.trim();
    if (!name || !number) return;
    const arr = loadContacts();
    arr.push({ name, number });
    saveContacts(arr);
    e.target.reset();
    renderContacts();
    toast("Contact added");
  });
}

// ---------- Profile ----------
function initProfile() {
  requireAuth();
  const u = Auth.user;
  document.getElementById("p-name").textContent = u.name;
  document.getElementById("p-email").textContent = u.email;
  document.getElementById("p-avatar").textContent = u.name.charAt(0).toUpperCase();
  document.getElementById("logout-btn").addEventListener("click", () => {
    Auth.clear();
    localStorage.removeItem("hs_contacts");
    window.location.href = "index.html";
  });
}

// ---------- SOS ----------
let sosRecorder = null;
let sosStream = null;

function triggerSOS() {
  const overlay = document.getElementById("sos-overlay");
  overlay.classList.add("active");

  // Vibrate if possible
  if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);

  // Try to record audio
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        sosStream = stream;
        try {
          sosRecorder = new MediaRecorder(stream);
          sosRecorder.start();
        } catch (e) { /* ignore */ }
      })
      .catch(() => { /* simulated */ });
  }
}

function cancelSOS() {
  const overlay = document.getElementById("sos-overlay");
  overlay.classList.remove("active");
  if (sosRecorder && sosRecorder.state !== "inactive") {
    try { sosRecorder.stop(); } catch {}
  }
  if (sosStream) {
    sosStream.getTracks().forEach(t => t.stop());
    sosStream = null;
  }
  toast("Alert cancelled");
}

// ---------- Audio Recording ----------
let audioRec = null, audioStream = null;
async function toggleAudioRecording(btn) {
  if (audioRec && audioRec.state === "recording") {
    audioRec.stop();
    audioStream.getTracks().forEach(t => t.stop());
    audioRec = null; audioStream = null;
    btn.textContent = "🎙 Start Audio Recording";
    btn.classList.remove("listening");
    toast("Audio recording stopped");
    return;
  }
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioRec = new MediaRecorder(audioStream);
    audioRec.start();
    btn.textContent = "⏹ Stop Audio Recording";
    btn.classList.add("listening");
    toast("Recording audio…");
  } catch {
    toast("Mic unavailable — simulating recording");
  }
}

// ---------- Video Recording ----------
let videoRec = null, videoStream = null;
async function toggleVideoRecording(btn) {
  const preview = document.getElementById("video-preview");
  if (videoRec && videoRec.state === "recording") {
    videoRec.stop();
    videoStream.getTracks().forEach(t => t.stop());
    videoRec = null; videoStream = null;
    btn.textContent = "📹 Start Video Recording";
    btn.classList.remove("listening");
    if (preview) { preview.srcObject = null; preview.classList.remove("active"); }
    toast("Video recording stopped");
    return;
  }
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (preview) {
      preview.srcObject = videoStream;
      preview.muted = true;
      preview.play();
      preview.classList.add("active");
    }
    videoRec = new MediaRecorder(videoStream);
    videoRec.start();
    btn.textContent = "⏹ Stop Video Recording";
    btn.classList.add("listening");
    toast("Recording video…");
  } catch {
    toast("Camera unavailable — simulating");
  }
}

// ---------- Smart Escape Call ----------
function escapeCall(seconds) {
  toast(`📞 Incoming call from Mom… (${seconds}s)`, seconds * 1000);
  // Try to play a tone using WebAudio as a simulated ringtone
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeep = (delay) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + delay + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.4);
      o.start(ctx.currentTime + delay);
      o.stop(ctx.currentTime + delay + 0.45);
    };
    for (let i = 0; i < seconds; i++) playBeep(i * 0.8);
    setTimeout(() => ctx.close(), seconds * 1000 + 500);
  } catch {}
}

function showEscapeChoices() {
  const card = document.getElementById("escape-choices");
  if (card) card.style.display = card.style.display === "flex" ? "none" : "flex";
}

// ---------- Voice activation ----------
let recognition = null;
function toggleVoiceListen(btn) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    toast("Voice recognition not supported in this browser");
    return;
  }
  if (recognition) {
    recognition.stop(); recognition = null;
    btn.textContent = "🎤 Voice Activation";
    btn.classList.remove("listening");
    return;
  }
  recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  recognition.onresult = (e) => {
    const text = Array.from(e.results).map(r => r[0].transcript).join(" ").toLowerCase();
    if (text.includes("help me")) {
      recognition.stop(); recognition = null;
      btn.textContent = "🎤 Voice Activation";
      btn.classList.remove("listening");
      triggerSOS();
    }
  };
  recognition.onend = () => {
    if (recognition) { try { recognition.start(); } catch {} }
  };
  try {
    recognition.start();
    btn.textContent = "🎤 Listening… (say 'help me')";
    btn.classList.add("listening");
  } catch {
    toast("Could not start microphone");
    recognition = null;
  }
}

// ---------- Home page init ----------
function initHome() {
  requireAuth();
  document.getElementById("greet-name").textContent = Auth.user.name;
  getLocationText(document.getElementById("greet-loc"));

  document.getElementById("sos-btn").addEventListener("click", triggerSOS);
  document.getElementById("cancel-sos").addEventListener("click", cancelSOS);
  document.getElementById("audio-btn").addEventListener("click", (e) => toggleAudioRecording(e.currentTarget));
  document.getElementById("video-btn").addEventListener("click", (e) => toggleVideoRecording(e.currentTarget));
  document.getElementById("escape-btn").addEventListener("click", showEscapeChoices);
  document.getElementById("voice-btn").addEventListener("click", (e) => toggleVoiceListen(e.currentTarget));

  document.querySelectorAll("[data-escape]").forEach(b => {
    b.addEventListener("click", () => escapeCall(parseInt(b.dataset.escape, 10)));
  });
}

// ---------- Map page init ----------
function initMap() {
  requireAuth();
  // Simulated zone classification
  const zones = ["safe", "warn", "risk"];
  const labels = {
    safe: "✅ You are in a Safe area",
    warn: "⚠️ You are in a Moderate risk area",
    risk: "🚨 You are in a High risk area"
  };
  const z = zones[Math.floor(Math.random() * zones.length)];
  const banner = document.getElementById("zone-status");
  banner.classList.add(z);
  banner.textContent = labels[z];
}

// ---------- Contacts ----------
function loadContacts() {
  try { return JSON.parse(localStorage.getItem("hs_contacts") || "[]"); }
  catch { return []; }
}
function saveContacts(arr) { localStorage.setItem("hs_contacts", JSON.stringify(arr)); }

function renderContacts() {
  const list = document.getElementById("contact-list");
  const contacts = loadContacts();
  if (!contacts.length) {
    list.innerHTML = `<div class="empty-state">No emergency contacts yet.<br>Add one above.</div>`;
    return;
  }
  list.innerHTML = contacts.map((c, i) => `
    <div class="contact-item">
      <div class="contact-avatar">${c.name.charAt(0).toUpperCase()}</div>
      <div class="contact-info">
        <div class="name">${escapeHtml(c.name)}</div>
        <div class="num">${escapeHtml(c.number)}</div>
      </div>
      <button class="contact-del" data-i="${i}" aria-label="Delete">🗑</button>
    </div>
  `).join("");
  list.querySelectorAll(".contact-del").forEach(btn => {
    btn.addEventListener("click", () => {
      const arr = loadContacts();
      arr.splice(parseInt(btn.dataset.i, 10), 1);
      saveContacts(arr);
      renderContacts();
      toast("Contact deleted");
    });
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function initContacts() {
  requireAuth();
  renderContacts();
  document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("c-name").value.trim();
    const number = document.getElementById("c-num").value.trim();
    if (!name || !number) return;
    const arr = loadContacts();
    arr.push({ name, number });
    saveContacts(arr);
    e.target.reset();
    renderContacts();
    toast("Contact added");
  });
}

// ---------- Profile ----------
function initProfile() {
  requireAuth();
  const u = Auth.user;
  document.getElementById("p-name").textContent = u.name;
  document.getElementById("p-email").textContent = u.email;
  document.getElementById("p-avatar").textContent = u.name.charAt(0).toUpperCase();
  document.getElementById("logout-btn").addEventListener("click", () => {
    Auth.clear();
    localStorage.removeItem("hs_contacts");
    window.location.href = "index.html";
  });
}
