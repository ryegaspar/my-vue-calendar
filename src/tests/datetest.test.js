import DateEvent from '@/DateEvent'

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
	let dateEvent

	function getStorage(){
		return JSON.parse(fakeLocalStorage.getItem(dateEvent.localKey))
	}

	beforeEach(() => {
		Object.defineProperty(window, 'localStorage', { value: fakeLocalStorage })

		dateEvent = new DateEvent()
	})

	it('it can add an event and store in local storage', () => {
		dateEvent.addEvent(event)

		const storage = getStorage()[0]

		expect(storage)
			.toMatchObject({
							   allDay: false,
							   endDate: '2000-01-01',
							   startDate: '2000-01-01',
							   eventDescription: 'a new event!',
							   date: '2000-01-01'
						   })
	})

	it('it can add an event that ranges more than a day', () => {
		localStorage.clear()
		dateEvent.addEvent({
			...event,
			...{ endDate: '2000-01-02' }
		})

		const storage1 = getStorage()[0]
		const storage2 = getStorage()[1]

		expect(storage1)
			.toMatchObject({
							   allDay: false,
							   endDate: '2000-01-02',
							   startDate: '2000-01-01',
							   eventDescription: 'a new event!',
							   date: '2000-01-01'
						   })

		expect(storage2)
			.toMatchObject({
							   allDay: false,
							   endDate: '2000-01-02',
							   startDate: '2000-01-01',
							   eventDescription: 'a new event!',
							   date: '2000-01-02'
						   })
	})
})