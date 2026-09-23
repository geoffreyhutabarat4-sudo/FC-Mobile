/**
 * FC CHAMPIONS MOBILE - Squad & Lineup Manager
 * Calculates Team OVR, Chemistry, and handles Formation Changes & Player Substitutions.
 */

import { FORMATIONS } from '../data/formations.js';
import { getPlayerById } from '../data/players.js';

export class SquadManager {
  constructor(appData) {
    this.data = appData;
    this.squad = appData.squad;
    this.selectedSlotKey = null;
    this.selectedBenchIndex = null;
  }

  getFormation() {
    return this.squad.formation || '4-3-3';
  }

  setFormation(formationKey) {
    if (!FORMATIONS[formationKey]) return;

    const oldSlots = this.squad.startingXI;
    const newFormDef = FORMATIONS[formationKey];

    // Re-map players to new formation slots
    const newStartingXI = [];
    const usedPlayerIds = new Set();

    newFormDef.slots.forEach(slot => {
      // Find a player from old XI that matches role if possible
      let matchedOld = oldSlots.find(s => {
        if (usedPlayerIds.has(s.playerId)) return false;
        const p = getPlayerById(s.playerId);
        return p && p.pos === slot.role;
      });

      if (!matchedOld) {
        // Find any unused old starting player
        matchedOld = oldSlots.find(s => !usedPlayerIds.has(s.playerId));
      }

      const playerId = matchedOld ? matchedOld.playerId : this.data.ownedPlayerIds[0];
      usedPlayerIds.add(playerId);

      newStartingXI.push({
        posKey: slot.key,
        playerId
      });
    });

    this.squad.formation = formationKey;
    this.squad.startingXI = newStartingXI;
    this.calculateTeamStats();
  }

  swapStartingWithBench(slotKey, benchIndex) {
    const slotObj = this.squad.startingXI.find(s => s.posKey === slotKey);
    if (!slotObj || benchIndex < 0 || benchIndex >= this.squad.bench.length) return false;

    const oldStartingId = slotObj.playerId;
    const newPlayerId = this.squad.bench[benchIndex];

    slotObj.playerId = newPlayerId;
    this.squad.bench[benchIndex] = oldStartingId;

    this.calculateTeamStats();
    return true;
  }

  swapTwoStartingSlots(slotKeyA, slotKeyB) {
    const slotA = this.squad.startingXI.find(s => s.posKey === slotKeyA);
    const slotB = this.squad.startingXI.find(s => s.posKey === slotKeyB);
    if (!slotA || !slotB) return false;

    const tempId = slotA.playerId;
    slotA.playerId = slotB.playerId;
    slotB.playerId = tempId;

    this.calculateTeamStats();
    return true;
  }

  substituteFromReserves(reservePlayerId, targetSlotKey) {
    const slotObj = this.squad.startingXI.find(s => s.posKey === targetSlotKey);
    if (!slotObj) return false;

    const oldStartingId = slotObj.playerId;
    slotObj.playerId = reservePlayerId;

    // Swap in reserves
    const resIdx = this.squad.reserves.indexOf(reservePlayerId);
    if (resIdx !== -1) {
      this.squad.reserves[resIdx] = oldStartingId;
    } else {
      this.squad.reserves.push(oldStartingId);
    }

    this.calculateTeamStats();
    return true;
  }

  calculateTeamStats() {
    const formDef = FORMATIONS[this.getFormation()];
    let totalOvr = 0;
    let chemistryPoints = 0;

    const startingPlayers = [];

    this.squad.startingXI.forEach(slot => {
      const p = getPlayerById(slot.playerId);
      const slotDef = formDef ? formDef.slots.find(s => s.key === slot.posKey) : null;

      if (p) {
        startingPlayers.push({ player: p, slotDef });
        // Check position penalty
        let effectiveOvr = p.ovr;
        if (slotDef && slotDef.role !== p.pos) {
          // If playing completely different role (e.g. ST as GK), deduct OVR
          if (p.pos === 'GK' || slotDef.role === 'GK') {
            effectiveOvr -= 15;
          } else {
            effectiveOvr -= 4; // Slight out-of-position penalty
          }
        }
        totalOvr += effectiveOvr;

        // Position match chemistry
        if (slotDef && slotDef.role === p.pos) {
          chemistryPoints += 4;
        }
      }
    });

    // Nation & Club synergies
    for (let i = 0; i < startingPlayers.length; i++) {
      for (let j = i + 1; j < startingPlayers.length; j++) {
        const pA = startingPlayers[i].player;
        const pB = startingPlayers[j].player;
        if (pA.nation === pB.nation) chemistryPoints += 2;
        if (pA.club === pB.club) chemistryPoints += 3;
      }
    }

    const avgOvr = Math.round(totalOvr / Math.max(1, this.squad.startingXI.length));
    const finalChem = Math.min(100, Math.max(20, chemistryPoints));

    return {
      teamOvr: avgOvr,
      chemistry: finalChem
    };
  }
}
