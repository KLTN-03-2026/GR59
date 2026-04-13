import React, { useState, useEffect, useRef } from 'react';
import styles from './AIChatBox.module.scss';
import { 
  PaperPlaneTilt, 
  Robot, 
  X, 
  Minus, 
  ChatCircleDots,
  DotsThreeOutline
} from '@phosphor-icons/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là TravelAi Assistant. Tôi có thể giúp gì cho chuyến đi của bạn?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Mock AI Response logic
    setTimeout(() => {
      const responses = [
        "Đó là một ý tưởng tuyệt vời! Bạn có muốn tôi gợi ý thêm các địa điểm lân cận không?",
        "Tôi hiểu rồi. Để tôi kiểm tra thông tin thời tiết và giá vé cho bạn nhé.",
        "Đà Lạt vào mùa này rất đẹp, bạn nên chuẩn bị thêm áo khoác nhẹ.",
        "Hiện tại lịch trình của bạn đang rất tối ưu. Bạn có muốn thêm một điểm dừng chân ẩm thực không?",
        "Để tôi giúp bạn tìm các khách sạn có view đẹp nhất tại khu vực này."
      ];
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className={styles.chatWrapper}>
      {/* Floating Button */}
      <button 
        className={`${styles.floatingBtn} ${isOpen ? styles.hidden : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <ChatCircleDots size={32} weight="fill" />
        <span className={styles.badge}>AI</span>
      </button>

      {/* Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.active : ''}`}>
        <div className={styles.chatHeader}>
          <div className={styles.assistantInfo}>
            <div className={styles.avatar}>
              <Robot size={24} weight="fill" />
            </div>
            <div>
              <h3>TravelAi Assistant</h3>
              <p>Trực tuyến</p>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button onClick={() => setIsOpen(false)}><Minus size={20} /></button>
            <button onClick={() => setIsOpen(false)}><X size={20} weight="bold" /></button>
          </div>
        </div>

        <div className={styles.messageArea}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`${styles.messageRow} ${msg.sender === 'user' ? styles.userRow : styles.aiRow}`}
            >
              {msg.sender === 'ai' && (
                <div className={styles.msgAvatar}>
                  <Robot size={16} weight="fill" />
                </div>
              )}
              <div className={styles.bubble}>
                {msg.text}
                <span className={styles.time}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className={styles.aiRow}>
              <div className={styles.msgAvatar}>
                <Robot size={16} weight="fill" />
              </div>
              <div className={`${styles.bubble} ${styles.typing}`}>
                <DotsThreeOutline size={24} weight="fill" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputArea}>
          <input 
            type="text" 
            placeholder="Hỏi trợ lý TravelAi..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className={styles.sendBtn} 
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <PaperPlaneTilt size={24} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBox;
