/**
 * FC CHAMPIONS MOBILE - Formations & Tactical Pitch Layouts
 * Normalized pitch coordinates (x: 0.0 to 1.0, y: 0.0 to 1.0)
 * where (0,0) is top-left and (1,1) is bottom-right.
 * In squad view: Y goes from GK (bottom) to ST (top).
 * In match engine: home team attacks right/left depending on half.
 */

export const FORMATIONS = {
  '4-3-3': {
    name: '4-3-3 Attack',
    type: 'Offensive',
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
    type: 'Balanced',
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
    type: 'Control',
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
    type: 'Tactical',
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
