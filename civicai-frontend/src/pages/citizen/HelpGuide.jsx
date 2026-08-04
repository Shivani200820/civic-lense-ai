import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HelpGuide.css";

const ICONS = ["📊", "📝", "📋", "🌍", "👤"];
const FLOW_COLORS = ["#f59e0b", "#3b82f6", "#8b5cf6", "#22c55e"];
const FLOW_ICONS = ["📨", "🤖", "👮", "✅"];

/* ---------- 3 LANGUAGE CONTENT ---------- */
const T = {
  en: {
    langName: "English",
    heroTitle: "👋 Welcome to CivicAI!",
    heroText: "New here? No worries — this quick guide shows how to use the app step by step.",
    s1: "Know your Sidebar:-", s1m: "These are the main sections of the application:",
    menu: [
      ["Dashboard", "Your home screen. See all complaint locations on the map and get an overview of issues around you."],
      ["New Complaint", "Found a civic issue? Report it! Add title, description, photo, pick the exact location on the map — then Submit."],
      ["My Complaints", "See your submitted complaints and track live status (Pending, In Progress, Resolved)."],
      ["Explore Complaints", "Browse complaints reported by other citizens in your city."],
      ["Profile", "Update your name, phone number and address anytime."],
    ],
    s2: "Complaint Status Flow", s2m: "After submission, your complaint moves through these stages:",
    flow: [
      ["Complaint Submitted", "Complaint submitted with photo and location"],
      ["AI Analysis", "AI analyzes the complaint and identifies category & priority"],
      ["Officer Assigned", "Complaint is assigned to the concerned officer"],
      ["Complaint Resolved", "Issue resolved and citizen is notified"],
    ],
    s3: "How to Submit a Complaint",
    steps: [
      'Click on "New Complaint" in the sidebar.',
      "Upload Complaint Image.",
      "AI Analysis",
      'Pick the exact location on the map (or use "Use my location").',
      "Verify AI Details",
      "Submit Complaint — you will get a complaint ID for tracking.",
      "Track Complaint — Go to My Complaints to check the latest status.",
    ],
    s4: "Frequently Asked Questions",
    faqs: [
      ["How do I track my complaint status?", 'Go to "My Complaints" — each complaint shows a colored status badge which updates automatically.'],
      ["Can I cancel my complaint?", 'Yes — open it from "My Complaints". While status is "Submitted" you can cancel it.'],
      ["I don't know the exact map location. What to do?", 'Use "Use my current location" button at the issue spot, or search the area and drag the marker.'],
    ],
    finish: "🚀 Got it! Let's get started", back: "← Back",
  },

  mr: {
    langName: "मराठी",
    heroTitle: "👋 CivicAI वर तुमचे स्वागत!",
    heroText: "नवीन आहात? काळजी नका — हे मार्गदर्शक अ‍ॅप वापरणे टप्प्याटप्प्याने शिकवते.",
    s1: "साइडबार ओळखा :-", s1m: "अ‍ॅप्लिकेशनचे मुख्य विभाग:",
    menu: [
      ["डॅशबोर्ड (Dashboard)", "तुमचे मुख्य स्क्रीन. नकाशावर सर्व तक्रारींचे स्थान पाहा आणि तुमच्या भागातील समस्यांची झलक पाहा."],
      ["नवीन तक्रार (New Complaint)", "समस्या आढळली? तक्रार नोंदवा! शीर्षक, वर्णन, फोटो जोडा आणि नकाशावर अचूक स्थान निवडा — मग सबमिट करा."],
      ["माझ्या तक्रारी (My Complaints)", "तुम्ही केलेल्या सर्व तक्रारी पाहा आणि स्थिती (प्रलंबित, प्रगतीपथावर, निराकरण) ट्रॅक करा."],
      ["इतर तक्रारी (Explore)", "शहरातील इतर नागरिकांच्या तक्रारी पाहा आणि भागातील घडामोडी जाणून घ्या."],
      ["प्रोफाइल (Profile)", "नाव, फोन नंबर, पत्ता इत्यादी माहिती कधीही अपडेट करा."],
    ],
    s2: "तक्रार स्थितीचा प्रवाह", s2m: "सबमिट केल्यानंतर तक्रार या टप्प्यांतून जाते:",
    flow: [
      ["तक्रार नोंदवली", "फोटो आणि स्थानासह तक्रार नोंदवली गेली"],
      ["AI विश्लेषण", "AI ने तक्रारीची श्रेणी व प्राधान्य निश्चित केले"],
      ["अधिकारी नियुक्त", "तक्रार संबंधित अधिकाऱ्याकडे सोपवली गेली"],
      ["तक्रार निकाली", "समस्येचे निराकरण करून नागरिकाला सूचना पाठवली गेली"],
    ],
    s3: "तक्रार कशी नोंदवायची",
    steps: [
      'साइडबारमधील "नवीन तक्रार" वर क्लिक करा.',
      "तक्रारीचा फोटो अपलोड करा.",
      "AI द्वारे तक्रारीचे विश्लेषण केले जाईल.",
      'नकाशावर अचूक स्थान निवडा (किंवा "माझे स्थान वापरा" पर्याय वापरा).',
      "AI ने तयार केलेली माहिती तपासा व आवश्यक असल्यास संपादित करा.",
      "तक्रार सबमिट करा — ट्रॅकिंगसाठी तक्रार आयडी मिळेल.",
      '"माझ्या तक्रारी" मध्ये जाऊन तक्रारीची सद्यस्थिती तपासा.',
    ],
    s4: "नेहमी विचारले जाणारे प्रश्न",
    faqs: [
      ["तक्रारीची स्थिती कशी पाहू?", '"माझ्या तक्रारी" मध्ये जा — प्रत्येक तक्रारीची स्थिती रंगीत बॅजसह दिसते आणि आपोआप अपडेट होते.'],
      ["तक्रार रद्द करता येते का?", 'हो — "माझ्या तक्रारी" मधून तक्रार उघडा. स्थिती "नोंदणी झाली" असताना रद्द करू शकता.'],
      ["नकाशावर अचूक स्थान माहित नसेल?", 'समस्यास्थळी उभे राहून "माझे स्थान वापरा" बटण वापरा, किंवा भाग शोधून मार्कर अचूक ठिकाणी हलवा.'],
    ],
    finish: "🚀 समजले! सुरुवात करूया", back: "← मागे",
  },

  hi: {
    langName: "हिंदी",
    heroTitle: "👋 CivicAI पर आपका स्वागत!",
    heroText: "नए हैं? चिंता न करें — यह गाइड ऐप उपयोग करना चरण-दर-चरण सिखाता है।",
    s1: "साइडबार जानें :-", s1m: "एप्लिकेशन के मुख्य भाग:",
    menu: [
      ["डैशबोर्ड (Dashboard)", "आपकी होम स्क्रीन। मैप पर सभी शिकायतों के स्थान देखें और अपने क्षेत्र की समस्याओं का अवलोकन पाएं।"],
      ["नई शिकायत (New Complaint)", "समस्या मिली? शिकायत दर्ज करें! शीर्षक, विवरण, फोटो जोड़ें और मैप पर सटीक स्थान चुनें — फिर सबमिट करें।"],
      ["मेरी शिकायतें (My Complaints)", "अपनी सभी शिकायतें देखें और स्थिति (लंबित, प्रगति में, हल) ट्रैक करें।"],
      ["अन्य शिकायतें (Explore)", "शहर के अन्य नागरिकों की शिकायतें देखें और अपने क्षेत्र से अवगत रहें।"],
      ["प्रोफ़ाइल (Profile)", "नाम, फोन नंबर, पता जैसी जानकारी कभी भी अपडेट करें।"],
    ],
    s2: "शिकायत स्थिति का प्रवाह", s2m: "सबमिट के बाद शिकायत इन चरणों से गुजरती है:",
    flow: [
      ["शिकायत दर्ज", "फोटो और स्थान के साथ शिकायत दर्ज"],
      ["AI विश्लेषण", "AI ने शिकायत का विश्लेषण किया"],
      ["अधिकारी नियुक्त", "संबंधित अधिकारी को शिकायत सौंपी गई"],
      ["समस्या का समाधान", "समस्या का समाधान कर शिकायत बंद की गई"],
    ],
    s3: "शिकायत कैसे दर्ज करें",
    steps: [
      'साइडबार में "नई शिकायत" पर क्लिक करें।',
      "शिकायत की तस्वीर अपलोड करें।",
      "AI शिकायत का विश्लेषण करेगा।",
      'मैप पर सही स्थान चुनें (या "मेरा स्थान उपयोग करें" विकल्प चुनें)।',
      "AI द्वारा तैयार की गई जानकारी की जांच करें और आवश्यकता होने पर उसमें संशोधन करें।",
      "शिकायत सबमिट करें — ट्रैकिंग के लिए आपको शिकायत आईडी प्राप्त होगी।",
      '"मेरी शिकायतें" में जाकर शिकायत की नवीनतम स्थिति देखें।',
    ],
    s4: "अक्सर पूछे जाने वाले प्रश्न",
    faqs: [
      ["शिकायत की स्थिति कैसे देखें?", '"मेरी शिकायतें" में जाएं — हर शिकायत की स्थिति रंगीन बैज के साथ दिखती है और अपने आप अपडेट होती है।'],
      ["क्या शिकायत रद्द कर सकते हैं?", 'हां — "मेरी शिकायतें" से शिकायत खोलें। स्थिति "दर्ज हुई" होने पर रद्द कर सकते हैं।'],
      ["मैप पर सटीक स्थान न पता हो तो?", 'समस्या स्थल पर खड़े होकर "मेरा स्थान उपयोग करें" दबाएं, या क्षेत्र खोजें और मार्कर सही जगह ले जाएं।'],
    ],
    finish: "🚀 समझ गया! शुरू करें", back: "← वापस",
  },
};

/* Browser language auto-detect */
const getInitialLang = () => {
  const saved = localStorage.getItem("civicai_lang");
  if (saved && T[saved]) return saved;
  const b = navigator.language || "";
  if (b.startsWith("mr")) return "mr";
  if (b.startsWith("hi")) return "hi";
  return "en";
};

export default function HelpGuide() {
  const navigate = useNavigate();
  const [lang, setLang] = useState(getInitialLang);
  const [openFaq, setOpenFaq] = useState(null);
  const t = T[lang];
  const isNewUser = !localStorage.getItem("civicai_onboarded");

  const changeLang = (l) => { setLang(l); localStorage.setItem("civicai_lang", l); };
  const finishTour = () => { localStorage.setItem("civicai_onboarded", "true"); navigate("/citizen/dashboard"); };

  return (
    <div className="help-container">
      {/* HERO */}
      <div className="help-hero">
        <div className="lang-switch">
          {Object.keys(T).map((l) => (
            <button key={l} className={lang === l ? "active" : ""} onClick={() => changeLang(l)}>
              {T[l].langName}
            </button>
          ))}
        </div>
        <h1>{t.heroTitle}</h1>
        <p>{t.heroText}</p>
      </div>

      {/* SECTION 1 : SIDEBAR GUIDE */}
      <section className="help-card">
        <div className="card-head">
          <span className="card-chip">📖</span>
          <div><h2>{t.s1}</h2><p className="muted">{t.s1m}</p></div>
        </div>
        <div className="guide-list">
          {t.menu.map(([title, text], i) => (
            <div className="guide-item" key={title}>
              <div className="guide-marker">
                <div className="guide-num">{i + 1}</div>
                {i < t.menu.length - 1 && <div className="guide-line" />}
              </div>
              <div className="guide-body">
                <div className="guide-icon">{ICONS[i]}</div>
                <div><h3>{title}</h3><p>{text}</p></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 : STATUS FLOW */}
      <section className="help-card">
        <div className="card-head">
          <span className="card-chip">🔄</span>
          <div><h2>{t.s2}</h2><p className="muted">{t.s2m}</p></div>
        </div>
        <div className="status-flow">
          {t.flow.map(([label, desc], i) => (
            <React.Fragment key={label}>
              <div className="status-pill" style={{ borderColor: FLOW_COLORS[i] }}>
                <span className="flow-ico">{FLOW_ICONS[i]}</span>
                <span className="pill-label">
                  <span className="dot" style={{ background: FLOW_COLORS[i] }} />
                  <strong>{label}</strong>
                </span>
                <small>{desc}</small>
              </div>
              {i < t.flow.length - 1 && <div className="flow-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* SECTION 3 : SUBMIT STEPS */}
      <section className="help-card">
        <div className="card-head">
          <span className="card-chip">📝</span>
          <div><h2>{t.s3}</h2></div>
        </div>
        <ol className="submit-steps">
          {t.steps.map((s, i) => (
            <li key={i}>
              <span className="step-num">{i + 1}</span>
              <span className="step-text">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* SECTION 4 : FAQ */}
      <section className="help-card">
        <div className="card-head">
          <span className="card-chip">❓</span>
          <div><h2>{t.s4}</h2></div>
        </div>
        <div className="faq-list">
          {t.faqs.map(([q, a], i) => (
            <div className="faq-item" key={i}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{q}</span>
                <span className={`chev ${openFaq === i ? "open" : ""}`}>▾</span>
              </button>
              {openFaq === i && <p className="faq-a">{a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="help-footer">
        {isNewUser ? (
          <button className="btn-primary" onClick={finishTour}>{t.finish}</button>
        ) : (
          <button className="btn-secondary" onClick={() => navigate(-1)}>{t.back}</button>
        )}
      </div>
    </div>
  );
}