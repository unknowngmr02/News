from flair.models import SequenceTagger
from flair.data import Sentence

# Load the pre-trained NER tagger
tagger = SequenceTagger.load('ner')

def extract_cities(sentence_text):
    sentence = Sentence(sentence_text)
    tagger.predict(sentence)

    # Extract entities labeled as LOC (Location) or GPE (Geopolitical Entity)
    cities = [entity.text for entity in sentence.get_spans('ner') if entity.tag in ['LOC', 'GPE']]
    return list(set(cities))

# Test
sentences = [
    "What's the weather like in dhanbad and Mumbai?",
    "Tell me about the temperature in Palamu and Delhi.",
    "How's it going in Ranchi today?"
]

for sentence in sentences:
    print(f"Cities in '{sentence}': {extract_cities(sentence)}")
