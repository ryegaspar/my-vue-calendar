import {
	addDays,
	differenceInDays,
	format,
	isSameDay,
	parseISO
} from 'date-fns'

export default class DateEvent {
	#storedEvents = []

	#localKey = 'CALENDAR.events'

	loadEvents() {
		this.#storedEvents = (JSON.parse(localStorage.getItem(this.#localKey)) || [])
		console.log(this.#storedEvents)
	}

	addEvent(event) {
		const startDate = parseISO(event.startDate)
		const endDate = parseISO(event.endDate)

		let tempEvent = Object.assign({}, event)
		tempEvent.date = event.startDate

		const continuousDay = !isSameDay(startDate, endDate)
		event.continuousDay = continuousDay

		this.#storedEvents.push(tempEvent)

		if (continuousDay) {
			const dateDiff = differenceInDays(endDate, startDate)
			for(let i = 1; i <= dateDiff; i++) {
				tempEvent = Object.assign({}, event)
				tempEvent.date = format(addDays(startDate, i),'yyyy-MM-dd')
				this.#storedEvents.push(tempEvent)
			}
		}

		localStorage.setItem(this.#localKey, JSON.stringify(this.#storedEvents))
	}
}