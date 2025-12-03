import { useState, useEffect, useRef } from "react";
import { CheckCheck, Phone, ChevronLeft, Plus, Camera, Mic, Smile } from "lucide-react";

interface Message {
  id: number;
  text: string;
  time: string;
  isUser: boolean;
  isRead?: boolean;
}

const allMessages: Message[] = [
  { id: 1, text: "Oi tudo bem?", time: "14:25", isUser: true, isRead: true },
  { id: 2, text: "Queria fazer um orçamento", time: "14:25", isUser: true, isRead: true },
  { id: 3, text: "Olá! Para seguirmos com seu orçamento, por favor me informe a lista dos produtos ou materiais que deseja cotar (inclua quantidade e descrição de cada item se possível). Assim consigo preparar o orçamento certinho para você.", time: "14:26", isUser: false },
  { id: 4, text: "Quero o preço do saco de gesso 40 kilos e fundo preparador 18litros suvinil", time: "14:26", isUser: true, isRead: true },
  { id: 5, text: "Segue o orçamento solicitado:\n\n• 1 saco de Gesso 40 KG (Gesso Pilares): R$ 63,50\n• 1 litro de Fundo Preparador Parede Suvinil GL: R$ 120,10\n\nTotal: R$ 183,60\n\nPor favor, revise os itens e valores. Se estiver tudo certo ou precisar adicionar, remover ou alterar algum item, é só me avisar!", time: "14:27", isUser: false },
  { id: 6, text: "Perfeito!", time: "14:27", isUser: true, isRead: true },
];

const TypingIndicator = () => (
  <div className="flex justify-start animate-fade-in">
    <div className="relative max-w-[80%] px-4 py-3 rounded-lg shadow-sm bg-white rounded-tl-none">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-[#667781] rounded-full animate-bounce" style={{ animationDelay: "0ms", animationDuration: "0.6s" }} />
        <span className="w-2 h-2 bg-[#667781] rounded-full animate-bounce" style={{ animationDelay: "150ms", animationDuration: "0.6s" }} />
        <span className="w-2 h-2 bg-[#667781] rounded-full animate-bounce" style={{ animationDelay: "300ms", animationDuration: "0.6s" }} />
      </div>
    </div>
  </div>
);

const WhatsAppChat = () => {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  useEffect(() => {
    // Loop: reset when all messages are shown
    if (currentIndex >= allMessages.length) {
      const resetTimer = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentIndex(0);
      }, 3000); // Pause before restarting
      return () => clearTimeout(resetTimer);
    }

    const currentMessage = allMessages[currentIndex];
    const isAIMessage = !currentMessage.isUser;
    
    // Show typing indicator for AI messages
    if (isAIMessage) {
      setIsTyping(true);
      const typingDuration = Math.min(3500, 1500 + currentMessage.text.length * 12);
      
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
        setVisibleMessages(prev => [...prev, currentMessage]);
        setCurrentIndex(prev => prev + 1);
      }, typingDuration);

      return () => clearTimeout(typingTimer);
    } else {
      // User messages appear with a slower delay
      const messageTimer = setTimeout(() => {
        setVisibleMessages(prev => [...prev, currentMessage]);
        setCurrentIndex(prev => prev + 1);
      }, 1200);

      return () => clearTimeout(messageTimer);
    }
  }, [currentIndex]);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#e5ddd5] font-sans">
      {/* Header */}
      <header className="flex items-center gap-3 px-2 py-2 bg-[#075e54] text-white">
        <button className="p-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 rounded-full bg-[#dfe5e7] flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-[#f5c842] flex items-center justify-center">
            <span className="text-xs font-bold text-[#075e54]">Orcei</span>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-base">Orcei</h1>
          <p className="text-xs text-green-200">
            {isTyping ? "digitando..." : "online"}
          </p>
        </div>
        <button className="p-2">
          <Phone className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Background */}
      <div 
        ref={chatRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9d6c3' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Date Badge */}
        <div className="flex justify-center mb-2">
          <span className="bg-[#e1f2fb] text-[#54656f] text-xs px-3 py-1 rounded-lg shadow-sm">
            Hoje
          </span>
        </div>

        {/* Encryption Notice */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#fffdcf] text-[#54656f] text-xs px-4 py-2 rounded-lg max-w-[85%] text-center shadow-sm">
            <span className="mr-1">🔒</span>
            As mensagens e ligações são protegidas com a criptografia de ponta a ponta. Somente as pessoas que fazem parte da conversa podem ler, ouvir e compartilhar esse conteúdo.{" "}
            <span className="text-[#027eb5] font-medium">Saiba mais</span>
          </div>
        </div>

        {/* Messages */}
        {visibleMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-scale-in`}
            style={{ animationDuration: "0.2s" }}
          >
            <div
              className={`relative max-w-[80%] px-3 py-2 rounded-lg shadow-sm ${
                message.isUser
                  ? "bg-[#dcf8c6] rounded-tr-none"
                  : "bg-white rounded-tl-none"
              }`}
            >
              <p className="text-[#303030] text-sm whitespace-pre-line pr-14">
                {message.text}
              </p>
              <div className="absolute bottom-1 right-2 flex items-center gap-1">
                <span className="text-[10px] text-[#667781]">{message.time}</span>
                {message.isUser && (
                  <CheckCheck className="w-4 h-4 text-[#53bdeb]" />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 px-2 py-2 bg-[#f0f0f0]">
        <button className="p-2 text-[#54656f]">
          <Plus className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2">
          <button className="text-[#54656f] mr-2">
            <Smile className="w-6 h-6" />
          </button>
          <input
            type="text"
            placeholder="Mensagem"
            className="flex-1 bg-transparent outline-none text-sm text-[#303030]"
          />
          <button className="text-[#54656f] ml-2">
            <Camera className="w-6 h-6" />
          </button>
        </div>
        <button className="p-2 bg-[#075e54] rounded-full text-white">
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default WhatsAppChat;
