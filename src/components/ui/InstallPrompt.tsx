import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import {
    canInstall,
    promptInstall,
    isiOSDevice,
    getIOSInstallInstructions,
    getInstallButtonText
} from '../../utils/install-handler';

interface InstallPromptProps {
    onClose: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onClose }) => {
    const [showPrompt, setShowPrompt] = useState(false);
    const isIOS = isiOSDevice();

    useEffect(() => {
        // Only show prompt if the app can be installed
        setShowPrompt(canInstall() || isIOS);
    }, [isIOS]);

    const handleInstall = async () => {
        if (isIOS) {
            // Show iOS instructions
            setShowPrompt(true);
        } else {
            const outcome = await promptInstall();
            if (outcome === 'accepted') {
                onClose();
            }
        }
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 mx-auto max-w-md z-50 animate-slide-up">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                aria-label="Close install prompt"
            >
                <X size={20} />
            </button>

            <div className="flex items-center mb-3">
                <div className="mr-3">
                    {isIOS ? <Share size={24} /> : <Download size={24} />}
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Install CynthAI</h3>
                    <p className="text-sm text-gray-600">
                        Get quick access to your daily exercises
                    </p>
                </div>
            </div>

            {isIOS ? (
                <div className="mt-4 text-sm text-gray-700">
                    {getIOSInstallInstructions().split('\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                    ))}
                </div>
            ) : null}

            <div className="mt-4 flex justify-end">
                <button
                    onClick={onClose}
                    className="mr-3 px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                    Maybe Later
                </button>
                <button
                    onClick={handleInstall}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                    {getInstallButtonText()}
                </button>
            </div>
        </div>
    );
};

export default InstallPrompt;