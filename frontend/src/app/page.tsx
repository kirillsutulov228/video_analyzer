'use client'

import { useAppDispatch, useAppSelector } from '@/shared/store/store'
import { useEffect, useState } from 'react'
import { videoSagasActions } from '@/shared/store/video/videoSagas'
import { videoSlice } from '@/shared/store/video/videoSlice'
import { selectActiveRectangleEvents } from '@/shared/store/video/videoSelectors'

const UPDATE_RECT_INTERVAL_MS = 100

export default function Home () {
  const dispatch = useAppDispatch()
  const activeEvents = useAppSelector(selectActiveRectangleEvents)
  const isRectangleEventsLoading = useAppSelector((state) => state.video.isRectangleEventsLoading)
  const currentTimestamp = useAppSelector((state) => state.video.currentTimestamp)
  const rectangleEventsFetchError = useAppSelector((state) => state.video.rectangleEventsFetchError)

  const [isTimerActive, setTimerActive] = useState(false)

  useEffect(() => {
    if (!isTimerActive) return
    const startTime = new Date().getTime() / 1000

    const interval = setInterval(() => {
      const currentTime = new Date().getTime() / 1000
      const timeDiff = currentTime - startTime
      dispatch(videoSlice.actions.updateCurrentTimestamp(timeDiff))
    }, UPDATE_RECT_INTERVAL_MS)

    return () => {
      dispatch(videoSlice.actions.updateCurrentTimestamp(0))
      clearInterval(interval)
    }
  }, [dispatch, isTimerActive])

  console.log(activeEvents)

  useEffect(() => {
    dispatch(videoSagasActions.fetchRectangleEvents())
  }, [dispatch])

  console.log({ currentTimestamp })

  return (
    <main>
      <h1>Анализатор видео</h1>
      {rectangleEventsFetchError && <p>{rectangleEventsFetchError}</p>}
      <button onClick={() => setTimerActive(v => !v)} disabled={isRectangleEventsLoading || Boolean(rectangleEventsFetchError)}>{isTimerActive ? 'Stop timer' : 'Start timer'}</button>
      <p>
        {JSON.stringify(activeEvents)}
      </p>
    </main>
  )
}
