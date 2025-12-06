import React from 'react';
import { useEditorState } from '../hooks/useEditorState';
import { useElementActions } from '../hooks/useElementActions';
import ElementRenderer from '../components/ElementRenderer';

const ContainerElement = ({ element, isSelected }) => {
    const { addElement } = useElementActions();

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const type = e.dataTransfer.getData('type');
        if (type) {
            addElement(type, element.id); // Add as child of this container
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const Tag = element.content.tagName || 'div';

    const style = {
        padding: element.content.padding || '20px',
        backgroundColor: element.content.backgroundColor || 'transparent',
        border: isSelected ? '2px solid var(--codera-accent, #2271b1)' : '1px dashed var(--codera-border, #ccc)', // Use CSS var if available
        minHeight: element.content.minHeight || '100px',
        display: 'flex',
        flexDirection: element.content.flexDirection || 'column',
        gap: element.content.gap || '10px',
        position: 'relative',
        width: element.content.width || 'auto',
        color: 'inherit'
    };

    return (
        <Tag
            style={style}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="codera-container"
        >
            {element.children && element.children.length > 0 ? (
                element.children.map(child => (
                    <ElementRenderer key={child.id} element={child} />
                ))
            ) : (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: 'inherit',
                    opacity: 0.5,
                    fontSize: '12px',
                    pointerEvents: 'none',
                    border: '1px dotted currentColor',
                    borderRadius: '4px',
                    margin: '10px'
                }}>
                    {Tag} Container
                </div>
            )}
        </Tag>
    );
};

export default ContainerElement;
