# TRAVELLERS INN TOURS AND TRAVELS - KODAIKANAL

Modern, 3D Animated Web Application for **TRAVELLERS INN TOURS AND TRAVELS**, based in **Kodaikanal, Tamil Nadu**.

- **Founder & CEO**: Sulthan Ibrahim (30+ Years Experience)
- **Phone / WhatsApp**: 9894119264

---

## 🌟 Key Features

1. **Scenic 3D WebGL Mountain Road Canvas**:
   - Interactive Three.js WebGL scene with low-poly Kodaikanal mountain peaks, pine trees, winding hill road, and a smooth 3D tourist vehicle cab driving continuously.
   - Volumetric 3D floating mist/cloud particles that react dynamically to mouse movement and scrolling.

2. **Interactive 3D Kodaikanal Route & Map Experience**:
   - 3D terrain map with interactive glowing beacon pins for iconic tourist locations:
     - Coaker's Walk
     - Kodaikanal Lake
     - Pillar Rocks
     - Guna Caves (Devil's Kitchen)
     - Pine Forest
     - Silver Cascade Falls
   - Smooth camera panning and hotspot info cards.

3. **CEO Spotlight & Legacy**:
   - Highlighting Founder **Sulthan Ibrahim**'s 30 years of hill driving expertise and customer hospitality.

4. **Complete Services & Fleet Estimator**:
   - Local sightseeing, Airport/Train transfers (Madurai, Dindigul, Coimbatore), Honeymoon packages, Family/Group Tempo Travellers, Custom itineraries, and Reliable Driver hiring.
   - Interactive fare estimation calculator.

5. **REST API Backend & Persistence**:
   - Built-in PowerShell REST server (`server.ps1`) running on `http://localhost:5000`.
   - Endpoints:
     - `POST /api/bookings` & `GET /api/bookings`
     - `POST /api/reviews` & `GET /api/reviews`
     - `GET /api/health`
   - Data stored in `data/bookings.json` and `data/reviews.json`.
   - Auto-formats WhatsApp trip payloads directly to **+91 9894119264**.

6. **Admin Management Dashboard**:
   - Modal portal accessible via top navigation (Passcode: `sulthan123` or `9894119264`).
   - View, filter, and track all guest tour bookings.

---

## 🚀 How to Run

### Option 1: Live Server with Backend API
Double click `start-server.bat` or run in terminal:
```powershell
powershell -ExecutionPolicy Bypass -File server.ps1 -Port 5000
```
Then open `http://localhost:5000` in your web browser.

### Option 2: Static Viewing
Simply open `index.html` in any modern browser. (Client side automatically uses LocalStorage if backend server is offline).
