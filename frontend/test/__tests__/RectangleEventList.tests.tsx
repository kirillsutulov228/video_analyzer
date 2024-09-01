import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react'
import RectangleEventList from '@/shared/components/RectangleEventList/RectangleEventList'
import '@testing-library/jest-dom'
import { rectangleEventMock } from '../mocks/videoSlice.mock'

describe('RectangleEventList', () => {
  it('should load and render rectangle events', async () => {
    const { queryByTestId } = render(<RectangleEventList
      rectangleEvents={[rectangleEventMock]}
      activeRectangleEvents={[]}
      rectangleEventsError={null}
      isRectangleEventsLoading={false}
    />)
    expect(queryByTestId('rectangle-event-list-item')).toBeTruthy()
  })

  it('should show error', async () => {
    const { queryByTestId } = render(<RectangleEventList
      rectangleEvents={[]}
      activeRectangleEvents={[]}
      rectangleEventsError={'error'}
      isRectangleEventsLoading={false}
    />)

    expect(queryByTestId('rectangle-event-list-error')).toBeTruthy()
  })

  it('should show active event', async () => {
    const { queryByTestId } = render(<RectangleEventList
      rectangleEvents={[rectangleEventMock]}
      activeRectangleEvents={[rectangleEventMock]}
      rectangleEventsError={null}
      isRectangleEventsLoading={false}
    />)

    expect(queryByTestId('rectangle-event-list-item')?.getAttribute('data-active') === 'true').toBeTruthy()
  })
})
