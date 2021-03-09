<script>
  import { getContext } from "svelte"
	import { onMount, onDestroy, tick } from 'svelte';
  onMount(async () => {await tick(); debounceStore.start() })

  import { createDebounceStore } from './debounceStore.mjs'

  export let queryRunner
  export let matchStore = getContext("matchStore")
  export let id
  export let pipeline
  export let brush = {}
  export let data = new Promise(() => {})
  export let process = (d) => d
  export let useMatches = true
  
  if (!queryRunner) {
    queryRunner = getContext("queryRunner")
  }

  const debounceStore = createDebounceStore(new Promise(() => {}), queryRunner)
  $: other_matches = Object.keys($matchStore).filter(k => k != id).map(id => ({$match:$matchStore[id]}))
  $: if (useMatches) { debounceStore.queue([...other_matches, ...pipeline]) } else { debounceStore.queue([...pipeline]) }
  $: data = process($debounceStore)
  $: matchStore.update(matches => {matches[id] = brush; return matches})

  onDestroy(() => matchStore.update(matches => delete matches[id]))
</script>

<slot {data}></slot>