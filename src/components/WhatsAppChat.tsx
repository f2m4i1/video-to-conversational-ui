import { useState, useEffect, useRef } from "react";
import { CheckCheck, Phone, ChevronLeft, Plus, Camera, Mic, Smile, ExternalLink } from "lucide-react";
import botafogoShirt from "@/assets/botafogo-away-25-26.webp";

interface LinkPreview {
  image: string;
  title: string;
  domain: string;
  url: string;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isUser: boolean;
  isRead?: boolean;
  linkPreview?: LinkPreview;
}

type ConversationType = "construcao" | "vestuario" | "autopecas";

const construcaoMessages: Message[] = [
  { id: 1, text: "Oi tudo bem?", time: "14:25", isUser: true, isRead: true },
  { id: 2, text: "Queria fazer um orçamento de gesso 40 kilos e fundo preparador 18litros suvinil", time: "14:25", isUser: true, isRead: true },
  { id: 3, text: "Segue o orçamento solicitado:\n\n• 1 saco de Gesso 40 KG (Gesso Pilares): R$ 63,50\n• 1 litro de Fundo Preparador Parede Suvinil GL: R$ 120,10\n\nTotal: R$ 183,60\n\nPor favor, revise os itens e valores. Se estiver tudo certo ou precisar adicionar, remover ou alterar algum item, é só me avisar!", time: "14:26", isUser: false },
  { id: 4, text: "Perfeito!", time: "14:26", isUser: true, isRead: true },
];

const vestuarioMessages: Message[] = [
  { id: 1, text: "Opa, tudo certo?", time: "13:57", isUser: true, isRead: true },
  { 
    id: 2, 
    text: "", 
    time: "13:57", 
    isUser: true, 
    isRead: true,
    linkPreview: {
      image: botafogoShirt,
      title: "Camisa Botafogo Reebok Away 25/26 - Botafogo Store | Aura90",
      domain: "store.botafogo.com.br",
      url: "https://store.botafogo.com.br/camisa-botafogo-reebok-away-2526/p?skuId=343307"
    }
  },
  { id: 3, text: "Vocês tem essa ai na loja do Nova América, tamanho G?", time: "13:57", isUser: true, isRead: true },
  { id: 4, text: "Boa tarde, tudo bem? Temos aqui no estoque sim!", time: "13:59", isUser: false },
  { id: 5, text: "R$ 399,00 à vista ou 5x R$ 79,00", time: "13:59", isUser: false },
  { id: 6, text: "Perfeito!", time: "14:01", isUser: true, isRead: true },
  { id: 7, text: "Segura pra mim que vou aí mais tarde", time: "14:01", isUser: true, isRead: true },
];

const autopecasMessages: Message[] = [
  { id: 1, text: "Boa tarde!", time: "15:10", isUser: true, isRead: true },
  { id: 2, text: "Vocês tem pastilha de freio dianteira pro Civic 2019?", time: "15:10", isUser: true, isRead: true },
  { id: 3, text: "Boa tarde! Temos sim, deixa eu verificar as opções disponíveis pra você.", time: "15:11", isUser: false },
  { id: 4, text: "Encontrei 2 opções:\n\n• Pastilha Freio Dianteira Cobreq (original): R$ 189,90\n• Pastilha Freio Dianteira Fras-le: R$ 149,90\n\nAs duas são de ótima qualidade. A Cobreq é a mesma especificação da original Honda.", time: "15:12", isUser: false },
  { id: 5, text: "Vou querer a Cobreq mesmo!", time: "15:13", isUser: true, isRead: true },
  { id: 6, text: "Pode entregar aqui na Arnaldo Quintela, 413", time: "15:13", isUser: true, isRead: true },
  { id: 7, text: "Legal, vou transferir para um atendente para combinar os detalhes da entrega 🙂", time: "15:14", isUser: false },
];

const conversationData: Record<ConversationType, { messages: Message[]; label: string }> = {
  construcao: { messages: construcaoMessages, label: "Construção" },
  vestuario: { messages: vestuarioMessages, label: "Vestuário" },
  autopecas: { messages: autopecasMessages, label: "Auto Peças" },
};

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

const LinkPreviewCard = ({ preview }: { preview: LinkPreview }) => (
  <div className="rounded-lg overflow-hidden border border-[#e0e0e0] mb-1">
    <img 
      src={preview.image} 
      alt={preview.title}
      className="w-full h-40 object-cover"
    />
    <div className="bg-[#f0f0f0] p-2">
      <p className="text-sm text-[#303030] font-medium line-clamp-2">{preview.title}</p>
      <div className="flex items-center gap-1 mt-1">
        <span className="text-xs text-[#667781]">{preview.domain}</span>
        <ExternalLink className="w-3 h-3 text-[#667781]" />
      </div>
      <a 
        href={preview.url} 
        className="text-xs text-[#027eb5] block mt-1 break-all hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {preview.url}
      </a>
    </div>
  </div>
);

const ConversationSelector = ({ 
  selected, 
  onSelect 
}: { 
  selected: ConversationType; 
  onSelect: (type: ConversationType) => void;
}) => (
  <div className="flex justify-center gap-3 py-4 bg-[#f5f5f5]">
    {(Object.keys(conversationData) as ConversationType[]).map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          selected === type
            ? "bg-[#075e54] text-white shadow-md"
            : "bg-white text-[#54656f] border border-[#d1d1d1] hover:bg-[#e8e8e8]"
        }`}
      >
        {conversationData[type].label}
      </button>
    ))}
  </div>
);

const WhatsAppChat = () => {
  const [conversationType, setConversationType] = useState<ConversationType>("construcao");
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  const allMessages = conversationData[conversationType].messages;

  // Reset animation when conversation type changes
  useEffect(() => {
    setVisibleMessages([]);
    setCurrentIndex(0);
    setIsTyping(false);
  }, [conversationType]);

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
      }, 3000);
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
  }, [currentIndex, allMessages]);

  return (
    <div className="flex flex-col min-h-screen bg-[#e5ddd5]">
      <div className="flex flex-col max-w-md mx-auto w-full flex-1 font-sans">
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
          className="flex-1 overflow-y-auto px-3 py-2 space-y-1 min-h-[400px]"
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
                {message.linkPreview && (
                  <LinkPreviewCard preview={message.linkPreview} />
                )}
                {message.text && (
                  <p className="text-[#303030] text-sm whitespace-pre-line pr-14">
                    {message.text}
                  </p>
                )}
                <div className={`absolute bottom-1 right-2 flex items-center gap-1 ${!message.text && message.linkPreview ? 'bg-black/30 px-1 rounded' : ''}`}>
                  <span className={`text-[10px] ${!message.text && message.linkPreview ? 'text-white' : 'text-[#667781]'}`}>{message.time}</span>
                  {message.isUser && (
                    <CheckCheck className={`w-4 h-4 ${!message.text && message.linkPreview ? 'text-white' : 'text-[#53bdeb]'}`} />
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

      {/* Conversation Selector */}
      <ConversationSelector 
        selected={conversationType} 
        onSelect={setConversationType} 
      />
    </div>
  );
};

export default WhatsAppChat;
