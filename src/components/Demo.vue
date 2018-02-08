<template>
	<div>
		<div ref="gridContainer" class="grid-container">
			<div class="block" v-for='(item, index) in items' :data-color='item.color' :data-size='item.size'></div> 
		</div>
	</div>
</template>

<script>
	import Grinder from "/lib/grinder";
	export default {
  name: 'demo',
	mounted() {
		this.grinder = new Grinder({
			el: this.$refs.gridContainer
		});
		this.populate();
	},
  data () {
    return {
			items: []
		}
  },
	watch: {
		items() {
			if (this.grinder) {
				this.$nextTick(() => {
					this.grinder.update();
				})
			}
		},
	},
	methods: {
		getColor() {
			const randomInt = (min, max) => {
    		return Math.floor(Math.random() * (max - min + 1)) + min;
  		};
			var h = randomInt(0, 360);
			var s = randomInt(42, 98);
			var l = randomInt(40, 90);
			return `hsl(${h},${s}%,${l}%)`;
		},
		populate(count = 100) {
			const sizes = ['1,2', '2,1', '2,2', '1,2', '3,1'];
			this.items = [];
			for(let i = 0; i < count; i++) {
				this.items.push({
					color: this.getColor(),
					size: sizes[ Math.floor(sizes.length * Math.random()) ]
				})
			}
		}
	}
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.grid-container {
		max-width: 1200px;
		height: 100vh;
		margin: auto;
	}

	.block {
		margin: 2px;
	}
	.block:after {
		content: '(' attr(data-size) ')';
		font-size: 1.6rem;
		top: 50%;
		left: 50%;
		position: absolute;
		transform: translate(-50%, -50%);
	}
</style>