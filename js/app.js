/**
 * FC CHAMPIONS MOBILE - Main Application Controller
 */

import { StorageManager } from './managers/StorageManager.js';
import { AudioEngine } from './engine/AudioEngine.js';
import { SquadManager } from './managers/SquadManager.js';
import { MarketStore, STORE_PACKS } from './managers/MarketStore.js';
import { MatchEngine } from './engine/MatchEngine.js';
import { MatchRenderer } from './render/MatchRenderer.js';
import { CARD_TIERS, getPlayerById, MASTER_PLAYERS } from './data/players.js';
import { FORMATIONS } from './data/formations.js';
import { Vector2 } from './engine/Vector2.js';

class App {
  constructor() {
    this.data = StorageManager.loadData();
    this.audio = new AudioEngine();
    this.squadManager = new SquadManager(this.data);
    this.marketStore = new MarketStore(this.data, this.audio);
    this.matchEngine = new MatchEngine(this.audio);

    this.activeView = 'home';
    this.matchCanvas = document.getElementById('match-canvas');
    this.matchRenderer = new MatchRenderer(this.matchCanvas);

    this.selectedPitchSlot = null; // for squad substitutions
    this.isMatchRunning = false;
    this.lastTime = 0;

    this.keys = {};
  }

  init() {
    this.setupNavigation();
    this.setupEventListeners();
    this.setupKeyboardControls();
    this.setupTouchControls();
    this.updateCurrencies();
    this.renderHomeScreen();
    this.renderSquadScreen();
    this.renderMarketScreen();
    this.renderStoreScreen();

    // Start Master RAF loop
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  // ================= VIEW NAVIGATION =================
  switchView(viewName) {
    this.activeView = viewName;
    this.audio.playClick();

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });
    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    if (viewName === 'squad') {
      this.renderSquadScreen();
    } else if (viewName === 'market') {
      this.renderMarketScreen();
    } else if (viewName === 'store') {
      this.renderStoreScreen();
    } else if (viewName === 'home') {
      this.renderHomeScreen();
    }

    StorageManager.saveData(this.data);
  }

  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.view === 'match') {
          this.startQuickMatch();
        } else {
          this.switchView(btn.dataset.view);
        }
      });
    });

    document.getElementById('btn-goto-squad')?.addEventListener('click', () => this.switchView('squad'));
    document.getElementById('btn-goto-market')?.addEventListener('click', () => this.switchView('market'));
    document.getElementById('btn-goto-store')?.addEventListener('click', () => this.switchView('store'));

    const launchMatch = (e) => {
      if (e) e.stopPropagation();
      this.startQuickMatch();
    };
    document.getElementById('btn-quick-match')?.addEventListener('click', launchMatch);
    document.querySelector('.btn-play-action')?.addEventListener('click', launchMatch);
    document.getElementById('btn-exit-match')?.addEventListener('click', () => this.exitMatch());
  }

  updateCurrencies() {
    document.getElementById('top-coins').textContent = this.data.coins.toLocaleString('id-ID');
    document.getElementById('top-gems').textContent = this.data.gems.toLocaleString('id-ID');
  }

  // ================= 1. HOME SCREEN =================
  renderHomeScreen() {
    const stats = this.squadManager.calculateTeamStats();
    document.getElementById('home-team-ovr').textContent = stats.teamOvr;
    document.getElementById('home-team-chem').textContent = stats.chemistry;
    this.updateCurrencies();
  }

  // ================= 2. SQUAD MANAGEMENT (GANTI PEMAIN & FORMASI) =================
  renderSquadScreen() {
    const stats = this.squadManager.calculateTeamStats();
    document.getElementById('squad-team-ovr').textContent = stats.teamOvr;
    document.getElementById('squad-team-chem').textContent = stats.chemistry;

    const formSelect = document.getElementById('formation-select');
    formSelect.value = this.squadManager.getFormation();

    this.renderTacticsPitch();
    this.renderBenchAndReserves();
  }

  renderTacticsPitch() {
    const pitch = document.getElementById('tactics-pitch');
    pitch.innerHTML = '';

    const currentForm = this.squadManager.getFormation();
    const formDef = FORMATIONS[currentForm] || FORMATIONS['4-3-3'];

    formDef.slots.forEach(slot => {
      const matchSlot = this.data.squad.startingXI.find(s => s.posKey === slot.key);
      const player = matchSlot ? getPlayerById(matchSlot.playerId) : null;
      if (!player) return;

      const slotEl = document.createElement('div');
      slotEl.className = 'pitch-slot-card';
      if (this.selectedPitchSlot === slot.key) {
        slotEl.classList.add('selected');
      }

      // Position in pitch (x, y)
      slotEl.style.left = `${slot.x * 100}%`;
      slotEl.style.top = `${slot.y * 100}%`;

      const tier = CARD_TIERS[player.tier] || CARD_TIERS.GOLD;

      slotEl.innerHTML = `
        <div class="card-shield" style="background: ${tier.bgGrad}; border-color: ${tier.border};">
          <div class="card-top">
            <span class="card-ovr" style="color: ${tier.color};">${player.ovr}</span>
            <span class="card-pos">${player.pos}</span>
          </div>
          <div class="card-avatar">${player.avatar}</div>
          <div class="card-name">${player.name}</div>
        </div>
        <div class="card-slot-role">${slot.label}</div>
      `;

      slotEl.addEventListener('click', () => {
        this.audio.playClick();
        if (this.selectedPitchSlot === slot.key) {
          // Deselect
          this.selectedPitchSlot = null;
        } else if (this.selectedPitchSlot) {
          // Swap two starting XI players!
          this.squadManager.swapTwoStartingSlots(this.selectedPitchSlot, slot.key);
          this.selectedPitchSlot = null;
          StorageManager.saveData(this.data);
        } else {
          // Select for substitution
          this.selectedPitchSlot = slot.key;
        }
        this.renderSquadScreen();
      });

      pitch.appendChild(slotEl);
    });
  }

  renderBenchAndReserves() {
    const benchContainer = document.getElementById('bench-list');
    const reservesContainer = document.getElementById('reserves-list');
    benchContainer.innerHTML = '';
    reservesContainer.innerHTML = '';

    // Render Bench Players
    this.data.squad.bench.forEach((playerId, index) => {
      const player = getPlayerById(playerId);
      if (!player) return;

      const card = this.createPlayerCardElement(player, () => {
        if (this.selectedPitchSlot) {
          // Substitute starting player with this bench player!
          this.squadManager.swapStartingWithBench(this.selectedPitchSlot, index);
          this.selectedPitchSlot = null;
          this.audio.playPackReveal(false);
          StorageManager.saveData(this.data);
          this.renderSquadScreen();
        }
      });
      benchContainer.appendChild(card);
    });

    // Render Reserves
    this.data.squad.reserves.forEach(playerId => {
      const player = getPlayerById(playerId);
      if (!player) return;

      const card = this.createPlayerCardElement(player, () => {
        if (this.selectedPitchSlot) {
          // Substitute starting player with reserve player!
          this.squadManager.substituteFromReserves(playerId, this.selectedPitchSlot);
          this.selectedPitchSlot = null;
          this.audio.playPackReveal(false);
          StorageManager.saveData(this.data);
          this.renderSquadScreen();
        }
      });
      reservesContainer.appendChild(card);
    });
  }

  createPlayerCardElement(player, onClick) {
    const tier = CARD_TIERS[player.tier] || CARD_TIERS.GOLD;
    const el = document.createElement('div');
    el.className = 'bench-item-card';
    el.innerHTML = `
      <div class="card-shield" style="background: ${tier.bgGrad}; border-color: ${tier.border};">
        <div class="card-top">
          <span class="card-ovr" style="color: ${tier.color};">${player.ovr}</span>
          <span class="card-pos">${player.pos}</span>
        </div>
        <div class="card-avatar">${player.avatar}</div>
        <div class="card-name">${player.name}</div>
      </div>
    `;
    el.addEventListener('click', onClick);
    return el;
  }

  // ================= 3. TRANSFER MARKET (BELI & JUAL PEMAIN) =================
  renderMarketScreen() {
    this.updateCurrencies();
    const searchVal = document.getElementById('market-search').value;
    const posVal = document.getElementById('market-pos-filter').value;
    const tierVal = document.getElementById('market-tier-filter').value;

    const listings = this.marketStore.getMarketListings(searchVal, posVal, tierVal);
    const container = document.getElementById('market-listings');
    container.innerHTML = '';

    listings.forEach(player => {
      const isOwned = this.data.ownedPlayerIds.includes(player.id);
      const tier = CARD_TIERS[player.tier] || CARD_TIERS.GOLD;

      const card = document.createElement('div');
      card.className = 'market-card-item';
      card.innerHTML = `
        <div class="card-shield" style="background: ${tier.bgGrad}; border-color: ${tier.border}; width: 80px; height: 110px;">
          <div class="card-top">
            <span class="card-ovr" style="color: ${tier.color}; font-size: 16px;">${player.ovr}</span>
            <span class="card-pos" style="font-size: 12px;">${player.pos}</span>
          </div>
          <div class="card-avatar" style="font-size: 36px;">${player.avatar}</div>
          <div class="card-name" style="font-size: 10px;">${player.name}</div>
        </div>

        <div class="market-info">
          <div class="market-player-name">${player.fullName}</div>
          <div class="market-player-club">${player.club} • ${player.nation}</div>

          <div class="market-stats-row">
            <span>PAC <strong>${player.pac}</strong></span>
            <span>SHO <strong>${player.sho}</strong></span>
            <span>PAS <strong>${player.pas}</strong></span>
            <span>DRI <strong>${player.dri}</strong></span>
            <span>DEF <strong>${player.def}</strong></span>
            <span>PHY <strong>${player.phy}</strong></span>
          </div>

          <button class="market-buy-btn ${isOwned ? 'owned' : ''}">
            ${isOwned ? 'TERSEDIA DI SKUAD' : `🪙 BELI ${player.price.toLocaleString('id-ID')} KOIN`}
          </button>
        </div>
      `;

      const buyBtn = card.querySelector('.market-buy-btn');
      if (!isOwned) {
        buyBtn.addEventListener('click', () => {
          const res = this.marketStore.buyPlayer(player.id);
          if (res.success) {
            StorageManager.saveData(this.data);
            this.updateCurrencies();
            this.renderMarketScreen();
            alert(`🎉 ${res.message}`);
          } else {
            alert(`⚠️ ${res.message}`);
          }
        });
      }

      container.appendChild(card);
    });
  }

  // ================= 4. PACK STORE (BUKA PACK GACHA) =================
  renderStoreScreen() {
    this.updateCurrencies();
    const container = document.getElementById('packs-container');
    container.innerHTML = '';

    STORE_PACKS.forEach(pack => {
      const card = document.createElement('div');
      card.className = 'store-pack-card';
      card.style.borderColor = pack.color;

      const costText = pack.costType === 'coins' ? `🪙 ${pack.cost.toLocaleString('id-ID')} Koin` : `💎 ${pack.cost} Gems`;

      card.innerHTML = `
        <div class="pack-icon-glow">${pack.icon}</div>
        <div class="pack-title" style="color: ${pack.color};">${pack.name}</div>
        <p class="pack-desc">${pack.desc}</p>
        <button class="pack-open-btn" style="background: linear-gradient(135deg, ${pack.color}, #0284c7);">
          BUKA PACK (${costText})
        </button>
      `;

      card.querySelector('.pack-open-btn').addEventListener('click', () => {
        const res = this.marketStore.openPack(pack.id);
        if (res.success) {
          StorageManager.saveData(this.data);
          this.updateCurrencies();
          this.showPackRevealModal(res.player, res.isDuplicate);
        } else {
          alert(`⚠️ ${res.message}`);
        }
      });

      container.appendChild(card);
    });
  }

  showPackRevealModal(player, isDuplicate) {
    const modal = document.getElementById('modal-pack-reveal');
    const badge = document.getElementById('reveal-tier-badge');
    const target = document.getElementById('reveal-card-target');
    const nameEl = document.getElementById('reveal-player-name');
    const clubEl = document.getElementById('reveal-player-club');

    const tier = CARD_TIERS[player.tier] || CARD_TIERS.GOLD;
    badge.textContent = `${tier.name.toUpperCase()} REVEAL`;
    badge.style.color = tier.color;
    badge.style.borderColor = tier.border;

    nameEl.textContent = player.fullName;
    clubEl.textContent = `${player.club} • ${player.nation} ${isDuplicate ? '(Duplikat: +Koin)' : ''}`;

    target.innerHTML = `
      <div class="card-shield" style="background: ${tier.bgGrad}; border-color: ${tier.border};">
        <div class="card-top">
          <span class="card-ovr" style="color: ${tier.color};">${player.ovr}</span>
          <span class="card-pos">${player.pos}</span>
        </div>
        <div class="card-avatar">${player.avatar}</div>
        <div class="card-name">${player.name}</div>
      </div>
    `;

    modal.classList.remove('hidden');
    document.getElementById('btn-close-reveal').onclick = () => {
      modal.classList.add('hidden');
      this.renderHomeScreen();
      this.renderSquadScreen();
    };
  }

  // ================= 5. LIVE MATCH ENGINE & CONTROLS =================
  startQuickMatch() {
    this.switchView('match');
    this.matchRenderer.resize();
    this.isMatchRunning = true;

    this.matchEngine.startMatch(this.data.squad, null, (resultData) => {
      this.handleMatchFinished(resultData);
    });
  }

  exitMatch() {
    this.isMatchRunning = false;
    this.switchView('home');
  }

  handleMatchFinished(res) {
    this.data.coins += res.coinsEarned;
    this.data.gems += res.gemsEarned;
    this.data.stats.matchesPlayed++;
    if (res.result === 'WIN') this.data.stats.wins++;
    this.data.stats.goalsScored += res.score.home;
    StorageManager.saveData(this.data);

    const modal = document.getElementById('modal-match-result');
    document.getElementById('result-title').textContent = res.result === 'WIN' ? '🏆 VICTORY!' : res.result === 'DRAW' ? '🤝 DRAW!' : '💔 DEFEAT!';
    document.getElementById('result-score-text').textContent = `${res.score.home} - ${res.score.away}`;
    document.getElementById('reward-coins').textContent = `+${res.coinsEarned.toLocaleString('id-ID')}`;
    document.getElementById('reward-gems').textContent = `+${res.gemsEarned}`;

    modal.classList.remove('hidden');
    document.getElementById('btn-claim-match-reward').onclick = () => {
      modal.classList.add('hidden');
      this.exitMatch();
    };
  }

  setupEventListeners() {
    document.getElementById('sound-btn')?.addEventListener('click', (e) => {
      const isMuted = this.audio.toggleMute();
      e.target.textContent = isMuted ? '🔇' : '🔊';
    });

    document.getElementById('formation-select')?.addEventListener('change', (e) => {
      this.squadManager.setFormation(e.target.value);
      StorageManager.saveData(this.data);
      this.renderSquadScreen();
    });

    document.getElementById('market-search')?.addEventListener('input', () => this.renderMarketScreen());
    document.getElementById('market-pos-filter')?.addEventListener('change', () => this.renderMarketScreen());
    document.getElementById('market-tier-filter')?.addEventListener('change', () => this.renderMarketScreen());
  }

  setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;

      if (this.activeView === 'match' && this.isMatchRunning) {
        if (e.key === 'j' || e.key === 'J' || e.key === 'q' || e.key === 'Q') {
          this.matchEngine.triggerPass();
        } else if (e.key === 'k' || e.key === 'K' || e.key === 'e' || e.key === 'E') {
          if (!this.matchEngine.input.shootCharging) {
            this.matchEngine.triggerShootStart();
          }
        } else if (e.key === 'l' || e.key === 'L' || e.key === ' ') {
          this.matchEngine.triggerTackleOrSwitch();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;

      if (this.activeView === 'match' && this.isMatchRunning) {
        if (e.key === 'k' || e.key === 'K' || e.key === 'e' || e.key === 'E') {
          this.matchEngine.triggerShootRelease();
        }
      }
    });
  }

  setupTouchControls() {
    // Virtual Joystick Touch Handling
    const joystick = document.getElementById('virtual-joystick');
    const knob = document.getElementById('joystick-knob');
    if (!joystick || !knob) return;

    let touchId = null;
    let originX = 0;
    let originY = 0;

    joystick.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches[0];
      touchId = touch.identifier;
      const rect = joystick.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
      e.preventDefault();
    }, { passive: false });

    joystick.addEventListener('touchmove', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchId) {
          const dx = touch.clientX - originX;
          const dy = touch.clientY - originY;
          const dist = Math.min(36, Math.sqrt(dx * dx + dy * dy));
          const angle = Math.atan2(dy, dx);

          knob.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`;

          if (dist > 6) {
            this.matchEngine.input.moveDir.set(Math.cos(angle), Math.sin(angle));
          } else {
            this.matchEngine.input.moveDir.set(0, 0);
          }
          break;
        }
      }
      e.preventDefault();
    }, { passive: false });

    const resetJoystick = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          touchId = null;
          knob.style.transform = 'translate(-50%, -50%)';
          this.matchEngine.input.moveDir.set(0, 0);
          break;
        }
      }
    };

    joystick.addEventListener('touchend', resetJoystick);
    joystick.addEventListener('touchcancel', resetJoystick);

    // Mobile Action Buttons
    document.getElementById('vbtn-pass')?.addEventListener('click', () => this.matchEngine.triggerPass());
    const shootBtn = document.getElementById('vbtn-shoot');
    if (shootBtn) {
      shootBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.matchEngine.triggerShootStart();
      }, { passive: false });
      shootBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.matchEngine.triggerShootRelease();
      }, { passive: false });
      shootBtn.addEventListener('mousedown', () => this.matchEngine.triggerShootStart());
      shootBtn.addEventListener('mouseup', () => this.matchEngine.triggerShootRelease());
    }
    document.getElementById('vbtn-tackle')?.addEventListener('click', () => this.matchEngine.triggerTackleOrSwitch());
    document.getElementById('vbtn-sprint')?.addEventListener('click', () => {
      this.matchEngine.input.sprint = !this.matchEngine.input.sprint;
    });

    // Tap on canvas to kickoff or pass
    this.matchCanvas?.addEventListener('pointerdown', () => {
      if (this.activeView === 'match' && this.isMatchRunning) {
        if (this.matchEngine.state === 'KICKOFF') {
          this.matchEngine.triggerPass();
        }
      }
    });
  }

  gameLoop(timestamp) {
    const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000 || 0.016);
    this.lastTime = timestamp;

    if (this.activeView === 'match' && this.isMatchRunning) {
      // Process keyboard directional input
      let moveX = 0;
      let moveY = 0;
      if (this.keys['w'] || this.keys['arrowup']) moveY -= 1;
      if (this.keys['s'] || this.keys['arrowdown']) moveY += 1;
      if (this.keys['a'] || this.keys['arrowleft']) moveX -= 1;
      if (this.keys['d'] || this.keys['arrowright']) moveX += 1;

      if (moveX !== 0 || moveY !== 0) {
        this.matchEngine.input.moveDir.set(moveX, moveY).normalize();
      } else if (!this.matchEngine.input.moveDir.x && !this.matchEngine.input.moveDir.y) {
        this.matchEngine.input.moveDir.set(0, 0);
      }

      this.matchEngine.input.sprint = !!(this.keys['shift'] || this.keys['l']);

      // Update match simulation
      this.matchEngine.update(dt);

      // Render HD match canvas
      this.matchRenderer.render(this.matchEngine);

      // Update match HUD
      document.getElementById('match-score-home').textContent = this.matchEngine.score.home;
      document.getElementById('match-score-away').textContent = this.matchEngine.score.away;
      document.getElementById('match-minute').textContent = `${this.matchEngine.matchMinute}'`;
      document.getElementById('match-half').textContent = this.matchEngine.half === 1 ? '1ST' : '2ND';
      document.getElementById('match-commentary').textContent = this.matchEngine.commentary;
    }

    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

// Bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
