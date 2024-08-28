import { RefObject } from 'react'
import type { ReactPlayerProps } from 'react-player'
import dynamic from 'next/dynamic'
import './VideoPlayer.scss'

const DynamicVideoPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => <div className={'video-player-placeholder'} />
})

export type VideoPlayerProps = { wrapperRef?: RefObject<HTMLDivElement> } & ReactPlayerProps

export default function VideoPlayer ({ width = 640, height = 360, wrapperRef, ...props }: VideoPlayerProps) {
  return <div className={'video-wrapper'} style={{ width, height }} ref={wrapperRef}>
    <DynamicVideoPlayer width={width} height={height} {...props} />
  </div>
}
