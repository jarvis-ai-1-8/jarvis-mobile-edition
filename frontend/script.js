// ===== 1. API KEY - SAFE =====
let API_KEY = localStorage.getItem('jarvis_key');
if(!API_KEY){
  API_KEY = prompt('Enter your Gemini API Key:');
  if(API_KEY) localStorage.setItem('jarvis_key', API_KEY);
}

// ===== 2. REAL MODELS - FIXED =====
const MODELS = ["gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash"];

const chat=document.getElementById('chat');
const input=document.getElementById('msg');
const micBtn=document.getElementById('mic-btn');

function add(t,w){
  const d=document.createElement('div');
  d.className='msg '+w;
  d.innerText=t;
  chat.appendChild(d);
  chat.scrollTop=chat.scrollHeight;
  return d;
}

// ===== 3. GEMINI BRAIN =====
async function callGemini(p){
  let lastErr;
  for(const m of MODELS){
    try{
      const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${API_KEY}`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({contents:[{parts:[{text:p}]}]})
      });
      const data=await res.json();
      if(data.error){
        lastErr=new Error(data.error.message);
        if(/high demand|temporar|quota|rate|unavailable|deprecated/i.test(data.error.message)) continue;
        throw lastErr;
      }
      return data.candidates[0].content.parts[0].text;
    }catch(e){ lastErr=e; }
  }
  throw lastErr;
}

async function askGemini(p){
  const aiMsg = add('J.A.R.V.I.S: Thinking...','ai');
  try{
    const reply=await callGemini(p);
    aiMsg.innerText='J.A.R.V.I.S: '+reply;
    speak(reply);
  }catch(e){
    aiMsg.innerText='J.A.R.V.I.S: ERROR - '+e.message;
  }
}

// ===== 4. SPEECH RECOGNITION - FIXED WITH CHECK =====
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if(SR && micBtn){
  const rec = new SR();
  rec.lang = 'en-US'; // Change to 'te-IN' for Telugu
  rec.continuous = false;

  rec.onresult = (e)=>{
    const t = e.results[0][0].transcript;
    add('YOU: '+t,'user');
    askGemini(t);
  };

  micBtn.onclick=()=>{
    try{
      rec.start();
      micBtn.innerText='LISTENING...';
      micBtn.style.background='#f00';
    }catch(err){
      add('SYSTEM: Mic already active','ai');
    }
  };

  rec.onend=()=>{
    micBtn.innerText='🎙️';
    micBtn.style.background='#0ff';
  };

  rec.onerror=(e)=>{
    add('SYSTEM: Mic error - '+e.error,'ai');
    micBtn.innerText='🎙️';
  };
} else if(micBtn){
  micBtn.innerText='🚫';
  micBtn.disabled=true;
}

// ===== 5. TEXT-TO-SPEECH - FIXED =====
let voices=[];
function loadVoices(){ voices=speechSynthesis.getVoices(); }
loadVoices();
speechSynthesis.onvoiceschanged=loadVoices;

function speak(t){
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(t);
  u.rate=1.05; u.pitch=0.85;
  // Try Telugu if selected
  const langPref = document.documentElement.lang || 'en-US';
  const v=voices.find(v=>v.lang.includes(langPref)) || voices.find(v=>v.lang.startsWith('en'));
  if(v) u.voice=v;
  speechSynthesis.speak(u);
}

// ===== 6. SEND BUTTON + ENTER KEY =====
document.getElementById('send').onclick=()=>{
  const t=input.value.trim(); if(!t) return;
  add('YOU: '+t,'user'); input.value=''; askGemini(t);
};
input.addEventListener('keypress',(e)=>{
  if(e.key==='Enter') document.getElementById('send').click();
});
