/**
 * FC CHAMPIONS MOBILE - Storage Manager
 * Handles local persistence for user coins, gems, squad lineup, and inventory.
 */

import { DEFAULT_STARTER_SQUAD } from '../data/players.js';

const STORAGE_KEY = 'fc_champions_save_v1';

export class StorageManager {
  static loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          coins: parsed.coins ?? 25000,
          gems: parsed.gems ?? 500,
          squad: parsed.squad ?? JSON.parse(JSON.stringify(DEFAULT_STARTER_SQUAD)),
          ownedPlayerIds: parsed.ownedPlayerIds ?? [
            'brz_paes', 'gld_theo', 'brz_hubner', 'slv_inacio', 'gld_walker',
            'gld_pedri', 'slv_hjulmand', 'brz_marselino', 'slv_garnacho',
            'brz_struick', 'elt_saka', 'slv_livakovic', 'slv_sesko', 'slv_simons',
            'gld_camavinga', 'gld_leao'
          ],
          stats: parsed.stats ?? { matchesPlayed: 0, wins: 0, goalsScored: 0 }
        };
      }
    } catch (e) {
      console.error('Failed to load save data:', e);
    }

    // Default initial data
    return {
      coins: 25000,
      gems: 500,
      squad: JSON.parse(JSON.stringify(DEFAULT_STARTER_SQUAD)),
      ownedPlayerIds: [
        'brz_paes', 'gld_theo', 'brz_hubner', 'slv_inacio', 'gld_walker',
        'gld_pedri', 'slv_hjulmand', 'brz_marselino', 'slv_garnacho',
        'brz_struick', 'elt_saka', 'slv_livakovic', 'slv_sesko', 'slv_simons',
        'gld_camavinga', 'gld_leao'
      ],
      stats: { matchesPlayed: 0, wins: 0, goalsScored: 0 }
    };
  }

  static saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }

  static resetData() {
    localStorage.removeItem(STORAGE_KEY);
    return this.loadData();
  }
}
