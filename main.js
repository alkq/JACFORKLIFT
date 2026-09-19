// =========================================================================
// main.js - JAC Forklift Singapore Global Logic & UI Engine (Pure JS)
// =========================================================================

// Configure Tailwind's runtime theme to the exact Dark Emerald Palette
if (window.tailwind) {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            DEFAULT: '#FFFFFF'
          },
          brand: {
            light: '#059669',    /* Emerald 600 */
            DEFAULT: '#047857',  /* Deep Forest Emerald 700 */
            dark: '#065f46'      /* Deep Forest 800 */
          },
          obsidian: {
            DEFAULT: '#0B0F17',
            surface: '#161F2E',
            muted: '#475569',
            light: '#64748B'
          },
          gold: {
            DEFAULT: '#C5A059',
            light: '#D4AF37'
          }
        },
        fontFamily: {
          heading: ['Montserrat', 'sans-serif'],
          body: ['Inter', 'sans-serif']
        },
        boxShadow: {
          'soft-glow': '0 12px 30px -8px rgba(4, 120, 87, 0.45)',
          'luxe': '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 2px 8px -2px rgba(15, 23, 42, 0.04)',
          'luxe-hover': '0 24px 50px -10px rgba(15, 23, 42, 0.14), 0 8px 20px -4px rgba(15, 23, 42, 0.06)'
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
    if (equipRow) equipRow.style.display = 'none';
    if (timeframeRow) timeframeRow.style.display = 'none';
    btnPlain.classList.add('active');
    btnEquip.classList.remove('active');
    if (mainTitle) mainTitle.textContent = 'General Technical Inquiry';
    if (subTitle) subTitle.textContent = 'Submit your general question and our Singapore engineering desk will reply within 1 business day.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject Floating WhatsApp Button (Connects directly to Alvin)
  initWhatsAppButton();

  // 2. Mobile & Desktop Search Toggles
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

  // 3. Mobile Menu Toggle
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 4. Mode Toggle Buttons on contact.html
  const btnEquip = document.getElementById('btnModeEquipment');
  const btnPlain = document.getElementById('btnModePlain');
  if (btnEquip) btnEquip.addEventListener('click', () => setInquiryMode('equipment'));
  if (btnPlain) btnPlain.addEventListener('click', () => setInquiryMode('plain'));

  // 5. Handle URL Query Parameters on contact.html
  const formSection = document.getElementById('inquiry-form-section');
  if (formSection) {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    const equipParam = params.get('equipment');
    const modelParam = params.get('model');
    const locParam = params.get('location');

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
          const searchParam = locParam.toLowerCase().trim();
          for (let j = 0; j < selectLoc.options.length; j++) {
            const optVal = selectLoc.options[j].value.toLowerCase().trim();
            const optText = selectLoc.options[j].text.toLowerCase().trim();
            if (optVal === searchParam || optText.includes(searchParam)) {
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
      setInquiryMode('plain');
    }

    if (window.location.hash === '#inquiry-form-section' || modeParam) {
      setTimeout(() => formSection.scrollIntoView({ behavior: 'smooth' }), 120);
    }
  }

  // 6. Scroll Reveal Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // 7. Initialize Leaflet Map on contact.html
  const mapContainer = document.getElementById('dealerMap');
  if (mapContainer && typeof L !== 'undefined') {
    const map = L.map('dealerMap', {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: !L.Browser.mobile
    }).setView([1.3400, 103.8000], 11);

    L.control.zoom({ position: 'topright' }).addTo(map);

    map.on('click', () => {
      map.scrollWheelZoom.enable();
    });

    map.on('mouseout', () => {
      map.scrollWheelZoom.disable();
    });

    L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 16,
      attribution: 'Esri'
    }).addTo(map);

    const makeIcon = (color = '#047857') => L.divIcon({
      className: '',
      html: `<div style="width:18px;height:18px;background:${color};border-radius:50%;border:3px solid #FFF;box-shadow:0 4px 12px rgba(4,120,87,0.5);"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -10]
    });

    const locations = [
      {
        name: 'HQ SG · JAC Equipment Pte. Ltd.',
        address: '60 Paya Lebar Road, #06-28, Paya Lebar Square, Singapore 409051',
        coords: [1.3180, 103.8920],
        color: '#047857'
      },
      {
        name: 'Fabrication Workshop',
        address: '15 Pioneer Road North, #01-79, Singapore 628464',
        coords: [1.3280, 103.6980],
        color: '#059669'
      },
      {
        name: 'Forklift Centre',
        address: 'The Index, 110 Tuas Ave 3, #03-04, Singapore 637369',
        coords: [1.3250, 103.6420],
        color: '#059669'
      }
    ];

    const markerBounds = [];

    locations.forEach(loc => {
      const marker = L.marker(loc.coords, { icon: makeIcon(loc.color) }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif;min-width:220px;">
          <div style="font-weight:800;font-size:13px;color:#0B0F17;margin-bottom:4px;">${loc.name}</div>
          <div style="font-size:11px;color:#64748B;line-height:1.5;">${loc.address}</div>
        </div>
      `, { closeButton: false, maxWidth: 260 });
      markerBounds.push(loc.coords);
    });

    if (markerBounds.length > 1) {
      map.fitBounds(markerBounds, { padding: [60, 60], maxZoom: 13 });
    }

    setTimeout(() => map.invalidateSize(), 400);
  }

  initHeroSlider();
  initProductSpecPage();
});

// =========================================================================
// FLOATING WHATSAPP BUTTON WITH AUTHENTIC WHATSAPP ICON
// =========================================================================
function initWhatsAppButton() {
  if (document.getElementById('jacWhatsAppFloat')) return;

  const phoneClean = "60138188181";
  const defaultText = encodeURIComponent("Hello Alvin, I am interested in JAC electric forklifts and would like to learn more about your equipment options.");

  const waBtn = document.createElement('a');
  waBtn.id = 'jacWhatsAppFloat';
  waBtn.href = `https://wa.me/${phoneClean}?text=${defaultText}`;
  waBtn.target = "_blank";
  waBtn.rel = "noopener noreferrer";
  waBtn.setAttribute('aria-label', 'Chat with Alvin on WhatsApp');

  waBtn.className = "fixed bottom-6 left-6 z-[99999] flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-3 rounded-full shadow-[0_12px_28px_rgba(37,211,102,0.4)] transition-all hover:scale-105 group";
  waBtn.innerHTML = `
    <svg class="w-6 h-6 fill-current shrink-0" viewBox="0 0 448 512">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
    </svg>
    <span class="font-heading font-bold text-xs uppercase tracking-wider hidden sm:inline-block">Chat with Us</span>
  `;

  document.body.appendChild(waBtn);
}

// Hero Slider Engine
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  const heroData = [
    { range: "Heavy Duty Range", title: "HE Series · 2.5 - 3.8 Ton", desc: "Equipped with LFP chemistry, instant torque response, and 1.5-hour rapid opportunity charging.", tag: "CATL / LFP Cells", link: "product-spec.html?id=he-series" },
    { range: "Smart Warehouse Range", title: "L Series · 1.5 - 3.5 Ton", desc: "Versatile smart forklift for indoor and outdoor operations with zero emissions and 1.5-hour fast charging.", tag: "Smart CAN-bus Control", link: "product-spec.html?id=l-series" },
    { range: "High-Bay Range", title: "Stand Reach Truck · 1.5 Ton · 10M", desc: "Maximise vertical racking density with 10-meter lift capacity in ultra-narrow 1.8m aisles.", tag: "Narrow-Aisle 1.8m", link: "product-spec.html?id=reach-truck-stand" },
    { range: "Heavy Electric Range", title: "JE Series · 4.5 - 5.0 Ton", desc: "Diesel-grade power delivered with dual AC motors. Built for steel, stone, and heavy industrial logistics.", tag: "Dual AC Motors", link: "product-spec.html?id=je-series" }
  ];

  const dots = document.querySelectorAll('.hero-dot');
  const titleEl = document.getElementById('heroTitle');
  const descEl = document.getElementById('heroDesc');
  const rangeEl = document.getElementById('heroRange');
  const tagEl = document.getElementById('heroTag');
  const linkEl = document.getElementById('heroLink');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  const showcase = document.getElementById('heroShowcase');

  let current = 0;
  let autoTimer = null;
  const AUTOPLAY_MS = 5500;

  function goTo(index) {
    const prev = current;
    current = (index + slides.length) % slides.length;
    const goingForward = (current === (prev + 1) % slides.length);

    slides.forEach((slide, i) => {
      slide.classList.remove('translate-x-0', 'translate-x-full', '-translate-x-full', 'opacity-0', 'opacity-100');
      if (i === current) {
        slide.classList.add('translate-x-0', 'opacity-100');
      } else if (i === prev) {
        slide.classList.add(goingForward ? '-translate-x-full' : 'translate-x-full', 'opacity-0');
      } else {
        slide.classList.add('translate-x-full', 'opacity-0');
      }
    });

    dots.forEach((dot, i) => {
      const isActive = i === current;
      dot.classList.toggle('bg-white', isActive);
      dot.classList.toggle('bg-white/50', !isActive);
      dot.style.width = isActive ? '18px' : '6px';
    });

    [titleEl, descEl, rangeEl, tagEl].forEach(el => { if (el) el.style.opacity = '0'; });
    setTimeout(() => {
      const d = heroData[current];
      if (rangeEl) rangeEl.textContent = d.range;
      if (titleEl) titleEl.textContent = d.title;
      if (descEl) descEl.textContent = d.desc;
      if (tagEl) tagEl.textContent = d.tag;
      if (linkEl) linkEl.href = d.link;
      [titleEl, descEl, rangeEl, tagEl].forEach(el => { if (el) el.style.opacity = '1'; });
    }, 200);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  dots.forEach(dot => dot.addEventListener('click', () => {
    goTo(parseInt(dot.dataset.index));
    startAuto();
  }));

  if (showcase) {
    showcase.addEventListener('mouseenter', stopAuto);
    showcase.addEventListener('mouseleave', startAuto);
  }

  let touchStartX = 0;
  if (showcase) {
    showcase.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    showcase.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? next() : prev();
        startAuto();
      }
    }, { passive: true });
  }

  goTo(0);
  startAuto();
}

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

// =========================================================================
// FULL MODAL DATA & HANDLERS FOR solution.html
// =========================================================================
const MODAL_DATA = {
  coldchain: {
    badge: "COLD CHAIN & FOOD",
    title: "Sub-Zero Storage Logistics (-25°C)",
    pain: "Operating in -25°C blast freezers rapidly degrades traditional battery life and causes condensation in electronic controllers. Exhaust fumes are prohibited around open food pallets.",
    solution: "Sealed IP67 CATL LFP battery system with internal heating blankets. Maintains 100% full lift and drive speed with zero emissions and anti-corrosive stainless mast components.",
    equipment: "JAC HE25 (2.5T) or Stand-Type Reach Truck 10M",
    link: "product-spec.html?id=he-series"
  },
  heavy: {
    badge: "HEAVY METAL & STEEL",
    title: "Steel Coils & Heavy Billets Handling",
    pain: "Transporting 4–5 ton dense steel bundles demands massive starting torque on steep yard ramps without engine lag, while diesel engines incur deafening noise and high fuel bills.",
    solution: "JE Series (4.5–5.0T) with dual high-output AC drive motors delivering 100% torque from 0 RPM. Cuts fuel costs by 60% with zero emissions.",
    equipment: "JAC JE50 Heavy-Duty Electric (5.0 Ton)",
    link: "product-spec.html?id=je-series"
  },
  stone: {
    badge: "STONE & CERAMIC",
    title: "Abrasive Dust & Heavy Tile Slabs",
    pain: "Granite and ceramic dust destroys engine air filters, alternator belts, and radiator fins. Heavy ceramic pallets require micro-inching hydraulic control to prevent cracking.",
    solution: "Enclosed brushless AC motors with zero belts, radiators, or filters to clog. Proportional micro-hydraulic valves ensure smooth, shock-free pallet handling.",
    equipment: "JAC HE35 (3.5T Counterbalance)",
    link: "product-spec.html?id=he-series"
  },
  dusty: {
    badge: "PAPER & RECYCLING",
    title: "Combustible Dust & Paper Bales",
    pain: "Hot diesel exhaust pipes present severe fire risks around combustible scrap paper and shredding dust. 22-hour non-stop recycling yards suffer battery swapping downtime.",
    solution: "Zero-exhaust electric operation eliminates fire ignition points. Fast 1.5-hour opportunity charging powers non-stop multi-shift schedules without battery swaps.",
    equipment: "JAC HE30 with Paper Roll / Bale Clamp",
    link: "product-spec.html?id=he-series"
  },
  chemical: {
    badge: "CHEMICAL & CLEANROOM",
    title: "Non-Gassing Chemical Facilities",
    pain: "Lead-acid battery charging rooms release hazardous explosive hydrogen gas. Cleanrooms cannot tolerate acid vapors, hydraulic oil leaks, or diesel soot.",
    solution: "Completely dry, sealed Lithium Iron Phosphate battery packs emit zero hydrogen gas during charging. Can be charged anywhere in the facility without dedicated charging rooms.",
    equipment: "JAC L20 Smart Warehouse Lithium Forklift",
    link: "product-spec.html?id=l-series"
  },
  agv: {
    badge: "HIGH-BAY 3PL & AUTOMATION",
    title: "Narrow-Aisle 10M Stacking & AGVs",
    pain: "High Singapore warehouse land lease costs force facilities into 10-meter vertical heights where standard counterbalance trucks waste 40% of floor space.",
    solution: "Stand-type Reach Trucks and LiDAR SLAM-guided Autonomous Stacking AGVs operating in narrow 1.8-meter aisles for 24/7 dark warehouse logistics.",
    equipment: "Stand Reach 1.5T / LiDAR Stacking AGV",
    link: "product-spec.html?id=reach-truck-stand"
  }
};

function openModal(key) {
  const data = MODAL_DATA[key];
  if (!data) return;

  const badgeEl = document.getElementById('modalIndustryBadge');
  const titleEl = document.getElementById('modalTitle');
  const painEl = document.getElementById('modalPainPoints');
  const solEl = document.getElementById('modalSolution');
  const equipEl = document.getElementById('modalEquipment');
  const linkEl = document.getElementById('modalSpecLink');

  if (badgeEl) badgeEl.textContent = data.badge;
  if (titleEl) titleEl.textContent = data.title;
  if (painEl) painEl.textContent = data.pain;
  if (solEl) solEl.textContent = data.solution;
  if (equipEl) equipEl.textContent = data.equipment;
  if (linkEl) linkEl.href = data.link;

  const modal = document.getElementById('detailModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('detailModal');
  if (modal) {
    modal.classList.remove('flex');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// PRIVACY MODAL & FORM VERIFICATION
let currentModalMode = 'view';
let activeFormType = 'contact';

function openPrivacyModal(isFinalSubmit = false, mode = 'view', formType = 'contact') {
  currentModalMode = mode;
  activeFormType = formType;

  const modal = document.getElementById('privacyModal');
  const badge = document.getElementById('modalBadge');
  const title = document.getElementById('modalTitle');
  const noticeBox = document.getElementById('modalNoticeBox');
  const noticeText = document.getElementById('modalNoticeText');
  const footerNote = document.getElementById('modalFooterNote');
  const cancelBtn = document.getElementById('modalCancelBtn');
  const primaryBtn = document.getElementById('modalPrimaryBtn');

  if (mode === 'submit_pending' || isFinalSubmit) {
    currentModalMode = 'submit_pending';
    if (badge) badge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span> Privacy & PDPA Policy Consent';
    if (title) title.textContent = 'Privacy & Data Protection Policy';
    if (noticeBox) noticeBox.className = 'bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3';
    if (noticeText) noticeText.innerHTML = '<strong class="font-bold text-emerald-900 block mb-0.5">Singapore Personal Data Protection Act (PDPA) Compliance</strong>Please review and consent to the privacy policy and terms of service to complete your request.';
    if (footerNote) footerNote.textContent = 'By proceeding, you consent to JAC Singapore PDPA processing terms.';
    if (cancelBtn) cancelBtn.textContent = 'Cancel';
    if (primaryBtn) primaryBtn.textContent = 'I Agree & Submit →';
  } else {
    currentModalMode = 'view';
    if (badge) badge.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span> Singapore PDPA Compliance';
    if (title) title.textContent = 'Privacy & Data Protection Policy';
    if (noticeBox) noticeBox.className = 'bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3';
    if (noticeText) noticeText.innerHTML = '<strong class="font-bold text-emerald-900 block mb-0.5">Singapore Personal Data Protection Act (PDPA) Compliance</strong>By submitting your enquiry or quotation request, you agree to the collection, usage, and disclosure of your business contact information in accordance with this Privacy & Data Protection Policy.';
    if (footerNote) footerNote.textContent = 'By proceeding, you consent to JAC Singapore PDPA processing terms.';
    if (cancelBtn) cancelBtn.textContent = 'Close';
    if (primaryBtn) primaryBtn.textContent = 'I Agree & Accept Policy →';
  }

  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closePrivacyModal() {
  const modal = document.getElementById('privacyModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function handleFormCheckboxChange(checkbox) {
  const container = document.getElementById('formPrivacyContainer');
  if (container) {
    if (checkbox.checked) {
      container.classList.add('border-brand/50', 'bg-emerald-50/40');
      container.classList.remove('border-slate-200');
    } else {
      container.classList.remove('border-brand/50', 'bg-emerald-50/40');
      container.classList.add('border-slate-200');
    }
  }
}

function handleModalConfirmAction() {
  const formCheckbox = document.getElementById('formPrivacyCheckbox');
  if (formCheckbox) {
    formCheckbox.checked = true;
    handleFormCheckboxChange(formCheckbox);
  }

  closePrivacyModal();

  if (currentModalMode === 'submit_pending') {
    if (activeFormType === 'dealer') {
      const form = document.getElementById('dealerForm');
      if (form && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      executeDealerSubmission();
    } else {
      const form = document.getElementById('contactForm');
      if (form && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      executeContactSubmission();
    }
  }
}

function openSuccessModal() {
  const successModal = document.getElementById('successModal');
  if (successModal) {
    successModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeSuccessModal() {
  const successModal = document.getElementById('successModal');
  if (successModal) {
    successModal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function handleContactSubmitClick() {
  activeFormType = 'contact';
  const formCheckbox = document.getElementById('formPrivacyCheckbox');
  if (!formCheckbox || !formCheckbox.checked) {
    openPrivacyModal(true, 'submit_pending', 'contact');
    return;
  }
  const form = document.getElementById('contactForm');
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }
  executeContactSubmission();
}

function handleDealerSubmitClick() {
  activeFormType = 'dealer';
  const formCheckbox = document.getElementById('formPrivacyCheckbox');
  if (!formCheckbox || !formCheckbox.checked) {
    openPrivacyModal(true, 'submit_pending', 'dealer');
    return;
  }
  const form = document.getElementById('dealerForm');
  if (form && !form.checkValidity()) {
    form.reportValidity();
    return;
  }
  executeDealerSubmission();
}

async function executeContactSubmission() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('contactSubmitBtn');

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Submitting Request...';
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Merge country code with phone number for clean email notification
  if (data.phone_country_code && data.phone_number) {
    data.full_contact_phone = `${data.phone_country_code} ${data.phone_number}`;
  }

  // ⚠️ Web3Forms Access Key — public by design (routes to Alvin's inbox only)
  data.access_key = '998be744-6cf3-4e44-97b2-19946bb985ba';
  data.from_name = 'JAC Singapore Web Inquiry';
  data.subject = 'New Equipment Inquiry from Website';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      if (form) form.reset();
      const formCheckbox = document.getElementById('formPrivacyCheckbox');
      if (formCheckbox) {
        formCheckbox.checked = false;
        handleFormCheckboxChange(formCheckbox);
      }
      openSuccessModal();
    } else {
      alert('Error submitting inquiry: ' + (result.message || 'Please try again.'));
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Connection error. Please check your connection or contact us via WhatsApp.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Send Inquiry →';
    }
  }
}

async function executeDealerSubmission() {
  const form = document.getElementById('dealerForm');
  const btn = document.getElementById('dealerSubmitBtn');

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Submitting Application...';
  }

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Merge country code with phone number for clean email notification
  if (data.phone_country_code && data.phone) {
    data.full_contact_phone = `${data.phone_country_code} ${data.phone}`;
  }

  // ⚠️ Web3Forms Access Key — public by design
  data.access_key = '998be744-6cf3-4e44-97b2-19946bb985ba';
  data.from_name = 'JAC Singapore Dealer Application';
  data.subject = 'New Channel Partner / Dealership Application';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
      if (form) form.reset();
      const formCheckbox = document.getElementById('formPrivacyCheckbox');
      if (formCheckbox) {
        formCheckbox.checked = false;
        handleFormCheckboxChange(formCheckbox);
      }
      openSuccessModal();
    } else {
      alert('Error submitting application: ' + (result.message || 'Please try again.'));
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert('Connection error. Please check your connection or contact us via WhatsApp.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Submit Channel Partner Application →';
    }
  }
}

// =========================================================================
// VIC Portal Login Handler
// =========================================================================
const VIC_DEMO_EMAIL    = "demo@jacforklift.sg";
const VIC_DEMO_PASSWORD = "demo1234";

const VIC_CRED_KEY      = "jac_vic_saved_credentials";  // { email, password }
const VIC_SESSION_KEY   = "jac_vic_logged_in";          // true | false

function applyVicSessionOnLoad() {
  const loginState     = document.getElementById('loginState');
  const dashboardState = document.getElementById('dashboardState');
  if (!loginState || !dashboardState) return;

  const loggedIn = localStorage.getItem(VIC_SESSION_KEY) === 'true';

  if (loggedIn) {
    loginState.style.display = 'none';
    dashboardState.style.display = 'block';
    return;
  }

  loginState.style.display = 'flex';
  dashboardState.style.display = 'none';

  const emailInput    = document.getElementById('vicEmail');
  const passwordInput = document.getElementById('vicPassword');
  if (!emailInput || !passwordInput) return;

  try {
    const saved = JSON.parse(localStorage.getItem(VIC_CRED_KEY));
    if (saved && saved.email && saved.password) {
      emailInput.value = saved.email;
      passwordInput.value = saved.password;

      [emailInput, passwordInput].forEach(el => {
        el.classList.add('bg-emerald-50', 'border-brand/40');
        el.addEventListener('input', function handler() {
          el.classList.remove('bg-emerald-50', 'border-brand/40');
          el.removeEventListener('input', handler);
        });
      });
    }
  } catch (err) {
    localStorage.removeItem(VIC_CRED_KEY);
  }
}

function saveVicCredentials(email, password) {
  try {
    localStorage.setItem(VIC_CRED_KEY, JSON.stringify({ email, password }));
  } catch (err) {}
}

function markVicSessionActive() {
  try {
    localStorage.setItem(VIC_SESSION_KEY, 'true');
  } catch (err) {}
}

function clearVicSession() {
  try {
    localStorage.removeItem(VIC_SESSION_KEY);
    localStorage.removeItem(VIC_CRED_KEY);
  } catch (err) {}
}

document.addEventListener('DOMContentLoaded', applyVicSessionOnLoad);
if (document.readyState !== 'loading') applyVicSessionOnLoad();

async function handleVicLogin(e) {
  e.preventDefault();

  const emailInput    = document.getElementById('vicEmail');
  const passwordInput = document.getElementById('vicPassword');
  const errorAlert    = document.getElementById('loginErrorAlert');
  const errorText     = document.getElementById('loginErrorText');
  const loginBtn      = document.getElementById('vicLoginBtn');

  if (!emailInput || !passwordInput) return;

  const email    = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!email || !password) {
    if (errorAlert && errorText) {
      errorText.textContent = "Please enter both your corporate email and password.";
      errorAlert.classList.remove('hidden');
    }
    return;
  }

  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.textContent = 'Authenticating Telemetry...';
  }

  await new Promise(resolve => setTimeout(resolve, 500));

  const isValid = email === VIC_DEMO_EMAIL && password === VIC_DEMO_PASSWORD;

  if (isValid) {
    saveVicCredentials(email, password);
    markVicSessionActive();

    if (errorAlert) errorAlert.classList.add('hidden');
    document.getElementById('loginState').style.display = 'none';
    document.getElementById('dashboardState').style.display = 'block';
    window.scrollTo(0, 0);
  } else {
    if (errorAlert && errorText) {
      errorText.textContent = "Invalid corporate credentials. Please check your email and password.";
      errorAlert.classList.remove('hidden');
    }
  }

  if (loginBtn) {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Log In to VIC Portal →';
  }
}

function handleVicLogout() {
  clearVicSession();

  const emailInput = document.getElementById('vicEmail');
  const passwordInput = document.getElementById('vicPassword');
  if (emailInput) emailInput.value = '';
  if (passwordInput) passwordInput.value = '';

  document.getElementById('loginState').style.display = 'flex';
  document.getElementById('dashboardState').style.display = 'none';
  window.scrollTo(0, 0);
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('vicPassword');
  const eyeIcon       = document.getElementById('eyeIcon');
  if (!passwordInput || !eyeIcon) return;

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    `;
  } else {
    passwordInput.type = 'password';
    eyeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    `;
  }
}

// =========================================================================
// PRODUCT SPECIFICATION & DATA ENGINE (Extracted from product-spec.html)
// =========================================================================
const PRODUCTS = {
  "he-series": { 
    name: "HE Series", tonnage: "2.5 – 3.8 TON", subtitle: "Heavy-Duty Lithium Forklift", category: "Lithium Forklifts", categorySlug: "forklift", 
    images: ["images/HE-Series-2.5-3.8T.png", "images/he-series/back.png", "images/he-series/topleft.png", "images/he-series/front.png"],
    description: "The HE Series is engineered to replace traditional diesel trucks with massive lithium-ion power and zero emissions. Built for the most demanding warehouse and industrial environments.", 
    highlights: [{ icon: "icon-bolt", title: "1.5 hr", subtitle: "Fast Charge" },{ icon: "icon-battery", title: "3,000+", subtitle: "Charge Cycles" },{ icon: "icon-quiet", title: "<70 dB", subtitle: "Whisper Quiet" },{ icon: "icon-shield", title: "3 Years", subtitle: "Warranty" }], 
    specs: { headers: ["HE25","HE30","HE35","HE38"], rows: [["Load Capacity","2,500 kg","3,000 kg","3,500 kg","3,800 kg"],["Lift Height (max)","6,000 mm","6,000 mm","6,000 mm","6,000 mm"],["Battery Capacity","80V / 500Ah","80V / 600Ah","80V / 700Ah","80V / 800Ah"],["Charging Time","1.5 hrs","2 hrs","2 hrs","2.5 hrs"],["Runtime (typical)","6–8 hrs","8–10 hrs","8–10 hrs","8–10 hrs"],["Turning Radius","2,200 mm","2,300 mm","2,400 mm","2,500 mm"],["Max Speed","16 km/h","18 km/h","18 km/h","18 km/h"],["Noise Level","<70 dB","<70 dB","<70 dB","<70 dB"],["Warranty","3 Years / 4,000 Hours","3 Years / 4,000 Hours","3 Years / 4,000 Hours","3 Years / 4,000 Hours"]] } 
  },
  "l-series": { 
    name: "L Series", tonnage: "1.5 – 3.5 TON", subtitle: "Smart Warehouse Lithium Forklift", category: "Lithium Forklifts", categorySlug: "forklift", 
    images: ["images/L-Series-1.5-3.5T.png", "images/l-series/front.png", "images/l-series/topright.png", "images/l-series/upper.png"],
    description: "The L Series is the ultimate smart warehouse solution for versatile indoor and outdoor work. Designed for precision, efficiency, and 24/7 reliability.", 
    highlights: [{ icon: "icon-bolt", title: "1.5 hr", subtitle: "Fast Charge" },{ icon: "icon-battery", title: "3,000+", subtitle: "Charge Cycles" },{ icon: "icon-quiet", title: "<70 dB", subtitle: "Whisper Quiet" },{ icon: "icon-shield", title: "3 Years", subtitle: "Warranty" }], 
    specs: { headers: ["L15","L20","L30","L35"], rows: [["Load Capacity","1,500 kg","2,000 kg","3,000 kg","3,500 kg"],["Lift Height (max)","6,000 mm","6,000 mm","6,000 mm","6,000 mm"],["Battery Capacity","48V / 400Ah","48V / 500Ah","80V / 600Ah","80V / 700Ah"],["Charging Time","1.5 hrs","1.5 hrs","2 hrs","2 hrs"],["Runtime (typical)","6–8 hrs","6–8 hrs","8–10 hrs","8–10 hrs"],["Turning Radius","1,900 mm","2,000 mm","2,200 mm","2,300 mm"],["Max Speed","15 km/h","15 km/h","18 km/h","18 km/h"],["Noise Level","<70 dB","<70 dB","<70 dB","<70 dB"],["Warranty","3 Years / 4,000 Hours","3 Years / 4,000 Hours","3 Years / 4,000 Hours","3 Years / 4,000 Hours"]] } 
  },
  "je-series": { 
    name: "JE Series", tonnage: "4.5 – 5.0 TON", subtitle: "Heavy-Duty Electric Forklift", category: "Lithium Forklifts", categorySlug: "forklift", 
    images: ["images/JE-Series-4.5-5.0T.png", "images/je-series/btmleft.png", "images/je-series/topright.png", "images/je-series/front.png"],
    description: "Heavy-duty electric forklift for the most demanding industrial operations. Delivers diesel-grade power without the emissions.", 
    highlights: [{ icon: "icon-bolt", title: "2 hr", subtitle: "Fast Charge" },{ icon: "icon-battery", title: "3,000+", subtitle: "Charge Cycles" },{ icon: "icon-target", title: "5.0 T", subtitle: "Max Capacity" },{ icon: "icon-shield", title: "3 Years", subtitle: "Warranty" }], 
    specs: { headers: ["JE45","JE50"], rows: [["Load Capacity","4,500 kg","5,000 kg"],["Lift Height (max)","6,000 mm","6,000 mm"],["Battery Capacity","80V / 800Ah","96V / 900Ah"],["Charging Time","2 hrs","2.5 hrs"],["Runtime (typical)","8–10 hrs","8–10 hrs"],["Turning Radius","2,600 mm","2,700 mm"],["Max Speed","18 km/h","18 km/h"],["Noise Level","<70 dB","<70 dB"],["Warranty","3 Years / 4,000 Hours","3 Years / 4,000 Hours"]] } 
  },
  "three-wheel": { 
    name: "Three Wheel", tonnage: "1.5 – 2.0 TON", subtitle: "Compact Lithium Forklift", category: "Lithium Forklifts", categorySlug: "forklift", 
    images: ["images/Three-Wheel-1.5-2.0T.png", "images/three-wheel/back.png", "images/three-wheel/topright.png", "images/three-wheel/front.png"],
    description: "Compact lithium forklift for tight spaces and precision handling. Ideal for narrow aisles and confined warehouse zones.", 
    highlights: [{ icon: "icon-bolt", title: "1.5 hr", subtitle: "Fast Charge" },{ icon: "icon-battery", title: "3,000+", subtitle: "Charge Cycles" },{ icon: "icon-target", title: "1.7 m", subtitle: "Turning Radius" },{ icon: "icon-shield", title: "3 Years", subtitle: "Warranty" }], 
    specs: { headers: ["TW15","TW20"], rows: [["Load Capacity","1,500 kg","2,000 kg"],["Lift Height (max)","6,000 mm","6,000 mm"],["Battery Capacity","48V / 400Ah","48V / 500Ah"],["Charging Time","1.5 hrs","1.5 hrs"],["Runtime (typical)","6–8 hrs","6–8 hrs"],["Turning Radius","1,700 mm","1,750 mm"],["Max Speed","14 km/h","14 km/h"],["Noise Level","<70 dB","<70 dB"],["Warranty","3 Years / 4,000 Hours","3 Years / 4,000 Hours"]] } 
  },
  "reach-truck-stand": { 
    name: "Stand Type Reach Truck", tonnage: "1.5 TON", subtitle: "Vertical Storage Reach Truck", category: "Reach Trucks", categorySlug: "reach", 
    images: ["images/Stand-type-Reach-Truck-1.5T.png", "images/stand-type/front.png", "images/stand-type/topleft.png", "images/stand-type/upper.png"],
    description: "Maximise your vertical storage space without sacrificing aisle width. The Stand Type Reach Truck is built for high-density warehouse layouts.", 
    highlights: [{ icon: "icon-target", title: "10 m", subtitle: "Max Lift" },{ icon: "icon-forklift", title: "1.8 m", subtitle: "Aisle Width" },{ icon: "icon-bolt", title: "1.5 hr", subtitle: "Fast Charge" },{ icon: "icon-shield", title: "3 Years", subtitle: "Warranty" }], 
    specs: { headers: ["Stand Type 1.5T"], rows: [["Load Capacity","1,500 kg"],["Lift Height (max)","10,000 mm"],["Battery Capacity","48V / 500Ah"],["Charging Time","1.5 hrs"],["Runtime (typical)","8–10 hrs"],["Aisle Width Required","1,800 mm"],["Max Speed","10 km/h"],["Noise Level","<70 dB"],["Warranty","3 Years / 4,000 Hours"]] } 
  },
  "reach-truck-sit": { 
    name: "Sit Type Reach Truck", tonnage: "1.5 – 2.0 TON", subtitle: "Long-Shift Reach Truck", category: "Reach Trucks", categorySlug: "reach", 
    images: ["images/Sit-type-Reach-Truck-1.5-2.0T.png", "images/sit-type/topright.png", "images/sit-type/topleft.png", "images/sit-type/btmleft.png"],
    description: "Designed for intensive, long-shift warehouse operations. Sit-down comfort and all-day productivity.", 
    highlights: [{ icon: "icon-target", title: "10 m", subtitle: "Max Lift" },{ icon: "icon-forklift", title: "Sit-Down", subtitle: "Ergonomic" },{ icon: "icon-bolt", title: "2 hr", subtitle: "Fast Charge" },{ icon: "icon-shield", title: "3 Years", subtitle: "Warranty" }], 
    specs: { headers: ["Sit Type 1.5T","Sit Type 2.0T"], rows: [["Load Capacity","1,500 kg","2,000 kg"],["Lift Height (max)","10,000 mm","10,000 mm"],["Battery Capacity","48V / 600Ah","48V / 700Ah"],["Charging Time","2 hrs","2 hrs"],["Runtime (typical)","8–10 hrs","8–10 hrs"],["Aisle Width Required","1,900 mm","2,000 mm"],["Max Speed","10 km/h","10 km/h"],["Noise Level","<70 dB","<70 dB"],["Warranty","3 Years / 4,000 Hours","3 Years / 4,000 Hours"]] } 
  },
  "walkie-pallet": { 
    name: "Walkie Pallet Truck", tonnage: "1.5 – 2.0 TON", subtitle: "Lithium Battery Pallet Truck", category: "Pallet Trucks", categorySlug: "pallet", 
    images: ["images/Walkie-Pallet-Truck-with-Lithium-Battery-1.5-2.0T.png", "images/walkie/bckleft.png", "images/walkie/bckright.png", "images/walkie/topright.png"],
    description: "Compact and efficient lithium-powered pallet truck for tight-space operations. Ideal for retail, logistics, and light manufacturing.", 
    highlights: [{ icon: "icon-bolt", title: "1 hr", subtitle: "Fast Charge" },{ icon: "icon-battery", title: "Lithium", subtitle: "Battery" },{ icon: "icon-forklift", title: "Compact", subtitle: "Design" },{ icon: "icon-shield", title: "2 Years", subtitle: "Warranty" }], 
    specs: { headers: ["Walkie 1.5T","Walkie 2.0T"], rows: [["Load Capacity","1,500 kg","2,000 kg"],["Fork Length","1,150 mm","1,150 mm"],["Battery","48V / 20Ah Lithium","48V / 30Ah Lithium"],["Charging Time","1 hr","1 hr"],["Runtime (typical)","4–6 hrs","4–6 hrs"],["Max Speed","5 km/h","5 km/h"],["Warranty","2 Years","2 Years"]] } 
  },
  "rider-pallet": { 
    name: "Rider Pallet Truck", tonnage: "2.0 – 3.0 TON", subtitle: "Long-Distance Pallet Truck", category: "Pallet Trucks", categorySlug: "pallet", 
    images: ["images/Rider-Pallet-Truck-2.0–3.0T.png", "images/rider-pallet/upper.png", "images/rider-pallet/topleft.png", "images/rider-pallet/topright.png"],
    description: "Accelerate your cross-warehouse transportation. Built for heavier loads and long distances with fold-down platform for operator comfort.", 
    highlights: [{ icon: "icon-bolt", title: "1.5 hr", subtitle: "Fast Charge" },{ icon: "icon-truck", title: "Fold-Down", subtitle: "Platform" },{ icon: "icon-package", title: "3.0 T", subtitle: "Max Load" },{ icon: "icon-shield", title: "2 Years", subtitle: "Warranty" }], 
    specs: { headers: ["Rider 2.0T","Rider 3.0T"], rows: [["Load Capacity","2,000 kg","3,000 kg"],["Fork Length","1,150 mm","1,200 mm"],["Battery","48V / 200Ah","48V / 300Ah"],["Charging Time","1.5 hrs","1.5 hrs"],["Runtime (typical)","6–8 hrs","6–8 hrs"],["Max Speed","8 km/h","8 km/h"],["Warranty","2 Years","2 Years"]] } 
  },
  "straddle-stacker": { 
    name: "Straddle-type Rider Electric Stacker", tonnage: "1.0 – 1.5 TON", subtitle: "Heavy-Duty Electric Stacker", category: "Stackers", categorySlug: "stacker", 
    images: ["images/Straddle-type-Rider-Electric-Stacker-1.0-1.5T.png", "images/straddle-type/btmleft.png", "images/straddle-type/topleft.png", "images/straddle-type/topright.png"],
    description: "Straddle-type design for enhanced stability and heavy-duty stacking efficiency. Ideal for dense storage operations.", 
    highlights: [{ icon: "icon-target", title: "5.5 m", subtitle: "Max Lift" },{ icon: "icon-forklift", title: "Straddle", subtitle: "Type" },{ icon: "icon-bolt", title: "1.5 hr", subtitle: "Fast Charge" },{ icon: "icon-shield", title: "2 Years", subtitle: "Warranty" }], 
    specs: { headers: ["Straddle 1.0T","Straddle 1.5T"], rows: [["Load Capacity","1,000 kg","1,500 kg"],["Lift Height (max)","5,500 mm","5,500 mm"],["Battery","48V / 200Ah","48V / 300Ah"],["Charging Time","1.5 hrs","1.5 hrs"],["Runtime (typical)","6–8 hrs","6–8 hrs"],["Max Speed","6 km/h","6 km/h"],["Warranty","2 Years","2 Years"]] } 
  },
  "electric-stacker": { 
    name: "Electric Rider Stacker", tonnage: "1.0 – 2.0 TON", subtitle: "Standard Electric Stacker", category: "Stackers", categorySlug: "stacker", 
    images: ["images/Electric-Rider-Stacker1.0-2.0T.png", "images/electric-rider/btmleft.png", "images/electric-rider/topleft.png", "images/electric-rider/topright.png"],
    description: "Boost your medium-level stacking efficiency with this standard electric stacker. Ergonomic, powerful, and reliable.", 
    highlights: [{ icon: "icon-target", title: "4.5 m", subtitle: "Max Lift" },{ icon: "icon-forklift", title: "Compact", subtitle: "Design" },{ icon: "icon-bolt", title: "1.5 hr", subtitle: "Fast Charge" },{ icon: "icon-shield", title: "2 Years", subtitle: "Warranty" }], 
    specs: { headers: ["E-Stacker 1.0T","E-Stacker 1.5T","E-Stacker 2.0T"], rows: [["Load Capacity","1,000 kg","1,500 kg","2,000 kg"],["Lift Height (max)","4,500 mm","4,500 mm","4,500 mm"],["Battery","48V / 200Ah","48V / 250Ah","48V / 300Ah"],["Charging Time","1.5 hrs","1.5 hrs","2 hrs"],["Runtime (typical)","6–8 hrs","6–8 hrs","6–8 hrs"],["Max Speed","6 km/h","6 km/h","6 km/h"],["Warranty","2 Years","2 Years","2 Years"]] } 
  },
  "electric-tractor": { 
    name: "Electric Tractor", tonnage: "TOWING SOLUTION", subtitle: "Zero-Emission Towing", category: "Tractor & Platform", categorySlug: "other", 
    images: ["images/Electric-Tractor.png", "images/electric-tractor/btmleft.png", "images/electric-tractor/topleft.png", "images/electric-tractor/topright.png"],
    description: "Zero-emission towing solution for logistics and manufacturing floors. Reliable, powerful, and built for continuous operation.", 
    highlights: [{ icon: "icon-bolt", title: "Zero", subtitle: "Emissions" },{ icon: "icon-battery", title: "Lithium", subtitle: "Powered" },{ icon: "icon-target", title: "Heavy", subtitle: "Towing" },{ icon: "icon-shield", title: "2 Years", subtitle: "Warranty" }], 
    specs: { headers: ["Electric Tractor"], rows: [["Towing Capacity","3,000 kg"],["Battery","48V / 400Ah"],["Charging Time","2 hrs"],["Runtime (typical)","6–8 hrs"],["Max Speed","12 km/h"],["Warranty","2 Years"]] } 
  },
  "electric-platform": { 
    name: "Electric Platform Truck", tonnage: "FLATBED PLATFORM", subtitle: "Versatile Material Movement", category: "Tractor & Platform", categorySlug: "other", 
    images: ["images/Electric-Platform-Truck.png", "images/electric-platform/btmleft.png", "images/electric-platform/topleft.png", "images/electric-platform/upper.png"],
    description: "Versatile electric platform for efficient material movement across facilities. Ideal for logistics, manufacturing, and 3PL operations.", 
    highlights: [{ icon: "icon-bolt", title: "Zero", subtitle: "Emissions" },{ icon: "icon-battery", title: "Lithium", subtitle: "Powered" },{ icon: "icon-package", title: "Large", subtitle: "Platform" },{ icon: "icon-shield", title: "2 Years", subtitle: "Warranty" }], 
    specs: { headers: ["Electric Platform Truck"], rows: [["Load Capacity","2,000 kg"],["Platform Size","1,500 x 1,000 mm"],["Battery","48V / 300Ah"],["Charging Time","1.5 hrs"],["Runtime (typical)","6–8 hrs"],["Max Speed","10 km/h"],["Warranty","2 Years"]] } 
  },
  "stacking-agv": { 
    name: "Stacking AGV", tonnage: "AUTONOMOUS GUIDED VEHICLE", subtitle: "24/7 Automated Stacking", category: "Automation", categorySlug: "agv", 
    images: ["images/stacking-agv.png", "images/stacking-agv/btmright.png", "images/stacking-agv/front.png", "images/stacking-agv/upper.png"],
    description: "Autonomous guided vehicle for advanced warehouse automation and 24/7 operation. Fully integrated with WMS and warehouse robotics.", 
    highlights: [{ icon: "icon-target", title: "Autonomous", subtitle: "Operation" },{ icon: "icon-bolt", title: "LiDAR", subtitle: "Navigation" },{ icon: "icon-battery", title: "24/7", subtitle: "Runtime" },{ icon: "icon-shield", title: "2 Years", subtitle: "Warranty" }], 
    specs: { headers: ["Stacking AGV"], rows: [["Load Capacity","1,000 kg"],["Lift Height (max)","3,000 mm"],["Navigation","LiDAR + SLAM"],["Battery","48V / 200Ah Lithium"],["Charging Time","1 hr (auto-dock)"],["Runtime","24/7 (opportunity charge)"],["Warranty","2 Years"]] } 
  }
};

// Thumbnail Switcher function exposed globally to window
window.swapImage = function(thumb) {
  const mainImg = document.getElementById('mainImage');
  if (mainImg) mainImg.src = thumb.src;
  document.querySelectorAll('.thumbs img').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
};

// Main Product Spec Renderer
function initProductSpecPage() {
  const specHeader = document.getElementById('specHeader');
  const specBody = document.getElementById('specBody');
  if (!specHeader || !specBody) return; // Exit cleanly if not on product-spec.html

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'he-series';
  const product = PRODUCTS[id] || PRODUCTS['he-series'];

  const imgList = product.images || [product.image, product.image, product.image, product.image];

  document.title = `${product.name} | JAC Forklift Singapore`;
  
  const bCat = document.getElementById('breadcrumbCategory');
  if (bCat) bCat.textContent = product.category;
  
  const bName = document.getElementById('breadcrumbName');
  if (bName) bName.textContent = product.name;
  
  const pName = document.getElementById('productName');
  if (pName) pName.textContent = product.name;
  
  const pTonnage = document.getElementById('productTonnage');
  if (pTonnage) pTonnage.textContent = product.tonnage;
  
  const pSubtitle = document.getElementById('productSubtitle');
  if (pSubtitle) pSubtitle.textContent = product.subtitle;
  
  const pDesc = document.getElementById('productDescription');
  if (pDesc) pDesc.textContent = product.description;
  
  const cBadge = document.getElementById('categoryBadge');
  if (cBadge) cBadge.textContent = product.category.toUpperCase();

  const mainImg = document.getElementById('mainImage');
  if (mainImg) {
    mainImg.src = imgList[0];
    mainImg.alt = product.name;
  }

  ['thumb1', 'thumb2', 'thumb3', 'thumb4'].forEach((thumbId, index) => {
    const thumbEl = document.getElementById(thumbId);
    if (thumbEl) {
      thumbEl.src = imgList[index] || imgList[0];
      thumbEl.alt = `${product.name} view ${index + 1}`;
    }
  });

  const categoryParam = product.categorySlug || 'forklift';
  const quoteBtn = document.getElementById('quoteBtn');
  if (quoteBtn) {
    quoteBtn.href = `contact.html?equipment=${encodeURIComponent(categoryParam)}&model=${encodeURIComponent(product.name + ' (' + product.tonnage + ')')}`;
  }

  const quickEquipSelect = document.getElementById('quickEquipSelect');
  if (quickEquipSelect && categoryParam) {
    for (let i = 0; i < quickEquipSelect.options.length; i++) {
      if (quickEquipSelect.options[i].value.toLowerCase() === categoryParam.toLowerCase()) {
        quickEquipSelect.selectedIndex = i;
        break;
      }
    }
  }

  const keyHighlights = document.getElementById('keyHighlights');
  if (keyHighlights && product.highlights) {
    keyHighlights.innerHTML = product.highlights.map(h => `
      <div class="glass-card-light rounded-2xl p-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-brand flex items-center justify-center shrink-0">
          <svg class="w-5 h-5"><use href="#${h.icon}"/></svg>
        </div>
        <div>
          <div class="text-obsidian font-heading font-bold text-sm">${h.title}</div>
          <div class="text-slate-400 text-xs">${h.subtitle}</div>
        </div>
      </div>
    `).join('');
  }

  specHeader.innerHTML = `
    <th class="py-5 px-8 text-xs font-bold text-slate-500 uppercase tracking-wider">Specification</th>
    ${product.specs.headers.map(h => `<th class="py-5 px-8 text-xs font-bold text-brand uppercase tracking-wider">${h}</th>`).join('')}
  `;

  specBody.innerHTML = product.specs.rows.map(row => `
    <tr class="spec-row">
      <td class="py-4 px-8 font-semibold text-obsidian">${row[0]}</td>
      ${row.slice(1).map(c => `<td class="py-4 px-8 text-slate-600">${c}</td>`).join('')}
    </tr>
  `).join('');

  const relatedGrid = document.getElementById('relatedGrid');
  if (relatedGrid) {
    const allProducts = Object.entries(PRODUCTS).filter(([k]) => k !== id);
    const related = allProducts.slice(0, 3);
    relatedGrid.innerHTML = related.map(([k, p]) => `
      <a href="product-spec.html?id=${k}" class="product-card rounded-3xl overflow-hidden">
        <div class="aspect-[4/3] product-showcase relative flex items-center justify-center p-6 border-b border-slate-100">
          <img src="${p.images ? p.images[0] : p.image}" alt="${p.name}" class="w-full h-full object-contain" />
          <span class="absolute top-4 left-4 bg-white text-obsidian text-[11px] font-bold px-3 py-1 rounded-full border border-slate-200">${p.category.toUpperCase()}</span>
        </div>
        <div class="p-6">
          <div class="text-brand text-xs font-bold tracking-wider uppercase mb-1">${p.tonnage}</div>
          <h3 class="font-heading font-bold text-lg text-obsidian mb-2">${p.name}</h3>
          <span class="text-brand text-xs font-bold">View Specs →</span>
        </div>
      </a>
    `).join('');
  }
}