import React from 'react'
import { Link } from 'react-router-dom'
// NOTE: Logo import removed as requested

function Footer() {
    // Define the link structure with target URLs
    const footerLinks = {
        features: [
            { name: "Code Repository", url: "https://github.com/chaitanya-mutyala/PassTheTorch-", external: true }, // 💡 GitHub Link
        ],
        support: [
            { name: "Account", url: "#", external: false },
            { name: "Help", url: "#", external: false },
            { name: "Contact Us", url: "https://www.linkedin.com/in/chaitanya-mutyala-6b89a9250/", external: true }, // 💡 LinkedIn Link
        ],
        legals: [
            { name: "Terms & Conditions", url: "#", external: false },
            { name: "Privacy Policy", url: "#", external: false },
            { name: "Licensing", url: "#", external: false },
        ]
    };

    return (
        // 💡 Background is bg-indigo-500
        <footer className="px-40 w-full bg-indigo-500 text-white shadow-inner mt-12">
            
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                
                {/* Main Content Grid - Exactly Three Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-b border-indigo-400">
                    
                    {/* Column 1: FEATURES */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 uppercase text-indigo-200">Features</h3>
                        <ul>
                            {footerLinks.features.map((item) => (
                                <li key={item.name} className="mb-2">
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-base text-white hover:text-white transition duration-200 cursor-pointer"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Column 2: SUPPORT */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 uppercase text-indigo-200">Support</h3>
                        <ul>
                            {footerLinks.support.map((item) => (
                                <li key={item.name} className="mb-2">
                                    <a
                                        href={item.url}
                                        target={item.external ? "_blank" : "_self"}
                                        rel={item.external ? "noopener noreferrer" : ""}
                                        className="text-base text-white hover:text-white transition duration-200 cursor-pointer"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Column 3: LEGALS */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 uppercase text-indigo-200">Legals</h3>
                        <ul>
                            {footerLinks.legals.map((item) => (
                                <li key={item.name} className="mb-2">
                                    <a href={item.url} className="text-base text-white hover:text-white transition duration-200 cursor-pointer">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom - Personal Credit */}
                <div className="py-4 text-center text-md text-white">
                    Made with <span className="text-white-400">💙</span> by Chaitanya Mutyala
                </div>
            </div>
        </footer>
    );
}

export default Footer;
