import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, Bell, Mail, Phone, User, MessageSquare, Clock, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  candidateInfo?: {
    name: string;
    id: string;
    position: string;
    scheduledTime: string;
  };
}

interface Ticket {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  created: Date;
}

const SupportChatInterface = () => {
  const [currentView, setCurrentView] = useState<'initial' | 'chat'>('initial');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChat = () => {
    setCurrentView('chat');
    // Add initial bot message
    const initialMessage: Message = {
      id: '1',
      type: 'bot',
              content: 'Hi, the candidate didn&apos;t receive the interview link.',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Thanks for letting me know, Let me pull the record. Can you confirm the following details?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const addCandidateInfo = () => {
    const candidateMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: 'Candidate Information Added',
      timestamp: new Date(),
      candidateInfo: {
        name: 'Priya Sharma',
        id: 'CAND-2592',
        position: 'Frontend Developer (Link ID: JOB-2712)',
        scheduledTime: 'today at 3:00 PM'
      }
    };
    setMessages(prev => [...prev, candidateMessage]);
  };

  const sendQuickResponse = (response: string) => {
    const quickMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: response,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, quickMessage]);
    setShowQuickActions(false);
  };

  const createTicket = () => {
    const newTicket: Ticket = {
      id: `TICK-${Date.now()}`,
      title: 'Interview link issue',
      status: 'open',
      priority: 'high',
      created: new Date()
    };
    setTickets(prev => [...prev, newTicket]);
    
    const ticketMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: `Support ticket ${newTicket.id} has been created for this interview link issue.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, ticketMessage]);
  };

  if (currentView === 'initial') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>Support</h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' }}>
              Got a question or issue? Talk to our support bot or check your tickets.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Mail size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
            <Bell size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                AC
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>Alex Carter</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>alexcarter@gmail.com</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{
          display: 'flex',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px',
          gap: '40px'
        }}>
          {/* Left Side */}
          <div style={{ flex: 1 }}>
            <div style={{
              backgroundColor: '#dbeafe',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500', color: '#1e40af' }}>
                You don&apos;t have any open tickets yet
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
                When you create tickets, they&apos;ll show up here. Feel free to reach out to our support bot to make a new ticket.
              </p>
            </div>
            <button
              onClick={startChat}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Chat with Support Bot
            </button>
          </div>

          {/* Right Side */}
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
              Chat with Support Bot
            </h2>
            <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: '#64748b' }}>
              Start a conversation to have an issue, ask a question, or request help. I&apos;ll guide you and create a support ticket if needed.
            </p>
            
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
              <button
                onClick={startChat}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Chat with Support Bot
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>Support</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' }}>
            Got a question or issue? Talk to our support bot or check your tickets.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Mail size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
          <Bell size={20} style={{ color: '#64748b', cursor: 'pointer' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              AC
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>Alex Carter</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>alexcarter@gmail.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div style={{
        display: 'flex',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
        gap: '24px',
        height: 'calc(100vh - 120px)'
      }}>
        {/* Left Sidebar */}
        <div style={{ width: '300px' }}>
          <div style={{
            backgroundColor: '#dbeafe',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500', color: '#1e40af' }}>
              You do not have any open tickets yet
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
              Facing an issue? Start a conversation with our Support Bot to get the help you need.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('initial')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Chat with Support Bot
          </button>

          {tickets.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                Your Tickets
              </h3>
              {tickets.map(ticket => (
                <div key={ticket.id} style={{
                  backgroundColor: 'white',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '8px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{ticket.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    {ticket.id} • {ticket.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
              Chat with Support Bot
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={createTicket}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={14} />
                Create Ticket
              </button>
            </div>
          </div>

          {/* Quick Actions Banner */}
          <div style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>I&apos;m ready to help you. Choose from the common options below or type your query.</span>
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Quick Actions
            </button>
          </div>

          {/* Quick Actions Dropdown */}
          {showQuickActions && (
            <div style={{
              backgroundColor: '#1e40af',
              color: 'white',
              padding: '16px 20px',
              fontSize: '14px'
            }}>
              <div style={{ marginBottom: '12px', fontWeight: '500' }}>
                Thanks for getting in touch. Let me see if I can help:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => sendQuickResponse('1. Candidate cannot ID')}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    textAlign: 'left',
                    padding: '4px 0',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  1. Candidate cannot ID
                </button>
                <button
                  onClick={() => sendQuickResponse('2. Job into in ID')}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    textAlign: 'left',
                    padding: '4px 0',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  2. Job into in ID
                </button>
                <button
                  onClick={() => sendQuickResponse('3. Timing of the interview')}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    textAlign: 'left',
                    padding: '4px 0',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  3. Timing of the interview
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === 'user' ? (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '18px 18px 4px 18px',
                      maxWidth: '70%',
                      fontSize: '14px'
                    }}>
                      {message.content}
                    </div>
                  </div>
                ) : message.type === 'bot' ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <MessageSquare size={16} style={{ color: '#64748b' }} />
                    </div>
                    <div style={{
                      backgroundColor: '#f1f5f9',
                      padding: '12px 16px',
                      borderRadius: '4px 18px 18px 18px',
                      maxWidth: '70%',
                      fontSize: '14px',
                      color: '#1e293b'
                    }}>
                      {message.content}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                    fontSize: '14px'
                  }}>
                    {message.candidateInfo ? (
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>
                          Candidate: {message.candidateInfo.name} (ID: {message.candidateInfo.id})
                        </div>
                        <div style={{ color: '#64748b', marginBottom: '4px' }}>
                          Job: {message.candidateInfo.position}
                        </div>
                        <div style={{ color: '#64748b' }}>
                          Scheduled for {message.candidateInfo.scheduledTime}
                        </div>
                        <button
                          onClick={addCandidateInfo}
                          style={{
                            marginTop: '12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Auto-scheduler
                        </button>
                      </div>
                    ) : (
                      <div style={{ color: '#10b981', fontWeight: '500' }}>
                        <CheckCircle size={16} style={{ display: 'inline', marginRight: '8px' }} />
                        {message.content}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '16px 20px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '6px'
              }}
            >
              <Plus size={20} style={{ color: '#64748b' }} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your issue or question here..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                padding: '8px 0'
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} style={{ color: 'white' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChatInterface;