import React from 'react';

export const Panel = ({ children, className = '', style = {} }) => (
    <div
        className={`codera-panel ${className}`}
        style={{
            backgroundColor: 'var(--panel)',
            borderRight: '1px solid var(--border)',
            borderLeft: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            color: 'var(--text)',
            ...style
        }}
    >
        {children}
    </div>
);

export const PanelHeader = ({ title, children }) => (
    <div style={{
        padding: '0 12px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--panel-alt)'
    }}>
        <span>{title}</span>
        <div style={{ display: 'flex', gap: '4px' }}>{children}</div>
    </div>
);

export const PanelSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    return (
        <div style={{ borderBottom: '1px solid var(--border)' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '8px 12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    userSelect: 'none',
                    backgroundColor: 'rgba(255,255,255,0.02)'
                }}
            >
                {title}
                <span>{isOpen ? '−' : '+'}</span>
            </div>
            {isOpen && <div style={{ padding: '12px' }}>{children}</div>}
        </div>
    );
};

export const Button = ({ children, onClick, variant = 'secondary', className = '', ...props }) => {
    const bg = variant === 'primary' ? 'var(--primary)' : 'rgba(255,255,255,0.05)';
    const color = variant === 'primary' ? '#fff' : 'var(--text)';

    return (
        <button
            onClick={onClick}
            className={className}
            style={{
                background: bg,
                color: color,
                border: '1px solid var(--border)',
                padding: '6px 12px',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                ...props.style
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export const IconButton = ({ icon, onClick, active, title, ...props }) => (
    <button
        onClick={onClick}
        title={title}
        style={{
            background: active ? 'var(--primary)' : 'transparent',
            color: active ? '#fff' : 'var(--text-muted)',
            border: 'none',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s',
            ...props.style
        }}
        {...props}
    >
        {icon}
    </button>
);

export const Input = ({ label, ...props }) => (
    <div style={{ marginBottom: '8px' }}>
        {label && <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</label>}
        <input
            style={{
                width: '100%',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border)',
                padding: '6px 8px',
                borderRadius: '4px',
                color: 'var(--text)',
                fontSize: '12px',
                outline: 'none'
            }}
            {...props}
        />
    </div>
);

export const Select = ({ label, options = [], ...props }) => (
    <div style={{ marginBottom: '8px' }}>
        {label && <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</label>}
        <select
            style={{
                width: '100%',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border)',
                padding: '6px 8px',
                borderRadius: '4px',
                color: 'var(--text)',
                fontSize: '12px',
                outline: 'none'
            }}
            {...props}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);
