import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, MessageSquare, X, Loader2 } from 'lucide-react'; 

// --- GEMINI API Configuration ---
// Note: API Key is left blank. The runtime environment (Canvas) will provide it automatically.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
const MAX_RETRIES = 3;

// --- Message Helpers ---

const initialBotMessage = (title) => ({ 
    text: `Hello! I'm your AI mentor for the post on "${title}". Ask me to summarize the preparation strategy, detail the interview experience, or anything specific about this article!`, 
    sender: "bot" 
});

// Helper function to extract and combine content into a single string for context
const extractContent = (post) => {
    if (!post) return "No article content available.";
    
    // Combine all structured fields into a single, labeled text block for the LLM
    return `
ARTICLE CONTEXT:
Article Title: ${post.title || ''}
Company/Role: ${post.companyName || ''} - ${post.role || ''}
---
SUMMARY/INTRO:
${post.content || 'N/A'}
---
PLACEMENT JOURNEY:
${post.postJourney || 'N/A'}
---
DETAILED EXPERIENCES (INTERVIEW ROUNDS):
${post.postExperiences || 'N/A'}
---
PREPARATION STRATEGY:
${post.postStrategy || 'N/A'}
---
ADVICE:
${post.postAdvice || 'N/A'}
---
`;
};

// --- System Instruction Helper ---
// This is crucial for grounding the LLM's answers to the provided content
const getSystemInstruction = (context) => ({
    parts: [{
        text: `You are an expert Placement Mentor focused on career advice, strategy, and summarization. 
        Your sole purpose is to answer the user's question STRICTLY based on the article content provided below. 
        
        If the user asks for a 'summary' or a question requires a high-level view, provide a brief, structured summary of the key sections (Journey, Strategy, Experiences).
        If the user's question cannot be answered using the provided text, you MUST respond only with the phrase: 
        "That specific detail is not covered in this article's content."
        Do not use external knowledge. Be concise and helpful.

        --- ARTICLE CONTENT FOR CONTEXT ---
        ${context}
        ---
        `,
    }],
});

// --- Main ChatBot Component ---

export default function ChatBot({ post }) {
    // 💡 FIX: Return early if post is not loaded to prevent 'Cannot read properties of undefined'
    if (!post || !post.title) {
        return null;
    }
    
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([initialBotMessage(post.title)]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const postContext = extractContent(post);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    // Reset messages when opening the chat for a new post
    useEffect(() => {
        if (isOpen) {
             setMessages([initialBotMessage(post.title)]);
        }
    }, [post.title, isOpen]);


    const handleSend = useCallback(async (e) => {
        e.preventDefault();
        if (input.trim() === '' || isLoading) return;

        const userMessage = input.trim();
        
        // 1. Update UI: Add user message and set loading
        setMessages((prevMessages) => [...prevMessages, { text: userMessage, sender: "user" }]);
        setInput('');
        setIsLoading(true);

        const payload = {
            contents: [{ parts: [{ text: userMessage }] }],
            systemInstruction: getSystemInstruction(postContext),
        };
        
        let botResponse = "Failed to generate response due to internal error.";
        let success = false;

        // 2. API Call with Exponential Backoff
        for (let i = 0; i < MAX_RETRIES; i++) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    if (response.status === 429 && i < MAX_RETRIES - 1) {
                        // Exponential backoff wait time
                        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                        continue; // Retry
                    }
                    throw new Error(`HTTP status: ${response.status}`);
                }

                const result = await response.json();
                botResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to parse API response.";
                success = true;
                break; // Exit loop on success

            } catch (error) {
                console.error(`Gemini API attempt ${i + 1} failed:`, error);
                if (i === MAX_RETRIES - 1) {
                    botResponse = `Error connecting to the AI service after ${MAX_RETRIES} attempts.`;
                }
            }
        }
        
        // 3. Final UI Update
        setIsLoading(false);
        setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: "bot", error: !success }]);
        
    }, [input, isLoading, postContext]); 

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 text-white shadow-lg z-50 hover:bg-indigo-700 transition"
                aria-label="Toggle Placement Mentor Chat"
            >
                <MessageSquare size={44} />
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-6 w-150 max-h-[95vh] bg-white border border-gray-300 rounded-lg shadow-2xl flex flex-col z-50">
                    
                    {/* Header */}
                    <div className="p-3 bg-indigo-600 text-white font-bold rounded-t-lg flex justify-between items-center">
                        {post.title} Mentor
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 p-1">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-grow p-3 overflow-y-auto space-y-3">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`p-2 rounded-xl max-w-[90%] text-sm shadow-md ${
                                    msg.sender === 'user' 
                                        ? 'bg-indigo-100 text-indigo-900 self-end' 
                                        : msg.error ? 'bg-red-200 text-red-900 self-start' : 'bg-gray-100 text-gray-800 self-start'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-2 rounded-xl bg-gray-100 text-gray-600 text-sm shadow-md flex items-center">
                                    <Loader2 size={16} className="animate-spin mr-2" /> 
                                    Analyzing post...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 border-t flex bg-gray-50">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about this post..."
                            className="flex-grow border border-gray-300 p-2 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="p-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
                            disabled={isLoading || input.trim() === ''}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
