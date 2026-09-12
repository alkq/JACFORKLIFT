// =========================================================================
// search.js - Live Search Autocomplete & Filter Engine for JAC Forklift SG
// =========================================================================

const SEARCH_DATABASE = [
  {
    id: "he-series",
    name: "HE Series Forklift",
    tonnage: "2.5 – 3.8 TON",
    category: "Lithium Forklift",
    url: "product-spec.html?id=he-series",
    img: "images/HE%20Series%202.5%20%E2%80%93%203.8T.png",
    keywords: "he he25 he30 he35 he38 heavy duty diesel replacement catl lfp"
  },
  {
    id: "l-series",
    name: "L Series Smart Forklift",
    tonnage: "1.5 – 3.5 TON",
    category: "Lithium Forklift",
    url: "product-spec.html?id=l-series",
    img: "images/L%20Series%201.5%20%E2%80%93%203.5T.png",
    keywords: "l l15 l20 l30 l35 smart warehouse electric indoor yard"
  },
  {
    id: "je-series",
    name: "JE Series Heavy Electric",
    tonnage: "4.5 – 5.0 TON",
    category: "Heavy Electric",
    url: "product-spec.html?id=je-series",
    img: "images/JE%20Series%204.5%20%E2%80%93%205.0T.png",
    keywords: "je je45 je50 high capacity industrial steel metal"
  },
  {
    id: "three-wheel",
    name: "Three Wheel Forklift",
    tonnage: "1.5 – 2.0 TON",
    category: "Compact Forklift",
    url: "product-spec.html?id=three-wheel",
    img: "images/Three%20Wheel%201.5%20%E2%80%93%202.0T.png",
    keywords: "three 3 wheel tw15 tw20 compact container turning radius narrow"
  },
  {
    id: "reach-truck-stand",
    name: "Stand Type Reach Truck",
    tonnage: "1.5 TON · 10M LIFT",
    category: "Reach Truck",
    url: "product-spec.html?id=reach-truck-stand",
    img: "images/Stand%20type%20Reach%20Truck%201.5T.png",
    keywords: "stand reach truck vertical high bay racking 10m narrow aisle"
  },
  {
    id: "reach-truck-sit",
    name: "Sit Type Reach Truck",
    tonnage: "1.5 – 2.0 TON · 10M LIFT",
    category: "Reach Truck",
    url: "product-spec.html?id=reach-truck-sit",
    img: "images/Sit%20type%20Reach%20Truck%201.5%20-2.0T.png",
    keywords: "sit reach truck ergonomic long shift warehouse high lift"
  },
  {
    id: "walkie-pallet",
    name: "Walkie Pallet Truck",
    tonnage: "1.5 – 2.0 TON",
    category: "Pallet Truck",
    url: "product-spec.html?id=walkie-pallet",
    img: "images/Walkie%20Pallet%20Truck%20with%20Lithium%20Battery%201.5%20%E2%80%93%202.0T.png",
    keywords: "walkie pallet jack truck pump retail dock unloading"
  },
  {
    id: "rider-pallet",
    name: "Rider Pallet Truck",
    tonnage: "2.0 – 3.0 TON",
    category: "Pallet Truck",
    url: "product-spec.html?id=rider-pallet",
    img: "images/Rider%20Pallet%20Truck%202.0%20%E2%80%93%203.0T.png",
    keywords: "rider pallet truck fold down platform cross warehouse transit"
  },
  {
    id: "straddle-stacker",
    name: "Straddle Rider Stacker",
    tonnage: "1.0 – 1.5 TON",
    category: "Stacker",
    url: "product-spec.html?id=straddle-stacker",
    img: "images/Straddle-type%20Rider%20Electric%20Stacker%201.0%20%E2%80%93%201.5T.png",
    keywords: "straddle electric rider stacker perimeter pallet lifting"
  },
  {
    id: "electric-stacker",
    name: "Electric Rider Stacker",
    tonnage: "1.0 – 2.0 TON",
    category: "Stacker",
    url: "product-spec.html?id=electric-stacker",
    img: "images/Electric%20Rider%20Stacker%201.0%20%E2%80%93%202.0T.png",
    keywords: "electric rider stacker medium mezzanine replenishment"
  },
  {
    id: "electric-tractor",
    name: "Electric Tow Tractor",
    tonnage: "3,000 KG TOW",
    category: "Towing",
    url: "product-spec.html?id=electric-tractor",
    img: "images/Electric%20Tractor.png",
    keywords: "electric tow tractor tugger assembly line airport baggage"
  },
  {
    id: "electric-platform",
    name: "Electric Platform Truck",
    tonnage: "2,000 KG PAYLOAD",
    category: "Platform",
    url: "product-spec.html?id=electric-platform",
    img: "images/Electric%20Platform%20Truck.png",
    keywords: "electric platform flatbed utility transporter plant factory"
  },
  {
    id: "stacking-agv",
    name: "Stacking AGV (Autonomous)",
    tonnage: "1,000 KG · LiDAR SLAM",
    category: "Robotics",
    url: "product-spec.html?id=stacking-agv",
    img: "images/stacking%20agv.png",
    keywords: "agv autonomous stacking robot lidar slam dark warehouse automation"
  }
];

// Initialize Search System when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initNavbarSearch('searchBox');        // Desktop
  initNavbarSearch('mobileSearchBox');  // Mobile
  initProductsPageFilter();             // If currently on products.html
});

/**
 * Attaches Live Autocomplete & "No Result" states to navbar inputs
 */
function initNavbarSearch(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const form = container.querySelector('form');
  const input = container.querySelector('input[name="search"]');
  if (!form || !input) return;

  // Create suggestion box dynamically if not already present
  let suggestionBox = container.querySelector('.search-suggestions');
  if (!suggestionBox) {
    suggestionBox = document.createElement('div');
    suggestionBox.className = 'search-suggestions hidden bg-white border-t border-slate-100 mt-2 max-h-72 overflow-y-auto divide-y divide-slate-100 rounded-b-xl shadow-inner';
    form.parentNode.appendChild(suggestionBox);
  }

  // Live Input Event
  input.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (query.length === 0) {
      suggestionBox.innerHTML = '';
      suggestionBox.classList.add('hidden');
      return;
    }

    const matches = SEARCH_DATABASE.filter(item => {
      return item.name.toLowerCase().includes(query) ||
             item.tonnage.toLowerCase().includes(query) ||
             item.category.toLowerCase().includes(query) ||
             item.keywords.toLowerCase().includes(query);
    });

    if (matches.length > 0) {
      suggestionBox.innerHTML = `
        <div class="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Matching Equipment (${matches.length})
        </div>
        ${matches.map(m => `
          <a href="${m.url}" class="flex items-center gap-3 p-2.5 hover:bg-red-50/60 transition-colors group">
            <div class="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0">
              <img src="${m.img}" alt="${m.name}" class="w-full h-full object-contain group-hover:scale-110 transition-transform">
            </div>
            <div class="flex-1 min-w-0 text-left">
              <div class="text-xs font-bold text-obsidian group-hover:text-brand truncate">${m.name}</div>
              <div class="text-[10px] text-slate-400 flex items-center gap-2">
                <span>${m.tonnage}</span>
                <span>•</span>
                <span class="text-brand font-semibold">${m.category}</span>
              </div>
            </div>
            <span class="text-xs text-slate-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all">→</span>
          </a>
        `).join('')}
      `;
      suggestionBox.classList.remove('hidden');
    } else {
      // Automatic "NO RESULT" feedback
      suggestionBox.innerHTML = `
        <div class="p-4 text-center">
          <div class="w-8 h-8 rounded-full bg-red-50 text-brand flex items-center justify-center mx-auto mb-2 text-xs font-bold">✕</div>
          <div class="text-xs font-bold text-obsidian mb-0.5">No results found</div>
          <div class="text-[11px] text-slate-400">No equipment matches "<span class="text-brand font-medium">${escapeHTML(query)}</span>"</div>
        </div>
      `;
      suggestionBox.classList.remove('hidden');
    }
  });

  // Handle Enter Key / Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      suggestionBox.classList.add('hidden');
    }
  });
}

/**
 * Handles filtering on products.html when loaded with ?search=...
 */
function initProductsPageFilter() {
  const grid = document.getElementById('productGrid');
  if (!grid) return; // Not on products.html

  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get('search');
  if (!searchParam) return;

  const query = searchParam.trim().toLowerCase();

  // Populate search box with search query
  document.querySelectorAll('input[name="search"]').forEach(input => {
    input.value = searchParam;
  });

  // Deselect active filter pill buttons
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));

  const cards = grid.querySelectorAll('.product-card');
  let matchCount = 0;

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const isMatch = text.includes(query);
    if (isMatch) {
      card.style.display = 'block';
      matchCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Remove existing no-result container if any
  const existingNoResult = document.getElementById('searchNoResults');
  if (existingNoResult) existingNoResult.remove();

  // Show "No Result" on products page if 0 matched
  if (matchCount === 0) {
    const noResultDiv = document.createElement('div');
    noResultDiv.id = 'searchNoResults';
    noResultDiv.className = 'col-span-full py-16 px-6 text-center bg-white border border-slate-200 rounded-3xl shadow-sm my-4';
    noResultDiv.innerHTML = `
      <div class="w-14 h-14 rounded-2xl bg-red-50 text-brand flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✕</div>
      <h3 class="font-heading font-extrabold text-2xl text-obsidian mb-2">No Equipment Found</h3>
      <p class="text-slate-500 text-sm max-w-md mx-auto mb-6">
        We couldn't find any equipment matching "<span class="text-brand font-semibold">${escapeHTML(searchParam)}</span>". Try searching for forklift tonnages (e.g. <em>2.5T</em>), <em>reach trucks</em>, or <em>AGVs</em>.
      </p>
      <a href="products.html" class="inline-block bg-obsidian hover:bg-brand text-white text-xs font-heading font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-sm">
        View All 13 Equipment Models
      </a>
    `;
    grid.appendChild(noResultDiv);
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}