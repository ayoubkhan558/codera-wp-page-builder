import React, { useRef, useEffect } from 'react';

const ResizablePanel = ({ width, setWidth, side, children, minWidth = 200, maxWidth = 500, visible = true }) => {
    const isResizing = useRef(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing.current) return;

            let newWidth;
            if (side === 'left') {
                newWidth = e.clientX;
            } else {
                newWidth = window.innerWidth - e.clientX;
            }

            if (newWidth >= minWidth && newWidth <= maxWidth) {
                setWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            if (isResizing.current) {
                isResizing.current = false;
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [side, minWidth, maxWidth, setWidth]);

    const startResize = (e) => {
        e.preventDefault();
        isResizing.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    if (!visible) return null;

    return (
        <div style={{ position: 'relative', width: width, flexShrink: 0, height: '100%', zIndex: 10 }}>
            {side === 'left' && (
                <div
                    className="codera-resizer left"
                    onMouseDown={startResize}
                />
            )}
            {side === 'right' && (
                <div
                    className="codera-resizer right"
                    onMouseDown={startResize}
                />
            )}
            <div style={{ height: '100%', overflow: 'hidden' }}>
                {children}
            </div>
        </div>
    );
};

export default ResizablePanel;
