from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import Pipeline
import numpy as np

app = FastAPI()

class ComplaintText(BaseModel):
    description: str
# A small, diverse dataset to bootstrap the model
training_data = [
    # POTHOLE
    ("There is a large pothole in the middle of the road", "POTHOLE"),
    ("The asphalt is damaged and dangerous for cars", "POTHOLE"),
    ("Big crater in the street causing traffic issues", "POTHOLE"),
    ("Road surface is uneven and broken", "POTHOLE"),
    ("My car got damaged by a hole in the road", "POTHOLE"),
    ("The street needs resurfacing immediately", "POTHOLE"),
    ("Dangerous crack in the pavement", "POTHOLE"),
    ("Sinkhole appearing near the sidewalk", "POTHOLE"),

    # GARBAGE
    ("Trash is overflowing from the bin", "GARBAGE"),
    ("Someone dumped waste on the corner", "GARBAGE"),
    ("Garbage hasn't been collected for weeks", "GARBAGE"),
    ("There is a pile of rubbish blocking the path", "GARBAGE"),
    ("Dirty street with litter everywhere", "GARBAGE"),
    ("Illegal dumping site found near the park", "GARBAGE"),
    ("Food waste rotting on the street", "GARBAGE"),
    ("Please clean up this mess", "GARBAGE"),

    # LIGHT
    ("The streetlight is not working properly", "LIGHT"),
    ("It is too dark to walk here at night", "LIGHT"),
    ("Street lamp is flickering constantly", "LIGHT"),
    ("No lights in this area, very dangerous", "LIGHT"),
    ("Bulb is broken and needs replacement", "LIGHT"),
    ("The whole block is in darkness", "LIGHT"),
    ("Light post has fallen down", "LIGHT"),

    # WATER
    ("Water pipe bust and flooding the street", "WATER"),
    ("No water supply in our area since morning", "WATER"),
    ("Drainage is clogged and overflowing", "WATER"),
    ("Sewage water leaking onto the road", "WATER"),
    ("Low water pressure in the neighborhood", "WATER"),
    ("Dirty water coming from the tap", "WATER"),
    ("Storm drain is blocked", "WATER"),

    # NOISE
    ("Loud music playing late at night", "NOISE"),
    ("Construction noise is unbearable", "NOISE"),
    ("Neighbors are shouting and fighting", "NOISE"),
    ("Barking dogs keeping me awake", "NOISE"),
    ("Factory noise pollution", "NOISE"),
    ("Loud speakers used illegally", "NOISE"),

    # TRAFFIC
    ("Car parked illegally blocking the driveway", "TRAFFIC"),
    ("Traffic signal is not working", "TRAFFIC"),
    ("Gridlock at the main intersection", "TRAFFIC"),
    ("Vehicle abandoned on the roadside", "TRAFFIC"),
    ("Wrong way driving observed", "TRAFFIC"),
    ("Bus stop is blocked by parked cars", "TRAFFIC"),

    # OTHER
    ("Stray dogs chasing people", "OTHER"),
    (" Graffiti on the public wall", "OTHER"),
    ("Public park gate is broken", "OTHER"),
    ("Suspicious activity in the park", "OTHER"),
    ("Tree branch fell on the power line", "OTHER"),
    ("Playground equipment is damaged", "OTHER"),
    ("I need help with a general inquiry", "OTHER")
]

# Separate text and labels
X_train = [text for text, label in training_data]
y_train = [label for text, label in training_data]

# --- ML Pipeline ---
# 1. Vectorize text (convert to word counts)
# 2. Apply TF-IDF (normalize counts)
# 3. Train Classifier (SGD/SVM)
text_clf = Pipeline([
    ('vect', CountVectorizer(stop_words='english', ngram_range=(1, 2))),
    ('tfidf', TfidfTransformer()),
    ('clf', SGDClassifier(loss='hinge', penalty='l2',
                          alpha=1e-3, random_state=42,
                          max_iter=5, tol=None)),
])

# Train on startup
text_clf.fit(X_train, y_train)
print("✅ AI Model Trained Successfully")

@app.post("/predict")
def predict(data: ComplaintText):
    try:
        # Predict the category
        predicted = text_clf.predict([data.description])[0]
        return {"category": predicted}
    except Exception as e:
        print(f"Prediction error: {e}")
        return {"category": "OTHER"}
