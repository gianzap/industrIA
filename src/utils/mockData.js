// Le 10 macchine simulate — clienti realistici
export const MACHINES = [
  { id: 'M001', name: 'Linea Confezionamento L1', type: 'Confezionatrice', plant: 'Stabilimento Catania',   plc: 'Mitsubishi FX5U',       status: 'ok',      uptime: 98.2, lastMaintenance: '2025-04-12', nextMaintenance: '2025-07-12', description: 'Linea automatica per confezionamento prodotti alimentari in sacchetti sottovuoto', tags: ['food','packaging','mitsubishi'] },
  { id: 'M002', name: 'Robot Saldatura R2',       type: 'Robot KUKA',      plant: 'Officina Palermo',      plc: 'KUKA KRC4',             status: 'warning', uptime: 91.5, lastMaintenance: '2025-03-20', nextMaintenance: '2025-06-20', description: 'Robot antropomorfo 6 assi per saldatura MIG su telai automotive',               tags: ['automotive','robot','saldatura'] },
  { id: 'M003', name: 'Compressore Aria C3',      type: 'Compressore',     plant: 'Stabilimento Catania',  plc: 'Siemens S7-1200',       status: 'alarm',   uptime: 72.0, lastMaintenance: '2025-02-01', nextMaintenance: '2025-05-01', description: 'Compressore a vite 75kW per alimentazione utenze pneumatiche impianto',         tags: ['utility','pneumatica','siemens'] },
  { id: 'M004', name: 'Nastro Trasportatore T4',  type: 'Nastro',          plant: 'Magazzino Ragusa',      plc: 'Mitsubishi iQ-R',       status: 'ok',      uptime: 99.1, lastMaintenance: '2025-05-01', nextMaintenance: '2025-08-01', description: 'Nastro trasportatore per smistamento colli in uscita magazzino automatico',      tags: ['logistica','nastro','mitsubishi'] },
  { id: 'M005', name: 'Pressa Idraulica P5',      type: 'Pressa',          plant: 'Officina Palermo',      plc: 'Siemens S7-1500',       status: 'ok',      uptime: 95.8, lastMaintenance: '2025-04-20', nextMaintenance: '2025-07-20', description: 'Pressa idraulica 200T per stampaggio lamiere acciaio inox',                     tags: ['metalworking','pressa','siemens'] },
  { id: 'M006', name: 'Sistema Visione AI V6',    type: 'Machine Vision',  plant: 'Stabilimento Catania',  plc: 'PC industriale',        status: 'ok',      uptime: 99.9, lastMaintenance: '2025-05-10', nextMaintenance: '2025-08-10', description: 'Sistema AI per controllo qualità visivo su produzione ceramica',                tags: ['AI','vision','qualità'] },
  { id: 'M007', name: 'Dosatrice Liquidi D7',     type: 'Dosatrice',       plant: 'Stabilimento Siracusa', plc: 'Mitsubishi FX5U',       status: 'warning', uptime: 88.3, lastMaintenance: '2025-03-15', nextMaintenance: '2025-06-15', description: 'Impianto dosaggio automatico prodotti chimici detergenti industriali',           tags: ['chimica','dosaggio','mitsubishi'] },
  { id: 'M008', name: 'Centro CNC F8',            type: 'CNC',             plant: 'Officina Palermo',      plc: 'Fanuc 0i-MF',           status: 'offline', uptime: 0,    lastMaintenance: '2025-01-10', nextMaintenance: '2025-04-10', description: 'Centro fresatura CNC 5 assi per lavorazione alluminio aeronautico',              tags: ['metalworking','CNC','fanuc'] },
  { id: 'M009', name: 'Cobot Assemblaggio C9',    type: 'Cobot UR',        plant: 'Stabilimento Catania',  plc: 'Universal Robots UR10', status: 'ok',      uptime: 97.4, lastMaintenance: '2025-05-05', nextMaintenance: '2025-08-05', description: 'Cobot collaborativo per assemblaggio componenti elettronici su schede PCB',      tags: ['cobot','assemblaggio','UR'] },
  { id: 'M010', name: 'Monitor Fotovoltaico I10', type: 'IIoT Monitor',    plant: 'Magazzino Ragusa',      plc: 'Gateway MQTT',          status: 'ok',      uptime: 100,  lastMaintenance: '2025-04-01', nextMaintenance: '2025-10-01', description: 'Sistema monitoraggio IIoT impianto fotovoltaico industriale 500kW via MQTT',    tags: ['energia','IIoT','MQTT'] },
];

// Utenti fake — 3 ruoli differenziati
export const FAKE_USERS = [
  { id: 1, name: 'Gianluca', surname: 'Zappalà', email: 'admin@msl.it', password: 'admin123', role: 'admin',      company: 'MSL' },
  { id: 2, name: 'Marco',    surname: 'Ferrara',  email: 'tecnico@msl.it',           password: 'tech123',  role: 'technician', company: 'MSL' },
  { id: 3, name: 'Lucia',    surname: 'Romano',   email: 'operatore@cliente.it',     password: 'op123',    role: 'operator',   company: 'Cliente SpA' },
];

// Allarmi precaricati
export const INITIAL_ALARMS = [
  { id: 'AL001', code: 'T_HIGH_001', description: 'Temperatura motore superiore a soglia (95°C > 85°C)',            severity: 'alarm',   machineId: 'M003', machineName: 'Compressore Aria C3',  timestamp: new Date(Date.now()-300000).toISOString(),  acknowledged: false },
  { id: 'AL002', code: 'P_LOW_002',  description: 'Pressione aria compressa sotto soglia minima (4.8 bar < 5.5 bar)', severity: 'warning', machineId: 'M002', machineName: 'Robot Saldatura R2',   timestamp: new Date(Date.now()-900000).toISOString(),  acknowledged: false },
  { id: 'AL003', code: 'VIB_003',    description: 'Vibrazione anomala asse Z rilevata dal sensore accelerometro',    severity: 'warning', machineId: 'M007', machineName: 'Dosatrice Liquidi D7', timestamp: new Date(Date.now()-1800000).toISOString(), acknowledged: true  },
  { id: 'AL004', code: 'ENC_004',    description: 'Encoder asse X fuori range — errore posizionamento',              severity: 'alarm',   machineId: 'M003', machineName: 'Compressore Aria C3',  timestamp: new Date(Date.now()-120000).toISOString(),  acknowledged: false },
  { id: 'AL005', code: 'COMM_005',   description: 'Perdita comunicazione con PLC Fanuc 0i-MF (timeout 30s)',         severity: 'alarm',   machineId: 'M008', machineName: 'Centro CNC F8',        timestamp: new Date(Date.now()-3600000).toISOString(), acknowledged: true  },
];

// Ticket manutenzione precaricati
export const INITIAL_TICKETS = [
  { id: 'TK001', title: 'Sostituzione filtro aria compressore', machineId: 'M003', machineName: 'Compressore Aria C3',      priority: 'high',   status: 'open',        assignedTo: 'Marco Ferrara',    createdAt: new Date(Date.now()-86400000).toISOString(),   description: 'Il filtro aria ha superato le 500h di esercizio. Sostituzione urgente.',         notes: '' },
  { id: 'TK002', title: 'Calibrazione sensore pressione',       machineId: 'M002', machineName: 'Robot Saldatura R2',       priority: 'medium', status: 'in_progress', assignedTo: 'Marco Ferrara',    createdAt: new Date(Date.now()-172800000).toISOString(),  description: 'Il sensore mostra deriva del 3% rispetto al riferimento. Calibrazione periodica.', notes: 'In attesa set calibrazione.' },
  { id: 'TK003', title: 'Aggiornamento firmware PLC',           machineId: 'M001', machineName: 'Linea Confezionamento L1', priority: 'low',    status: 'closed',      assignedTo: 'Gianluca Zappalà', createdAt: new Date(Date.now()-604800000).toISOString(),  description: 'Aggiornamento firmware Mitsubishi FX5U alla versione 1.130.',                     notes: 'Completato. Testato OK.' },
];




// Questa funzione riceve l'ID della macchina (es. "M003")
// e restituisce un oggetto con i valori dei sensori
export const generateTelemetry = (machineId) => {

  // Valori BASE realistici per ogni macchina
  // Formato: [temperatura, vibrazione, efficienza, corrente, pressione]
  // Questi valori sono fissi e basati sul tipo reale di macchina
  const base = {
    M001: [68, 4.2, 92, 14, 6.2], // confezionatrice: temp normale, buona efficienza
    M002: [75, 6.1, 87, 18, 5.8], // robot KUKA: vibrazione più alta (saldatura)
    M003: [95, 2.1, 60, 22, 3.1], // compressore: 95°C -> è in ALLARME
    M004: [45, 1.8, 98,  8, 0  ], // nastro: freddo, efficienza quasi perfetta
    M005: [62, 8.5, 94, 28, 180], // pressa: pressione altissima (200T idraulica)
    M006: [38, 0.5, 99,  6, 0  ], // visione AI: PC, quasi niente vibrazione
    M007: [71, 3.2, 85, 16, 4.4], // dosatrice: warning, efficienza calante
    M008: [ 0, 0,    0,  0, 0  ], // CNC: tutto a zero -> OFFLINE
    M009: [52, 2.8, 96, 12, 0  ], // cobot UR: operativo, nessuna pressione
    M010: [29, 0.1,100,  2, 0  ], // fotovoltaico: monitor passivo, efficienza 100%
  };

  // Destructuring: estrae i 5 valori dell'array per la macchina richiesta
  // Se machineId non esiste in base, usa valori di default [50, 2, 90, 10, 5]
  const [t, v, e, c, p] = base[machineId] || [50, 2, 90, 10, 5];
  //     t=temp v=vibr e=eff c=curr p=press

  // Ora aggiungiamo un po' di RUMORE casuale a ogni valore
  // Math.random() restituisce un numero tra 0 e 1
  // (Math.random() - 0.5) restituisce un numero tra -0.5 e +0.5
  // Moltiplicato per 4 -> oscillazione tra -2 e +2

  return {

    // Temperatura: valore base +/- 2°C random
    // es. M003: 95 + (qualcosa tra -2 e +2) = tra 93 e 97°C
    temperature: +(t + (Math.random() - 0.5) * 4).toFixed(1),
    //            ^                               ^
    //            + davanti converte in numero    arrotonda a 1 decimale
    //            (toFixed restituisce stringa)

    // Vibrazione: valore base +/- 0.15 mm/s
    vibration: +(v + (Math.random() - 0.5) * 0.3).toFixed(2),

    // Efficienza: non può superare 100%
    // Math.min(100, ...) prende il minore tra 100 e il valore calcolato
    efficiency: Math.min(100, +(e + (Math.random() - 0.5) * 2).toFixed(1)),

    // Corrente: valore base +/- 1A
    current: +(c + (Math.random() - 0.5) * 2).toFixed(1),

    // Pressione: valore base +/- 0.25 bar
    pressure: +(p + (Math.random() - 0.5) * 0.5).toFixed(2),

    // Timestamp: momento esatto della "lettura"
    // Usato per mostrare "Ultimo aggiornamento: 14:32:05"
    timestamp: new Date().toISOString(),
  };
};