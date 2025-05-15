
import React, { useState } from 'react';
import Papa from 'papaparse';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const keywordConfig = {
  'Cost/Price': {
    triggers: [
      'price', 'cost', 'budget', 'fee', 'rate', 'quote', 'pricing', 'how much', 'what does it run',
      'expensive', 'cheap', 'charges', 'amount', 'estimate', 'affordability'
    ],
    response: "Can you share more about your budget or expectations on pricing so we can align better?"
  },
  'Price Complaints': {
    triggers: [
      'too expensive', 'overpriced', 'not worth', 'can’t afford', 'that’s steep', 'out of our range',
      'a bit much', 'beyond budget', 'pricey', 'not in our price range', 'high cost'
    ],
    response: "We understand pricing is important. Would you be open to discussing what value you expect at that price point?"
  },
  'Contract Claim': {
    triggers: [
      'contract', 'agreement', 'signed', 'terms', 'deal', 'paperwork', 'arrangement',
      'documentation', 'we agreed', 'what was promised', 'signed off'
    ],
    response: "Can you clarify the current agreement or terms you’re referring to?"
  },
  'Contract Time': {
    triggers: [
      'duration', 'renewal', 'start date', 'end date', 'term', 'length of agreement',
      'valid until', 'commitment period', 'expires', 'timeline', 'how long does it last', 'time frame'
    ],
    response: "When does your current contract expire or are you looking for flexibility in term length?"
  },
  'Installation': {
    triggers: [
      'install', 'installation', 'set up', 'setup', 'configured', 'configure', 'delivery',
      'setting it up', 'implementation', 'get it running', 'hooking it up', 'initial setup',
      'getting started hardware-wise', 'deployed'
    ],
    response: "Would you like to walk through how we handle setup and installation logistics?"
  },
  'Onboarding': {
    triggers: [
      'onboarding', 'training', 'kickoff', 'walkthrough', 'setup session', 'orientation',
      'get started', 'first steps', 'introduction', 'ramp-up', 'new user help'
    ],
    response: "Would you like a preview of what the onboarding process looks like with our team?"
  }
};

export default function LiveCoachCardApp() {
  const [cards, setCards] = useState([]);

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
      }
    });
  };

  return (
    <div className="p-4 space-y-4">
      <input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" />
      {cards.map((card, index) => (
        <Card key={index} className="p-4">
          <CardContent>
            <p><strong>Name:</strong> {card.Name}</p>
            <p><strong>Language:</strong> {card.Language}</p>
            <p><strong>Description:</strong> {card.Description}</p>
            <p><strong>Rep Response:</strong> {card.RepResponse}</p>
            <p><strong>Trigger Phrase:</strong> {card.Trigger}</p>
            <p><strong>Customer Quote:</strong> {card.Quote}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
