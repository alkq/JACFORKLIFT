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

/**
Global Search Functionality with Image Fallback & Quick Navigation
 */
document.addEventListener('DOMContentLoaded', () => {
  // Global search implementation across all pages
  const searchInputs = document.querySelectorAll('input[name="search"]');
  
  searchInputs.forEach(input => {
    // Create a dynamic results dropdown container right below each search input if not present
    let wrapper = input.closest('form');
    if (!wrapper) return;
    
    // Ensure wrapper is relative for absolute positioning of results
    wrapper.style.position = 'relative';
    
    let dropdown = document.createElement('div');
    dropdown.className = 'search-autocomplete-dropdown hidden absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-[99999] overflow-hidden';
    wrapper.appendChild(dropdown);

    // Simulated equipment database for search suggestions matching product-spec.html
    const searchDatabase = [
      { name: "HE Series Heavy-Duty Forklift", tonnage: "2.5 – 3.8 TON", category: "Lithium Forklift", url: "product-spec.html?id=he-series", img: "images/HE-Series-2.5-3.8T.png" },
      { name: "L Series Smart Warehouse Forklift", tonnage: "1.5 – 3.5 TON", category: "Lithium Forklift", url: "product-spec.html?id=l-series", img: "images/L-Series-1.5-3.5T.png" },
      { name: "JE Series Heavy Electric Forklift", tonnage: "4.5 – 5.0 TON", category: "Heavy Electric", url: "product-spec.html?id=je-series", img: "images/JE-Series-4.5-5.0T.png" },
      { name: "Three Wheel Compact Forklift", tonnage: "1.5 – 2.0 TON", category: "Compact Forklift", url: "product-spec.html?id=three-wheel", img: "images/Three-Wheel-1.5-2.0T.png" },
      { name: "Stand Type Reach Truck", tonnage: "1.5 TON", category: "Reach Truck", url: "product-spec.html?id=reach-truck-stand", img: "images/Stand-type-Reach-Truck-1.5T.png" },
      { name: "Sit Type Reach Truck", tonnage: "1.5 – 2.0 TON", category: "Reach Truck", url: "product-spec.html?id=reach-truck-sit", img: "images/Sit-type-Reach-Truck-1.5-2.0T.png" },
      { name: "Walkie Pallet Truck", tonnage: "1.5 – 2.0 TON", category: "Pallet Truck", url: "product-spec.html?id=walkie-pallet", img: "images/Walkie-Pallet-Truck-with-Lithium-Battery-1.5-2.0T.png" },
      { name: "Rider Pallet Truck", tonnage: "2.0 – 3.0 TON", category: "Pallet Truck", url: "product-spec.html?id=rider-pallet", img: "images/Rider-Pallet-Truck-2.0–3.0T.png" },
      { name: "Straddle Rider Stacker", tonnage: "1.0 – 1.5 TON", category: "Stacker", url: "product-spec.html?id=straddle-stacker", img: "images/Straddle-type-Rider-Electric-Stacker-1.0-1.5T.png" },
      { name: "Electric Rider Stacker", tonnage: "1.0 – 2.0 TON", category: "Stacker", url: "product-spec.html?id=electric-stacker", img: "images/Electric-Rider-Stacker1.0-2.0T.png" },
      { name: "Electric Tow Tractor", tonnage: "TOWING SOLUTION", category: "Towing", url: "product-spec.html?id=electric-tractor", img: "images/Electric-Tractor.png" },
      { name: "Electric Platform Truck", tonnage: "FLATBED PLATFORM", category: "Platform", url: "product-spec.html?id=electric-platform", img: "images/Electric-Platform-Truck.png" },
      { name: "Stacking AGV", tonnage: "AUTONOMOUS", category: "Robotics", url: "product-spec.html?id=stacking-agv", img: "images/stacking-agv.png" }
    ];

    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (query.length === 0) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
        return;
      }

      const matches = searchDatabase.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query) || 
        item.tonnage.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        dropdown.innerHTML = `
          <div class="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Matching Equipment (${matches.length})
          </div>
          <div class="max-h-72 overflow-y-auto divide-y divide-slate-100">
            ${matches.map(m => `
              <a href="${m.url}" class="flex items-center gap-3.5 px-4 py-3 hover:bg-slate-50 transition-colors group">
                <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1">
                  <img src="${m.img}" alt="${m.name}" class="w-full h-full object-contain" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23E11D2A\' stroke-width=\'1.5\'><path d=\'M3 17h10V9H7l-4 4v4z\'/><circle cx=\'7\' cy=\'19\' r=\'2\'/><circle cx=\'15\' cy=\'19\' r=\'2\'/><path d=\'M17 17V5M21 8h-4M21 12h-4M21 16h-4\'/></svg>';" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-heading font-bold text-xs text-obsidian group-hover:text-brand transition-colors truncate">${m.name}</div>
                  <div class="text-[11px] text-slate-400 mt-0.5">${m.tonnage} · <span class="text-brand font-medium">${m.category}</span></div>
                </div>
                <span class="text-slate-300 group-hover:text-brand group-hover:translate-x-0.5 transition-all text-xs">→</span>
              </a>
            `).join('')}
          </div>
        `;
        dropdown.classList.remove('hidden');
      } else {
        dropdown.innerHTML = `
          <div class="px-4 py-6 text-center text-xs text-slate-400 font-light">
            No matching equipment found for "<span class="font-medium text-slate-700">${query}</span>". Try searching for "HE", "Reach", or "Pallet".
          </div>
        `;
        dropdown.classList.remove('hidden');
      }
    });

    // Close search dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  });
});

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