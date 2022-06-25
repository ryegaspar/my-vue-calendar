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

		events.forEach((ev) => {
			const startDate = parseISO(ev.startDate)
			const endDate = parseISO(ev.endDate)

			let tempEvent = Object.assign({}, ev)
			tempEvent.date = ev.startDate

			if (this.isWithinSelected(tempEvent.date)) {
				eventsArranged.push(tempEvent)
			}

			if (!isSameDay(startDate, endDate)) {
				const dateDiff = differenceInDays(endDate, startDate)
				for (let i = 1; i <= dateDiff; i++) {
					tempEvent = Object.assign({}, ev)
					tempEvent.date = format(addDays(startDate, i), 'yyyy-MM-dd')
					if (this.isWithinSelected(tempEvent.date)) {
						eventsArranged.push(tempEvent)
					}
				}
			}

			// const findOthers = (id, date) => {
			// 	return events.filter(i => {
			// 		return i.id === id && (i.date !== date)
			// 	})
			// }
			//
			// // console.log(findOthers(ev.id, ev.date))
			// ev.isContinous = !!findOthers(ev.id, ev.date).length
		})

		// group by date
		// const groupedEvents = events.reduce((group, ev) => {
		// 	group[ev.date] = [
		// 		...group[ev.date] || [], ev
		// 	]
		// 	return group
		// }, {})
		//
		// // sort events
		// Object.values(groupedEvents)
		// 	  .forEach(date => {
		// 		  date.sort((dateA, dateB) => {
		// 			  return parseFloat((dateA.startTime).replace(':', '.')) - parseFloat((dateB.startTime).replace(':', '.'))
		// 		  })
		// 	  })

		return eventsArranged
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