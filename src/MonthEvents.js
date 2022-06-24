export default class MonthEvents {
	#events

	#groupedEvents

	constructor(events) {
		this.#events = events
		this.prepare()
	}

	get events() {
		return this.#groupedEvents
	}

	prepare() {
		// add continuous flag and order to each event
		this.#events.forEach((ev) => {
			const findOthers = (id, date) => {
				return this.#events.filter(i => {
					return i.id === id && (i.date !== date)
				})
			}

			ev.isContinous = !!findOthers(ev.id, ev.date).length
			ev.order = null
		})

		// group by date
		this.#groupedEvents = this.#events.reduce((group, ev) => {
			const { date } = ev
			group[date] = group[date] ?? []
			group[date].push(ev)
			return group
		}, {})

		// sort events
		Object.values(this.#groupedEvents).forEach(date => {
			date.sort((dateA, dateB) => {
				return parseFloat((dateA.startTime).replace(':', '.')) - parseFloat((dateB.startTime).replace(':', '.'))
			})
		})
	}
}