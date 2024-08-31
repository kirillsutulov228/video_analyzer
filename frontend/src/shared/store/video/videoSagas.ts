import { put, takeLatest } from 'redux-saga/effects'
import { videoSlice } from '@/shared/store/video/videoSlice'
import { call } from '@redux-saga/core/effects'
import { RectangleEvent } from '@/shared/types'

const FETCH_VIDEO_EVENTS_URL = 'https://5025y.wiremockapi.cloud/json/1'

export const videoSagasActions = {
  fetchRectangleEvents: () => ({ type: 'FETCH_RECTANGLE_EVENTS', payload: null })
}

function * fetchRectangleEvents () {
  yield put(videoSlice.actions.reset())
  try {
    const response: Awaited<ReturnType<typeof fetch>> = yield call(fetch, FETCH_VIDEO_EVENTS_URL)
    if (!response.ok) {
      throw new Error()
    }
    const rectangleEvents: RectangleEvent[] = yield response.json()
    yield put(videoSlice.actions.loadRectangleEvents(rectangleEvents))
  } catch (error) {
    yield put(videoSlice.actions.loadRectangleEventsError('Не удалось загрузить список событий'))
  }
}

export function * watchFetchRectangleEventsSaga () {
  yield takeLatest(videoSagasActions.fetchRectangleEvents().type, fetchRectangleEvents)
}
