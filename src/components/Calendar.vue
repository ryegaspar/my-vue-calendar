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
		<div>days</div>
	</div>
</template>

<script>
import {format} from 'date-fns'
export default {
	name: 'HelloWorld',
	props: {
		msg: String
	},
	data() {
		return {
			selectedMonth: Date.now()
		}
	},
	computed: {
		formattedSelectedMonth() {
			return format(this.selectedMonth, "MMMM yyyy")
		}
	}
}
</script>