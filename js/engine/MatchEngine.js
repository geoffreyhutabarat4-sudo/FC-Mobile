/**
 * FC CHAMPIONS MOBILE - Core Match Engine (11v11 / 7v7 Simulation)
 */

import { Vector2 } from './Vector2.js';
import { Ball } from './Physics.js';
import { MatchPlayer, AIController } from './AIController.js';
import { FORMATIONS } from '../data/formations.js';
import { getPlayerById, MASTER_PLAYERS } from '../data/players.js';

export class MatchEngine {
  constructor(audio) {
    this.audio = audio;
    this.ai = new AIController(this);

    this.pitch = {
      width: 1000,
      height: 620,
      left: 60,
      right: 940,
      top: 50,
      bottom: 570,
      goalTop: 260,
      goalBottom: 360,
      center: new Vector2(500, 310)
    };

    this.ball = new Ball(500, 310);
    this.homePlayers = [];
    this.awayPlayers = [];
    this.controlledPlayer = null;

    this.state = 'KICKOFF'; // 'KICKOFF' | 'PLAYING' | 'GOAL' | 'HALFTIME' | 'FULLTIME'
    this.score = { home: 0, away: 0 };
    this.matchMinute = 0;
    this.half = 1;
    this.matchTimer = 0;
    this.goalCelebrationTimer = 0;
    this.lastScorer = null;
    this.commentary = 'Selamat datang di Champions Stadium! Kick-off segera dimulai.';

    // User input state
    this.input = {
      moveDir: new Vector2(0, 0),
      sprint: false,
      shootCharging: false,
      shootPower: 0,
      passPressed: false,
      tacklePressed: false
    };

    this.particles = [];
    this.onMatchEndCallback = null;
  }

  startMatch(homeSquadData, awayTeamPreset = null, onMatchEnd = null) {
    this.onMatchEndCallback = onMatchEnd;
    this.score = { home: 0, away: 0 };
    this.matchMinute = 0;
    this.half = 1;
    this.state = 'KICKOFF';
    this.matchTimer = 0;
    this.commentary = 'Kick-off Babak Pertama dimulai!';

    // Setup Home Team (User)
    this.setupHomeTeam(homeSquadData);

    // Setup Away Team (CPU)
    this.setupAwayTeam(awayTeamPreset);

    // Initial ball placement
    this.resetForKickoff('home');
    this.audio.playWhistle(false);
  }

  setupHomeTeam(squadData) {
    this.homePlayers = [];
    const formationKey = squadData.formation || '4-3-3';
    const formDef = FORMATIONS[formationKey] || FORMATIONS['4-3-3'];

    formDef.slots.forEach(slot => {
      const matchSlot = squadData.startingXI.find(s => s.posKey === slot.key);
      const pData = matchSlot ? getPlayerById(matchSlot.playerId) : null;
      const playerInfo = pData || {
        id: 'generic_home_' + slot.key,
        name: slot.label,
        pos: slot.role,
        ovr: 75, pac: 75, sho: 70, pas: 72, dri: 74, def: 65, phy: 70, avatar: '⚽'
      };

      const player = new MatchPlayer(playerInfo, 'home', false);
      // Map formation to left-half coordinates
      const pitchW = this.pitch.right - this.pitch.left;
      const pitchH = this.pitch.bottom - this.pitch.top;

      // In match: home attacks from left to right in 1st half
      // slot.x is 0..1 (0=left, 1=right). For team attacking right:
      // GK is near left (x ~ 0.1), ST is near center (x ~ 0.45)
      player.basePos.set(
        this.pitch.left + (1 - slot.y) * (pitchW * 0.45),
        this.pitch.top + slot.x * pitchH
      );
      player.pos.copy(player.basePos);
      player.facing.set(1, 0);

      this.homePlayers.push(player);
    });

    // Set active controlled player (default to Striker or Midfielder)
    const striker = this.homePlayers.find(p => p.role === 'ST') || this.homePlayers[this.homePlayers.length - 1];
    this.setControlledPlayer(striker);
  }

  setupAwayTeam(preset) {
    this.awayPlayers = [];
    const formDef = FORMATIONS['4-3-3'];

    // Select random high-level CPU players
    const pool = MASTER_PLAYERS.filter(p => p.tier !== 'BRONZE');

    formDef.slots.forEach((slot, idx) => {
      const pData = pool[idx % pool.length];
      const player = new MatchPlayer(pData, 'away', false);

      const pitchW = this.pitch.right - this.pitch.left;
      const pitchH = this.pitch.bottom - this.pitch.top;

      // Away team defends right side, attacks left
      player.basePos.set(
        this.pitch.right - (1 - slot.y) * (pitchW * 0.45),
        this.pitch.top + (1 - slot.x) * pitchH
      );
      player.pos.copy(player.basePos);
      player.facing.set(-1, 0);

      this.awayPlayers.push(player);
    });
  }

  setControlledPlayer(p) {
    if (this.controlledPlayer) {
      this.controlledPlayer.isControlled = false;
    }
    this.controlledPlayer = p;
    if (p) {
      p.isControlled = true;
    }
  }

  resetForKickoff(kickoffTeam = 'home') {
    this.state = 'KICKOFF';
    this.kickoffTimer = 0;
    this.ball.reset(this.pitch.center.x, this.pitch.center.y);

    // Reset player positions
    this.homePlayers.forEach(p => {
      p.pos.copy(p.basePos);
      p.vel.set(0, 0);
      p.facing.set(1, 0);
    });
    this.awayPlayers.forEach(p => {
      p.pos.copy(p.basePos);
      p.vel.set(0, 0);
      p.facing.set(-1, 0);
    });

    if (kickoffTeam === 'home') {
      const striker = this.homePlayers.find(p => p.role === 'ST') || this.homePlayers[0];
      striker.pos.set(this.pitch.center.x - 15, this.pitch.center.y);
      this.ball.owner = striker;
      this.setControlledPlayer(striker);
    } else {
      const striker = this.awayPlayers.find(p => p.role === 'ST') || this.awayPlayers[0];
      striker.pos.set(this.pitch.center.x + 15, this.pitch.center.y);
      this.ball.owner = striker;
      const defTarget = this.homePlayers.find(p => ['CM', 'CAM', 'ST'].includes(p.role)) || this.homePlayers[0];
      this.setControlledPlayer(defTarget);
    }
  }

  update(dt) {
    // Kickoff auto-transition timer
    if (this.state === 'KICKOFF') {
      this.kickoffTimer = (this.kickoffTimer || 0) + dt;
      if (this.kickoffTimer > 1.2) {
        this.state = 'PLAYING';
      }
    }

    // Half Time transition timer
    if (this.state === 'HALFTIME') {
      this.halftimeTimer = (this.halftimeTimer || 0) + dt;
      if (this.halftimeTimer > 2.5) {
        this.half = 2;
        this.halftimeTimer = 0;
        this.resetForKickoff('away');
        this.state = 'PLAYING';
        this.commentary = 'Babak Kedua dimulai!';
        this.audio.playWhistle(false);
      }
      return;
    }

    // 1. Update Match Clock (90 mins in ~180 seconds real time)
    if (this.state === 'PLAYING') {
      this.matchTimer += dt;
      this.matchMinute = Math.min(90, Math.floor((this.matchTimer / 120) * 90));

      // Half Time check
      if (this.matchMinute >= 45 && this.half === 1) {
        this.state = 'HALFTIME';
        this.halftimeTimer = 0;
        this.commentary = 'Peluit babak pertama berbunyi! Jeda istirahat babak pertama.';
        this.audio.playWhistle(true);
        return;
      }

      // Full Time check
      if (this.matchMinute >= 90) {
        this.state = 'FULLTIME';
        this.commentary = `Peluit panjang! Pertandingan selesai. Skor akhir: ${this.score.home} - ${this.score.away}`;
        this.audio.playWhistle(true);
        if (this.onMatchEndCallback) {
          const result = this.score.home > this.score.away ? 'WIN' : this.score.home === this.score.away ? 'DRAW' : 'LOSS';
          const coinsEarned = result === 'WIN' ? 5000 : result === 'DRAW' ? 2500 : 1200;
          const gemsEarned = result === 'WIN' ? 50 : 15;
          this.onMatchEndCallback({ result, score: this.score, coinsEarned, gemsEarned });
        }
        return;
      }
    }

    // 2. Goal Celebration Timer
    if (this.state === 'GOAL') {
      this.goalCelebrationTimer -= dt;
      this.updateParticles(dt);
      if (this.goalCelebrationTimer <= 0) {
        const nextKickoff = this.lastScorer === 'home' ? 'away' : 'home';
        this.resetForKickoff(nextKickoff);
        this.state = 'PLAYING';
      }
      return;
    }

    // 3. User Input & Controlled Player Movement
    this.handleUserInput(dt);

    // 4. Update Ball Physics
    this.ball.update(this.pitch);

    // 5. Update AI for All Players
    this.homePlayers.forEach(p => this.ai.updatePlayerAI(p, this.ball, this.pitch));
    this.awayPlayers.forEach(p => this.ai.updatePlayerAI(p, this.ball, this.pitch));

    // 6. Check Ball Interception / Possession for Free Ball
    this.checkBallPossession();

    // 7. Check Goals
    this.checkGoal();

    // 8. Auto-switch controlled player when defending
    this.autoSwitchDefender();

    // 9. Particles
    this.updateParticles(dt);
  }

  handleUserInput(dt) {
    if (!this.controlledPlayer) return;

    const p = this.controlledPlayer;
    p.updateCooldowns();

    // Movement
    if (this.input.moveDir.magSq() > 0.05) {
      const speed = p.getSpeed() * (this.input.sprint ? 1.35 : 1.0);
      p.vel = this.input.moveDir.clone().normalize().scale(speed);
      p.pos.add(p.vel);
      p.facing.copy(this.input.moveDir).normalize();

      // If at kickoff, first move initiates play
      if (this.state === 'KICKOFF') {
        this.state = 'PLAYING';
      }
    } else {
      p.vel.scale(0.8);
    }

    // Shoot Charging
    if (this.input.shootCharging) {
      this.input.shootPower = Math.min(100, this.input.shootPower + dt * 140);
    }

    // Clamp inside pitch
    p.pos.x = Math.max(this.pitch.left + 5, Math.min(this.pitch.right - 5, p.pos.x));
    p.pos.y = Math.max(this.pitch.top + 5, Math.min(this.pitch.bottom - 5, p.pos.y));
  }

  triggerPass() {
    if (this.state === 'KICKOFF') {
      this.state = 'PLAYING';
    }
    if (!this.controlledPlayer) return;
    const p = this.controlledPlayer;

    if (this.ball.owner === p) {
      // Find best teammate in facing direction
      const teammates = this.homePlayers.filter(t => t !== p && t.role !== 'GK');
      let bestTarget = null;
      let highestDot = 0.3;

      teammates.forEach(t => {
        const toTeammate = t.pos.clone().sub(p.pos).normalize();
        const dot = p.facing.dot(toTeammate);
        if (dot > highestDot) {
          highestDot = dot;
          bestTarget = t;
        }
      });

      const passDir = bestTarget ? bestTarget.pos.clone().sub(p.pos).normalize() : p.facing.clone();
      const passPower = 13 + (p.stats.pas / 100) * 6;
      this.passBall(p, passDir, passPower, 0);

      // Auto switch control to receiver
      if (bestTarget) {
        this.setControlledPlayer(bestTarget);
      }
    }
  }

  triggerShootStart() {
    if (this.state === 'KICKOFF') {
      this.state = 'PLAYING';
    }
    this.input.shootCharging = true;
    this.input.shootPower = 0;
  }

  triggerShootRelease() {
    if (!this.input.shootCharging) return;
    this.input.shootCharging = false;
    const p = this.controlledPlayer;
    if (!p || this.ball.owner !== p) return;

    const chargeRatio = this.input.shootPower / 100;
    const isPowerShot = chargeRatio > 0.85;

    // Aim toward opponent goal with subtle aim angle
    const goalCenterY = (this.pitch.top + this.pitch.bottom) / 2;
    const targetY = goalCenterY + (p.facing.y * 70);
    const shootTarget = new Vector2(this.pitch.right, targetY);
    const shootDir = shootTarget.sub(p.pos).normalize();

    const basePower = 16 + (p.stats.sho / 100) * 10;
    const finalPower = basePower * (0.8 + chargeRatio * 0.5);
    const loft = isPowerShot ? 3.5 : 1.2;

    this.shootBall(p, shootDir, finalPower, loft);
    this.commentary = isPowerShot ? `🔥 POWER SHOT dari ${p.name}!` : `Tendangan terarah oleh ${p.name}!`;

    this.input.shootPower = 0;
  }

  triggerTackleOrSwitch() {
    if (this.state === 'KICKOFF') {
      this.state = 'PLAYING';
    }
    const p = this.controlledPlayer;
    if (!p) return;

    if (this.ball.owner === p) {
      // Sprint boost / skill move touch
      p.vel.scale(1.4);
      return;
    }

    // Defensive Slide / Stand Tackle
    if (p.tackleCooldown <= 0) {
      p.isTackling = true;
      p.tackleTimer = 22;
      p.tackleCooldown = 55;
      this.audio.playTackle();

      const dist = p.pos.dist(this.ball.pos);
      if (dist < p.radius + this.ball.radius + 12) {
        this.audio.playKick(0.7);
        if (this.ball.owner) {
          this.ball.owner = null;
        }
        this.ball.owner = p;
        this.commentary = `Tackle bersih yang sangat gemilang oleh ${p.name}!`;
      }
    } else {
      // Switch to next closest defender
      this.switchToClosestDefender();
    }
  }

  passBall(p, dir, power, loft = 0) {
    this.audio.playKick(0.8);
    this.ball.kick(dir, power, loft, p);
    this.createKickParticles(p.pos, '#38bdf8');
  }

  shootBall(p, dir, power, loft = 1.0) {
    this.audio.playKick(1.2);
    this.ball.kick(dir, power, loft, p);
    this.createKickParticles(p.pos, '#ffd700');
  }

  checkBallPossession() {
    if (this.ball.owner) return;

    // Check all players within reach
    const allPlayers = [...this.homePlayers, ...this.awayPlayers];
    for (const p of allPlayers) {
      const dist = p.pos.dist(this.ball.pos);
      if (dist < p.radius + this.ball.radius + 4 && this.ball.z < 8) {
        this.ball.owner = p;
        this.ball.vel.set(0, 0);

        if (p.team === 'home') {
          this.setControlledPlayer(p);
        }
        break;
      }
    }
  }

  checkGoal() {
    const { left, right, goalTop, goalBottom } = this.pitch;
    const b = this.ball;

    // Away Goal Scored (Home team scored!)
    if (b.pos.x > right && b.pos.y >= goalTop && b.pos.y <= goalBottom) {
      this.score.home++;
      this.lastScorer = 'home';
      this.state = 'GOAL';
      this.goalCelebrationTimer = 3.2;
      this.commentary = `⚽ GOOOOL! Gol fantastis untuk tim Anda! Skor ${this.score.home} - ${this.score.away}`;
      this.audio.playNetHit();
      this.audio.playGoalCheer();
      this.createGoalConfetti(b.pos);
      return;
    }

    // Home Goal Scored (Away team scored!)
    if (b.pos.x < left && b.pos.y >= goalTop && b.pos.y <= goalBottom) {
      this.score.away++;
      this.lastScorer = 'away';
      this.state = 'GOAL';
      this.goalCelebrationTimer = 3.2;
      this.commentary = `⚽ GOL Lawan! Tim lawan menyarangkan bola ke gawang. Skor ${this.score.home} - ${this.score.away}`;
      this.audio.playNetHit();
      this.createGoalConfetti(b.pos);
      return;
    }
  }

  autoSwitchDefender() {
    if (this.ball.owner && this.ball.owner.team === 'away') {
      const closest = this.getClosestPlayerToBall('home');
      if (closest && closest.role !== 'GK' && closest !== this.controlledPlayer) {
        if (closest.pos.dist(this.ball.pos) < this.controlledPlayer.pos.dist(this.ball.pos) - 80) {
          this.setControlledPlayer(closest);
        }
      }
    }
  }

  switchToClosestDefender() {
    const defenders = this.homePlayers.filter(p => p !== this.controlledPlayer && p.role !== 'GK');
    let closest = null;
    let minDist = Infinity;

    defenders.forEach(p => {
      const d = p.pos.dist(this.ball.pos);
      if (d < minDist) {
        minDist = d;
        closest = p;
      }
    });

    if (closest) {
      this.setControlledPlayer(closest);
      this.audio.playClick();
    }
  }

  getClosestPlayerToBall(team) {
    const players = team === 'home' ? this.homePlayers : this.awayPlayers;
    let closest = null;
    let minDist = Infinity;

    players.forEach(p => {
      const d = p.pos.dist(this.ball.pos);
      if (d < minDist) {
        minDist = d;
        closest = p;
      }
    });

    return closest;
  }

  createKickParticles(pos, color) {
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        pos: pos.clone(),
        vel: new Vector2((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4),
        color,
        size: Math.random() * 4 + 2,
        alpha: 1.0,
        life: 0.3
      });
    }
  }

  createGoalConfetti(pos) {
    const colors = ['#ffd700', '#00ff88', '#38bdf8', '#ff007f', '#ffffff'];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        pos: pos.clone(),
        vel: new Vector2((Math.random() - 0.5) * 12, (Math.random() - 0.8) * 14),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        alpha: 1.0,
        life: 2.0
      });
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.pos.add(p.vel);
      p.vel.y += 0.2; // Gravity
      p.alpha -= dt / p.life;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
}
