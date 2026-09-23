/**
 * FC CHAMPIONS MOBILE - Tactical Player & AI Controller
 */

import { Vector2 } from './Vector2.js';

export class MatchPlayer {
  constructor(data, team, isControlled = false) {
    this.id = data.id;
    this.name = data.name;
    this.role = data.pos || 'CM';
    this.stats = {
      pac: data.pac || 75,
      sho: data.sho || 70,
      pas: data.pas || 70,
      dri: data.dri || 75,
      def: data.def || 60,
      phy: data.phy || 70,
      ovr: data.ovr || 75
    };
    this.team = team; // 'home' (Player) or 'away' (CPU)
    this.isControlled = isControlled;

    this.pos = new Vector2(0, 0);
    this.vel = new Vector2(0, 0);
    this.facing = new Vector2(team === 'home' ? 1 : -1, 0);
    this.basePos = new Vector2(0, 0);

    this.radius = 12;
    this.stamina = 100;
    this.isTackling = false;
    this.tackleTimer = 0;
    this.tackleCooldown = 0;
    this.passCooldown = 0;
    this.number = data.number || Math.floor(Math.random() * 90 + 10);
    this.avatar = data.avatar || '⚽';
  }

  getSpeed() {
    const base = 1.6 + (this.stats.pac / 100) * 1.5;
    return this.isTackling ? base * 1.6 : base;
  }

  updateCooldowns() {
    if (this.tackleCooldown > 0) this.tackleCooldown--;
    if (this.passCooldown > 0) this.passCooldown--;
    if (this.isTackling) {
      this.tackleTimer--;
      if (this.tackleTimer <= 0) {
        this.isTackling = false;
      }
    }
  }
}

export class AIController {
  constructor(match) {
    this.match = match;
  }

  updatePlayerAI(p, ball, pitch) {
    p.updateCooldowns();
    if (p.isControlled && p.team === 'home') return; // Controlled manually by player

    const isHome = p.team === 'home';
    const opponentGoalX = isHome ? pitch.right : pitch.left;
    const ownGoalX = isHome ? pitch.left : pitch.right;
    const goalCenterY = (pitch.top + pitch.bottom) / 2;

    const distToBall = p.pos.dist(ball.pos);
    const hasBall = ball.owner === p;

    // 1. GOALKEEPER BEHAVIOR
    if (p.role === 'GK') {
      this.handleGoalkeeper(p, ball, pitch, ownGoalX, goalCenterY);
      return;
    }

    // 2. PLAYER HAS THE BALL
    if (hasBall) {
      this.handlePossession(p, ball, pitch, opponentGoalX, goalCenterY);
      return;
    }

    // 3. TEAM IN POSSESSION (SUPPORTING RUNS)
    const teamHasBall = ball.owner && ball.owner.team === p.team;
    if (teamHasBall) {
      this.handleAttackSupport(p, ball, pitch, opponentGoalX);
      return;
    }

    // 4. OPPONENT HAS BALL / LOOSE BALL (DEFENDING & PRESSING)
    this.handleDefenseAndLooseBall(p, ball, pitch, ownGoalX, distToBall);
  }

  handleGoalkeeper(p, ball, pitch, ownGoalX, goalCenterY) {
    const isHome = p.team === 'home';
    const targetX = isHome ? ownGoalX + 35 : ownGoalX - 35;

    // Track ball along Y within goal box
    const clampedBallY = Math.max(pitch.goalTop + 10, Math.min(pitch.goalBottom - 10, ball.pos.y));
    const target = new Vector2(targetX, clampedBallY);

    // If ball is very close inside penalty area, rush out to catch/clear
    const distToBall = p.pos.dist(ball.pos);
    const inBox = Math.abs(ball.pos.x - ownGoalX) < 130 &&
                  ball.pos.y > pitch.goalTop - 40 &&
                  ball.pos.y < pitch.goalBottom + 40;

    if (inBox && distToBall < 90 && !ball.owner) {
      target.copy(ball.pos);
    }

    const moveDir = target.clone().sub(p.pos);
    if (moveDir.mag() > 3) {
      p.vel = moveDir.normalize().scale(p.getSpeed() * 0.9);
      p.pos.add(p.vel);
      p.facing.copy(ball.pos).sub(p.pos).normalize();
    } else {
      p.vel.set(0, 0);
    }

    // GK Catch / Save
    if (distToBall < p.radius + ball.radius + 10 && (!ball.owner || ball.owner.team !== p.team)) {
      if (ball.owner) {
        ball.owner = null;
      }
      ball.owner = p;
      this.match.audio.playTackle();
      // GK clearance pass forward
      setTimeout(() => {
        if (ball.owner === p) {
          const clearDir = new Vector2(isHome ? 1 : -1, (Math.random() - 0.5) * 0.6);
          this.match.passBall(p, clearDir, 14 + (p.stats.pas / 100) * 6, 8);
        }
      }, 500);
    }
  }

  handlePossession(p, ball, pitch, opponentGoalX, goalCenterY) {
    const isHome = p.team === 'home';
    const goalTarget = new Vector2(opponentGoalX, goalCenterY);
    const distToGoal = p.pos.dist(goalTarget);

    // Turn toward goal
    p.facing = goalTarget.clone().sub(p.pos).normalize();

    // In shooting range?
    if (distToGoal < 220) {
      // Shoot at corners of the goal!
      const targetY = (Math.random() > 0.5 ? pitch.goalTop + 15 : pitch.goalBottom - 15);
      const shootTarget = new Vector2(opponentGoalX, targetY);
      const shootDir = shootTarget.sub(p.pos).normalize();
      const shootPower = 15 + (p.stats.sho / 100) * 9;
      this.match.shootBall(p, shootDir, shootPower);
      return;
    }

    // Check for open teammate pass
    if (p.passCooldown <= 0 && Math.random() < 0.03) {
      const teammates = (isHome ? this.match.homePlayers : this.match.awayPlayers)
        .filter(t => t !== p && t.role !== 'GK');

      // Find teammate further forward
      const forwardTeammates = teammates.filter(t => isHome ? t.pos.x > p.pos.x + 40 : t.pos.x < p.pos.x - 40);
      if (forwardTeammates.length > 0) {
        const bestTarget = forwardTeammates[Math.floor(Math.random() * forwardTeammates.length)];
        const passDir = bestTarget.pos.clone().sub(p.pos).normalize();
        this.match.passBall(p, passDir, 12 + (p.stats.pas / 100) * 5, 0);
        p.passCooldown = 60;
        return;
      }
    }

    // Dribble forward with slight evasion
    const dribbleDir = new Vector2(isHome ? 1 : -1, (Math.random() - 0.5) * 0.4).normalize();
    p.vel = dribbleDir.scale(p.getSpeed() * 0.85);
    p.pos.add(p.vel);
  }

  handleAttackSupport(p, ball, pitch, opponentGoalX) {
    const isHome = p.team === 'home';
    // Move up with play relative to basePos, but staying in position
    const ballProgress = (ball.pos.x - pitch.left) / (pitch.right - pitch.left);
    const shiftX = (ballProgress - 0.5) * 200;

    const target = p.basePos.clone();
    target.x += isHome ? Math.max(0, shiftX) : Math.min(0, shiftX);

    // Strikers and wingers push further forward
    if (['ST', 'LW', 'RW'].includes(p.role)) {
      target.x = isHome ? Math.max(target.x, ball.pos.x + 30) : Math.min(target.x, ball.pos.x - 30);
    }

    this.seekTarget(p, target, 0.9);
  }

  handleDefenseAndLooseBall(p, ball, pitch, ownGoalX, distToBall) {
    // If closest player to ball, chase down ball aggressively
    const closest = this.match.getClosestPlayerToBall(p.team);
    if (closest === p && distToBall < 260) {
      this.seekTarget(p, ball.pos, 1.15);

      // Attempt slide/stand tackle
      if (distToBall < p.radius + ball.radius + 8 && p.tackleCooldown <= 0) {
        p.isTackling = true;
        p.tackleTimer = 18;
        p.tackleCooldown = 60;
        this.match.audio.playTackle();

        // Check tackle success based on DEF vs DRI
        const defStat = p.stats.def;
        const driStat = ball.owner ? ball.owner.stats.dri : 70;
        const successRate = 0.5 + ((defStat - driStat) / 200);

        if (Math.random() < Math.max(0.2, Math.min(0.85, successRate))) {
          if (ball.owner) {
            ball.owner = null;
          }
          ball.owner = p;
          p.vel.scale(0.3);
        }
      }
      return;
    }

    // Otherwise maintain defensive zone
    const target = p.basePos.clone();
    this.seekTarget(p, target, 0.85);
  }

  seekTarget(p, target, speedMultiplier = 1.0) {
    const dir = target.clone().sub(p.pos);
    const dist = dir.mag();
    if (dist > 8) {
      p.vel = dir.normalize().scale(p.getSpeed() * speedMultiplier);
      p.pos.add(p.vel);
      p.facing.copy(p.vel).normalize();
    } else {
      p.vel.set(0, 0);
    }
  }
}
