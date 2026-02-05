import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';

// Initial state
const initialState = {
    expenses: [],
    settings: {
        monthlyLimit: 0,
        dailyLimit: 0
    },
    error: null,
    loading: true
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    // Construct API URL logic
    // We expect VITE_API_BASE_URL to be the host (e.g. https://myapp.onrender.com)
    // We will append /api/expenses to it.
    const API_URL = import.meta.env.VITE_API_BASE_URL
        ? `${import.meta.env.VITE_API_BASE_URL}/api/expenses`
        : 'http://127.0.0.1:5000/api/expenses';

    // Actions
    async function getExpenses() {
        try {
            const res = await axios.get(API_URL);
            dispatch({
                type: 'GET_EXPENSES',
                payload: res.data.data
            });
        } catch (err) {
            console.error("GET ERROR", err);
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Server Error'
            });
        }
    }

    async function addExpense(expense) {
        console.log("SENDING REQUEST:", expense); // DEBUG: Log payload
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post(API_URL, expense, config);
            console.log("RESPONSE SUCCESS:", res.data); // DEBUG: Log response
            dispatch({
                type: 'ADD_EXPENSE',
                payload: res.data.data
            });
            // Reload to ensuring consistency or just rely on state update
            getExpenses();
        } catch (err) {
            console.error("ADD ERROR:", err); // DEBUG: Log error
            alert("Failed to add expense! Check console."); // Alert user
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Server Error'
            });
        }
    }

    async function deleteExpense(id) {
        try {
            await axios.delete(`${API_URL}/${id}`);
            dispatch({
                type: 'DELETE_EXPENSE',
                payload: id
            });
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response?.data?.error || 'Server Error'
            });
        }
    }

    async function getSettings() {
        try {
            const res = await axios.get(`${API_URL}/settings`);
            dispatch({
                type: 'GET_SETTINGS',
                payload: res.data.data
            });
        } catch (err) {
            console.error(err);
        }
    }

    async function updateSettings(settings) {
        console.log("UPDATING SETTINGS:", settings);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            const res = await axios.post(`${API_URL}/settings`, settings, config);
            console.log("SETTINGS UPDATED:", res.data);
            dispatch({
                type: 'UPDATE_SETTINGS',
                payload: res.data.data
            });
        } catch (err) {
            console.error("SETTINGS ERROR:", err);
            alert("Failed to save settings!");
            console.error(err);
        }
    }

    return (<GlobalContext.Provider value={{
        expenses: state.expenses,
        settings: state.settings,
        error: state.error,
        loading: state.loading,
        getExpenses,
        addExpense,
        deleteExpense,
        getSettings,
        updateSettings
    }}>
        {children}
    </GlobalContext.Provider>);
}
