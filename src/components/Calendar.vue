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
			<span class="p-2">{{ formattedSelectedMonth }}</span>
		</div>
		<div class="grid grid-cols-7 gap-1">
			<div v-for="(date, index) in calendarDates"
				 :key="index"
				 class="border border-gray-500"
			>
				<button class="w-full text-gray-100 hover:text-gray-200 bg-blue-500 hover:bg-blue-700 border border-b-gray-500"
						@click="showModal(date)"
				>
					{{ date.getDate() }} - {{ format(date, 'E') }}
				</button>
				<div class="overflow-y-scroll p-1.5 h-48">
					Events!
				</div>
			</div>
		</div>

		<modal-date-entry :is-open="isShow"
						  :selected-date="selectedDay"
						  @close="isShow=false"
						  @submit="submitForm"
		/>

	</div>
</template>

<script>
import {
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	parseISO,
	startOfMonth,
	startOfWeek,
	subMonths
} from 'date-fns'
import DateEvent from '@/DateEvent'
import ModalDateEntry from '@/components/ModalDateEntry'

export default {

	components: { ModalDateEntry },

	props: { msg: String },

	data() {
		return {
			selectedMonth: Date.now(),
			selectedDay: null,
			isShow: false,
			events: new DateEvent
		}
	},

	computed: {
		formattedSelectedMonth() {
			return format(this.selectedMonth, 'MMMM yyyy')
		},

		calendarDates() {
			const firstWeekStart = startOfWeek(startOfMonth(this.selectedMonth), { weekStartsOn: 0 })
			const lastWeekStart = endOfWeek(endOfMonth(this.selectedMonth), { weekStartsOn: 0 })
			return eachDayOfInterval({
										 start: firstWeekStart,
										 end: lastWeekStart
									 })
		},
	},

	mounted() {
		this.events.dailyEvents

		console.log(startOfWeek(parseISO('2000-01-01'), { weekStartsOn: 0 }))
	},

	methods: {
		format(date, strFormat) {
			return format(date, strFormat)
		},

		showModal(day) {
			this.selectedDay = day
			this.isShow = true
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

		submitForm(form) {
			this.events.addEvent(form)
			this.isShow = false
		},

		clearStorage() {
			localStorage.clear()
		}
	},
}
</script>