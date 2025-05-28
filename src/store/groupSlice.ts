import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface GroupState {
  
}

const initialState: GroupState = {
}

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
   
  },
})

export const { } = groupSlice.actions
export default groupSlice.reducer