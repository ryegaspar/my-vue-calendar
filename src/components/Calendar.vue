<template>
	<div class="p-6">
		<div class="flex p-2">
			<div class="flex align-middle">
				<button class="p-2 mr-1 text-white bg-blue-500 rounded border border-gray-300"
						@click.prevent="today"
				>
					Today
				</button>
				<div>
					<button class="p-2 mr-1 text-white bg-blue-500 rounded border border-gray-300"
							@click.prevent="prevMonth"
					>
						Previous
					</button>
					<button class="p-2 mr-1 text-white bg-blue-500 rounded border border-gray-300"
							@click.prevent="nextMonth"
					>
						Next
					</button>
				</div>
				<div>
					<button class="p-2 mr-1 text-white bg-blue-500 rounded border border-gray-300"
							@click.prevent="clearStorage"
					>
						Clear Storage
					</button>
				</div>
			</div>
			<span class="p-2">{{ formattedSelectedMonth }}</span>
		</div>
		<div v-for="(date, index) in calendarDates"
			 :key="index"
		>
			<button class="p-1 m-2 hover:text-gray-200 hover:bg-purple-500 rounded border border-gray-500"
					@click="showModal(date)"
			>
				add
			</button>
			{{ date.getDate() }} - {{ format(date, 'E') }}
			<div>events</div>
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