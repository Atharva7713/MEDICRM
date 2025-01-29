import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function ChatWithRAG() {
  const location = useLocation();
  const { selectedFiles } = location.state || {};
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      alert('Please enter a question.');
      return;
    }

    setLoading(true);
    setAnswer('');

    try {
      const response = await fetch('http://127.0.0.1:5000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          pdf_paths: selectedFiles.map((file: any) => file.url), // Send all selected file URLs
        }),
      });

      const data = await response.json();

      if (data.answer) {
        setAnswer(data.answer);
      } else {
        setAnswer('Error: ' + (data.error || 'Failed to fetch the answer.'));
      }
    } catch (error) {
      console.error('Error fetching answer:', error);
      setAnswer('Error: Unable to fetch data from the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Chat with RAG Model</h1>
      <p className="mb-4 text-gray-600">
        Selected Documents: {selectedFiles.map((file: any) => file.name).join(', ')}
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about the documents..."
        className="w-full px-4 py-2 border rounded-md mb-4"
        rows={4}
      />

      <button
        onClick={handleAskQuestion}
        disabled={loading}
        className={`px-4 py-2 rounded-md text-white ${
          loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loading ? 'Fetching answer...' : 'Ask Question'}
      </button>

      {answer && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="font-bold text-gray-700">Answer:</h3>
          <p className="text-gray-800">{answer}</p>
        </div>
      )}
    </div>
  );
}

