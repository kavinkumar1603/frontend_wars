import React, { useState, useRef, useEffect } from 'react';
import { useCrmStore } from '../store/useCrmStore';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Send, Search, Phone, Video, MoreVertical, Check, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';

export function Messages() {
  const { customers, messages, sendMessage, markMessagesAsRead } = useCrmStore();
  const [activeCustomerId, setActiveCustomerId] = useState<string>(customers[0].id);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group messages by customer
  const conversations = customers.map(customer => {
    const customerMessages = messages.filter(m => m.customerId === customer.id);
    const lastMessage = customerMessages[customerMessages.length - 1];
    const unreadCount = customerMessages.filter(m => !m.read && m.sender === 'customer').length;
    return { customer, lastMessage, unreadCount };
  }).sort((a, b) => {
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
  });

  const activeCustomerMessages = messages.filter(m => m.customerId === activeCustomerId);
  const activeCustomer = customers.find(c => c.id === activeCustomerId);

  useEffect(() => {
    if (activeCustomerId) {
      markMessagesAsRead(activeCustomerId);
      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeCustomerId, messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    sendMessage({
      id: `m_${Date.now()}`,
      customerId: activeCustomerId,
      content: inputValue,
      timestamp: new Date().toISOString(),
      sender: 'user',
      read: true
    });
    setInputValue('');
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with your leads and customers.</p>
      </div>

      <Card className="flex-1 overflow-hidden flex border-border">
        {/* Chat List Sidebar */}
        <div className="w-80 border-r border-border flex flex-col bg-card shrink-0">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9 bg-secondary border-transparent" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(({ customer, lastMessage, unreadCount }) => (
              <div 
                key={customer.id} 
                onClick={() => setActiveCustomerId(customer.id)}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-border/50 ${activeCustomerId === customer.id ? 'bg-secondary' : 'hover:bg-secondary/50'}`}
              >
                <div className="relative">
                  <img src={customer.avatar} alt={customer.name} className="w-12 h-12 rounded-full object-cover border border-border" />
                  {customer.status === 'Active' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-semibold text-sm truncate">{customer.name}</h4>
                    {lastMessage && (
                      <span className="text-xs text-muted-foreground">{format(new Date(lastMessage.timestamp), 'HH:mm')}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm truncate ${unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                      {lastMessage?.content || 'No messages yet'}
                    </p>
                    {unreadCount > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 flex flex-col bg-background/50 relative">
          {/* Chat Header */}
          {activeCustomer && (
            <div className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-3">
                <img src={activeCustomer.avatar} alt={activeCustomer.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                <div>
                  <h3 className="font-semibold">{activeCustomer.name}</h3>
                  <p className="text-xs text-muted-foreground">{activeCustomer.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <button className="hover:text-foreground transition-colors"><Phone className="w-5 h-5" /></button>
                <button className="hover:text-foreground transition-colors"><Video className="w-5 h-5" /></button>
                <button className="hover:text-foreground transition-colors"><MoreVertical className="w-5 h-5" /></button>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex justify-center mb-6">
              <span className="text-xs font-medium bg-secondary text-muted-foreground px-3 py-1 rounded-full">Today</span>
            </div>
            
            {activeCustomerMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isUser ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border border-border rounded-tl-sm shadow-sm'}`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      <span className="text-[10px]">{format(new Date(msg.timestamp), 'HH:mm')}</span>
                      {isUser && (
                        msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-card border-t border-border">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="Type a message..." 
                className="flex-1 rounded-full bg-secondary border-transparent focus-visible:ring-primary focus-visible:bg-background transition-colors"
              />
              <Button type="submit" size="icon" className="rounded-full shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
