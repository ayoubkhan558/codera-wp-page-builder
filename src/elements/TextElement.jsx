import React from 'react';

const TextElement = ({ content, isSelected }) => {
    return (
        <div style={{
            color: content.color || '#000',
            fontSize: content.fontSize || '16px',
            padding: '10px',
            border: isSelected ? '2px solid #2271b1' : '1px dashed transparent',
            cursor: 'default'
        }}>
            {content.text}
        </div>
    );
};

export default TextElement;
