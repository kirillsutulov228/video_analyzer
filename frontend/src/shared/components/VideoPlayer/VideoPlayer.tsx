import {
  ChangeEvent,
  PropsWithChildren,
  RefObject, useCallback, useEffect, useMemo, useRef, useState
} from 'react'
import './VideoPlayer.scss'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import ReactPlayer, { ReactPlayerProps } from 'react-player'
import { OnProgressProps } from 'react-player/base'

export type VideoPlayerProps = PropsWithChildren<{
  wrapperRef?: RefObject<HTMLDivElement>,
  className?: string,
}> & ReactPlayerProps

const DynamicReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => <div className={'react-player-loader'}></div>
})

export default function VideoPlayer ({ wrapperRef, className, children, onReady, onProgress, ...props }: VideoPlayerProps) {
  const wrapperRefFallback = useRef<HTMLDivElement | null>(null)
  const wrapperElement = (wrapperRef?.current || wrapperRefFallback.current)
  const [currentTimestamp, setCurrentTimestamp] = useState(0)

  const videoElement = useMemo(() => {
    return wrapperElement?.querySelector('video')
  }, [wrapperElement])

  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isVideoRunning, setIsVideoRunning] = useState(false)

  useEffect(() => {
    if (!videoElement) return

    const onVideoClick = (event: MouseEvent) => {
      event.preventDefault()
      videoElement.paused ? videoElement.play() : videoElement.pause()
    }

    videoElement.addEventListener('click', onVideoClick)
    return () => {
      videoElement.removeEventListener('click', onVideoClick)
    }
  }, [videoElement, wrapperElement])

  const onReadyHandler = useCallback((player: ReactPlayer) => {
    setIsVideoReady(true)
    onReady?.(player)
  }, [onReady])

  const onVideoProgress = useCallback((state: OnProgressProps) => {
    setCurrentTimestamp(state.playedSeconds)
    onProgress?.(state)
  }, [onProgress])

  const onSliderChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (!videoElement) return
    const target = event.target as HTMLInputElement
    videoElement.currentTime = parseFloat(target.value)
  }, [videoElement])

  return (
    <div className={classNames('video-wrapper', className)} ref={wrapperRef || wrapperRefFallback}>
      <DynamicReactPlayer
        {...props}
        controls={false}
        onProgress={onVideoProgress}
        onPlay={() => setIsVideoRunning(true)}
        onPause={() => setIsVideoRunning(false)}
        onReady={onReadyHandler}
      >
      </DynamicReactPlayer>
      {!isVideoRunning && isVideoReady && <button className={'play-button-thumbnail'} title={'play'} />}
      {isVideoReady && (
        <nav className={'video-control-nav'}>
          <span className={'current-timestamp'}>{new Date(currentTimestamp * 1000).toISOString().substring(11, 19)}</span>
          <input
            type={'range'}
            className={'video-time-slider'}
            min={0} max={videoElement?.duration || 0}
            value={currentTimestamp}
            step={1}
            onChange={onSliderChange}/>
        </nav>
      )}
      {children}
    </div>
  )
}
