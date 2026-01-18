"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";
import { useState, useEffect, useCallback } from "react";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

interface Message {
    id: string;
    name: string;
    email: string;
    subject?: string;
    message: string;
    phone?: string;
    company?: string;
    status: 'new' | 'read' | 'replied' | 'archived';
    admin_notes?: string;
    created_at: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [filter, setFilter] = useState<string>('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const { showToast } = useToast();

    // Fetch messages
    const fetchMessages = useCallback(async () => {
        setIsLoading(true);
        const url = filter ? `/api/v1/contact?status=${filter}` : '/api/v1/contact';
        const res = await apiCall<{ messages: Message[] }>(url);
        if (res.success && res.data) {
            setMessages(res.data.messages || []);
        }
        setIsLoading(false);
    }, [filter]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleStatusChange = async (id: string, status: string) => {
        const res = await apiCall(`/api/v1/contact?id=${id}`, {
            method: 'PUT',
            body: { status },
        });
        if (res.success) {
            showToast('Status updated', 'success');
            fetchMessages();
            if (selectedMessage?.id === id) {
                setSelectedMessage(prev => prev ? { ...prev, status: status as Message['status'] } : null);
            }
        } else {
            showToast('Failed to update status', 'error');
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        const res = await apiCall(`/api/v1/contact?id=${deleteId}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Message deleted', 'success');
            fetchMessages();
            if (selectedMessage?.id === deleteId) {
                setSelectedMessage(null);
            }
        } else {
            showToast('Failed to delete message', 'error');
        }
        setDeleteId(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'read':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
            case 'replied':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case 'archived':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Contact Messages"
                description="View and manage messages from visitors"
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8 flex flex-col gap-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-[#1e1e1e] p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex gap-2 px-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        <button
                            onClick={() => setFilter('')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${filter === ''
                                ? 'bg-sage-light dark:bg-sage-green/20 text-sage-green'
                                : 'text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            All Messages
                        </button>
                        {['new', 'read', 'replied', 'archived'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap capitalize ${filter === status
                                    ? 'bg-sage-light dark:bg-sage-green/20 text-sage-green'
                                    : 'text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Messages List */}
                    <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800">
                                <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inbox</span>
                                <p className="text-text-muted">No messages found</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    onClick={() => {
                                        setSelectedMessage(msg);
                                        if (msg.status === 'new') {
                                            handleStatusChange(msg.id, 'read');
                                        }
                                    }}
                                    className={`p-4 bg-white dark:bg-[#1e1e1e] rounded-xl border cursor-pointer transition-all hover:shadow-md ${selectedMessage?.id === msg.id
                                        ? 'border-sage-green shadow-md'
                                        : 'border-gray-100 dark:border-gray-800'
                                        } ${msg.status === 'new' ? 'border-l-4 border-l-blue-500' : ''}`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold text-text-main dark:text-white truncate">{msg.name}</h4>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(msg.status)}`}>
                                            {msg.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-muted truncate">{msg.subject || 'No subject'}</p>
                                    <p className="text-xs text-text-muted mt-2">{formatDate(msg.created_at)}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Message Detail */}
                    <div className="lg:col-span-2">
                        {selectedMessage ? (
                            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-text-main dark:text-white">{selectedMessage.name}</h3>
                                        <p className="text-text-muted">{selectedMessage.email}</p>
                                        {selectedMessage.phone && (
                                            <p className="text-text-muted text-sm">{selectedMessage.phone}</p>
                                        )}
                                        {selectedMessage.company && (
                                            <p className="text-text-muted text-sm">Company: {selectedMessage.company}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedMessage.status}
                                            onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                                            className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm"
                                        >
                                            <option value="new">New</option>
                                            <option value="read">Read</option>
                                            <option value="replied">Replied</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                        <button
                                            onClick={() => setDeleteId(selectedMessage.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <h4 className="font-semibold text-text-main dark:text-white mb-2">
                                        {selectedMessage.subject || 'No Subject'}
                                    </h4>
                                    <p className="text-text-muted whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-text-muted">
                                    Received: {formatDate(selectedMessage.created_at)}
                                </div>

                                {/* Quick Actions */}
                                <div className="mt-4 flex gap-2">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-sage-green text-white rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">reply</span>
                                        Reply via Email
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 p-12 text-center">
                                <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">email</span>
                                <p className="text-text-muted">Select a message to view details</p>
                            </div>
                        )}
                    </div>
                </div>

                <ConfirmModal
                    isOpen={!!deleteId}
                    onCancel={() => setDeleteId(null)}
                    onConfirm={handleDelete}
                    title="Delete Message"
                    message="Are you sure you want to delete this message? This action cannot be undone."
                    confirmLabel="Delete"
                    variant="danger"
                />
            </div>
        </div>
    );
}
