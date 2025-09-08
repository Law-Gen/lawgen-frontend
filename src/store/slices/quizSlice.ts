import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_QUIZ_BASE_URL;

export interface QuizCategory {
	id: string;
	name: string;
    total_quizzes:number;
    created_at: string;
    updated_at: string;
}

export interface QuizState {
	categories: QuizCategory[];
	createCategoryStatus: "idle" | "loading" | "succeeded" | "failed";
	createCategoryError: string | null;
	createQuizStatus?: "idle" | "loading" | "succeeded" | "failed";
	createQuizError?: string | null;
	quizzes?: Quiz[];
	quizzesByCategory?: Record<string, Quiz[]>;
	quizById?: Record<string, Quiz>;
	questionsByQuizId?: Record<string, Question[]>;
}

const initialState: QuizState = {
	categories: [],
	createCategoryStatus: "idle",
	createCategoryError: null,
	createQuizStatus: "idle",
	createQuizError: null,
	quizzes: [],
	quizzesByCategory: {},
	quizById: {},
	questionsByQuizId: {},
};

// Quiz interface
export interface Quiz {
	id: string;
	category_id: string;
	name: string;
	description: string;
	questions: any[];
	total_questions: number;
	created_at: string;
	updated_at: string;
}

// Question interface
export interface Question {
	id: string;
	text: string;
	options: Record<string, string>;
	correct_option: string;
	created_at: string;
	updated_at: string;
}

// Async thunk to create a quiz
export const createQuiz = createAsyncThunk(
	"quiz/createQuiz",
	async (
		{ category_id, name, description }: { category_id: string; name: string; description: string },
		{ rejectWithValue }
	) => {
		try {
			const session = await getSession();
			const res = await fetch(`${API_BASE_URL}/admin/quizzes`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
				body: JSON.stringify({ category_id, name, description }),
			});
			if (!res.ok) {
				const error = await res.json();
				return rejectWithValue(error);
			}
			return await res.json();
		} catch (err) {
			return rejectWithValue(err instanceof Error? err.message : String(err));
		}
	}
);

// Async thunk to create a quiz category
export const createQuizCategory = createAsyncThunk(
	"quiz/createQuizCategory",
	async (name: string, { rejectWithValue }) => {
		try {
			const session = await getSession();

			const res = await fetch(`${API_BASE_URL}/admin/quizzes/categories`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
				body: JSON.stringify({ name }),
			});
			if (!res.ok) {
				const error = await res.json();
				return rejectWithValue(error);
			}
			return await res.json();
		} catch (err) {
			return rejectWithValue(err);
		}
	}
);

// Async thunk to add a question to a quiz
export const addQuestion = createAsyncThunk(
	"quiz/addQuestion",
	async (
		{ quizId, text, options, correct_option }: { quizId: string; text: string; options: Record<string, string>; correct_option: string },
		{ rejectWithValue }
	) => {
		try {
			const session = await getSession();
			if (!session || !session.accessToken) {
  return rejectWithValue("Not authenticated. Please log in again.");
}
// Optionally check role:
if (session.user?.role !== "admin") {
  return rejectWithValue("You do not have permission to perform this action.");
}
			const res = await fetch(`${API_BASE_URL}/admin/quizzes/${quizId}/questions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
				body: JSON.stringify({ text, options, correct_option }),
			});
			if (!res.ok) {
				const error = await res.json();
				return rejectWithValue(error);
			}
			return await res.json();
		} catch (err) {
			return rejectWithValue(err instanceof Error ? err.message : String(err));
		}
	}
);

// Add a thunk to fetch quiz categories
export const fetchQuizCategories = createAsyncThunk(
	"quiz/fetchQuizCategories",
	async (_, { rejectWithValue }) => {
		try {
			const session = await getSession();
			const res = await fetch(`${API_BASE_URL}/quizzes/categories?page=1&limit=10`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
			});
			if (!res.ok) {
				const error = await res.json();
				return rejectWithValue(error);
			}
			const data = await res.json();
			// The categories are in data.items
			return data.items;
		} catch (err) {
			return rejectWithValue(err instanceof Error ? err.message : String(err));
		}
	}
);

// Add a thunk to fetch quizzes by category
export const fetchQuizzesByCategory = createAsyncThunk(
	"quiz/fetchQuizzesByCategory",
	async (
		{ categoryId, page = 1, limit = 10 }: { categoryId: string; page?: number; limit?: number },
		{ rejectWithValue }
	) => {
		try {
			const session = await getSession();
			const res = await fetch(`${API_BASE_URL}/quizzes/categories/${categoryId}?page=${page}&limit=${limit}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
			});
			if (!res.ok) {
				const error = await res.json();
				return rejectWithValue(error);
			}
			const data = await res.json();
			// The quizzes are in data.items
			return data.items;
		} catch (err) {
			return rejectWithValue(err instanceof Error ? err.message : String(err));
		}
	}
);

// Add a thunk to fetch a quiz by ID
export const fetchQuizById = createAsyncThunk(
	"quiz/fetchQuizById",
	async (
		quizId: string,
		{ rejectWithValue }
	) => {
		try {
			const session = await getSession();
			const res = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
			});
			if (!res.ok) {
				const error = await res.json();
				return rejectWithValue(error);
			}
			return await res.json();
		} catch (err) {
			return rejectWithValue(err instanceof Error ? err.message : String(err));
		}
	}
);

// Add a thunk to fetch questions by quiz ID
export const fetchQuestionsByQuizId = createAsyncThunk(
	"quiz/fetchQuestionsByQuizId",
	async (
		quizId: string,
		{ rejectWithValue }
	) => {
		try {
			const session = await getSession();
			const res = await fetch(`${API_BASE_URL}/quizzes/${quizId}/questions`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
			});
			if (!res.ok) {
				const error = await res.json();
				return rejectWithValue(error);
			}
			return await res.json();
		} catch (err) {
			return rejectWithValue(err instanceof Error ? err.message : String(err));
		}
	}
);

// Add a thunk to update a quiz (PUT)
export const updateQuiz = createAsyncThunk(
	"quiz/updateQuiz",
	async (
		{ quizId, name, description }: { quizId: string; name: string; description: string },
		{ rejectWithValue }
	) => {
		try {
			const session = await getSession();
			const res = await fetch(`${API_BASE_URL}/admin/quizzes/${quizId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
				body: JSON.stringify({ name, description }),
			});
			if (!res.ok) {
				const error = await res.json();
				return rejectWithValue(error);
			}
			return await res.json();
		} catch (err) {
			return rejectWithValue(err instanceof Error ? err.message : String(err));
		}
	}
);

// Add a thunk to update a quiz category (PUT)
export const updateQuizCategory = createAsyncThunk(
	"quiz/updateQuizCategory",
	async (
		{ categoryId, name }: { categoryId: string; name: string },
		{ rejectWithValue }
	) => {
		try {
			const session = await getSession();
			const res = await fetch(`${API_BASE_URL}/admin/quizzes/categories/${categoryId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
				body: JSON.stringify({ name }),
			});
			if (!res.ok) {
				const error = await res.json();
				return rejectWithValue(error);
			}
			return await res.json();
		} catch (err) {
			return rejectWithValue(err instanceof Error ? err.message : String(err));
		}
	}
);

// Add a thunk to delete a quiz (DELETE)
export const deleteQuiz = createAsyncThunk(
	"quiz/deleteQuiz",
	async (
		quizId: string,
		{ rejectWithValue }
	) => {
		try {
			const session = await getSession();
			const res = await fetch(`${API_BASE_URL}/admin/quizzes/${quizId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
			});
			if (!res.ok) {
				const error = await res.json();
				return rejectWithValue(error);
			}
			return quizId;
		} catch (err) {
			return rejectWithValue(err instanceof Error ? err.message : String(err));
		}
	}
);

// Add a thunk to delete a question from a quiz (DELETE)
export const deleteQuestion = createAsyncThunk(
	"quiz/deleteQuestion",
	async (
		{ quizId, questionId }: { quizId: string; questionId: string },
		{ rejectWithValue }
	) => {
		try {
			const session = await getSession();
			const res = await fetch(`${API_BASE_URL}/admin/quizzes/${quizId}/questions/${questionId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
			});
			if (!res.ok) {
				const error = await res.json();
				return rejectWithValue(error);
			}
			return { quizId, questionId };
		} catch (err) {
			return rejectWithValue(err instanceof Error ? err.message : String(err));
		}
	}
);

// Add a thunk to delete a quiz category (DELETE)
export const deleteQuizCategory = createAsyncThunk(
	"quiz/deleteQuizCategory",
	async (
		categoryId: string,
		{ rejectWithValue }
	) => {
		try {
			const session = await getSession();
			const res = await fetch(`${API_BASE_URL}/admin/quizzes/categories/${categoryId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
			});
			if (!res.ok) {
				const error = await res.json();
				return rejectWithValue(error);
			}
			return categoryId;
		} catch (err) {
			return rejectWithValue(err instanceof Error ? err.message : String(err));
		}
	}
);

const quizSlice = createSlice({
	name: "quiz",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(createQuizCategory.pending, (state) => {
				state.createCategoryStatus = "loading";
				state.createCategoryError = null;
			})
			.addCase(createQuizCategory.fulfilled, (state, action: PayloadAction<QuizCategory>) => {
				state.createCategoryStatus = "succeeded";
				state.categories.push(action.payload);
			})
			.addCase(createQuizCategory.rejected, (state, action) => {
				state.createCategoryStatus = "failed";
				state.createCategoryError = action.payload as string || "Failed to create category";
			})

			// createQuiz
			.addCase(createQuiz.pending, (state) => {
				state.createQuizStatus = "loading";
				state.createQuizError = null;
			})
			.addCase(createQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
				state.createQuizStatus = "succeeded";
				state.quizzes?.push(action.payload);
			})
			.addCase(createQuiz.rejected, (state, action) => {
				state.createQuizStatus = "failed";
				state.createQuizError = action.payload as string || "Failed to create quiz";
			})
			// addQuestion
			.addCase(addQuestion.fulfilled, (state, action: PayloadAction<Quiz>) => {
				// Update the quiz in quizzes array if it exists
				if (state.quizzes) {
					const idx = state.quizzes.findIndex(q => q.id === action.payload.id);
					if (idx !== -1) {
						state.quizzes[idx] = action.payload;
					}
				}
			})
			.addCase(fetchQuizCategories.fulfilled, (state, action: PayloadAction<QuizCategory[]>) => {
				state.categories = action.payload;
			})
			.addCase(fetchQuizzesByCategory.fulfilled, (state, action) => {
				// action.meta.arg.categoryId is the categoryId
				const categoryId = action.meta.arg.categoryId;
				if (!state.quizzesByCategory) state.quizzesByCategory = {};
				state.quizzesByCategory[categoryId] = action.payload;
			})
			.addCase(fetchQuizById.fulfilled, (state, action) => {
				if (!state.quizById) state.quizById = {};
				state.quizById[action.payload.id] = action.payload;
			})
			.addCase(fetchQuestionsByQuizId.fulfilled, (state, action) => {
				if (!state.questionsByQuizId) state.questionsByQuizId = {};
				// action.meta.arg is quizId
				state.questionsByQuizId[action.meta.arg] = action.payload;
			})
			.addCase(updateQuiz.fulfilled, (state, action) => {
				// Update in quizzes array
				if (state.quizzes) {
					const idx = state.quizzes.findIndex(q => q.id === action.payload.id);
					if (idx !== -1) {
						state.quizzes[idx] = action.payload;
					}
				}
				// Update in quizById
				if (state.quizById) {
					state.quizById[action.payload.id] = action.payload;
				}
			})
			.addCase(updateQuizCategory.fulfilled, (state, action) => {
				// Update in categories array
				const idx = state.categories.findIndex(c => c.id === action.payload.id);
				if (idx !== -1) {
					state.categories[idx] = { ...state.categories[idx], ...action.payload };
				}
			})
			.addCase(deleteQuiz.fulfilled, (state, action) => {
				// Remove from quizzes array
				if (state.quizzes) {
					state.quizzes = state.quizzes.filter(q => q.id !== action.payload);
				}
				// Remove from quizById
				if (state.quizById) {
					delete state.quizById[action.payload];
				}
				// Remove from quizzesByCategory
				if (state.quizzesByCategory) {
					Object.keys(state.quizzesByCategory).forEach(catId => {
						if (state.quizzesByCategory && state.quizzesByCategory[catId]) {
							state.quizzesByCategory[catId] = state.quizzesByCategory[catId].filter(q => q.id !== action.payload);
						}
					});
				}
			})
			.addCase(deleteQuestion.fulfilled, (state, action) => {
				const { quizId, questionId } = action.payload;
				// Remove from questionsByQuizId
				if (state.questionsByQuizId && state.questionsByQuizId[quizId]) {
					state.questionsByQuizId[quizId] = state.questionsByQuizId[quizId].filter(q => q.id !== questionId);
				}
				// Remove from quizById if present
				if (state.quizById && state.quizById[quizId]) {
					state.quizById[quizId].questions = state.quizById[quizId].questions.filter(q => q.id !== questionId);
					state.quizById[quizId].total_questions = state.quizById[quizId].questions.length;
				}
			})
			.addCase(deleteQuizCategory.fulfilled, (state, action) => {
				// Remove from categories array
				state.categories = state.categories.filter(c => c.id !== action.payload);
			});
	},
});

export default quizSlice.reducer;

