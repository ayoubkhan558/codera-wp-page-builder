import { useEditorState } from './useEditorState';
import { v4 as uuidv4 } from 'uuid';

export const useElementActions = () => {
    const { state, dispatch } = useEditorState();

    // Find element by ID recursively
    const findElementById = (elements, id) => {
        for (const el of elements) {
            if (el.id === id) return el;
            if (el.children) {
                const found = findElementById(el.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    // Remove element by ID recursively
    const removeElementById = (elements, id) => {
        return elements
            .filter(el => el.id !== id)
            .map(el => ({
                ...el,
                children: el.children ? removeElementById(el.children, id) : []
            }));
    };

    // Insert element at specific position
    const insertElement = (elements, targetId, newElement, position) => {
        const result = [];

        for (let i = 0; i < elements.length; i++) {
            const el = elements[i];

            if (el.id === targetId) {
                // Found target
                if (position === 'before') {
                    result.push(newElement);
                    result.push(el);
                } else if (position === 'after') {
                    result.push(el);
                    result.push(newElement);
                } else if (position === 'inside') {
                    result.push({
                        ...el,
                        children: [newElement, ...(el.children || [])]
                    });
                }
            } else {
                // Check children
                if (el.children && el.children.length > 0) {
                    result.push({
                        ...el,
                        children: insertElement(el.children, targetId, newElement, position)
                    });
                } else {
                    result.push(el);
                }
            }
        }

        return result;
    };

    // Check if target is descendant of source
    const isDescendant = (sourceId, targetId) => {
        const source = findElementById(state.elements, sourceId);
        if (!source || !source.children) return false;

        const check = (children) => {
            for (const child of children) {
                if (child.id === targetId) return true;
                if (child.children && check(child.children)) return true;
            }
            return false;
        };

        return check(source.children);
    };

    // Check if element can accept children
    const isNestable = (element) => {
        if (!element) return false;
        return element.type === 'container';
    };

    // Create new element
    const createNewElement = (type, extraProps = {}) => {
        const baseElement = {
            id: uuidv4(),
            type,
            children: [],
            content: {
                ...extraProps,
                padding: '10px',
                margin: '0',
                color: '#e5e5e5',
                fontSize: '16px',
                backgroundColor: 'transparent',
                text: type === 'text' ? 'New Text' : '',
                url: type === 'image' ? 'https://via.placeholder.com/150' : '',
                label: type === 'button' ? 'Click Me' : '',
                flexDirection: 'column',
                gap: '0px',
                html: '<div>HTML</div>'
            }
        };

        if (type === 'container') {
            if (!baseElement.content.tagName) baseElement.content.tagName = 'div';
            if (baseElement.content.tagName === 'section') baseElement.content.minHeight = '100px';
        }

        return baseElement;
    };

    const addElement = (type, parentId = null, extraProps = {}) => {
        console.log('>>> addElement called:', { type, parentId, extraProps });

        let targetId = parentId;

        // If no parent specified and something is selected, try to use it
        if (!targetId && state.selectedElementId) {
            const selected = findElementById(state.elements, state.selectedElementId);
            console.log('Selected element:', selected);
            if (selected && selected.type === 'container') {
                targetId = selected.id;
                console.log('Using selected container as target:', targetId);
            }
        }

        const newElement = createNewElement(type, extraProps);
        console.log('Created new element:', newElement);

        let newElements;
        if (targetId) {
            console.log('Adding to parent:', targetId);
            newElements = insertElement(state.elements, targetId, newElement, 'inside');
        } else {
            console.log('Adding to root');
            newElements = [...state.elements, newElement];
        }

        console.log('New elements after add:', newElements);
        dispatch({ type: 'UPDATE_ELEMENTS', payload: newElements });
        dispatch({ type: 'SELECT_ELEMENT', payload: newElement.id });
    };

    const updateElement = (id, updates) => {
        const updateInTree = (elements) => {
            return elements.map(el => {
                if (el.id === id) {
                    return { ...el, ...updates };
                }
                if (el.children) {
                    return { ...el, children: updateInTree(el.children) };
                }
                return el;
            });
        };

        const newElements = updateInTree(state.elements);
        dispatch({ type: 'UPDATE_ELEMENTS', payload: newElements });
    };

    const removeElement = (id) => {
        const newElements = removeElementById(state.elements, id);
        dispatch({ type: 'UPDATE_ELEMENTS', payload: newElements });
        if (state.selectedElementId === id) {
            dispatch({ type: 'SELECT_ELEMENT', payload: null });
        }
    };

    const moveElement = (sourceId, targetId, position = 'inside') => {
        console.log('=== MOVE ELEMENT START ===');
        console.log('Source:', sourceId, 'Target:', targetId, 'Position:', position);
        console.log('Current elements:', JSON.stringify(state.elements, null, 2));

        // Validation
        if (!sourceId || !targetId) {
            console.error('Missing sourceId or targetId');
            return;
        }

        if (sourceId === targetId) {
            console.error('Cannot move element to itself');
            return;
        }

        if (isDescendant(sourceId, targetId)) {
            console.error('Cannot move element into its own descendant');
            return;
        }

        // Find elements
        const elementToMove = findElementById(state.elements, sourceId);
        const targetElement = findElementById(state.elements, targetId);

        if (!elementToMove) {
            console.error('Source element not found:', sourceId);
            return;
        }

        if (!targetElement) {
            console.error('Target element not found:', targetId);
            return;
        }

        console.log('Element to move:', elementToMove);
        console.log('Target element:', targetElement);

        // Validate position
        if (position === 'inside' && !isNestable(targetElement)) {
            console.error('Target element cannot accept children. Type:', targetElement.type);
            return;
        }

        // Remove from current position
        let newElements = removeElementById(state.elements, sourceId);
        console.log('After removal:', JSON.stringify(newElements, null, 2));

        // Insert at new position
        newElements = insertElement(newElements, targetId, elementToMove, position);
        console.log('After insertion:', JSON.stringify(newElements, null, 2));

        if (!newElements || newElements.length === 0) {
            console.error('Insert failed - no elements returned');
            return;
        }

        // Update state
        console.log('Dispatching UPDATE_ELEMENTS');
        dispatch({ type: 'UPDATE_ELEMENTS', payload: newElements });
        console.log('=== MOVE ELEMENT END ===');
    };

    const selectElement = (id) => {
        console.log('Selecting element:', id);
        dispatch({ type: 'SELECT_ELEMENT', payload: id });
    };

    const saveLayout = async () => {
        if (!window.coderaData || !window.coderaData.root_url) {
            console.error("Codera API not configured");
            return;
        }

        dispatch({ type: 'SET_SAVING', payload: true });

        try {
            const response = await fetch(`${window.coderaData.root_url}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.coderaData.nonce
                },
                body: JSON.stringify({
                    post_id: window.coderaData.post_id || 0,
                    elements: state.elements
                })
            });
            const result = await response.json();
            if (result.success) {
                console.log("Saved successfully");
            } else {
                console.error("Save failed:", result);
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            dispatch({ type: 'SET_SAVING', payload: false });
        }
    };

    return {
        addElement,
        updateElement,
        removeElement,
        moveElement,
        selectElement,
        saveLayout
    };
};
