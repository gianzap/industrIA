# IndustrIA — Industrial AI Dashboard

> Portale di diagnostica IIoT per impianti industriali con intelligenza artificiale integrata.
> Sviluppato da Gianluca Zappala' (Gianzap) come progetto finale del corso Frontend Programming di EPICODE.

---

## Descrizione del progetto

IndustrIA è un'applicazione web che simula il pannello di controllo di un system integrator industriale. Permette di monitorare macchine e impianti in tempo reale, ricevere diagnosi AI sui guasti e gestire allarmi e ticket di manutenzione.

Il progetto nasce dall'esperienza professionale nel settore dell'automazione industriale (MSL Automazioni) e simula scenari reali con macchine come PLC Mitsubishi, robot KUKA, sistemi Siemens S7 e Universal Robots.

---

## Tecnologie utilizzate

- **React 18** — libreria UI con componenti funzionali e hooks
- **Redux Toolkit** — gestione stato globale con slice e thunk
- **React Router v6** — navigazione SPA con rotte dinamiche e protette
- **Axios** — chiamate HTTP alle API esterne
- **Tailwind CSS** — styling con dark theme SCADA personalizzato
- **Vite** — build tool e dev server
- **OpenRouter API** — intelligenza artificiale (google/gemma-4-31b-it:free)

---

## Requisiti esame soddisfatti

### Pagine (6+ richieste → 8 implementate)
- `/login` — autenticazione operatore
- `/dashboard` — panoramica impianti con KPI e allarmi recenti
- `/machines` — lista macchine con filtri per stato, impianto e ricerca
- `/machine/:id` — dettaglio macchina con telemetria live e AI ← rotta dinamica
- `/alarms` — gestione allarmi con acknowledge
- `/tickets` — ticket manutenzione con CRUD
- `/admin` — pannello amministrazione (solo admin)
- `/*` — pagina 404 personalizzata con rientro home

### Routing
- React Router v6 con `Routes`, `Route`, `Navigate`
- Rotta dinamica `/machine/:id` con `useParams()`
- `ProtectedRoute` — redirect a `/login` se non autenticato
- `AdminRoute` — redirect a `/dashboard` se non admin

### State Management
- **useState** — stato form, tab attivo, modal aperto
- **useEffect** — telemetria live ogni 3 secondi con cleanup (clearInterval)
- **Redux Toolkit** — 5 slice: `auth`, `machines`, `alarms`, `tickets`, `ai`
- **Thunk** — `loginUser`, `runDiagnosis`, `sendChatMessage`, `fetchThresholds`

### Utenti e ruoli (3 ruoli)
| Ruolo | Email | Password | Permessi |
|-------|-------|----------|----------|
| Admin | admin@msl.it | admin123 | Tutto + configurazione soglie allarme |
| Technician | tecnico@msl.it | tech123 | Conferma allarmi + crea/chiudi ticket |
| Operator | operatore@cliente.it | op123 | Solo lettura |

### Form controllati con validazione (4 richiesti e implementati)
1. **LoginForm** — email, password (validateEmail, validatePassword)
2. **TicketForm** — title, machineId, priority, description, assignedTo (validateRequired, validateMinLength)
3. **ThresholdForm** — 6 soglie numeriche per temperatura, vibrazione, efficienza (validateRequired) + suggerimento AI
4. **ChatForm** (in AiChat) — messaggio all'assistente tecnico (validateRequired)

### API esterne
- **OpenRouter** (`https://openrouter.ai/api/v1/chat/completions`) — 3 funzioni:
  - `diagnose()` — analisi diagnostica completa macchina
  - `chat()` — assistente tecnico multi-turno
  - `generateThresholds()` — suggerimento soglie allarme

### Componenti riutilizzabili
- `StatusDot` — indicatore stato con colore e animazione pulse
- `TelemetryCard` — card valore sensore con colore dinamico
- `Badge` — etichetta colorata per stati e priorità
- `Modal` — finestra modale con backdrop e gestione scroll
- `Spinner` — indicatore di caricamento
- `MachineCard` — card macchina con link a dettaglio
- `PageHeader` — intestazione pagina con titolo, subtitle e action
- `AppLayout` — layout con sidebar + main
- `Sidebar` — navigazione con badge contatori live

### altre implementazioni oltre le minime richieste
- Tailwind CSS con dark theme SCADA (colori cyan, green, amber, red su sfondo scuro)
- Filtri macchine in tempo reale (stato + impianto + ricerca testo)
- Telemetria live simulata aggiornata ogni 3 secondi con cleanup corretto
- Badge contatori in sidebar (allarmi critici + ticket aperti)
- Prompt AI contestualizzato con dati reali macchina (PLC, temperatura, allarmi)
- Chat multi-turno con storia conversazione completa

---

## Struttura del progetto

```
src/
├── main.jsx                 ← Provider Redux + BrowserRouter
├── App.jsx                  ← Monta AppRouter
├── index.css                ← Tailwind + classi SCADA custom
│
├── router/
│   ├── index.jsx            ← Definizione tutte le route
│   ├── ProtectedRoute.jsx   ← Redirect se non loggato
│   └── AdminRoute.jsx       ← Redirect se non admin
│
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── MachinesPage.jsx
│   ├── MachineDetailPage.jsx
│   ├── AlarmsPage.jsx
│   ├── TicketsPage.jsx
│   ├── AdminPage.jsx
│   └── NotFoundPage.jsx
│
├── components/
│   ├── layout/              ← Sidebar, AppLayout, PageHeader
│   ├── auth/                ← LoginForm
│   ├── machines/            ← MachineCard, MachineFilters
│   ├── tickets/             ← TicketForm, ThresholdForm
│   ├── ai/                  ← DiagnosisPanel, AiChat
│   └── ui/                  ← StatusDot, TelemetryCard, Badge, Modal, Spinner
│
├── store/
│   ├── index.js             ← configureStore
│   ├── slices/              ← authSlice, machinesSlice, alarmsSlice, ticketsSlice, aiSlice
│   └── thunks/              ← authThunks, aiThunks
│
├── services/
│   ├── authService.js       ← Fake auth con localStorage
│   └── groqService.js       ← Chiamate OpenRouter API
│
├── hooks/
│   ├── useAuth.js           ← user, isAdmin, isTechnician, userName
│   └── useMachines.js       ← Lista macchine filtrata
│
└── utils/
    ├── mockData.js          ← 10 macchine, 3 utenti, allarmi, ticket, generateTelemetry
    ├── validators.js        ← validateRequired, validateEmail, validatePassword, validateMinLength
    └── formatters.js        ← formatDate, formatDateTime, statusLabel, roleLabel, priorityLabel
```

---

## Installazione e avvio

```bash
# 1. Clona il repository
git clone https://github.com/gianzap/industria.git
cd industria

# 2. Installa le dipendenze
npm install

# 3. Configura la chiave API
cp .env.example .env
# Apri .env e inserisci la tua chiave OpenRouter:
# VITE_OPENROUTER_API_KEY=sk-or-v1-...

# 4. Avvia il server di sviluppo
npm run dev
```

L'app sarà disponibile su `http://localhost:5173`

### Ottenere la chiave API OpenRouter

1. Vai su [openrouter.ai](https://openrouter.ai)
2. Registrati gratuitamente
3. Vai su **Keys** → **Create Key**
4. Copia la chiave e incollala nel file `.env`

---

## Variabili d'ambiente

| Variabile | Descrizione | Obbligatoria |
|-----------|-------------|--------------|
| `VITE_OPENROUTER_API_KEY` | Chiave API OpenRouter per le funzioni AI | Sì |

> **Nota:** le variabili Vite devono avere il prefisso `VITE_` e si accedono con `import.meta.env.VITE_...`

---

## Funzionalità principali

### Dashboard
Panoramica degli impianti con KPI in tempo reale, macchine in stato critico e feed di allarmi e ticket recenti.

### Monitoraggio macchine
Lista di 10 macchine simulate (clienti reali MSL Automazioni) con filtri per stato, impianto e ricerca. Ogni macchina ha una pagina di dettaglio con telemetria live aggiornata ogni 3 secondi.

### Diagnosi AI
Il modello AI analizza la macchina considerando tipo, PLC, telemetria attuale e allarmi attivi. Restituisce: stato complessivo, risk score, causa probabile, azioni immediate e stima del fermo macchina.

### Assistente tecnico AI
Chat multi-turno con un assistente specializzato in automazione industriale (PLC Mitsubishi, Siemens, robot KUKA, Universal Robots). La conversazione mantiene la storia completa per risposte contestualizzate.

### Gestione allarmi
Lista allarmi con filtro per stato. I tecnici possono confermare allarmi singoli o tutti in blocco. Gli operatori hanno accesso in sola lettura.

### Ticket manutenzione
CRUD completo per ticket di manutenzione. I tecnici possono creare e chiudere ticket. Form con validazione su tutti i campi.

### Configurazione soglie (Admin)
L'admin può configurare soglie di allarme per temperatura, vibrazione ed efficienza. Il pulsante "Suggerisci con AI" chiama l'API e precompila i valori consigliati per quel tipo di macchina.

---

## Le 10 macchine simulate

| ID | Nome | Tipo | PLC | Stato |
|----|------|------|-----|-------|
| M001 | Linea Confezionamento L1 | Confezionatrice | Mitsubishi FX5U | OK |
| M002 | Robot Saldatura R2 | Robot KUKA | KUKA KRC4 | Warning |
| M003 | Compressore Aria C3 | Compressore | Siemens S7-1200 | Allarme |
| M004 | Nastro Trasportatore T4 | Nastro | Mitsubishi iQ-R | OK |
| M005 | Pressa Idraulica P5 | Pressa | Siemens S7-1500 | OK |
| M006 | Sistema Visione AI V6 | Machine Vision | PC industriale | OK |
| M007 | Dosatrice Liquidi D7 | Dosatrice | Mitsubishi FX5U | Warning |
| M008 | Centro CNC F8 | CNC | Fanuc 0i-MF | Offline |
| M009 | Cobot Assemblaggio C9 | Cobot UR | Universal Robots UR10 | OK |
| M010 | Monitor Fotovoltaico I10 | IIoT Monitor | Gateway MQTT | OK |

---

## Autore

Zappalà Gianluca- GianZap