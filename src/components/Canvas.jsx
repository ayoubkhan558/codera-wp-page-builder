import React, { useRef } from 'react';
import { useEditorState } from '../hooks/useEditorState';
import { useElementActions } from '../hooks/useElementActions';
import ElementRenderer from './ElementRenderer';

const Canvas = ({ viewMode }) => {
    const { state } = useEditorState();
    const { addElement, selectElement } = useElementActions();
    const canvasRef = useRef(null);
    const [isDraggingOver, setIsDraggingOver] = React.useState(false);

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);

        // Root drop handler
        const type = e.dataTransfer.getData('type');
        const tagName = e.dataTransfer.getData('tagName');

        if (type) {
            addElement(type, null, { tagName }); // Add to root
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        // Only clear if actually leaving the canvas area
        if (e.target === canvasRef.current) {
            setIsDraggingOver(false);
        }
    };

    const handleCanvasClick = (e) => {
        if (e.target === canvasRef.current) {
            selectElement(null);
        }
    };

    const getCanvasStyle = () => {
        let width = '100%';
        if (viewMode === 'tablet') width = '768px';
        if (viewMode === 'mobile') width = '375px';

        return {
            width: width,
            maxWidth: '1200px',
            minHeight: '800px',
            backgroundColor: isDraggingOver ? 'rgba(0, 183, 255, 0.05)' : 'transparent',
            boxShadow: isDraggingOver ? '0 0 40px rgba(0,183,255,0.3)' : '0 0 40px rgba(0,0,0,0.1)',
            marginBottom: '50px',
            transition: 'width 0.3s ease, background-color 0.2s, box-shadow 0.2s',
            border: isDraggingOver ? '2px dashed var(--primary)' : 'none'
        };
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
            onDragLeave={onDragLeave}
        >
            <div
                style={getCanvasStyle()}
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
