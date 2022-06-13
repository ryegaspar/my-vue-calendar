<template>
	<div class="p-6">
		<div>
			<a href="#"
			   @click.prevent="showModal"
			>
				show modal
			</a>
		</div>
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
			</div>
			<span class="p-2">{{ formattedSelectedMonth }}</span>
		</div>
		<div v-for="(date, index) in calendarDates"
			 :key="index"
		>
			{{ date.getDate() }} - {{ format(date, 'E') }}
		</div>

		<modal-date-entry :is-open="isShow"
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
	startOfMonth,
	startOfWeek,
	subMonths
} from 'date-fns'
import ModalDateEntry from '@/components/ModalDateEntry'

export default {

	components: { ModalDateEntry },

	props: { msg: String },

	data() {
		return {
			selectedMonth: Date.now(),
			isShow: false
		}
	},

	computed: {
		formattedSelectedMonth() {
			return format(this.selectedMonth, 'MMMM yyyy')
		},

		calendarDates() {
			const firstWeekStart = startOfWeek(startOfMonth(this.selectedMonth), { weekStartsOn: 1 })
			const lastWeekStart = endOfWeek(endOfMonth(this.selectedMonth), { weekStartsOn: 1 })
			return eachDayOfInterval({
										 start: firstWeekStart,
										 end: lastWeekStart
									 })
		},
	},

	methods: {
		format(date, strFormat) {
			return format(date, strFormat)
		},

		showModal() {
			this.isShow = !this.isShow
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

		submitForm() {
			console.log('submit form')
			this.isShow = false
		},
	}
}
</script>