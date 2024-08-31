import { RectangleEvent } from '@/shared/types'
import classNames from 'classnames'
import { useMemo } from 'react'
import moment from 'moment'
import './RectangleEventList.scss'

export type RectangleEventProps = {
  className?: string
  rectangleEvents: RectangleEvent[],
  activeRectangleEvents: RectangleEvent[],
  isRectangleEventsLoading: boolean,
  rectangleEventsError?: string | null,
  onRectangleEventClick: (rectangleEvent: RectangleEvent) => void,
  timeFormat?: string
}

export type PreparedRectangleEvent = {
  original: RectangleEvent,
  startTime: string,
  endTime: string
  isActive: boolean
}

export default function RectangleEventList ({
  className,
  isRectangleEventsLoading,
  onRectangleEventClick,
  rectangleEventsError,
  activeRectangleEvents,
  rectangleEvents,
  timeFormat = 'mm:ss:SSS'
}: RectangleEventProps) {
  const preparedRectangleEvents = useMemo(() => {
    const activeSet = new Set(activeRectangleEvents.map((rectangleEvent) => rectangleEvent))

    return rectangleEvents
      .toSorted((a, b) => (a.timestamp - b.timestamp))
      .map((rectangleEvent) => {
        return {
          original: rectangleEvent,
          startTime: moment.utc(rectangleEvent.timestamp * 1000).format(timeFormat),
          isActive: activeSet.has(rectangleEvent)
        } as PreparedRectangleEvent
      })
  }, [activeRectangleEvents, rectangleEvents, timeFormat])
  console.log({ preparedRectangleEvents })
  return (
    <div className={classNames('rectangle-event-list', className)} data-loading={isRectangleEventsLoading} data-error={Boolean(rectangleEventsError)}>
      {isRectangleEventsLoading
        ? <div className={'rectangle-event-list-loader'}>Загрузка событий...</div>
        : rectangleEventsError
          ? <div className={'rectangle-event-list-error'}>{rectangleEventsError}</div>
          : preparedRectangleEvents.map((rectangleEvent, index) => {
            return (
              <div
                key={rectangleEvent.original.timestamp}
                className={'rectangle-event-list-item'}
                data-active={rectangleEvent.isActive}
                onClick={() => onRectangleEventClick(rectangleEvent.original)}
              >
                <p className={'rectangle-event-title'}>№ {index + 1} ({rectangleEvent.startTime})</p>
              </div>
            )
          })
      }
    </div>
  )
}
