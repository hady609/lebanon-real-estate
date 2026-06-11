import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiMail, FiPhone, FiSend, FiHome, FiClock, FiCheck, FiArrowLeft, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Messages() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [tab, setTab] = useState('inbox');

  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent' || user?.role === 'seller';

  useEffect(() => { loadInquiries(); }, [tab]);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      let endpoint = '/inquiries/mine';
      if (isAdmin) endpoint = '/inquiries';
      else if (isAgent && tab === 'inbox') endpoint = '/inquiries/agent';
      const { data } = await api.get(endpoint);
      setInquiries(data.inquiries || []);
    } catch { setInquiries([]); }
    setLoading(false);
  };

  const selectInquiry = async (inq) => {
    try {
      const { data } = await api.get(`/inquiries/${inq._id}`);
      setSelected(data.inquiry);
      loadInquiries();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load conversation');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await api.post(`/inquiries/${selected._id}/reply`, { message: replyText });
      toast.success('Reply sent');
      setReplyText('');
      selectInquiry(selected);
    } catch { toast.error('Failed to send reply'); }
    setSending(false);
  };

  const formatTime = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const now = new Date();
    const diff = now - date;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const statusBadge = (status) => {
    const colors = { new: 'bg-blue-100 text-blue-700', read: 'bg-gray-100 text-gray-600', replied: 'bg-emerald-100 text-emerald-700', closed: 'bg-red-100 text-red-700' };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FiMessageSquare className="text-primary-600" /> Messages
            </h1>
            <p className="text-gray-500 mt-1">
              {isAdmin ? 'All conversations on the platform' : isAgent ? 'Inquiries from customers' : 'Your conversations with agents'}
            </p>
          </div>
          <button onClick={loadInquiries} className="btn-secondary !py-2 !px-3 text-sm"><FiRefreshCw className={loading ? 'animate-spin' : ''} /></button>
        </div>

        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
          {(isAgent || isAdmin) && (
            <button onClick={() => setTab('inbox')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'inbox' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
              Inbox {inquiries.filter(i => i.status === 'new').length > 0 && <span className="ml-1.5 w-2 h-2 inline-block rounded-full bg-red-500" />}
            </button>
          )}
          <button onClick={() => setTab('sent')} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'sent' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
            {isAdmin ? 'All Messages' : isAgent ? 'All Inquiries' : 'My Messages'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className={`${selected ? 'hidden lg:block' : 'block'} lg:col-span-1`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{tab === 'inbox' ? 'Inbox' : 'Messages'}</h3>
                <span className="text-xs text-gray-500">{inquiries.length}</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
                ) : inquiries.length === 0 ? (
                  <div className="p-8 text-center">
                    <FiMessageSquare className="mx-auto text-gray-300 text-3xl mb-2" />
                    <p className="text-gray-500 text-sm">No messages yet</p>
                    {!isAgent && !isAdmin && <p className="text-xs text-gray-400 mt-1">Send an inquiry from a property page</p>}
                  </div>
                ) : inquiries.map(inq => (
                  <button key={inq._id} onClick={() => selectInquiry(inq)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-all ${selected?._id === inq._id ? 'bg-primary-50 border-l-2 border-primary-500' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${inq.status === 'new' ? 'bg-primary-500' : 'bg-gray-400'}`}>
                          {inq.name?.[0] || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{inq.name}</p>
                          <p className="text-xs text-gray-500 truncate">{inq.property?.title || 'Property'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {inq.status === 'new' && <span className="w-2 h-2 rounded-full bg-red-500" />}
                        <span className="text-xs text-gray-400">{formatTime(inq.updatedAt || inq.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5 truncate pl-10">{inq.message}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`${!selected ? 'hidden lg:block' : 'block'} lg:col-span-2`}>
            {selected ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setSelected(null)} className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"><FiArrowLeft /></button>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selected.name}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FiMail className="shrink-0" /> {selected.email}</span>
                          {selected.phone && <span className="flex items-center gap-1"><FiPhone className="shrink-0" /> {selected.phone}</span>}
                        </div>
                      </div>
                      <div className="ml-auto">{statusBadge(selected.status)}</div>
                    </div>
                  </div>
                  <Link to={`/properties/${selected.property?._id}`} className="mt-2 inline-flex items-center gap-1 text-xs text-primary-600 hover:underline">
                    <FiHome /> {selected.property?.title} - {selected.property?.location?.city} <FiArrowRight />
                  </Link>
                </div>

                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {(selected.messages || []).length === 0 ? (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">{selected.message}</p>
                      <p className="text-xs text-gray-400 mt-1"><FiClock className="inline" /> {formatTime(selected.createdAt)}</p>
                    </div>
                  ) : (selected.messages || []).map((msg, i) => (
                    <div key={i} className={`flex ${msg.isFromAgent ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl ${msg.isFromAgent ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.isFromAgent ? 'text-primary-200' : 'text-gray-400'}`}>
                          {msg.isFromAgent ? 'Agent' : selected.name} · {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {(selected.status !== 'closed') && (
                  <form onSubmit={handleReply} className="p-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)}
                        placeholder={isAgent || isAdmin ? "Type your reply..." : "Send a message..."}
                        className="input-modern flex-1" />
                      <button type="submit" disabled={sending || !replyText.trim()} className="btn-primary !px-5 !py-3 disabled:opacity-50">
                        <FiSend /> Send
                      </button>
                    </div>
                  </form>
                )}
                {selected.status === 'closed' && <div className="p-4 border-t border-gray-100 text-center text-sm text-gray-400">This conversation is closed</div>}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center h-full flex items-center justify-center">
                <div>
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <FiMessageSquare className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Select a conversation</h3>
                  <p className="text-gray-500 text-sm">Choose a message from the list</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
