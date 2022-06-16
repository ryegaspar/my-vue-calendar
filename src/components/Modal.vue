<template>
	<div v-show="show"
		 class="relative z-10"
		 aria-labelledby="modal-title"
		 role="dialog"
		 aria-modal="true"
	>
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

		<div class="overflow-y-auto fixed inset-0 z-10">
			<div class="flex justify-center items-end p-4 min-h-full text-center sm:items-center sm:p-0"
				 @click.self.prevent="dismiss"
			>
				<div class="overflow-hidden relative px-4 pt-5 pb-4 text-left bg-white rounded-lg shadow-xl transition-all sm:p-6 sm:my-8 sm:w-full sm:max-w-sm">
					<slot></slot>
				</div>
			</div>
		</div>
	</div>

</template>

<script>
export default {

	props: {
		show: {
			required: true,
			type: Boolean
		},

		hasChildModalOpened: {
			default: false,
			type: Boolean
		},

		modalWidth: {
			default: 'sm:w-full',
			type: String
		}
	},

	created() {
		const escapeHandler = e => {
			if (e.key === 'Escape' && this.show && !this.hasChildModalOpened) {
				this.dismiss()
			}
		}
		document.addEventListener('keydown', escapeHandler)
		this.$once('hook:destroyed', () => {
			document.removeEventListener('keydown', escapeHandler)
		})
	},

	methods: {
		dismiss() {
			this.$nextTick(() => {
				if (this.show)
					this.$emit('close')
			})
		}
	}
}
</script>