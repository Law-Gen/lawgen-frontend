import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./slices/userSlice";
// import legalContentReducer from "./slices/legalContentSlice";
// import legalAidReducer from "./slices/legalAidSlice";
import feedbackReducer from "./slices/feedbackSlice";
// import quizReducer from "./slices/quizSlice";
// import quizCategoryReducer from "./slices/quizCategorySlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    legalContent: legalContentReducer,
    legalAid: legalAidReducer,
    feedback: feedbackReducer,
    quizzes: quizReducer,
    quizCategories: quizCategoryReducer,
  },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
