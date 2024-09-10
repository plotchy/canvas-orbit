'use client';

import { useState } from 'react';

const Overlay = () => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/submit-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });
        const data = await response.json();
        setMessage(data.message);
    };

    return (
        <div className="fixed z-10 text-white inset-0 pointer-events-none">
            <div className="absolute bottom-0 right-0 p-6 pointer-events-auto max-w-sm">
                <h5 className="text-2xl font-bold mb-4">Join our Web Scraping Team</h5>
                <p className="text-sm mb-4">
                    This assessment evaluates your ability to extract and process data from a complex, dynamic environment.
                </p>
                <p className="text-sm mb-4">
                    Your task: Calculate the total amount of BTC in orbit.
                </p>
                <form onSubmit={handleSubmit} className="mt-4">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter the total BTC amount"
                        className="w-full bg-black bg-opacity-50 text-white p-2 rounded mb-2"
                    />
                    <button type="submit" className="w-full bg-white text-black p-2 rounded font-bold hover:bg-gray-200 transition-colors">
                        Submit Total
                    </button>
                </form>
                {message && <p className="mt-4 text-sm font-bold">{message}</p>}
            </div>
        </div>
    );
};

export default Overlay;