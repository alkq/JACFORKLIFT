// =========================================================================
// main.js - Enforces Dark Emerald Theme & Global UI Events (Pure JS)
// =========================================================================

// Configure Tailwind's runtime theme to the exact Dark Emerald Palette
if (window.tailwind) {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          brand: {
            light: '#059669',    /* Emerald 600 */
            DEFAULT: '#047857',  /* Deep Forest Emerald 700 */
            dark: '#065f46'      /* Deep Forest 800 */
          },
          obsidian: { DEFAULT: '#0B0F17', surface: '#161F2E', muted: '#475569', light: '#64748B' },
          gold: { DEFAULT: '#C5A059', light: '#D4AF37' }
        },
        boxShadow: {
          'soft-glow': '0 12px 30px -8px rgba(4, 120, 87, 0.45)'
        }
      }
    }
  };
}

// Mode Switcher for contact.html
function setInquiryMode(mode) {
  const equipRow = document.getElementById('equipmentLocationRow');
  const timeframeRow = document.getElementById('timeframeRow');
  const btnEquip = document.getElementById('btnModeEquipment');
  const btnPlain = document.getElementById('btnModePlain');
  const mainTitle = document.getElementById('formMainTitle');
  const subTitle = document.getElementById('formSubTitle');

  if (!btnEquip || !btnPlain) return;

  if (mode === 'equipment') {
    if (equipRow) equipRow.style.display = 'grid';
    if (timeframeRow) timeframeRow.style.display = 'block';
    btnEquip.classList.add('active');
    btnPlain.classList.remove('active');
    if (mainTitle) mainTitle.textContent = 'Request A Quote';
    if (subTitle) subTitle.textContent = 'Select your equipment parameters or submit a general technical inquiry.';
  } else {
    // Default: Plain Inquiry
    if (equipRow) equipRow.style.display = 'none';
    if (timeframeRow) timeframeRow.style.display = 'none';
    btnPlain.classList.add('active');
    btnEquip.classList.remove('active');
    if (mainTitle) mainTitle.textContent = 'General Technical Inquiry';
    if (subTitle) subTitle.textContent = 'Submit your general question and our Singapore engineering desk will reply within 1 business day.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Mobile & Desktop Search Toggles
  const searchToggle = document.getElementById('searchToggle');
  const searchBox = document.getElementById('searchBox');
  if (searchToggle && searchBox) {
    searchToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      searchBox.classList.toggle('hidden');
      if (!searchBox.classList.contains('hidden')) {
        setTimeout(() => searchBox.querySelector('input')?.focus(), 50);
      }
    });
    document.addEventListener('click', (e) => {
      if (!searchBox.contains(e.target) && !searchToggle.contains(e.target)) {
        searchBox.classList.add('hidden');
      }
    });
  }

  const mobileSearchToggle = document.getElementById('mobileSearchToggle');
  const mobileSearchBox = document.getElementById('mobileSearchBox');
  if (mobileSearchToggle && mobileSearchBox) {
    mobileSearchToggle.addEventListener('click', () => {
      mobileSearchBox.classList.toggle('hidden');
    });
  }

  // Mobile Menu Toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Mode Toggle Buttons on contact.html
  const btnEquip = document.getElementById('btnModeEquipment');
  const btnPlain = document.getElementById('btnModePlain');
  if (btnEquip) btnEquip.addEventListener('click', () => setInquiryMode('equipment'));
  if (btnPlain) btnPlain.addEventListener('click', () => setInquiryMode('plain'));

  // Handle URL Query Parameters on contact.html
  const formSection = document.getElementById('inquiry-form-section');
  if (formSection) {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    const equipParam = params.get('equipment');
    const modelParam = params.get('model');
    const locParam = params.get('location');

    // ONLY switch to equipment mode if explicit parameters require it
    if (modeParam === 'equipment' || equipParam || modelParam || locParam) {
      setInquiryMode('equipment');

      if (equipParam) {
        const selectEquip = document.getElementById('selectEquipment');
        if (selectEquip) {
          for (let i = 0; i < selectEquip.options.length; i++) {
            if (selectEquip.options[i].value.toLowerCase() === equipParam.toLowerCase()) {
              selectEquip.selectedIndex = i;
              break;
            }
          }
        }
      }

      if (locParam) {
        const selectLoc = document.getElementById('selectLocation');
        if (selectLoc) {
          for (let j = 0; j < selectLoc.options.length; j++) {
            if (selectLoc.options[j].value.toLowerCase() === locParam.toLowerCase()) {
              selectLoc.selectedIndex = j;
              break;
            }
          }
        }
      }

      if (modelParam) {
        const msgArea = document.getElementById('inquiryMessage');
        if (msgArea) {
          msgArea.value = `Interested in quotation for: ${modelParam}.\nPlease provide pricing and lead times.`;
        }
      }
    } else {
      // By default, always default to Plain Inquiry!
      setInquiryMode('plain');
    }

    // If navigated with hash or jump requested, scroll smoothly to the form
    if (window.location.hash === '#inquiry-form-section' || modeParam) {
      setTimeout(() => formSection.scrollIntoView({ behavior: 'smooth' }), 120);
    }
  }

  // Scroll Reveal Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // Initialize Leaflet Map on contact.html if container exists
  const mapContainer = document.getElementById('dealerMap');
  if (mapContainer && typeof L !== 'undefined') {
    const map = L.map('dealerMap', { zoomControl: false, attributionControl: false, scrollWheelZoom: false }).setView([1.3521, 103.8198], 11);
    if (typeof L.maplibreGL !== 'undefined') {
      L.maplibreGL({ style: 'https://tiles.openfreemap.org/styles/dark' }).addTo(map);
    }
    const icon = L.divIcon({ className: '', html: '<div style="width:16px;height:16px;background:#047857;border-radius:50%;border:2px solid #FFF;"></div>', iconSize: [16,16], iconAnchor: [8,8] });
    L.marker([1.3300, 103.7000], { icon }).addTo(map).bindPopup('<b>Jurong Industrial Hub</b>');
    setTimeout(() => map.invalidateSize(), 400);
  }
});

// Quick Inquiry Bar Form Submission Handler
function handleQuickInquiry(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const equip = document.getElementById('quickEquipSelect')?.value || '';
  const loc = document.getElementById('quickLocSelect')?.value || '';

  try {
    sessionStorage.setItem('pending_equip', equip);
    sessionStorage.setItem('pending_loc', loc);
  } catch(err) {}

  const params = new URLSearchParams();
  if (equip) params.set('equipment', equip);
  if (loc) params.set('location', loc);

  const queryStr = params.toString() ? '?' + params.toString() : '';
  window.location.href = 'contact.html' + queryStr;
}

// Global Filter & Dropdown Handlers for Products/Solutions Pages
function toggleProductDropdown() {
  const menu = document.getElementById('productDropdownMenu');
  const chevron = document.getElementById('productDropdownChevron');
  if(menu && chevron) {
    menu.classList.toggle('hidden');
    chevron.classList.toggle('rotate-180');
  }
}

function toggleDropdownMenu() {
  const menu = document.getElementById('filterDropdownMenu');
  const chevron = document.getElementById('dropdownChevron');
  if(menu && chevron) {
    menu.classList.toggle('hidden');
    chevron.classList.toggle('rotate-180');
  }
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  const container = btn.closest('section');
  if (!container) return;

  container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const activeTextEl = container.querySelector('#activeProductFilterText') || container.querySelector('#activeFilterText');
  if (activeTextEl) activeTextEl.textContent = btn.textContent;

  const menu = container.querySelector('#productDropdownMenu') || container.querySelector('#filterDropdownMenu');
  const chevron = container.querySelector('#productDropdownChevron') || container.querySelector('#dropdownChevron');
  if (menu) menu.classList.add('hidden');
  if (chevron) chevron.classList.remove('rotate-180');

  const f = btn.dataset.filter;
  const targetCards = document.querySelectorAll('.product-card, .solution-card');
  targetCards.forEach(card => {
    if(card.dataset.category) {
      card.style.display = (f === 'all' || card.dataset.category === f) ? 'flex' : 'none';
    }
  });
});

// Modal Handlers for Solutions page
const MODAL_DATA = {
  coldchain: { badge: "COLD CHAIN", title: "Sub-Zero Storage Logistics", pain: "Operating in -25°C freezers degrades standard batteries.", solution: "Sealed IP67 CATL LFP battery system with internal heating blankets." },
  heavy: { badge: "HEAVY METAL", title: "Steel Coils & Heavy Billets", pain: "Transporting 4–5 ton dense steel bundles demands massive starting torque.", solution: "JE Series with dual high-output AC drive motors delivering 100% torque." },
  stone: { badge: "STONE & CERAMIC", title: "Abrasive Dust & Heavy Tile Slabs", pain: "Granite and ceramic dust destroys engine air filters and alternator belts.", solution: "Enclosed brushless AC motors with zero belts or filters to clog." },
  dusty: { badge: "PAPER & RECYCLING", title: "Combustible Dust & Paper Bales", pain: "Hot diesel exhaust pipes present severe fire risks around scrap paper.", solution: "Zero-exhaust electric operation with fast opportunity charging." },
  chemical: { badge: "CHEMICAL", title: "Non-Gassing Chemical Facilities", pain: "Lead-acid battery rooms release hazardous explosive hydrogen gas.", solution: "Completely dry, sealed Lithium Iron Phosphate battery packs." },
  agv: { badge: "HIGH-BAY 3PL", title: "Narrow-Aisle 10M Stacking & AGVs", pain: "High land lease costs force facilities into 10-meter vertical heights.", solution: "Stand-type Reach Trucks and LiDAR SLAM-guided Stacking AGVs." }
};

function openModal(key) {
  const data = MODAL_DATA[key];
  if (!data) return;
  document.getElementById('modalIndustryBadge').textContent = data.badge;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalPainPoints').textContent = data.pain;
  document.getElementById('modalSolution').textContent = data.solution;
  const modal = document.getElementById('detailModal');
  if(modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeModal() {
  const modal = document.getElementById('detailModal');
  if(modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
  }
}