<template>
	<div>
		<div>
			<div>
				<a href="#"
				   @click.prevent="showModal"
				>
					show modal
				</a>
			</div>
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

		<modal :show="isShow"
			   @close="isShow = false"
		>
			<div>
				<div class="flex justify-center items-center mx-auto w-12 h-12 bg-green-100 rounded-full">
					<!-- Heroicon name: outline/check -->
					<svg class="w-6 h-6 text-green-600"
						 xmlns="http://www.w3.org/2000/svg"
						 fill="none"
						 viewBox="0 0 24 24"
						 stroke-width="2"
						 stroke="currentColor"
						 aria-hidden="true"
					>
						<path stroke-linecap="round"
							  stroke-linejoin="round"
							  d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<div class="mt-3 text-center sm:mt-5">
					<h3 id="modal-title"
						class="text-lg font-medium leading-6 text-gray-900"
					>
						Payment successful
					</h3>
					<div class="mt-2">
						<p class="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing
							elit. Consequatur amet labore.</p>
					</div>
				</div>
			</div>
			<div class="mt-5 sm:mt-6">
				<button type="button"
						class="inline-flex justify-center py-2 px-4 w-full text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm sm:text-sm"
				>
					Go back to dashboard
				</button>
			</div>

			<div>
				<input type="text"
					  name="some_input"
				/>
			</div>
		</modal>
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

import modal from '@/components/Modal'

export default {

	components: { modal },

	props: { msg: String },

	data() {
		return {
			selectedMonth: Date.now(),
			calendarDates: null,
			isShow: false
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
		},

		showModal() {
			this.isShow = !this.isShow
		}
	}
}
</script>