import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { videoSlice } from '@/shared/store/video/videoSlice'
import { useDispatch, useSelector } from 'react-redux'
import { all } from '@redux-saga/core/effects'
import { watchFetchRectangleEventsSaga } from '@/shared/store/video/videoSagas'

const rootReducer = combineReducers({
  video: videoSlice.reducer
})

function * rootSaga () {
  yield all([
    watchFetchRectangleEventsSaga()
  ])
}

export const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware()

  const store = configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([sagaMiddleware])
  })

  sagaMiddleware.run(rootSaga)

  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector)
