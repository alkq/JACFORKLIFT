// =========================================================================
// ai-chat.js - JAC Forklift Singapore AI Auto-Reply Chat Widget
// =========================================================================

(function () {
  // CONFIGURATION - Connected to your live Cloudflare Worker
  const CONFIG = {
    botName: "JAC Singapore AI",
    welcomeMessage: "Hello! 👋 I'm your JAC Singapore assistant. How can I help with your material handling today?",
    companyPhone: "+65 6XXX XXXX",
    inquiryPage: "contact.html",
    apiEndpoint: "https://jac-chat-ai.allenliewkq.workers.dev",
  };

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
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 540px;
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
      padding: 12px 16px;
      font-size: 13px;
      line-height: 1.55;
      max-width: 88%;
      word-break: break-word;
    }
    .jac-chat-bubble-bot a {
      color: #E11D2A;
      font-weight: 700;
      text-decoration: underline;
      transition: color 0.2s;
    }
    .jac-chat-bubble-bot a:hover {
      color: #B8141F;
    }
    .jac-chat-bubble-user {
      background: #E11D2A;
      color: #FFFFFF;
      border-radius: 16px 16px 4px 16px;
      padding: 11px 15px;
      font-size: 13px;
      line-height: 1.5;
      max-width: 85%;
      margin-left: auto;
      word-break: break-word;
    }
    .jac-chip-btn {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      color: #334155;
      font-size: 11px;
      font-weight: 600;
      padding: 6px 11px;
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
    // 1. Floating Launcher Button
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

    // 2. Chat Window Container
    const container = document.createElement('div');
    container.id = 'jacChatContainer';
    container.innerHTML = `
      <!-- Header -->
      <div style="background:#0B0F17;color:#FFFFFF;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1E293B;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:34px;height:34px;border-radius:10px;background:#E11D2A;display:flex;align-items:center;justify-content:center;color:#FFF;font-weight:bold;font-size:13px;">
            JAC
          </div>
          <div>
            <div style="font-weight:700;font-size:13px;line-height:1.2;">${CONFIG.botName}</div>
            <div style="font-size:10px;color:#94A3B8;display:flex;align-items:center;gap:4px;">
              <span style="width:5px;height:5px;border-radius:50%;background:#10B981;display:inline-block;"></span> Online · Singapore Regional Hub
            </div>
          </div>
        </div>
        <button id="jacChatClose" style="background:none;border:none;color:#94A3B8;cursor:pointer;padding:4px;font-size:16px;line-height:1;" aria-label="Close Chat">✕</button>
      </div>

      <!-- Quick Action Chips -->
      <div style="padding:8px 14px;background:#FFFFFF;border-bottom:1px solid #F1F5F9;display:flex;gap:6px;overflow-x:auto;">
        <button class="jac-chip-btn" data-query="Can you explain the background of your company?">About JAC</button>
        <button class="jac-chip-btn" data-query="What are your equipment rental plans?">Rental Plans</button>
        <button class="jac-chip-btn" data-query="Tell me about HE Series specifications">HE Series Specs</button>
        <button class="jac-chip-btn" data-query="How does lithium charging work?">Charging Tech</button>
      </div>

      <!-- Message History -->
      <div id="jacChatHistory" style="flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;"></div>

      <!-- Input Bar -->
      <form id="jacChatForm" style="padding:10px 14px;background:#FFFFFF;border-top:1px solid #E2E8F0;display:flex;gap:8px;align-items:center;">
        <input 
          id="jacChatInput" 
          type="text" 
          placeholder="Ask about forklifts, history, rental..." 
          style="flex:1;border:1px solid #CBD5E1;border-radius:12px;padding:9px 14px;font-size:12px;outline:none;" 
          required 
          autocomplete="off"
        />
        <button type="submit" style="background:#E11D2A;color:#FFF;border:none;border-radius:12px;padding:9px 14px;cursor:pointer;display:flex;align-items:center;justify-content:center;" aria-label="Send Message">
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

  // MARKDOWN FORMATTER: Converts AI Markdown to Clean Styled HTML
  function formatMarkdown(text) {
    if (!text) return "";
    return text
      // Convert Markdown links [Label](url) to styled clickable links without displaying .html
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-red-600 font-bold underline hover:text-red-800 transition-colors inline-block my-1">$1 →</a>')
      // Convert **bold** to <strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert list dashes or asterisks to clean bullets
      .replace(/^\s*[\-\*]\s+(.*)$/gm, '• $1')
      // Convert newlines to HTML linebreaks
      .replace(/\n/g, '<br>');
  }

  function addUserMessage(text) {
    const history = document.getElementById('jacChatHistory');
    const div = document.createElement('div');
    div.className = 'jac-chat-bubble-user';
    div.textContent = text;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
  }

  function addBotMessage(text) {
    const history = document.getElementById('jacChatHistory');
    const div = document.createElement('div');
    div.className = 'jac-chat-bubble-bot';
    div.innerHTML = formatMarkdown(text);
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

  // MESSAGE DISPATCHER (Cloudflare Worker with Offline Graceful Fallback)
  async function handleUserSend(text) {
    addUserMessage(text);
    showTypingIndicator();

    let replied = false;

    // 1. Call Cloudflare Worker
    if (CONFIG.apiEndpoint) {
      try {
        const res = await fetch(CONFIG.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text })
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.reply) {
            hideTypingIndicator();
            addBotMessage(data.reply);
            replied = true;
            return;
          }
        }
      } catch (err) {
        console.warn("Cloudflare Worker unreachable, switching to local knowledge fallback.", err);
      }
    }

    // 2. Fallback Response (Used if offline or during temporary network disconnects)
    if (!replied) {
      setTimeout(() => {
        hideTypingIndicator();
        const q = text.toLowerCase();
        let fallbackReply = null;

        if (q.includes("background") || q.includes("history") || q.includes("about") || q.includes("company")) {
          fallbackReply = "JAC Material Handling is the exclusive Singapore distributor of JAC electric forklifts, backed by JAC Motors (Anhui Jianghuai Automobile Group Corp., Ltd., founded 1964) with 60+ years of manufacturing heritage.<br><br>[Read More About Us](about.html)";
        } else if (q.includes("rent") || q.includes("lease") || q.includes("opex")) {
          fallbackReply = "We provide flexible long-term equipment rental plans (12, 24, 36, or 60 months) with zero upfront capital, fixed monthly OPEX, and full routine maintenance included.<br><br>[View Equipment Rental Plans](equipment-rental.html)";
        } else if (q.includes("he") || q.includes("heavy")) {
          fallbackReply = "The HE Series (2.5 – 3.8 Ton) is our heavy-duty counterbalance forklift engineered with 80V CATL lithium batteries to replace diesel yard machines with zero emissions.<br><br>[View HE Series Specifications](product-spec.html?id=he-series)";
        } else if (q.includes("battery") || q.includes("charge") || q.includes("charging")) {
          fallbackReply = "All models feature industrial CATL Lithium Iron Phosphate (LiFePO4) battery packs with 1.5–2 hour opportunity fast charging and 3,000+ deep cycles.<br><br>[Learn About Lithium Technology](lithium-ion.html)";
        } else {
          fallbackReply = "Hello! 👋 I'm your JAC Singapore assistant. You can ask me about our 13 electric forklift models, rental plans, or [Request a Quote](contact.html).";
        }

        addBotMessage(fallbackReply);
      }, 500);
    }
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatWidget);
  } else {
    createChatWidget();
  }
})();