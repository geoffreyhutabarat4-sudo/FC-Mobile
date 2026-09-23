/**
 * FC CHAMPIONS MOBILE - High Definition Match Canvas Renderer
 */

export class MatchRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animTime = 0;
  }

  resize() {
    this.canvas.width = 1000;
    this.canvas.height = 620;
  }

  render(match) {
    const ctx = this.ctx;
    const { pitch, ball, homePlayers, awayPlayers, controlledPlayer, state, score } = match;
    this.animTime += 0.016;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw HD Grass & Pitch Markings
    this.drawPitch(ctx, pitch);

    // 2. Draw Goal Nets
    this.drawGoalNets(ctx, pitch);

    // 3. Draw Kick & Goal Particles
    this.drawParticles(ctx, match.particles);

    // 4. Draw Ball Shadow (scale based on height z)
    this.drawBallShadow(ctx, ball);

    // 5. Draw All Players (sorted by Y for correct isometric depth)
    const allPlayers = [...homePlayers, ...awayPlayers].sort((a, b) => a.pos.y - b.pos.y);
    allPlayers.forEach(p => this.drawPlayer(ctx, p, p === controlledPlayer));

    // 6. Draw Ball
    this.drawBall(ctx, ball);

    // 7. Draw Controlled Player HUD / Power Shot Bar
    if (controlledPlayer && match.input.shootCharging) {
      this.drawPowerShotBar(ctx, controlledPlayer, match.input.shootPower);
    }

    // 8. Draw 2D Tactical Radar / Minimap
    this.drawRadar(ctx, pitch, homePlayers, awayPlayers, ball);

    // 9. Goal Freeze-frame Celebration Banner / Kickoff / Halftime
    if (state === 'GOAL') {
      this.drawGoalBanner(ctx, match.lastScorer);
    } else if (state === 'KICKOFF') {
      this.drawKickoffPrompt(ctx);
    } else if (state === 'HALFTIME') {
      this.drawHalftimeBanner(ctx, score);
    }
  }

  drawKickoffPrompt(ctx) {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2 + 130;
    const pulse = (Math.sin(this.animTime * 6) + 1) * 0.5;

    ctx.fillStyle = `rgba(15, 23, 42, ${0.75 + pulse * 0.2})`;
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cx - 180, cy - 18, 360, 36, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚽ SENTUH LAYAR / TEKAN WASD UNTUK KICK-OFF', cx, cy);
  }

  drawHalftimeBanner(ctx, score) {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, cy - 60, this.canvas.width, 120);

    ctx.fillStyle = '#ffd700';
    ctx.font = '900 32px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⏸️ HALF-TIME (ISTIRAHAT)', cx, cy - 14);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(`SKOR: ${score.home} - ${score.away} • Babak 2 segera dimulai...`, cx, cy + 24);
  }

  drawPitch(ctx, p) {
    // Stadium exterior border
    ctx.fillStyle = '#0b1626';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Lush grass base
    ctx.fillStyle = '#1e7b34';
    ctx.fillRect(p.left, p.top, p.right - p.left, p.bottom - p.top);

    // Grass Mowed Stripes (Horizontal Alternating HD Green Tones)
    const stripeCount = 14;
    const stripeH = (p.bottom - p.top) / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
      ctx.fillRect(p.left, p.top + i * stripeH, p.right - p.left, stripeH);
    }

    // Pitch Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2.5;

    // Outer Boundary
    ctx.strokeRect(p.left, p.top, p.right - p.left, p.bottom - p.top);

    // Halfway line
    const midX = (p.left + p.right) / 2;
    ctx.beginPath();
    ctx.moveTo(midX, p.top);
    ctx.lineTo(midX, p.bottom);
    ctx.stroke();

    // Center Circle & Spot
    const midY = (p.top + p.bottom) / 2;
    ctx.beginPath();
    ctx.arc(midX, midY, 65, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(midX, midY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Penalty Areas (18-yard box)
    const boxW = 120;
    const boxH = 220;
    const boxTop = midY - boxH / 2;

    // Left Penalty Box
    ctx.strokeRect(p.left, boxTop, boxW, boxH);
    // Left 6-Yard Box
    ctx.strokeRect(p.left, midY - 60, 45, 120);
    // Left Penalty Spot
    ctx.beginPath();
    ctx.arc(p.left + 85, midY, 3, 0, Math.PI * 2);
    ctx.fill();
    // Left Penalty Arc
    ctx.beginPath();
    ctx.arc(p.left + 85, midY, 45, -Math.PI * 0.35, Math.PI * 0.35);
    ctx.stroke();

    // Right Penalty Box
    ctx.strokeRect(p.right - boxW, boxTop, boxW, boxH);
    // Right 6-Yard Box
    ctx.strokeRect(p.right - 45, midY - 60, 45, 120);
    // Right Penalty Spot
    ctx.beginPath();
    ctx.arc(p.right - 85, midY, 3, 0, Math.PI * 2);
    ctx.fill();
    // Right Penalty Arc
    ctx.beginPath();
    ctx.arc(p.right - 85, midY, 45, Math.PI * 0.65, Math.PI * 1.35);
    ctx.stroke();

    // Corner Arcs
    const cR = 14;
    ctx.beginPath();
    ctx.arc(p.left, p.top, cR, 0, Math.PI * 0.5); ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.right, p.top, cR, Math.PI * 0.5, Math.PI); ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.left, p.bottom, cR, -Math.PI * 0.5, 0); ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.right, p.bottom, cR, Math.PI, Math.PI * 1.5); ctx.stroke();
  }

  drawGoalNets(ctx, p) {
    const netDepth = 30;
    const goalH = p.goalBottom - p.goalTop;

    // Left Goal Net
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;

    ctx.fillRect(p.left - netDepth, p.goalTop, netDepth, goalH);
    ctx.strokeRect(p.left - netDepth, p.goalTop, netDepth, goalH);

    // Right Goal Net
    ctx.fillRect(p.right, p.goalTop, netDepth, goalH);
    ctx.strokeRect(p.right, p.goalTop, netDepth, goalH);
  }

  drawPlayer(ctx, p, isControlled) {
    const { x, y } = p.pos;

    // 1. Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 8, p.radius * 0.9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Controlled Indicator (Glowing Neon Cursor & Ring)
    if (isControlled) {
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y + 2, p.radius + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Floating Triangle Cursor
      const bob = Math.sin(this.animTime * 8) * 3;
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.moveTo(x, y - 24 + bob);
      ctx.lineTo(x - 6, y - 32 + bob);
      ctx.lineTo(x + 6, y - 32 + bob);
      ctx.closePath();
      ctx.fill();
    }

    // 3. Player Body Circle
    ctx.save();
    ctx.translate(x, y);

    // Jersey Colors
    const isHome = p.team === 'home';
    const bodyColor = isHome ? (p.role === 'GK' ? '#f59e0b' : '#0284c7') : (p.role === 'GK' ? '#8b5cf6' : '#e11d48');
    const trimColor = isHome ? '#38bdf8' : '#fb7185';

    ctx.fillStyle = bodyColor;
    ctx.strokeStyle = trimColor;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Directional Facing Nose / Line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p.facing.x * 6, p.facing.y * 6);
    ctx.lineTo(p.facing.x * (p.radius + 3), p.facing.y * (p.radius + 3));
    ctx.stroke();

    // Number or Icon inside
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.role === 'GK' ? '🧤' : p.role, 0, 0);

    ctx.restore();

    // 4. Player Name Tag (Subtle floating badge)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    const nameWidth = ctx.measureText(p.name).width + 8;
    ctx.beginPath();
    ctx.roundRect(x - nameWidth / 2, y + 14, nameWidth, 12, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isControlled ? '#00f0ff' : '#f8fafc';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.name, x, y + 20);
  }

  drawBallShadow(ctx, ball) {
    const { x, y } = ball.pos;
    const shadowScale = Math.max(0.3, 1 - ball.z / 60);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(x, y + 2, ball.radius * shadowScale, 3 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBall(ctx, ball) {
    const { x, y } = ball.pos;
    const renderY = y - ball.z;

    // Draw motion trail
    ball.trail.forEach(t => {
      ctx.fillStyle = `rgba(255, 255, 255, ${t.alpha * 0.35})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y - t.z, ball.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Outer Ball
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(x, renderY, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Classic pentagon pattern center
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(x, renderY, ball.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPowerShotBar(ctx, p, power) {
    const barW = 48;
    const barH = 6;
    const bx = p.pos.x - barW / 2;
    const by = p.pos.y - 36;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(bx, by, barW, barH);

    const fillRatio = power / 100;
    const fillColor = fillRatio > 0.8 ? '#ff0055' : fillRatio > 0.5 ? '#ffd700' : '#00ff88';
    ctx.fillStyle = fillColor;
    ctx.fillRect(bx, by, barW * fillRatio, barH);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, barW, barH);
  }

  drawRadar(ctx, pitch, home, away, ball) {
    const rw = 140;
    const rh = 86;
    const rx = this.canvas.width - rw - 14;
    const ry = 14;

    // Radar BG
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, 6);
    ctx.fill();
    ctx.stroke();

    // Halfway line in radar
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(rx + rw / 2, ry);
    ctx.lineTo(rx + rw / 2, ry + rh);
    ctx.stroke();

    const scaleX = rw / (pitch.right - pitch.left);
    const scaleY = rh / (pitch.bottom - pitch.top);

    // Draw Home dots (Cyan)
    ctx.fillStyle = '#00f0ff';
    home.forEach(p => {
      const px = rx + (p.pos.x - pitch.left) * scaleX;
      const py = ry + (p.pos.y - pitch.top) * scaleY;
      ctx.beginPath();
      ctx.arc(px, py, p.isControlled ? 3.5 : 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Away dots (Red)
    ctx.fillStyle = '#ff4081';
    away.forEach(p => {
      const px = rx + (p.pos.x - pitch.left) * scaleX;
      const py = ry + (p.pos.y - pitch.top) * scaleY;
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Ball dot (Gold)
    ctx.fillStyle = '#ffd700';
    const bx = rx + (ball.pos.x - pitch.left) * scaleX;
    const by = ry + (ball.pos.y - pitch.top) * scaleY;
    ctx.beginPath();
    ctx.arc(bx, by, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  drawParticles(ctx, particles) {
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.beginPath();
      ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;
  }

  drawGoalBanner(ctx, scorer) {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, cy - 50, this.canvas.width, 100);

    ctx.fillStyle = scorer === 'home' ? '#00ff88' : '#ff4081';
    ctx.font = '900 48px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = scorer === 'home' ? '#00ff88' : '#ff4081';
    ctx.shadowBlur = 20;

    ctx.fillText('⚽ GOOOAAAL! ⚽', cx, cy - 6);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(scorer === 'home' ? 'Luar biasa! Tim Anda mencetak gol!' : 'Gawang Anda kebobolan!', cx, cy + 30);
  }
}
