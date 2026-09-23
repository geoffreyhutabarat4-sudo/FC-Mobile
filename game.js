/**
 * ================================================================
 * FC CHAMPIONS MOBILE - ULTIMATE SOCCER & SQUAD BUILDER (game.js)
 * Standalone, zero-dependency, 100% cross-platform compatible.
 * Works seamlessly on file://, localhost, Netlify, and all web browsers.
 * ================================================================
 */
'use strict';

// ──────────────────────────────────────────────────────────────
// 1. DATABASE: PLAYERS & CARD TIERS
// ──────────────────────────────────────────────────────────────
const CARD_TIERS = {
  BRONZE: { name: 'Bronze', color: '#cd7f32', bgGrad: 'linear-gradient(135deg, #3d2b1f, #8b5a2b, #2b1d14)', border: '#d7995b', minOvr: 60, maxOvr: 69 },
  SILVER: { name: 'Silver', color: '#c0c0c0', bgGrad: 'linear-gradient(135deg, #2b3542, #7a8a9e, #1a232f)', border: '#e2e8f0', minOvr: 70, maxOvr: 79 },
  GOLD:   { name: 'Gold', color: '#ffd700', bgGrad: 'linear-gradient(135deg, #423200, #b8860b, #e5c158, #302400)', border: '#ffe066', minOvr: 80, maxOvr: 87 },
  ELITE:  { name: 'Elite', color: '#00f0ff', bgGrad: 'linear-gradient(135deg, #05263b, #0088cc, #00f0ff, #021827)', border: '#38bdf8', minOvr: 88, maxOvr: 92 },
  MASTER: { name: 'Master Champions', color: '#ff007f', bgGrad: 'linear-gradient(135deg, #3b0524, #c2185b, #ff007f, #880e4f)', border: '#f43f5e', minOvr: 93, maxOvr: 96 },
  ICON:   { name: 'Prime ICON', color: '#facc15', bgGrad: 'linear-gradient(135deg, #1e1b18, #d4af37, #fff275, #785b12)', border: '#fef08a', minOvr: 97, maxOvr: 100 }
};

const MASTER_PLAYERS = [
  // === ICONS (97-100) ===
  { id: 'icon_pele', name: 'Pelé', fullName: 'Edson Arantes do Nascimento', ovr: 100, pos: 'ST', nation: '🇧🇷 Brasil', club: 'Santos Legends', tier: 'ICON', pac: 99, sho: 99, pas: 96, dri: 99, def: 55, phy: 88, price: 500000, avatar: '👑', weakFoot: 5, skillMoves: 5 },
  { id: 'icon_r9', name: 'Ronaldo Nazário', fullName: 'Ronaldo Luís Nazário de Lima', ovr: 99, pos: 'ST', nation: '🇧🇷 Brasil', club: 'Real Legends', tier: 'ICON', pac: 98, sho: 98, pas: 88, dri: 97, def: 48, phy: 90, price: 450000, avatar: '⚡', weakFoot: 5, skillMoves: 5 },
  { id: 'icon_zidane', name: 'Zinédine Zidane', fullName: 'Zinédine Zidane', ovr: 98, pos: 'CAM', nation: '🇫🇷 Perancis', club: 'Juve Legends', tier: 'ICON', pac: 88, sho: 92, pas: 98, dri: 97, def: 75, phy: 89, price: 400000, avatar: '🎩', weakFoot: 5, skillMoves: 5 },
  { id: 'icon_maldini', name: 'Paolo Maldini', fullName: 'Paolo Cesare Maldini', ovr: 98, pos: 'CB', nation: '🇮🇹 Italia', club: 'Milan Legends', tier: 'ICON', pac: 90, sho: 60, pas: 84, dri: 78, def: 99, phy: 92, price: 380000, avatar: '🛡️', weakFoot: 4, skillMoves: 3 },
  { id: 'icon_casillas', name: 'Iker Casillas', fullName: 'Iker Casillas Fernández', ovr: 97, pos: 'GK', nation: '🇪🇸 Spanyol', club: 'Real Legends', tier: 'ICON', pac: 94, sho: 90, pas: 88, dri: 95, def: 96, phy: 92, price: 320000, avatar: '🧤', weakFoot: 3, skillMoves: 1 },

  // === MASTER TIER (93-96) ===
  { id: 'mst_mbappe', name: 'K. Mbappé', fullName: 'Kylian Mbappé', ovr: 96, pos: 'ST', nation: '🇫🇷 Perancis', club: 'Real Madrid', tier: 'MASTER', pac: 99, sho: 95, pas: 86, dri: 96, def: 42, phy: 84, price: 280000, avatar: '🚀', weakFoot: 4, skillMoves: 5 },
  { id: 'mst_haaland', name: 'E. Haaland', fullName: 'Erling Braut Haaland', ovr: 96, pos: 'ST', nation: '🇳🇴 Norwegia', club: 'Manchester City', tier: 'MASTER', pac: 94, sho: 98, pas: 75, dri: 87, def: 52, phy: 96, price: 275000, avatar: '🤖', weakFoot: 4, skillMoves: 4 },
  { id: 'mst_messi', name: 'L. Messi', fullName: 'Lionel Andrés Messi', ovr: 95, pos: 'RW', nation: '🇦🇷 Argentina', club: 'Inter Miami', tier: 'MASTER', pac: 88, sho: 96, pas: 97, dri: 98, def: 40, phy: 72, price: 260000, avatar: '🐐', weakFoot: 4, skillMoves: 5 },
  { id: 'mst_cr7', name: 'C. Ronaldo', fullName: 'Cristiano Ronaldo dos Santos Aveiro', ovr: 95, pos: 'ST', nation: '🇵🇹 Portugal', club: 'Al Nassr', tier: 'MASTER', pac: 90, sho: 97, pas: 84, dri: 90, def: 45, phy: 91, price: 250000, avatar: '💥', weakFoot: 5, skillMoves: 5 },
  { id: 'mst_debruyne', name: 'K. De Bruyne', fullName: 'Kevin De Bruyne', ovr: 95, pos: 'CM', nation: '🇧🇪 Belgia', club: 'Manchester City', tier: 'MASTER', pac: 80, sho: 91, pas: 98, dri: 92, def: 74, phy: 83, price: 240000, avatar: '🎯', weakFoot: 5, skillMoves: 4 },
  { id: 'mst_bellingham', name: 'J. Bellingham', fullName: 'Jude Bellingham', ovr: 94, pos: 'CAM', nation: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inggris', club: 'Real Madrid', tier: 'MASTER', pac: 88, sho: 90, pas: 91, dri: 92, def: 84, phy: 90, price: 230000, avatar: '🌟', weakFoot: 4, skillMoves: 4 },
  { id: 'mst_vinicius', name: 'Vinícius Jr.', fullName: 'Vinícius José Paixão', ovr: 94, pos: 'LW', nation: '🇧🇷 Brasil', club: 'Real Madrid', tier: 'MASTER', pac: 99, sho: 89, pas: 85, dri: 96, def: 38, phy: 78, price: 225000, avatar: '⚡', weakFoot: 4, skillMoves: 5 },
  { id: 'mst_vandijk', name: 'V. van Dijk', fullName: 'Virgil van Dijk', ovr: 94, pos: 'CB', nation: '🇳🇱 Belanda', club: 'Liverpool', tier: 'MASTER', pac: 84, sho: 65, pas: 80, dri: 78, def: 96, phy: 95, price: 220000, avatar: '🧱', weakFoot: 3, skillMoves: 2 },
  { id: 'mst_courtois', name: 'T. Courtois', fullName: 'Thibaut Courtois', ovr: 93, pos: 'GK', nation: '🇧🇪 Belgia', club: 'Real Madrid', tier: 'MASTER', pac: 88, sho: 89, pas: 82, dri: 90, def: 94, phy: 92, price: 200000, avatar: '🧤', weakFoot: 3, skillMoves: 1 },

  // === ELITE TIER (88-92) ===
  { id: 'elt_salah', name: 'M. Salah', fullName: 'Mohamed Salah', ovr: 91, pos: 'RW', nation: '🇪🇬 Mesir', club: 'Liverpool', tier: 'ELITE', pac: 93, sho: 92, pas: 87, dri: 92, def: 45, phy: 79, price: 150000, avatar: '👑', weakFoot: 4, skillMoves: 4 },
  { id: 'elt_rodri', name: 'Rodri', fullName: 'Rodrigo Hernández', ovr: 92, pos: 'CDM', nation: '🇪🇸 Spanyol', club: 'Manchester City', tier: 'ELITE', pac: 74, sho: 84, pas: 90, dri: 85, def: 92, phy: 91, price: 165000, avatar: '⚓', weakFoot: 4, skillMoves: 3 },
  { id: 'elt_kane', name: 'H. Kane', fullName: 'Harry Kane', ovr: 91, pos: 'ST', nation: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inggris', club: 'Bayern München', tier: 'ELITE', pac: 75, sho: 96, pas: 89, dri: 84, def: 52, phy: 86, price: 140000, avatar: '🎯', weakFoot: 5, skillMoves: 3 },
  { id: 'elt_saka', name: 'B. Saka', fullName: 'Bukayo Saka', ovr: 89, pos: 'RW', nation: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inggris', club: 'Arsenal', tier: 'ELITE', pac: 90, sho: 86, pas: 86, dri: 90, def: 65, phy: 80, price: 110000, avatar: '🌶️', weakFoot: 4, skillMoves: 4 },
  { id: 'elt_foden', name: 'P. Foden', fullName: 'Phil Foden', ovr: 90, pos: 'LW', nation: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inggris', club: 'Manchester City', tier: 'ELITE', pac: 89, sho: 88, pas: 89, dri: 93, def: 60, phy: 72, price: 125000, avatar: '🪄', weakFoot: 4, skillMoves: 4 },
  { id: 'elt_valverde', name: 'F. Valverde', fullName: 'Federico Valverde', ovr: 90, pos: 'CM', nation: '🇺🇾 Uruguay', club: 'Real Madrid', tier: 'ELITE', pac: 91, sho: 87, pas: 88, dri: 86, def: 84, phy: 89, price: 130000, avatar: '🦅', weakFoot: 4, skillMoves: 3 },
  { id: 'elt_rubendias', name: 'Rúben Dias', fullName: 'Rúben Dias', ovr: 90, pos: 'CB', nation: '🇵🇹 Portugal', club: 'Manchester City', tier: 'ELITE', pac: 72, sho: 45, pas: 76, dri: 72, def: 92, phy: 90, price: 120000, avatar: '🛡️', weakFoot: 4, skillMoves: 2 },
  { id: 'elt_saliba', name: 'W. Saliba', fullName: 'William Saliba', ovr: 89, pos: 'CB', nation: '🇫🇷 Perancis', club: 'Arsenal', tier: 'ELITE', pac: 84, sho: 40, pas: 78, dri: 76, def: 90, phy: 87, price: 115000, avatar: '🧱', weakFoot: 3, skillMoves: 2 },
  { id: 'elt_davies', name: 'A. Davies', fullName: 'Alphonso Davies', ovr: 88, pos: 'LB', nation: '🇨🇦 Kanada', club: 'Bayern München', tier: 'ELITE', pac: 97, sho: 72, pas: 81, dri: 88, def: 81, phy: 82, price: 95000, avatar: '⚡', weakFoot: 4, skillMoves: 4 },
  { id: 'elt_frimpong', name: 'J. Frimpong', fullName: 'Jeremie Frimpong', ovr: 88, pos: 'RB', nation: '🇳🇱 Belanda', club: 'Bayer Leverkusen', tier: 'ELITE', pac: 98, sho: 75, pas: 83, dri: 89, def: 78, phy: 76, price: 95000, avatar: '💨', weakFoot: 3, skillMoves: 4 },
  { id: 'elt_alisson', name: 'Alisson', fullName: 'Alisson Becker', ovr: 90, pos: 'GK', nation: '🇧🇷 Brasil', club: 'Liverpool', tier: 'ELITE', pac: 86, sho: 87, pas: 88, dri: 89, def: 91, phy: 88, price: 125000, avatar: '🧤', weakFoot: 3, skillMoves: 1 },

  // === GOLD TIER (80-87) ===
  { id: 'gld_musiala', name: 'J. Musiala', fullName: 'Jamal Musiala', ovr: 87, pos: 'CAM', nation: '🇩🇪 Jerman', club: 'Bayern München', tier: 'GOLD', pac: 88, sho: 82, pas: 84, dri: 94, def: 65, phy: 68, price: 65000, avatar: '🦌', weakFoot: 4, skillMoves: 5 },
  { id: 'gld_wirtz', name: 'F. Wirtz', fullName: 'Florian Wirtz', ovr: 87, pos: 'CAM', nation: '🇩🇪 Jerman', club: 'Bayer Leverkusen', tier: 'GOLD', pac: 84, sho: 83, pas: 88, dri: 90, def: 58, phy: 70, price: 65000, avatar: '🪄', weakFoot: 4, skillMoves: 4 },
  { id: 'gld_leao', name: 'R. Leão', fullName: 'Rafael Leão', ovr: 86, pos: 'LW', nation: '🇵🇹 Portugal', club: 'AC Milan', tier: 'GOLD', pac: 95, sho: 84, pas: 80, dri: 90, def: 35, phy: 80, price: 55000, avatar: '🏄', weakFoot: 4, skillMoves: 5 },
  { id: 'gld_camavinga', name: 'E. Camavinga', fullName: 'Eduardo Camavinga', ovr: 85, pos: 'CDM', nation: '🇫🇷 Perancis', club: 'Real Madrid', tier: 'GOLD', pac: 82, sho: 70, pas: 83, dri: 84, def: 83, phy: 84, price: 45000, avatar: '🛡️', weakFoot: 3, skillMoves: 4 },
  { id: 'gld_pedri', name: 'Pedri', fullName: 'Pedro González', ovr: 86, pos: 'CM', nation: '🇪🇸 Spanyol', club: 'Barcelona', tier: 'GOLD', pac: 80, sho: 74, pas: 87, dri: 90, def: 72, phy: 68, price: 50000, avatar: '🎨', weakFoot: 4, skillMoves: 4 },
  { id: 'gld_rudiger', name: 'A. Rüdiger', fullName: 'Antonio Rüdiger', ovr: 86, pos: 'CB', nation: '🇩🇪 Jerman', club: 'Real Madrid', tier: 'GOLD', pac: 84, sho: 55, pas: 72, dri: 68, def: 88, phy: 90, price: 52000, avatar: '🦍', weakFoot: 3, skillMoves: 2 },
  { id: 'gld_theo', name: 'Theo H.', fullName: 'Theo Hernandez', ovr: 86, pos: 'LB', nation: '🇫🇷 Perancis', club: 'AC Milan', tier: 'GOLD', pac: 95, sho: 76, pas: 78, dri: 84, def: 82, phy: 89, price: 54000, avatar: '🚄', weakFoot: 3, skillMoves: 3 },
  { id: 'gld_walker', name: 'K. Walker', fullName: 'Kyle Walker', ovr: 84, pos: 'RB', nation: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inggris', club: 'Manchester City', tier: 'GOLD', pac: 93, sho: 66, pas: 78, dri: 78, def: 82, phy: 84, price: 40000, avatar: '🛡️', weakFoot: 2, skillMoves: 3 },
  { id: 'gld_ederson', name: 'Ederson', fullName: 'Ederson Moraes', ovr: 87, pos: 'GK', nation: '🇧🇷 Brasil', club: 'Manchester City', tier: 'GOLD', pac: 84, sho: 82, pas: 93, dri: 86, def: 87, phy: 85, price: 60000, avatar: '🧤', weakFoot: 3, skillMoves: 1 },

  // === SILVER TIER (70-79) ===
  { id: 'slv_hjulmand', name: 'M. Hjulmand', fullName: 'Morten Hjulmand', ovr: 79, pos: 'CDM', nation: '🇩🇰 Denmark', club: 'Sporting CP', tier: 'SILVER', pac: 72, sho: 68, pas: 78, dri: 75, def: 79, phy: 82, price: 12000, avatar: '⚽', weakFoot: 3, skillMoves: 3 },
  { id: 'slv_simons', name: 'X. Simons', fullName: 'Xavi Simons', ovr: 79, pos: 'CAM', nation: '🇳🇱 Belanda', club: 'RB Leipzig', tier: 'SILVER', pac: 84, sho: 76, pas: 80, dri: 85, def: 52, phy: 66, price: 14000, avatar: '⭐', weakFoot: 3, skillMoves: 4 },
  { id: 'slv_garnacho', name: 'A. Garnacho', fullName: 'Alejandro Garnacho', ovr: 78, pos: 'LW', nation: '🇦🇷 Argentina', club: 'Manchester United', tier: 'SILVER', pac: 89, sho: 74, pas: 72, dri: 82, def: 38, phy: 64, price: 11000, avatar: '⚡', weakFoot: 4, skillMoves: 4 },
  { id: 'slv_sesko', name: 'B. Šeško', fullName: 'Benjamin Šeško', ovr: 78, pos: 'ST', nation: '🇸🇮 Slovenia', club: 'RB Leipzig', tier: 'SILVER', pac: 86, sho: 79, pas: 66, dri: 76, def: 42, phy: 82, price: 11500, avatar: '🎯', weakFoot: 4, skillMoves: 3 },
  { id: 'slv_inacio', name: 'G. Inácio', fullName: 'Gonçalo Inácio', ovr: 79, pos: 'CB', nation: '🇵🇹 Portugal', club: 'Sporting CP', tier: 'SILVER', pac: 76, sho: 48, pas: 74, dri: 70, def: 81, phy: 78, price: 12000, avatar: '🛡️', weakFoot: 4, skillMoves: 2 },
  { id: 'slv_livakovic', name: 'D. Livaković', fullName: 'Dominik Livaković', ovr: 79, pos: 'GK', nation: '🇭🇷 Kroasia', club: 'Fenerbahçe', tier: 'SILVER', pac: 78, sho: 76, pas: 72, dri: 80, def: 81, phy: 78, price: 10000, avatar: '🧤', weakFoot: 2, skillMoves: 1 },

  // === BRONZE TIER (60-69) ===
  { id: 'brz_hubner', name: 'J. Hubner', fullName: 'Justin Hubner', ovr: 68, pos: 'CB', nation: '🇮🇩 Indonesia', club: 'Garuda FC', tier: 'BRONZE', pac: 70, sho: 45, pas: 64, dri: 62, def: 72, phy: 76, price: 3500, avatar: '🦅', weakFoot: 3, skillMoves: 2 },
  { id: 'brz_marselino', name: 'Marselino', fullName: 'Marselino Ferdinan', ovr: 69, pos: 'CAM', nation: '🇮🇩 Indonesia', club: 'Garuda FC', tier: 'BRONZE', pac: 78, sho: 66, pas: 70, dri: 74, def: 48, phy: 62, price: 4000, avatar: '✨', weakFoot: 3, skillMoves: 4 },
  { id: 'brz_struick', name: 'R. Struick', fullName: 'Rafael Struick', ovr: 67, pos: 'ST', nation: '🇮🇩 Indonesia', club: 'Garuda FC', tier: 'BRONZE', pac: 77, sho: 67, pas: 60, dri: 70, def: 35, phy: 68, price: 3200, avatar: '⚽', weakFoot: 3, skillMoves: 3 },
  { id: 'brz_paes', name: 'M. Paes', fullName: 'Maarten Paes', ovr: 69, pos: 'GK', nation: '🇮🇩 Indonesia', club: 'Garuda FC', tier: 'BRONZE', pac: 68, sho: 66, pas: 70, dri: 68, def: 72, phy: 74, price: 4000, avatar: '🧤', weakFoot: 3, skillMoves: 1 }
];

function getPlayerById(id) {
  return MASTER_PLAYERS.find(p => p.id === id) || null;
}

const DEFAULT_STARTER_SQUAD = {
  formation: '4-3-3',
  startingXI: [
    { posKey: 'GK', playerId: 'brz_paes' },
    { posKey: 'LB', playerId: 'gld_theo' },
    { posKey: 'CB1', playerId: 'brz_hubner' },
    { posKey: 'CB2', playerId: 'slv_inacio' },
    { posKey: 'RB', playerId: 'gld_walker' },
    { posKey: 'CM1', playerId: 'gld_pedri' },
    { posKey: 'CM2', playerId: 'slv_hjulmand' },
    { posKey: 'CAM', playerId: 'brz_marselino' },
    { posKey: 'LW', playerId: 'slv_garnacho' },
    { posKey: 'ST', playerId: 'brz_struick' },
    { posKey: 'RW', playerId: 'elt_saka' }
  ],
  bench: ['slv_livakovic', 'slv_sesko', 'slv_simons'],
  reserves: ['gld_camavinga', 'gld_leao']
};

// ──────────────────────────────────────────────────────────────
// 2. FORMATIONS
// ──────────────────────────────────────────────────────────────
const FORMATIONS = {
  '4-3-3': {
    name: '4-3-3 Attack',
    slots: [
      { key: 'GK',  role: 'GK',  label: 'GK',  x: 0.50, y: 0.90 },
      { key: 'LB',  role: 'LB',  label: 'LB',  x: 0.15, y: 0.72 },
      { key: 'CB1', role: 'CB',  label: 'CB',  x: 0.38, y: 0.76 },
      { key: 'CB2', role: 'CB',  label: 'CB',  x: 0.62, y: 0.76 },
      { key: 'RB',  role: 'RB',  label: 'RB',  x: 0.85, y: 0.72 },
      { key: 'CM1', role: 'CM',  label: 'LCM', x: 0.28, y: 0.50 },
      { key: 'CAM', role: 'CAM', label: 'CAM', x: 0.50, y: 0.38 },
      { key: 'CM2', role: 'CM',  label: 'RCM', x: 0.72, y: 0.50 },
      { key: 'LW',  role: 'LW',  label: 'LW',  x: 0.18, y: 0.18 },
      { key: 'ST',  role: 'ST',  label: 'ST',  x: 0.50, y: 0.12 },
      { key: 'RW',  role: 'RW',  label: 'RW',  x: 0.82, y: 0.18 }
    ]
  },
  '4-4-2': {
    name: '4-4-2 Classic',
    slots: [
      { key: 'GK',  role: 'GK', label: 'GK',  x: 0.50, y: 0.90 },
      { key: 'LB',  role: 'LB', label: 'LB',  x: 0.15, y: 0.72 },
      { key: 'CB1', role: 'CB', label: 'CB',  x: 0.38, y: 0.76 },
      { key: 'CB2', role: 'CB', label: 'CB',  x: 0.62, y: 0.76 },
      { key: 'RB',  role: 'RB', label: 'RB',  x: 0.85, y: 0.72 },
      { key: 'LM',  role: 'LW', label: 'LM',  x: 0.16, y: 0.46 },
      { key: 'CM1', role: 'CM', label: 'LCM', x: 0.38, y: 0.50 },
      { key: 'CM2', role: 'CM', label: 'RCM', x: 0.62, y: 0.50 },
      { key: 'RM',  role: 'RW', label: 'RM',  x: 0.84, y: 0.46 },
      { key: 'ST1', role: 'ST', label: 'LST', x: 0.36, y: 0.15 },
      { key: 'ST2', role: 'ST', label: 'RST', x: 0.64, y: 0.15 }
    ]
  },
  '3-5-2': {
    name: '3-5-2 Midfield Control',
    slots: [
      { key: 'GK',  role: 'GK',  label: 'GK',  x: 0.50, y: 0.90 },
      { key: 'CB1', role: 'CB',  label: 'LCB', x: 0.25, y: 0.75 },
      { key: 'CB2', role: 'CB',  label: 'CB',  x: 0.50, y: 0.78 },
      { key: 'CB3', role: 'CB',  label: 'RCB', x: 0.75, y: 0.75 },
      { key: 'LWB', role: 'LB',  label: 'LM',  x: 0.12, y: 0.46 },
      { key: 'CDM', role: 'CDM', label: 'CDM', x: 0.50, y: 0.56 },
      { key: 'CM1', role: 'CM',  label: 'LCM', x: 0.32, y: 0.42 },
      { key: 'CM2', role: 'CM',  label: 'RCM', x: 0.68, y: 0.42 },
      { key: 'RWB', role: 'RB',  label: 'RM',  x: 0.88, y: 0.46 },
      { key: 'ST1', role: 'ST',  label: 'LST', x: 0.36, y: 0.15 },
      { key: 'ST2', role: 'ST',  label: 'RST', x: 0.64, y: 0.15 }
    ]
  },
  '4-2-3-1': {
    name: '4-2-3-1 Wide',
    slots: [
      { key: 'GK',  role: 'GK',  label: 'GK',  x: 0.50, y: 0.90 },
      { key: 'LB',  role: 'LB',  label: 'LB',  x: 0.15, y: 0.72 },
      { key: 'CB1', role: 'CB',  label: 'CB',  x: 0.38, y: 0.76 },
      { key: 'CB2', role: 'CB',  label: 'CB',  x: 0.62, y: 0.76 },
      { key: 'RB',  role: 'RB',  label: 'RB',  x: 0.85, y: 0.72 },
      { key: 'CDM1',role: 'CDM', label: 'LDM', x: 0.35, y: 0.56 },
      { key: 'CDM2',role: 'CDM', label: 'RDM', x: 0.65, y: 0.56 },
      { key: 'LAM', role: 'LW',  label: 'LAM', x: 0.20, y: 0.34 },
      { key: 'CAM', role: 'CAM', label: 'CAM', x: 0.50, y: 0.32 },
      { key: 'RAM', role: 'RW',  label: 'RAM', x: 0.80, y: 0.34 },
      { key: 'ST',  role: 'ST',  label: 'ST',  x: 0.50, y: 0.12 }
    ]
  }
};

const STORE_PACKS = [
  { id: 'pack_standard', name: 'Starter Pro Pack', tier: 'SILVER', costType: 'coins', cost: 5000, icon: '📦', desc: 'Berisi 1 pemain acak (Rating 65 - 84 OVR).', minOvr: 65, maxOvr: 84, color: '#38bdf8' },
  { id: 'pack_gold_elite', name: 'Gold Elite Pack', tier: 'GOLD', costType: 'coins', cost: 25000, icon: '✨', desc: 'Berisi 1 pemain bintang Gold / Elite (Rating 82 - 92 OVR).', minOvr: 82, maxOvr: 92, color: '#ffd700' },
  { id: 'pack_champions_icon', name: 'Prime ICON Champions', tier: 'ICON', costType: 'gems', cost: 400, icon: '👑', desc: 'Peluang tinggi mendapatkan Master & Prime ICON (92 - 100 OVR)!', minOvr: 92, maxOvr: 100, color: '#facc15' }
];

// ──────────────────────────────────────────────────────────────
// 3. 2D VECTOR MATH
// ──────────────────────────────────────────────────────────────
class Vector2 {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  set(x, y) { this.x = x; this.y = y; return this; }
  copy(v) { this.x = v.x; this.y = v.y; return this; }
  clone() { return new Vector2(this.x, this.y); }
  add(v) { this.x += v.x; this.y += v.y; return this; }
  sub(v) { this.x -= v.x; this.y -= v.y; return this; }
  scale(s) { this.x *= s; this.y *= s; return this; }
  magSq() { return this.x * this.x + this.y * this.y; }
  mag() { return Math.sqrt(this.magSq()); }
  normalize() {
    const m = this.mag();
    if (m > 0.00001) { this.x /= m; this.y /= m; } else { this.x = 0; this.y = 0; }
    return this;
  }
  dist(v) { const dx = this.x - v.x, dy = this.y - v.y; return Math.sqrt(dx * dx + dy * dy); }
  dot(v) { return this.x * v.x + this.y * v.y; }
}

// ──────────────────────────────────────────────────────────────
// 4. AUDIO SYNTHESIZER
// ──────────────────────────────────────────────────────────────
class AudioEngine {
  constructor() { this.ctx = null; this.isMuted = false; }
  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    } catch(e) {}
  }
  toggleMute() { this.isMuted = !this.isMuted; return this.isMuted; }
  playWhistle(isDouble = false) {
    if (this.isMuted) return; this.init(); if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const playBurst = (st, dur) => {
      try {
        const osc = this.ctx.createOscillator(), gain = this.ctx.createGain(), mod = this.ctx.createOscillator(), mg = this.ctx.createGain();
        osc.type = 'triangle'; osc.frequency.setValueAtTime(2800, st); osc.frequency.exponentialRampToValueAtTime(3200, st + dur * 0.5);
        mod.type = 'sine'; mod.frequency.setValueAtTime(45, st); mg.gain.setValueAtTime(400, st); mod.connect(osc.frequency);
        gain.gain.setValueAtTime(0, st); gain.gain.linearRampToValueAtTime(0.18, st + 0.02); gain.gain.exponentialRampToValueAtTime(0.001, st + dur);
        osc.connect(gain); gain.connect(this.ctx.destination);
        mod.start(st); osc.start(st); mod.stop(st + dur); osc.stop(st + dur);
      } catch(e) {}
    };
    playBurst(now, 0.35);
    if (isDouble) playBurst(now + 0.22, 0.45);
  }
  playKick(power = 1.0) {
    if (this.isMuted) return; this.init(); if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime, osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(160 + power * 50, now); osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      gain.gain.setValueAtTime(Math.min(0.3, 0.1 + power * 0.15), now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.15);
    } catch(e) {}
  }
  playNetHit() {
    if (this.isMuted) return; this.init(); if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime, osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(120, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
      gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.25);
    } catch(e) {}
  }
  playGoalCheer() {
    if (this.isMuted) return; this.init(); if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523, 659, 784, 1046].forEach((f, i) => {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(f, now + i * 0.08);
        g.gain.setValueAtTime(0.1, now + i * 0.08); g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.5);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(now + i * 0.08); o.stop(now + i * 0.08 + 0.55);
      });
    } catch(e) {}
  }
  playPackReveal(isIcon = false) {
    if (this.isMuted) return; this.init(); if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime, count = isIcon ? 8 : 5;
      for (let i = 0; i < count; i++) {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(440 * Math.pow(1.2, i), now + i * 0.06);
        g.gain.setValueAtTime(0.12, now + i * 0.06); g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(now + i * 0.06); o.stop(now + i * 0.06 + 0.4);
      }
    } catch(e) {}
  }
  playClick() {
    if (this.isMuted) return; this.init(); if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime, osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.05);
    } catch(e) {}
  }
  playTackle() {
    if (this.isMuted) return; this.init(); if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime, osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now); osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
      gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + 0.14);
    } catch(e) {}
  }
}

// ──────────────────────────────────────────────────────────────
// 5. BALL & PHYSICS
// ──────────────────────────────────────────────────────────────
class Ball {
  constructor(x, y) {
    this.pos = new Vector2(x, y);
    this.vel = new Vector2(0, 0);
    this.z = 0; this.zVel = 0;
    this.radius = 6; this.friction = 0.982;
    this.airResistance = 0.99; this.gravity = 0.45;
    this.owner = null; this.lastTouch = null;
    this.trail = [];
  }
  reset(x, y) {
    this.pos.set(x, y); this.vel.set(0, 0);
    this.z = 0; this.zVel = 0;
    this.owner = null; this.trail = [];
  }
  kick(dir, power, loft = 0, kicker = null) {
    this.owner = null;
    this.vel = dir.clone().normalize().scale(power);
    this.zVel = loft;
    if (kicker) this.lastTouch = kicker.team;
  }
  update(pitch) {
    if (this.vel.magSq() > 4 || this.z > 2) {
      this.trail.push({ x: this.pos.x, y: this.pos.y, z: this.z, alpha: 1.0 });
      if (this.trail.length > 10) this.trail.shift();
    } else if (this.trail.length > 0) {
      this.trail.shift();
    }
    this.trail.forEach(t => t.alpha *= 0.82);

    if (this.owner) {
      const fwd = this.owner.facing.clone().normalize().scale(12);
      this.pos.copy(this.owner.pos).add(fwd);
      this.vel.copy(this.owner.vel);
      this.z = 0; this.zVel = 0;
      return;
    }

    this.pos.add(this.vel);
    this.vel.scale(this.z > 0.5 ? this.airResistance : this.friction);

    if (this.z > 0 || this.zVel !== 0) {
      this.z += this.zVel;
      this.zVel -= this.gravity;
      if (this.z <= 0) {
        this.z = 0;
        this.zVel = -this.zVel * 0.5;
        if (Math.abs(this.zVel) < 0.4) this.zVel = 0;
      }
    }

    // Boundary bounces
    const { left, right, top, bottom, goalTop, goalBottom } = pitch;
    const inGoalY = this.pos.y >= goalTop && this.pos.y <= goalBottom;

    if (this.pos.x < left) {
      if (!inGoalY) { this.pos.x = left; this.vel.x = -this.vel.x * 0.6; }
      else if (this.pos.x < left - 35) { this.pos.x = left - 35; this.vel.x = -this.vel.x * 0.2; }
    }
    if (this.pos.x > right) {
      if (!inGoalY) { this.pos.x = right; this.vel.x = -this.vel.x * 0.6; }
      else if (this.pos.x > right + 35) { this.pos.x = right + 35; this.vel.x = -this.vel.x * 0.2; }
    }
    if (this.pos.y < top) { this.pos.y = top; this.vel.y = -this.vel.y * 0.6; }
    if (this.pos.y > bottom) { this.pos.y = bottom; this.vel.y = -this.vel.y * 0.6; }
  }
}

// ──────────────────────────────────────────────────────────────
// 6. MATCH PLAYERS & TACTICAL AI
// ──────────────────────────────────────────────────────────────
class MatchPlayer {
  constructor(data, team, isControlled = false) {
    this.id = data.id; this.name = data.name; this.role = data.pos || 'CM';
    this.stats = { pac: data.pac || 75, sho: data.sho || 70, pas: data.pas || 70, dri: data.dri || 75, def: data.def || 60, phy: data.phy || 70, ovr: data.ovr || 75 };
    this.team = team; this.isControlled = isControlled;
    this.pos = new Vector2(0, 0); this.vel = new Vector2(0, 0);
    this.facing = new Vector2(team === 'home' ? 1 : -1, 0);
    this.basePos = new Vector2(0, 0);
    this.radius = 12; this.isTackling = false;
    this.tackleCooldown = 0; this.passCooldown = 0;
    this.avatar = data.avatar || '⚽';
  }
  getSpeed() {
    const base = 1.6 + (this.stats.pac / 100) * 1.5;
    return this.isTackling ? base * 1.5 : base;
  }
  updateCooldowns() {
    if (this.tackleCooldown > 0) this.tackleCooldown--;
    if (this.passCooldown > 0) this.passCooldown--;
  }
}

class AIController {
  constructor(match) { this.match = match; }

  updatePlayerAI(p, ball, pitch) {
    p.updateCooldowns();
    if (p.isControlled && p.team === 'home') return;

    const isHome = p.team === 'home';
    const opponentGoalX = isHome ? pitch.right : pitch.left;
    const ownGoalX = isHome ? pitch.left : pitch.right;
    const goalCenterY = (pitch.top + pitch.bottom) / 2;
    const distToBall = p.pos.dist(ball.pos);

    // 1. Goalkeeper
    if (p.role === 'GK') {
      const targetX = isHome ? ownGoalX + 35 : ownGoalX - 35;
      const clampedY = Math.max(pitch.goalTop + 10, Math.min(pitch.goalBottom - 10, ball.pos.y));
      const target = new Vector2(targetX, clampedY);
      const moveDir = target.sub(p.pos);
      if (moveDir.mag() > 3) {
        p.vel = moveDir.normalize().scale(p.getSpeed() * 0.9);
        p.pos.add(p.vel);
        p.facing.copy(ball.pos).sub(p.pos).normalize();
      } else { p.vel.set(0, 0); }

      if (distToBall < p.radius + ball.radius + 10 && (!ball.owner || ball.owner.team !== p.team)) {
        ball.owner = p;
        this.match.audio.playTackle();
        setTimeout(() => {
          if (ball.owner === p) {
            const clearDir = new Vector2(isHome ? 1 : -1, (Math.random() - 0.5) * 0.5);
            this.match.passBall(p, clearDir, 14, 6);
          }
        }, 450);
      }
      return;
    }

    // 2. In possession
    if (ball.owner === p) {
      const goalTarget = new Vector2(opponentGoalX, goalCenterY);
      const distToGoal = p.pos.dist(goalTarget);
      p.facing = goalTarget.clone().sub(p.pos).normalize();

      if (distToGoal < 220) {
        const shootTarget = new Vector2(opponentGoalX, (Math.random() > 0.5 ? pitch.goalTop + 15 : pitch.goalBottom - 15));
        const shootDir = shootTarget.sub(p.pos).normalize();
        this.match.shootBall(p, shootDir, 16 + (p.stats.sho / 100) * 8);
        return;
      }

      if (p.passCooldown <= 0 && Math.random() < 0.04) {
        const teammates = (isHome ? this.match.homePlayers : this.match.awayPlayers).filter(t => t !== p && t.role !== 'GK');
        const forwardTeammates = teammates.filter(t => isHome ? t.pos.x > p.pos.x + 30 : t.pos.x < p.pos.x - 30);
        if (forwardTeammates.length > 0) {
          const target = forwardTeammates[Math.floor(Math.random() * forwardTeammates.length)];
          const passDir = target.pos.clone().sub(p.pos).normalize();
          this.match.passBall(p, passDir, 13 + (p.stats.pas / 100) * 5, 0);
          p.passCooldown = 60;
          return;
        }
      }

      const dribbleDir = new Vector2(isHome ? 1 : -1, (Math.random() - 0.5) * 0.4).normalize();
      p.vel = dribbleDir.scale(p.getSpeed() * 0.85);
      p.pos.add(p.vel);
      return;
    }

    // 3. Off possession
    const closest = this.match.getClosestPlayerToBall(p.team);
    if (closest === p && distToBall < 250) {
      const dir = ball.pos.clone().sub(p.pos);
      if (dir.mag() > 8) {
        p.vel = dir.normalize().scale(p.getSpeed() * 1.1);
        p.pos.add(p.vel);
        p.facing.copy(p.vel).normalize();
      }

      if (distToBall < p.radius + ball.radius + 8 && p.tackleCooldown <= 0) {
        p.tackleCooldown = 60;
        this.match.audio.playTackle();
        if (Math.random() < 0.65) {
          ball.owner = p;
        }
      }
      return;
    }

    // Maintain position
    const target = p.basePos.clone();
    const dir = target.sub(p.pos);
    if (dir.mag() > 10) {
      p.vel = dir.normalize().scale(p.getSpeed() * 0.85);
      p.pos.add(p.vel);
      p.facing.copy(p.vel).normalize();
    } else { p.vel.set(0, 0); }
  }
}

// ──────────────────────────────────────────────────────────────
// 7. MATCH ENGINE (11v11)
// ──────────────────────────────────────────────────────────────
class MatchEngine {
  constructor(audio) {
    this.audio = audio;
    this.ai = new AIController(this);
    this.pitch = { width: 1000, height: 620, left: 60, right: 940, top: 50, bottom: 570, goalTop: 260, goalBottom: 360, center: new Vector2(500, 310) };
    this.ball = new Ball(500, 310);
    this.homePlayers = []; this.awayPlayers = [];
    this.controlledPlayer = null;
    this.state = 'KICKOFF';
    this.score = { home: 0, away: 0 };
    this.matchMinute = 0; this.half = 1; this.matchTimer = 0;
    this.goalCelebrationTimer = 0; this.kickoffTimer = 0; this.halftimeTimer = 0;
    this.lastScorer = null;
    this.commentary = 'Kick-off pertandingan segera dimulai!';
    this.input = { moveDir: new Vector2(0, 0), sprint: false, shootCharging: false, shootPower: 0 };
    this.particles = [];
    this.onMatchEndCallback = null;
  }

  startMatch(homeSquadData, awayPreset = null, onMatchEnd = null) {
    this.onMatchEndCallback = onMatchEnd;
    this.score = { home: 0, away: 0 };
    this.matchMinute = 0; this.half = 1; this.matchTimer = 0;
    this.state = 'KICKOFF'; this.kickoffTimer = 0;
    this.commentary = 'Kick-off Babak Pertama dimulai!';

    this.setupHomeTeam(homeSquadData);
    this.setupAwayTeam();
    this.resetForKickoff('home');
    this.audio.playWhistle(false);
  }

  setupHomeTeam(squadData) {
    this.homePlayers = [];
    const formDef = FORMATIONS[squadData.formation || '4-3-3'] || FORMATIONS['4-3-3'];
    const pitchW = this.pitch.right - this.pitch.left, pitchH = this.pitch.bottom - this.pitch.top;

    formDef.slots.forEach(slot => {
      const matchSlot = squadData.startingXI.find(s => s.posKey === slot.key);
      const pData = matchSlot ? getPlayerById(matchSlot.playerId) : null;
      const playerInfo = pData || { id: 'home_' + slot.key, name: slot.label, pos: slot.role, ovr: 75, pac: 75, sho: 70, pas: 72, dri: 74, def: 65, phy: 70, avatar: '⚽' };

      const player = new MatchPlayer(playerInfo, 'home', false);
      player.basePos.set(this.pitch.left + (1 - slot.y) * (pitchW * 0.45), this.pitch.top + slot.x * pitchH);
      player.pos.copy(player.basePos);
      this.homePlayers.push(player);
    });

    const striker = this.homePlayers.find(p => p.role === 'ST') || this.homePlayers[this.homePlayers.length - 1];
    this.setControlledPlayer(striker);
  }

  setupAwayTeam() {
    this.awayPlayers = [];
    const formDef = FORMATIONS['4-3-3'];
    const pool = MASTER_PLAYERS.filter(p => p.tier !== 'BRONZE');
    const pitchW = this.pitch.right - this.pitch.left, pitchH = this.pitch.bottom - this.pitch.top;

    formDef.slots.forEach((slot, idx) => {
      const pData = pool[idx % pool.length];
      const player = new MatchPlayer(pData, 'away', false);
      player.basePos.set(this.pitch.right - (1 - slot.y) * (pitchW * 0.45), this.pitch.top + (1 - slot.x) * pitchH);
      player.pos.copy(player.basePos);
      player.facing.set(-1, 0);
      this.awayPlayers.push(player);
    });
  }

  setControlledPlayer(p) {
    if (this.controlledPlayer) this.controlledPlayer.isControlled = false;
    this.controlledPlayer = p;
    if (p) p.isControlled = true;
  }

  resetForKickoff(team = 'home') {
    this.state = 'KICKOFF'; this.kickoffTimer = 0;
    this.ball.reset(this.pitch.center.x, this.pitch.center.y);
    this.homePlayers.forEach(p => { p.pos.copy(p.basePos); p.vel.set(0, 0); p.facing.set(1, 0); });
    this.awayPlayers.forEach(p => { p.pos.copy(p.basePos); p.vel.set(0, 0); p.facing.set(-1, 0); });

    if (team === 'home') {
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
    if (this.state === 'KICKOFF') {
      this.kickoffTimer += dt;
      if (this.kickoffTimer > 1.2) this.state = 'PLAYING';
    }

    if (this.state === 'HALFTIME') {
      this.halftimeTimer += dt;
      if (this.halftimeTimer > 2.5) {
        this.half = 2; this.halftimeTimer = 0;
        this.resetForKickoff('away');
        this.state = 'PLAYING';
        this.commentary = 'Babak Kedua dimulai!';
        this.audio.playWhistle(false);
      }
      return;
    }

    if (this.state === 'PLAYING') {
      this.matchTimer += dt;
      this.matchMinute = Math.min(90, Math.floor((this.matchTimer / 120) * 90));

      if (this.matchMinute >= 45 && this.half === 1) {
        this.state = 'HALFTIME'; this.halftimeTimer = 0;
        this.commentary = 'Peluit babak pertama berbunyi! Istirahat babak pertama.';
        this.audio.playWhistle(true);
        return;
      }

      if (this.matchMinute >= 90) {
        this.state = 'FULLTIME';
        this.commentary = `Pertandingan Selesai! Skor: ${this.score.home} - ${this.score.away}`;
        this.audio.playWhistle(true);
        if (this.onMatchEndCallback) {
          const res = this.score.home > this.score.away ? 'WIN' : this.score.home === this.score.away ? 'DRAW' : 'LOSS';
          const coinsEarned = res === 'WIN' ? 5000 : res === 'DRAW' ? 2500 : 1200;
          const gemsEarned = res === 'WIN' ? 50 : 15;
          this.onMatchEndCallback({ result: res, score: this.score, coinsEarned, gemsEarned });
        }
        return;
      }
    }

    if (this.state === 'GOAL') {
      this.goalCelebrationTimer -= dt;
      this.updateParticles(dt);
      if (this.goalCelebrationTimer <= 0) {
        this.resetForKickoff(this.lastScorer === 'home' ? 'away' : 'home');
        this.state = 'PLAYING';
      }
      return;
    }

    // User Movement
    if (this.controlledPlayer) {
      const p = this.controlledPlayer;
      p.updateCooldowns();
      if (this.input.moveDir.magSq() > 0.05) {
        p.vel = this.input.moveDir.clone().normalize().scale(p.getSpeed() * (this.input.sprint ? 1.35 : 1.0));
        p.pos.add(p.vel);
        p.facing.copy(this.input.moveDir).normalize();
        if (this.state === 'KICKOFF') this.state = 'PLAYING';
      } else { p.vel.scale(0.8); }

      if (this.input.shootCharging) this.input.shootPower = Math.min(100, this.input.shootPower + dt * 140);
      p.pos.x = Math.max(this.pitch.left + 5, Math.min(this.pitch.right - 5, p.pos.x));
      p.pos.y = Math.max(this.pitch.top + 5, Math.min(this.pitch.bottom - 5, p.pos.y));
    }

    this.ball.update(this.pitch);
    this.homePlayers.forEach(p => this.ai.updatePlayerAI(p, this.ball, this.pitch));
    this.awayPlayers.forEach(p => this.ai.updatePlayerAI(p, this.ball, this.pitch));

    // Possession check
    if (!this.ball.owner) {
      const all = [...this.homePlayers, ...this.awayPlayers];
      for (const p of all) {
        if (p.pos.dist(this.ball.pos) < p.radius + this.ball.radius + 4 && this.ball.z < 8) {
          this.ball.owner = p;
          this.ball.vel.set(0, 0);
          if (p.team === 'home') this.setControlledPlayer(p);
          break;
        }
      }
    }

    // Goal check
    const { left, right, goalTop, goalBottom } = this.pitch, b = this.ball;
    if (b.pos.x > right && b.pos.y >= goalTop && b.pos.y <= goalBottom) {
      this.score.home++; this.lastScorer = 'home'; this.state = 'GOAL'; this.goalCelebrationTimer = 3.0;
      this.commentary = `⚽ GOOOOL! Skor ${this.score.home} - ${this.score.away}`;
      this.audio.playNetHit(); this.audio.playGoalCheer();
      this.createGoalConfetti(b.pos);
      return;
    }
    if (b.pos.x < left && b.pos.y >= goalTop && b.pos.y <= goalBottom) {
      this.score.away++; this.lastScorer = 'away'; this.state = 'GOAL'; this.goalCelebrationTimer = 3.0;
      this.commentary = `⚽ GOL Lawan! Skor ${this.score.home} - ${this.score.away}`;
      this.audio.playNetHit();
      this.createGoalConfetti(b.pos);
      return;
    }

    // Auto switch defender
    if (this.ball.owner && this.ball.owner.team === 'away') {
      const closest = this.getClosestPlayerToBall('home');
      if (closest && closest.role !== 'GK' && closest !== this.controlledPlayer) {
        if (closest.pos.dist(this.ball.pos) < this.controlledPlayer.pos.dist(this.ball.pos) - 70) {
          this.setControlledPlayer(closest);
        }
      }
    }

    this.updateParticles(dt);
  }

  triggerPass() {
    if (this.state === 'KICKOFF') this.state = 'PLAYING';
    const p = this.controlledPlayer;
    if (!p) return;

    if (this.ball.owner === p) {
      const teammates = this.homePlayers.filter(t => t !== p && t.role !== 'GK');
      let best = null, maxDot = 0.2;
      teammates.forEach(t => {
        const dot = p.facing.dot(t.pos.clone().sub(p.pos).normalize());
        if (dot > maxDot) { maxDot = dot; best = t; }
      });
      const dir = best ? best.pos.clone().sub(p.pos).normalize() : p.facing.clone();
      this.passBall(p, dir, 13 + (p.stats.pas / 100) * 6, 0);
      if (best) this.setControlledPlayer(best);
    }
  }

  triggerShootStart() {
    if (this.state === 'KICKOFF') this.state = 'PLAYING';
    this.input.shootCharging = true;
    this.input.shootPower = 0;
  }

  triggerShootRelease() {
    if (!this.input.shootCharging) return;
    this.input.shootCharging = false;
    const p = this.controlledPlayer;
    if (!p || this.ball.owner !== p) return;

    const isPowerShot = (this.input.shootPower / 100) > 0.85;
    const targetY = ((this.pitch.top + this.pitch.bottom) / 2) + (p.facing.y * 65);
    const shootDir = new Vector2(this.pitch.right, targetY).sub(p.pos).normalize();

    this.shootBall(p, shootDir, 16 + (p.stats.sho / 100) * 9, isPowerShot ? 3.0 : 1.0);
    this.commentary = isPowerShot ? `🔥 POWER SHOT dari ${p.name}!` : `Tendangan terarah oleh ${p.name}!`;
    this.input.shootPower = 0;
  }

  triggerTackleOrSwitch() {
    if (this.state === 'KICKOFF') this.state = 'PLAYING';
    const p = this.controlledPlayer;
    if (!p) return;

    if (this.ball.owner === p) {
      p.vel.scale(1.4); // sprint touch
      return;
    }

    if (p.tackleCooldown <= 0) {
      p.tackleCooldown = 50;
      this.audio.playTackle();
      if (p.pos.dist(this.ball.pos) < p.radius + this.ball.radius + 12) {
        this.ball.owner = p;
        this.commentary = `Tackle bersih oleh ${p.name}!`;
      }
    } else {
      const defenders = this.homePlayers.filter(pl => pl !== this.controlledPlayer && pl.role !== 'GK');
      let closest = null, minD = Infinity;
      defenders.forEach(pl => {
        const d = pl.pos.dist(this.ball.pos);
        if (d < minD) { minD = d; closest = pl; }
      });
      if (closest) this.setControlledPlayer(closest);
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

  getClosestPlayerToBall(team) {
    const players = team === 'home' ? this.homePlayers : this.awayPlayers;
    let closest = null, minDist = Infinity;
    players.forEach(p => {
      const d = p.pos.dist(this.ball.pos);
      if (d < minDist) { minDist = d; closest = p; }
    });
    return closest;
  }

  createKickParticles(pos, color) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({ pos: pos.clone(), vel: new Vector2((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4), color, size: 3, alpha: 1.0, life: 0.3 });
    }
  }

  createGoalConfetti(pos) {
    const colors = ['#ffd700', '#00ff88', '#38bdf8', '#ff007f', '#ffffff'];
    for (let i = 0; i < 50; i++) {
      this.particles.push({ pos: pos.clone(), vel: new Vector2((Math.random() - 0.5) * 12, (Math.random() - 0.8) * 14), color: colors[Math.floor(Math.random() * colors.length)], size: 4, alpha: 1.0, life: 2.0 });
    }
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.pos.add(p.vel);
      p.vel.y += 0.2;
      p.alpha -= dt / p.life;
      if (p.alpha <= 0) this.particles.splice(i, 1);
    }
  }
}

// ──────────────────────────────────────────────────────────────
// 8. MATCH RENDERER
// ──────────────────────────────────────────────────────────────
class MatchRenderer {
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

    // 1. Pitch & Stripes
    ctx.fillStyle = '#0b1626';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#1e7b34';
    ctx.fillRect(pitch.left, pitch.top, pitch.right - pitch.left, pitch.bottom - pitch.top);

    const stripes = 14, sH = (pitch.bottom - pitch.top) / stripes;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
      ctx.fillRect(pitch.left, pitch.top + i * sH, pitch.right - pitch.left, sH);
    }

    // Pitch Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(pitch.left, pitch.top, pitch.right - pitch.left, pitch.bottom - pitch.top);

    const midX = (pitch.left + pitch.right) / 2, midY = (pitch.top + pitch.bottom) / 2;
    ctx.beginPath(); ctx.moveTo(midX, pitch.top); ctx.lineTo(midX, pitch.bottom); ctx.stroke();
    ctx.beginPath(); ctx.arc(midX, midY, 65, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(midX, midY, 3.5, 0, Math.PI * 2); ctx.fill();

    // Penalty Boxes
    ctx.strokeRect(pitch.left, midY - 110, 120, 220);
    ctx.strokeRect(pitch.right - 120, midY - 110, 120, 220);

    // Goal Nets
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(pitch.left - 30, pitch.goalTop, 30, pitch.goalBottom - pitch.goalTop);
    ctx.strokeRect(pitch.left - 30, pitch.goalTop, 30, pitch.goalBottom - pitch.goalTop);
    ctx.fillRect(pitch.right, pitch.goalTop, 30, pitch.goalBottom - pitch.goalTop);
    ctx.strokeRect(pitch.right, pitch.goalTop, 30, pitch.goalBottom - pitch.goalTop);

    // Particles
    match.particles.forEach(p => {
      ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.beginPath(); ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Ball Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(ball.pos.x, ball.pos.y + 2, ball.radius * Math.max(0.3, 1 - ball.z / 60), 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Players
    const all = [...homePlayers, ...awayPlayers].sort((a, b) => a.pos.y - b.pos.y);
    all.forEach(p => {
      const { x, y } = p.pos;
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath(); ctx.ellipse(x, y + 8, p.radius * 0.9, 4, 0, 0, Math.PI * 2); ctx.fill();

      if (p === controlledPlayer) {
        ctx.strokeStyle = '#00f0ff'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(x, y + 2, p.radius + 6, 0, Math.PI * 2); ctx.stroke();
        const bob = Math.sin(this.animTime * 8) * 3;
        ctx.fillStyle = '#00f0ff';
        ctx.beginPath(); ctx.moveTo(x, y - 24 + bob); ctx.lineTo(x - 6, y - 32 + bob); ctx.lineTo(x + 6, y - 32 + bob); ctx.closePath(); ctx.fill();
      }

      ctx.save(); ctx.translate(x, y);
      const isH = p.team === 'home';
      ctx.fillStyle = isH ? (p.role === 'GK' ? '#f59e0b' : '#0284c7') : (p.role === 'GK' ? '#8b5cf6' : '#e11d48');
      ctx.strokeStyle = isH ? '#38bdf8' : '#fb7185'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, p.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(p.facing.x * 6, p.facing.y * 6); ctx.lineTo(p.facing.x * (p.radius + 3), p.facing.y * (p.radius + 3)); ctx.stroke();

      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(p.role === 'GK' ? '🧤' : p.role, 0, 0);
      ctx.restore();

      ctx.fillStyle = 'rgba(15,23,42,0.8)';
      const nw = ctx.measureText(p.name).width + 8;
      ctx.fillRect(x - nw / 2, y + 14, nw, 12);
      ctx.fillStyle = p === controlledPlayer ? '#00f0ff' : '#fff';
      ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(p.name, x, y + 20);
    });

    // Ball
    ball.trail.forEach(t => {
      ctx.fillStyle = `rgba(255,255,255,${t.alpha * 0.3})`;
      ctx.beginPath(); ctx.arc(t.x, t.y - t.z, ball.radius * 0.7, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#222'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(ball.pos.x, ball.pos.y - ball.z, ball.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(ball.pos.x, ball.pos.y - ball.z, ball.radius * 0.4, 0, Math.PI * 2); ctx.fill();

    // Power Shot Bar
    if (controlledPlayer && match.input.shootCharging) {
      const bx = controlledPlayer.pos.x - 24, by = controlledPlayer.pos.y - 36, f = match.input.shootPower / 100;
      ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(bx, by, 48, 6);
      ctx.fillStyle = f > 0.8 ? '#ff0055' : f > 0.5 ? '#ffd700' : '#00ff88'; ctx.fillRect(bx, by, 48 * f, 6);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, 48, 6);
    }

    // 2D Radar
    const rx = this.canvas.width - 150, ry = 14, rw = 136, rh = 84;
    ctx.fillStyle = 'rgba(15,23,42,0.85)'; ctx.strokeStyle = 'rgba(56,189,248,0.4)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(rx, ry, rw, rh, 6); ctx.fill(); ctx.stroke();
    const sx = rw / (pitch.right - pitch.left), sy = rh / (pitch.bottom - pitch.top);
    ctx.fillStyle = '#00f0ff'; homePlayers.forEach(p => { ctx.beginPath(); ctx.arc(rx + (p.pos.x - pitch.left) * sx, ry + (p.pos.y - pitch.top) * sy, p.isControlled ? 3.5 : 2.2, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#ff4081'; awayPlayers.forEach(p => { ctx.beginPath(); ctx.arc(rx + (p.pos.x - pitch.left) * sx, ry + (p.pos.y - pitch.top) * sy, 2.2, 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.arc(rx + (ball.pos.x - pitch.left) * sx, ry + (ball.pos.y - pitch.top) * sy, 3, 0, Math.PI * 2); ctx.fill();

    // Banners
    if (state === 'GOAL') {
      const cx = this.canvas.width / 2, cy = this.canvas.height / 2;
      ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, cy - 50, this.canvas.width, 100);
      ctx.fillStyle = match.lastScorer === 'home' ? '#00ff88' : '#ff4081';
      ctx.font = '900 44px "Orbitron", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('⚽ GOOOAAAL! ⚽', cx, cy - 6);
    } else if (state === 'KICKOFF') {
      const cx = this.canvas.width / 2, cy = this.canvas.height / 2 + 130;
      ctx.fillStyle = 'rgba(15,23,42,0.85)'; ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(cx - 180, cy - 18, 360, 36, 18); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#00ff88'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('⚽ SENTUH LAYAR / TEKAN WASD UNTUK KICK-OFF', cx, cy);
    } else if (state === 'HALFTIME') {
      const cx = this.canvas.width / 2, cy = this.canvas.height / 2;
      ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(0, cy - 60, this.canvas.width, 120);
      ctx.fillStyle = '#ffd700'; ctx.font = '900 32px "Orbitron", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('⏸️ HALF-TIME', cx, cy - 12);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 16px sans-serif'; ctx.fillText(`SKOR: ${score.home} - ${score.away} • Babak 2 segera dimulai...`, cx, cy + 24);
    }
  }
}

// ──────────────────────────────────────────────────────────────
// 9. SQUAD & MARKET MANAGERS
// ──────────────────────────────────────────────────────────────
class SquadManager {
  constructor(appData) { this.data = appData; this.squad = appData.squad; }
  getFormation() { return this.squad.formation || '4-3-3'; }
  setFormation(fKey) {
    if (!FORMATIONS[fKey]) return;
    const oldSlots = this.squad.startingXI, formDef = FORMATIONS[fKey], newXI = [], used = new Set();
    formDef.slots.forEach(slot => {
      let match = oldSlots.find(s => !used.has(s.playerId) && getPlayerById(s.playerId)?.pos === slot.role) || oldSlots.find(s => !used.has(s.playerId));
      const pId = match ? match.playerId : this.data.ownedPlayerIds[0];
      used.add(pId);
      newXI.push({ posKey: slot.key, playerId: pId });
    });
    this.squad.formation = fKey; this.squad.startingXI = newXI;
  }
  swapStartingWithBench(slotKey, bIdx) {
    const slot = this.squad.startingXI.find(s => s.posKey === slotKey);
    if (!slot || bIdx < 0 || bIdx >= this.squad.bench.length) return;
    const old = slot.playerId;
    slot.playerId = this.squad.bench[bIdx];
    this.squad.bench[bIdx] = old;
  }
  swapTwoStartingSlots(keyA, keyB) {
    const sA = this.squad.startingXI.find(s => s.posKey === keyA), sB = this.squad.startingXI.find(s => s.posKey === keyB);
    if (!sA || !sB) return;
    const tmp = sA.playerId; sA.playerId = sB.playerId; sB.playerId = tmp;
  }
  substituteFromReserves(rId, slotKey) {
    const slot = this.squad.startingXI.find(s => s.posKey === slotKey);
    if (!slot) return;
    const old = slot.playerId; slot.playerId = rId;
    const idx = this.squad.reserves.indexOf(rId);
    if (idx !== -1) this.squad.reserves[idx] = old;
  }
  calculateTeamStats() {
    const formDef = FORMATIONS[this.getFormation()];
    let totalOvr = 0, chem = 0, players = [];
    this.squad.startingXI.forEach(slot => {
      const p = getPlayerById(slot.playerId), sDef = formDef?.slots.find(s => s.key === slot.posKey);
      if (p) {
        players.push(p);
        let effOvr = p.ovr;
        if (sDef && sDef.role !== p.pos) effOvr -= (p.pos === 'GK' || sDef.role === 'GK') ? 15 : 4;
        totalOvr += effOvr;
        if (sDef && sDef.role === p.pos) chem += 4;
      }
    });
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        if (players[i].nation === players[j].nation) chem += 2;
        if (players[i].club === players[j].club) chem += 3;
      }
    }
    return { teamOvr: Math.round(totalOvr / Math.max(1, this.squad.startingXI.length)), chemistry: Math.min(100, Math.max(20, chem)) };
  }
}

class MarketStore {
  constructor(appData, audio) { this.data = appData; this.audio = audio; }
  getMarketListings(q = '', pos = 'ALL', tier = 'ALL') {
    return MASTER_PLAYERS.filter(p => {
      const matchQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.fullName.toLowerCase().includes(q.toLowerCase()) || p.club.toLowerCase().includes(q.toLowerCase());
      const matchP = pos === 'ALL' || p.pos === pos;
      const matchT = tier === 'ALL' || p.tier === tier;
      return matchQ && matchP && matchT;
    }).sort((a, b) => b.ovr - a.ovr);
  }
  buyPlayer(pId) {
    const p = getPlayerById(pId);
    if (!p) return { success: false, message: 'Pemain tidak ditemukan!' };
    if (this.data.ownedPlayerIds.includes(pId)) return { success: false, message: 'Anda sudah memiliki pemain ini!' };
    if (this.data.coins < p.price) return { success: false, message: 'Koin tidak mencukupi!' };
    this.data.coins -= p.price; this.data.ownedPlayerIds.push(pId); this.data.squad.reserves.push(pId);
    this.audio.playPackReveal(p.tier === 'ICON');
    return { success: true, message: `Berhasil merekrut ${p.name} (${p.ovr} OVR)!`, player: p };
  }
  openPack(packId) {
    const pack = STORE_PACKS.find(p => p.id === packId);
    if (!pack) return { success: false, message: 'Paket tidak ditemukan!' };
    if (pack.costType === 'coins') {
      if (this.data.coins < pack.cost) return { success: false, message: 'Koin tidak cukup!' };
      this.data.coins -= pack.cost;
    } else {
      if (this.data.gems < pack.cost) return { success: false, message: 'Gems tidak cukup!' };
      this.data.gems -= pack.cost;
    }
    const cand = MASTER_PLAYERS.filter(p => p.ovr >= pack.minOvr && p.ovr <= pack.maxOvr);
    const chosen = cand[Math.floor(Math.random() * cand.length)] || cand[0];
    const isDup = this.data.ownedPlayerIds.includes(chosen.id);
    if (!isDup) { this.data.ownedPlayerIds.push(chosen.id); this.data.squad.reserves.push(chosen.id); }
    else { this.data.coins += Math.floor(chosen.price * 0.3); }
    this.audio.playPackReveal(chosen.tier === 'ICON' || chosen.ovr >= 93);
    return { success: true, player: chosen, isDuplicate: isDup };
  }
}

// ──────────────────────────────────────────────────────────────
// 10. MAIN APP CONTROLLER
// ──────────────────────────────────────────────────────────────
class App {
  constructor() {
    this.loadSaveData();
    this.audio = new AudioEngine();
    this.squadManager = new SquadManager(this.data);
    this.marketStore = new MarketStore(this.data, this.audio);
    this.matchEngine = new MatchEngine(this.audio);

    this.activeView = 'home';
    this.matchCanvas = document.getElementById('match-canvas');
    this.matchRenderer = new MatchRenderer(this.matchCanvas);
    this.selectedPitchSlot = null;
    this.isMatchRunning = false;
    this.lastTime = 0;
    this.keys = {};
  }

  loadSaveData() {
    try {
      const raw = localStorage.getItem('fc_champions_save_v1');
      if (raw) {
        this.data = JSON.parse(raw);
        return;
      }
    } catch(e) {}
    this.data = {
      coins: 25000, gems: 500,
      squad: JSON.parse(JSON.stringify(DEFAULT_STARTER_SQUAD)),
      ownedPlayerIds: ['brz_paes', 'gld_theo', 'brz_hubner', 'slv_inacio', 'gld_walker', 'gld_pedri', 'slv_hjulmand', 'brz_marselino', 'slv_garnacho', 'brz_struick', 'elt_saka', 'slv_livakovic', 'slv_sesko', 'slv_simons', 'gld_camavinga', 'gld_leao'],
      stats: { matchesPlayed: 0, wins: 0, goalsScored: 0 }
    };
  }

  saveData() {
    try { localStorage.setItem('fc_champions_save_v1', JSON.stringify(this.data)); } catch(e) {}
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
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  switchView(viewName) {
    this.activeView = viewName;
    this.audio.playClick();

    document.querySelectorAll('.view-section').forEach(sec => {
      sec.classList.remove('active');
    });
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    if (viewName === 'squad') this.renderSquadScreen();
    else if (viewName === 'market') this.renderMarketScreen();
    else if (viewName === 'store') this.renderStoreScreen();
    else if (viewName === 'home') this.renderHomeScreen();
    this.saveData();
  }

  setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.view === 'match') this.startQuickMatch();
        else this.switchView(btn.dataset.view);
      });
    });

    document.getElementById('btn-goto-squad')?.addEventListener('click', () => this.switchView('squad'));
    document.getElementById('btn-goto-market')?.addEventListener('click', () => this.switchView('market'));
    document.getElementById('btn-goto-store')?.addEventListener('click', () => this.switchView('store'));

    const launch = (e) => { if (e) e.stopPropagation(); this.startQuickMatch(); };
    document.getElementById('btn-quick-match')?.addEventListener('click', launch);
    document.querySelector('.btn-play-action')?.addEventListener('click', launch);
    document.getElementById('btn-exit-match')?.addEventListener('click', () => this.exitMatch());
  }

  updateCurrencies() {
    document.getElementById('top-coins').textContent = this.data.coins.toLocaleString('id-ID');
    document.getElementById('top-gems').textContent = this.data.gems.toLocaleString('id-ID');
  }

  renderHomeScreen() {
    const stats = this.squadManager.calculateTeamStats();
    document.getElementById('home-team-ovr').textContent = stats.teamOvr;
    document.getElementById('home-team-chem').textContent = stats.chemistry;
    this.updateCurrencies();
  }

  renderSquadScreen() {
    const stats = this.squadManager.calculateTeamStats();
    document.getElementById('squad-team-ovr').textContent = stats.teamOvr;
    document.getElementById('squad-team-chem').textContent = stats.chemistry;
    document.getElementById('formation-select').value = this.squadManager.getFormation();

    const pitch = document.getElementById('tactics-pitch');
    pitch.innerHTML = '';
    const formDef = FORMATIONS[this.squadManager.getFormation()] || FORMATIONS['4-3-3'];

    formDef.slots.forEach(slot => {
      const matchSlot = this.data.squad.startingXI.find(s => s.posKey === slot.key);
      const player = matchSlot ? getPlayerById(matchSlot.playerId) : null;
      if (!player) return;

      const slotEl = document.createElement('div');
      slotEl.className = 'pitch-slot-card';
      if (this.selectedPitchSlot === slot.key) slotEl.classList.add('selected');
      slotEl.style.left = `${slot.x * 100}%`;
      slotEl.style.top = `${slot.y * 100}%`;

      const tier = CARD_TIERS[player.tier] || CARD_TIERS.GOLD;
      slotEl.innerHTML = `
        <div class="card-shield" style="background: ${tier.bgGrad}; border-color: ${tier.border};">
          <div class="card-top"><span class="card-ovr" style="color:${tier.color};">${player.ovr}</span><span class="card-pos">${player.pos}</span></div>
          <div class="card-avatar">${player.avatar}</div>
          <div class="card-name">${player.name}</div>
        </div>
        <div class="card-slot-role">${slot.label}</div>
      `;

      slotEl.addEventListener('click', () => {
        this.audio.playClick();
        if (this.selectedPitchSlot === slot.key) {
          this.selectedPitchSlot = null;
        } else if (this.selectedPitchSlot) {
          this.squadManager.swapTwoStartingSlots(this.selectedPitchSlot, slot.key);
          this.selectedPitchSlot = null;
          this.saveData();
        } else {
          this.selectedPitchSlot = slot.key;
        }
        this.renderSquadScreen();
      });
      pitch.appendChild(slotEl);
    });

    const bList = document.getElementById('bench-list'), rList = document.getElementById('reserves-list');
    bList.innerHTML = ''; rList.innerHTML = '';

    this.data.squad.bench.forEach((pId, idx) => {
      const p = getPlayerById(pId);
      if (p) bList.appendChild(this.createCard(p, () => {
        if (this.selectedPitchSlot) {
          this.squadManager.swapStartingWithBench(this.selectedPitchSlot, idx);
          this.selectedPitchSlot = null;
          this.saveData();
          this.renderSquadScreen();
        }
      }));
    });

    this.data.squad.reserves.forEach(pId => {
      const p = getPlayerById(pId);
      if (p) rList.appendChild(this.createCard(p, () => {
        if (this.selectedPitchSlot) {
          this.squadManager.substituteFromReserves(pId, this.selectedPitchSlot);
          this.selectedPitchSlot = null;
          this.saveData();
          this.renderSquadScreen();
        }
      }));
    });
  }

  createCard(player, onClick) {
    const tier = CARD_TIERS[player.tier] || CARD_TIERS.GOLD;
    const el = document.createElement('div');
    el.className = 'bench-item-card';
    el.innerHTML = `
      <div class="card-shield" style="background:${tier.bgGrad}; border-color:${tier.border};">
        <div class="card-top"><span class="card-ovr" style="color:${tier.color};">${player.ovr}</span><span class="card-pos">${player.pos}</span></div>
        <div class="card-avatar">${player.avatar}</div>
        <div class="card-name">${player.name}</div>
      </div>
    `;
    el.addEventListener('click', onClick);
    return el;
  }

  renderMarketScreen() {
    this.updateCurrencies();
    const q = document.getElementById('market-search').value;
    const pos = document.getElementById('market-pos-filter').value;
    const tier = document.getElementById('market-tier-filter').value;
    const listings = this.marketStore.getMarketListings(q, pos, tier);
    const container = document.getElementById('market-listings');
    container.innerHTML = '';

    listings.forEach(player => {
      const isOwned = this.data.ownedPlayerIds.includes(player.id);
      const t = CARD_TIERS[player.tier] || CARD_TIERS.GOLD;
      const card = document.createElement('div');
      card.className = 'market-card-item';
      card.innerHTML = `
        <div class="card-shield" style="background:${t.bgGrad}; border-color:${t.border}; width:80px; height:110px;">
          <div class="card-top"><span class="card-ovr" style="color:${t.color}; font-size:16px;">${player.ovr}</span><span class="card-pos" style="font-size:12px;">${player.pos}</span></div>
          <div class="card-avatar" style="font-size:36px;">${player.avatar}</div>
          <div class="card-name" style="font-size:10px;">${player.name}</div>
        </div>
        <div class="market-info">
          <div class="market-player-name">${player.fullName}</div>
          <div class="market-player-club">${player.club} • ${player.nation}</div>
          <div class="market-stats-row">
            <span>PAC <strong>${player.pac}</strong></span><span>SHO <strong>${player.sho}</strong></span><span>PAS <strong>${player.pas}</strong></span>
            <span>DRI <strong>${player.dri}</strong></span><span>DEF <strong>${player.def}</strong></span><span>PHY <strong>${player.phy}</strong></span>
          </div>
          <button class="market-buy-btn ${isOwned ? 'owned' : ''}">${isOwned ? 'TERSEDIA DI SKUAD' : `🪙 BELI ${player.price.toLocaleString('id-ID')} KOIN`}</button>
        </div>
      `;
      if (!isOwned) {
        card.querySelector('.market-buy-btn').addEventListener('click', () => {
          const res = this.marketStore.buyPlayer(player.id);
          if (res.success) { this.saveData(); this.updateCurrencies(); this.renderMarketScreen(); alert(`🎉 ${res.message}`); }
          else alert(`⚠️ ${res.message}`);
        });
      }
      container.appendChild(card);
    });
  }

  renderStoreScreen() {
    this.updateCurrencies();
    const container = document.getElementById('packs-container');
    container.innerHTML = '';
    STORE_PACKS.forEach(pack => {
      const card = document.createElement('div');
      card.className = 'store-pack-card';
      card.style.borderColor = pack.color;
      const cost = pack.costType === 'coins' ? `🪙 ${pack.cost.toLocaleString('id-ID')} Koin` : `💎 ${pack.cost} Gems`;
      card.innerHTML = `
        <div class="pack-icon-glow">${pack.icon}</div>
        <div class="pack-title" style="color:${pack.color};">${pack.name}</div>
        <p class="pack-desc">${pack.desc}</p>
        <button class="pack-open-btn" style="background:linear-gradient(135deg, ${pack.color}, #0284c7);">BUKA PACK (${cost})</button>
      `;
      card.querySelector('.pack-open-btn').addEventListener('click', () => {
        const res = this.marketStore.openPack(pack.id);
        if (res.success) {
          this.saveData(); this.updateCurrencies();
          this.showPackReveal(res.player, res.isDuplicate);
        } else alert(`⚠️ ${res.message}`);
      });
      container.appendChild(card);
    });
  }

  showPackReveal(player, isDup) {
    const modal = document.getElementById('modal-pack-reveal');
    const badge = document.getElementById('reveal-tier-badge');
    const target = document.getElementById('reveal-card-target');
    const t = CARD_TIERS[player.tier] || CARD_TIERS.GOLD;
    badge.textContent = `${t.name.toUpperCase()} REVEAL`;
    badge.style.color = t.color; badge.style.borderColor = t.border;
    document.getElementById('reveal-player-name').textContent = player.fullName;
    document.getElementById('reveal-player-club').textContent = `${player.club} • ${player.nation} ${isDup ? '(Duplikat: +Koin)' : ''}`;
    target.innerHTML = `
      <div class="card-shield" style="background:${t.bgGrad}; border-color:${t.border};">
        <div class="card-top"><span class="card-ovr" style="color:${t.color};">${player.ovr}</span><span class="card-pos">${player.pos}</span></div>
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

  startQuickMatch() {
    this.switchView('match');
    this.matchRenderer.resize();
    this.isMatchRunning = true;
    this.matchEngine.startMatch(this.data.squad, null, (res) => {
      this.data.coins += res.coinsEarned; this.data.gems += res.gemsEarned;
      this.data.stats.matchesPlayed++;
      if (res.result === 'WIN') this.data.stats.wins++;
      this.data.stats.goalsScored += res.score.home;
      this.saveData();

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
    });
  }

  exitMatch() {
    this.isMatchRunning = false;
    this.switchView('home');
  }

  setupEventListeners() {
    document.getElementById('sound-btn')?.addEventListener('click', (e) => {
      const isMuted = this.audio.toggleMute();
      e.target.textContent = isMuted ? '🔇' : '🔊';
    });
    document.getElementById('formation-select')?.addEventListener('change', (e) => {
      this.squadManager.setFormation(e.target.value);
      this.saveData();
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
        if (e.key === 'j' || e.key === 'J' || e.key === 'q' || e.key === 'Q') this.matchEngine.triggerPass();
        else if (e.key === 'k' || e.key === 'K' || e.key === 'e' || e.key === 'E') {
          if (!this.matchEngine.input.shootCharging) this.matchEngine.triggerShootStart();
        } else if (e.key === 'l' || e.key === 'L' || e.key === ' ') this.matchEngine.triggerTackleOrSwitch();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      if (this.activeView === 'match' && this.isMatchRunning) {
        if (e.key === 'k' || e.key === 'K' || e.key === 'e' || e.key === 'E') this.matchEngine.triggerShootRelease();
      }
    });
  }

  setupTouchControls() {
    const joystick = document.getElementById('virtual-joystick');
    const knob = document.getElementById('joystick-knob');
    if (joystick && knob) {
      let touchId = null, originX = 0, originY = 0;
      joystick.addEventListener('touchstart', (e) => {
        const touch = e.changedTouches[0];
        touchId = touch.identifier;
        const rect = joystick.getBoundingClientRect();
        originX = rect.left + rect.width / 2; originY = rect.top + rect.height / 2;
        e.preventDefault();
      }, { passive: false });

      joystick.addEventListener('touchmove', (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          if (touch.identifier === touchId) {
            const dx = touch.clientX - originX, dy = touch.clientY - originY;
            const dist = Math.min(36, Math.sqrt(dx * dx + dy * dy));
            const angle = Math.atan2(dy, dx);
            knob.style.transform = `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`;
            if (dist > 6) this.matchEngine.input.moveDir.set(Math.cos(angle), Math.sin(angle));
            else this.matchEngine.input.moveDir.set(0, 0);
            break;
          }
        }
        e.preventDefault();
      }, { passive: false });

      const reset = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          if (e.changedTouches[i].identifier === touchId) {
            touchId = null;
            knob.style.transform = 'translate(-50%, -50%)';
            this.matchEngine.input.moveDir.set(0, 0);
            break;
          }
        }
      };
      joystick.addEventListener('touchend', reset);
      joystick.addEventListener('touchcancel', reset);
    }

    document.getElementById('vbtn-pass')?.addEventListener('click', () => this.matchEngine.triggerPass());
    const shootBtn = document.getElementById('vbtn-shoot');
    if (shootBtn) {
      shootBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.matchEngine.triggerShootStart(); }, { passive: false });
      shootBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.matchEngine.triggerShootRelease(); }, { passive: false });
      shootBtn.addEventListener('mousedown', () => this.matchEngine.triggerShootStart());
      shootBtn.addEventListener('mouseup', () => this.matchEngine.triggerShootRelease());
    }
    document.getElementById('vbtn-tackle')?.addEventListener('click', () => this.matchEngine.triggerTackleOrSwitch());
    document.getElementById('vbtn-sprint')?.addEventListener('click', () => { this.matchEngine.input.sprint = !this.matchEngine.input.sprint; });

    this.matchCanvas?.addEventListener('pointerdown', () => {
      if (this.activeView === 'match' && this.isMatchRunning) {
        if (this.matchEngine.state === 'KICKOFF') this.matchEngine.triggerPass();
      }
    });
  }

  gameLoop(timestamp) {
    const dt = Math.min(0.05, (timestamp - this.lastTime) / 1000 || 0.016);
    this.lastTime = timestamp;

    if (this.activeView === 'match' && this.isMatchRunning) {
      let moveX = 0, moveY = 0;
      if (this.keys['w'] || this.keys['arrowup']) moveY -= 1;
      if (this.keys['s'] || this.keys['arrowdown']) moveY += 1;
      if (this.keys['a'] || this.keys['arrowleft']) moveX -= 1;
      if (this.keys['d'] || this.keys['arrowright']) moveX += 1;

      if (moveX !== 0 || moveY !== 0) this.matchEngine.input.moveDir.set(moveX, moveY).normalize();
      else if (!this.matchEngine.input.moveDir.x && !this.matchEngine.input.moveDir.y) this.matchEngine.input.moveDir.set(0, 0);

      this.matchEngine.input.sprint = !!(this.keys['shift'] || this.keys['l']);

      this.matchEngine.update(dt);
      this.matchRenderer.render(this.matchEngine);

      document.getElementById('match-score-home').textContent = this.matchEngine.score.home;
      document.getElementById('match-score-away').textContent = this.matchEngine.score.away;
      document.getElementById('match-minute').textContent = `${this.matchEngine.matchMinute}'`;
      document.getElementById('match-half').textContent = this.matchEngine.half === 1 ? '1ST' : '2ND';
      document.getElementById('match-commentary').textContent = this.matchEngine.commentary;
    }
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.fcGame = new App();
  window.fcGame.init();
});
