'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Send,
  User,
  Filter
} from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Tanvir Hossain',
      phone: '01799887766',
      subject: 'Inquiry regarding Eid delivery cutoff date',
      body: 'Salam, can I get guaranteed delivery in Dhanmondi before Eid Eve if I order tonight?',
      time: '15 mins ago',
      status: 'unread',
      order: '#ORD-10482'
    },
    {
      id: 2,
      sender: 'Sabbir Ahmed',
      phone: '01811998877',
      subject: 'Size fit question for Arabian Thobe (L vs XL)',
      body: 'I usually wear chest size 42, should I pick size L or XL for regular drape?',
      time: '1 hour ago',
      status: 'unread',
      order: 'None'
    },
    {
      id: 3,
      sender: 'Farhana Yeasmin',
      phone: '01911443322',
      subject: 'Gift packaging request for husband',
      body: 'Is custom luxury gift box with greeting card available with my order?',
      time: '3 hours ago',
      status: 'unread',
      order: '#ORD-10480'
    },
    {
      id: 4,
      sender: 'Kamrul Hasan',
      phone: '01722334455',
      subject: 'bKash Trx Verification check',
      body: 'I sent the remaining ৳1,500 via bKash personal. Please verify.',
      time: 'Yesterday',
      status: 'replied',
      order: '#ORD-10475'
    }
  ]);

  const [activeMessage, setActiveMessage] = useState(messages[0]);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    alert(`Reply sent to ${activeMessage.sender} (${activeMessage.phone}): "${replyText}"`);
    setReplyText('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans text-[#100D0A]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#796E5F] mb-1">
          <span>Communication</span>
          <span>&gt;</span>
          <span className="font-semibold text-[#100D0A]">Messages</span>
        </div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-[#100D0A]">Customer Messages & Support</h1>
          <span className="text-[11px] font-semibold bg-[#EFECE6] text-[#100D0A] border border-[#DDD7CD] px-2.5 py-0.5 rounded-full">
            12 Inquiries
          </span>
        </div>
        <p className="text-xs text-[#796E5F] mt-0.5">
          Real-time inquiries from storefront contact form, order notes, and concierge inquiries.
        </p>
      </div>

      {/* 2-Column Split: Message List + Reading/Reply Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* List Pane */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs divide-y divide-[#EFECE6] overflow-hidden">
          <div className="p-3 bg-[#FAF7F2] border-b border-[#E5DFD5]">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full bg-white border border-[#DDD7CD] rounded-xl px-3 py-1.5 text-xs text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
            />
          </div>

          <div className="divide-y divide-[#EFECE6] max-h-[520px] overflow-y-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                onClick={() => setActiveMessage(m)}
                className={`p-3.5 cursor-pointer transition-colors ${
                  activeMessage.id === m.id ? 'bg-[#FAF3E0] border-l-4 border-l-[#E6AD35]' : 'hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#100D0A]">{m.sender}</span>
                  <span className="text-[10px] text-[#A59A88]">{m.time}</span>
                </div>
                <p className="text-xs font-semibold text-[#302316] line-clamp-1">{m.subject}</p>
                <p className="text-[11px] text-[#796E5F] line-clamp-1 mt-0.5">{m.body}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-mono text-[#7A5310] bg-[#FAF3E0] border border-[#EADBBD] px-1.5 py-0.5 rounded-md">
                    {m.order}
                  </span>
                  {m.status === 'unread' && (
                    <span className="w-2 h-2 rounded-full bg-[#D9383A]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reader & Reply Pane */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5DFD5] shadow-xs p-6 flex flex-col justify-between space-y-4 min-h-[480px]">
          {activeMessage ? (
            <>
              <div className="space-y-4">
                <div className="border-b border-[#E5DFD5] pb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-[#100D0A]">{activeMessage.subject}</h2>
                    <span className="text-xs text-[#796E5F]">{activeMessage.time}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-[#796E5F]">
                    <span>From: <strong className="text-[#100D0A] font-semibold">{activeMessage.sender}</strong></span>
                    <span>·</span>
                    <span className="font-mono text-[#302316]">{activeMessage.phone}</span>
                    <span>·</span>
                    <span>Ref: <span className="font-semibold text-[#7A5310]">{activeMessage.order}</span></span>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DFD5] text-xs leading-relaxed text-[#302316]">
                  {activeMessage.body}
                </div>
              </div>

              {/* Reply Box */}
              <div className="space-y-3 pt-4 border-t border-[#E5DFD5]">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${activeMessage.sender} via SMS/Email concierge...`}
                  className="w-full bg-[#FAF7F2] border border-[#DDD7CD] rounded-xl p-3 text-xs text-[#100D0A] placeholder-[#A59A88] focus:outline-hidden focus:border-[#E6AD35] transition-colors"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#796E5F]">Sends instant response notification via concierge service</span>
                  <button
                    type="button"
                    onClick={handleSendReply}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#E6AD35] hover:bg-[#D49B24] text-[#100D0A] flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-[#A59A88]">
              Select a message to view conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
