import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Xin chào! Tôi là chatbot hỗ trợ. Bạn cần giúp gì không?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://localhost:7013/api/Chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage
        })
      });

      let botResponse;
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.data && data.data.reply) {
          botResponse = data.data.reply;
        } else if (data.reply) {
          botResponse = data.reply;
        } else if (data.response) {
          botResponse = data.response;
        } else if (data.message) {
          botResponse = data.message;
        } else {
          botResponse = 'Tôi đã nhận được tin nhắn của bạn!';
        }
      } else {
        throw new Error('API Error');
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling API:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[500px] flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-orange-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Chat Support</h3>
                <p className="text-xs opacity-90">Luôn sẵn sàng hỗ trợ</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === 'bot' ? (
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-500 rounded-full p-2 flex-shrink-0">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                      <div className="bg-white text-gray-800 rounded-2xl rounded-xl px-4 py-1 shadow-sm border max-w-[280px]">
                      <span className="text-xs text-gray-500 mb-1 font-medium text-orange-500">ChatBot</span>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="bg-orange-500 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[280px]">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs text-blue-100 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 rounded-full p-2 flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1 font-medium">ChatBot</span>
                  <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>


          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex space-x-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 resize-none max-h-20 text-sm"
                rows="1"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="cursor-pointer bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-3xl p-3 transition-colors flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;