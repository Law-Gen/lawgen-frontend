import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL;

export interface LegalEntity {
  id: string;
  name: string;
  entity_type: string;
  date_of_establishment: string;
  status: string;
  phone: string[];
  email: string[];
  website: string;
  city: string;
  sub_city: string;
  woreda: string;
  street_address: string;
  description: string;
  services_offered: string[];
  jurisdiction: string;
  working_hours: string;
  contact_person: string;
}

interface LegalEntityState {
  entities: LegalEntity[];
  loading: boolean;
  error: string | null;
}

const initialState: LegalEntityState = {
  entities: [],
  loading: false,
  error: null,
};

// Fetch all legal entities
export const fetchLegalEntities = createAsyncThunk(
  "legalEntities/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found in session");
      }
      const response = await fetch(
        `${API_BASE_URL}/api/v1/legal-entities`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch legal entities");
      }
      const data = await response.json();
      return data.items;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch legal entities"
      );
    }
  }
);

// Delete a legal entity by id
export const deleteLegalEntity = createAsyncThunk(
  "legalEntities/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found in session");
      }
      const response = await fetch(
        `${API_BASE_URL}/legal-entities/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete legal entity");
      }
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete legal entity"
      );
    }
  }
);

// Create a new legal entity
export const createLegalEntity = createAsyncThunk(
  "legalEntities/create",
  async (entity: Omit<LegalEntity, "id">, { rejectWithValue }) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found in session");
      }
      const response = await fetch(
        `${API_BASE_URL}/legal-entities`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entity),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create legal entity");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create legal entity"
      );
    }
  }
);

// Update a legal entity by id
export const updateLegalEntity = createAsyncThunk(
  "legalEntities/update",
  async (
    { id, updates }: { id: string; updates: Partial<LegalEntity> },
    { rejectWithValue }
  ) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found in session");
      }
      const response = await fetch(
        `${API_BASE_URL}/legal-entities/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update legal entity");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update legal entity"
      );
    }
  }
);

const legalEntitySlice = createSlice({
  name: "legalEntities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLegalEntities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLegalEntities.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload;
      })
      .addCase(fetchLegalEntities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteLegalEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLegalEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = state.entities.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteLegalEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createLegalEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLegalEntity.fulfilled, (state, action) => {
        state.loading = false;
        state.entities.push(action.payload);
      })
      .addCase(createLegalEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateLegalEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLegalEntity.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.entities.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) {
          state.entities[idx] = action.payload;
        }
      })
      .addCase(updateLegalEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default legalEntitySlice.reducer;
