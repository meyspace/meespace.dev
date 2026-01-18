"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('idle');
        setErrorMessage('');

        try {
            const res = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
                setErrorMessage(data.error || 'Failed to send message');
            }
        } catch {
            setStatus('error');
            setErrorMessage('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50 dark:border-white/10">
            {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl text-green-600 dark:text-green-400">check_circle</span>
                    </div>
                    <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">Message Sent!</h3>
                    <p className="text-text-muted dark:text-gray-400">Thank you for reaching out. I&apos;ll get back to you soon.</p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="mt-6 px-4 py-2 text-sm font-medium text-primary-dark hover:underline"
                    >
                        Send another message
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="John Doe"
                            required
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-primary focus:border-primary py-2.5 px-3 shadow-sm outline-none focus:ring-2 transition-shadow"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="john@company.com"
                            required
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-primary focus:border-primary py-2.5 px-3 shadow-sm outline-none focus:ring-2 transition-shadow"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">Message</label>
                        <textarea
                            id="message"
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Tell me about your project..."
                            required
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-primary focus:border-primary py-2.5 px-3 shadow-sm outline-none focus:ring-2 transition-shadow"
                        ></textarea>
                    </div>

                    {status === 'error' && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 w-full bg-text-main dark:bg-white text-white dark:text-text-main font-bold py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                                <span>Sending...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                <span>Send Message</span>
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
