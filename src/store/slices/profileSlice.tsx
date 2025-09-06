import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  profile: {
    gender: string;
    profile_picture_url: string;
    birth_date: string;
    language_preference: string;
  };
  subscription_status: "free" | "premium" | "enterprise";
  created_at: string;
  updated_at: string;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Fetch profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const session = await getSession();
      console.log(session);
      if (!session?.accessToken) {
        throw new Error("No auth token found in session");
      }
      const response = await fetch(
        "https://lawgen-backend.onrender.com/users/me",
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      // console.log(data);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch profile"
      );
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (
    profileData: {
      gender: string;
      birth_date: string;
      language_preference: string;
      profile_picture?: File | string;
    },
    { rejectWithValue }
  ) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No auth token found in session");
      }

      console.log("Profile update data:", profileData);

      // Check if we have a file upload
      const hasFileUpload =
        profileData.profile_picture &&
        typeof profileData.profile_picture !== "string";

      let requestBody;
      let headers: Record<string, string> = {
        Authorization: `Bearer ${session.accessToken}`,
      };

      if (hasFileUpload) {
        // Use FormData for file uploads
        const formData = new FormData();

        if (profileData.gender && profileData.gender.trim()) {
          formData.append("gender", profileData.gender);
        }

        if (profileData.birth_date && profileData.birth_date.trim()) {
          // Accept both YYYY-MM-DD and MM/DD/YYYY, convert to YYYY-MM-DD
          let birthDate = profileData.birth_date;
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
            // MM/DD/YYYY to YYYY-MM-DD
            const [mm, dd, yyyy] = birthDate.split("/");
            birthDate = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
          }
          // Only send if valid
          if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
            formData.append("birth_date", birthDate);
          }
        }
        if (
          profileData.language_preference &&
          profileData.language_preference.trim()
        ) {
          // Backend expects typo: langauge_preference
          formData.append(
            "langauge_preference",
            profileData.language_preference
          );
        }

        if (profileData.profile_picture) {
          formData.append("profile_picture", profileData.profile_picture);
        }

        requestBody = formData;
        console.log("Using FormData for file upload");
      } else {
        // Use JSON for regular updates
        const jsonData: any = {};

        if (profileData.gender && profileData.gender.trim()) {
          jsonData.gender = profileData.gender;
        }

        if (profileData.birth_date && profileData.birth_date.trim()) {
          let birthDate = profileData.birth_date;
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
            const [mm, dd, yyyy] = birthDate.split("/");
            birthDate = `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
          }
          if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
            jsonData.birth_date = birthDate;
          }
        }
        if (
          profileData.language_preference &&
          profileData.language_preference.trim()
        ) {
          // Backend expects typo: langauge_preference
          jsonData.langauge_preference = profileData.language_preference;
        }

        requestBody = JSON.stringify(jsonData);
        headers["Content-Type"] = "application/json";
        console.log("Using JSON for update:", jsonData);
      }

      const response = await fetch(
        "https://lawgen-backend.onrender.com/users/me",
        {
          method: "PUT",
          headers,
          body: requestBody,
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `Failed to update profile: ${response.status} - ${errorText}`
        );
      }

      const responseData = await response.json();
      console.log("Update response:", responseData);
      return responseData;
    } catch (error) {
      console.error("Profile update error:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (
    passwords: { old_password: string; new_password: string },
    { rejectWithValue }
  ) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No auth token found in session");
      }
      const response = await fetch(
        "https://lawgen-backend.onrender.com/users/me/change-password",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwords),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to change password");
      }
      return true;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to change password"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
