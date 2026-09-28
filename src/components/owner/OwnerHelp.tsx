import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  AlertCircle,
  Info,
  ChevronRight,
  Send,
  X,
  Headphones,
  CheckCircle2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'support';
  text: string;
  time: string;
}

export const OwnerHelp: React.FC = () => {
  const { ownerProfile, showToast } = useApp();

  const [activeChat, setActiveChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'support',
      text: 'Hello Ms PC Makhele! Welcome to Accommodation Management System Priority Desk. How can we assist you with your residence operations today?',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How do I onboard a new student without a national ID?',
      a: 'You can provide the student passport number or provisional CUT student registration number. The system will mark the agreement as "Pending Verification" until full KYC is submitted.',
    },
    {
      q: 'How are Capitec Bank EFT payments reconciled?',
      a: 'When students make EFT transfers citing their agreement reference (e.g. SA001), our system matches the payment amount and reference against the active ledger automatically.',
    },
    {
      q: 'Can I draft custom clauses into the lease agreement?',
      a: 'Yes. Use the Agreements tab or Settings > Terms to adjust quiet hours, penalty percentages, or inspection dates.',
    },
    {
      q: 'How do I enforce an eviction or lease cancellation?',
      a: 'Navigate to Students > View Profile > Agreements, click Edit, and switch the status to Terminated. A 30-day notice is dispatched to the tenant and legal guarantor.',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const replies = [
        'Thank you for reaching out. We have logged your enquiry regarding verified accommodation accreditation with the Central University of Technology housing office.',
        'Noted! Our property liaison officer is reviewing the Capitec Bank clearance batch for today.',
        'Your enquiry has been assigned Ticket #AMS-8821. An administrator will review your requested adjustment shortly.',
      ];
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'support',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Help & Support
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Find answers, tutorial guides, or contact management system support.
          </p>
        </div>
      </div>

      {/* 4 Cards Grid from prompt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* FAQs */}
        <div
          onClick={() => setActiveFAQ(activeFAQ === null ? 0 : null)}
          className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:border-emerald-500/50 transition"
        >
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 w-fit mb-3">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">FAQs</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Frequently asked questions regarding rentals, students, and payouts.
          </p>
        </div>

        {/* Contact Us */}
        <div
          onClick={() =>
            showToast('Central University Housing Office: +27 (0)51 507 3911', 'info')
          }
          className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:border-emerald-500/50 transition"
        >
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 w-fit mb-3">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Contact Us</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Get in touch with the main university housing administration team.
          </p>
        </div>

        {/* Report an Issue */}
        <div
          onClick={() => {
            showToast('Ticket AMS-912 created. Support team alerted.', 'success');
          }}
          className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:border-emerald-500/50 transition"
        >
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 w-fit mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Report an Issue
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Submit technical bugs or platform service tickets.
          </p>
        </div>

        {/* About Us */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 w-fit mb-3">
            <Info className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">About Us</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accommodation Management System, version 2.4.1 Production.
          </p>
        </div>
      </div>

      {/* Personalized Assistance Callout */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-xl p-6 shadow-md border border-emerald-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
            Dedicated Landlord Support
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            Need More Personalized Assistance?
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
            Our support desk is available to assist property owners with verified accommodation
            registration, banking transitions, and compliance issues. Chat with system
            administrators right now.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setActiveChat(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition inline-flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            Chat Now
          </button>
          <button
            onClick={() => showToast('Opening system documentation portal...', 'info')}
            className="px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold rounded-lg border border-emerald-700 transition"
          >
            Visit Support Center
          </button>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm pb-2 border-b border-slate-100 dark:border-slate-700">
          Frequently Answered Resident & Owner Questions
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-3">
              <button
                onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-700"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFAQ === idx ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {activeFAQ === idx && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-6">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Chat Modal Drawer */}
      {activeChat && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full h-[520px] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="px-4 py-3 bg-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">AMS Administrator Support</h4>
                  <span className="text-[10px] text-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online • Responds immediately
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveChat(false)}
                className="p-1 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50 dark:bg-slate-850">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      m.sender === 'user'
                        ? 'bg-emerald-700 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message to administration..."
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
