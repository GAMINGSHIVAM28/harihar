/* ==========================================================================
   HARIHAR WHOLESALE PHARMACY - PRODUCTION-READY CORE SYSTEM
   Vanilla JavaScript | Zero External Dependencies | Enterprise Grade
   Technical Optimization: CSV Parsing | Cache Management | Error Handling | SEO | Theme Switcher
   ========================================================================== */

// Global State Management
let medicineData = [];
let activeCategory = 'all';
let globalConfig = null;

// Configuration Constants
const LIVE_CACHE_TTL = 1000 * 60 * 3; // 3 minutes
const FETCH_TIMEOUT = 7000;
const CACHE_STORAGE_KEY = 'harihar_med_stock_cache';

// Initialization Hook - DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  initThemeEngine(); // Injected Premium Theme Engine Loop
  initPageTransitions();
  initMobileMenu();
  initActiveLink();
  initSmoothScroll();
  initHeroMotion();
  initHeroCounters();
  
  await loadGlobalConfig();
  
  if (document.getElementById('medicine-grid')) {
    loadMedicineStock();
    initFilters();
  }
  
  if (document.getElementById('inquiry-form')) {
    initFormSubmission();
  }
});

/* ==========================================================================
   0. THEME SWITCHER ENGINE - AUTOMATIC PERSISTENCE & NATIVE SYSTEM VALUES
   ========================================================================== */

function initThemeEngine() {
  const themeToggleBtn = document.getElementById('themeToggle');
  
  // Initialize current theme configuration choice on first boot
  const savedTheme = localStorage.getItem('pharma-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }

  if (themeToggleBtn) {
    // Click event listener to seamlessly cycle states with subtle micro-scale triggers
    themeToggleBtn.addEventListener('click', () => {
      // Temporary scaling micro-interaction on press for mechanical feedback
      themeToggleBtn.style.transform = 'scale(0.90)';
      setTimeout(() => themeToggleBtn.style.transform = '', 100);
      
      // Toggle the target active class over the layout frame
      document.body.classList.toggle('dark');
      
      // Save state dynamically to localStorage persistent registry
      if (document.body.classList.contains('dark')) {
        localStorage.setItem('pharma-theme', 'dark');
      } else {
        localStorage.setItem('pharma-theme', 'light');
      }
    });
  }
}

/* ==========================================================================
   1. NAVIGATION & LAYOUT SYSTEMS - SPA-STYLE PAGE TRANSITIONS
   ========================================================================== */

function initPageTransitions() {
  const preloader = document.getElementById('site-preloader');
  if (!preloader) return;
  
  // Hide preloader after initial load
  setTimeout(() => { 
    preloader.classList.add('preload-hidden'); 
  }, 500); 

  // Intercept navigation links
  document.querySelectorAll('a:not([href^="#"]):not([target="_blank"]):not([href^="tel:"]):not([href^="https://wa.me"]):not([href^="mailto:"])').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetUrl = this.href;
      const isExternalDomain = !targetUrl.includes(window.location.hostname);
      
      if (!isExternalDomain && targetUrl && targetUrl !== '#') {
        e.preventDefault();
        preloader.classList.remove('preload-hidden');
        
        setTimeout(() => { 
          window.location.href = targetUrl; 
        }, 400);
      }
    });
  });
}

function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  // Toggle menu
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    hamburger.classList.toggle('toggle-burger');
  });

  // Close menu when link clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav-active');
      hamburger.classList.remove('toggle-burger');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    const isClickInside = navLinks.contains(event.target) || hamburger.contains(event.target);
    if (!isClickInside && navLinks.classList.contains('nav-active')) {
      navLinks.classList.remove('nav-active');
      hamburger.classList.remove('toggle-burger');
    }
  });
}

function initActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    const isActive = href === currentPage || (currentPage === '' && href === 'index.html');
    
    if (isActive) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initHeroMotion() {
  const hero = document.querySelector('.hero');
  const floatItems = document.querySelectorAll('.hero-animation-scene [data-float]');
  if (!hero || !floatItems.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 900) return;

  let isTicking = false;
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const relX = ((event.clientX - rect.left) / rect.width - 0.5) * 1.5;
    const relY = ((event.clientY - rect.top) / rect.height - 0.5) * 1.5;

    if (!isTicking) {
      window.requestAnimationFrame(() => {
        hero.style.setProperty('--hero-pointer-x', `${relX * 16}px`);
        hero.style.setProperty('--hero-pointer-y', `${relY * 12}px`);
        floatItems.forEach(item => {
          const depth = Number(item.dataset.float) || 1;
          item.style.transform = `translate3d(${relX * 10 * depth}px, ${relY * 8 * depth}px, 0)`;
        });
        isTicking = false;
      });
      isTicking = true;
    }
  });

  hero.addEventListener('pointerleave', () => {
    hero.style.removeProperty('--hero-pointer-x');
    hero.style.removeProperty('--hero-pointer-y');
    floatItems.forEach(item => {
      item.style.transform = '';
    });
  });
}

function initHeroCounters() {
  const counter = document.getElementById('hero-stock-count');
  if (!counter) return;

  const target = Number(counter.dataset.target) || 1300;
  const duration = 1400;
  const start = 0;
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.round(start + (target - start) * progress);
    counter.textContent = `${value.toLocaleString('en-IN')}+`;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

/* ==========================================================================
   2. CONFIGURATION LOADER - DYNAMIC SETTINGS INJECTION
   ========================================================================== */

async function loadGlobalConfig() {
  try {
    const response = await fetch('js/config.json');
    if (!response.ok) throw new Error('Config manifest unavailable');
    
    globalConfig = await response.json();
    applyConfigToUI();
  } catch (error) {
    console.error('Configuration system fallback activated:', error);
    
    // Fallback configuration
    globalConfig = {
      "contact": {
        "phone_number": "+91 99812 20777",
        "whatsapp_number": "919981220777"
      },
      "company": {
        "office_address": "Main Commercial Market, Bilaspur, Chhattisgarh, India"
      }
    };
    
    applyConfigToUI();
  }
}

function applyConfigToUI() {
  if (!globalConfig) return;

  // Initialize EmailJS if available
  if (globalConfig.emailjs?.enabled && globalConfig.emailjs?.public_key && typeof emailjs !== 'undefined') {
    try {
      emailjs.init(globalConfig.emailjs.public_key);
    } catch (e) {
      console.warn('EmailJS initialization skipped');
    }
  }

  // Normalize phone number for tel: links
  const contactPhone = globalConfig.contact?.phone_number || '+91 99812 20777';
  const whatsappNumber = globalConfig.contact?.whatsapp_number || '919981220777';
  const officeAddress = globalConfig.company?.office_address || 'Bilaspur, Chhattisgarh, India';
  
  const cleanPhoneDigits = contactPhone.replace(/[^0-9+]/g, '');
  const waLink = `https://wa.me/${whatsappNumber}`;

  // Update all UI elements that reference contact info
  const elementsToUpdate = [
    { id: 'cfg-wa-link', attr: 'href', value: waLink, textContent: contactPhone },
    { id: 'cfg-phone-link', attr: 'href', value: `tel:${cleanPhoneDigits}`, textContent: contactPhone },
    { id: 'hero-phone-btn', attr: 'href', value: `tel:${cleanPhoneDigits}` },
    { id: 'about-phone-btn', attr: 'href', value: `tel:${cleanPhoneDigits}` },
    { id: 'services-phone-btn', attr: 'href', value: `tel:${cleanPhoneDigits}` },
    { id: 'contact-phone-primary', attr: 'href', value: `tel:${cleanPhoneDigits}`, textContent: contactPhone },
    { id: 'contact-whatsapp-primary', attr: 'href', value: waLink, textContent: contactPhone },
    { id: 'contact-action-call', attr: 'href', value: `tel:${cleanPhoneDigits}` },
    { id: 'footer-call-link', attr: 'href', value: `tel:${cleanPhoneDigits}` },
    { id: 'footer-wa-link', attr: 'href', value: waLink }
  ];

  elementsToUpdate.forEach(({ id, attr, value, textContent }) => {
    const element = document.getElementById(id);
    if (element) {
      element.setAttribute(attr, value);
      if (textContent) element.textContent = textContent;
    }
  });

  // Update address fields
  const addressElements = [
    { id: 'contact-address-text' },
    { id: 'about-address-card', useFirst: true },
    { id: 'footer-address-slot', prefix: '📍 ' }
  ];

  addressElements.forEach(({ id, useFirst, prefix }) => {
    const element = document.getElementById(id);
    if (element) {
      const displayText = useFirst ? officeAddress.split(',')[0] : officeAddress;
      element.textContent = (prefix || '') + displayText;
    }
  });
}

/* ==========================================================================
   3. SPREADSHEET INGESTION & CSV PARSING ENGINE - ROBUST & TOLERANT
   ========================================================================== */

async function loadMedicineStock() {
  const grid = document.getElementById('medicine-grid');
  if (!grid) return;

  // Show loading state
  grid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 60px 0;" class="asset-fade">
      <div class="loader-pulse-ring" style="margin: 0 auto 16px auto; width: 60px; height: 60px;">
        <svg class="loader-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
      <p style="color: var(--text-light); font-weight: 600; font-family: var(--font-heading);">Syncing Live Inventory Feed...</p>
    </div>
  `;

  try {
    // Check local cache first
    const cachedData = getCachedMedicines();
    if (cachedData && cachedData.length > 0) {
      medicineData = cachedData;
      renderGrid(medicineData);
      return;
    }

    // Fetch from Google Sheets
    const csvUrl = globalConfig?.spreadsheet?.google_sheets_csv_url || 
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vR24zpS9ySVvneZbWIt0cV-uLT8eeMFiM0t5rDAhw5EvUMyHQkP-cq_x6NX0thq6uti67mfl84VwZfE/pub?gid=0&single=true&output=csv";
    
    const response = await fetchWithRetry(csvUrl, { timeout: FETCH_TIMEOUT }, 2);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const csvText = await response.text();
    medicineData = parseCSVToMedicines(csvText);

    if (medicineData.length === 0) throw new Error('No medicines extracted from CSV');

    // Cache for 3 minutes
    setCachedMedicines(medicineData);
    renderGrid(medicineData);
    
  } catch (error) {
    console.error('Live spreadsheet pipeline failed:', error);
    loadFallbackLocalStock();
  }
}

async function loadFallbackLocalStock() {
  const grid = document.getElementById('medicine-grid');
  
  try {
    const response = await fetch('js/medicines.json');
    if (!response.ok) throw new Error('Fallback JSON unavailable');
    
    medicineData = await response.json();
    renderGrid(medicineData);
    
  } catch (err) {
    console.error('Complete pipeline failure:', err);
    
    if (grid) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; background: linear-gradient(135deg, #FEE2E2, #FFEBEE); border-radius: 12px; color: #C62828; font-weight:600;">
          ⚠️ Inventory system updating. Please submit requirements via WhatsApp or contact our team directly.
        </div>`;
    }
  }
}

function parseCSVToMedicines(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];

  // Remove BOM if present
  if (csvText.charCodeAt(0) === 0xFEFF) csvText = csvText.slice(1);

  const lines = [];
  let row = [""];
  let inQuotes = false;

  // Manual CSV parsing
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push('');
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += char;
    }
  }
  
  if (row.length > 1 || row[0] !== '') lines.push(row);
  if (lines.length < 2) return [];

  // Process header row
  const rawHeaders = lines[0].map(h => h.trim());
  const headers = rawHeaders.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  const medicines = [];
  
  for (let j = 1; j < lines.length; j++) {
    const currentLine = lines[j];
    const obj = {};
    
    headers.forEach((header, index) => {
      obj[header] = currentLine[index] ? currentLine[index].trim() : '';
    });
    
    const name = obj.medicinename || obj.name || obj.medicine || '';
    const manufacturer = obj.manufacturer || obj.company || obj.mfg || '';
    const category = normalizeCategory(obj.category || obj.type || '');
    const packing = obj.packing || obj.pack || '';
    const availability = obj.availability || obj.qty || obj.stock || '';
    const status = obj.stockstatus || obj.status || obj.stock || 'Available';
    const code = obj.whatsappcode || obj.code || '';

    if (!name && !manufacturer) continue;

    medicines.push({
      medicineName: name || 'Unnamed Medicine',
      manufacturer: manufacturer || 'Unknown Manufacturer',
      category: category,
      packing: packing || 'Not specified',
      availability: availability || 'Check availability',
      stockStatus: status || 'In Stock',
      whatsappCode: code
    });
  }
  
  return medicines;
}

function normalizeCategory(value) {
  if (!value) return 'Uncategorized';
  
  const normalized = value.toString().trim().toLowerCase();
  
  const categoryMap = {
    'fever & pain relief': 'Tablets',
    'fever and pain relief': 'Tablets',
    'antibiotics': 'Capsules',
    'allergy & cold': 'Syrups',
    'allergy and cold': 'Syrups',
    'gastric & digestive': 'Syrups',
    'gastric and digestive': 'Syrups',
    'hydration & electrolytes': 'OTC Products',
    'hydration and electrolytes': 'OTC Products',
    'surgical & medical': 'Surgical',
    'surgical and medical': 'Surgical',
    'medical essentials': 'OTC Products',
    'vitamins & supplements': 'OTC Products',
    'vitamins and supplements': 'OTC Products',
    'tablets': 'Tablets',
    'capsules': 'Capsules',
    'syrups': 'Syrups',
    'injections': 'Injections',
    'surgical': 'Surgical',
    'generic medicines': 'Generic Medicines',
    'otc products': 'OTC Products'
  };

  if (categoryMap[normalized]) return categoryMap[normalized];
  return normalized.split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function renderGrid(items) {
  const grid = document.getElementById('medicine-grid');
  const noResults = document.getElementById('no-results');
  
  if (!grid) return;
  grid.innerHTML = '';
  
  if (items.length === 0) {
    if (noResults) {
      noResults.className = 'no-results-visible';
      grid.parentElement.appendChild(noResults);
    }
    return;
  }
  
  if (noResults) noResults.className = 'no-results-hidden';
  
  const fragment = document.createDocumentFragment();

  items.forEach(med => {
    let statusClass = 'status-instock';
    const medStatus = (med.stockStatus || 'Available').toLowerCase();
    
    if (medStatus.includes('low') || medStatus.includes('limited')) {
      statusClass = 'status-lowstock';
    } else if (medStatus.includes('out') || medStatus === 'unavailable') {
      statusClass = 'status-out';
    }

    const card = document.createElement('div');
    card.className = 'card product-card asset-fade';
    
    const categoryDisplay = escapeHtml(med.category || 'Medical');
    
    card.innerHTML = `
      <div class="card-image" style="background: linear-gradient(135deg, #2563EB, #1e40af); display: flex; align-items: center; justify-content: center; position: relative; height: 160px;">
        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" style="position: absolute; pointer-events: none;">
          <path d="M4.5 16.5c-1.5 0-2.5-1-2.5-2.5s1-2.5 2.5-2.5h15c1.5 0 2.5 1 2.5 2.5s-1 2.5-2.5 2.5z"/><path d="M10 11.5V6.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5v5"/>
        </svg>
        <span style="font-family: var(--font-heading); color: rgba(255,255,255,0.85); font-weight: 700; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.8px; padding: 0 16px; text-align: center; z-index: 2; text-shadow: 0 2px 6px rgba(0,0,0,0.2);">${categoryDisplay}</span>
      </div>
      <div class="card-body">
        <span class="stock-status ${statusClass}">${escapeHtml(med.stockStatus || 'Available')}</span>
        <h3 class="med-title">${escapeHtml(med.medicineName)}</h3>
        <p class="med-meta">Mfg: <strong>${escapeHtml(med.manufacturer)}</strong></p>
        <p class="med-meta" style="font-size:0.8rem; color: var(--text-light);">Pack: ${escapeHtml(med.packing)} | Qty: ${escapeHtml(med.availability)}</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: auto;">
          <a href="inquiry.html" class="btn btn-outline" style="padding: 10px; font-size: 0.8rem;">Get Quote</a>
          <button class="btn btn-primary-whatsapp" style="padding: 10px; font-size: 0.8rem;" data-med-name="${escapeHtml(med.medicineName)}" data-med-company="${escapeHtml(med.manufacturer)}" data-med-code="${escapeHtml(med.whatsappCode || '')}">WhatsApp</button>
        </div>
      </div>
    `;
    
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);

  if (!grid.__waHandler) {
    grid.__waHandler = function (e) {
      const btn = e.target.closest('.btn-primary-whatsapp');
      if (!btn) return;
      
      const name = btn.getAttribute('data-med-name') || '';
      const company = btn.getAttribute('data-med-company') || '';
      const code = btn.getAttribute('data-med-code') || '';
      
      sendCustomWhatsAppInquiry(name, company, code);
    };
    grid.addEventListener('click', grid.__waHandler);
  }
}

/* ==========================================================================
   4. FILTER & SEARCH SYSTEM - HIGH-PERFORMANCE REAL-TIME QUERIES
   ========================================================================== */

function initFilters() {
  const searchInput = document.getElementById('medicine-search');
  const filterContainer = document.getElementById('filter-btn-container');

  if (searchInput) {
    searchInput.addEventListener('input', debounce(filterInventory, 200));
    searchInput.addEventListener('keyup', (e) => { 
      if (e.key === 'Enter') filterInventory(); 
    });
  }

  if (filterContainer) {
    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      
      filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category') || 'all';
      filterInventory();
    });
  }
}

function filterInventory() {
  const searchInput = document.getElementById('medicine-search');
  const wrapper = document.querySelector('.search-filter-panel');
  if (wrapper) wrapper.classList.add('searching');

  const query = (searchInput?.value || '').toLowerCase().trim();
  const activeCat = (activeCategory || 'all').toLowerCase().trim();
  
  const filtered = medicineData.filter(med => {
    const medCat = normalizeCategory(med.category || '').toLowerCase().trim();
    
    const searchableFields = [
      med.medicineName,
      med.manufacturer,
      medCat,
      med.packing,
      med.stockStatus
    ];
    
    const matchesSearch = query === '' || searchableFields.some(field => 
      field && field.toLowerCase().includes(query)
    );
    
    const matchesCategory = activeCat === 'all' || medCat === activeCat;
    
    return matchesSearch && matchesCategory;
  });
  
  renderGrid(filtered);

  setTimeout(() => {
    const wrapper = document.querySelector('.search-filter-panel');
    if (wrapper) wrapper.classList.remove('searching');
  }, 550);
}

/* ==========================================================================
   5. FORM SUBMISSION & VALIDATION - SECURE & ROBUST
   ========================================================================== */

function initFormSubmission() {
  const form = document.getElementById('inquiry-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateInquiryForm()) return;

    const submitBtn = document.getElementById('submit-email-btn') || form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const formData = {
      from_name: document.getElementById('full-name')?.value.trim() || '',
      business_name: document.getElementById('business-name')?.value.trim() || '',
      mobile_number: document.getElementById('mobile-number')?.value.trim() || '',
      city_location: document.getElementById('city')?.value.trim() || '',
      required_medicines: document.getElementById('required-medicines')?.value.trim() || '',
      bulk_quantity: document.getElementById('quantity')?.value.trim() || '',
      additional_message: document.getElementById('message')?.value.trim() || ''
    };

    if (globalConfig?.emailjs?.enabled && globalConfig?.emailjs?.service_id && typeof emailjs !== 'undefined') {
      emailjs.send(
        globalConfig.emailjs.service_id,
        globalConfig.emailjs.template_id,
        formData
      )
      .then(() => {
        showFormAlert('✓ Inquiry submitted successfully! Our team will respond within 2 hours.', '#2E7D32', '#E8F5E9');
        form.reset();
      })
      .catch((err) => {
        console.error('Form submission error:', err);
        showFormAlert('⚠️ Unable to submit via email. Please use WhatsApp below.', '#C62828', '#FFEBEE');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
    } else {
      setTimeout(() => {
        showFormAlert('✓ Inquiry received! Please check our WhatsApp within 2 hours.', '#2E7D32', '#E8F5E9');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1200);
    }
  });
}

function validateInquiryForm() {
  clearFormErrors();
  let isValid = true;

  const requiredFields = [
    { id: 'full-name', label: 'Full Name' },
    { id: 'business-name', label: 'Business Name' },
    { id: 'mobile-number', label: 'Mobile Number' },
    { id: 'city', label: 'City' },
    { id: 'required-medicines', label: 'Required Medicines' },
    { id: 'quantity', label: 'Quantity' }
  ];

  requiredFields.forEach(({ id, label }) => {
    const field = document.getElementById(id);
    if (!field || !field.value.trim()) {
      showFieldError(id, `${label} is required`);
      isValid = false;
    }
  });

  const phoneField = document.getElementById('mobile-number');
  if (phoneField && isValid) {
    const cleanNum = phoneField.value.replace(/[^0-9]/g, '');
    if (cleanNum.length !== 10) {
      showFieldError('mobile-number', 'Please enter a valid 10-digit Indian mobile number');
      isValid = false;
    }
  }

  return isValid;
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.style.cssText = 'color: #C62828; font-size: 0.8rem; margin-top: 4px; font-weight: 500;';
  errorDiv.textContent = message;
  
  field.parentElement.appendChild(errorDiv);
  field.style.borderColor = '#C62828';
}

function clearFormErrors() {
  document.querySelectorAll('.field-error').forEach(err => err.remove());
  document.querySelectorAll('input, textarea, select').forEach(field => {
    field.style.borderColor = '';
  });
}

function showFormAlert(message, textColor, bgColor) {
  const slot = document.getElementById('form-alert-slot');
  if (slot) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'asset-fade';
    alertDiv.style.cssText = `
      background-color: ${bgColor};
      color: ${textColor};
      padding: 18px 24px;
      border-radius: 8px;
      font-weight: 600;
      margin-bottom: 24px;
      font-size: 0.95rem;
      border-left: 4px solid ${textColor};
    `;
    alertDiv.textContent = message;
    
    slot.innerHTML = '';
    slot.appendChild(alertDiv);
    
    slot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ==========================================================================
   6. WHATSAPP INTEGRATION - CONTEXT-AWARE MESSAGE BUILDERS
   ========================================================================== */

function sendCustomWhatsAppInquiry(medName, company, whatsappCode) {
  let waNum = globalConfig?.contact?.whatsapp_number || '919981220777';
  
  waNum = String(waNum).replace(/[^0-9+]/g, '');
  if (!waNum.startsWith('+') && waNum.length === 10) waNum = '91' + waNum;
  waNum = waNum.replace(/^\+/, '');

  const codeText = whatsappCode ? ` [Product Code: ${escapeHtml(whatsappCode)}]` : '';
  const message = `Hello Harihar Wholesale Pharmacy,

I'm interested in bulk stock of:
• Medicine: ${escapeHtml(medName)}${codeText}
• Manufacturer: ${escapeHtml(company)}

Please provide commercial pricing and availability confirmation.

Thank you!`;

  try {
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  } catch (e) {
    console.error('WhatsApp link error:', e);
  }
}

function submitFormViaWhatsApp() {
  if (!validateInquiryForm()) return;
  
  const waNum = normalizeWhatsAppNumber(globalConfig?.contact?.whatsapp_number);
  const getFieldValue = (id) => document.getElementById(id)?.value.trim() || '';
  
  const message = `Hello Harihar Wholesale Pharmacy,

B2B Procurement Request:

Contact: ${escapeHtml(getFieldValue('full-name'))}
Business: ${escapeHtml(getFieldValue('business-name'))}
Phone: ${escapeHtml(getFieldValue('mobile-number'))}
Location: ${escapeHtml(getFieldValue('city'))}

Required Medicines: ${escapeHtml(getFieldValue('required-medicines'))}
Quantity: ${escapeHtml(getFieldValue('quantity'))}

Additional Details: ${escapeHtml(getFieldValue('message'))}

Please respond with billing estimates and availability.`;

  window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
}

function sendWhatsAppContact() {
  const waNum = normalizeWhatsAppNumber(globalConfig?.contact?.whatsapp_number);
  const message = "Hello Harihar Wholesale Pharmacy, I'd like to know more about your bulk medicine supply services. Please share your catalog and pricing details.";
  
  try {
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  } catch (e) {
    console.error('WhatsApp error:', e);
  }
}

/* ==========================================================================
   7. UTILITY FUNCTIONS - SECURITY & PERFORMANCE
   ========================================================================== */

function escapeHtml(text) {
  if (!text) return '';
  const escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, char => escapeMap[char]);
}

async function fetchWithRetry(url, { timeout = 5000 } = {}, retries = 1) {
  try {
    return await fetchWithTimeout(url, timeout);
  } catch (err) {
    if (retries > 0) {
      return fetchWithRetry(url, { timeout }, retries - 1);
    }
    throw err;
  }
}

function fetchWithTimeout(resource, ms = 5000) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error('Request timed out')), ms);
    
    fetch(resource)
      .then(res => {
        clearTimeout(timeoutId);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
}

function normalizeWhatsAppNumber(num) {
  let wa = String(num || '919981220777');
  wa = wa.replace(/[^0-9+]/g, '');
  if (!wa.startsWith('+') && wa.length === 10) {
    wa = '91' + wa;
  }
  wa = wa.replace(/^\+/, '');
  return wa || '919981220777';
}

function debounce(fn, wait) {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), wait);
  };
}

function getCachedMedicines() {
  try {
    const cached = localStorage.getItem(CACHE_STORAGE_KEY);
    if (!cached) return null;
    
    const { timestamp, data } = JSON.parse(cached);
    const isExpired = (Date.now() - timestamp) > LIVE_CACHE_TTL;
    
    if (isExpired) {
      localStorage.removeItem(CACHE_STORAGE_KEY);
      return null;
    }
    return Array.isArray(data) ? data : null;
  } catch (e) {
    console.warn('Cache read error:', e);
    return null;
  }
}

function setCachedMedicines(data) {
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: data
    }));
  } catch (e) {
    console.warn('Cache write error:', e);
  }
}