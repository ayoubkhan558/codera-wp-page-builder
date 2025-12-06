import React from 'react';

const ImageElement = ({ content, isSelected }) => {
    return (
        <div style={{
            padding: '5px',
            border: isSelected ? '2px solid #2271b1' : '1px dashed transparent',
            display: 'inline-block'
        }}>
            <img
                src={content.url}
                alt={content.alt}
                style={{
                    maxWidth: '100%',
                    width: content.width || 'auto',
                    display: 'block'
                }}
            />
        </div>
    );
};

export default ImageElement;
