/**
 * Y2K HEISEI PORTFOLIO INTERACTIVE ENGINE
 * Features: Web Audio Chiptune Synth, Sound Effects, Konami Code Easter Egg,
 * Lucky Star Choco Cornet Poll, FF Command Box, BBS (LocalStorage), & Mobile Nav.
 * 100% Copyright-safe & standalone!
 */

// ==========================================
// 1. WEB AUDIO API SYNTHESIZER (No external audio files needed!)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'square', duration = 0.1, gainVal = 0.08) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone error', e);
    }
  }

  // FF / Retro cursor blip
  playCursor() {
    this.playTone(880, 'triangle', 0.05, 0.05);
  }

  // Select / Click sound
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.04); // E5

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Sparkle / Magic sound
  playSparkle() {
    if (!this.enabled) return;
    const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.15, 0.06);
      }, idx * 45);
    });
  }

  // Pager / Keroro "De-arimasu!" Alert
  playAlert() {
    if (!this.enabled) return;
    const notes = [440, 880, 440, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'square', 0.06, 0.08);
      }, idx * 60);
    });
  }

  // FF Victory / Level Up Fanfare Homage (Chiptune Original)
  playFanfare() {
    if (!this.enabled) return;
    const notes = [
      { f: 523.25, d: 0.1 },  // C5
      { f: 523.25, d: 0.1 },  // C5
      { f: 523.25, d: 0.1 },  // C5
      { f: 523.25, d: 0.25 }, // C5
      { f: 415.30, d: 0.25 }, // G#4
      { f: 466.16, d: 0.25 }, // A#4
      { f: 523.25, d: 0.35 }, // C5
      { f: 466.16, d: 0.15 }, // A#4
      { f: 523.25, d: 0.55 }, // C5
    ];

    let time = 0;
    notes.forEach(n => {
      setTimeout(() => {
        this.playTone(n.f, 'square', n.d, 0.1);
      }, time);
      time += n.d * 1000 + 40;
    });
  }

  // Scratch sound on CD click
  playScratch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start();
    } catch (e) {
      this.playTone(300, 'sawtooth', 0.1, 0.1);
    }
  }

  // Winamp 8-bit Cyber Loop
  toggleBgm() {
    if (this.bgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  startBgm() {
    this.init();
    this.bgmPlaying = true;
    this.bgmStep = 0;

    // Melody notes (Chiptune loop inspired by 90s cyber anime / techno)
    const melody = [
      261.63, 329.63, 392.00, 523.25,
      392.00, 329.63, 440.00, 493.88,
      523.25, 493.88, 440.00, 392.00,
      349.23, 392.00, 329.63, 261.63
    ];

    const bass = [
      130.81, 130.81, 164.81, 164.81,
      174.61, 174.61, 196.00, 196.00,
      220.00, 220.00, 196.00, 196.00,
      174.61, 164.81, 146.83, 130.81
    ];

    this.bgmTimer = setInterval(() => {
      if (!this.bgmPlaying) return;
      const noteM = melody[this.bgmStep % melody.length];
      const noteB = bass[this.bgmStep % bass.length];

      this.playTone(noteM, 'square', 0.12, 0.04);
      this.playTone(noteB, 'triangle', 0.16, 0.05);

      this.bgmStep++;

      // Update Winamp visualizer bars
      animateVisualizer();
    }, 180);
  }

  stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    resetVisualizer();
  }
}

const sfx = new SoundFX();

// ==========================================
// 2. VISUALIZER & WINAMP SIMULATION
// ==========================================
const visualizerContainer = document.getElementById('visualizerBars');
const numBars = 18;

function initVisualizer() {
  if (!visualizerContainer) return;
  visualizerContainer.innerHTML = '';
  for (let i = 0; i < numBars; i++) {
    const bar = document.createElement('div');
    bar.className = 'visualizer-bar';
    bar.style.height = '15%';
    visualizerContainer.appendChild(bar);
  }
}

function animateVisualizer() {
  if (!visualizerContainer) return;
  const bars = visualizerContainer.children;
  for (let i = 0; i < bars.length; i++) {
    const randomHeight = Math.floor(Math.random() * 85) + 15;
    bars[i].style.height = `${randomHeight}%`;
  }
}

function resetVisualizer() {
  if (!visualizerContainer) return;
  const bars = visualizerContainer.children;
  for (let i = 0; i < bars.length; i++) {
    bars[i].style.height = '10%';
  }
}

// Track listing for Winamp
const tracks = [
  { name: '01. Y2K_Cyber_Dream.mp3', length: '02:45' },
  { name: '02. Pokepen_Invasion_Keroro.mp3', length: '03:12' },
  { name: '03. Lucky_Star_Choco_Cornet.mp3', length: '02:30' },
  { name: '04. Final_Fantasy_Prelude_Mix.mp3', length: '03:55' }
];
let currentTrackIdx = 0;

function setupWinampControls() {
  const playBtn = document.getElementById('bgmPlayBtn');
  const stopBtn = document.getElementById('bgmStopBtn');
  const nextBtn = document.getElementById('bgmNextBtn');
  const trackLabel = document.getElementById('playerTrackName');
  const hologramCd = document.getElementById('hologramCd');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      sfx.init();
      const isPlaying = sfx.toggleBgm();
      if (isPlaying) {
        playBtn.innerHTML = '<i data-lucide="pause" class="w-3 h-3 inline"></i> PAUSE';
      } else {
        playBtn.innerHTML = '<i data-lucide="play" class="w-3 h-3 inline"></i> PLAY';
      }
      lucide.createIcons();
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      sfx.stopBgm();
      if (playBtn) {
        playBtn.innerHTML = '<i data-lucide="play" class="w-3 h-3 inline"></i> PLAY';
        lucide.createIcons();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTrackIdx = (currentTrackIdx + 1) % tracks.length;
      if (trackLabel) {
        trackLabel.textContent = tracks[currentTrackIdx].name;
      }
      sfx.playClick();
      if (sfx.bgmPlaying) {
        sfx.stopBgm();
        sfx.startBgm();
      }
    });
  }

  if (hologramCd) {
    hologramCd.addEventListener('click', () => {
      sfx.playScratch();
      triggerConfetti(0.3);
    });
  }
}

// ==========================================
// 3. SOUND TOGGLE, CRT, & THEME CONTROLS
// ==========================================
function setupSystemControls() {
  const soundBtn = document.getElementById('soundToggleBtn');
  const soundStatusText = document.getElementById('soundStatusText');
  const crtBtn = document.getElementById('crtToggleBtn');
  const crtOverlay = document.getElementById('crtOverlay');
  const themeBtn = document.getElementById('themeToggleBtn');
  const themeLabel = document.getElementById('themeLabel');

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      if (soundStatusText) {
        soundStatusText.textContent = sfx.enabled ? 'SE: ON' : 'SE: OFF';
      }
      if (sfx.enabled) sfx.playClick();
    });
  }

  if (crtBtn && crtOverlay) {
    crtBtn.addEventListener('click', () => {
      sfx.playCursor();
      crtOverlay.classList.toggle('crt-off');
      crtBtn.classList.toggle('border-yellow-400');
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      sfx.playSparkle();
      const body = document.body;
      if (body.classList.contains('theme-cyber')) {
        body.classList.remove('theme-cyber');
        body.classList.add('theme-gal');
        if (themeLabel) themeLabel.textContent = 'GAL POP';
      } else {
        body.classList.remove('theme-gal');
        body.classList.add('theme-cyber');
        if (themeLabel) themeLabel.textContent = 'CYBER';
      }
    });
  }
}

// ==========================================
// 4. REALTIME HEISEI CLOCK
// ==========================================
function updateClock() {
  const clockEl = document.getElementById('realtimeClock');
  if (!clockEl) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);

// ==========================================
// 5. MOUSE & TOUCH SPARKLE EFFECT
// ==========================================
const sparkleChars = ['★', '☆', '✧', '✦', '♥', '❄'];

function createSparkle(x, y) {
  const span = document.createElement('span');
  span.className = 'sparkle-particle';
  span.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];

  const colors = ['#00f0ff', '#ff1493', '#ffff00', '#ffffff', '#39ff14'];
  span.style.color = colors[Math.floor(Math.random() * colors.length)];
  span.style.left = `${x}px`;
  span.style.top = `${y}px`;

  const tx = (Math.random() - 0.5) * 50;
  const ty = (Math.random() - 0.5) * 50;
  span.style.setProperty('--tx', `${tx}px`);
  span.style.setProperty('--ty', `${ty}px`);

  document.body.appendChild(span);
  setTimeout(() => span.remove(), 800);
}

let lastSparkleTime = 0;
window.addEventListener('mousemove', (e) => {
  const now = performance.now();
  if (now - lastSparkleTime > 75) {
    createSparkle(e.clientX, e.clientY);
    lastSparkleTime = now;
  }
});

window.addEventListener('touchstart', (e) => {
  if (e.touches && e.touches[0]) {
    createSparkle(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: true });

// ==========================================
// 6. CONFETTI TRIGGER (CDN canvas-confetti)
// ==========================================
function triggerConfetti(scalar = 1) {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: Math.floor(60 * scalar),
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#ff1493', '#ffff00', '#39ff14', '#ffffff']
    });
  }
}

// ==========================================
// 7. WORKS FILTER & MODAL
// ==========================================
const worksData = {
  pager: {
    icon: '📟',
    title: 'ポケベル暗号ジェネレーター2000',
    desc: '「084(オハヨウ)」「4649(ヨロシク)」「114106(アイシテル)」など、平成のポケベル全盛期に使われた数字の語呂合わせを即座に相互変換できるWebツール。8bitのレトロな着信音や液晶ドットフォントのUIを採用しています。',
    tech: 'TypeScript, Tailwind CSS, Web Audio API',
    period: '2週間 (2024)',
    status: 'Webアプリ公開中 / 著作権フリー'
  },
  uikit: {
    icon: '💿',
    title: 'Y2K ホログラムUIデザインキット',
    desc: '2000年代初頭の透明スケルトン筐体（iMac G3やゲームボーイカラー）やCDのプリズム虹色光沢、立体的なアクアボタンをモダンに再構築したFigma UIキット。海外のデザイナーコミュニティでも好評を博しました。',
    tech: 'Figma, Vector Design, CSS3 3D Shaders',
    period: '1ヶ月 (2024)',
    status: 'Figma Communityにて公開中'
  },
  game: {
    icon: '👾',
    title: 'ネオ・ピクセルダンジョン (GB風RPG)',
    desc: 'ゲームボーイカラーの4色パレット制約をベースにしたブラウザミニRPG。ダンジョン探索とターン制コマンドバトル、チップチューンBGMをHTML5 Canvas上でスムーズに動作させました。',
    tech: 'HTML5 Canvas, Vanilla JavaScript, Web Audio',
    period: '3週間 (2023)',
    status: 'ブラウザ上でプレイ可能'
  },
  synth: {
    icon: '📻',
    title: 'ウェブ・ローファイシンセサイザー',
    desc: '外部サンプリング音源を使用せず、ブラウザ内蔵のWeb Audio APIオシレーターのみで生成するシンセサイザー。レトロなカセットテープ調のワウフラッター（ピッチ揺れ）や歪みフィルターを搭載しています。',
    tech: 'Web Audio API, React, SVG Graphics',
    period: '2週間 (2023)',
    status: 'GitHub公開中'
  },
  keroro: {
    icon: '🐸',
    title: 'ケロっと解決！日報侵略システム (オマージュ)',
    desc: 'ケロロ軍曹リスペクトのタスク管理アプリ。「我輩の地球（ポコペン）侵略スケジュール」を登録すると、達成度に応じて隊員たちが褒めてくれるユーモアたっぷりの生産性向上ツールです。',
    tech: 'React, IndexedDB, Tailwind CSS',
    period: '2週間 (2024)',
    status: '個人開発プロジェクト'
  },
  ffBattle: {
    icon: '⚔️',
    title: 'FF風 Webステータス＆コマンドバトル',
    desc: 'ファイナルファンタジーの伝統的な青いウィンドウとATB（アクティブタイムバトル）をWeb上で再現したインタラクティブコンポーネント。カーソル音やファンファーレも自作シンセで完全再現。',
    tech: 'HTML5, CSS3 3D, Web Audio Synth',
    period: '1週間 (2024)',
    status: '本サイト内実装'
  }
};

function setupWorksFilter() {
  const filterBtns = document.querySelectorAll('#worksFilterGroup .filter-btn');
  const cards = document.querySelectorAll('#worksGrid .work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function openWorkModal(id) {
  sfx.playClick();
  const data = worksData[id];
  if (!data) return;

  document.getElementById('modalIcon').textContent = data.icon;
  document.getElementById('modalHeading').textContent = data.title;
  document.getElementById('modalDesc').textContent = data.desc;
  document.getElementById('modalTech').textContent = data.tech;
  document.getElementById('modalPeriod').textContent = data.period;
  document.getElementById('modalStatus').textContent = data.status;

  const modal = document.getElementById('workModal');
  if (modal) modal.classList.remove('hidden');
}

function closeWorkModal() {
  sfx.playCursor();
  const modal = document.getElementById('workModal');
  if (modal) modal.classList.add('hidden');
}

// ==========================================
// 8. LUCKY STAR (らき☆すた) CHOCO CORNET POLL
// ==========================================
function setupChocoCornetPoll() {
  const btnHead = document.getElementById('chocoBtnHead');
  const btnTail = document.getElementById('chocoBtnTail');
  const countHead = document.getElementById('chocoCountHead');
  const countTail = document.getElementById('chocoCountTail');
  const resultMsg = document.getElementById('chocoResultMsg');

  let headVotes = parseInt(localStorage.getItem('y2k_choco_head') || '42', 10);
  let tailVotes = parseInt(localStorage.getItem('y2k_choco_tail') || '38', 10);

  function renderCounts() {
    if (countHead) countHead.textContent = `${headVotes}票`;
    if (countTail) countTail.textContent = `${tailVotes}票`;
  }
  renderCounts();

  if (btnHead) {
    btnHead.addEventListener('click', () => {
      headVotes++;
      localStorage.setItem('y2k_choco_head', headVotes);
      renderCounts();
      sfx.playSparkle();
      triggerConfetti(0.4);
      if (resultMsg) resultMsg.textContent = '★ こなた「やっぱり頭からちぎってチョコにつけるのが通だよね！」';
    });
  }

  if (btnTail) {
    btnTail.addEventListener('click', () => {
      tailVotes++;
      localStorage.setItem('y2k_choco_tail', tailVotes);
      renderCounts();
      sfx.playSparkle();
      triggerConfetti(0.4);
      if (resultMsg) resultMsg.textContent = '★ かがみ「お尻から食べるとクリームがはみ出なくて安全でしょ！」';
    });
  }
}

// ==========================================
// 9. FINAL FANTASY COMMAND WINDOW
// ==========================================
function setupFfCommands() {
  const commandBtns = document.querySelectorAll('.ff-cmd-btn');
  const ffDialogMsg = document.getElementById('ffDialogText');

  commandBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      sfx.playCursor();
    });

    btn.addEventListener('click', () => {
      const cmd = btn.dataset.cmd;
      sfx.playClick();

      if (cmd === 'attack') {
        if (ffDialogMsg) ffDialogMsg.textContent = 'aikon は「超高速コーディング」を繰り出した！ バグに9999のダメージ！';
        sfx.playAlert();
        triggerConfetti(0.5);
      } else if (cmd === 'magic') {
        if (ffDialogMsg) ffDialogMsg.textContent = 'aikon は「Tailwind & TypeScript」の魔法を詠唱した！ UIが美しく進化した！';
        sfx.playSparkle();
      } else if (cmd === 'item') {
        if (ffDialogMsg) ffDialogMsg.textContent = '「カフェイン」を使用した！ HPとMPが全回復したであります！';
        sfx.playFanfare();
      } else if (cmd === 'escape') {
        if (ffDialogMsg) ffDialogMsg.textContent = 'しかし まわりこまれてしまった！ (ここからは逃げられない！ゆっくりしていってね★)';
        sfx.playScratch();
      }
    });
  });
}

// ==========================================
// 10. BBS (掲示板) LOCALSTORAGE MANAGEMENT
// ==========================================
const defaultBbsPosts = [
  {
    name: 'こなた風★ネトゲ廃人',
    contact: '@lucky_star_fan',
    date: '2026/11/06 14:20',
    message: 'キリ番427踏んだよー！サイトの作り込みヤバいｗｗ BGM懐かしすぎてテンション上がる！相互リンクよろー☆'
  },
  {
    name: 'ケロロ軍曹であります',
    contact: 'keroro@k隆星.space',
    date: '2026/11/05 18:32',
    message: '我輩の侵略予算でガンプラを買ってしまったであります！この電脳基地の技術力、地球（ポコペン）侵略にスカウトしたいでありますな！ゲロゲロ★'
  },
  {
    name: '通りすがりの黒魔道士',
    contact: 'vivi@ff9.magic',
    date: '2026/11/04 22:15',
    message: '青いウィンドウのFFコマンド画面を見てつい立ち寄りました。ドットの温かみが素敵ですね…魔法のコードを応援しています。'
  }
];

function loadBbsPosts() {
  const bbsList = document.getElementById('bbsList');
  if (!bbsList) return;

  let stored = localStorage.getItem('y2k_bbs_posts');
  let posts = stored ? JSON.parse(stored) : defaultBbsPosts;

  bbsList.innerHTML = '';
  posts.forEach((post, idx) => {
    const postEl = document.createElement('div');
    postEl.className = 'bbs-post-card';
    postEl.innerHTML = `
      <div class="flex flex-wrap items-center justify-between text-xs border-b border-cyan-100 pb-1 mb-1.5">
        <div class="flex items-center gap-2">
          <span class="font-bold text-blue-800">[${posts.length - idx}]</span>
          <span class="font-bold text-pink-600">${escapeHtml(post.name)}</span>
          ${post.contact ? `<span class="text-slate-400 text-[10px]">(${escapeHtml(post.contact)})</span>` : ''}
        </div>
        <span class="text-[10px] text-slate-400 font-pixel">${post.date}</span>
      </div>
      <p class="text-xs text-slate-700 leading-relaxed font-dot">${escapeHtml(post.message)}</p>
    `;
    bbsList.appendChild(postEl);
  });
}

function handleBbsSubmit(e) {
  e.preventDefault();
  sfx.playSparkle();

  const nameInput = document.getElementById('bbsNameInput');
  const contactInput = document.getElementById('bbsContactInput');
  const messageInput = document.getElementById('bbsMessageInput');

  if (!nameInput || !messageInput) return;

  const name = nameInput.value.trim() || '名無しさん★';
  const contact = contactInput ? contactInput.value.trim() : '';
  const message = messageInput.value.trim();

  if (!message) return;

  const now = new Date();
  const dateStr = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  let stored = localStorage.getItem('y2k_bbs_posts');
  let posts = stored ? JSON.parse(stored) : [...defaultBbsPosts];

  posts.unshift({ name, contact, date: dateStr, message });
  localStorage.setItem('y2k_bbs_posts', JSON.stringify(posts));

  nameInput.value = '';
  if (contactInput) contactInput.value = '';
  messageInput.value = '';

  loadBbsPosts();
  triggerConfetti(0.6);
  alert('★ カキコ完了しました！ありがとうございます ★');
}

function insertEmoji(str) {
  sfx.playCursor();
  const messageInput = document.getElementById('bbsMessageInput');
  if (messageInput) {
    messageInput.value += str;
    messageInput.focus();
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// ==========================================
// 11. ACCESS COUNTER SIMULATION
// ==========================================
function setupCounter() {
  const counterBox = document.getElementById('counterBox');
  const countUpBtn = document.getElementById('countUpBtn');

  let count = parseInt(localStorage.getItem('y2k_visitor_count') || '000428', 10);

  function renderDigits(num) {
    if (!counterBox) return;
    const str = String(num).padStart(6, '0');
    counterBox.innerHTML = '';
    for (let char of str) {
      const span = document.createElement('span');
      span.className = 'counter-digit';
      span.textContent = char;
      counterBox.appendChild(span);
    }
  }

  renderDigits(count);

  if (countUpBtn) {
    countUpBtn.addEventListener('click', () => {
      count++;
      localStorage.setItem('y2k_visitor_count', count);
      renderDigits(count);
      sfx.playAlert();
      triggerConfetti(0.5);
    });
  }
}

// ==========================================
// 12. KONAMI CODE EASTER EGG (↑ ↑ ↓ ↓ ← → ← → B A)
// ==========================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

window.addEventListener('keydown', (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (key === konamiCode[konamiIndex].toLowerCase()) {
    konamiIndex++;
    sfx.playCursor();
    if (konamiIndex === konamiCode.length) {
      triggerKonamiSecret();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function triggerKonamiSecret() {
  sfx.playFanfare();
  triggerConfetti(2.0);
  alert('★☆★ 隠しコマンド成功！(コナミコマンド達成) ★☆★\n\n『もってけ！セーラー服☆＆我輩の侵略パワー全開であります！』\n全ステータスが9999にカンストしました！');
  document.body.classList.toggle('theme-gal');
}

// ==========================================
// 13. BANNER CODE COPY
// ==========================================
function setupBannerCopy() {
  const btn = document.getElementById('copyBannerBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    sfx.playClick();
    const bannerHtml = '<a href="https://your-portfolio-url.com/"><img src="banner8831.gif" alt="AIKON Y2K PORTFOLIO" width="88" height="31" border="0"></a>';
    navigator.clipboard.writeText(bannerHtml).then(() => {
      alert('バナーHTMLタグをクリップボードにコピーしました★\nご自身のサイトへ貼り付けてください！');
    }).catch(() => {
      prompt('以下のコードをコピーしてください:', bannerHtml);
    });
  });
}

// ==========================================
// 14. GLOBAL SOUND ATTACHER
// ==========================================
function attachSoundHandlers() {
  document.querySelectorAll('[data-sound]').forEach(el => {
    el.addEventListener('click', () => {
      const type = el.dataset.sound;
      if (type === 'click') sfx.playClick();
      else if (type === 'sparkle') sfx.playSparkle();
      else if (type === 'beep') sfx.playAlert();
      else if (type === 'fanfare') sfx.playFanfare();
    });
  });
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initVisualizer();
  setupWinampControls();
  setupSystemControls();
  setupWorksFilter();
  setupChocoCornetPoll();
  setupFfCommands();
  loadBbsPosts();
  setupCounter();
  setupBannerCopy();
  attachSoundHandlers();

  const bbsForm = document.getElementById('bbsForm');
  if (bbsForm) {
    bbsForm.addEventListener('submit', handleBbsSubmit);
  }

  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
});
