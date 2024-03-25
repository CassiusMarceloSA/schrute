import { Expense } from '@/models';
import { GoogleSheetAPI } from '@/services';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { useCallback, useEffect, useReducer } from 'react';

type State = {
    data: {
        sheetInfo?: GoogleSpreadsheet
        expenses: Expense[];
        recurrentExpenses: Expense[];
    }
    loading: boolean
    error?: string
}

type Action =
    | { type: 'REQUEST_INIT' }
    | { type: 'REQUEST_FINISH' }
    | { type: 'REQUEST_FAILURE'; payload: string }
    | { type: 'SET_SHEET_INFO'; payload: GoogleSpreadsheet }
    | {
        type: 'SET_EXPENSES'; payload: {
            expenses: Expense[];
            recurrentExpenses: Expense[];
        }
    }

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'REQUEST_INIT':
            return { ...state, loading: true }
        case 'REQUEST_FINISH':
            return { ...state, loading: false }
        case 'REQUEST_FAILURE':
            return { ...state, error: action.payload }
        case 'SET_EXPENSES':
            return { ...state, data: { ...state.data, ...action.payload } }

        case 'SET_SHEET_INFO':
            return { ...state, data: { ...state.data, sheetInfo: action.payload } }
        default:
            return state;
    }
}

const INITIAL_STATE: State = {
    data: {
        expenses: [],
        recurrentExpenses: []
    },
    loading: false,
}


function useFetchDataBySheet() {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

    const _getSheetAccess = useCallback(async () => {
        try {
            dispatch({ type: 'REQUEST_INIT' });
            const data = await GoogleSheetAPI.getSheetsAccess();
            dispatch({ type: 'SET_SHEET_INFO', payload: data })
        } catch (e) {
            dispatch({ type: 'REQUEST_FAILURE', payload: 'Error on fetching sheet data' })
        } finally {
            dispatch({ type: 'REQUEST_FINISH' });
        }
    }, [])


    const getAllExpenses = useCallback(async (sheet: GoogleSpreadsheet) => {
        try {
            dispatch({ type: 'REQUEST_INIT' });
            const data = await GoogleSheetAPI.getAllExpenses(sheet);
            localStorage.setItem('EXPENSES_DATA', JSON.stringify(data))
            dispatch({ type: 'SET_EXPENSES', payload: data })
        } catch (e) {
            dispatch({ type: 'REQUEST_FAILURE', payload: 'Error on fetching sheet rows data' })
        } finally {
            dispatch({ type: 'REQUEST_FINISH' });
        }
    }, [state.data.sheetInfo])

    const addRow = useCallback(async (title: string, data: Expense) => {
        try {
            dispatch({ type: 'REQUEST_INIT' });
            const sheet = await GoogleSheetAPI.getSheetByTitle(state.data.sheetInfo!, title);
            await GoogleSheetAPI.addRow(sheet, data);
        } catch (e) {
            dispatch({ type: 'REQUEST_FAILURE', payload: 'Error on create sheet row' })
        } finally {
            dispatch({ type: 'REQUEST_FINISH' });
        }
    }, [state.data.sheetInfo])


    const deleteRow = useCallback(async (row: GoogleSpreadsheetRow) => {
        try {
            dispatch({ type: 'REQUEST_INIT' });
            await GoogleSheetAPI.deleteRow(row);
        } catch (e) {
            dispatch({ type: 'REQUEST_FAILURE', payload: 'Error on delete sheet row' })
        } finally {
            dispatch({ type: 'REQUEST_FINISH' });
        }
    }, [state.data.sheetInfo])

    const getReccurencyExpensesSum = () => Math.round(state.data.recurrentExpenses.reduce((acc, current) => acc + current.value, 0));
    const getCurrentExpensesSum = () => Math.round(state.data.expenses.reduce((acc, current) => acc + current.value, 0));
    const getExpensesByCategory = () => {
        const expenses = [...state.data.expenses, ...state.data.recurrentExpenses].reduce<{ [key: string]: number }>((acc, current) => {
            if (acc[current.category]) {
                return {
                    ...acc,
                    [current.category]: acc[current.category] + current.value
                }
            }

            return { ...acc, [current.category]: current.value }
        }, {})

        const response = [];

        for (const category in expenses) {
            response.push({
                category,
                value: Math.round(expenses[category])
            })
        }

        return response
    }

    useEffect(() => {
        if (!state.data.sheetInfo) {
            _getSheetAccess()
        }
    }, [state.data.sheetInfo])


    useEffect(() => {
        const cachedData = localStorage.getItem('EXPENSES_DATA')
        if (cachedData) {
            dispatch({ type: 'SET_EXPENSES', payload: JSON.parse(cachedData) })
            return;
        }

        if (state.data.sheetInfo) {
            getAllExpenses(state.data.sheetInfo)
        }

    }, [state.data.sheetInfo])

    return {
        addRow,
        deleteRow,
        getAllExpenses,
        getCurrentExpensesSum,
        getReccurencyExpensesSum,
        getExpensesByCategory,
        data: state.data,
        error: state.error,
        loading: state.loading
    }
}

export default useFetchDataBySheet;