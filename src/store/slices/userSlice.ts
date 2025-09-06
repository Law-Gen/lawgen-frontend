// Async thunk to update user profile (PUT /users/me)
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData: {
    gender: string;
    birth_date: string;
    language_preference: string;
    profile_picture?: File | string;
  }, { rejectWithValue }) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No auth token found in session");
      }
      // Prepare form data
      const formData = new FormData();
      formData.append("gender", profileData.gender);
      formData.append("birth_date", profileData.birth_date);
      formData.append("language_preference", profileData.language_preference);
      if (profileData.profile_picture && typeof profileData.profile_picture !== "string") {
        formData.append("profile_picture", profileData.profile_picture);
      }
      // Make PUT request
      const response = await fetch("https://lawgen-backend.onrender.com/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      // No response body expected
      return true;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to update profile");
    }
  }
);

// Async thunk to change password (PUT /users/me/change-password)
export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (passwords: { old_password: string; new_password: string }, { rejectWithValue }) => {
    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No auth token found in session");
      }
      const response = await fetch("https://lawgen-backend.onrender.com/users/me/change-password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwords),
      });
      if (!response.ok) {
        throw new Error("Failed to change password");
      }
      // No response body expected
      return true;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to change password");
    }
  }
);
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "user" | "admin";
  // status: boolean;
  profile: {
    gender: string;
    profile_picture_url: string;
    birth_date: string;
    language_preference: string;
  }

  subscription_status: "free" | "premium" | "enterprise";
  created_at: string;
  updated_at: string;

}

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
  selectedUser: User | null
  profile: User | null
  profileLoading: boolean
  profileError: string | null
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  selectedUser: null,
  profile: null,
  profileLoading: false,
  profileError: null,
}

// Async thunk to fetch all users from backend
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      // Get session from NextAuth
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error("No auth token found in session");
      }

      // Make GET request to backend
      const response = await fetch("https://lawgen-backend.onrender.com/admin/users", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      // Parse response JSON
      const data = await response.json();
      // Return the array of users from the backend response (Allusers, not AllUsers)
      return data.data.Allusers;
    } catch (error) {
      // Return error message for rejected action
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch users");
    }
  }
);

export const fetchProfile = createAsyncThunk("profile/fetchprofile", async (_, { rejectWithValue }) => {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No auth token found in session");
    }

    const response = await fetch("https://lawgen-backend.onrender.com/users/me", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response) {
      throw new Error("Failed to fetch profile");
    }
    const data = await response.json();
    return data.data.profile;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch profile")
  }
})


export const promoteToAdmin = createAsyncThunk("users/promoteToAdmin", async (email: string, { rejectWithValue }) => {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No auth token found in session");
    }

    const response = await fetch("https://lawgen-backend.onrender.com/admin/promote", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error("Failed to promote user")
    }

    return email
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to promote user")
  }
})

export const demoteToUser = createAsyncThunk("users/demoteToUser", async (email: string, { rejectWithValue }) => {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No auth token found in session");
    }

    const response = await fetch("https://lawgen-backend.onrender.com/admin/demote", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
    if (!response.ok) {
      throw new Error("Failed to demote admin");

    }
    return email
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to demote admin")
  }
})

export const activateUser = createAsyncThunk("users/activateUser", async (email: string, { rejectWithValue }) => {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No auth token found in session");
    }

    const response = await fetch("https://lawgen-backend.onrender.com/admin/activate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error("Failed to activate user")
    }

    return email
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to activate user")
  }
})

export const deactivateUser = createAsyncThunk("users/deactivateUser", async (email: string, { rejectWithValue }) => {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      throw new Error("No auth token found in session");
    }

    const response = await fetch("https://lawgen-backend.onrender.com/admin/deactivate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      throw new Error("Failed to deactivate user")
    }

    return email
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to deactivate user")
  }
})


const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true
        state.profileError = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profileLoading = false
        state.profile = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.profileLoading = false
        state.profileError = action.payload as string
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.profileLoading = true
        state.profileError = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileLoading = false
        // Profile updated successfully, you might want to refetch or update local state
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileLoading = false
        state.profileError = action.payload as string
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.profileLoading = true
        state.profileError = null
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.profileLoading = false
        // Password changed successfully
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.profileLoading = false
        state.profileError = action.payload as string
      })

      // Promote to admin
      .addCase(promoteToAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(promoteToAdmin.fulfilled, (state, action) => {
        state.loading = false
        const user = state.users.find((u) => u.email === action.payload)
        if (user) {
          user.role = "admin"
        }
      })
      .addCase(promoteToAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Demote to user
      .addCase(demoteToUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(demoteToUser.fulfilled, (state, action) => {
        state.loading = false
        const user = state.users.find((u) => u.email === action.payload)
        if (user) {
          user.role = "user"
        }
      })
      .addCase(demoteToUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Activate user
      .addCase(activateUser.fulfilled, (state) => {
        state.loading = false
        // Note: API doesn't return status, so we'd need to refetch or handle differently
      })
      // Deactivate user
      .addCase(deactivateUser.fulfilled, (state) => {
        state.loading = false
        // Note: API doesn't return status, so we'd need to refetch or handle differently
      })
  },
})

export const { setSelectedUser, clearError } = userSlice.actions
export default userSlice.reducer


