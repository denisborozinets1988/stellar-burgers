import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import ingredients from '../slices/ingredientsSlice';
import constructorSliceReducer from '../slices/constructorSlice';
import userSliceReducer from '../slices/userSlice';
import orderListAllUsersSliceReducer from '../slices/feedSlice';
import orderCurrentSliceReducer from '../slices/orderCurrentSlice';
import orderListAllUsersSlicereducer from '../slices/orderListUserSlice';
import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase
} from 'react-redux';

const store = configureStore({
  reducer: {
    ingredients,
    constructorItems: constructorSliceReducer,
    user: userSliceReducer,
    feeds: orderListAllUsersSliceReducer,
    order: orderCurrentSliceReducer,
    orders: orderListAllUsersSlicereducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export const useAppDispatch = () => useDispatchBase<AppDispatch>();
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
) => useSelectorBase(selector);

export default store;
