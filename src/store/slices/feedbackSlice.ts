import {createSlice, createAsyncThunk, type PayloadAction} from "@reduxjs/toolkit";

export interface Feedback {
  id: string;
  submitter_user_id:string;
  description: string;
  type: string;
  severity: "high" | "medium" | "low";
  timestamp:string;
  // status is only visible on the admin side and stored on the local storage
  status:  "in-progress" | "under-review" | "resolved";
}

interface FeedbackState{
    feedbacks:Feedback[]
    loading:boolean
    error:string|null
    selectedFeedback:Feedback|null
}

const initialState: FeedbackState = {
    feedbacks:[],
    loading:false,
    error:null,
    selectedFeedback:null,

}

// fetching a list of feedbacks
export const fetchFeedbacks = createAsyncThunk("feedback/fetchFeedbacks", async(_,{rejectWithValue}) => {
    try{
        const response = await fetch("")
        if(!response.ok){
            throw new Error("Failed to fetch feedbacks")
        }
        const data = await response.json()
        return data
    }catch(error){
        return rejectWithValue(error instanceof Error? error.message:"unknown error")
    }
})
// fetching individual feedback by id
export const fetchFeebackById = createAsyncThunk("feedback/fetchFeedbackById", async(id:string, {rejectWithValue}) =>{
    try{
        const response = await fetch("")
        if(!response.ok){
            throw new Error("failed to fetch feedback")

        }

    }catch(error){
        return rejectWithValue(error instanceof Error? error.message:"unknown error")
    }
})

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
const loadLocalStatusChange = () : Record<string, any> => {
    try{
        return JSON.parse(localStorage.getItem("feedback status changes") || "{}")

    }catch(error){
        console.error("failed to load stauts changes", error)
        return{}
    }
}

export const feedbackSlice = createSlice({
    name : "feedback",
    initialState,
    reducers:{updateFeedbackStatus:(state, action:PayloadAction<{id:string; updates:Partial<Feedback>}>) =>{
        const {id, updates} = action.payload
        const feedbackIndex = state.feedbacks.findIndex((f) => f.id === id)

        if(feedbackIndex !== -1){
            state.feedbacks[feedbackIndex] = {...state.feedbacks[feedbackIndex], ...updates}
        }

        if(state.selectedFeedback?.id === id) {
            state.selectedFeedback = {...state.selectedFeedback, ...updates}
        }

        saveLocalStatusChange(id, updates);

    },

    setSelectedFeedback:(state, action:PayloadAction<Feedback|null>) =>{
        state.selectedFeedback = action.payload

    },

    applyLocalStorageChanges: (state) => {
      const localChanges = loadLocalStatusChange()

      state.feedbacks = state.feedbacks.map((feedback) => {
        const changes = localChanges[feedback.id]
        return changes ? { ...feedback, ...changes } : feedback
      })
    },

    clearError:(state) => {
        state.error = null
    },

},
})

export const {updateFeedbackStatus, setSelectedFeedback, applyLocalStorageChanges, clearError} = feedbackSlice.actions;
export default feedbackSlice.reducer;