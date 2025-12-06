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

    const style = {
        padding: element.content.padding || '20px',
        backgroundColor: element.content.backgroundColor || 'transparent',
        border: isSelected ? '2px solid #2271b1' : '1px dashed #ccc',
        minHeight: '100px',
        display: 'flex',
        flexDirection: element.content.flexDirection || 'column',
        gap: element.content.gap || '10px',
        position: 'relative'
    };

    return (
        <div
            style={style}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            {element.children && element.children.length > 0 ? (
                element.children.map(child => (
                    <ElementRenderer key={child.id} element={child} />
                ))
            ) : (
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#999',
                    fontSize: '12px',
                    pointerEvents: 'none'
                }}>
                    Drop elements here
                </div>
            )}
        </div>
    );
};

export default ContainerElement;
