const chat = document.getElementById('chat');
const input = document.getElementById('msg');
const sendBtn = document.getElementById('send');
const voiceStatus = document.getElementById('voiceStatus');
const coreCenter = document.querySelector('.center');

function add(text, who) {
  const d = document.createElement('div');
  d.className = 'msg ' + who;
  d.innerText = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
  return d;
}

function setCoreActive(active) {
  if(active) {
    coreCenter.style.animationDuration = '0.5s';
    coreCenter.style.boxShadow = '0 0 30px #0ff, 0 0 60px #0ff, 0 0 90px #0ff';
  } else {
    coreCenter.style.animationDuration = '1.5s';
    coreCenter.style.boxShadow = '0 0 20px #0ff, 0 0 40px #0ff, 0 0 60px #0ff';
  }
}

function sendMessage() {
  const t = input.value.trim();
  if (!t) return;
  add('YOU: ' + t, 'user');
  input.value = '';
  setCoreActive(true);
  voiceStatus.innerHTML = '● LISTENING';
  voiceStatus.className = 'on';
  
  const aiMsg = add('J.A.R.V.I.S: Processing...', 'ai');
  
  setTimeout(() => {
    const replies = [
      'Systems online. How may I assist you, Boss?',
      'Analyzed. All systems nominal.',
      'Affirmative. Task queued.',
      'Core stable at 98%. Ready for commands.'
    ];
    aiMsg.innerText = 'J.A.R.V.I.S: ' + replies[Math.floor(Math.random()*replies.length)];
    setCoreActive(false);
    voiceStatus.innerHTML = '○ STANDBY';
    voiceStatus.className = 'off';
  }, 1200);
}

sendBtn.onclick = sendMessage;
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
input.addEventListener('input', () => setCoreActive(true));
input.focus();

// Live idle animation
setInterval(() => {
  const on = document.querySelectorAll('.on');
  on.forEach(el => el.style.opacity = Math.random() > 0.5 ? '1' : '0.6');
}, 800);
