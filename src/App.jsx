import React, { useState } from 'react';
import Papa from 'papaparse';
import { UserCheck, DollarSign, FileText, Clock, Settings, BookOpen, HelpCircle, BarChart2 } from 'lucide-react';

const keywordConfig = {...};  // Shortened for brevity, will paste full code in actual implementation

const categoryLabels = {...};  // Shortened for brevity

const categoryIcons = {...};  // Shortened for brevity

const categories = Object.keys(keywordConfig);

export default function LiveCoachCardApp() {
  const [cards, setCards] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [filter, setFilter] = useState('All');

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
                Category: category,
                Name: categoryLabels[category] || category,
                Language: language === 'es' ? 'Español' : language === 'de' ? 'Deutsch' : language === 'fr' ? 'Français' : language === 'nl' ? 'Nederlands' : 'English',
                Description: `Triggers when a customer mentions ${match} indicating ${category.toLowerCase()}.`,
                RepResponse: config.response[language],
                Trigger: match,
                Quote: row.content
              });
            }
          }
        });
        setCards(matches);
        setShowResults(true);
        setLoading(false);
      }
    });
  };

  const filteredCards = filter === 'All' ? cards : cards.filter(card => categoryLabels[card.Category] === categoryLabels[filter]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Live Coach Card Extractor</h1>

        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            <label className="mr-2">Language:</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border p-1 rounded">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="nl">Nederlands</option>
            </select>
          </div>
          <div>
            <label className="mr-2">Filter by Category:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-1 rounded">
              <option value="All">All</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{categoryLabels[cat]}</option>
              ))}
            </select>
          </div>
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            Upload CSV
          </label>
          <input id="file-upload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </div>

        {loading && <div className="text-center text-gray-600 italic">Analyzing your file... 🔄</div>}

        {showResults && (
          <div className="grid grid-cols-1 gap-4 mt-6">
            {filteredCards.map((card, index) => (
              <div key={index} className="bg-white p-4 shadow-md rounded-lg border-l-4 border-blue-500">
                <h2 className="text-xl font-semibold text-blue-700 mb-2">
                  {categoryIcons[card.Category]}{card.Name}
                </h2>
                <p><strong>Language:</strong> {card.Language}</p>
                <p><strong>Description:</strong> {card.Description}</p>
                <p><strong>Rep Response:</strong><br /><em>"{Array.isArray(card.RepResponse) ? card.RepResponse[0] : card.RepResponse}"</em></p>
                <p><strong>Trigger phrase:</strong> <code>{card.Trigger}</code></p>
                <p><strong>Customer Quote:</strong> {card.Quote}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
