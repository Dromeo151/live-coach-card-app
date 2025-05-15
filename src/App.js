
import React, { useState } from 'react';
import Papa from 'papaparse';

const keywordConfig = {
  'Cost/Price': {
    triggers: ['price', 'cost', 'budget', 'fee', 'rate', 'quote', 'pricing', 'how much', 'what does it run', 'expensive', 'cheap', 'charges', 'amount', 'estimate', 'affordability'],
    response: "Can you share more about your budget or expectations on pricing so we can align better?"
  },
  'Price Complaints': {
    triggers: ['too expensive', 'overpriced', 'not worth', 'can’t afford', 'that’s steep', 'out of our range', 'a bit much', 'beyond budget', 'pricey', 'not in our price range', 'high cost'],
    response: "We understand pricing is important. Would you be open to discussing what value you expect at that price point?"
  },
  'Contract Claim': {
    triggers: ['contract', 'agreement', 'signed', 'terms', 'deal', 'paperwork', 'arrangement', 'documentation', 'we agreed', 'what was promised', 'signed off'],
    response: "Can you clarify the current agreement or terms you’re referring to?"
  },
  'Contract Time': {
    triggers: ['duration', 'renewal', 'start date', 'end date', 'term', 'length of agreement', 'valid until', 'commitment period', 'expires', 'timeline', 'how long does it last', 'time frame'],
    response: "When does your current contract expire or are you looking for flexibility in term length?"
  },
  'Installation': {
    triggers: ['install', 'installation', 'set up', 'setup', 'configured', 'configure', 'delivery', 'setting it up', 'implementation', 'get it running', 'hooking it up', 'initial setup', 'getting started hardware-wise', 'deployed'],
    response: "Would you like to walk through how we handle setup and installation logistics?"
  },
  'Onboarding': {
    triggers: ['onboarding', 'training', 'kickoff', 'walkthrough', 'setup session', 'orientation', 'get started', 'first steps', 'introduction', 'ramp-up', 'new user help'],
    response: "Would you like a preview of what the onboarding process looks like with our team?"
  }
};

export default function LiveCoachCardApp() {
  const [cards, setCards] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
                Language: 'English',
                Description: `Triggers when a customer mentions ${match} indicating ${category.toLowerCase()}.`,
                RepResponse: config.response,
                Trigger: match,
                Quote: row.content
              });
              break;
            }
          }
        });
        setCards(matches);
        setShowResults(true);
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
      <label htmlFor="file-upload" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', cursor: 'pointer', borderRadius: '5px', marginBottom: '10px' }}>Upload the CSV here</label>
      <input id="file-upload" type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
      {showResults && (
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
