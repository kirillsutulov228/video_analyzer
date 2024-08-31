'use client'

import { useAppDispatch, useAppSelector } from '@/shared/store/store'
import { useEffect } from 'react'
import { videoSagasActions } from '@/shared/store/video/videoSagas'
import RectangleEventViewer from '@/shared/components/RectangleEventViewer/RectangleEventViewer'
import MainLayout from '@/shared/components/MainLayout/MainLayout'
import './page.scss'

const VIDEO_URL = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

export default function Home () {
  const dispatch = useAppDispatch()
  const rectangleEvents = useAppSelector((state) => state.video.rectangleEvents)
  const rectangleEventsFetchError = useAppSelector((state) => state.video.rectangleEventsFetchError)
  const isRectangleEventsLoading = useAppSelector((state) => state.video.isRectangleEventsLoading)

  useEffect(() => {
    dispatch(videoSagasActions.fetchRectangleEvents())
  }, [dispatch])

  return (
    <MainLayout>
      <RectangleEventViewer
        videoUrl={VIDEO_URL}
        rectangleEvents={rectangleEvents}
        isRectangleEventsLoading={isRectangleEventsLoading}
        rectangleEventsError={rectangleEventsFetchError}
      />
    </MainLayout>
  )
}
