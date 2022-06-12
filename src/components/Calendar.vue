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
	addMonths,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	startOfMonth,
	startOfWeek,
	subMonths
} from 'date-fns'

import modal from '@/components/Modal'

export default {

	components: { modal },

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

	mounted() {},

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
		}
	}
}
</script>