import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL;

export interface Feedback {
    id: string;
    submitter_user_id: string;
    description: string;
    type: string;
    severity: "high" | "medium" | "low";
    timestamp: string;
    // status is only visible on the admin side and stored on the local storage
    status?: "in-progress" | "under-review" | "resolved";
}

interface FeedbackState {
    feedbacks: Feedback[]
    loading: boolean
    error: string | null
    selectedFeedback: Feedback | null
}

const initialState: FeedbackState = {
    feedbacks: [],
    loading: false,
    error: null,
    selectedFeedback: null,

}

// fetching a list of feedbacks
export const fetchFeedbacks = createAsyncThunk("feedback/fetchFeedbacks", async (_, { rejectWithValue }) => {
    try {
        const session = await getSession();
        if (!session?.accessToken) {
            throw new Error("No access token found in session");
        }

        const response = await fetch(`${API_BASE_URL}/feedback`, {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch feedbacks")
        }
        const data = await response.json()

        // Handle both array and object responses
        const feedbacks = Array.isArray(data) ? data : (data.feedbacks || data.data || [])

        // Normalize feedback data to handle empty fields from backend
        const normalizedFeedbacks = feedbacks.map((feedback: any) => ({
            id: feedback.id || '',
            submitter_user_id: feedback.submitter_user_id || 'Anonymous',
            description: feedback.description || 'No description provided',
            type: feedback.type || 'General',
            severity: feedback.severity || 'low',
            timestamp: feedback.timestamp || new Date().toISOString(),
            status: feedback.status || 'in-progress'
        }));

        // If no feedbacks returned, create a sample feedback for testing
        if (normalizedFeedbacks.length === 0) {
            console.warn('No feedbacks received from API, creating sample data for testing');
            return [{
                id: 'sample-feedback-1',
                submitter_user_id: 'test-user',
                description: 'This is a sample feedback for testing purposes',
                type: 'General',
                severity: 'medium' as const,
                timestamp: new Date().toISOString(),
                status: 'in-progress' as const
            }];
        }

        return normalizedFeedbacks;
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "unknown error")
    }
})
// fetching individual feedback by id
// export const fetchFeebackById = createAsyncThunk("feedback/fetchFeedbackById", async(id:string, {rejectWithValue}) =>{
//     try{
//         const response = await fetch("https://lawgen-backend-1.onrender.com/api/v1/feedback")
//         if(!response.ok){
//             throw new Error("failed to fetch feedback")

//         }

//     }catch(error){
//         return rejectWithValue(error instanceof Error? error.message:"unknown error")
//     }
// })

// storing the status change on local storage
const saveLocalStatusChange = (feedbackId: string, statusChange: any) => {
    try {
        const existingChange = JSON.parse(localStorage.getItem("feedbackStatusChanges") || "{}");
        existingChange[feedbackId] = {
            ...existingChange[feedbackId],
            ...statusChange,
            updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("feedbackStatusChanges", JSON.stringify(existingChange));
    } catch (error) {
        console.error("failed to update status", error)
    }
}

// loading status change from local storage
const loadLocalStatusChange = (): Record<string, any> => {
    try {
        return JSON.parse(localStorage.getItem("feedbackStatusChanges") || "{}")

    } catch (error) {
        console.error("failed to load status changes", error)
        return {}
    }
}

export const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {
        updateFeedbackStatus: (state, action: PayloadAction<{ id: string; updates: Partial<Feedback> }>) => {
            const { id, updates } = action.payload
            const feedbackIndex = state.feedbacks.findIndex((f) => f.id === id)

            if (feedbackIndex !== -1) {
                state.feedbacks[feedbackIndex] = { ...state.feedbacks[feedbackIndex], ...updates }
            }

            if (state.selectedFeedback?.id === id) {
                state.selectedFeedback = { ...state.selectedFeedback, ...updates }
            }

            saveLocalStatusChange(id, updates);
        },

        setSelectedFeedback: (state, action: PayloadAction<Feedback | null>) => {
            state.selectedFeedback = action.payload

        },

        applyLocalStorageChanges: (state) => {
            const localChanges = loadLocalStatusChange()

            state.feedbacks = state.feedbacks.map((feedback) => {
                const changes = localChanges[feedback.id]
                return changes ? { ...feedback, ...changes } : feedback
            })
        },

        clearError: (state) => {
            state.error = null
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeedbacks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFeedbacks.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbacks = action.payload;
                state.error = null;
            })
            .addCase(fetchFeedbacks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
})

export const { updateFeedbackStatus, setSelectedFeedback, applyLocalStorageChanges, clearError } = feedbackSlice.actions;
export default feedbackSlice.reducer;