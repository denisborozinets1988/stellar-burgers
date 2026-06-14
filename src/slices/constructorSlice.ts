import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

export interface IConstructorState {
  bun: TConstructorIngredient | null;
  constructorItems: TConstructorIngredient[];
}

const initialState: IConstructorState = {
  bun: null,
  constructorItems: []
};

const constructorSlice = createSlice({
  name: 'constructorItems',
  initialState,
  reducers: {
    addConstructorItems: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const item = action.payload;
      if (item.type === 'bun') {
        state.bun = item;
      } else {
        state.constructorItems.push(action.payload);
      }
    },
    removeConstructorItems: (state, action: PayloadAction<string>) => {
      state.constructorItems = state.constructorItems.filter(
        (x) => x.id !== action.payload
      );
    }
  },
  selectors: {
    selectItems: (sliceState) => sliceState.constructorItems,
    selectBun: (sliceState) => sliceState.bun
  }
});

export const { addConstructorItems, removeConstructorItems } =
  constructorSlice.actions;
export const { selectItems, selectBun } = constructorSlice.selectors;
export default constructorSlice.reducer;
