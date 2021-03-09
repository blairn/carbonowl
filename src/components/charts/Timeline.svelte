<script>
import Filter from '../query/Filter.svelte'
import {queryRunnerFor, db_url} from '../api.mjs'

let brush = {}

$:console.log(brush)

const format = (date) => new Date(date).toLocaleDateString('en-CA')

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

</script>

<style>
  :root {
    color:#eeeeee;
  }
</style>

<div>
  <Filter {pipeline} {queryRunner} bind:brush={brush} useMatches=false let:data>
    {#await data}
      loading
    {:then matches}
      <table>
        <tr><th>year</th><th>stage</th><th>start</th><th>end</th><th>count</th></tr>
        {#each matches as match}
          <tr on:click={() => brush = {start_time:{$gte:new Date(match.start), $lt:new Date(match.end)}}}>
            <td>{match.year}</td>
            <td>{match.stage}</td>
            <td>{format(match.start)}</td>
            <td>{format(match.end)}</td>
            <td>{match.count}</td>
          </tr>
        {/each}
      </table>
    {/await}
  </Filter>
</div>
