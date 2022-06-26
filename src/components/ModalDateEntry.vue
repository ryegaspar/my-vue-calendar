<template>
	<modal :show="isOpen"
		   @close="closeModal"
	>
		<form class="space-y-8 divide-y divide-gray-200"
			  @submit.prevent="submit"
		>
			<div class="space-y-8 divide-y divide-gray-200">
				<div class="pt-2">
					<div>
						<h3 class="text-lg font-medium leading-6 text-gray-900">Event Entry</h3>
					</div>
					<div class="grid grid-cols-1 gap-x-4 gap-y-6 mt-6 sm:grid-cols-6">
						<div class="sm:col-span-3">
							<label for="start-date"
								   class="block text-sm font-medium text-gray-700"
							>
								Start Date
							</label>
							<div class="mt-1">
								<input id="start-date"
									   v-model="form.startDate"
									   type="date"
									   class="block p-1 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm"
									   @change="dateChanged"
								/>
							</div>
						</div>

						<div class="sm:col-span-3">
							<label for="end-date"
								   class="block text-sm font-medium text-gray-700"
							>
								End Date
							</label>
							<div class="mt-1">
								<input id="end-date"
									   v-model="form.endDate"
									   type="date"
									   class="block p-1 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm"
									   @change="dateChanged"
								/>
							</div>
						</div>

						<div class="sm:col-span-6">
							<div class="flex relative items-start">
								<div class="flex items-center h-5">
									<input id="all-day"
										   v-model="form.allDay"
										   type="checkbox"
										   class="w-4 h-4 text-indigo-600 rounded border border-gray-300 focus:ring-indigo-500"
										   :disabled="disableAllDayOption"
									/>
								</div>
								<div class="ml-3 text-sm">
									<label for="all-day"
										   class="font-medium text-gray-700"
									>
										All Day
									</label>
								</div>
							</div>
						</div>

						<div class="sm:col-span-3">
							<label for="start-date"
								   class="block text-sm font-medium text-gray-700"
							>
								Start Time
							</label>
							<div class="mt-1">
								<input id="start-date"
									   v-model="form.startTime"
									   type="time"
									   class="block p-1 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm"
									   :disabled="allDay"
								/>
							</div>
						</div>

						<div class="sm:col-span-3">
							<label for="end-date"
								   class="block text-sm font-medium text-gray-700"
							>
								End Time
							</label>
							<div class="mt-1">
								<input id="end-date"
									   v-model="form.endTime"
									   type="time"
									   class="block p-1 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm"
									   :disabled="allDay"
								/>
							</div>
						</div>

						<div class="sm:col-span-6">
							<label for="event-name"
								   class="block text-sm font-medium text-gray-700"
							> Event Description </label>
							<div class="mt-1">
								<input id="event-name"
									   v-model="form.eventDescription"
									   class="block p-1 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="pt-5">
				<div class="flex justify-end">
					<button type="button"
							class="py-2 px-4 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
							@click.prevent="closeModal"
					>
						Cancel
					</button>
					<button type="submit"
							class="inline-flex justify-center py-2 px-4 ml-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
					>
						Add
					</button>
				</div>
			</div>
		</form>
	</modal>
</template>

<script>
import Modal from '@/components/Modal'

import {
	format
} from 'date-fns'

export default {
	components: { Modal },
	props: {
		isOpen: {
			required: true,
			type: Boolean
		},

		selectedDate: {
			type: Date,
			default: () => new Date(Date.now())
		}
	},

	data() {
		return {
			form: {
				startDate: Date.now(),
				endDate: Date.now(),
				allDay: false,
				startTime: Date.now(),
				endTime: Date.now(),
				eventDescription: ''
			},

			disableAllDayOption: false
		}
	},

	computed: {
		allDay() {
			return this.form.allDay
		}
	},

	watch: {
		allDay(newVal) {
			if (newVal) {
				this.form.startTime = new Date().setUTCHours(0,0,0,0)
				this.form.endTime = new Date().setUTCHours(0,0,0,0)
			}
		},

		isOpen(newVal, oldVal) {
			if (newVal === true) {
				this.form.endDate = this.form.startDate = format(this.selectedDate, 'yyyy-MM-dd')
				this.form.endTime = this.form.startTime = format(Date.now(), 'HH:mm')
			}
		}
	},

	methods: {
		dateChanged() {
			const startDate = new Date(this.form.startDate).getDate()
			const endDate = new Date(this.form.endDate).getDate()

			this.form.allDay = this.disableAllDayOption = startDate !== endDate
		},

		closeModal() {
			this.$emit('close')
		},

		submit() {
			if (this.allDay) {
				this.form.startTime = 0
				this.form.endTime = 0
			}

			this.$emit('submit', this.form)
		}
	},
}
</script>