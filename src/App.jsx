import React from 'react';
import { EditorProvider } from './hooks/useEditorState';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import ElementControls from './components/ElementControls';

const AppContent = () => {
    // We can access window.coderaData directly here or through a hook if we stored it in context.
    const postId = window.coderaData?.post_id;

    return (
        <div style={styles.container}>
            <Sidebar />
            <div style={styles.main}>
                <div style={styles.topBar}>
                    <h1 style={styles.title}>Codera Builder {postId ? `(Post #${postId})` : '(Global Template)'}</h1>
                </div>
                <Canvas />
            </div>
            <ElementControls />
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

const styles = {
    container: {
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f1',
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative'
    },
    topBar: {
        height: '50px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: '18px',
        fontWeight: 600,
        margin: 0
    }
};

export default App;
