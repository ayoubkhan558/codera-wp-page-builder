import React, { useEffect } from 'react';
import { EditorProvider } from './hooks/useEditorState';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Navigator from './components/Navigator'; // We'll create this next
import { Icon, arrowLeft } from '@wordpress/icons';

const AppContent = () => {
    const postId = window.coderaData?.post_id;

    useEffect(() => {
        // Add class to body for full screen override
        document.body.classList.add('codera-editor-active');
        return () => {
            document.body.classList.remove('codera-editor-active');
        };
    }, []);

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div id="codera-app">
            {/* Top Bar */}
            <div className="codera-topbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        onClick={handleBack}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
                        title="Back to WordPress"
                    >
                        <Icon icon={arrowLeft} />
                    </button>
                    <span style={{ fontWeight: 600 }}>Codera Builder {postId && <span style={{ fontWeight: 400, color: '#666', fontSize: '0.9em' }}>— Post #{postId}</span>}</span>
                </div>
                <div>
                    {/* Save Button will be moved here or in actions */}
                    <button className="components-button is-primary">Save Changes</button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="codera-workspace">
                {/* Left Sidebar: Widgets & Edit Settings */}
                <div className="codera-sidebar-left">
                    <Sidebar />
                </div>

                {/* Center: Canvas */}
                <div className="codera-canvas-area">
                    <div className="codera-canvas-wrapper">
                        {/* Scale/Zoom wrapper could go here */}
                        <Canvas />
                    </div>
                </div>

                {/* Right Sidebar: Navigator (Structure) */}
                <div className="codera-sidebar-right">
                    <Navigator />
                </div>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <EditorProvider>
            <AppContent />
        </EditorProvider>
    );
};

export default App;
