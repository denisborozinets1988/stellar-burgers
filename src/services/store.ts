import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredients from '../slices/ingredientsSlice';
import constructorSliceReducer from '../slices/constructorSlice';
import userSliceReducer from '../slices/userSlice';

const store = configureStore({
  reducer: {
    ingredients,
    constructorItems: constructorSliceReducer,
    user: userSliceReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
