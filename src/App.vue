<template>
	<div id="app"
		 class="overflow-auto"
	>
		<my-calendar/>
	</div>
</template>

<script>
import MyCalendar from './components/Calendar.vue'

export default {
	name: 'App',
	components: { MyCalendar }
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
