import pandas as pd
import json
from io import StringIO

def handler(event, context=None):
    try:
        if event.get("httpMethod") != "POST":
            return {
                "statusCode": 405,
                "body": json.dumps({"error": "Method not allowed"})
            }

        body = event.get("body", "")
        df = pd.read_csv(StringIO(body))

        keyword_config = {
            'Cost/Price': {
                'triggers': ['price', 'cost', 'budget', 'fee', 'rate', 'quote', 'pricing', 'how much', 'what does it run', 'expensive', 'cheap', 'charges', 'amount', 'estimate', 'affordability'],
                'response': "Can you share more about your budget or expectations on pricing so we can align better?"
            },
            'Price Complaints': {
                'triggers': ['too expensive', 'overpriced', 'not worth', 'can’t afford', 'that’s steep', 'out of our range', 'a bit much', 'beyond budget', 'pricey', 'not in our price range', 'high cost'],
                'response': "We understand pricing is important. Would you be open to discussing what value you expect at that price point?"
            },
            'Contract Claim': {
                'triggers': ['contract', 'agreement', 'signed', 'terms', 'deal', 'paperwork', 'arrangement', 'documentation', 'we agreed', 'what was promised', 'signed off'],
                'response': "Can you clarify the current agreement or terms you’re referring to?"
            },
            'Contract Time': {
                'triggers': ['duration', 'renewal', 'start date', 'end date', 'term', 'length of agreement', 'valid until', 'commitment period', 'expires', 'timeline', 'how long does it last', 'time frame'],
                'response': "When does your current contract expire or are you looking for flexibility in term length?"
            },
            'Installation': {
                'triggers': ['install', 'installation', 'set up', 'setup', 'configured', 'configure', 'delivery', 'setting it up', 'implementation', 'get it running', 'hooking it up', 'initial setup', 'getting started hardware-wise', 'deployed'],
                'response': "Would you like to walk through how we handle setup and installation logistics?"
            },
            'Onboarding': {
                'triggers': ['onboarding', 'training', 'kickoff', 'walkthrough', 'setup session', 'orientation', 'get started', 'first steps', 'introduction', 'ramp-up', 'new user help'],
                'response': "Would you like a preview of what the onboarding process looks like with our team?"
            }
        }

        cards = []
        for _, row in df.iterrows():
            content = str(row.get('content', '')).lower()
            for category, config in keyword_config.items():
                match = next((kw for kw in config['triggers'] if kw in content), None)
                if match:
                    cards.append({
                        'Name': f"{category} Trigger",
                        'Language': 'English',
                        'Description': f"Triggers when a customer mentions '{match}' indicating {category.lower()}.",
                        'Rep Response': config['response'],
                        'Trigger Phrase': match,
                        'Customer Quote': row.get('content', '')
                    })
                    break

        return {
            "statusCode": 200,
            "body": json.dumps(cards),
            "headers": {
                "Content-Type": "application/json"
            }
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
