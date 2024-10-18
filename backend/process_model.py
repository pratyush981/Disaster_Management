import pandas as pd
import numpy as np
import requests
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder

# Load the model
loaded_model = load_model('model/modelkeywords.h5')

data = {
    'text': [
        "flood", "wildfire", "earthquake", "tornado", "tsunami", "hurricane", 
        "drought", "landslide", "avalanche", "cyclone", "storm", "volcano", 
        "blizzard", "heatwave", "typhoon", "hail", "lightning", "fog", 
        "mudslide", "sinkhole", "monsoon", "snowstorm", "windstorm", 
        "tidalwave", "thunderstorm", "sandstorm"
    ],
    'label': [
        "flood", "wildfire", "earthquake", "tornado", "tsunami", "hurricane", 
        "drought", "landslide", "avalanche", "cyclone", "storm", "volcano", 
        "blizzard", "heatwave", "typhoon", "hail", "lightning", "fog", 
        "mudslide", "sinkhole", "monsoon", "snowstorm", "windstorm", 
        "tidalwave", "thunderstorm", "sandstorm"
    ]
}

df_training = pd.DataFrame(data)

# Recreate the tokenizer and label encoder
tokenizer = Tokenizer()
tokenizer.fit_on_texts(df_training['text'])  # Fit the tokenizer on the same data used during training

label_encoder = LabelEncoder()
label_encoder.fit(df_training['label'])

# Load the test data from CSV
csv_file_path = 'data/input.csv'
test_df = pd.read_csv(csv_file_path)

# Ensure the CSV file contains the 'Tweet' column
if 'Tweet' not in test_df.columns:
    raise ValueError("CSV file must contain a 'Tweet' column.")

max_len = 1  # Adjust max_len according to your model's requirements
X_test = tokenizer.texts_to_sequences(test_df['Tweet'])
X_test = pad_sequences(X_test, maxlen=max_len)

def predict_disaster_types(df, model, tokenizer, label_encoder):
    X = tokenizer.texts_to_sequences(df['Tweet'])
    X = pad_sequences(X, maxlen=max_len, padding='post', truncating='post')
    predictions = model.predict(X)
    predicted_labels = label_encoder.inverse_transform([np.argmax(p) for p in predictions])
    return predicted_labels

# Predict disaster types
predicted_disasters = predict_disaster_types(test_df, loaded_model, tokenizer, label_encoder)
test_df['predicted_disaster'] = predicted_disasters

# Fact-checking API setup
API_KEY = 'AIzaSyCW1kw1GXXXXXXXXTXIZH3aoXXXXXXXXX'  
FACT_CHECK_API_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search'

def validate_tweet(tweet):
    params = {
        'query': tweet,
        'key': API_KEY,
    }
    try:
        response = requests.get(FACT_CHECK_API_URL, params=params)
        response.raise_for_status()
        result = response.json()

        print(f"Response URL: {response.url}")
        print(f"Response Status Code: {response.status_code}")

        if 'claims' in result:
            for claim in result['claims']:
                return claim['text'], claim.get('claimReview', [{}])[0].get('textualRating', 'Not Rated')
        return 'No claim found', 'True Data'
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return 'Request failed', 'Unknown'

# Fact-check tweets
test_df['Fact_Check_Result'], test_df['Rating'] = zip(*test_df['Tweet'].apply(validate_tweet))

# Save results to CSV
csv_output_path = 'data/output.csv'
test_df.to_csv(csv_output_path, index=False)

print(f"Predictions and fact-checking results have been saved to '{csv_output_path}'.")
