// Sound synthesizer using Web Audio API (no external asset needed)
class SoundFx {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }
  playPop() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(640, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }
  playSuccess() {
    this.init();
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const start = this.ctx.currentTime + idx * 0.08;
      gain.gain.setValueAtTime(0.25, start);
      gain.gain.linearRampToValueAtTime(0.01, start + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.15);
    });
  }
  playFail() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
  playBubble() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
}

const sfx = new SoundFx();

// Pantry Herbs catalog
const HERBS = [
  { id: 'mint', name: 'Daun Mint', icon: '🌿', color: '#529b55' },
  { id: 'mushroom', name: 'Jamur Hutan', icon: '🍄', color: '#b2533e' },
  { id: 'berry', name: 'Beri Liar', icon: '🫐', color: '#4a5b99' },
  { id: 'flower', name: 'Bunga Emas', icon: '🌼', color: '#d99c2b' },
  { id: 'honey', name: 'Madu Rimba', icon: '🍯', color: '#d67c1c' },
  { id: 'clover', name: 'Semanggi', icon: '🍀', color: '#387340' },
  { id: 'root', name: 'Akar Ginseng', icon: '🥕', color: '#ad642d' },
  { id: 'acorn', name: 'Biji Ek', icon: '🌰', color: '#7a4e28' }
];

// Potential Customers
const CUSTOMERS = [
  { name: 'Kakek Beruang', avatar: '🐻' },
  { name: 'Rubah Petualang', avatar: '🦊' },
  { name: 'Kelinci Penenun', avatar: '🐰' },
  { name: 'Kucing Penyihir', avatar: '🐱' },
  { name: 'Burung Hantu Bijak', avatar: '🦉' }
];

// Recipe generator presets
const RECIPE_NAMES = [
  { name: 'Ramuan Energi Hutan', desc: 'Menghangatkan tubuh penjelajah malam' },
  { name: 'Tonik Suara Emas', desc: 'Melegakan tenggorokan para penyanyi rimba' },
  { name: 'Minyak Mimpi Manis', desc: 'Membantu tidur nyenyak di sarang' },
  { name: 'Eliksir Langkah Ringan', desc: 'Membuat kaki lincah menembus semak' },
  { name: 'Salep Daun Ajaib', desc: 'Menyembuhkan lecet para pengelana' }
];

// State
let score = 0;
let highScore = parseInt(localStorage.getItem('ramuan_highscore') || '0', 10);
let potionsCompleted = 0;
let timeLeft = 60;
let gameTimer = null;
let currentRecipe = null;
let currentBrew = [];

// DOM Elements
const timerValEl = document.getElementById('timer-val');
const scoreValEl = document.getElementById('score-val');
const highScoreValEl = document.getElementById('high-score-val');
const customerAvatarEl = document.getElementById('customer-avatar');
const potionNameEl = document.getElementById('potion-name');
const potionDescEl = document.getElementById('potion-desc');
const recipeReqEl = document.getElementById('recipe-requirements');
const brewingSlotsEl = document.getElementById('brewing-slots');
const brewBtn = document.getElementById('brew-btn');
const dumpBtn = document.getElementById('dump-btn');
const pantryGridEl = document.getElementById('pantry-grid');
const modalOverlayEl = document.getElementById('modal-overlay');
const modalTitleEl = document.getElementById('modal-title');
const modalDescEl = document.getElementById('modal-desc');
const finalStatsEl = document.getElementById('final-stats');
const finalScoreEl = document.getElementById('final-score');
const finalPotionsEl = document.getElementById('final-potions');
const startBtn = document.getElementById('start-btn');
const potLiquidEl = document.getElementById('pot-liquid');
const cauldronSectionEl = document.querySelector('.cauldron-section');

highScoreValEl.textContent = highScore;

// Render Pantry
function renderPantry() {
  pantryGridEl.innerHTML = '';
  HERBS.forEach(herb => {
    const btn = document.createElement('button');
    btn.className = 'herb-card';
    btn.innerHTML = `
      <span class="herb-icon">${herb.icon}</span>
      <span class="herb-name">${herb.name}</span>
    `;
    btn.addEventListener('click', () => addHerbToBrew(herb));
    pantryGridEl.appendChild(btn);
  });
}

// Generate New Recipe
function generateRecipe() {
  const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
  const titleObj = RECIPE_NAMES[Math.floor(Math.random() * RECIPE_NAMES.length)];
  
  // Decide ingredient count (2 or 3 ingredients)
  const numIngredients = Math.random() > 0.4 ? 3 : 2;
  const pickedHerbs = [];
  const shuffled = [...HERBS].sort(() => 0.5 - Math.random());
  
  for (let i = 0; i < numIngredients; i++) {
    pickedHerbs.push(shuffled[i]);
  }

  currentRecipe = {
    customer,
    name: titleObj.name,
    desc: titleObj.desc,
    ingredients: pickedHerbs
  };

  // Update UI
  customerAvatarEl.textContent = customer.avatar;
  potionNameEl.textContent = `${titleObj.name} (${customer.name})`;
  potionDescEl.textContent = titleObj.desc;

  recipeReqEl.innerHTML = '';
  currentRecipe.ingredients.forEach(herb => {
    const chip = document.createElement('div');
    chip.className = 'req-chip';
    chip.innerHTML = `<span>${herb.icon}</span><span>${herb.name}</span>`;
    recipeReqEl.appendChild(chip);
  });

  // Reset cauldron liquid to default
  potLiquidEl.style.backgroundColor = '#5a7d51';
}

// Add herb to cauldron
function addHerbToBrew(herb) {
  if (currentBrew.length >= 4) return;
  sfx.playPop();
  currentBrew.push(herb);
  updateBrewUI();
}

// Update Cauldron UI
function updateBrewUI() {
  brewingSlotsEl.innerHTML = '';
  if (currentBrew.length === 0) {
    brewingSlotsEl.innerHTML = '<span class="empty-hint">Ketuk bahan di bawah untuk meracik!</span>';
    brewBtn.disabled = true;
    potLiquidEl.style.backgroundColor = '#5a7d51';
    return;
  }

  currentBrew.forEach((herb, index) => {
    const slot = document.createElement('div');
    slot.className = 'slot-item';
    slot.innerHTML = `<span>${herb.icon}</span> <span>${herb.name}</span>`;
    slot.title = 'Klik untuk hapus';
    slot.addEventListener('click', () => {
      sfx.playPop();
      currentBrew.splice(index, 1);
      updateBrewUI();
    });
    brewingSlotsEl.appendChild(slot);
  });

  // Mix color based on last herb
  const lastHerb = currentBrew[currentBrew.length - 1];
  potLiquidEl.style.backgroundColor = lastHerb.color;

  brewBtn.disabled = false;
}

// Dump Cauldron
dumpBtn.addEventListener('click', () => {
  if (currentBrew.length > 0) {
    sfx.playBubble();
    currentBrew = [];
    updateBrewUI();
  }
});

// Brew / Submit
brewBtn.addEventListener('click', () => {
  if (currentBrew.length === 0 || !currentRecipe) return;

  // Validate ingredient match (ignoring order)
  const reqIds = currentRecipe.ingredients.map(i => i.id).sort();
  const brewIds = currentBrew.map(i => i.id).sort();

  const isMatch = reqIds.length === brewIds.length && reqIds.every((val, idx) => val === brewIds[idx]);

  if (isMatch) {
    sfx.playSuccess();
    const earned = 100 + (currentRecipe.ingredients.length * 25);
    score += earned;
    potionsCompleted++;
    timeLeft += 4; // bonus time!
    scoreValEl.textContent = score;

    currentBrew = [];
    updateBrewUI();
    generateRecipe();
  } else {
    sfx.playFail();
    timeLeft = Math.max(0, timeLeft - 5); // penalty
    timerValEl.textContent = `${timeLeft}s`;
    cauldronSectionEl.classList.add('shake');
    setTimeout(() => cauldronSectionEl.classList.remove('shake'), 400);
  }
});

// Start & Timer Logic
function startGame() {
  score = 0;
  potionsCompleted = 0;
  timeLeft = 60;
  currentBrew = [];

  scoreValEl.textContent = '0';
  timerValEl.textContent = '60s';

  modalOverlayEl.classList.remove('active');
  finalStatsEl.style.display = 'none';

  renderPantry();
  updateBrewUI();
  generateRecipe();

  if (gameTimer) clearInterval(gameTimer);
  gameTimer = setInterval(() => {
    timeLeft--;
    timerValEl.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(gameTimer);
  sfx.playFail();

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('ramuan_highscore', highScore.toString());
    highScoreValEl.textContent = highScore;
  }

  modalTitleEl.textContent = 'Toko Ditutup!';
  modalDescEl.textContent = 'Matahari telah terbenam di desa herbal. Kerja bagus hari ini!';
  finalScoreEl.textContent = score;
  finalPotionsEl.textContent = potionsCompleted;
  finalStatsEl.style.display = 'block';
  startBtn.textContent = 'Buka Toko Lagi! 🥄';
  modalOverlayEl.classList.add('active');
}

startBtn.addEventListener('click', () => {
  sfx.init();
  startGame();
});

// Initial Setup
renderPantry();
