import { RootState } from '@/shared/store/store'
import { createSelector } from 'reselect'

export const selectActiveRectangleEvents = createSelector(
  [(state: RootState) => state.video.rectangleEvents, (state: RootState) => state.video.currentTimestamp],
  (rectangleEvents, currentTimestamp) => {
    return rectangleEvents.filter(
      (rectangleEvent) => {
        return currentTimestamp >= rectangleEvent.timestamp &&
          currentTimestamp <= rectangleEvent.timestamp + rectangleEvent.duration
      }
    )
  }
)
