import DateEvent from '@/DateEvent'

describe('DateEvent tests', () => {
	const dateEvent = new DateEvent()

	const event = {
		allDay: false,
		endDate: '2000-01-01',
		startDate: '2000-01-01',
		eventDescription: 'a new event!'
	}

	function getStorage(){
		return JSON.parse(localStorage.getItem(dateEvent.localKey))
	}

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

	it('test', () => {
		console.log(getStorage())
	})

})