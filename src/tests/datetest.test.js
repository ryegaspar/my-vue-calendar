import DateEvent from '@/DateEvent'
import { format } from 'date-fns'

const event = {
	allDay: false,
	endDate: '2000-01-01',
	startDate: '2000-01-01',
	eventDescription: 'a new event!'
}

const fakeLocalStorage = (function () {
	let store = {}

	return {
		getItem: function (key) {
			return store[key] || null
		},
		setItem: function (key, value) {
			store[key] = value.toString()
		},
		removeItem: function (key) {
			delete store[key]
		},
		clear: function () {
			store = {}
		}
	}
})()

describe('DateEvent tests', () => {
	let calendarEvents

	function getStorage() {
		return JSON.parse(fakeLocalStorage.getItem('CALENDAR.events'))
	}

	beforeEach(() => {
		Object.defineProperty(window, 'localStorage', { value: fakeLocalStorage })

		calendarEvents = new DateEvent()
	})

	it('it can add an event and store in local storage', () => {
		calendarEvents.addEvent(event)

		const storage = getStorage()[0]

		expect(storage)
			.toMatchObject({
							   allDay: false,
							   endDate: '2000-01-01',
							   startDate: '2000-01-01',
							   eventDescription: 'a new event!',
						   })
	})

	it('it can add an event that ranges more than a day', () => {
		calendarEvents.addEvent({
									  ...event,
									  ...{ endDate: '2000-01-02' }
								  })

		expect(getStorage().length).toBe(1)

		expect(getStorage()[0])
			.toMatchObject({
							   allDay: false,
							   endDate: '2000-01-02',
							   startDate: '2000-01-01',
							   eventDescription: 'a new event!',
						   })
	})

	it('can load the current month/year events', () => {
		const today = format(Date.now(), 'yyyy-MM-dd')

		calendarEvents.addEvent(event)
		calendarEvents.addEvent({
									  ...event,
									  ...{
										  startDate: today,
										  endDate: today
									  }
								  })

		expect(getStorage().length).toBe(2)

		const eventForCurrentMonth = calendarEvents.dailyEvents

		expect(eventForCurrentMonth.length).toBe(1)
		expect(eventForCurrentMonth[0])
			.toMatchObject({
							   allDay: false,
							   endDate: today,
							   startDate: today,
							   eventDescription: 'a new event!',
							   date: today
						   })
	})

	// test to load the events by the week not by date
})