/**
 * Netlify Serverless Function: AI Chatbot Backend
 * Powers the portfolio chatbot using free, fast open-source LLMs (Groq LLaMA 3.1 / OpenRouter / Gemini)
 */

const PORTFOLIO_SYSTEM_PROMPT = `You are "Sahil's AI Assistant", the official AI representative for Sahil Shaikh's portfolio website.
Your mission is to represent Sahil professionally, warmly, concisely, and accurately to recruiters, clients, and fellow engineers.

=== ABOUT SAHIL SHAIKH ===
- Full Name: Sahil Shaikh
- Profession: AI/ML Engineer, Generative AI Developer & Data Scientist
- Location: Nerul, Navi Mumbai, Maharashtra, India
- Phone: +91 9518755570
- Email: sahil.shaikh24@aiml.sce.edu.in
- Portfolio Status: Available for full-time AI/ML engineering roles, GenAI developer roles, and freelance AI solutions.
- Profiles:
  - GitHub: https://github.com/SS-2005
  - LinkedIn: https://www.linkedin.com/in/sahilshaikh110205/
  - LeetCode: https://leetcode.com/u/SS-2005/
  - Medium: https://medium.com/@SS-2005

=== ACADEMIC BACKGROUND ===
- Degree: Bachelor of Engineering (B.E.) in Computer Science Engineering (AIML)
- College: Saraswati College of Engineering, Kharghar (Affiliated with University of Mumbai)
- Graduation Year: 2027 (Currently 4th Year, 2023 - 2027)
- Current CGPA: 9.50 (Department 1st Ranker Academic Excellence)
- High School (HSC): Nowrosjee Wadia College, Pune (HSC Science, 2021 - 2023)

=== WORK EXPERIENCE ===
1. IT & AI Summer Intern @ Ural Federal University (UrFU), Yekaterinburg, Russia (On-site, July 2026)
   - Collaborated with international teams on AIML and Generative AI research.
   - Contributed to model benchmarking, multilingual evaluations, and technical discussions.
2. AI-Developer (Intern) @ Banao Technologies (ATG) (Jan 2026 - Jul 2026)
   - Deployed real-time Generative AI solutions and agentic pipelines into production.
   - Researched constraint-relevant grounded AI architectures.
3. Research Intern @ CollegeTips.in (May 2025)
   - Developed educational AI applications, content recommendation systems, and NLP sentiment analysis for student feedback.
4. AI/ML Intern @ Orinson Technology Private Limited (Dec 2024 - Jan 2025)
   - Built supervised ML regression and classification models on large datasets; executed feature engineering and hyperparameter tuning.

=== TOP FEATURED PROJECTS ===
1. CyberArena (Autonomous AI Agent Cybersecurity Platform)
   - Tech: FastAPI, React, TypeScript, Ollama (Local LLMs: Qwen 2.5 / LLaMA 3.2), Oracle VirtualBox, Paramiko SSH, Vite
   - Highlights: Multi-agent cybersecurity simulation orchestrating autonomous LLMs inside isolated Linux VMs (Host-Only 192.168.32.0/24 subnet). Features ReAct reasoning loops, command guardrails against destructive commands (rm -rf), automated log telemetry, and VM snapshot recovery.
   - GitHub: https://github.com/SS-2005/CyberArena-Autonomous-LLM-Based-Cybersecurity-Simulation
   - Details Page: projects/cyberarena.html

2. 3D AI Avatar (Real-Time Talking 3D Avatar)
   - Tech: Three.js, WebGL, Viseme Lip Synchronization, Neural TTS, Web Audio API
   - Highlights: Real-time talking 3D avatar for web browsers with sub-100ms latency viseme lip sync, facial blendshapes, and audio streaming.
   - Live Demo: https://ss-2005.github.io/3D-AI-Avatar-System/
   - GitHub: https://github.com/SS-2005/3D-AI-Avatar-System
   - Details Page: projects/3d-ai-avatar.html

3. NeuroWell Predict (Mental Health Assessment via Genetics & ML)
   - Tech: TensorFlow, Pandas, BioPython, Predictive Machine Learning
   - Highlights: Analyzes genetic biomarkers, SNPs, and nutrigenomics data to predict risk predispositions for mental health conditions with 91.3% accuracy.
   - Live Demo: https://advanced-neuronutrigenomics-ai.onrender.com/
   - GitHub: https://github.com/SS-2005/Advanced_NeuroNutrigenomics-AI
   - Details Page: projects/neurowell-predict.html

=== FULL PROJECT PORTFOLIO (26 PROJECTS) ===
- Debate System: LangGraph multi-agent structured debate with objective scoring (GitHub: SS-2005/Debate_Stimulator)
- RAG System: ChromaDB vector search + LangChain policy assistant (GitHub: SS-2005/RAG_SYS)
- Face Detection & Recognition: OpenCV Haar cascades + FaceNet 128D embeddings (94.3% accuracy) (GitHub: SS-2005/FDR-FaceDetectionAndRecognition)
- HandScript: Handwriting synthesis replicating personal cursive handwriting (89.5% similarity) (GitHub: SS-2005/HandScript)
- Dog Breed Identification: MobileNetV2 transfer learning classifying 120 breeds (92% accuracy) (Live: onrender.com, GitHub: SS-2005/DIP-Dog_Identification_Project)
- Video Synthesis System (VSS): Automated text-to-animated-video pipeline using Ollama, Manim, and FFmpeg (GitHub: SS-2005/Video_Synthesis_System)
- AI Avatar Prototype: Real-time audio-to-animation synthesis using CNN+BiLSTM (GitHub: SS-2005/AI_Avatar_System)
- ScrapeWise: OSINT cybersecurity web scraper with scam & phishing risk detection (Live: Netlify, GitHub: SS-2005/Scrape-Wise-CyberTool)
- Fake Review Detection: PyTorch supervised classifier detecting fraudulent comments (GitHub: SS-2005/Fake_Review_Detector)
- CheckMax: Educational knowledge testing portal from uploaded notes via NLP (GitHub: SS-2005/CheckMax_Ultimate_Testing_Tool_Kit)
- AI Commentor: LinkedIn engagement assistant generating context-aware professional responses (GitHub: SS-2005/AI_Commentor)
- Customer Churn Prediction: XGBoost + SHAP explainability on Telco data (87.5% accuracy) (GitHub: SS-2005/Customer-Churn-Prediction)
- Future Price Detector: Bulldozer auction price regression & forecasting (GitHub: SS-2005/BPD_RM)
- Heart Disease Predictor: UCI clinical decision support evaluating cardiac metrics (87.5% accuracy) (GitHub: SS-2005/Heart_Disease_Predictor)
- MedPic Detector: CNN classifier sorting medical vs non-medical images for security (96.2% accuracy) (GitHub: SS-2005/MedPic_Detector)
- Object Placement System: Realistic lighting & perspective compositing with OPA dataset (GitHub: SS-2005/AOPM-AdvancedObjectPlacementModel)
- Movie Review Sentiment: TF-IDF + Logistic Regression on 50k IMDB reviews (89.2% accuracy) (GitHub: SS-2005/Review_Sentiment_Analysis)
- Calories Burnt Predictor: Exercise duration and biometric regression model (R² 0.93) (GitHub: SS-2005/CBP-Calories_Burnt_Predictor)
- Advanced Timetable Creator: Constraint satisfaction algorithm generating conflict-free academic schedules (GitHub: SS-2005/Advanced-Academic-Time-Table-Generator)
- DigiBuddy Chatbot: Digital workflow guidance assistant with NLP (Live: GitHub Pages, GitHub: SS-2005/ChatBot)
- Pet Friendly City: Community urban planning & amenities map platform (Live: GitHub Pages, GitHub: SS-2005/Pet-Friendly-City)
- Student Performance Predictor: Educational outcome forecasting using demographic and attendance features (GitHub: SS-2005/Student_Performace)
- Dark Anime Gallery: Interactive showcase with classical dark anime aesthetic (Live: GitHub Pages, GitHub: SS-2005/Gallery)

=== CERTIFICATIONS & HONORS ===
- 1st Ranker Academic Excellence Award (Saraswati College of Engineering, CGPA 9.50)
- IBM AI Agent Architect Certification
- IBM Artificial Intelligence Professional Certification
- Oracle Cloud Infrastructure (OCI) AI Foundational Associate
- Oracle Cloud Infrastructure (OCI) Generative AI Professional
- Oracle Cloud Infrastructure (OCI) Data Science Professional
- LeetCode 100-Day Continuous Problem Solving Streak Badge
- LeetCode 50-Day Coding Streak Badge
- The Economic Times National Hackathon Semi-Finalist
- Adobe - Unstop National Hackathon Innovation Participant

=== DOWNLOADABLE RESUMES ===
- AI/ML Engineer Resume: AIML_Resume_Dec25.pdf
- Generative AI Engineer Resume: GenAI_Resume_Dec_2025.pdf
- Prompt Engineering Resume: PromptEng_Resume_Dec25.pdf

=== GUIDELINES FOR YOUR RESPONSES ===
1. Speak in first person as Sahil's AI assistant ("Sahil has...", "He built...").
2. Be direct, crisp, professional, and knowledgeable.
3. If asked about a project, provide its key technical features and mention its GitHub link or live demo.
4. When relevant, invite the recruiter/visitor to contact Sahil or download his resume.
5. Format your output with clean markdown (bullet points, bold text, links). Keep responses concise (under 150 words unless detailed explanation is specifically requested).`;

exports.handler = async function (event, context) {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const userMessage = payload.message || payload.query || '';
    const conversationHistory = Array.isArray(payload.history) ? payload.history : [];

    if (!userMessage.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message cannot be empty.' })
      };
    }

    // Determine API Key from environment or client header
    const groqKey = process.env.GROQ_API_KEY || payload.apiKey;
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // 1. Try Groq (Llama 3.1 8B Instant - Free & ultra-fast open-source model)
    if (groqKey) {
      const messages = [
        { role: 'system', content: PORTFOLIO_SYSTEM_PROMPT },
        ...conversationHistory.slice(-12).map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        })),
        { role: 'user', content: userMessage }
      ];

      const candidateModels = [
        'qwen/qwen3.8-27b',
        'openai/gpt-oss-120b',
        'openai/gpt-oss-20b',
        'allam-2-7b'
      ];

      for (const modelToTry of candidateModels) {
        try {
          const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: modelToTry,
              messages: messages,
              temperature: 0.5,
              max_tokens: 700
            })
          });

          if (groqResponse.ok) {
            const data = await groqResponse.json();
            const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response.";
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                reply,
                model: `${modelToTry} (Groq)`,
                provider: 'groq'
              })
            };
          } else {
            const errJson = await groqResponse.json().catch(() => ({}));
            const errMsg = errJson.error?.message || '';
            const errCode = errJson.error?.code || '';
            if (
              errCode === 'model_not_found' ||
              errCode === 'model_terms_required' ||
              errCode === 'model_decommissioned' ||
              groqResponse.status === 404 ||
              (groqResponse.status === 400 && (errMsg.includes('model') || errMsg.includes('terms') || errMsg.includes('exist') || errMsg.includes('access')))
            ) {
              continue;
            }
          }
        } catch (callErr) {
          console.error(`Error trying Groq model ${modelToTry}:`, callErr);
        }
      }
    }

    // 2. Fallback to OpenRouter Free tier if OPENROUTER_API_KEY set
    if (openrouterKey) {
      const messages = [
        { role: 'system', content: PORTFOLIO_SYSTEM_PROMPT },
        ...conversationHistory.slice(-8).map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        })),
        { role: 'user', content: userMessage }
      ];

      const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openrouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://sahilshaikh.dev',
          'X-Title': 'Sahil Shaikh Portfolio'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: messages,
          max_tokens: 650
        })
      });

      if (orResponse.ok) {
        const data = await orResponse.json();
        const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response.";
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            reply,
            model: 'Llama 3.2 3B (OpenRouter Free)',
            provider: 'openrouter'
          })
        };
      }
    }

    // 3. Fallback to Gemini if GEMINI_API_KEY set
    if (geminiKey) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`;
      const geminiResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: PORTFOLIO_SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: { maxOutputTokens: 650, temperature: 0.5 }
        })
      });

      if (geminiResponse.ok) {
        const data = await geminiResponse.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ reply, model: 'Gemini 2.0 Flash', provider: 'gemini' })
        };
      }
    }

    // 4. If no API key configured on server:
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        needsApiKey: true,
        reply: `Welcome to Sahil's Portfolio AI! 🤖<br><br>` +
               `To activate real-time LLM inference on Netlify:<br>` +
               `1. Get a <strong>100% free</strong> Groq API key from <a href="https://console.groq.com" target="_blank" style="color:#ffc107;text-decoration:underline;">console.groq.com</a> (takes 30 sec, no credit card required).<br>` +
               `2. Add <code>GROQ_API_KEY</code> into your <strong>Netlify Site Settings &rarr; Environment Variables</strong>.<br>` +
               `3. Or click the ⚙️ icon in this chat header to paste your key for instant local browser testing!`
      })
    };

  } catch (error) {
    console.error('Chatbot function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error processing chat message', details: error.message })
    };
  }
};
