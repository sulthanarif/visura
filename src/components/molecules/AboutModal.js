// components/molecules/AboutModal.js
import React from "react";
import ModalTemplate from "../templates/ModalTemplate";
import Icon from "../atoms/Icon";
import { Badge } from "flowbite-react";

/**
 * About Modal Component
 * 
 * Displays comprehensive information about the web application including
 * version, features, how it works, and developer contact information.
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Function to call when closing the modal
 */
const AboutModal = ({ isOpen, onClose }) => {
    const appVersion = "2.3.5";
    const lastUpdated = "June 23, 2025";
    const currentYear = new Date().getFullYear();
    const copyrightYear = currentYear > 2024 ? `2024 - ${currentYear}` : "2024";    const features = [
        {
            title: "Storage Optimization",
            icon: "database",
            items: [
                "Reduced storage usage by 30-50%",
                "Automatic image compression and resizing",
                "Smart quality optimization"
            ]
        },
        {
            title: "Security Enhancement",
            icon: "shield",
            items: [
                "Protected project information in URLs",
                "Secure ID-based routing"
            ]
        },
        {
            title: "Performance Improvements",
            icon: "bolt",
            items: [
                "Memory-based CSV generation",
                "Direct browser downloads",
                "Faster file processing"
            ]
        },
        {
            title: "Benefits",
            icon: "thumbs-up",
            items: [
                "Better performance and security",
                "Cleaner storage management",
                "Improved user experience"
            ]
        }
    ];

    // Update Features Section with Latest Optimizations
    const renderOptimizedFeatures = () => (
        <div>            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Icon name="bolt" className="w-5 h-5 text-[#E17218] mr-2" />
                Latest Optimizations & Updates
            </h3>
            <div className="space-y-4">
                {features.map((feature, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-[#E17218]/5 to-[#EBA801]/5 rounded-lg border border-[#E17218]/10">
                        <div className="flex items-center mb-3">
                            <Icon name={feature.icon} className="w-4 h-3 text-[#E17218] mr-2" />
                            <h4 className="font-semibold text-gray-800">{feature.title}</h4>
                        </div>
                        <ul className="space-y-1.5">
                            {feature.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start text-sm text-gray-600">
                                    <span className="w-1.5 h-1.5 bg-[#E17218] rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
    return (        
    <ModalTemplate
            isOpen={isOpen}
            onClose={onClose}
            title="About Visura Scanner"
            icon="info-circle"
            size="lg"
            hideFooter={false}
            footer={
                <div className="flex justify-center w-full">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-white bg-gradient-to-r from-[#E17218] to-[#EBA801] hover:from-[#E17218]/90 hover:to-[#EBA801]/90 rounded-xl shadow-lg shadow-[#E17218]/20 transition-all duration-300 "
                    >
                        Ok, Got it!
                    </button>
                </div>
            }
            footerAlign="center"
        >
            <div className="space-y-6">
                {/* App Info Header */}
                <div className="text-center pb-4 border-b border-gray-100">
                    <div className="flex justify-center mb-3">
                        <img 
                            src="/assets/visura_icon.png" 
                            alt="Visura Scanner" 
                            className="w-16 h-16 rounded-xl shadow-md"
                        />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#E17218] to-[#EBA801] bg-clip-text text-transparent mb-2">
                       Visura Scanner
                    </h2>
                    <div className="flex justify-center items-center gap-3 mb-2">
                        <Badge className="bg-gradient-to-r from-[#E17218] to-[#EBA801] text-white rounded-full px-3">
                            Version {appVersion}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 rounded-full px-3">
                            {lastUpdated}
                        </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Advanced Document Processing & Management System
                    </p>
                </div>

                {/* Features Overview */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Icon name="key" className="w-5 h-5 text-[#E17218] mr-2" />
                        Key Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start p-3 bg-gradient-to-r from-[#E17218]/5 to-[#EBA801]/5 rounded-lg">
                            <Icon name="file" className="w-5 h-5 text-[#E17218] mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-gray-800">OCR Processing</h4>
                                <p className="text-sm text-gray-600">Extract text from PDF documents using advanced AI</p>
                            </div>
                        </div>
                        <div className="flex items-start p-3 bg-gradient-to-r from-[#E17218]/5 to-[#EBA801]/5 rounded-lg">
                            <Icon name="qrcode" className="w-5 h-5 text-[#E17218] mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-gray-800">QR Code Embedding</h4>
                                <p className="text-sm text-gray-600">Automatically embed QR codes into processed documents</p>
                            </div>
                        </div>
                        <div className="flex items-start p-3 bg-gradient-to-r from-[#E17218]/5 to-[#EBA801]/5 rounded-lg">
                            <Icon name="download" className="w-5 h-5 text-[#E17218] mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-gray-800">Transmittal Generation</h4>
                                <p className="text-sm text-gray-600">Generate CSV transmittals with template support</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* updated features */}
                {renderOptimizedFeatures()}
                {/* How It Works */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Icon name="cog" className="w-5 h-5 text-[#E17218] mr-2" />
                        How It Works
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-start">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#E17218] to-[#EBA801] text-white text-sm font-bold mr-3 flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">Upload PDF Documents</h4>
                                <p className="text-sm text-gray-600">Upload single or multiple PDF files to the system</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#E17218] to-[#EBA801] text-white text-sm font-bold mr-3 flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">AI-Powered Processing</h4>
                                <p className="text-sm text-gray-600">Advanced OCR extracts text, titles, codes, and revisions</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#E17218] to-[#EBA801] text-white text-sm font-bold mr-3 flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">QR Code Integration</h4>
                                <p className="text-sm text-gray-600">QR codes are embedded linking to cloud storage</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-[#E17218] to-[#EBA801] text-white text-sm font-bold mr-3 flex-shrink-0">
                                4
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">Data Management</h4>
                                <p className="text-sm text-gray-600">Results are stored securely with full search capabilities</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Stack */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Icon name="code" className="w-5 h-5 text-[#E17218] mr-2" />
                        Technical Stack
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-800">Frontend</div>
                            <div className="text-xs text-gray-600">Next.js + React</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-800">Backend</div>
                            <div className="text-xs text-gray-600">Node.js API</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-800">Database</div>
                            <div className="text-xs text-gray-600">Supabase</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-800">OCR Engine</div>
                            <div className="text-xs text-gray-600">Tesseract.js</div>
                        </div>
                    </div>
                </div>

                {/* Developer Contact */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Icon name="users" className="w-5 h-5 text-[#E17218] mr-2" />
                        Developer Contact
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <Icon name="building" className="w-4 h-4 text-gray-500 mr-3" />
                            <div>
                                <div className="font-medium text-gray-800">PT Summarecon Agung Tbk (Dummy Only)</div>
                                <div className="text-sm text-gray-600">Digital Innovation Team | Informatics Student Independent Study Program</div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Icon name="envelope" className="w-4 h-4 text-gray-500 mr-3" />
                            <div>
                                <div className="text-sm text-gray-800">support@summarecon.com (Dummy Only)</div>
                                <div className="text-xs text-gray-600">Technical Support & Inquiries</div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Icon name="phone" className="w-4 h-4 text-gray-500 mr-3" />
                            <div>
                                <div className="text-sm text-gray-800">+62 123 456 789 (Dummy Only)</div>
                                <div className="text-xs text-gray-600">Business Hours: Mon-Fri 09:00-17:00 WIB</div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Icon name="map-marker" className="w-4 h-4 text-gray-500 mr-3" />
                            <div>
                                <div className="text-sm text-gray-800">Tangerang Selatan, Banten, Indonesia</div>
                                <div className="text-xs text-gray-600">Pradita University </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
                    
                    <p>© {copyrightYear} PT Summarecon Agung Tbk. All rights reserved.</p>
                    <p className="mt-1">Developed with ❤️ for efficient document management</p>
                </div>
            </div>
        </ModalTemplate>
    );
};

export default AboutModal;
