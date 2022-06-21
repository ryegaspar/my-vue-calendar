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
		<div class="grid grid-cols-7 gap-1">
			<div v-for="(date, index) in calendarDates"
				 :key="index"
				 class="border border-gray-500"
			>
				<button
					class="w-full text-gray-100 hover:text-gray-200 bg-blue-500 hover:bg-blue-700 border border-b-gray-500"
					@click="showModal(date)"
				>
					{{ date.getDate() }} - {{ format(date, 'E') }}
				</button>
				<div class="overflow-y-scroll p-1.5 h-48">
					Events!
				</div>
			</div>
		</div>

		<modal-date-entry :is-open="isModalShown"
						  :selected-date="modalSelectedDay"
						  @close="isModalShown=false"
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

import ModalDateEntry from '@/components/ModalDateEntry'

export default {

	components: { ModalDateEntry },

	props: {},

	data() {
		return {
			isModalShown: false,
			modalSelectedDay: null,
			selectedMonth: Date.now(),
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

	methods: {
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

		submitForm(form) {
			// this.events.addEvent(form)
			this.isModalShown = false
		},

		clearStorage() {
			localStorage.clear()
		}
	}
}
</script>