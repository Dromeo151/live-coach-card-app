
/*
========================================
TRIGGER CATEGORY DOCUMENTATION EXAMPLES
========================================

Onboarding
Name: Onboarding or Getting Started
Language: English
Description: Triggers when a customer is looking to understand onboarding or first steps.
Rep Response:
"Great question! Let me share what our onboarding process includes — we’ll walk you through each step so you feel supported from day one."
Trigger words/phrases:
onboarding, training, kickoff, walkthrough, setup session, orientation, get started, first steps, introduction, ramp-up, new user help

Cost/Price
Name: Pricing or Budget Discussion
Language: English
Description: Triggers when a customer mentions cost, price, or budget concerns.
Rep Response:
"Can you share more about your budget or expectations on pricing so we can align better?"
Trigger words/phrases:
price, cost, budget, fee, rate, quote, pricing, how much, what does it run, expensive, cheap, charges, amount, estimate, affordability, economic, value, is there a cheaper plan, cost-effective solution, affordable option

[... Additional categories omitted for brevity ...]

To modify these, update the keywordConfig object.
*/

import React, { useState } from 'react';
import Papa from 'papaparse';


const keywordConfig = {
  'Cost/Price': {
    triggers: ['price', 'cost', 'budget', 'fee', 'rate', 'quote', 'pricing', 'how much', 'what does it run', 'expensive', 'cheap', 'charges', 'amount', 'estimate', 'affordability', 'economic', 'value', 'is there a cheaper plan', 'cost-effective solution', 'affordable option'],
    response: {
      en: "Can you share more about your budget or expectations on pricing so we can align better?",
      es: "¿Podrías compartir más sobre tu presupuesto o expectativas de precio para poder alinearnos mejor?"
    }
  },
  'Price Complaints': {
    triggers: ['too expensive', 'overpriced', 'not worth', 'can’t afford', 'that’s steep', 'out of our range', 'a bit much', 'beyond budget', 'pricey', 'not in our price range', 'high cost', 'exceeds our budget', "that's overpriced for us", "not feasible cost-wise", "it's not worth that amount"],
    response: {
      en: "We understand pricing is important. Would you be open to discussing what value you expect at that price point?",
      es: "Entendemos que el precio es importante. ¿Estarías dispuesto a comentar qué valor esperas por ese precio?"
    }
  },
  'Contract Claim': {
    triggers: ['contract', 'agreement', 'signed', 'terms', 'deal', 'paperwork', 'arrangement', 'documentation', 'we agreed', 'what was promised', 'signed off', 'you promised', 'we had a deal', 'per our contract'],
    response: {
      en: "Can you clarify the current agreement or terms you’re referring to?",
      es: "¿Puedes aclarar el acuerdo o los términos actuales a los que te refieres?"
    }
  },
  'Contract Time': {
    triggers: ['duration', 'renewal', 'start date', 'end date', 'term', 'length of agreement', 'valid until', 'commitment period', 'expires', 'timeline', 'how long does it last', 'time frame', 'when does it renew', 'can we shorten the term', 'what’s the minimum term'],
    response: {
      en: "When does your current contract expire or are you looking for flexibility in term length?",
      es: "¿Cuándo vence tu contrato actual o estás buscando flexibilidad en la duración?"
    }
  },
  'Installation': {
    triggers: ['install', 'installation', 'set up', 'setup', 'configured', 'configure', 'delivery', 'setting it up', 'implementation', 'get it running', 'hooking it up', 'initial setup', 'getting started hardware-wise', 'deployed', 'how do we get it up and running', 'do we need to install something', 'how long does setup take'],
    response: {
      en: "Would you like to walk through how we handle setup and installation logistics?",
      es: "¿Te gustaría que repasáramos cómo gestionamos la configuración e instalación?"
    }
  },
  'Onboarding': {
    triggers: ['onboarding', 'training', 'kickoff', 'walkthrough', 'setup session', 'orientation', 'get started', 'first steps', 'introduction', 'ramp-up', 'new user help', 'how do we start using it', 'is training included', 'do we get any help to begin'],
    response: {
      en: "Would you like a preview of what the onboarding process looks like with our team?",
      es: "¿Te gustaría ver un adelanto de cómo es el proceso de incorporación con nuestro equipo?"
    }
  },
  'Support Concerns': {
    triggers: ['who do we contact for help', 'support hours', 'do we get a dedicated rep'],
    response: {
      en: "Our support team is available — would you like me to introduce them now?",
      es: "Nuestro equipo de soporte está disponible, ¿quieres que te los presente ahora?"
    }
  },
  'Results/ROI': {
    triggers: ['what kind of ROI can we expect', 'will this improve our KPIs', 'can we see results fast'],
    response: {
      en: "Let me walk you through examples of results other teams achieved and what you can expect.",
      es: "Déjame mostrarte ejemplos de resultados logrados por otros equipos y qué puedes esperar."
    }
  }
};


export default function LiveCoachCardApp() {
  const [cards, setCards] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const matches = [];
        results.data.forEach(row => {
          const content = row.content?.toLowerCase() || '';
          for (const [category, config] of Object.entries(keywordConfig)) {
            const match = config.triggers.find(trigger => content.includes(trigger));
            if (match) {
              matches.push({
                Name: category + ' Trigger',
                Language: language === 'es' ? 'Español' : 'English',
                Description: `Triggers when a customer mentions ${match} indicating ${category.toLowerCase()}.`,
                RepResponse: config.response[language],
                Trigger: match,
                Quote: row.content
              });
              break;
            }
          }
        });
        setCards(matches);
        setShowResults(true);
        setLoading(false);
      }
    });
  };

  const handleReset = () => {
    setCards([]);
    setShowResults(false);
    document.getElementById('file-upload').value = null;
  };

  const downloadCSV = () => {
    const csvContent = [
      ['Name', 'Language', 'Description', 'Rep Response', 'Trigger Phrase', 'Customer Quote'],
      ...cards.map(card => [
        card.Name,
        card.Language,
        card.Description,
        card.RepResponse,
        card.Trigger,
        card.Quote
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "live_coach_cards.csv");
    link.click();
  };

  return (
    <div>
      <h1>Live Coach Card Extractor</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label>Language: </label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
      <label htmlFor="file-upload" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer', borderRadius: '5px', marginBottom: '10px' }}>Upload the CSV here</label>
      <input id="file-upload" type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />

      {loading && <div style={{ margin: '20px 0', fontStyle: 'italic' }}>Analyzing your file... <span className="spinner">🔄</span></div>}

      {showResults && !loading && (
        <div>
          <button onClick={downloadCSV} style={{ marginRight: '10px' }}>Download Results</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      )}

      {cards.map((card, index) => (
        <div key={index} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
          <p><strong>Name:</strong> {card.Name}</p>
          <p><strong>Language:</strong> {card.Language}</p>
          <p><strong>Description:</strong> {card.Description}</p>
          <p><strong>Rep Response:</strong> {card.RepResponse}</p>
          <p><strong>Trigger Phrase:</strong> {card.Trigger}</p>
          <p><strong>Customer Quote:</strong> {card.Quote}</p>
        </div>
      ))}
    </div>
  );
}
