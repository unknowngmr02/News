from flask import Flask, request, jsonify
from flair.models import SequenceTagger
from flair.data import Sentence
from transformers import pipeline

app = Flask(__name__)

# Load Flair's NER model
flair_tagger = SequenceTagger.load('ner')

# Load Hugging Face transformers NER pipeline
transformer_ner = pipeline('ner', model='dslim/bert-base-NER', aggregation_strategy="simple")

@app.route('/process-query', methods=['POST'])
def process_query():
    data = request.json
    user_input = data.get('query', '')

    if not user_input:
        return jsonify({"error": "Missing query parameter"}), 400

    detected_cities = set()
    detected_keywords = set()

    # 🔹 Flair NER for city detection
    flair_sentence = Sentence(user_input)
    flair_tagger.predict(flair_sentence)

    for entity in flair_sentence.get_spans('ner'):
        print(f"[Flair] Text: {entity.text}, Label: {entity.tag}")
        if entity.tag in ["LOC", "GPE"]:  # LOC = Location, GPE = Geopolitical Entity
            detected_cities.add(entity.text)
        elif entity.tag in ["ORG", "PRODUCT", "EVENT"]:
            detected_keywords.add(entity.text)

    # 🔹 Hugging Face Transformer NER
    transformer_entities = transformer_ner(user_input)
    for ent in transformer_entities:
        print(f"[Transformer] Text: {ent['word']}, Label: {ent['entity_group']}")
        if ent['entity_group'] in ["LOC", "GPE"]:
            detected_cities.add(ent['word'])
        elif ent['entity_group'] in ["ORG", "PRODUCT", "EVENT"]:
            detected_keywords.add(ent['word'])

    # ✅ Response with default values if no detection
    response = {
        "city": next(iter(detected_cities), "Delhi"),
        "keyword": next(iter(detected_keywords), "news")
    }

    print("✅ Final Extracted Data:", response)
    return jsonify(response)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
