<template>
	<div class="p-6">
		<div class="flex p-2 -ml-2">
			<div class="flex align-middle">
				<button class="p-2 mr-1 text-white bg-blue-500 hover:bg-blue-700 rounded border border-gray-300"
						@click.prevent="today"
				>
					Today
				</button>
				<div>
					<button class="p-2 mr-1 text-white bg-blue-500 hover:bg-blue-700 rounded border border-gray-300"
							@click.prevent="prevMonth"
					>
						Previous
					</button>
					<button class="p-2 mr-1 text-white bg-blue-500 hover:bg-blue-700 rounded border border-gray-300"
							@click.prevent="nextMonth"
					>
						Next
					</button>
				</div>
				<div>
					<button class="p-2 mr-1 text-white bg-blue-500 hover:bg-blue-700 rounded border border-gray-300"
							@click.prevent="clearStorage"
					>
						Clear Storage
					</button>
				</div>
			</div>
			<span class="p-2">{{ selectedMonthFormatted }}</span>
		</div>
		<div class="grid grid-cols-7 gap-0">
			<div v-for="(date, index) in calendarDates"
				 :key="index"
				 class="border border-gray-600"
			>
				<button
					class="w-full text-gray-100 hover:text-gray-200 bg-blue-500 hover:bg-blue-700 border border-b-gray-500"
					@click="showModal(date)"
				>
					{{ date.getDate() }} - {{ format(date, 'E') }}
				</button>
				<div class="overflow-y-scroll h-48">
					<ul class="whitespace-nowrap">
						<li v-for="(ev, index) in eventFor(date)"
							:key="index"
							class="overflow-x-hidden px-1 text-left text-ellipsis hover:cursor-pointer"
							:class="eventClass(index, ev)"
						>
							<template v-if="ev.allDay">{{ ev.eventDescription }}</template>
							<template v-else>
								{{ ev.startTime }} - {{ ev.eventDescription }}
							</template>
						</li>
					</ul>
				</div>
			</div>
		</div>

		{{ eventsArranged }}

		<modal-date-entry :is-open="isModalShown"
						  :selected-date="modalSelectedDay"
						  @close="isModalShown=false"
						  @submit="submitForm"
		/>

	</div>
</template>

<script>
import {
	addDays,
	addMonths,
	differenceInDays,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isEqual,
	isSameDay,
	isWithinInterval,
	parseISO,
	startOfMonth,
	startOfWeek,
	subMonths
} from 'date-fns'

import ModalDateEntry from '@/components/ModalDateEntry'

import monthEvent from '@/MonthEvents'

import { v4 as uuidv4 } from 'uuid'

export default {

	components: { ModalDateEntry },

	props: {},

	data() {
		return {
			isModalShown: false,
			modalSelectedDay: null,
			selectedMonth: Date.now(),
			eventsFromSelected: [],
			eventsArranged: [],
			eventBgColors: [
				'text-gray-900 bg-amber-500 hover:bg-amber-600',
				'text-gray-200 bg-blue-500 hover:bg-blue-600',
				'text-gray-200 bg-red-500 hover:bg-blue-600',
				'text-gray-900 bg-yellow-500 hover:bg-yellow-600',
				'text-gray-900 bg-green-500 hover:bg-green-600',
				'text-gray-200 bg-indigo-500 hover:bg-indigo-600',
				'text-gray-900 bg-purple-500 hover:bg-purple-600',
				'text-gray-200 bg-pink-500 hover:bg-pink-600',
			]
		}
	},

	computed: {
		selectedMonthFormatted() {
			return format(this.selectedMonth, 'MMMM yyyy')
		},

		selectedStartDate() {
			return startOfWeek(startOfMonth(this.selectedMonth), { weekStartsOn: 0 })
		},

		selectedEndDate() {
			return endOfWeek(endOfMonth(this.selectedMonth), { weekStartsOn: 0 })
		},

		calendarDates() {
			return eachDayOfInterval({
										 start: this.selectedStartDate,
										 end: this.selectedEndDate
									 })
		},
	},

	watch: {
		selectedMonth(newVal, oldVal) {
			this.load()
		}
	},

	mounted() {
		this.load()
	},

	methods: {
		// persistence
		load() {
			this.eventsFromSelected = []

			const storedEventsForMonth = (JSON.parse(localStorage.getItem('CALENDAR.events')) || [])

			if (storedEventsForMonth) {
				storedEventsForMonth.filter(i => this.isWithinSelected(i.startDate) || this.isWithinSelected(i.endDate))

				this.eventsArranged = monthEvent.setSelectedMonth(this.selectedMonth)
					.setEvents(storedEventsForMonth)
					.events
			}
		},

		isWithinSelected(date) {
			return isWithinInterval(parseISO(date), {
				start: this.selectedStartDate,
				end: this.selectedEndDate
			})
		},

		format(date, strFormat) {
			return format(date, strFormat)
		},

		showModal(day) {
			this.modalSelectedDay = day
			this.isModalShown = true
		},

		nextMonth() {
			this.selectedMonth = addMonths(this.selectedMonth, 1)
		},

		prevMonth() {
			this.selectedMonth = subMonths(this.selectedMonth, 1)
		},

		today() {
			this.selectedMonth = Date.now()
		},

		eventFor(date) {
			return this.eventsArranged
					   .filter(event => isEqual(parseISO(event.date), date))
		},

		eventClass(index, event) {
			let evClass = `${this.eventBgColors[index%8]}`

			if (!event.allDay) {
				evClass += ` m-1 rounded-lg`
			}

			return evClass
		},

		submitForm(formData) {
			formData.id = uuidv4()

			const storedEvent = JSON.parse(localStorage.getItem('CALENDAR.events')) || []
			storedEvent.push(formData)
			localStorage.setItem('CALENDAR.events', JSON.stringify(storedEvent))

			this.load()
			// this.eventsArranged = monthEvent.addEvent(formData).events

			this.isModalShown = false
		},

		clearStorage() {
			localStorage.clear()
		}
	}
}
</script>