import React, { useRef } from 'react';
import { useElementActions } from '../hooks/useElementActions';
import { useEditorState } from '../hooks/useEditorState';

const DraggableWrapper = ({ element, children }) => {
    const { selectElement, addElement, moveElement } = useElementActions();
    const { state } = useEditorState();
    const ref = useRef(null);
    const isSelected = state.selectedElementId === element.id;

    const handleDragStart = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData('sourceId', element.id);
        e.dataTransfer.effectAllowed = 'move';
        // setTimeout(() => ref.current.style.opacity = '0.5', 0);
    };

    const handleDragEnd = (e) => {
        // ref.current.style.opacity = '1';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Add visual indicator logic here (border color change)
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const sourceId = e.dataTransfer.getData('sourceId');
        const type = e.dataTransfer.getData('type');
        const tagName = e.dataTransfer.getData('tagName');

        // If dropping onto itself, ignore
        if (sourceId === element.id) return;

        // Logic check: Can this element accept children?
        if (element.type === 'container') {
            if (sourceId) {
                // Move existing element
                moveElement(sourceId, element.id);
            } else if (type) {
                // Add new element
                addElement(type, element.id, { tagName });
            }
        }
    };

    const handleClick = (e) => {
        e.stopPropagation();
        selectElement(element.id);
    };

    return (
        <div
            ref={ref}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`codera-element ${isSelected ? 'selected' : ''}`}
            style={{
                position: 'relative',
                outline: isSelected ? '1px solid var(--primary)' : '1px dashed transparent',
                outlineOffset: '-1px',
                cursor: 'default',
                transition: 'outline-color 0.2s',
                minHeight: element.type === 'container' ? '50px' : 'auto',
                ...((element.type === 'container' && (!element.children || element.children.length === 0))
                    ? { backgroundColor: 'rgba(255,255,255,0.02)' } : {})
            }}
        >
            {isSelected && (
                <div style={{
                    position: 'absolute',
                    top: '-18px',
                    left: '0',
                    background: 'var(--primary)',
                    color: 'white',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '3px 3px 0 0',
                    zIndex: 100,
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap'
                }}>
                    {element.type}
                </div>
            )}
            {children}
        </div>
    );
};

export default DraggableWrapper;
