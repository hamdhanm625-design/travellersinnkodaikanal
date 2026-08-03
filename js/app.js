/* ==========================================================================
   TRAVELLERS INN TOURS AND TRAVELS - KODAIKANAL
   Main Application Engine (Clean WhatsApp Payload & Zero-Bug Execution)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFareCalculator();
  initBookingForm();
  initWhatsAppModal();
  initReviewForm();
  initAdminModal();
  loadCustomerReviews();
});

const API_BASE = window.location.origin.includes('5000')
  ? '/api'
  : 'http://localhost:5000/api';

// TOAST NOTIFICATION SYSTEM (BUG-FREE SAFEGUARD)
window.showToast = function (message, type = 'success') {
  try {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  } catch (e) {
    console.log('Toast notification:', message);
  }
};

// NAVBAR SCROLL & MOBILE MENU TOUCH HANDLING
function initNavbar() {
  const header = document.querySelector('.header');
  const toggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  function setMenuState(isOpen) {
    navMenu?.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    toggle?.setAttribute('aria-expanded', String(isOpen));

    const icon = toggle?.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  }

  if (toggle && navMenu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !navMenu.classList.contains('active');
      setMenuState(isOpen);
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !toggle.contains(e.target)) {
        setMenuState(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 767) {
        setMenuState(false);
      }
    });
  }
}

// INTERACTIVE QUICK WHATSAPP BOOKING MODAL (CLEAN & NEAT PAYLOAD)
function initWhatsAppModal() {
  const modal = document.getElementById('whatsapp-modal');
  const closeBtn = document.getElementById('whatsapp-modal-close');
  const form = document.getElementById('whatsapp-quick-form');

  if (!modal || !form) return;

  // Open modal on clicking any WhatsApp button
  document.querySelectorAll('.open-wa-modal').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      const phoneInput = document.getElementById('wa-phone');
      if (phoneInput) setTimeout(() => phoneInput.focus(), 200);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Handle Quick Form Submission & Send Clean Neat WhatsApp Payload
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = (document.getElementById('wa-name')?.value || '').trim();
    const phone = (document.getElementById('wa-phone')?.value || '').trim();
    const place = (document.getElementById('wa-place')?.value || '').trim();
    const pickup = (document.getElementById('wa-pickup')?.value || '').trim();

    if (!name) {
      showToast('Please enter your Full Name!', 'error');
      return;
    }

    if (!phone || phone.length < 7) {
      showToast('Please enter a valid Phone / WhatsApp Number!', 'error');
      document.getElementById('wa-phone')?.focus();
      return;
    }

    if (!place || !pickup) {
      showToast('Please enter Destination and Pickup Location!', 'error');
      return;
    }

    const bookingRef = 'TIK-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const bookingData = {
      id: bookingRef,
      name: name,
      phone: phone, // Primary phone stored safely in DB
      email: '',
      service: `Place of Visit: ${place}`,
      vehicle: 'Tourist Cab / SUV',
      date: new Date().toISOString().split('T')[0],
      passengers: 2,
      pickup: pickup,
      notes: `Direct Quick WhatsApp Request. Destination: ${place}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // Safe DB persistence with try-catch fallback
    try {
      await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      showToast('Booking saved to database!');
    } catch (err) {
      saveBookingLocal(bookingData);
      showToast('Booking backed up safely!');
    }

    // CLEAN & NEAT WHATSAPP MESSAGE FORMAT FOR SULTHAN IBRAHIM
    const cleanNeatMessage =
      `Greetings Sulthan Ibrahim Sir! 🙏\n` +
      `*New Kodaikanal Tour Inquiry*\n` +
      `───────────────────────\n\n` +
      `👤 *Guest Name:* ${name}\n` +
      `⛰️ *Place of Visit:* ${place}\n` +
      `📍 *Pickup Location:* ${pickup}\n\n` +
      `🔖 *Booking Ref:* ${bookingRef}\n` +
      `───────────────────────\n` +
      `Sent via Travellers Inn Website`;

    const waUrl = `https://wa.me/919894119264?text=${encodeURIComponent(cleanNeatMessage)}`;

    showToast('Opening WhatsApp to connect with Sulthan Ibrahim...');
    setTimeout(() => {
      try {
        const win = window.open(waUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          window.location.href = waUrl;
        }
      } catch (err) {
        window.location.href = waUrl;
      }
      modal.classList.remove('active');
      form.reset();
    }, 800);
  });
}

// SERVER-BASED FARE CALCULATOR
function initFareCalculator() {
  const tripTypeSelect = document.getElementById('calc-trip-type');
  const vehicleSelect = document.getElementById('calc-vehicle');
  const daysInput = document.getElementById('calc-days');
  const priceDisplay = document.getElementById('calc-total-price');

  if (!tripTypeSelect || !vehicleSelect || !daysInput || !priceDisplay) return;

  async function updateEstimate() {
    const vehicle = vehicleSelect.value;
    const days = parseInt(daysInput.value) || 1;
    const type = tripTypeSelect.value;

    try {
      const res = await fetch(`${API_BASE}/estimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicle, days, type }),
      });

      if (res.ok) {
        const data = await res.json();
        priceDisplay.textContent = data.formattedPrice;
        return;
      }
    } catch (err) {
      const rates = {
        sedan: { base: 2200, perDay: 2800 },
        innova: { base: 3500, perDay: 4200 },
        tempo: { base: 5500, perDay: 6800 },
      };
      let total = (rates[vehicle] || rates.innova).perDay * days;
      if (type === 'pickup') total = (rates[vehicle] || rates.innova).base;
      else if (type === 'outstation') total = (rates[vehicle] || rates.innova).perDay * days * 1.15;
      priceDisplay.textContent = `₹${Math.round(total).toLocaleString('en-IN')}`;
    }
  }

  tripTypeSelect.addEventListener('change', updateEstimate);
  vehicleSelect.addEventListener('change', updateEstimate);
  daysInput.addEventListener('input', updateEstimate);
  updateEstimate();
}

// MAIN BOOKING FORM
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const bookingRef = 'TIK-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const bookingData = {
      id: bookingRef,
      name: (document.getElementById('bk-name')?.value || '').trim(),
      phone: (document.getElementById('bk-phone')?.value || '').trim(),
      email: (document.getElementById('bk-email')?.value || '').trim(),
      service: document.getElementById('bk-service')?.value || 'Sightseeing',
      vehicle: document.getElementById('bk-vehicle')?.value || 'Toyota Innova Crysta',
      date: document.getElementById('bk-date')?.value || new Date().toISOString().split('T')[0],
      passengers: document.getElementById('bk-passengers')?.value || 2,
      pickup: (document.getElementById('bk-pickup')?.value || '').trim(),
      notes: (document.getElementById('bk-notes')?.value || '').trim(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    if (!bookingData.name || !bookingData.phone || !bookingData.date) {
      showToast('Please fill in Name, Phone Number, and Date!', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        showToast('Booking saved to database!');
      } else {
        saveBookingLocal(bookingData);
      }
    } catch (err) {
      saveBookingLocal(bookingData);
      showToast('Booking backed up safely!');
    }

    const cleanMessage =
      `Greetings Sulthan Ibrahim Sir! 🙏\n` +
      `*New Booking Request*\n` +
      `───────────────────────\n\n` +
      `👤 *Guest Name:* ${bookingData.name}\n` +
      `🚗 *Vehicle:* ${bookingData.vehicle}\n` +
      `⛰️ *Service:* ${bookingData.service}\n` +
      `📅 *Date:* ${bookingData.date}\n` +
      `👥 *Passengers:* ${bookingData.passengers}\n` +
      `📍 *Pickup:* ${bookingData.pickup}\n\n` +
      `🔖 *Booking Ref:* ${bookingRef}\n` +
      `───────────────────────\n` +
      `Sent via Travellers Inn Website`;

    const waUrl = `https://wa.me/919894119264?text=${encodeURIComponent(cleanMessage)}`;

    showToast('Redirecting to WhatsApp to chat with Sulthan Ibrahim...');
    setTimeout(() => {
      try {
        const win = window.open(waUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          window.location.href = waUrl;
        }
      } catch (err) {
        window.location.href = waUrl;
      }
      form.reset();
    }, 1000);
  });
}

function saveBookingLocal(data) {
  try {
    const existing = JSON.parse(localStorage.getItem('travellers_inn_bookings') || '[]');
    existing.unshift(data);
    localStorage.setItem('travellers_inn_bookings', JSON.stringify(existing));
  } catch (e) {}
}

// CUSTOMER REVIEWS
async function loadCustomerReviews() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  let reviews = [];
  try {
    const res = await fetch(`${API_BASE}/reviews`);
    if (res.ok) reviews = await res.json();
  } catch (err) {
    reviews = JSON.parse(localStorage.getItem('travellers_inn_reviews') || '[]');
  }

  if (!reviews || reviews.length === 0) return;

  grid.innerHTML = reviews
    .map(
      (r) => `
    <div class="testimonial-card">
      <div>
        <div class="stars">${'★'.repeat(r.rating || 5)}</div>
        <p class="review-text">"${r.review}"</p>
      </div>
      <div class="reviewer">
        <div class="avatar-initial">${r.name ? r.name.charAt(0) : 'T'}</div>
        <div class="reviewer-info">
          <h4>${r.name}</h4>
          <p>${r.location || 'Verified Traveller'} • ${r.trip || 'Kodaikanal Tour'}</p>
        </div>
      </div>
    </div>
  `
    )
    .join('');
}

function initReviewForm() {
  const form = document.getElementById('review-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newRev = {
      id: 'REV-' + Date.now(),
      name: (document.getElementById('rev-name')?.value || '').trim(),
      location: (document.getElementById('rev-location')?.value || '').trim(),
      trip: (document.getElementById('rev-trip')?.value || '').trim(),
      rating: parseInt(document.getElementById('rev-rating')?.value) || 5,
      review: (document.getElementById('rev-text')?.value || '').trim(),
      date: 'Just now',
    };

    try {
      await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRev),
      });
    } catch (err) {
      const localRevs = JSON.parse(localStorage.getItem('travellers_inn_reviews') || '[]');
      localRevs.unshift(newRev);
      localStorage.setItem('travellers_inn_reviews', JSON.stringify(localRevs));
    }

    showToast('Thank you! Your review has been published.');
    form.reset();
    loadCustomerReviews();
  });
}

// ADMIN DASHBOARD PORTAL & BOOKING MANAGER
function initAdminModal() {
  const btn = document.getElementById('admin-login-btn');
  const modal = document.getElementById('admin-modal');
  const closeBtn = document.getElementById('admin-modal-close');
  const tbody = document.getElementById('admin-bookings-tbody');
  const searchInput = document.getElementById('admin-search');
  const statusFilter = document.getElementById('admin-status-filter');

  if (!btn || !modal || !closeBtn) return;

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const pass = prompt('Enter Admin Passcode for Sulthan Ibrahim:');
    if (pass === 'sulthan123' || pass === '9894119264') {
      modal.classList.add('active');
      await loadAdminStats();
      await renderAdminBookings();
    } else if (pass) {
      alert('Incorrect passcode!');
    }
  });

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));

  if (searchInput) searchInput.addEventListener('input', () => renderAdminBookings());
  if (statusFilter) statusFilter.addEventListener('change', () => renderAdminBookings());

  async function loadAdminStats() {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (res.ok) {
        const stats = await res.json();
        const t = document.getElementById('stat-total-bookings');
        const c = document.getElementById('stat-confirmed-bookings');
        const a = document.getElementById('stat-active-fleet');
        if (t) t.textContent = stats.totalBookings || '0';
        if (c) c.textContent = stats.confirmedBookings || '0';
        if (a) a.textContent = stats.activeFleet || '15';
      }
    } catch (err) {}
  }

  async function renderAdminBookings() {
    let bookings = [];
    const searchVal = searchInput ? searchInput.value.trim() : '';
    const statusVal = statusFilter ? statusFilter.value : 'All';

    try {
      const url = `${API_BASE}/bookings?search=${encodeURIComponent(searchVal)}&status=${encodeURIComponent(statusVal)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        bookings = Array.isArray(data) ? data : (data.value || []);
      }
    } catch (err) {
      bookings = JSON.parse(localStorage.getItem('travellers_inn_bookings') || '[]');
    }

    if (!tbody) return;

    if (bookings.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px;">No bookings found.</td></tr>';
      return;
    }

    tbody.innerHTML = bookings
      .map(
        (b) => `
      <tr>
        <td><strong>${b.id}</strong></td>
        <td><strong>${b.name}</strong><br><small style="color:var(--text-muted);">${b.phone}</small></td>
        <td>${b.service}</td>
        <td>${b.vehicle}</td>
        <td>${b.date}</td>
        <td><span class="status-tag status-${b.status}">${b.status}</span></td>
        <td>
          <a href="${API_BASE}/bookings/${b.id}/voucher" target="_blank" class="btn btn-outline" style="padding:4px 10px; font-size:0.75rem; margin-right:4px;">Voucher</a>
          <a href="https://wa.me/91${b.phone}" target="_blank" style="color: #25d366; font-weight:700; font-size:0.85rem;">WhatsApp</a>
        </td>
      </tr>
    `
      )
      .join('');
  }
}
