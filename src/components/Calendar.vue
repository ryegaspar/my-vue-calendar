<template>
	<div>
		<div>
			<button>Today</button>
			<div>
				<button>Previous</button>
				<button>Next</button>
			</div>
			<span>{{ formattedSelectedMonth }}</span>
		</div>
		<div v-for="(date, index) in calendarDates"
			 :key="index"
		>
			{{ date.getDate() }} - {{ format(date, 'E') }}
		</div>
	</div>
</template>

<script>
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	startOfMonth,
	startOfWeek
} from 'date-fns'

export default {
	props: { msg: String },
	
	data() {
		return {
			selectedMonth: Date.now(),
			calendarDates: null
		}
	},

	computed: {
		formattedSelectedMonth() {
			return format(this.selectedMonth, 'MMMM yyyy')
		},
	},

	mounted() {
		this.calendarDates = this.getCalendarDates(this.selectedMonth)
	},

	methods: {
		getCalendarDates(date) {
			const firstWeekStart = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
			const lastWeekStart = endOfWeek(endOfMonth(date), { weekStartsOn: 1 })
			return eachDayOfInterval({
				start: firstWeekStart,
				end: lastWeekStart 
			})
		},

		format(date, strFormat) {
			return format(date, strFormat)
		}
	}
}
</script>