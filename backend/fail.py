import pandas as pd
import requests

csv_file_path = 'data\cleaned_tweet_data.csv'  
df = pd.read_csv(csv_file_path)

# Your Google API Key
API_KEY = 'AIzaSyCW1kw1GXXXXXXXXTXIZH3aoXXXXXXXX'  
FACT_CHECK_API_URL = 'https://factchecktools.googleapis.com/v1alpha1/claims:search'

# Function to validate a tweet
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

df['Fact_Check_Result'], df['Rating'] = zip(*df['Tweet'].apply(validate_tweet))

output_csv_path = 'data/fact_checked_tweets.csv'  
df.to_csv(output_csv_path, index=False)

print("Fact checking complete. Results saved to", output_csv_path)
