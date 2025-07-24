import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis l'assistant virtuel du Cabinet Audit Conseil Interne. Comment puis-je vous aider aujourd'hui ?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickResponses = [
    "Quelles sont vos formations ?",
    "Comment devenir CIA ?",
    "Vos tarifs ?",
    "Prendre rendez-vous"
  ];

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('formation') || message.includes('cia')) {
      return "Nous proposons deux formations principales :\n\n• **Pratique de l'audit interne** (4-6 semaines)\n• **Devenir CIA en 6 mois**\n\nLes deux formations sont disponibles en ligne et en présentiel. Souhaitez-vous plus de détails sur l'une d'entre elles ?";
    }
    
    if (message.includes('tarif') || message.includes('prix') || message.includes('coût')) {
      return "Nos tarifs sont personnalisés selon vos besoins :\n\n• Formation individuelle : Sur demande\n• Formation entreprise : Devis personnalisé\n• Paiement échelonné possible\n\nVoulez-vous que je vous mette en contact avec notre équipe pour un devis ?";
    }
    
    if (message.includes('contact') || message.includes('rendez-vous') || message.includes('appel')) {
      return "Pour nous contacter :\n\n📞 **Téléphone :**\n• +33 786 800 975\n• +237 691 303 112\n\n📧 **Email :** support@cabinetaudit.cm\n\n🕒 **Horaires :** Lun-Sam, 09h-19h\n\nVoulez-vous que je programme un appel de découverte gratuit ?";
    }
    
    if (message.includes('service') || message.includes('conseil')) {
      return "Nos services incluent :\n\n• Formation des collaborateurs\n• Mise en place du service d'audit interne\n• Cartographie des risques\n• Accompagnement en gestion des risques\n\nQuel service vous intéresse le plus ?";
    }
    
    if (message.includes('audit interne')) {
      return "L'audit interne est notre expertise ! Nous offrons :\n\n• 12 années d'expérience\n• Certification CIA\n• Approche normalisée\n• Formation pratique\n\nSouhaitez-vous en savoir plus sur nos formations ou nos services d'audit ?";
    }
    
    if (message.includes('bonjour') || message.includes('salut') || message.includes('hello')) {
      return "Bonjour ! Ravi de vous parler. Je peux vous renseigner sur :\n\n• Nos formations (CIA, audit interne)\n• Nos services aux entreprises\n• Les modalités et tarifs\n• Comment nous contacter\n\nQue souhaitez-vous savoir ?";
    }
    
    return "Je comprends votre question. Pour une réponse personnalisée, je vous invite à :\n\n• Contacter notre équipe au +33 786 800 975\n• Envoyer un email à support@cabinetaudit.cm\n• Consulter notre site pour plus d'informations\n\nY a-t-il autre chose sur laquelle je peux vous aider ?";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickResponse = (response: string) => {
    setInputText(response);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-8 z-50 w-16 h-16 rounded-full shadow-glow transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-gradient-primary hover:shadow-float'
        } flex items-center justify-center group`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        )}
        
        {/* Notification dot */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-44 right-8 z-50 w-80 h-[500px] shadow-float border-0 rounded-3xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-primary text-white p-4 flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold">Assistant Cabinet Audit</h3>
              <p className="text-sm text-blue-100">En ligne maintenant</p>
            </div>
            <div className="flex-1"></div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isBot ? 'bg-primary' : 'bg-gray-500'
                  }`}>
                    {message.isBot ? (
                      <Bot className="h-4 w-4 text-white" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.isBot 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-primary text-white'
                  }`}>
                    <div 
                      className="text-sm whitespace-pre-line"
                      dangerouslySetInnerHTML={{
                        __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }}
                    />
                    <div className={`text-xs mt-1 opacity-70 ${
                      message.isBot ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Responses */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <div className="text-xs text-gray-500 mb-2">Suggestions :</div>
              <div className="flex flex-wrap gap-2">
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickResponse(response)}
                    className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="px-4 py-3 bg-primary hover:bg-primary/90 rounded-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;