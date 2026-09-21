import React, { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi! 👋 I am VeloGuide AI. How can I help you plan your trip?'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: userMessage
      }
    ]);

    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.reply
          }
        ]);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Sorry, I could not connect to VeloGuide AI. Please try again.'
        }
      ]);

      console.error('Chatbot error:', error);

    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={styles.chatButton}
          title="VeloGuide AI"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>

          {/* Header */}
          <div style={styles.header}>
            <div>
              <div style={styles.title}>VeloGuide AI</div>
              <div style={styles.subtitle}>
                Your travel assistant
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={styles.closeButton}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messages}>

            {messages.map((msg, index) => (
              <div
                key={index}
                style={
                  msg.role === 'user'
                    ? styles.userMessageContainer
                    : styles.botMessageContainer
                }
              >
                <div
                  style={
                    msg.role === 'user'
                      ? styles.userMessage
                      : styles.botMessage
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={styles.botMessageContainer}>
                <div style={styles.botMessage}>
                  Thinking... ✨
                </div>
              </div>
            )}

          </div>

          {/* Input */}
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your trip..."
              style={styles.input}
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              style={styles.sendButton}
              disabled={loading}
            >
              ➤
            </button>
          </div>

        </div>
      )}
    </>
  );
};

const styles = {
  chatButton: {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
    color: '#fff',
    fontSize: '26px',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.35)',
    zIndex: 9999
  },

  chatWindow: {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    width: '360px',
    height: '500px',
    background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '18px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 9999
  },

  header: {
    padding: '16px 18px',
    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  title: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#fff'
  },

  subtitle: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.8)',
    marginTop: '3px'
  },

  closeButton: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '28px',
    cursor: 'pointer'
  },

  messages: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  userMessageContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },

  botMessageContainer: {
    display: 'flex',
    justifyContent: 'flex-start'
  },

  userMessage: {
    background: '#4f46e5',
    color: '#fff',
    padding: '10px 13px',
    borderRadius: '14px 14px 3px 14px',
    maxWidth: '80%',
    fontSize: '14px',
    lineHeight: '1.4'
  },

  botMessage: {
    background: '#1e293b',
    color: '#e2e8f0',
    padding: '10px 13px',
    borderRadius: '14px 14px 14px 3px',
    maxWidth: '80%',
    fontSize: '14px',
    lineHeight: '1.4'
  },

  inputContainer: {
    display: 'flex',
    padding: '12px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    gap: '8px'
  },

  input: {
    flex: 1,
    background: '#1e293b',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '10px 12px',
    color: '#fff',
    outline: 'none',
    fontSize: '13px'
  },

  sendButton: {
    width: '42px',
    border: 'none',
    borderRadius: '10px',
    background: '#4f46e5',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer'
  }
};

export default Chatbot;