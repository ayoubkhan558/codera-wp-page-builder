import React from 'react';

const ButtonElement = ({ content, isSelected }) => {
    return (
        <div style={{
            padding: '5px',
            border: isSelected ? '2px solid #2271b1' : '1px dashed transparent',
            display: 'inline-block'
        }}>
            <a
                href={content.url}
                onClick={(e) => e.preventDefault()} // Prevent navigation in editor
                style={{
                    backgroundColor: content.backgroundColor || '#0073aa',
                    color: content.color || '#fff',
                    padding: '10px 20px',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    display: 'inline-block',
                    fontSize: '14px'
                }}
            >
                {content.label}
            </a>
        </div>
    );
};

export default ButtonElement;
