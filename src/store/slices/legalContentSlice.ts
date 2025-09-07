import {createSlice, createAsyncThunk, type PayloadAction} from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_FEEDBACK_API_BASE_URL;

// Types
export interface LegalContentGroup {
  group_id: string;
  group_name: string;
}

export interface LegalContent {
  id: string;
  GroupID: string;
  group_name: string;
  name: string;
  description: string;
  url: string;
  language: string;
}

type PostContentResponse = {
  group_id: string;
  id: string;
  message: string;
  url: string;
};

interface LegalContentState {
  groups: LegalContentGroup[];
  contents: LegalContent[];
  singleContent: LegalContent | null;
  loading: boolean;
  error: string | null;
  postResult: PostContentResponse | null;
  meta: { total_items: number; total_pages: number; current_page: number; page_size: number } | null;
}

const initialState: LegalContentState = {
  groups: [],
  contents: [],
  singleContent: null,
  loading: false,
  error: null,
  postResult: null,
  meta: null,
};

// Fetch all content groups
export const fetchContentGroups = createAsyncThunk(
  "legalContent/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession();
      if(!session){
         throw new Error("No access token found in session");
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/contents`,{
        headers:{
          Authorization:`Bearer ${session.accessToken}`
        },
      });
      if (!res.ok) throw new Error("Failed to fetch content groups");

      
      const data = await res.json();
      return data.group;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch content groups");
    }
  }
);

// // Fetch all contents
// export const fetchAllContents = createAsyncThunk(
//   "legalContent/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/contents`);
//       if (!res.ok) throw new Error("Failed to fetch contents");
//       const data = await res.json();
//       return { contents: data.contents, meta: {
//         total_items: data.total_items,
//         total_pages: data.total_pages,
//         current_page: data.current_page,
//         page_size: data.page_size,
//       }};
//     } catch (error) {
//       return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch contents");
//     }
//   }
// );

// Fetch contents by group
export const fetchContentsByGroup = createAsyncThunk(
  "legalContent/fetchByGroup",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const session = await getSession();
      if(!session){
         throw new Error("No access token found in session");
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/contents/group/${groupId}`,{
        headers:{
          Authorization:`Bearer ${session.accessToken}`
        },
      });
      if (!res.ok) throw new Error("Failed to fetch contents by group");
      const data = await res.json();
      return data.contents;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch contents by group");
    }
  }
);

// Fetch single content
export const fetchSingleContent = createAsyncThunk(
  "legalContent/fetchSingle",
  async (contentId: string, { rejectWithValue }) => {
    try {
      const session = await getSession();
      if(!session){
         throw new Error("No access token found in session");
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/contents/${contentId}/view`,{
        headers:{
          Authorization:`Bearer ${session.accessToken}`
        },
      });
      if (!res.ok) throw new Error("Failed to fetch content");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch content");
    }
  }
);

// Thunk for posting new content (with file upload)
export const postContent = createAsyncThunk<
  PostContentResponse,
  {
    file: File;
    group_name: string;
    name: string;
    description: string;
    language: string;
  },
  { rejectValue: string }
>(
  "legalContent/postContent",
  async ({ file, group_name, name, description, language }, { rejectWithValue }) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found in session");
      }

      // Send as JSON (no file upload)
      // Use FormData to match backend's expected format
      const formData = new FormData();
      formData.append("file", file);
      formData.append("group_name", group_name);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("language", language);
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/contents`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${session.accessToken}`
          // Do NOT set Content-Type when sending FormData!
        },
      });
      if (!res.ok) throw new Error("Failed to post content");
      const data = await res.json();
      return data as PostContentResponse;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to post content");
    }
  }
);

// Thunk for deleting a single content by content ID
export const deleteContentById = createAsyncThunk<
  string, // returns deleted content id
  string, // content id
  { rejectValue: string }
>(
  "legalContent/deleteContentById",
  async (contentId, { rejectWithValue }) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found in session");
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/contents/${contentId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        },
      });
      if (!res.ok) throw new Error("Failed to delete content");
      return contentId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete content");
    }
  }
);


// Thunk for deleting a group by group_id
export const deleteGroupById = createAsyncThunk<
  string, // returns deleted group id
  string, // group id
  { rejectValue: string }
>(
  "legalContent/deleteGroupById",
  async (groupId, { rejectWithValue }) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No access token found in session");
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/contents/${groupId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session.accessToken}`
        },
      });
      if (!res.ok) throw new Error("Failed to delete group");
      return groupId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to delete group");
    }
  }
);

const legalContentSlice = createSlice({
  name: "legalContent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentGroups.fulfilled, (state, action: PayloadAction<LegalContentGroup[]>) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchContentGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    //   .addCase(fetchAllContents.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchAllContents.fulfilled, (state, action: PayloadAction<{ contents: LegalContent[]; meta: { total_items: number; total_pages: number; current_page: number; page_size: number } }>) => {
    //     state.loading = false;
    //     state.contents = action.payload.contents;
    //     state.meta = action.payload.meta;
    //   })
    //   .addCase(fetchAllContents.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   })
      .addCase(fetchContentsByGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentsByGroup.fulfilled, (state, action: PayloadAction<LegalContent[]>) => {
        state.loading = false;
        state.contents = action.payload;
      })
      .addCase(fetchContentsByGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSingleContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleContent.fulfilled, (state, action: PayloadAction<LegalContent>) => {
        state.loading = false;
        state.singleContent = action.payload;
      })
      .addCase(fetchSingleContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(postContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postContent.fulfilled, (state, action: PayloadAction<PostContentResponse>) => {
        state.loading = false;
        state.postResult = action.payload;
      })
      .addCase(postContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteContentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContentById.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.contents = state.contents.filter(c => c.id !== action.payload);
      })
      .addCase(deleteContentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteGroupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroupById.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.groups = state.groups.filter(g => g.group_id !== action.payload);
        // Optionally, remove contents belonging to the deleted group
        state.contents = state.contents.filter(c => c.GroupID !== action.payload);
      })
      .addCase(deleteGroupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default legalContentSlice.reducer;