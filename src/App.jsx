import React, { useState, useEffect } from 'react';
import Topbar from './components/Topbar';
import ResizablePanel from './components/ResizablePanel';
import Sidebar from './components/Sidebar';
import Navigator from './components/Navigator';
import Canvas from './components/Canvas';
import { useElementActions } from './hooks/useElementActions';
import { EditorProvider } from './hooks/useEditorState';

const AppContent = () => {
    const [leftWidth, setLeftWidth] = useState(300);
    const [rightWidth, setRightWidth] = useState(250);
    const [isLeftVisible, setIsLeftVisible] = useState(true);
    const [isRightVisible, setIsRightVisible] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [viewMode, setViewMode] = useState('desktop'); // 'desktop', 'tablet', 'mobile'

    const { saveLayout } = useElementActions();

    const handleSave = async () => {
        setIsSaving(true);
        await saveLayout();
        setTimeout(() => setIsSaving(false), 500);
    };

    // Toggle full screen mode on mount
    useEffect(() => {
        document.body.classList.add('codera-editor-active');
        return () => {
            document.body.classList.remove('codera-editor-active');
        };
    }, []);

    return (
        <div id="codera-app">
            {/* Top Toolbar */}
            <Topbar
                isLeftVisible={isLeftVisible}
                toggleLeft={() => setIsLeftVisible(!isLeftVisible)}
                isRightVisible={isRightVisible}
                toggleRight={() => setIsRightVisible(!isRightVisible)}
                onSave={handleSave}
                isSaving={isSaving}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {/* Main Layout */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Left Panel: Elements & Inspector & Settings */}
                <ResizablePanel
                    width={leftWidth}
                    setWidth={setLeftWidth}
                    side="left"
                    visible={isLeftVisible}
                    minWidth={280}
                >
                    <Sidebar />
                </ResizablePanel>

                {/* Center Canvas */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#1e1e1f', // Dark workspace background
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <Canvas viewMode={viewMode} />
                </div>

                {/* Right Panel: Navigator / Layers */}
                <ResizablePanel
                    width={rightWidth}
                    setWidth={setRightWidth}
                    side="right"
                    visible={isRightVisible}
                    minWidth={200}
                >
                    <Navigator />
                </ResizablePanel>
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
