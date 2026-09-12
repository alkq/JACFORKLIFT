// =========================================================================
// ai-chat.js - JAC Forklift Singapore AI Auto-Reply Chat Widget
// =========================================================================

(function () {
  // CONFIGURATION
  const CONFIG = {
    botName: "JAC Singapore AI",
    welcomeMessage: "Hello! 👋 I'm your JAC Singapore assistant. How can I help with your material handling today?",
    companyPhone: "+65 6XXX XXXX",
    inquiryPage: "contact.html",
    // Set to your custom backend endpoint (e.g., '/api/chat') if using OpenAI/Gemini.
    // When left null, it automatically runs in Smart Knowledge-Base mode.
    apiEndpoint: null, 
  };

const KNOWLEDGE_BASE = [
    {
      keywords: ["background", "history", "about", "who are you", "company", "origin", "heritage", "story"],
      reply: "<strong>JAC Material Handling</strong> is the exclusive Singapore distributor of JAC electric forklifts.<br><br>" +
             "• <strong>Parent Group:</strong> Anhui Jianghuai Automobile Group Corp., Ltd. (JAC Motors), founded in 1964 and listed on the Shanghai Stock Exchange.<br>" +
             "• <strong>60+ Years Heritage:</strong> Backed by six decades of automotive and heavy machinery engineering.<br>" +
             "• <strong>Singapore Mission:</strong> Accelerating green logistics with zero-emission, CATL lithium-powered equipment tailored for humid tropical warehouses.<br><br>" +
             "<a href='about.html' class='text-red-500 font-bold underline'>Read Our Full Story on About Us →</a>"
    },
    {
      keywords: ["vic", "framework", "vision", "intention", "commitment"],
      reply: "Our <strong>V.I.C. Framework™</strong> is our proprietary 3-stage advisory methodology:<br><br>" +
             "1. <strong>Vision:</strong> Audit facility layout, aisle widths, and shift requirements.<br>" +
             "2. <strong>Intention:</strong> Quantify 5-year TCO, diesel-to-electric ROI, and green compliance.<br>" +
             "3. <strong>Commitment:</strong> Guarantee daily uptime with 24-hour Singapore technician response.<br><br>" +
             "<a href='index.html#vic' class='text-red-500 font-bold underline'>Learn More About V.I.C. →</a>"
    },
    {
      keywords: ["rental", "lease", "rent", "leasing", "hire", "opex"],
      reply: "We provide comprehensive long-term equipment rental (12, 24, 36, or 60 months) with <strong>predictable fixed monthly OPEX</strong>.<br><br>✓ Zero upfront capital expenditure<br>✓ All scheduled routine servicing included<br>✓ Replacement parts and 24h technical response covered<br><br><a href='equipment-rental.html' class='text-red-500 font-bold underline'>Explore Rental Plans →</a>"
    },
    {
      keywords: ["he series", "he25", "he30", "he35", "heavy duty", "2.5", "3.5 ton"],
      reply: "The <strong>HE Series (2.5 – 3.8 Ton)</strong> is our heavy-duty lithium forklift engineered to replace diesel yard trucks.<br><br>• <strong>Charging:</strong> 1.5 – 2 hrs fast charge<br>• <strong>Battery:</strong> 80V CATL LFP pack<br>• <strong>Mast Lift:</strong> Up to 6,000 mm<br><br><a href='product-spec.html?id=he-series' class='text-red-500 font-bold underline'>View HE Series Specs →</a>"
    },
    {
      keywords: ["l series", "l15", "l20", "l30", "smart warehouse"],
      reply: "The <strong>L Series (1.5 – 3.5 Ton)</strong> is our smart warehouse forklift for flexible indoor logistics and yard staging with opportunity charging.<br><br><a href='product-spec.html?id=l-series' class='text-red-500 font-bold underline'>View L Series Specs →</a>"
    },
    {
      keywords: ["je series", "je45", "je50", "heavy electric", "5 ton", "4.5 ton", "steel"],
      reply: "The <strong>JE Series (4.5 – 5.0 Ton)</strong> delivers dual high-output AC motors with 100% torque from 0 RPM, ideal for steel, stone, and heavy manufacturing logistics.<br><br><a href='product-spec.html?id=je-series' class='text-red-500 font-bold underline'>View JE Series Specs →</a>"
    },
    {
      keywords: ["reach truck", "reach", "narrow aisle", "high bay", "10m", "stand"],
      reply: "We supply <strong>Stand Type (1.5T)</strong> and <strong>Sit Type (1.5–2.0T)</strong> Reach Trucks capable of lifting up to 10 meters in narrow 1.8m aisles.<br><br><a href='product-spec.html?id=reach-truck-stand' class='text-red-500 font-bold underline'>View Reach Trucks →</a>"
    },
    {
      keywords: ["agv", "autonomous", "robot", "automation"],
      reply: "Our <strong>Stacking AGV</strong> features LiDAR SLAM navigation for 24/7 dark warehouse logistics without floor markings, seamlessly integrated with WMS.<br><br><a href='product-spec.html?id=stacking-agv' class='text-red-500 font-bold underline'>View Stacking AGV Specs →</a>"
    },
    {
      keywords: ["battery", "lithium", "charging", "charge", "catl", "lifepo4", "cycles"],
      reply: "All units feature industrial <strong>Lithium Iron Phosphate (LiFePO4 / CATL)</strong> cells:<br><br>• <strong>1.5 – 2h Rapid Charge:</strong> Top up during lunch or shift changeovers<br>• <strong>3,000+ Cycles:</strong> Expected 10-year lifespan<br>• <strong>Safe & Sealed (IP67):</strong> Zero explosive hydrogen gas, zero acid leaks<br><br><a href='lithium-ion.html' class='text-red-500 font-bold underline'>Explore Lithium Technology →</a>"
    },
    {
      keywords: ["cold chain", "freezer", "food", "sub-zero"],
      reply: "For sub-zero food storage down to -25°C, our units feature sealed IP67 battery enclosures with internal heating blankets and zero exhaust emissions over perishable goods.<br><br><a href='solution.html#coldchain' class='text-red-500 font-bold underline'>View Cold Chain Solution →</a>"
    },
    {
      keywords: ["price", "quote", "cost", "quotation", "pricing", "inquiry"],
      reply: "Equipment pricing depends on required tonnage, lift height, and whether you prefer purchase or long-term leasing.<br><br><a href='contact.html' class='inline-block bg-red-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs mt-1 shadow-sm hover:bg-red-700 transition-colors'>Request A Formal Quotation →</a>"
    },
    {
      keywords: ["contact", "phone", "location", "address", "support", "hub", "desk"],
      reply: "Contact our Singapore Regional Operations Hub:<br><br>📍 <strong>Hub:</strong> Jurong Industrial Estate, Singapore<br>📞 <strong>Direct Desk:</strong> " + CONFIG.companyPhone + "<br>✉️ <strong>Email:</strong> sg@jacforklift.com<br><br><a href='contact.html' class='text-red-500 font-bold underline'>Contact Page & Map →</a>"
    },
    {
      keywords: ["dealer", "dealership", "partner", "distribute", "franchise"],
      reply: "Interested in dealership or partnership opportunities in Southeast Asia? We provide tiered margins, certified technical training, and direct stock allocation.<br><br><a href='dealer-enquiry.html' class='text-red-500 font-bold underline'>Apply on Dealer Portal →</a>"
    }
  ];
  
  // INJECT CSS STYLES
  const style = document.createElement('style');
  style.innerHTML = `
    #jacChatLauncher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #E11D2A;
      color: #FFFFFF;
      border-radius: 9999px;
      padding: 12px 18px;
      box-shadow: 0 12px 30px -4px rgba(225, 29, 42, 0.4);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: none;
      outline: none;
    }
    #jacChatLauncher:hover {
      transform: translateY(-3px) scale(1.03);
      background: #B8141F;
    }
    #jacChatContainer {
      position: fixed;
      bottom: 85px;
      right: 24px;
      width: 370px;
      max-width: calc(100vw - 32px);
      height: 520px;
      max-height: calc(100vh - 110px);
      background: #FFFFFF;
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      border: 1px solid #E2E8F0;
      z-index: 99999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }
    #jacChatContainer.active {
      display: flex;
      animation: jacChatPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes jacChatPop {
      0% { opacity: 0; transform: translateY(20px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    .jac-chat-bubble-bot {
      background: #F1F5F9;
      color: #1E293B;
      border-radius: 16px 16px 16px 4px;
      padding: 10px 14px;
      font-size: 13px;
      line-height: 1.45;
      max-width: 82%;
      word-break: break-word;
    }
    .jac-chat-bubble-user {
      background: #E11D2A;
      color: #FFFFFF;
      border-radius: 16px 16px 4px 16px;
      padding: 10px 14px;
      font-size: 13px;
      line-height: 1.45;
      max-width: 82%;
      margin-left: auto;
      word-break: break-word;
    }
    .jac-chip-btn {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      color: #334155;
      font-size: 11px;
      font-weight: 600;
      padding: 6px 10px;
      border-radius: 9999px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .jac-chip-btn:hover {
      border-color: #E11D2A;
      color: #E11D2A;
      background: #FFF5F5;
    }
    .jac-typing-dot {
      width: 6px;
      height: 6px;
      background: #94A3B8;
      border-radius: 50%;
      display: inline-block;
      animation: jacTyping 1.4s infinite both;
    }
    .jac-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .jac-typing-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes jacTyping {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // BUILD UI ELEMENTS
  function createChatWidget() {
    // 1. Launcher Button
    const launcher = document.createElement('button');
    launcher.id = 'jacChatLauncher';
    launcher.setAttribute('aria-label', 'Open AI Chat');
    launcher.innerHTML = `
      <span style="display:flex;position:relative;">
        <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        <span style="position:absolute;top:-2px;right:-2px;width:7px;height:7px;background:#4ADE80;border-radius:50%;border:1px solid #FFF;"></span>
      </span>
      <span style="font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;">AI Chat</span>
    `;

    // 2. Chat Container
    const container = document.createElement('div');
    container.id = 'jacChatContainer';
    container.innerHTML = `
      <!-- Header -->
      <div style="background:#0B0F17;color:#FFFFFF;padding:14px 18px;display:flex;align-items:center;justify-content:between;border-bottom:1px solid #1E293B;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:34px;height:34px;border-radius:10px;background:#E11D2A;display:flex;align-items:center;justify-content:center;color:#FFF;font-weight:bold;font-size:13px;">
            JAC
          </div>
          <div>
            <div style="font-weight:700;font-size:13px;line-height:1.2;">${CONFIG.botName}</div>
            <div style="font-size:10px;color:#94A3B8;display:flex;align-items:center;gap:4px;">
              <span style="width:5px;height:5px;border-radius:50%;background:#10B981;display:inline-block;"></span> Online · Singapore Response
            </div>
          </div>
        </div>
        <button id="jacChatClose" style="background:none;border:none;color:#94A3B8;cursor:pointer;padding:4px;font-size:16px;line-height:1;" aria-label="Close Chat">✕</button>
      </div>

      <!-- Quick Chips -->
      <div style="padding:8px 14px;background:#FFFFFF;border-bottom:1px solid #F1F5F9;display:flex;gap:6px;overflow-x:auto;">
        <button class="jac-chip-btn" data-query="Rental Plans">Rental Plans</button>
        <button class="jac-chip-btn" data-query="HE Series">HE Series Specs</button>
        <button class="jac-chip-btn" data-query="Battery Charging">Charging Time</button>
        <button class="jac-chip-btn" data-query="Get a Quote">Get a Quote</button>
      </div>

      <!-- Message History -->
      <div id="jacChatHistory" style="flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;"></div>

      <!-- Input Bar -->
      <form id="jacChatForm" style="padding:10px 14px;background:#FFFFFF;border-top:1px solid #E2E8F0;display:flex;gap:8px;align-items:center;">
        <input 
          id="jacChatInput" 
          type="text" 
          placeholder="Ask about forklifts, rental, specs..." 
          style="flex:1;border:1px solid #CBD5E1;border-radius:12px;padding:9px 14px;font-size:12px;outline:none;" 
          required 
          autocomplete="off"
        />
        <button type="submit" style="background:#E11D2A;color:#FFF;border:none;border-radius:12px;padding:9px 14px;cursor:pointer;display:flex;align-items:center;justify-content:center;">
          <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </form>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(container);

    // Initial greeting
    addBotMessage(CONFIG.welcomeMessage);

    // Event Listeners
    launcher.addEventListener('click', () => {
      container.classList.toggle('active');
      if (container.classList.contains('active')) {
        document.getElementById('jacChatInput').focus();
      }
    });

    document.getElementById('jacChatClose').addEventListener('click', () => {
      container.classList.remove('active');
    });

    document.querySelectorAll('.jac-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.dataset.query;
        handleUserSend(query);
      });
    });

    document.getElementById('jacChatForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('jacChatInput');
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      handleUserSend(text);
    });
  }

  // Add Message UI Functions
  function addUserMessage(text) {
    const history = document.getElementById('jacChatHistory');
    const div = document.createElement('div');
    div.className = 'jac-chat-bubble-user';
    div.textContent = text;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
  }

  function addBotMessage(html) {
    const history = document.getElementById('jacChatHistory');
    const div = document.createElement('div');
    div.className = 'jac-chat-bubble-bot';
    div.innerHTML = html;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
  }

  function showTypingIndicator() {
    const history = document.getElementById('jacChatHistory');
    const div = document.createElement('div');
    div.id = 'jacTypingIndicator';
    div.className = 'jac-chat-bubble-bot';
    div.style.width = '48px';
    div.innerHTML = `
      <span class="jac-typing-dot"></span>
      <span class="jac-typing-dot"></span>
      <span class="jac-typing-dot"></span>
    `;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('jacTypingIndicator');
    if (indicator) indicator.remove();
  }

  // PROCESS INCOMING MESSAGES
  async function handleUserSend(text) {
    addUserMessage(text);
    showTypingIndicator();

    // If an external backend API is configured
    if (CONFIG.apiEndpoint) {
      try {
        const res = await fetch(CONFIG.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        hideTypingIndicator();
        addBotMessage(data.reply || "I'm sorry, I couldn't retrieve that information right now.");
        return;
      } catch (err) {
        console.error("AI backend error:", err);
      }
    }

    // Default: Match against Local Singapore Knowledge Base
    setTimeout(() => {
      hideTypingIndicator();
      const lower = text.toLowerCase();
      let matchedReply = null;

      for (const item of KNOWLEDGE_BASE) {
        if (item.keywords.some(k => lower.includes(k))) {
          matchedReply = item.reply;
          break;
        }
      }

      if (matchedReply) {
        addBotMessage(matchedReply);
      } else {
        addBotMessage(
          `Thanks for asking! I'm best at answering inquiries about our <strong>electric forklifts</strong>, <strong>1.5h fast charging</strong>, <strong>rental plans</strong>, and <strong>Singapore service hubs</strong>.<br><br>` +
          `Would you like to speak directly with an engineer? <br><a href="${CONFIG.inquiryPage}" class="text-red-500 font-bold underline">Send a Technical Inquiry →</a>`
        );
      }
    }, 600); // realistic short delay
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }
})();