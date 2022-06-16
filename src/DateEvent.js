import {
	addDays,
	differenceInDays,
	endOfMonth,
	format,
	isSameDay, isWithinInterval,
	parseISO,
	startOfMonth
} from 'date-fns'

export default class DateEvent {
	#storedEvents = []

	#localKey = 'CALENDAR.events'

	#currentMonthYear = Date.now()

	#dailyEvents = []

	get localKey() {
		return this.#localKey
	}

	get dailyEvents() {
		this.fillEvents()
		return this.#dailyEvents
	}

	loadEvents() {
		this.#storedEvents = (JSON.parse(localStorage.getItem(this.#localKey)) || [])
	}

	storeEvent(event) {
		this.#storedEvents.push(event)
		localStorage.setItem(this.#localKey, JSON.stringify(this.#storedEvents))
		this.loadEvents()
	}

	isWithinDefinedMonth(event) {
		const currentMonth = this.#currentMonthYear
		const monthStart = startOfMonth(currentMonth)
		const monthEnd = endOfMonth(currentMonth)

		return isWithinInterval(parseISO(event), {
			start: monthStart,
			end: monthEnd
		})
	}

	fillEvents() {
		this.#dailyEvents = []
		
		this.#storedEvents
			.filter(i => this.isWithinDefinedMonth(i.startDate) || this.isWithinDefinedMonth(i.endDate))
			.forEach((ev) => {
				const startDate = parseISO(ev.startDate)
				const endDate = parseISO(ev.endDate)

				let tempEvent = Object.assign({}, ev)
				tempEvent.date = ev.startDate

				const continuousDay = !isSameDay(startDate, endDate)
				ev.continuousDay = continuousDay

				this.#dailyEvents.push(tempEvent)

				if (continuousDay) {
					const dateDiff = differenceInDays(endDate, startDate)
					for(let i = 1; i <= dateDiff; i++) {
						tempEvent = Object.assign({}, ev)
						tempEvent.date = format(addDays(startDate, i),'yyyy-MM-dd')
						this.#dailyEvents.push(tempEvent)
					}
				}
			})
	}
}