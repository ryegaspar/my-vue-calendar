import {
	addDays,
	differenceInDays,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isWithinInterval,
	parseISO, startOfMonth, startOfWeek
} from 'date-fns'

export default class DateEvent {
	// persistence
	#storedEvents = []

	#selectedMonthYear = Date.now()

	#selectedStartDate

	#selectedEndDate

	#dailyEvents = []

	constructor() {
		this.#selectedStartDate = startOfWeek(startOfMonth(this.#selectedMonthYear), { weekStartsOn: 0 })
		this.#selectedEndDate = endOfWeek(endOfMonth(this.#selectedMonthYear), { weekStartsOn: 0 })
	}

	get storedEvents() {
		return (JSON.parse(localStorage.getItem('CALENDAR.events')) || [])
	}

	get dailyEvents() {
		this.getMonthEvents()
		return this.#dailyEvents
	}

	get selectedMonthYear() {
		return this.#selectedMonthYear
	}

	get selectedMonthYearFormatted() {
		return format(this.#selectedMonthYear, 'MMMM yyyy')
	}

	get dates() {
		return eachDayOfInterval({
									 start: this.#selectedStartDate,
									 end: this.#selectedEndDate
								 })
	}

	addEvent(event) {
		this.#storedEvents.push(event)
		localStorage.setItem('CALENDAR.events', JSON.stringify(this.#storedEvents))

		// if this is within the selected month, add the event to daily events
		if (this.isWithinSelected(event.startDate) || this.isWithinSelected(event.endDate)) {
			this.addEventToSelected(event)
		}
	}

	setSelected(monthYear) {
		this.#selectedMonthYear = monthYear

		this.#selectedStartDate = startOfWeek(startOfMonth(monthYear), { weekStartsOn: 0 })
		this.#selectedEndDate = endOfWeek(endOfMonth(monthYear), { weekStartsOn: 0 })

		return this
	}

	isWithinSelected(event) {
		return isWithinInterval(parseISO(event), {
			start: this.#selectedStartDate,
			end: this.#selectedEndDate
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