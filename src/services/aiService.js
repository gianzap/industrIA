import axios from 'axios';

// IMPORTANTE: usiamo OpenRouter perché Groq ha avuto problemi
// di rete e modelli dismessi. L'API è identica.
const URL   = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemma-4-31b-it:free';

// Funzione che costruisce gli header con la chiave API
// import.meta.env legge le variabili da .env (solo quelle con prefisso VITE_)
const headers = () => ({
  Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
});

const groqService = {

  // FUNZIONE 1: chiede una diagnosi completa della macchina
  async diagnose(machine, alarms, telemetry) {
    // Costruisce la lista degli allarmi come testo leggibile
    const alarmText = alarms.length
      ? alarms.map(a => `- [${a.severity.toUpperCase()}] ${a.code}: ${a.description}`).join('\n')
      : 'Nessun allarme attivo';

    // Il prompt è il "messaggio" che mandiamo all'AI
    // Includiamo TUTTI i dati reali della macchina per contestualizzare la risposta
    const prompt = `Sei un esperto di automazione industriale e manutenzione predittiva.
      Analizza questa macchina e fornisci una diagnosi tecnica.

      MACCHINA: ${machine.name} (${machine.type})
      PLC: ${machine.plc}
      UPTIME: ${machine.uptime}%

      ALLARMI ATTIVI:
      ${alarmText}

      TELEMETRIA ATTUALE:
      - Temperatura: ${telemetry.temperature}°C
      - Vibrazione: ${telemetry.vibration} mm/s
      - Efficienza: ${telemetry.efficiency}%

      Rispondi SOLO con JSON valido (nessun testo prima o dopo):
      {
        "overallStatus": "ok|warning|critical",
        "riskScore": <0-100>,
        "summary": "<diagnosi in 2-3 frasi>",
        "rootCause": "<causa probabile principale>",
        "immediateActions": ["<azione 1>","<azione 2>"],
        "estimatedDowntime": "<stima fermo macchina>"
      }`;

    // axios.post invia la richiesta HTTP all'API
    const response = await axios.post(URL, {
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4, // bassa = risposte più "deterministiche" e coerenti
      max_tokens: 800,  // lunghezza massima della risposta
    }, { headers: headers() });

    // La risposta arriva dentro response.data.choices[0].message.content
    const content = response.data.choices[0].message.content;

    // L'AI a volte include ```json ... ``` attorno al JSON: lo rimuoviamo
    const cleaned = content.replace(/```json|```/g, '').trim();

    // Converte la stringa JSON in un vero oggetto JavaScript
    return JSON.parse(cleaned);
  },

  // FUNZIONE 2: chat — l'AI risponde a domande, ricordando la conversazione
  async chat(message, history, machineContext) {
    // Il "system prompt" definisce la personalità dell'AI
    const systemContent = `Sei un esperto tecnico di automazione industriale di MSL Automazioni.
      Conosci PLC Mitsubishi, Siemens, robot KUKA, Universal Robots, SCADA/HMI.
      Rispondi in italiano, in modo tecnico e preciso. Massimo 3 paragrafi.
      ${machineContext ? `Contesto macchina: ${machineContext.name} (${machineContext.type})` : ''}`;

    // L'AI è STATELESS: non ricorda nulla tra una chiamata e l'altra.
    // Quindi ogni volta mandiamo TUTTA la conversazione precedente (history)
    // più il nuovo messaggio dell'utente.
    const messages = [
      { role: 'system', content: systemContent },
      ...history,                          // tutti i messaggi precedenti
      { role: 'user', content: message },  // il nuovo messaggio
    ];

    const response = await axios.post(URL, {
      model: MODEL,
      messages,
      temperature: 0.7, // più alta = risposte più "creative"
      max_tokens: 500,
    }, { headers: headers() });

    return response.data.choices[0].message.content;
  },

  // FUNZIONE 3: suggerisce soglie di allarme realistiche per una macchina
  async generateThresholds(machine) {
    const prompt = `Per la macchina "${machine.name}" (${machine.type}, PLC: ${machine.plc}),
      suggerisci soglie di allarme realistiche.
      Rispondi SOLO con JSON:
      { "temperature": {"warning":<num>,"alarm":<num>},
        "vibration":   {"warning":<num>,"alarm":<num>},
        "efficiency":  {"warning":<num>,"alarm":<num>} }`;

    const response = await axios.post(URL, {
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
    }, { headers: headers() });

    const cleaned = response.data.choices[0].message.content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  },
};

export default groqService;