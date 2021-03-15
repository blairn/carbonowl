<script>
import Filter from '../query/Filter.svelte'
import {queryRunnerFor, db_url} from '../api.mjs'
import * as d3 from 'd3'
import Axis from './Axis.svelte'
let brush = {}

const queryRunner = queryRunnerFor(db_url("overwatch","maps"))

const pipeline = [
  {"$match":{"round_start_time":{"$gt":new Date(2000,1,1)}}},
  {
    '$group': {
      '_id': {stage:'$stage', "year":{"$year":"$round_start_time"}}, 
      "year":{'$first':{"$year":"$round_start_time"}},
      'stage': {
        '$first': '$stage'
      },
      'start': {
        '$min': '$round_start_time'
      },
      'end': {
        '$max': '$round_start_time'
      },
      'count': {
        '$sum':1
      }
    }
  }, {
    '$sort': {
      'start': 1
    }
  }
]

const margin = 40;
let min, max, width, height, svg, scaleTime, brushArea

const process = async (d) => {
  const data = await d;
  const ext = d3.extent(data.flatMap(x => [x.start,x.end]))
  min = ext[0]
  max = ext[1]
  scaleTime = d3.scaleTime().domain([min,max]).range([margin, width - margin])
  return data
}

$: if (brushArea) {
  brush={
    start_time:{$gte:scaleTime.invert(brushArea[0]), $lte:scaleTime.invert(brushArea[1])}
  }
}
</script>

<style>
  :root {
    color:#eeeeee;
  }
</style>
<div width="100%" bind:clientWidth={width} bind:clientHeight={height}>
<svg width="100%" height="100" bind:this={svg}>
  <Filter {pipeline} {queryRunner} bind:brush={brush} useMatches=false let:data>
    {#await process(data)}
      loading
    {:then matches}
      {#each matches as match}
        <rect x={scaleTime(match.start)} width={scaleTime(match.end) - scaleTime(match.start)} height={height-margin} y=0 style="fill:steelblue">
          <title>{match.year} - {match.stage}</title>
        </rect>
      {/each}
      <Axis {width} {height} {margin} scale={scaleTime} bind:brushArea position='bottom'/>
    {/await}
  </Filter>
</svg>
</div>