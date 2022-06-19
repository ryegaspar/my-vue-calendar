import {
	addDays,
	differenceInDays,
	endOfMonth,
	format,
	isSameDay,
	isWithinInterval,
	parseISO,
	startOfMonth
} from 'date-fns'

export default class DateEvent {
	// persistence
	#storedEvents = []

	#selectedMonthYear = Date.now()

	#dailyEvents = []

	get storedEvents() {
		return (JSON.parse(localStorage.getItem('CALENDAR.events')) || [])
	}

	get dailyEvents() {
		this.getMonthEvents()
		return this.#dailyEvents
	}

	addEvent(event) {
		this.#storedEvents.push(event)
		localStorage.setItem('CALENDAR.events', JSON.stringify(this.#storedEvents))

		// if this is within the selected month, add the event to daily events
	}

	isWithinSelected(event) {
		return isWithinInterval(parseISO(event), {
			start: startOfMonth(this.#selectedMonthYear),
			end: endOfMonth(this.#selectedMonthYear)
		})
	}

	addEventToSelected(ev) {
		const startDate = parseISO(ev.startDate)
		const endDate = parseISO(ev.endDate)

		let tempEvent = Object.assign({}, ev)
		tempEvent.date = ev.startDate

		const continuousDay = !isSameDay(startDate, endDate)
		ev.continuousDay = continuousDay

		this.#dailyEvents.push(tempEvent)

		if (continuousDay) {
			const dateDiff = differenceInDays(endDate, startDate)
			for (let i = 1; i <= dateDiff; i++) {
				tempEvent = Object.assign({}, ev)
				tempEvent.date = format(addDays(startDate, i), 'yyyy-MM-dd')
				this.#dailyEvents.push(tempEvent)
			}
		}
	}

	getMonthEvents() {
		this.#dailyEvents = []

		this.storedEvents
			.filter(i => this.isWithinSelected(i.startDate) || this.isWithinSelected(i.endDate))
			.forEach((ev) => {
				this.addEventToSelected(ev)
			})
	}
}