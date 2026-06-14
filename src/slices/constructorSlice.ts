import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

export interface IConstructorState {
  bun: TConstructorIngredient | null;
  constructorItems: TConstructorIngredient[];
  maxId: number;
}

const initialState: IConstructorState = {
  bun: null,
  constructorItems: [],
  maxId: 0
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
        state.maxId = state.maxId ? state.maxId + 1 : 1;
        item.id = state.maxId.toString();
        state.constructorItems.push(item);
      }
    },
    removeConstructorItems: (state, action: PayloadAction<string>) => {
      state.constructorItems = state.constructorItems.filter(
        (x) => x.id !== action.payload
      );
    },
    moveUpConstructorItems: (state, action: PayloadAction<string>) => {
      state.constructorItems = moveItem(
        state.constructorItems,
        action.payload,
        1
      );
    },
    moveDownConstructorItems: (state, action: PayloadAction<string>) => {
      state.constructorItems = moveItem(
        state.constructorItems,
        action.payload,
        2
      );
    }
  },
  selectors: {
    selectItems: (sliceState) => sliceState.constructorItems,
    selectBun: (sliceState) => sliceState.bun
  }
});

function moveItem(
  arr: TConstructorIngredient[],
  id: string,
  mode: 1 | 2
): TConstructorIngredient[] {
  const item = arr.find((x) => x.id === id);
  if (!item) {
    return arr;
  }

  const index = arr.indexOf(item);
  if (index === -1) {
    return [...arr];
  }
  const result = [...arr];

  if (mode === 1) {
    if (index > 0) {
      result[index] = result[index - 1];
      result[index - 1] = item;
    }
  } else {
    if (index < arr.length - 1) {
      result[index] = result[index + 1];
      result[index + 1] = item;
    }
  }

  return result;
}

export const {
  addConstructorItems,
  removeConstructorItems,
  moveUpConstructorItems,
  moveDownConstructorItems
} = constructorSlice.actions;
export const { selectItems, selectBun } = constructorSlice.selectors;
export default constructorSlice.reducer;
