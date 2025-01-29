from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai  # Gemini API

app = Flask(__name__)
CORS(app)

# Set up Gemini API
genai.configure(api_key="AIzaSyAspdTpDwuj5s93jEOnalVm0I7RzeujAqw")

# Set your Google API keys
google_api_key = "AIzaSyCuYbMJb9gmaoZ_83qpy3offSaZAPKXqn8"
google_cx = "30e5aa7764ec74b54"

def google_search(query):
    """Perform a Google search and return top URLs."""
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "q": query,
        "key": google_api_key,
        "cx": google_cx,
        "num": 3,  # Number of results to fetch
    }
    response = requests.get(url, params=params)
    results = response.json()
    urls = [item['link'] for item in results.get('items', [])]
    return urls

def fetch_content(url):
    """Fetch content from a given URL."""
    try:
        # Skip LinkedIn and Quora URLs as they are not suitable for summarization
        if "linkedin.com" in url or "quora.com" in url:
            return None

        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract text from common HTML tags
        text_elements = soup.find_all(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        content = ' '.join(element.get_text() for element in text_elements)

        # Return None if the content is too short or irrelevant
        if len(content.split()) < 50:  # Minimum 50 words
            return None

        return content
    except Exception as e:
        print(f"Error fetching content from {url}: {e}")
        return None

def summarize_content(content):
    """Summarize the content using Gemini API."""
    try:
        model = genai.GenerativeModel("gemini-pro")  # Using Gemini Pro model
        response = model.generate_content(f"Summarize this research work in 2-3 sentences:\n\n{content}")
        return response.text.strip()
    except Exception as e:
        print(f"Error summarizing content: {e}")
        return None

@app.route('/analyze-research', methods=['POST'])
def analyze_research():
    data = request.json
    doctor_name = data.get('doctor_name', '')

    # Perform a Google search
    query = f"{doctor_name} research work"
    search_results = google_search(query)

    # If no search results are found, return a specific message
    if not search_results:
        return jsonify([{"url": "N/A", "summary": "No research papers found for this doctor."}])

    # Fetch and summarize content from the top URLs
    summaries = []
    for url in search_results:
        try:
            content = fetch_content(url)
            if content:
                summary = summarize_content(content)
                if summary:
                    summaries.append({"url": url, "summary": summary})
                else:
                    print(f"Skipping {url}: Failed to summarize content.")
            else:
                print(f"Skipping {url}: Failed to fetch or irrelevant content.")
        except Exception as e:
            print(f"Skipping {url} due to error: {e}")
            continue  # Skip to the next URL if an error occurs

    # If no summaries were generated, return a default message
    if not summaries:
        return jsonify([{"url": "N/A", "summary": "No relevant research papers found for this doctor."}])

    return jsonify(summaries)

if __name__ == "__main__":
    app.run(debug=True)
