import { Group } from '@/types/api.type'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface GroupState {
  groups: Group[] | null
}

const initialState: GroupState = {
  groups: null
}

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
   setGroups(state, action: PayloadAction<any>) {
    state.groups = action.payload;
   }
  },
})

export const { setGroups } = groupSlice.actions
export default groupSlice.reducer