/**
 * FC CHAMPIONS MOBILE - Transfer Market & Pack Store Manager
 */

import { MASTER_PLAYERS, CARD_TIERS, getPlayerById } from '../data/players.js';

export const STORE_PACKS = [
  {
    id: 'pack_standard',
    name: 'Starter Pro Pack',
    tier: 'SILVER',
    costType: 'coins',
    cost: 5000,
    icon: '📦',
    desc: 'Berisi 1 pemain acak (Rating 65 - 84 OVR).',
    minOvr: 65,
    maxOvr: 84,
    color: '#38bdf8'
  },
  {
    id: 'pack_gold_elite',
    name: 'Gold Elite Pack',
    tier: 'GOLD',
    costType: 'coins',
    cost: 25000,
    icon: '✨',
    desc: 'Berisi 1 pemain bintang Gold / Elite (Rating 82 - 92 OVR).',
    minOvr: 82,
    maxOvr: 92,
    color: '#ffd700'
  },
  {
    id: 'pack_champions_icon',
    name: 'Prime ICON Champions',
    tier: 'ICON',
    costType: 'gems',
    cost: 400,
    icon: '👑',
    desc: 'Peluang tinggi mendapatkan Master Champions & Prime ICON (92 - 100 OVR)!',
    minOvr: 92,
    maxOvr: 100,
    color: '#facc15'
  }
];

export class MarketStore {
  constructor(appData, audioEngine) {
    this.data = appData;
    this.audio = audioEngine;
  }

  getMarketListings(searchQuery = '', filterPos = 'ALL', filterTier = 'ALL') {
    return MASTER_PLAYERS.filter(p => {
      // Filter out players already in squad if preferred, or allow buying any player
      const matchesSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.club.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPos = filterPos === 'ALL' || p.pos === filterPos;
      const matchesTier = filterTier === 'ALL' || p.tier === filterTier;

      return matchesSearch && matchesPos && matchesTier;
    }).sort((a, b) => b.ovr - a.ovr);
  }

  buyPlayer(playerId) {
    const player = getPlayerById(playerId);
    if (!player) return { success: false, message: 'Pemain tidak ditemukan!' };

    if (this.data.ownedPlayerIds.includes(playerId)) {
      return { success: false, message: 'Anda sudah memiliki pemain ini di skuad!' };
    }

    if (this.data.coins < player.price) {
      return { success: false, message: 'Koin Anda tidak mencukupi untuk membeli pemain ini!' };
    }

    // Deduct coins & add player
    this.data.coins -= player.price;
    this.data.ownedPlayerIds.push(playerId);
    this.data.squad.reserves.push(playerId);
    this.audio.playPackReveal(player.tier === 'ICON');

    return { success: true, message: `Berhasil merekrut ${player.name} (${player.ovr} OVR)!`, player };
  }

  sellPlayer(playerId) {
    const player = getPlayerById(playerId);
    if (!player) return { success: false, message: 'Pemain tidak ditemukan!' };

    // Check if in Starting XI
    const inStarting = this.data.squad.startingXI.some(s => s.playerId === playerId);
    if (inStarting) {
      return { success: false, message: 'Pemain ini ada di Starting XI! Ganti terlebih dahulu sebelum menjual.' };
    }

    // Remove from bench or reserves
    const benchIdx = this.data.squad.bench.indexOf(playerId);
    if (benchIdx !== -1) this.data.squad.bench.splice(benchIdx, 1);

    const resIdx = this.data.squad.reserves.indexOf(playerId);
    if (resIdx !== -1) this.data.squad.reserves.splice(resIdx, 1);

    const ownedIdx = this.data.ownedPlayerIds.indexOf(playerId);
    if (ownedIdx !== -1) this.data.ownedPlayerIds.splice(ownedIdx, 1);

    const sellPrice = Math.floor(player.price * 0.7);
    this.data.coins += sellPrice;
    this.audio.playClick();

    return { success: true, message: `Berhasil menjual ${player.name} seharga ${sellPrice.toLocaleString('id-ID')} Koin!` };
  }

  openPack(packId) {
    const pack = STORE_PACKS.find(p => p.id === packId);
    if (!pack) return { success: false, message: 'Paket tidak ditemukan!' };

    if (pack.costType === 'coins') {
      if (this.data.coins < pack.cost) {
        return { success: false, message: 'Koin tidak cukup untuk membuka paket ini!' };
      }
      this.data.coins -= pack.cost;
    } else {
      if (this.data.gems < pack.cost) {
        return { success: false, message: 'Gems tidak cukup untuk membuka paket ini!' };
      }
      this.data.gems -= pack.cost;
    }

    // Filter candidate players within pack rating
    const candidates = MASTER_PLAYERS.filter(p => p.ovr >= pack.minOvr && p.ovr <= pack.maxOvr);
    const chosenPlayer = candidates[Math.floor(Math.random() * candidates.length)] || candidates[0];

    // Add to inventory if not already owned
    if (!this.data.ownedPlayerIds.includes(chosenPlayer.id)) {
      this.data.ownedPlayerIds.push(chosenPlayer.id);
      this.data.squad.reserves.push(chosenPlayer.id);
    } else {
      // Duplicate bonus coins
      const bonus = Math.floor(chosenPlayer.price * 0.3);
      this.data.coins += bonus;
    }

    this.audio.playPackReveal(chosenPlayer.tier === 'ICON' || chosenPlayer.ovr >= 93);

    return {
      success: true,
      player: chosenPlayer,
      isDuplicate: this.data.ownedPlayerIds.includes(chosenPlayer.id)
    };
  }
}
