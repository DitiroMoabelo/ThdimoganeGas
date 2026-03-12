/**
 * Thedimogane Enterprises — LPG Gas Delivery
 * Main JavaScript
 */

const WA_NUMBER = '27715641872';

/* ─── Dark Mode ────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('teTheme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

function updateThemeIcon(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.innerHTML = theme === 'dark'
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
  btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

document.addEventListener('DOMContentLoaded', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  updateThemeIcon(current);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('teTheme', next);
      updateThemeIcon(next);
    });
  }
});

/* ─── Open WhatsApp Helper ─────────────────────── */
function openWhatsApp(message) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
}

/* ─── Sticky Header ────────────────────────────── */
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ─── Mobile Nav Toggle ────────────────────────── */
const navToggle = document.querySelector('.nav__toggle');
const navLinks  = document.querySelector('.nav__links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.innerHTML = open
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });
  // close on link click
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      navToggle.setAttribute('aria-expanded', false);
    });
  });
}

/* ─── Active Nav Link ──────────────────────────── */
(function setActiveLink() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === page || (page === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ─── Scroll Animations ────────────────────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

/* ─── Quick-Order Buttons (data-wa-order) ──────── */
document.querySelectorAll('[data-wa-order]').forEach(btn => {
  btn.addEventListener('click', () => {
    const size = btn.dataset.waOrder;
    const msg = `Hello Thedimogane Enterprises! 🔥\n\nI'd like to order a *${size}* gas refill.\n\nPlease confirm availability and delivery time. Thank you!`;
    openWhatsApp(msg);
  });
});

/* ─── Price Tab Switcher ───────────────────────── */
document.querySelectorAll('.price-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    document.querySelectorAll('.price-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.price-panel').forEach(p => p.style.display = 'none');
    tab.classList.add('active');
    const panel = document.getElementById(target);
    if (panel) panel.style.display = '';
  });
});

/* ─── Order Form ───────────────────────────────── */
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateOrderForm()) return;
    const data = getOrderFormData();
    const msg  = buildOrderMessage(data);
    openWhatsApp(msg);
  });
}

function validateOrderForm() {
  let valid = true;
  const required = orderForm.querySelectorAll('[required]');
  required.forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
  });
  if (!valid) {
    orderForm.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    alert('Please fill in all required fields before submitting.');
  }
  return valid;
}

function getOrderFormData() {
  const g = id => (document.getElementById(id)?.value || '').trim();
  const r = name => {
    const el = orderForm.querySelector(`[name="${name}"]:checked`);
    return el ? el.value : 'Not specified';
  };
  return {
    name:         g('customerName'),
    phone:        g('customerPhone'),
    address:      g('customerAddress'),
    size:         g('cylinderSize'),
    serviceType:  r('serviceType'),
    orderType:    r('orderType'),
    deliveryTime: g('deliveryTime'),
    notes:        g('orderNotes'),
  };
}

function buildOrderMessage(d) {
  return (
    `🔥 *NEW GAS ORDER — Thedimogane Enterprises*\n\n` +
    `👤 *Customer:* ${d.name}\n` +
    `📞 *Phone:* ${d.phone}\n` +
    `📍 *Address:* ${d.address || 'N/A'}\n\n` +
    `🛒 *Cylinder Size:* ${d.size}\n` +
    `🔧 *Service:* ${d.serviceType}\n` +
    `🚚 *Order Type:* ${d.orderType}\n` +
    `⏰ *Preferred Time:* ${d.deliveryTime || 'Flexible'}\n` +
    (d.notes ? `📝 *Notes:* ${d.notes}\n` : '') +
    `\nThank you! Please confirm my order.`
  );
}

/* ─── Contact Form ─────────────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = (document.getElementById('contactName')?.value || '').trim();
    const phone   = (document.getElementById('contactPhone')?.value || '').trim();
    const subject = (document.getElementById('contactSubject')?.value || '').trim();
    const message = (document.getElementById('contactMessage')?.value || '').trim();
    if (!name || !message) { alert('Please fill in your name and message.'); return; }
    const msg =
      `📩 *Message from Website*\n\n` +
      `👤 *Name:* ${name}\n` +
      (phone ? `📞 *Phone:* ${phone}\n` : '') +
      (subject ? `📌 *Subject:* ${subject}\n` : '') +
      `\n💬 *Message:*\n${message}`;
    openWhatsApp(msg);
  });
}

/* ─── Gas Reminder ─────────────────────────────── */
const REMINDER_KEY = 'teGasReminder';

const reminderForm = document.getElementById('reminderForm');
if (reminderForm) {
  populateReminderForm();
  reminderForm.addEventListener('submit', e => {
    e.preventDefault();
    const name    = (document.getElementById('reminderName')?.value || '').trim();
    const phone   = (document.getElementById('reminderPhone')?.value || '').trim();
    const size    = (document.getElementById('reminderSize')?.value || '').trim();
    const freq    = (document.getElementById('reminderFreq')?.value || '').trim();
    if (!name || !phone) { alert('Please enter your name and phone number.'); return; }
    saveReminderData({ name, phone, size, freq });

    const msg =
      `⏰ *Gas Reminder Sign-Up — Thedimogane Enterprises*\n\n` +
      `👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n` +
      `🔵 *Cylinder Size:* ${size || 'Not specified'}\n` +
      `📅 *Refill Frequency:* ${freq || 'Not specified'}\n\n` +
      `Please add me to your reminder list! Thank you.`;
    openWhatsApp(msg);
    updateReminderUI(true);
  });
}

function saveReminderData(data) {
  try { localStorage.setItem(REMINDER_KEY, JSON.stringify(data)); } catch (_) {}
}

function getReminderData() {
  try { const d = localStorage.getItem(REMINDER_KEY); return d ? JSON.parse(d) : null; } catch (_) { return null; }
}

function cancelReminder() {
  if (!confirm('Remove your gas reminder? You can sign up again anytime.')) return;
  try { localStorage.removeItem(REMINDER_KEY); } catch (_) {}
  updateReminderUI(false);
}

function populateReminderForm() {
  const data = getReminderData();
  if (!data) return;
  updateReminderUI(true);
}

function updateReminderUI(active) {
  const statusEl = document.getElementById('reminderStatus');
  const formEl   = document.getElementById('reminderForm');
  if (!statusEl) return;
  if (active) {
    const data = getReminderData();
    statusEl.style.display = 'block';
    statusEl.innerHTML =
      `<div class="alert alert--success"><i class="fas fa-check-circle"></i>
       Reminder active for <strong>${data?.name || 'you'}</strong> (${data?.size || 'your size'}).
       <button onclick="cancelReminder()" class="btn btn--sm" style="margin-left:auto;background:rgba(0,0,0,0.08);">
         <i class="fas fa-times"></i> Cancel
       </button></div>`;
    if (formEl) formEl.style.display = 'none';
  } else {
    statusEl.style.display = 'none';
    if (formEl) formEl.style.display = '';
  }
}

/* ─── FAQ Accordion ────────────────────────────── */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-question');
  if (!q) return;
  q.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    q.setAttribute('aria-expanded', open);
  });
});

/* ─── Smooth scroll for anchor links ──────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (navLinks?.classList.contains('open')) navLinks.classList.remove('open');
  });
});
