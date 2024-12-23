import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css'; // Import the CSS file for styling

function Chatbot() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // State to control chatbot visibility

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRec = new window.webkitSpeechRecognition();
      speechRec.continuous = false;
      speechRec.lang = 'en-US';

      speechRec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };

      speechRec.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRec);
    } else {
      alert('Speech Recognition API not supported in this browser.');
    }
  }, []);

  // Handle sending the query to the backend
  const handleSubmit = async () => {
    if (!query) return;

    try {
      const res = await axios.post('http://localhost:5000/chat', { query });
      setResponse(res.data.reply);
    } catch (error) {
      setResponse('Error fetching response from the server.');
    }
  };

  // Start voice recognition
  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  // Toggle chatbot visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Floating Icon to Toggle Chatbot */}
      <div className="chat-icon" onClick={toggleChat}>
        💬
      </div>

      {/* Chatbot Popup */}
      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>AI Doctor Chatbot</h3>
            <button className="close-button" onClick={toggleChat}>
              ✖
            </button>
          </div>
          <div className="chat-body">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
            />
            <div className="chat-controls">
              <button onClick={handleSubmit} className="submit-button">
                Submit
              </button>
              <button onClick={startListening} disabled={isListening} className="voice-button">
                {isListening ? 'Listening...' : '🎤 Voice Input'}
              </button>
            </div>
            <div className="chat-response">
              <p><strong>Response:</strong></p>
              <p>{response}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
