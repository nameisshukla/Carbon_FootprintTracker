import { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! 🌱 I'm your Eco Assistant. How can I help you lower your carbon footprint today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Don't show chatbot if not logged in
  if (!user) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat', { message: userMessage.text });
      const botMessage = { id: Date.now() + 1, text: response.data.reply, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = { id: Date.now() + 1, text: "Sorry, I'm having trouble connecting to the server right now. 😔", sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="glass-card"
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '20px',
              width: '350px',
              height: '500px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              padding: '0',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bot size={24} />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Eco Assistant</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: 'rgba(15, 23, 42, 0.4)'
            }}>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  style={{
                    display: 'flex',
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                    gap: '10px',
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: msg.sender === 'user' ? 'var(--color-secondary)' : 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {msg.sender === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="white" />}
                  </div>
                  <div style={{
                    background: msg.sender === 'user' ? 'var(--color-secondary)' : 'rgba(255,255,255,0.1)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    borderTopRightRadius: msg.sender === 'user' ? '4px' : '16px',
                    borderTopLeftRadius: msg.sender === 'bot' ? '4px' : '16px',
                    maxWidth: '75%',
                    fontSize: '0.95rem',
                    lineHeight: '1.4'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Bot size={16} color="white" />
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '16px', borderTopLeftRadius: '4px' }}>
                    <Loader2 size={18} color="var(--color-text-muted)" style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSend}
              style={{
                padding: '16px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(15, 23, 42, 0.6)',
                display: 'flex',
                gap: '10px'
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your footprint..."
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '10px 16px',
                  color: 'white',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
                  opacity: (!input.trim() || isLoading) ? 0.5 : 1
                }}
              >
                <Send size={18} color="white" style={{ marginLeft: '2px' }} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
          border: 'none',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 999
        }}
      >
        {isOpen ? <X size={28} color="white" /> : <MessageCircle size={28} color="white" />}
      </motion.button>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
