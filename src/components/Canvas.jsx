import React, { useRef } from 'react';
import { useEditorState } from '../hooks/useEditorState';
import { useElementActions } from '../hooks/useElementActions';
import ElementRenderer from './ElementRenderer';

const Canvas = () => {
    const { state } = useEditorState();
    const { addElement, selectElement } = useElementActions();
    const canvasRef = useRef(null);

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Root drop handler
        const type = e.dataTransfer.getData('type');
        const tagName = e.dataTransfer.getData('tagName');

        if (type) {
            addElement(type, null, { tagName }); // Add to root
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const handleCanvasClick = (e) => {
        if (e.target === canvasRef.current) {
            selectElement(null);
        }
    };

    return (
        <div
            className="codera-canvas-bg"
            style={{
                flex: 1,
                position: 'relative',
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                padding: '50px'
            }}
            onClick={handleCanvasClick}
            ref={canvasRef}
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '1200px',
                    minHeight: '800px',
                    backgroundColor: 'transparent',
                    boxShadow: '0 0 40px rgba(0,0,0,0.1)',
                    marginBottom: '50px'
                }}
            >
                {state.isLoading ? (
                    <div style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>Loading...</div>
                ) : state.elements.length === 0 ? (
                    <div style={{
                        height: '100%',
                        border: '2px dashed var(--border)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)'
                    }}>
                        Drag elements here
                    </div>
                ) : (
                    state.elements.map(el => (
                        <ElementRenderer key={el.id} element={el} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Canvas;
