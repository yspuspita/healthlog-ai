import { useState, useEffect, useRef } from 'react';
import { sendChatMessage, clearChatHistory } from '../api/client';
import { Send, Trash2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Aku HealthLog AI. Aku punya akses ke data kesehatanmu dan siap membantu menjawab pertanyaanmu. Tanyakan apa saja tentang pola kesehatanmu!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await sendChatMessage(userMessage);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.data.response }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Maaf, terjadi error. Coba lagi ya.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (confirm('Hapus semua riwayat chat?')) {
      try {
        await clearChatHistory();
        setMessages([
          {
            role: 'assistant',
            content: 'Riwayat chat telah dihapus. Mulai percakapan baru!'
          }
        ]);
      } catch (error) {
        console.error('Error clearing chat:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl h-[calc(100vh-130px)] md:h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-text-primary mb-1 md:mb-2">
            💬 Tanya HealthLog AI
          </h1>
          <p className="text-sm md:text-base text-text-secondary">Chat dengan AI yang punya akses ke data kesehatanmu</p>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-4 py-2 text-sm text-danger border border-danger rounded-btn hover:bg-danger hover:text-white transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white border border-[#F5CBCB] rounded-card shadow-card overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-bubble text-base leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-accent text-white rounded-br-sm'
                  : 'bg-[#FBEFEF] text-text-primary rounded-bl-sm prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0'
              }`}
            >
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold" {...props} />
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#FBEFEF] px-4 py-3 rounded-bubble rounded-bl-sm flex gap-1">
              <div className="typing-dot w-2 h-2 bg-accent rounded-full"></div>
              <div className="typing-dot w-2 h-2 bg-accent rounded-full"></div>
              <div className="typing-dot w-2 h-2 bg-accent rounded-full"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanyakan sesuatu tentang kesehatanmu..."
          className="flex-1 bg-white border-[1.5px] border-[#F5CBCB] rounded-input px-4 py-3 text-text-secondary placeholder-text-muted focus:border-accent focus:shadow-input focus:outline-none transition-all"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-accent hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-btn shadow-btn transition-all duration-150 flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              Kirim
            </>
          )}
        </button>
      </form>
    </div>
  );
}
