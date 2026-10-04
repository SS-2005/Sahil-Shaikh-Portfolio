/**
 * Sahil Shaikh Portfolio AI Chatbot
 * Real Open-Source LLM Integration (Groq LLaMA 3.1 / Netlify Serverless / Local Direct)
 * With Touch & Mouse Draggable Toggle and Complete Portfolio Knowledge Base
 */

(function () {
  const DEFAULT_GROQ_MODEL = 'qwen/qwen3.8-27b';
  const GROQ_CANDIDATE_MODELS = [
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'allam-2-7b'
  ];

  // 1. Comprehensive Portfolio Knowledge System Prompt
  const PORTFOLIO_SYSTEM_PROMPT = `You are "Sahil's AI Assistant", the official representative for Sahil Shaikh's portfolio.
Answer questions directly, accurately, warmly, and concisely (under 150 words unless detailed explanation is asked).

Key Facts about Sahil Shaikh:
- Name: Sahil Shaikh
- Profession: AI/ML Engineer, Generative AI Developer & Data Scientist
- Location: Nerul, Navi Mumbai, Maharashtra, India
- Phone: +91 9518755570
- Email: sahil.shaikh24@aiml.sce.edu.in
- Degree: B.E. Computer Science Engineering (AIML) at Saraswati College of Engineering, Kharghar (Mumbai University), 4th Year (2023-2027), CGPA 9.50 (Department 1st Ranker).
- High School: Nowrosjee Wadia College, Pune (HSC Science, 2021-2023).
- Work Experience:
  1. Ural Federal University (UrFU Russia) - IT & AI Summer Intern (July 2026, On-site). AIML & Gen AI international research.
  2. Banao Technologies (ATG) - AI-Developer Intern (Jan 2026 - Jul 2026). Real-time GenAI deployment.
  3. CollegeTips.in - Research Intern (May 2025). Content recommendation and NLP feedback analysis.
  4. Orinson Technology - AI/ML Intern (Dec 2024 - Jan 2025). Supervised classification & regression models.
- Top Featured Projects:
  1. CyberArena: Autonomous AI Agent Cybersecurity Simulation in isolated Linux VMs via Ollama (Qwen 2.5 / LLaMA 3.2), FastAPI, React, Paramiko SSH, ReAct loops, guardrails. (GitHub: SS-2005/CyberArena-Autonomous-LLM-Based-Cybersecurity-Simulation)
  2. 3D AI Avatar: Real-time speaking 3D avatar with viseme lip sync, sub-100ms latency, WebGL & Three.js. (Live: ss-2005.github.io/3D-AI-Avatar-System/)
  3. NeuroWell Predict: Mental health risk assessment via genetic biomarkers and ML (91.3% accuracy). (Live: onrender.com)
- Other Notable Projects: Debate System (LangGraph multi-agent debate), RAG System (ChromaDB + LangChain), Face Recognition (FaceNet 94.3%), HandScript (Handwriting synthesis 89.5%), ScrapeWise (OSINT scam scraper), Fake Review Detector (PyTorch), CheckMax, AI Commentor, Dog Breed Identification.
- Skills: Python, PyTorch, TensorFlow, OpenCV, FastAPI, React, LangChain, LangGraph, Ollama, Scikit-Learn, Pandas, NumPy, VirtualBox, ReAct Loops, Prompt Engineering.
- Achievements: 1st Ranker Academic Excellence (CGPA 9.50), IBM AI Agent Architect, OCI Generative AI & Data Science Professional, LeetCode 100-Day streak.
- Resumes: AI/ML Engineer, Generative AI, and Prompt Engineering resumes downloadable on the site.

When asked, provide exact details and helpful links to his projects or resumes.`;

  // Local knowledge summary for instant fallback / offline assistance
  const LOCAL_KNOWLEDGE = {
    profile: {
      name: "Sahil Shaikh",
      title: "AI/ML Engineer & Data Scientist",
      degree: "B.E. Computer Science Engineering (AIML), CGPA 9.50",
      college: "Saraswati College of Engineering, Kharghar (University of Mumbai)",
      phone: "+91 9518755570",
      email: "sahil.shaikh24@aiml.sce.edu.in",
      location: "Nerul, Navi Mumbai, India",
      github: "https://github.com/SS-2005",
      linkedin: "https://www.linkedin.com/in/sahilshaikh110205/"
    },
    top_projects: [
      { name: "CyberArena", tech: "FastAPI, React, Ollama, VirtualBox, Paramiko", link: "projects/cyberarena.html", desc: "Autonomous AI agent cybersecurity simulation platform in isolated Linux VMs." },
      { name: "3D AI Avatar", tech: "Three.js, WebGL, Visemes, Neural TTS", link: "projects/3d-ai-avatar.html", desc: "Real-time speaking 3D avatar with viseme lip synchronization." },
      { name: "NeuroWell Predict", tech: "TensorFlow, BioPython, Pandas", link: "projects/neurowell-predict.html", desc: "Mental health risk prediction combining genetic and nutrigenomic data." }
    ]
  };

  let conversationHistory = [];
  let isSending = false;

  // Helper: Detect if inside /projects/ directory
  const isInsideProjectsFolder = window.location.pathname.includes('/projects/');
  function resolveLink(link) {
    if (!link || link.startsWith('http')) return link;
    if (isInsideProjectsFolder) {
      if (link.startsWith('projects/')) {
        return link.replace('projects/', '');
      }
      return '../' + link;
    }
    return link;
  }

  // Simple Markdown Parser for clean responses
  function formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks
    html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gi, '<pre><code>$2</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // Markdown links: [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // Lists: lines starting with "- " or "* "
    html = html.replace(/^\s*[-*]\s+(.*)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    // Newlines to line breaks (outside lists and pre)
    html = html.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

    return html;
  }

  // Generate Chatbot UI
  function initChatbotUI() {
    // 1. Draggable Floating Toggle Button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'portfolio-chatbot-toggle';
    toggleBtn.id = 'portfolioChatbotToggle';
    toggleBtn.setAttribute('aria-label', "Open Sahil's AI Chatbot (Draggable)");
    toggleBtn.setAttribute('title', "Click to chat · Drag to reposition");
    toggleBtn.innerHTML = `
      <i class="bi bi-grip-vertical chatbot-drag-grip" title="Drag to move"></i>
      <i class="bi bi-robot"></i>
      <span class="toggle-text">Chat with Sahil's AI</span>
    `;
    document.body.appendChild(toggleBtn);

    // 2. Chat Window
    const chatWin = document.createElement('div');
    chatWin.className = 'portfolio-chatbot-window';
    chatWin.id = 'portfolioChatbotWindow';
    chatWin.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">
            <i class="bi bi-robot"></i>
          </div>
          <div class="chatbot-header-text">
            <h3>Sahil's AI Assistant</h3>
            <span class="chatbot-status" id="chatbotStatusIndicator">Online · Active</span>
          </div>
        </div>
        <div class="chatbot-header-actions">
          <button class="chatbot-header-btn" id="chatbotResetBtn" title="Reset Chat">
            <i class="bi bi-arrow-clockwise"></i>
          </button>
          <button class="chatbot-header-btn" id="chatbotCloseBtn" title="Close Chat">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <div class="chatbot-messages" id="chatbotMessages">
        <!-- Messages rendered dynamically -->
      </div>

      <div class="chatbot-chips" id="chatbotChips">
        <button class="chip-btn" data-query="Who is Sahil and what are his core strengths?">👋 About Sahil</button>
        <button class="chip-btn" data-query="What are Sahil's top 3 projects?">🚀 Top Projects</button>
        <button class="chip-btn" data-query="Tell me about CyberArena and its VM simulation">🛡️ CyberArena</button>
        <button class="chip-btn" data-query="Tell me about his internships at UrFU Russia and Banao">💼 Experience</button>
        <button class="chip-btn" data-query="What is his college, degree and CGPA?">🎓 Education (9.50)</button>
        <button class="chip-btn" data-query="What technical skills does he specialize in?">⚡ Tech Skills</button>
        <button class="chip-btn" data-query="What certifications and awards has he received?">🏆 Achievements</button>
        <button class="chip-btn" data-query="How can I download his latest resumes?">📄 Resumes</button>
        <button class="chip-btn" data-query="How can I get in touch with Sahil?">📬 Contact</button>
      </div>

      <div class="chatbot-input-wrap">
        <input type="text" id="chatbotInput" placeholder="Ask anything about Sahil's projects, skills..." autocomplete="off">
        <button class="chatbot-send-btn" id="chatbotSendBtn" title="Send query">
          <i class="bi bi-send-fill"></i>
        </button>
      </div>
    `;
    document.body.appendChild(chatWin);

    // Initial Welcome Message
    appendBotMessage(
      `Hello! I'm <strong>Sahil's AI Assistant</strong>, powered by open-source LLM intelligence. 🤖<br><br>` +
      `I have complete knowledge of Sahil's <strong>26 AI/ML projects</strong> (including <em>CyberArena</em>, <em>3D AI Avatar</em>, <em>NeuroWell Predict</em>), ` +
      `his <strong>internships</strong> (UrFU Russia, Banao Tech), <strong>academic track record (CGPA 9.50)</strong>, and <strong>certifications</strong>.<br><br>` +
      `Ask me anything, or tap any topic chip below!`
    );

    initDraggableToggle(toggleBtn, chatWin);
    bindChatEvents(chatWin);
  }

  // 2. Touch & Mouse Draggable Toggle Implementation
  function initDraggableToggle(btn, chatWin) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = 0, initialTop = 0;
    let hasMoved = false;

    function getCoords(e) {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    }

    function onDragStart(e) {
      if (e.type === 'mousedown' && e.button !== 0) return;
      const coords = getCoords(e);
      startX = coords.x;
      startY = coords.y;
      hasMoved = false;
      isDragging = true;

      const rect = btn.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      btn.classList.add('is-dragging');

      window.addEventListener('mousemove', onDragMove, { passive: false });
      window.addEventListener('touchmove', onDragMove, { passive: false });
      window.addEventListener('mouseup', onDragEnd);
      window.addEventListener('touchend', onDragEnd);
    }

    function onDragMove(e) {
      if (!isDragging) return;
      const coords = getCoords(e);
      const dx = coords.x - startX;
      const dy = coords.y - startY;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMoved = true;
        if (e.cancelable) e.preventDefault();
      }

      if (hasMoved) {
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const btnW = btn.offsetWidth;
        const btnH = btn.offsetHeight;

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // Keep inside screen boundaries
        newLeft = Math.max(10, Math.min(newLeft, winW - btnW - 10));
        newTop = Math.max(10, Math.min(newTop, winH - btnH - 10));

        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
        btn.style.left = `${newLeft}px`;
        btn.style.top = `${newTop}px`;
      }
    }

    function onDragEnd(e) {
      if (!isDragging) return;
      isDragging = false;
      btn.classList.remove('is-dragging');

      window.removeEventListener('mousemove', onDragMove);
      window.removeEventListener('touchmove', onDragMove);
      window.removeEventListener('mouseup', onDragEnd);
      window.removeEventListener('touchend', onDragEnd);

      if (!hasMoved) {
        // Pure click/tap: toggle chat window
        toggleChatWindow(chatWin);
      }
    }

    btn.addEventListener('mousedown', onDragStart);
    btn.addEventListener('touchstart', onDragStart, { passive: false });
  }

  function toggleChatWindow(chatWin) {
    const isActive = chatWin.classList.contains('active');
    if (isActive) {
      chatWin.classList.remove('active');
    } else {
      chatWin.classList.add('active');
      const input = document.getElementById('chatbotInput');
      if (input) setTimeout(() => input.focus(), 300);
    }
  }

  // 3. UI Helpers
  function appendUserMessage(text) {
    const container = document.getElementById('chatbotMessages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg user';
    const cleanText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    msg.innerHTML = `<div class="msg-bubble">${cleanText}</div>`;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function appendBotMessage(html) {
    const container = document.getElementById('chatbotMessages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot';
    msg.innerHTML = `<div class="msg-bubble">${html}</div>`;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function showTypingIndicator() {
    const container = document.getElementById('chatbotMessages');
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot typing-indicator';
    typing.id = 'chatbotTypingIndicator';
    typing.innerHTML = `
      <div class="msg-bubble">
        <div class="chatbot-typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  }

  function removeTypingIndicator() {
    const ind = document.getElementById('chatbotTypingIndicator');
    if (ind) ind.remove();
  }

  // Helper: Call Groq Chat API with automatic cascading candidate model fallback across the 4 verified models
  async function callGroqWithFallback(apiKey, messages) {
    const modelsToTry = GROQ_CANDIDATE_MODELS;
    let lastError = '';

    for (const model of modelsToTry) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: 0.5,
            max_tokens: 700
          })
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return { success: true, reply, model };
          }
        }

        const errData = await groqRes.json().catch(() => ({}));
        const errMsg = errData.error?.message || `HTTP ${groqRes.status}`;
        const errCode = errData.error?.code || '';
        lastError = errMsg;

        // Check if error is related to model availability, terms requirement, or access permissions
        const isModelIssue =
          groqRes.status === 404 ||
          errCode === 'model_not_found' ||
          errCode === 'model_terms_required' ||
          errCode === 'model_decommissioned' ||
          (groqRes.status === 400 && (
            errMsg.toLowerCase().includes('model') ||
            errMsg.toLowerCase().includes('terms') ||
            errMsg.toLowerCase().includes('accept') ||
            errMsg.toLowerCase().includes('exist') ||
            errMsg.toLowerCase().includes('access')
          ));

        if (isModelIssue) {
          console.warn(`Groq model "${model}" unavailable (${errMsg}). Cascading to next backup model...`);
          continue;
        }

        return { success: false, error: errMsg };
      } catch (clientErr) {
        return { success: false, error: `Connection failed: ${clientErr.message}` };
      }
    }

    return {
      success: false,
      error: `Model access issue: ${lastError || 'None of the tested models are enabled on this key'}`
    };
  }

  // 4. Send Message via Real LLM (Netlify Function / Direct Groq / Local Fallback)
  async function handleUserQuery(query) {
    if (!query || !query.trim() || isSending) return;
    const cleanQuery = query.trim();

    appendUserMessage(cleanQuery);
    // Add user query to conversation history
    conversationHistory.push({ role: 'user', content: cleanQuery });

    isSending = true;
    showTypingIndicator();

    try {
      const savedKey = localStorage.getItem('portfolio_groq_key') || '';

      // Retain full conversational context across turns (last 12 exchanges: user queries & assistant replies)
      const contextHistory = conversationHistory.slice(-12);

      // Step A: Attempt Netlify Serverless Function endpoint (Works automatically on Netlify)
      let backendSuccess = false;
      let replyText = '';

      try {
        const netlifyRes = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: cleanQuery,
            history: conversationHistory.slice(0, -1).slice(-10),
            apiKey: savedKey
          })
        });

        if (netlifyRes.ok) {
          const data = await netlifyRes.json();
          if (data && data.reply && !data.needsApiKey) {
            replyText = data.reply;
            backendSuccess = true;
          }
        }
      } catch (err) {
        // Not running on Netlify currently (local static preview)
        backendSuccess = false;
      }

      // Step B: Direct Groq Call if API key was provided
      if (!backendSuccess && savedKey) {
        const groqMessages = [
          { role: 'system', content: PORTFOLIO_SYSTEM_PROMPT },
          ...contextHistory
        ];

        const groqResult = await callGroqWithFallback(savedKey, groqMessages);
        if (groqResult.success) {
          replyText = groqResult.reply;
          backendSuccess = true;
        }
      }

      // Step C: Fallback to grounded portfolio response if no API connection available
      if (!backendSuccess || !replyText) {
        replyText = generateSmartFallbackReply(cleanQuery);
      }

      removeTypingIndicator();
      appendBotMessage(formatMarkdown(replyText));
      conversationHistory.push({ role: 'assistant', content: replyText });

    } catch (e) {
      removeTypingIndicator();
      console.error('Chatbot error:', e);
      appendBotMessage("I encountered a network hiccup connecting to the AI model. Please try again or reach out to Sahil directly via the contact form!");
    } finally {
      isSending = false;
    }
  }

  // 5. Intelligent Grounded Fallback (Ensures 100% reliability if tested offline)
  function generateSmartFallbackReply(q) {
    const l = q.toLowerCase();

    if (l.includes('cyberarena') || l.includes('simulation') || l.includes('security')) {
      return `**CyberArena: Autonomous Cybersecurity Simulation Platform**\n\n` +
        `• **Architecture:** FastAPI, React, TypeScript, Ollama (Local LLMs: Qwen 2.5 / LLaMA 3.2), Oracle VirtualBox, Paramiko SSH.\n` +
        `• **Highlights:** Autonomous AI agents operating inside isolated Linux VMs (Host-Only subnet 192.168.32.0/24) with ReAct loops, destructive command guardrails, and VM snapshot recovery.\n` +
        `• [View CyberArena Project Details](${resolveLink('projects/cyberarena.html')})\n` +
        `• [GitHub Repository](https://github.com/SS-2005/CyberArena-Autonomous-LLM-Based-Cybersecurity-Simulation)`;
    }

    if (l.includes('project') || l.includes('top') || l.includes('work')) {
      return `Here are Sahil's **Top 3 Featured Projects**:\n\n` +
        `1. **CyberArena** – Autonomous multi-agent cybersecurity simulation inside isolated Linux VMs. ([Details](${resolveLink('projects/cyberarena.html')}))\n` +
        `2. **3D AI Avatar** – Real-time speaking 3D avatar with viseme lip synchronization for the web. ([Demo](https://ss-2005.github.io/3D-AI-Avatar-System/))\n` +
        `3. **NeuroWell Predict** – Mental health vulnerability assessment using genetic biomarkers & ML (91.3% accuracy). ([Details](${resolveLink('projects/neurowell-predict.html')}))\n\n` +
        `He has built **26 projects** in total across AI, ML, NLP, and Computer Vision!`;
    }

    if (l.includes('experience') || l.includes('intern') || l.includes('urfu') || l.includes('russia') || l.includes('banao')) {
      return `Sahil's Professional Experience:\n\n` +
        `• **IT & AI Summer Intern @ Ural Federal University (UrFU Russia)** (July 2026, On-site): AIML and Gen AI international project collaboration.\n` +
        `• **AI-Developer Intern @ Banao Technologies (ATG)** (Jan 2026 - Jul 2026): Production deployment of Generative AI pipelines.\n` +
        `• **Research Intern @ CollegeTips.in** (May 2025): Content recommendation algorithms and NLP student feedback analytics.\n` +
        `• **AI/ML Intern @ Orinson Technology** (Dec 2024 - Jan 2025): Supervised predictive models and data preprocessing.`;
    }

    if (l.includes('education') || l.includes('college') || l.includes('cgpa') || l.includes('degree')) {
      return `**Academic Background:**\n\n` +
        `• **Degree:** B.E. in Computer Science Engineering (AIML)\n` +
        `• **Institution:** Saraswati College of Engineering, Kharghar (University of Mumbai)\n` +
        `• **Graduation:** 2027 (Currently in Fourth Year)\n` +
        `• **Academic Standing:** **CGPA 9.50** (Department 1st Ranker Academic Excellence Award)\n` +
        `• **HSC Science:** Nowrosjee Wadia College, Pune (2021-2023)`;
    }

    if (l.includes('resume') || l.includes('cv') || l.includes('download')) {
      return `You can download Sahil's tailored resumes directly:\n\n` +
        `• [AI/ML Engineer Resume](${resolveLink('AIML_Resume_Dec25.pdf')})\n` +
        `• [Generative AI Engineer Resume](${resolveLink('GenAI_Resume_Dec_2025.pdf')})\n` +
        `• [Prompt Engineering Resume](${resolveLink('PromptEng_Resume_Dec25.pdf')})`;
    }

    if (l.includes('contact') || l.includes('email') || l.includes('phone') || l.includes('reach') || l.includes('hire')) {
      return `Connect with Sahil Shaikh:\n\n` +
        `• **Email:** [sahil.shaikh24@aiml.sce.edu.in](mailto:sahil.shaikh24@aiml.sce.edu.in)\n` +
        `• **Phone:** +91 9518755570\n` +
        `• **LinkedIn:** [linkedin.com/in/sahilshaikh110205](https://www.linkedin.com/in/sahilshaikh110205/)\n` +
        `• **GitHub:** [github.com/SS-2005](https://github.com/SS-2005)\n` +
        `• **Location:** Nerul, Navi Mumbai, India`;
    }

    if (l.includes('skill')) {
      return `Sahil's Core Technical Skills:\n\n` +
        `• **Languages:** Python 3, Java, C, HTML5, CSS3, JavaScript, SQL\n` +
        `• **Frameworks:** PyTorch, TensorFlow, OpenCV, FastAPI, React, LangChain, LangGraph\n` +
        `• **AI & ML:** Generative AI, Agentic AI, ReAct Loops, Deep Learning, Predictive Analytics, NLP\n` +
        `• **Tools:** VS Code, Google Colab, GitHub, VirtualBox, Ollama, Jupyter Notebook`;
    }

    return `Sahil Shaikh is an AI/ML Engineer (CGPA 9.50) specializing in Generative AI, Autonomous Agent Systems, and Deep Learning.\n\n` +
      `Notable projects include **CyberArena** (LLM VM cybersecurity simulation), **3D AI Avatar** (real-time viseme lip sync), and **NeuroWell Predict**.\n\n` +
      `Feel free to ask about his internships (UrFU Russia, Banao), specific projects, or contact details!`;
  }

  // Helper: Update model select dropdown
  function updateModelDropdown(availableModels, chosenModel) {
    const modelGroup = document.getElementById('chatbotModelGroup');
    const modelSelect = document.getElementById('chatbotModelSelect');
    const modelBadge = document.getElementById('chatbotModelStatusBadge');
    if (!modelGroup || !modelSelect) return;

    modelSelect.innerHTML = '';
    const models = (availableModels && availableModels.length > 0) ? availableModels : GROQ_CANDIDATE_MODELS;
    models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m + (m === chosenModel ? ' (Active)' : '');
      if (m === chosenModel) opt.selected = true;
      modelSelect.appendChild(opt);
    });

    modelGroup.style.display = 'block';
    if (modelBadge) {
      modelBadge.textContent = `Active: ${chosenModel}`;
      modelBadge.className = 'chatbot-model-status-badge ok';
    }
  }

  // 6. Bind Event Listeners
  function bindChatEvents(chatWin) {
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSendBtn');
    const closeBtn = document.getElementById('chatbotCloseBtn');
    const resetBtn = document.getElementById('chatbotResetBtn');
    const chips = document.querySelectorAll('.chip-btn');

    // Send on button click
    sendBtn.addEventListener('click', () => {
      handleUserQuery(input.value);
      input.value = '';
    });

    // Send on Enter
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleUserQuery(input.value);
        input.value = '';
      }
    });

    // Close button
    closeBtn.addEventListener('click', () => {
      chatWin.classList.remove('active');
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
      conversationHistory = [];
      const container = document.getElementById('chatbotMessages');
      container.innerHTML = '';
      appendBotMessage("Conversation reset! What would you like to know about Sahil's portfolio?");
    });

    // Quick Chips
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        handleUserQuery(query);
      });
    });
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotUI);
  } else {
    initChatbotUI();
  }
})();
