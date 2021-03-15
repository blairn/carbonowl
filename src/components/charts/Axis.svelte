
<script>
	import { select } from 'd3-selection';
	import { axisBottom, axisLeft } from 'd3-axis';
  import { brushX} from 'd3-brush'
	export let width;
	export let height;
	export let margin;
	export let position;
	export let scale;
  export let brushArea;
	let transform;
	let g;
  let b
	$: {
		select(g).selectAll('*').remove();
		let axis;
		switch(position) {
			case 'bottom':
				axis = axisBottom(scale);
				transform = `translate(0, ${height - margin})`;
				break;
			case 'left':
				axis = axisLeft(scale).tickSizeOuter(0);
				transform = `translate(${margin}, 0)`;
		}
		select(g).call(axis);

    const brushed = (e) => {
      brushArea = e.selection
    }

    const brush = brushX()
      .extent([[margin, 0], [width - margin, height-margin]])
      .on("start brush end", brushed)

    select(b)
      .call(brush)
	}
</script>

<g class='axis' bind:this={g} {transform} />
<g class='brush' bind:this={b} />