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
        const type = e.dataTransfer.getData('type');
        if (type) {
            addElement(type);
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const handleCanvasClick = () => {
        selectElement(null);
    };

    return (
        <div
            ref={canvasRef}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={handleCanvasClick}
            style={styles.canvas}
        >
            {state.isLoading ? (
                <div style={styles.loading}>Loading layout...</div>
            ) : state.elements.length === 0 ? (
                <div style={styles.empty}>
                    <p>Drag elements here</p>
                </div>
            ) : (
                state.elements.map(el => (
                    <ElementRenderer key={el.id} element={el} />
                ))
            )}
        </div>
    );
};

const styles = {
    canvas: {
        flex: 1,
        margin: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        overflowY: 'auto',
        padding: '40px',
        minHeight: '500px'
    },
    empty: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#999',
        border: '2px dashed #eee',
        borderRadius: '8px'
    },
    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#666'
    }
};

export default Canvas;
