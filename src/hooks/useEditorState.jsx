import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const EditorContext = createContext();

const initialState = {
    elements: [],
    selectedElementId: null,
    isLoading: true,
    isSaving: false,
};

const editorReducer = (state, action) => {
    switch (action.type) {
        case 'SET_ELEMENTS':
            return { ...state, elements: action.payload, isLoading: false };
        case 'ADD_ELEMENT':
            return {
                ...state,
                elements: [...state.elements, action.payload],
                selectedElementId: action.payload.id
            };
        case 'UPDATE_ELEMENT':
            return {
                ...state,
                elements: state.elements.map(el =>
                    el.id === action.payload.id ? { ...el, ...action.payload.updates } : el
                )
            };
        case 'REMOVE_ELEMENT':
            return {
                ...state,
                elements: state.elements.filter(el => el.id !== action.payload),
                selectedElementId: state.selectedElementId === action.payload ? null : state.selectedElementId
            };
        case 'SELECT_ELEMENT':
            return { ...state, selectedElementId: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_SAVING':
            return { ...state, isSaving: action.payload };
        default:
            return state;
    }
};

export const EditorProvider = ({ children }) => {
    const [state, dispatch] = useReducer(editorReducer, initialState);

    useEffect(() => {
        // Load initial data
        const loadData = async () => {
            if (window.coderaData && window.coderaData.root_url) {
                try {
                    const response = await fetch(`${window.coderaData.root_url}/load?post_id=${window.coderaData.post_id || ''}`, {
                        headers: {
                            'X-WP-Nonce': window.coderaData.nonce
                        }
                    });
                    const result = await response.json();
                    if (result.success) {
                        dispatch({ type: 'SET_ELEMENTS', payload: result.data });
                    }
                } catch (error) {
                    console.error("Failed to load layout:", error);
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };
        loadData();
    }, []);

    return (
        <EditorContext.Provider value={{ state, dispatch }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditorState = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditorState must be used within an EditorProvider');
    }
    return context;
};
