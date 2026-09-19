// =========================================================================
// ai-chat.js - JAC Forklift Singapore AI Auto-Reply Chat Widget (Multi-Turn)
// Features: Dynamic Markdown Parser, Autolink for WhatsApp, Emails & Maps
// Theme: Dark Forest Emerald & Obsidian
// =========================================================================

(function () {
  const CONFIG = {
    botName: "JAC Singapore AI",
    welcomeMessage: "Hello! 👋 I'm your JAC Singapore Engineering Consultant. How can I assist with your equipment sizing, lithium charging, or quotation today?",
    apiEndpoint: "https://jac-chat-ai.allenliewkq.workers.dev",
    whatsappNumber: "60138188181"
  };

  const STORAGE_KEY = 'jac_chat_conversation_history_v2';

  // INJECT UNIFIED DARK EMERALD CSS STYLES
  const style = document.createElement('style');
  style.innerHTML = `
    #jacChatLauncher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99998;
      display: flex;
      align-items: center;
      gap: 10px;
      background: #047857;
      color: #FFFFFF;
      border-radius: 9999px;
      padding: 12px 20px;
      box-shadow: 0 12px 30px -4px rgba(4, 120, 87, 0.5);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      outline: none;
    }
    #jacChatLauncher:hover {
      transform: translateY(-3px) scale(1.03);
      background: #065f46;
      box-shadow: 0 16px 36px -4px rgba(4, 120, 87, 0.6);
    }
    #jacChatContainer {
      position: fixed;
      bottom: 90px;
      right: 24px;
      width: 410px;
      max-width: calc(100vw - 32px);
      height: 570px;
      max-height: calc(100vh - 120px);
      background: #FFFFFF;
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(11, 15, 23, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.08);
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
      background: #F8FAFC;
      color: #1E293B;
      border-radius: 18px 18px 18px 4px;
      padding: 14px 16px;
      font-size: 13px;
      line-height: 1.6;
      max-width: 90%;
      word-break: break-word;
      border: 1px solid #E2E8F0;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.02);
    }
    .jac-chat-bubble-bot a {
      color: #047857 !important;
      font-weight: 700;
      text-decoration: underline;
      transition: color 0.2s;
    }
    .jac-chat-bubble-bot a:hover {
      color: #065f46 !important;
    }
    .jac-chat-bubble-user {
      background: #047857;
      color: #FFFFFF;
      border-radius: 18px 18px 4px 18px;
      padding: 12px 16px;
      font-size: 13px;
      line-height: 1.5;
      max-width: 85%;
      margin-left: auto;
      word-break: break-word;
      box-shadow: 0 4px 14px rgba(4, 120, 87, 0.25);
    }
    .jac-chip-btn {
      background: #F1F5F9;
      border: 1px solid #E2E8F0;
      color: #334155;
      font-size: 11px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 9999px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .jac-chip-btn:hover {
      border-color: #047857;
      color: #047857;
      background: #ECFDF5;
    }
    .jac-typing-dot {
      width: 6px;
      height: 6px;
      background: #10B981;
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

  // BUILD UI WIDGET
  function createChatWidget() {
    if (document.getElementById('jacChatLauncher')) return;

    // 1. Floating Launcher Button
    const launcher = document.createElement('button');
    launcher.id = 'jacChatLauncher';
    launcher.setAttribute('aria-label', 'Open JAC Singapore AI Assistant');
    launcher.innerHTML = `
      <span style="display:flex;position:relative;">
        <svg style="width:20px;height:20px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        <span style="position:absolute;top:-2px;right:-2px;width:8px;height:8px;background:#34D399;border-radius:50%;border:1.5px solid #047857;"></span>
      </span>
      <span style="font-family:'Montserrat',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;">AI Assistant</span>
    `;

    // 2. Chat Container
    const container = document.createElement('div');
    container.id = 'jacChatContainer';
    container.innerHTML = `
      <!-- Header -->
      <div style="background:#0B0F17;color:#FFFFFF;padding:15px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1E293B;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:34px;height:34px;border-radius:10px;background:#047857;border:1px solid #059669;display:flex;align-items:center;justify-content:center;color:#FFF;font-weight:800;font-size:12px;font-family:'Montserrat',sans-serif;">
            JAC
          </div>
          <div>
            <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:13px;line-height:1.2;">${CONFIG.botName}</div>
            <div style="font-size:10px;color:#94A3B8;display:flex;align-items:center;gap:4px;margin-top:2px;">
              <span style="width:6px;height:6px;border-radius:50%;background:#10B981;display:inline-block;"></span> Online · Singapore Sizing Desk
            </div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;">
          <button id="jacChatClear" title="Clear Conversation" style="background:none;border:none;color:#94A3B8;cursor:pointer;padding:4px;font-size:14px;" aria-label="Clear Conversation">🗑️</button>
          <button id="jacChatClose" style="background:none;border:none;color:#94A3B8;cursor:pointer;padding:4px 6px;font-size:16px;line-height:1;" aria-label="Close Chat">✕</button>
        </div>
      </div>

      <!-- Quick Action Chips -->
      <div style="padding:9px 14px;background:#FFFFFF;border-bottom:1px solid #F1F5F9;display:flex;gap:6px;overflow-x:auto;">
        <button class="jac-chip-btn" data-query="Who is your boss and how can I contact him?">Alvin Lim Contact</button>
        <button class="jac-chip-btn" data-query="Where are your Singapore facilities located?">Locations & Maps</button>
        <button class="jac-chip-btn" data-query="How much does it cost to rent or buy a forklift?">Pricing & Rental</button>
        <button class="jac-chip-btn" data-query="Which forklift model replaces a diesel truck?">Diesel Replacement</button>
      </div>

      <!-- Message History -->
      <div id="jacChatHistory" style="flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:12px;background:#FAFAFA;"></div>

      <!-- Input Bar -->
      <form id="jacChatForm" style="padding:12px 14px;background:#FFFFFF;border-top:1px solid #E2E8F0;display:flex;gap:8px;align-items:center;">
        <input 
          id="jacChatInput" 
          type="text" 
          placeholder="Ask about Alvin Lim, Tuas/Paya Lebar, pricing..." 
          style="flex:1;border:1px solid #CBD5E1;border-radius:12px;padding:10px 14px;font-size:12.5px;outline:none;background:#F8FAFC;" 
          required 
          autocomplete="off"
        />
        <button type="submit" style="background:#047857;color:#FFF;border:none;border-radius:12px;padding:10px 14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;" aria-label="Send Message">
          <svg style="width:14px;height:14px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </form>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(container);

    // Load or initialize conversation history from localStorage
    let savedHistory = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!savedHistory || !Array.isArray(savedHistory) || savedHistory.length === 0) {
      savedHistory = [{ role: 'assistant', text: CONFIG.welcomeMessage }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedHistory));
    }

    // Render loaded history
    const historyBox = document.getElementById('jacChatHistory');
    historyBox.innerHTML = '';
    savedHistory.forEach(msg => {
      if (msg.role === 'user') {
        appendUserMessageToDOM(msg.text, false);
      } else {
        appendBotMessageToDOM(msg.text, false);
      }
    });

    // Event Listeners
    launcher.addEventListener('click', () => {
      container.classList.toggle('active');
      if (container.classList.contains('active')) {
        document.getElementById('jacChatInput').focus();
        const hist = document.getElementById('jacChatHistory');
        hist.scrollTop = hist.scrollHeight;
      }
    });

    document.getElementById('jacChatClose').addEventListener('click', () => {
      container.classList.remove('active');
    });

    // Clear history handler
    document.getElementById('jacChatClear').addEventListener('click', () => {
      const freshHistory = [{ role: 'assistant', text: CONFIG.welcomeMessage }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshHistory));
      historyBox.innerHTML = '';
      appendBotMessageToDOM(CONFIG.welcomeMessage, false);
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

  // Helpers to save state to localStorage
  function saveMessageToStorage(role, text) {
    let saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    saved.push({ role, text });
    if (saved.length > 20) saved = saved.slice(-20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }

  // ADVANCED MARKDOWN & AUTOLINK PARSER
  function formatMarkdown(text) {
    if (!text) return "";

    // 1. Process explicit markdown links: [Label](url)
    let formatted = text.replace(/\[(.*?)\]\((.*?)\)/g, (match, label, url) => {
      const isExternal = url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:');
      const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${url}" ${targetAttr} class="text-emerald-700 font-bold underline hover:text-emerald-900 transition-colors inline">${label} →</a>`;
    });

    // 2. Bold and italic markdown
    formatted = formatted
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^\s*[\-\*]\s+(.*)$/gm, '• $1')
      .replace(/\n/g, '<br>');

    // 3. Autolink unlinked emails
    formatted = formatted.replace(
      /(?<!href=["']|">)([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      '<a href="mailto:$1" class="text-emerald-700 font-bold underline hover:text-emerald-900 transition-colors inline">$1</a>'
    );

    // 4. Autolink unlinked phone numbers (+60 13-818 8181) directly to WhatsApp
    formatted = formatted.replace(
      /(?<!href=["']|">)(\+60\s?13[-.\s]?818\s?8181)/g,
      '<a href="https://wa.me/60138188181" target="_blank" rel="noopener noreferrer" class="text-emerald-700 font-bold underline hover:text-emerald-900 transition-colors inline">$1 (WhatsApp)</a>'
    );

    // 5. Autolink unlinked Singapore Addresses to Google Maps
    formatted = formatted.replace(
      /(?<!href=["']|">)(60 Paya Lebar Road[^<,\n]*(?:Singapore 409051)?)/gi,
      '<a href="https://www.google.com/maps/search/?api=1&query=60+Paya+Lebar+Road+%2306-28+Paya+Lebar+Square+Singapore+409051" target="_blank" rel="noopener noreferrer" class="text-emerald-700 font-bold underline hover:text-emerald-900 transition-colors inline">$1 (Google Maps)</a>'
    );

    formatted = formatted.replace(
      /(?<!href=["']|">)(15 Pioneer Road North[^<,\n]*(?:Singapore 628464)?)/gi,
      '<a href="https://www.google.com/maps/search/?api=1&query=15+Pioneer+Road+North+%2301-79+Singapore+628464" target="_blank" rel="noopener noreferrer" class="text-emerald-700 font-bold underline hover:text-emerald-900 transition-colors inline">$1 (Google Maps)</a>'
    );

    formatted = formatted.replace(
      /(?<!href=["']|">)((?:The Index,\s*)?110 Tuas Ave 3[^<,\n]*(?:Singapore 637369)?)/gi,
      '<a href="https://www.google.com/maps/search/?api=1&query=The+Index+110+Tuas+Ave+3+%2303-04+Singapore+637369" target="_blank" rel="noopener noreferrer" class="text-emerald-700 font-bold underline hover:text-emerald-900 transition-colors inline">$1 (Google Maps)</a>'
    );

    return formatted;
  }

  function appendUserMessageToDOM(text, save = true) {
    const history = document.getElementById('jacChatHistory');
    const div = document.createElement('div');
    div.className = 'jac-chat-bubble-user';
    div.textContent = text;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
    if (save) saveMessageToStorage('user', text);
  }

  function appendBotMessageToDOM(text, save = true) {
    const history = document.getElementById('jacChatHistory');
    const div = document.createElement('div');
    div.className = 'jac-chat-bubble-bot';
    div.innerHTML = formatMarkdown(text);
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
    if (save) saveMessageToStorage('assistant', text);
  }

  function showTypingIndicator() {
    const history = document.getElementById('jacChatHistory');
    const div = document.createElement('div');
    div.id = 'jacTypingIndicator';
    div.className = 'jac-chat-bubble-bot';
    div.style.width = '52px';
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

  // Multi-Turn Message Dispatcher
  async function handleUserSend(text) {
    appendUserMessageToDOM(text, true);
    showTypingIndicator();

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const formattedMessages = saved.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text
    }));

    let replied = false;

    if (CONFIG.apiEndpoint) {
      try {
        const res = await fetch(CONFIG.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            messages: formattedMessages,
            message: text 
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.reply) {
            hideTypingIndicator();
            appendBotMessageToDOM(data.reply, true);
            replied = true;
            return;
          }
        }
      } catch (err) {
        console.warn("Cloudflare Worker unreachable, switching to local knowledge fallback.", err);
      }
    }

    // Local Fallback if network or Cloudflare is unreachable
    if (!replied) {
      setTimeout(() => {
        hideTypingIndicator();
        const q = text.toLowerCase();
        let fallbackReply = null;

        if (q.includes("boss") || q.includes("alvin") || q.includes("director")) {
          fallbackReply = "Our Executive Director is **Alvin C. S. Lim**, who oversees the operations, fleet engineering, and corporate strategy of JAC Forklift Singapore.<br><br>You can reach him directly at:<br>• **WhatsApp / Mobile:** [+60 13-818 8181](https://wa.me/60138188181)<br>• **Email:** [alvincslim@gmail.com](mailto:alvincslim@gmail.com)<br><br>Or submit an enquiry via our [Online Quote Form](contact.html).";
        } else if (q.includes("where") || q.includes("location") || q.includes("address") || q.includes("facility") || q.includes("facilities")) {
          fallbackReply = "Our Singapore facilities are located at:<br><br>1. **Corporate Headquarters (HQ SG):**<br>[60 Paya Lebar Road, #06-28, Paya Lebar Square, Singapore 409051](https://www.google.com/maps/search/?api=1&query=60+Paya+Lebar+Road+%2306-28+Paya+Lebar+Square+Singapore+409051)<br><br>2. **Fabrication Workshop:**<br>[15 Pioneer Road North, #01-79, Singapore 628464](https://www.google.com/maps/search/?api=1&query=15+Pioneer+Road+North+%2301-79+Singapore+628464) (heavy builds & mast modifications)<br><br>3. **Forklift Centre:**<br>[The Index, 110 Tuas Ave 3, #03-04, Singapore 637369](https://www.google.com/maps/search/?api=1&query=The+Index+110+Tuas+Ave+3+%2303-04+Singapore+637369) (showroom, demos & 10,000+ spares)<br><br>[View Regional Service Network on Map](contact.html#dealerMap)";
        } else if (q.includes("price") || q.includes("cost") || q.includes("rent") || q.includes("quote")) {
          fallbackReply = "Our equipment pricing and monthly rental rates depend on your required tonnage (1.5T to 5.0T), mast lifting height, and whether you prefer an outright purchase or a full-maintenance rental (12–60 months).<br><br>All long-term rentals include routine servicing, wear-and-tear parts, and a 24h Singapore technician SLA.<br><br>[Request a Formal Quote](contact.html) or WhatsApp Alvin Lim directly at [+60 13-818 8181](https://wa.me/60138188181).";
        } else {
          fallbackReply = "Hello! 👋 I'm your JAC Singapore assistant. You can ask me about our 13 electric forklift models, battery opportunity charging, rental plans, or [Request a Quote](contact.html). You can also WhatsApp Alvin Lim directly at [+60 13-818 8181](https://wa.me/60138188181).";
        }

        appendBotMessageToDOM(fallbackReply, true);
      }, 400);
    }
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }
})();