import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, AlertCircle, Sparkles } from 'lucide-react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hi! I\'m your AI Career Assistant. Ask me anything about learning new technologies, career advice, or skill development!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fallback responses for when API fails
  const fallbackResponses = {
    nodejs: {
      answer: "Given your Django/DRF and React skills, learning Node.js will be a smooth transition for backend work.\n\n1. **Master Modern JavaScript (ES6+):** This is your new backend language.\n2. **Node.js Core & Express.js:** Learn server-side logic, routing, and middleware, drawing parallels to Django views and DRF.\n3. **Build a REST API:** Apply your DRF knowledge by creating a simple CRUD API with Node.js, Express, and a database.\n\nFocus on building a project to connect these concepts quickly."
    },
    react: {
      answer: "React is a powerful library for building user interfaces. Here's how to master it:\n\n1. **Learn the Fundamentals:** Understand components, props, state, and JSX syntax.\n2. **Hooks:** Master useState, useEffect, useContext, and custom hooks.\n3. **State Management:** Learn Redux or Context API for complex applications.\n4. **Build Projects:** Create real-world applications to solidify your knowledge.\n\nStart with the official React documentation and build small projects incrementally."
    },
    python: {
      answer: "Python is an excellent language for beginners and professionals alike:\n\n1. **Basics:** Variables, data types, control structures, and functions.\n2. **OOP:** Classes, inheritance, and design patterns.\n3. **Frameworks:** Django for web development, Flask for lightweight apps.\n4. **Data Science:** NumPy, Pandas, and Matplotlib for data analysis.\n\nPractice by building CLI tools, web scrapers, or automation scripts."
    },
    career: {
      answer: "Here's my advice for career growth in tech:\n\n1. **Continuous Learning:** Stay updated with new technologies and trends.\n2. **Build a Portfolio:** Create projects that showcase your skills.\n3. **Network:** Attend meetups, conferences, and engage on LinkedIn.\n4. **Specialize:** Become an expert in a specific domain or technology.\n5. **Soft Skills:** Communication, teamwork, and problem-solving are crucial.\n\nFocus on consistent growth and don't be afraid to take on challenging projects."
    },
    default: {
      answer: "That's a great question! Here are some general tips:\n\n1. **Break it Down:** Divide complex topics into smaller, manageable parts.\n2. **Practice Regularly:** Consistency is key to mastering any skill.\n3. **Build Projects:** Apply what you learn through hands-on projects.\n4. **Seek Feedback:** Join communities and get code reviews.\n5. **Stay Curious:** Keep exploring and experimenting with new ideas.\n\nWhat specific area would you like to dive deeper into?"
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSmartFallbackResponse = (query) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('node') || lowerQuery.includes('nodejs') || lowerQuery.includes('express')) {
      return fallbackResponses.nodejs;
    } else if (lowerQuery.includes('react') || lowerQuery.includes('jsx') || lowerQuery.includes('component')) {
      return fallbackResponses.react;
    } else if (lowerQuery.includes('python') || lowerQuery.includes('django') || lowerQuery.includes('flask')) {
      return fallbackResponses.python;
    } else if (lowerQuery.includes('career') || lowerQuery.includes('job') || lowerQuery.includes('advice')) {
      return fallbackResponses.career;
    } else {
      return fallbackResponses.default;
    }
  };

  const fetchAIResponse = async (userMessage) => {
    try {
      // Simulate API call - replace with your actual endpoint
      const response = await fetch('https://api.example.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
        signal: AbortSignal.timeout(8000) // 8 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.warn('API call failed, using fallback:', err.message);
      // Return fallback response based on user's question
      return getSmartFallbackResponse(userMessage);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setError('');

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    setIsLoading(true);

    try {
      // Fetch AI response (with automatic fallback)
      const aiResponse = await fetchAIResponse(userMessage);
      
      // Add bot message
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.answer || aiResponse.message || 'I apologize, but I couldn\'t generate a response. Please try rephrasing your question.',
        timestamp: new Date(),
        isFromFallback: !aiResponse.answer?.includes('Django')
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Error in chat:', err);
      
      // Add error message as bot response
      const errorMsg = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I encountered an issue processing your request. Here\'s some general advice instead:\n\n' + fallbackResponses.default.answer,
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content) => {
    // Simple markdown-like formatting
    return content.split('\n').map((line, idx) => {
      // Bold text
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Numbered lists
      if (/^\d+\./.test(line)) {
        return <li key={idx} className="ml-4 mb-2" dangerouslySetInnerHTML={{ __html: line }} />;
      }
      
      // Regular paragraph
      return line.trim() ? (
        <p key={idx} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />
      ) : (
        <br key={idx} />
      );
    });
  };

  const exampleQuestions = [
    "How do I learn Node.js?",
    "What should I learn after React?",
    "Career advice for developers",
    "How to improve my Python skills?"
  ];

  const handleExampleClick = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '90vh', maxHeight: '800px' }}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 sm:p-6 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              AI Career Assistant
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
            </h1>
            <p className="text-xs sm:text-sm text-teal-100">Your personalized learning companion</p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'bot' && (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                }`}
              >
                <div className="text-sm sm:text-base leading-relaxed">
                  {formatMessage(message.content)}
                </div>
                <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-teal-100' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin text-teal-600" />
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Example Questions */}
        {messages.length === 1 && (
          <div className="px-4 sm:px-6 py-3 bg-white border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(question)}
                  className="text-xs sm:text-sm px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors border border-teal-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-white border-t border-gray-200 flex-shrink-0">
          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-red-700">{error}</span>
            </div>
          )}
          
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about tech careers..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline text-sm sm:text-base">Send</span>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            💡 Powered by AI • Responses are generated automatically
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;