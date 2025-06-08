import { useState, useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';

function PWAManager() {
    // State for tracking update and install status
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [installPrompt, setInstallPrompt] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Register service worker with auto reload on update
    const updateSW = registerSW({
        onNeedRefresh() {
            setUpdateAvailable(true);
        },
        onOfflineReady() {
            console.log('App ready to work offline');
        }
    });

    // Handle the install prompt
    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            setInstallPrompt(e);
        });

        // Check online status
        const handleOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    // Handle installing the PWA
    const handleInstallClick = () => {
        if (!installPrompt) return;

        // Show the install prompt
        installPrompt.prompt();

        // Wait for the user to respond to the prompt
        installPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            // Clear the saved prompt as it can't be used again
            setInstallPrompt(null);
        });
    };

    // Handle updating the app
    const handleUpdateClick = () => {
        if (updateAvailable) {
            updateSW(true);
        }
    };

    // Don't render anything if no action is needed
    if (!installPrompt && !updateAvailable && isOnline) {
        return null;
    }

    return (
        <div className="pwa-manager">
            {!isOnline && (
                <div className="offline-indicator">
                    You are currently offline. Some features may be limited.
                </div>
            )}

            {installPrompt && (
                <button
                    className="install-button"
                    onClick={handleInstallClick}
                >
                    Install MovieBuster App
                </button>
            )}

            {updateAvailable && (
                <div className="update-notification">
                    <p>A new version is available!</p>
                    <button onClick={handleUpdateClick}>
                        Update Now
                    </button>
                </div>
            )}
        </div>
    );
}

export default PWAManager;