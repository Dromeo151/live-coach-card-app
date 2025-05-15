
/*
========================================
TRIGGER CATEGORY DOCUMENTATION EXAMPLES
========================================

Onboarding
Name: Onboarding or Getting Started
Language: English
Description: Triggers when a customer is looking to understand onboarding or first steps.
Rep Response:
"Great question! Let me share what our onboarding process includes — we'll walk you through each step so you feel supported from day one."
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
  "Cost/Price": {
    triggers: [
      "price", "cost", "budget", "fee", "rate", "quote", "pricing", "how much", "what does it run",
      "expensive", "cheap", "charges", "amount", "estimate", "affordability", "economic", "value",
      "is there a cheaper plan", "cost-effective solution", "affordable option", "how much does it cost",
      "what's the charge", "pricing model", "cost structure", "is it economical", "price tag", "any discounts",
      "what's the rate", "payment amount", "monthly fee", "recurring charge", "do you offer bundles",
      "cost breakdown", "price comparison"
    ],
    response: {
      en: "Can you share more about your budget or expectations on pricing so we can align better?",
      es: "¿Podrías compartir más sobre tu presupuesto o expectativas de precio para poder alinearnos mejor?"
    }
  },
  "Price Complaints": {
    triggers: [
      "too expensive", "overpriced", "not worth", "can't afford", "that's steep", "out of our range", "a bit much",
      "beyond budget", "pricey", "not in our price range", "high cost", "exceeds our budget",
      "that's overpriced for us", "not feasible cost-wise", "it's not worth that amount", "pricing is too high",
      "not affordable", "we can't stretch that far", "out of our league", "too much for us",
      "overpriced compared to others", "exceeds our expectations", "doesn't justify the cost",
      "way above what we planned", "our CFO will never approve that", "hard to justify the spend",
      "doesn't fit our pricing limits", "unaffordable for our org"
    ],
    response: {
      en: "We understand pricing is important. Would you be open to discussing what value you expect at that price point?",
      es: "Entendemos que el precio es importante. ¿Estarías dispuesto a comentar qué valor esperas por ese precio?"
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
        <div key={index} style={{ backgroundColor: '#f0f4ff', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
          <h3>{card.Name.split(' ')[0]}</h3>
          <ul>
            <li><strong>Name:</strong> {card.Name}</li>
            <li><strong>Language:</strong> {card.Language}</li>
            <li><strong>Description:</strong> {card.Description}</li>
            <li><strong>Rep Response:</strong><br />
              <em>"{card.RepResponse}"</em>
            </li>
            <li><strong>Trigger words/phrases:</strong><br />
              <code>{card.Trigger}</code>
            </li>
          </ul>
        </div>
      ))}

    </div>
  );
}
