import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RectangleEvent } from '@/shared/types'

export const videoSliceInitialState = {
  rectangleEvents: [] as RectangleEvent[],
  isRectangleEventsLoading: true,
  rectangleEventsFetchError: null as string | null,
  videoLoadingError: null as string | null,
  currentTimestamp: 0
}

export const videoSlice = createSlice({
  name: 'video',
  initialState: videoSliceInitialState,
  reducers: {
    reset () {
      return videoSliceInitialState
    },

    loadRectangleEvents (state, action: PayloadAction<RectangleEvent[]>) {
      state.rectangleEvents = action.payload
      state.isRectangleEventsLoading = false
      state.rectangleEventsFetchError = null
    },

    loadRectangleEventsError (state, action: PayloadAction<string>) {
      state.isRectangleEventsLoading = false
      state.rectangleEventsFetchError = action.payload
      state.rectangleEvents = []
    },

    updateCurrentTimestamp (state, action: PayloadAction<number>) {
      state.currentTimestamp = action.payload
    },

    setVideoLoadingError (state, action: PayloadAction<string | null>) {
      state.videoLoadingError = action.payload
    }
  }
})
