import React, { useRef } from 'react';
import { useElementActions } from '../hooks/useElementActions';
import { useEditorState } from '../hooks/useEditorState';

const DraggableWrapper = ({ element, children }) => {
    const { selectElement, addElement, moveElement } = useElementActions();
    const { state } = useEditorState();
    const ref = useRef(null);
    const isSelected = state.selectedElementId === element.id;
    const [isOver, setIsOver] = React.useState(false);

    const handleDragStart = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData('sourceId', element.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Only show indicator if dropping is possible (e.g. into container)
        if (element.type === 'container') {
            setIsOver(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);

        const sourceId = e.dataTransfer.getData('sourceId');
        const type = e.dataTransfer.getData('type');
        const tagName = e.dataTransfer.getData('tagName');

        // If dropping onto itself, ignore
        if (sourceId === element.id) return;

        // Logic check: Can this element accept children?
        if (element.type === 'container') {
            if (sourceId) {
                // Move existing element inside this container
                moveElement(sourceId, element.id, 'inside');
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
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`codera-element ${isSelected ? 'selected' : ''}`}
            style={{
                position: 'relative',
                outline: isSelected ? '1px solid var(--primary)' : (isOver ? '2px solid var(--accent)' : '1px dashed transparent'),
                outlineOffset: '-1px',
                backgroundColor: isOver ? 'rgba(0, 183, 255, 0.1)' : ((element.type === 'container' && (!element.children || element.children.length === 0)) ? 'rgba(255,255,255,0.02)' : 'transparent'),
                cursor: 'default',
                transition: 'outline-color 0.2s, background-color 0.2s',
                minHeight: element.type === 'container' ? '50px' : 'auto',
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
