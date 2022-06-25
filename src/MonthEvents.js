import {
	addDays,
	differenceInDays,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isWithinInterval,
	parseISO,
	startOfMonth,
	startOfWeek
} from 'date-fns'

class MonthEvents {
	#events = []

	#selectedMonth

	constructor() {
		this.#selectedMonth = Date.now()
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new MonthEvents()
		}

		return this.instance
	}

	get events() {
		return this.#events
	}

	get startDate() {
		return startOfWeek(startOfMonth(this.#selectedMonth), { weekStartsOn: 0 })
	}

	get endDate() {
		return endOfWeek(endOfMonth(this.#selectedMonth), { weekStartsOn: 0 })
	}

	get uniqueDays() {
		return Array.from(new Set(this.#events.map(i => i.date)))
	}

	setSelectedMonth(date) {
		this.#selectedMonth = date
		this.clearEvents()

		return this
	}

	clearEvents() {
		this.#events = []
	}

	setEvents(eventParam) {
		this.clearEvents()

		eventParam.forEach(ev => {
			this.#events.push(...this.expandEvent(ev))
		})

		this.markMultiple()

		return this
	}

	expandEvent(event) {
		const expandedEvent = []

		const startDate = parseISO(event.startDate)
		const endDate = parseISO(event.endDate)

		const tempEvent = Object.assign({}, event)
		tempEvent.date = event.startDate

		if (this.isWithinSelected(tempEvent.date)) {
			expandedEvent.push(tempEvent)
		}

		if (!isSameDay(startDate, endDate)) {
			const dateDiff = differenceInDays(endDate, startDate)
			for (let i = 1; i <= dateDiff; i++) {
				const subsequentEvent = Object.assign({}, event)
				subsequentEvent.date = format(addDays(startDate, i), 'yyyy-MM-dd')
				if (this.isWithinSelected(subsequentEvent.date)) {
					expandedEvent.push(subsequentEvent)
				}
			}
		}

		return expandedEvent
	}

	markMultiple() {
		this.#events
			.filter(i => !i.hasOwnProperty('multiple'))
			.forEach(ev => {
				const findOthers = (id, date) => {
					return this.#events.filter(i => {
						return i.id === id && (i.date !== date)
					})
				}

				ev.multiple = !!findOthers(ev.id, ev.date).length
			})
	}

	isWithinSelected(date) {
		return isWithinInterval(parseISO(date), {
			start: this.startDate,
			end: this.endDate
		})
	}
}

const monthEvent = MonthEvents.getInstance()

export default monthEvent