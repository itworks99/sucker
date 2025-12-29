import {useCallback, useEffect, useReducer, useRef} from 'react';
import type {SearchAction, SearchResult, SearchState} from '../types';

const initialSearchState: SearchState = {
    loading: false,
    results: [],
    value: '',
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
    switch (action.type) {
        case 'CLEAN_QUERY':
            return initialSearchState;
        case 'START_SEARCH':
            return {...state, loading: true, value: action.query};
        case 'FINISH_SEARCH':
            return {...state, loading: false, results: action.results};
        default:
            return state;
    }
}

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function useSearch(source: SearchResult[]) {
    const [state, dispatch] = useReducer(searchReducer, initialSearchState);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

    const handleSearchChange = useCallback(
        (value: string) => {
            clearTimeout(timeoutRef.current);
            dispatch({type: 'START_SEARCH', query: value});

            timeoutRef.current = setTimeout(() => {
                if (value.length < 1) {
                    dispatch({type: 'CLEAN_QUERY'});
                    return;
                }

                const re = new RegExp(escapeRegExp(value), 'i');
                const isMatch = (result: SearchResult) => re.test(result.title);
                const results = source.filter(isMatch);

                dispatch({
                    type: 'FINISH_SEARCH',
                    results,
                });
            }, 300);
        },
        [source]
    );

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return {
        loading: state.loading,
        results: state.results,
        value: state.value,
        handleSearchChange,
    };
}
