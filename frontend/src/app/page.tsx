'use client'

import { useAppDispatch, useAppSelector } from '@/shared/store/store'
import { useCallback, useEffect, useRef } from 'react'
import { videoSagasActions } from '@/shared/store/video/videoSagas'
import { videoSlice } from '@/shared/store/video/videoSlice'
import { selectActiveRectangleEvents } from '@/shared/store/video/videoSelectors'
import { OnProgressProps } from 'react-player/base'
import VideoPlayer from '@/shared/components/VideoPlayer/VideoPlayer'
import './page.scss'

const UPDATE_RECT_INTERVAL_MS = 50
const VIDEO_URL = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

export default function Home () {
  const dispatch = useAppDispatch()
  const activeEvents = useAppSelector(selectActiveRectangleEvents)
  const rectangleEventsFetchError = useAppSelector((state) => state.video.rectangleEventsFetchError)
  const videoLoadingError = useAppSelector((state) => state.video.videoLoadingError)
  const videoWrapperRef = useRef<HTMLDivElement | null>(null)
  const drawLayerRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    dispatch(videoSagasActions.fetchRectangleEvents())
  }, [dispatch])

  const onVideoProgress = useCallback((state: OnProgressProps) => {
    dispatch(videoSlice.actions.updateCurrentTimestamp(state.playedSeconds))
  }, [dispatch])

  const handleOnVideoError = useCallback(() => {
    dispatch(videoSlice.actions.setVideoLoadingError('Не удалось загрузить видео'))
  }, [dispatch])

  const reinitializeDrawLayer = useCallback(() => {
    drawLayerRef.current?.remove()
    if (!videoWrapperRef.current) {
      return
    }
    const videoElement = videoWrapperRef.current.querySelector('video')

    if (!videoElement) {
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = videoElement.videoWidth
    canvas.height = videoElement.videoHeight
    canvas.classList.add('video-draw-layer')
    videoWrapperRef.current.appendChild(canvas)
    drawLayerRef.current = canvas
  }, [])

  useEffect(() => {
    const drawLayer = drawLayerRef.current

    if (!drawLayer) {
      return
    }

    const ctx = drawLayer.getContext('2d') as CanvasRenderingContext2D

    ctx.clearRect(0, 0, drawLayer.width, drawLayer.height)

    activeEvents.forEach(activeEvent => {
      ctx.clearRect(0, 0, drawLayer.width, drawLayer.height)
      ctx.strokeStyle = 'rgb(0, 255, 0)'
      ctx.lineWidth = 2
      ctx.strokeRect(activeEvent.zone.left, activeEvent.zone.top, activeEvent.zone.width, activeEvent.zone.height)
    })
  }, [activeEvents])

  return (
    <main>
      <h1>Анализатор видео</h1>
      {rectangleEventsFetchError && <p>{rectangleEventsFetchError}</p>}
      {videoLoadingError && <p>{videoLoadingError}</p>}
      <VideoPlayer
        url={VIDEO_URL}
        controls
        onReady={reinitializeDrawLayer}
        wrapperRef={videoWrapperRef}
        progressInterval={UPDATE_RECT_INTERVAL_MS}
        onProgress={onVideoProgress}
        onError={handleOnVideoError}
      />
    </main>
  )
}
