import React from 'react';
import DraggableWrapper from './DraggableWrapper';

const ElementRenderer = ({ element }) => {

    // Recursive render children
    const renderChildren = () => {
        if (!element.children || element.children.length === 0) return null;
        return element.children.map(child => (
            <ElementRenderer key={child.id} element={child} />
        ));
    };

    const renderContent = () => {
        const { type, content } = element;
        const style = {
            padding: content.padding,
            margin: content.margin,
            color: content.color,
            fontSize: content.fontSize,
            backgroundColor: content.backgroundColor,
            textAlign: content.textAlign,
            width: content.width,
            height: content.height,
            minHeight: content.minHeight,
            // Flex props
            display: type === 'container' ? 'flex' : 'block',
            flexDirection: content.flexDirection || 'column',
            gap: content.gap,
            alignItems: content.alignItems,
            justifyContent: content.justifyContent,
        };

        switch (type) {
            case 'container':
                const Tag = content.tagName || 'div';
                return (
                    <Tag style={style}>
                        {renderChildren()}
                    </Tag>
                );

            case 'text':
                // Check if it's a specific tag (h1-h6, p) or generic text
                // For now, simplify to div but support font styles
                return (
                    <div style={style}>
                        {content.text || 'Text Block'}
                    </div>
                );

            case 'image':
                return (
                    <div style={{ ...style, lineHeight: 0 }}>
                        <img
                            src={content.url || 'https://via.placeholder.com/150'}
                            alt={content.alt || 'Image'}
                            style={{ maxWidth: '100%', width: content.width, height: 'auto' }}
                        />
                    </div>
                );

            case 'button':
                return (
                    <div style={style}>
                        <a
                            href={content.url || '#'}
                            style={{
                                display: 'inline-block',
                                padding: '10px 20px',
                                background: content.backgroundColor || '#0073aa',
                                color: content.color || '#fff',
                                textDecoration: 'none',
                                borderRadius: '4px'
                            }}
                            onClick={(e) => e.preventDefault()} // Prevent nav in builder
                        >
                            {content.label || 'Button'}
                        </a>
                    </div>
                );

            case 'html':
                return (
                    <div style={style} dangerouslySetInnerHTML={{ __html: content.html || '<div>HTML Element</div>' }} />
                );

            default:
                return <div style={style}>Unknown Type: {type}</div>;
        }
    };

    return (
        <DraggableWrapper element={element}>
            {renderContent()}
        </DraggableWrapper>
    );
};

export default ElementRenderer;
