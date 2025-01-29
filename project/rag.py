import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from PyPDF2 import PdfReader
import google.generativeai as genai
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure the Gemini API
genai.configure(api_key="AIzaSyAspdTpDwuj5s93jEOnalVm0I7RzeujAqw")
model_name = "gemini-1.5-flash"

# Helper function to download PDF
def download_pdf(url):
    response = requests.get(url)
    if response.status_code == 200:
        temp_file = f"temp_{os.path.basename(url)}.pdf"
        with open(temp_file, "wb") as f:
            f.write(response.content)
        return temp_file
    else:
        raise Exception(f"Failed to download file from {url}. HTTP Status: {response.status_code}")

# Function to extract text from a PDF
def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    text = [page.extract_text() for page in reader.pages]
    return text

# Function to compute embeddings
def get_embedding(text, model="models/text-embedding-004"):
    text = text.replace("\n", " ")
    result = genai.embed_content(model=model, content=text)
    return result['embedding']

# Function to compute similarity
def compute_similarity(embedding1, embedding2):
    return cosine_similarity([embedding1], [embedding2])[0][0]

# RAG Query function for multiple files
def query(question, pdf_paths, model_name=model_name):
    all_texts = []
    all_embeddings = []

    # Process all PDFs
    for pdf_path in pdf_paths:
        texts = extract_text_from_pdf(pdf_path)
        embeddings = [get_embedding(text) for text in texts]
        all_texts.extend(texts)
        all_embeddings.extend(embeddings)

    # Embed the question
    question_embedding = get_embedding(question)

    # Compute similarities
    similarities = [compute_similarity(question_embedding, emb) for emb in all_embeddings]
    top_indices = np.argsort(similarities)[::-1][:3]
    context = "\n".join([all_texts[i] for i in top_indices])

    # Generate response
    chat_session = genai.GenerativeModel(model_name=model_name).start_chat(history=[])
    response = chat_session.send_message(
        f"You are a helpful assistant. Use the following context to answer the question:\n\n{context}\n\nQuestion: {question}"
    )
    return response.text

# API endpoint
@app.route('/query', methods=['POST'])
def handle_query():
    data = request.json
    question = data.get('question')
    pdf_paths = data.get('pdf_paths')  # List of URLs or local paths

    if not question:
        return jsonify({"error": "Question is required"}), 400
    if not pdf_paths or not isinstance(pdf_paths, list):
        return jsonify({"error": "PDF paths must be a list"}), 400

    try:
        temp_files = []

        # Download files if URLs are provided
        for i, path in enumerate(pdf_paths):
            if path.startswith("http://") or path.startswith("https://"):
                temp_files.append(download_pdf(path))
            else:
                temp_files.append(path)

        # Process the PDFs
        answer = query(question, temp_files)

        # Clean up temporary files
        for temp_file in temp_files:
            if temp_file.startswith("temp_") and os.path.exists(temp_file):
                os.remove(temp_file)

        return jsonify({"answer": answer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

