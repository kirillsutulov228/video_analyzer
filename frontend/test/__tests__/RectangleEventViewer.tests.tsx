import preloadAll from 'jest-next-dynamic-ts'

import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from '@jest/globals'
import RectangleEventViewer from '@/shared/components/RectangleEventViewer/RectangleEventViewer'
import { rectangleEventMock } from '../mocks/videoSlice.mock'
import { setupJestCanvasMock } from 'jest-canvas-mock'

beforeEach(async () => {
  await preloadAll()
  setupJestCanvasMock()
})

const assertRectangleEventViewerLoaded = async (container: HTMLElement) => {
  await waitFor(() => {
    expect(container.querySelector('video')).toBeTruthy()
  })

  const video = container.querySelector('video')
  expect(video).toBeTruthy()
}

describe('RectangleEventViewer', () => {
  it('should render', async () => {
    const { container } = render(<RectangleEventViewer
      videoUrl={'video.mp4'}
      rectangleEvents={[]}
      rectangleEventsError={null}
      isRectangleEventsLoading={false}
    />)
    await assertRectangleEventViewerLoaded(container)
  })

  it('should draw active rectangle', async () => {
    const { container, getByTestId } = render(<RectangleEventViewer
      videoUrl={'video.mp4'}
      rectangleEvents={[rectangleEventMock]}
      rectangleEventsError={null}
      isRectangleEventsLoading={false}
    />)

    await assertRectangleEventViewerLoaded(container)
    const drawLayer = getByTestId('video-draw-layer') as HTMLCanvasElement
    const item = getByTestId('rectangle-event-list-item') as HTMLElement

    fireEvent.click(item)

    const context = drawLayer.getContext('2d') as CanvasRenderingContext2D & {
      __getEvents: () => Array<{ type: string, props: any }>
    }

    const events = context.__getEvents()

    const rectangleEventDraw = events.at(-1)

    expect(rectangleEventDraw).toBeTruthy()
    expect(rectangleEventDraw?.type === 'strokeRect').toBeTruthy()

    expect(
      rectangleEventDraw?.props.x === rectangleEventMock.zone.left &&
      rectangleEventDraw?.props.y === rectangleEventMock.zone.top &&
      rectangleEventDraw?.props.width === rectangleEventMock.zone.width &&
      rectangleEventDraw?.props.height === rectangleEventMock.zone.height
    ).toBeTruthy()
  })
})
