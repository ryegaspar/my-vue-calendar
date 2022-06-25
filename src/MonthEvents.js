import {
	addDays,
	differenceInDays,
	endOfMonth,
	endOfWeek, format, isSameDay,
	isWithinInterval, parseISO, startOfMonth, startOfWeek
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

	setSelectedMonth(date) {
		this.#selectedMonth = date
		this.clearEvents()

		return this
	}

	clearEvents() {
		this.#events = []
	}

	addEvent(event) {

	}

	addEvents(events) {
		const eventsArranged = []

		events.forEach(ev => {
			eventsArranged.push(...this.explodeEvent(ev))
		})

		return eventsArranged
	}

	explodeEvent(event) {
		const explodedEvent = []

		const startDate = parseISO(event.startDate)
		const endDate = parseISO(event.endDate)

		let tempEvent = Object.assign({}, event)
		tempEvent.date = event.startDate

		if (this.isWithinSelected(tempEvent.date)) {
			explodedEvent.push(tempEvent)
		}

		if (!isSameDay(startDate, endDate)) {
			const dateDiff = differenceInDays(endDate, startDate)
			for (let i = 1; i <= dateDiff; i++) {
				tempEvent = Object.assign({}, event)
				tempEvent.date = format(addDays(startDate, i), 'yyyy-MM-dd')
				if (this.isWithinSelected(tempEvent.date)) {
					explodedEvent.push(tempEvent)
				}
			}
		}

		return explodedEvent
	}

	isWithinSelected(date) {
		return isWithinInterval(parseISO(date), {
			start: this.startDate,
			end: this.endDate
		})
	}

	/**
	 * TODO:
	 * events added should only be within the scope of the month selected
	 * ability to add/delete events
	 */
}

const monthEvent = MonthEvents.getInstance()

export default monthEvent