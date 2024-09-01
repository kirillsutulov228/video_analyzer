'use client'

import { RectangleEvent } from '@/shared/types'
import VideoPlayer from '@/shared/components/VideoPlayer/VideoPlayer'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import './RectangleEventViewer.scss'
import RectangleEventList from '@/shared/components/RectangleEventList/RectangleEventList'
import { OnProgressProps } from 'react-player/base'

export type RectangleEventViewerProps = {
  videoUrl: string,
  rectangleEvents: RectangleEvent[],
  isRectangleEventsLoading: boolean,
  rectangleEventsError?: string | null,
  className?: string
}

export default function RectangleEventViewer ({
  videoUrl,
  rectangleEvents,
  isRectangleEventsLoading,
  rectangleEventsError,
  className
}: RectangleEventViewerProps) {
  const videoWrapperRef = useRef<HTMLDivElement>(null!)
  const drawLayerRef = useRef<HTMLCanvasElement>(null!)
  const [drawLayerWidth, setDrawLayerWidth] = useState(0)
  const [drawLayerHeight, setDrawLayerHeight] = useState(0)
  const [currentTimestamp, setCurrentTimestamp] = useState(0)
  const [videoLoadError, setVideoLoadError] = useState<string | null>(null)

  const onVideoProgress = useCallback((state: OnProgressProps) => {
    setCurrentTimestamp(state.playedSeconds)
  }, [])

  const handleOnVideoError = useCallback(() => {
    setVideoLoadError('Не удалось загрузить видео')
  }, [])

  const fitDrawLayer = useCallback((videoElement: HTMLVideoElement) => {
    setDrawLayerWidth(videoElement.videoWidth)
    setDrawLayerHeight(videoElement.videoHeight)
  }, [])

  const onVideoReady = useCallback(() => {
    const videoElement = videoWrapperRef.current.querySelector('video') as HTMLVideoElement
    fitDrawLayer(videoElement)
  }, [fitDrawLayer])

  const moveToRectangleEvent = (rectangleEvent: RectangleEvent) => {
    const videoElement = videoWrapperRef.current.querySelector('video') as HTMLVideoElement
    videoElement.currentTime = rectangleEvent.timestamp + 0.0001
    setCurrentTimestamp(currentTimestamp)
  }

  const activeRectangleEvents = useMemo(() => {
    return rectangleEvents.filter((rect) => {
      return currentTimestamp >= rect.timestamp && currentTimestamp <= rect.timestamp + rect.duration
    })
  }, [currentTimestamp, rectangleEvents])

  useEffect(() => {
    const context = drawLayerRef.current.getContext('2d') as CanvasRenderingContext2D
    context.clearRect(0, 0, drawLayerWidth, drawLayerHeight)
    for (const rect of activeRectangleEvents) {
      context.strokeStyle = '#00FF00'
      context.strokeRect(rect.zone.left, rect.zone.top, rect.zone.width, rect.zone.height)
    }
  }, [activeRectangleEvents, drawLayerHeight, drawLayerWidth])

  return (
    <div className={classNames('rectangle-video-viewer', className)}>
      <div className={'rectangle-event-video-holder'}>
        <VideoPlayer
          width={'100%'}
          height={'100%'}
          controls={false}
          className={'rectangle-event-video-player'}
          url={videoUrl}
          wrapperRef={videoWrapperRef}
          onReady={onVideoReady}
          onProgress={onVideoProgress}
          progressInterval={100}
          onError={handleOnVideoError}
          pip={false}
          config={{
            file: {
              attributes: {
                disablePictureInPicture: true
              }
            }
          }}
        >
        <canvas
          className={'video-draw-layer'}
          ref={drawLayerRef}
          width={drawLayerWidth}
          height={drawLayerHeight} />
        </VideoPlayer>
        {videoLoadError && <p className={'video-load-error'}>{videoLoadError}</p>}
      </div>
      <div className={'rectangle-event-list-wrapper'}>
        <RectangleEventList
          activeRectangleEvents={activeRectangleEvents}
          isRectangleEventsLoading={isRectangleEventsLoading}
          onRectangleEventClick={moveToRectangleEvent}
          rectangleEvents={rectangleEvents}
          rectangleEventsError={rectangleEventsError}
        />
      </div>
    </div>
  )
}
