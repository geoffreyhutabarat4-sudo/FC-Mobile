/**
 * FC CHAMPIONS MOBILE - Physics & Ball Simulation Engine
 */

import { Vector2 } from './Vector2.js';

export class Ball {
  constructor(x, y) {
    this.pos = new Vector2(x, y);
    this.vel = new Vector2(0, 0);
    this.z = 0;       // Height off ground (for lofted passes / power shots)
    this.zVel = 0;
    this.radius = 6;
    this.friction = 0.982;
    this.airResistance = 0.99;
    this.gravity = 0.45;
    this.owner = null; // Player who currently has possession
    this.lastTouch = null; // 'home' | 'away'
    this.trail = [];
  }

  reset(x, y) {
    this.pos.set(x, y);
    this.vel.set(0, 0);
    this.z = 0;
    this.zVel = 0;
    this.owner = null;
    this.trail = [];
  }

  kick(dirVector, power, loft = 0, kicker = null) {
    this.owner = null;
    this.vel = dirVector.clone().normalize().scale(power);
    this.zVel = loft;
    if (kicker) {
      this.lastTouch = kicker.team;
    }
  }

  update(pitchBounds) {
    // Record trail for HD rendering
    if (this.vel.magSq() > 4 || this.z > 2) {
      this.trail.push({ x: this.pos.x, y: this.pos.y, z: this.z, alpha: 1.0 });
      if (this.trail.length > 12) {
        this.trail.shift();
      }
    } else {
      if (this.trail.length > 0) this.trail.shift();
    }

    this.trail.forEach(t => t.alpha *= 0.82);

    if (this.owner) {
      // Attached to dribbling player
      const fwd = this.owner.facing.clone().normalize().scale(12);
      this.pos.copy(this.owner.pos).add(fwd);
      this.vel.copy(this.owner.vel);
      this.z = 0;
      this.zVel = 0;
      return;
    }

    // Free ball motion
    this.pos.add(this.vel);
    this.vel.scale(this.z > 0.5 ? this.airResistance : this.friction);

    // Vertical height physics
    if (this.z > 0 || this.zVel !== 0) {
      this.z += this.zVel;
      this.zVel -= this.gravity;
      if (this.z <= 0) {
        this.z = 0;
        this.zVel = -this.zVel * 0.55; // Bounce damping
        if (Math.abs(this.zVel) < 0.5) this.zVel = 0;
      }
    }

    // Pitch bounds checking
    this.handleBoundaries(pitchBounds);
  }

  handleBoundaries(pitch) {
    const { left, right, top, bottom, goalTop, goalBottom } = pitch;

    // Check goal areas first (left and right goals)
    const inGoalY = this.pos.y >= goalTop && this.pos.y <= goalBottom;

    // Left Goal
    if (this.pos.x < left) {
      if (!inGoalY) {
        this.pos.x = left;
        this.vel.x = -this.vel.x * 0.6;
      } else if (this.pos.x < left - 40) {
        // Hit back of left net
        this.pos.x = left - 40;
        this.vel.x = -this.vel.x * 0.2;
        this.vel.y *= 0.4;
      }
    }

    // Right Goal
    if (this.pos.x > right) {
      if (!inGoalY) {
        this.pos.x = right;
        this.vel.x = -this.vel.x * 0.6;
      } else if (this.pos.x > right + 40) {
        // Hit back of right net
        this.pos.x = right + 40;
        this.vel.x = -this.vel.x * 0.2;
        this.vel.y *= 0.4;
      }
    }

    // Top and bottom touchlines
    if (this.pos.y < top) {
      this.pos.y = top;
      this.vel.y = -this.vel.y * 0.6;
    }
    if (this.pos.y > bottom) {
      this.pos.y = bottom;
      this.vel.y = -this.vel.y * 0.6;
    }
  }
}
