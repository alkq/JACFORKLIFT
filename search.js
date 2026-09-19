// =========================================================================
// search.js - Comprehensive Site-Wide Search Engine with Full Keyboard Nav
// =========================================================================

const SITE_WIDE_SEARCH_DATABASE = [
  // --- PRODUCTS (13 Models) ---
  { name: "HE Series Heavy-Duty Forklift", type: "Product", tonnage: "2.5 – 3.8 TON", category: "Lithium Forklift", url: "product-spec.html?id=he-series", img: "images/HE-Series-2.5-3.8T.png", keywords: "he he25 he30 he35 he38 heavy duty diesel replacement catl lfp" },
  { name: "L Series Smart Warehouse Forklift", type: "Product", tonnage: "1.5 – 3.5 TON", category: "Lithium Forklift", url: "product-spec.html?id=l-series", img: "images/L-Series-1.5-3.5T.png", keywords: "l l15 l20 l30 l35 smart warehouse electric indoor yard" },
  { name: "JE Series Heavy Electric Forklift", type: "Product", tonnage: "4.5 – 5.0 TON", category: "Heavy Electric", url: "product-spec.html?id=je-series", img: "images/JE-Series-4.5-5.0T.png", keywords: "je je45 je50 high capacity industrial steel metal" },
  { name: "Three Wheel Compact Forklift", type: "Product", tonnage: "1.5 – 2.0 TON", category: "Compact Forklift", url: "product-spec.html?id=three-wheel", img: "images/Three-Wheel-1.5-2.0T.png", keywords: "three 3 wheel tw15 tw20 compact container turning radius narrow" },
  { name: "Stand Type Reach Truck", type: "Product", tonnage: "1.5 TON", category: "Reach Truck", url: "product-spec.html?id=reach-truck-stand", img: "images/Stand-type-Reach-Truck-1.5T.png", keywords: "stand reach truck vertical high bay racking 10m narrow aisle" },
  { name: "Sit Type Reach Truck", type: "Product", tonnage: "1.5 – 2.0 TON", category: "Reach Truck", url: "product-spec.html?id=reach-truck-sit", img: "images/Sit-type-Reach-Truck-1.5-2.0T.png", keywords: "sit reach truck ergonomic long shift warehouse high lift" },
  { name: "Walkie Pallet Truck", type: "Product", tonnage: "1.5 – 2.0 TON", category: "Pallet Truck", url: "product-spec.html?id=walkie-pallet", img: "images/Walkie-Pallet-Truck-with-Lithium-Battery-1.5-2.0T.png", keywords: "walkie pallet jack truck pump retail dock unloading" },
  { name: "Rider Pallet Truck", type: "Product", tonnage: "2.0 – 3.0 TON", category: "Pallet Truck", url: "product-spec.html?id=rider-pallet", img: "images/Rider-Pallet-Truck-2.0–3.0T.png", keywords: "rider pallet truck fold down platform cross warehouse transit" },
  { name: "Straddle Rider Stacker", type: "Product", tonnage: "1.0 – 1.5 TON", category: "Stacker", url: "product-spec.html?id=straddle-stacker", img: "images/Straddle-type-Rider-Electric-Stacker-1.0-1.5T.png", keywords: "straddle electric rider stacker perimeter pallet lifting" },
  { name: "Electric Rider Stacker", type: "Product", tonnage: "1.0 – 2.0 TON", category: "Stacker", url: "product-spec.html?id=electric-stacker", img: "images/Electric-Rider-Stacker1.0-2.0T.png", keywords: "electric rider stacker medium mezzanine replenishment" },
  { name: "Electric Tow Tractor", type: "Product", tonnage: "TOWING SOLUTION", category: "Towing", url: "product-spec.html?id=electric-tractor", img: "images/Electric-Tractor.png", keywords: "electric tow tractor tugger assembly line airport baggage" },
  { name: "Electric Platform Truck", type: "Product", tonnage: "FLATBED PLATFORM", category: "Platform", url: "product-spec.html?id=electric-platform", img: "images/Electric-Platform-Truck.png", keywords: "electric platform flatbed utility transporter plant factory" },
  { name: "Stacking AGV", type: "Product", tonnage: "AUTONOMOUS", category: "Robotics", url: "product-spec.html?id=stacking-agv", img: "images/stacking-agv.png", keywords: "agv autonomous stacking robot lidar slam dark warehouse automation" },

  // --- SITE PAGES & SOLUTIONS ---
  { name: "Equipment & Long-Term Rental Plans", type: "Page", tonnage: "OPEX Fleet", category: "Rental", url: "equipment-rental.html", img: "", keywords: "rental lease opex maintenance fleet 12 60 months" },
  { name: "JAC Lithium-Ion Technology & CATL Cells", type: "Page", tonnage: "80V / LFP", category: "Technology", url: "lithium-ion.html", img: "", keywords: "battery catl lfp charging opportunity fast cycle bms" },
  { name: "Industry Solutions & Case Studies", type: "Page", tonnage: "Specialized", category: "Solutions", url: "solution.html", img: "", keywords: "cold chain freeze blast freezer steel coils stone abrasive dust chemical cleanroom 3pl" },
  { name: "About JAC Forklift Singapore", type: "Page", tonnage: "Heritage", category: "Company", url: "about.html", img: "", keywords: "about us history heritage jac motors anhuai green plan 2030" },
  { name: "VIC Partner Access Portal", type: "Page", tonnage: "Telemetry", category: "Portal", url: "vic.html", img: "", keywords: "vic portal login telemetry executive partner alvin lim" },
  { name: "Dealer & Channel Partner Enquiry", type: "Page", tonnage: "B2B Program", category: "Partnership", url: "dealer-enquiry.html", img: "", keywords: "dealer enquiry channel partner margins wholesale distribution" },
  { name: "Inquiry & Request A Quote Desk", type: "Page", tonnage: "Direct Contact", category: "Contact", url: "contact.html", img: "", keywords: "contact quote price inquiry paja lebar tuas pioneer location map" }
];

document.addEventListener('DOMContentLoaded', () => {
  const searchInputs = document.querySelectorAll('input[name="search"]');
  
  searchInputs.forEach(input => {
    let wrapper = input.closest('form');
    if (!wrapper) return;
    
    wrapper.style.position = 'relative';
    
    let dropdown = wrapper.querySelector('.search-autocomplete-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'search-autocomplete-dropdown hidden absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl z-[99999] overflow-hidden text-left';
      wrapper.appendChild(dropdown);
    }

    let selectedIndex = -1;

    function renderDropdown(matches) {
      dropdown._currentMatches = matches;
      if (matches.length > 0) {
        dropdown.innerHTML = `
          <div class="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex justify-between items-center">
            <span>Matching Results (${matches.length})</span>
            <span class="text-[9px] text-slate-400">↑↓ Navigate · Enter Select · Esc Close</span>
          </div>
          <div class="max-h-80 overflow-y-auto divide-y divide-slate-100" id="searchSuggestionsList">
            ${matches.map((m, idx) => {
              const isProduct = m.type === 'Product';
              const iconOrImgHtml = isProduct 
                ? `<div class="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1">
                     <img src="${m.img}" alt="${m.name}" class="w-full h-full object-contain" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23047857\' stroke-width=\'1.5\'><path d=\'M3 17h10V9H7l-4 4v4z\'/><circle cx=\'7\' cy=\'19\' r=\'2\'/><circle cx=\'15\' cy=\'19\' r=\'2\'/><path d=\'M17 17V5M21 8h-4M21 12h-4M21 16h-4\'/></svg>';" />
                   </div>`
                : `<div class="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-brand flex items-center justify-center shrink-0 font-heading font-extrabold text-xs">
                     PAGE
                   </div>`;

              const isHighlighted = idx === selectedIndex;
              const bgClass = isHighlighted ? 'bg-emerald-50/80 border-l-4 border-brand' : 'hover:bg-slate-50';

              return `
                <a href="${m.url}" data-index="${idx}" class="search-item flex items-center gap-3.5 px-4 py-3 ${bgClass} transition-colors group">
                  ${iconOrImgHtml}
                  <div class="flex-1 min-w-0">
                    <div class="font-heading font-bold text-xs text-obsidian group-hover:text-brand transition-colors truncate">${m.name}</div>
                    <div class="text-[11px] text-slate-400 mt-0.5">${m.tonnage} · <span class="text-brand font-medium">${m.category}</span></div>
                  </div>
                  <span class="text-slate-300 group-hover:text-brand group-hover:translate-x-0.5 transition-all text-xs">→</span>
                </a>
              `;
            }).join('')}
          </div>
        `;
        dropdown.classList.remove('hidden');
      } else {
        dropdown._currentMatches = [];
        dropdown.innerHTML = `
          <div class="px-4 py-6 text-center text-xs text-slate-400 font-light">
            No results found for "<span class="font-medium text-slate-700">${input.value}</span>". Try searching for "rental", "cold chain", or "HE Series".
          </div>
        `;
        dropdown.classList.remove('hidden');
      }
    }

    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      selectedIndex = -1;
      if (query.length === 0) {
        dropdown.classList.add('hidden');
        dropdown.innerHTML = '';
        return;
      }

      const matches = SITE_WIDE_SEARCH_DATABASE.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query) || 
        item.tonnage.toLowerCase().includes(query) ||
        (item.keywords && item.keywords.toLowerCase().includes(query))
      );

      renderDropdown(matches);
    });

    // Keyboard Arrow Navigation, Enter selection, & Escape close
    input.addEventListener('keydown', (e) => {
      const matches = dropdown._currentMatches;
      if (!matches || matches.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % matches.length;
        renderDropdown(matches);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + matches.length) % matches.length;
        renderDropdown(matches);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < matches.length) {
          window.location.href = matches[selectedIndex].url;
        } else {
          // Default to top result if nothing explicitly highlighted
          window.location.href = matches[0].url;
        }
      } else if (e.key === 'Escape') {
        dropdown.classList.add('hidden');
        input.blur();
      }
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  });
});