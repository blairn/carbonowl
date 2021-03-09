<script>
  import Filter from '../query/Filter.svelte'
  import { 
    DataTable,
    DataTableSkeleton,
    Tabs,
    Tab,
TabContent
  } from "carbon-components-svelte";

  const cleaner = async (data) => (await data).map(d => ({
    _id:d._id,
    winrate:+d.winrate,
    games:+d.games,
    wins:+d.wins,
    Eliminations:+d.Eliminations,
    'Players Saved':+d['Players Saved'],
    'Time Played':+d['Time Played'],
    games_total:+d.games_total
  }))

  const match1 = [
    {
      "$match": {
        hero_name:{$ne:"NULL"}
      }
    }, {
      "$match": {
        adjusted_played:1
      }
    }, {
      '$group': {
        '_id': '$hero_name', 
        'wins': {
          '$sum': "$adjusted_won"
        }, 
        'games': {
          '$sum': "$adjusted_played"
        },
        'Eliminations': { "$sum": "$Eliminations"},
        'Players Saved': {"$sum": "$Players Saved"},
        'Time Played': {"$sum": "$Time Played"}
      }
    }, {
      '$project': {
        'winrate': {
          '$divide': [
            '$wins', '$games'
          ]
        }, 
        'games': '$games', 
        'wins': '$wins',
        'Eliminations': "$Eliminations",
        'Players Saved': "$Players Saved",
        'Time Played': "$Time Played"
      }
    }, {
      '$sort': {
        'winrate': 1
      }
    }
  ]

  const match2 = [
    {
      "$match": {
        hero_name:{$ne:"NULL"}
      }
    }, {
      "$match": {
        adjusted_played: {$ne:1}
      }
    }, {
      '$group': {
        '_id': '$hero_name', 
        'wins': {
          '$sum': "$adjusted_won"
        }, 
        'games': {
          '$sum': "$adjusted_played"
        },
        'games_total': {
          '$sum': 1
        },
        'Players Saved': {"$sum": "$Players Saved"},
        'Eliminations': { "$sum": "$Eliminations"},
        'Time Played': {"$sum": "$Time Played"}
      }
    }, {
      '$project': {
        'winrate': {
          '$divide': [
            '$wins', '$games'
          ]
        }, 
        'games_total': '$games_total',
        'games': '$games', 
        'wins': '$wins',
        'Eliminations': "$Eliminations",
        'Time Played': "$Time Played",
        'Players Saved': "$Players Saved",
      }
    }, {
      '$sort': {
        'winrate': 1
      }
    }
  ]
  
  const combine = async (datasets) => {
    const data = await datasets
    const results1 = data[0]
    const results2 = data[1]
    console.log("RESULTS", results1, results2)
    const all_ids = [...results1.map(d => d._id), ...results2.map(d => d._id)]
    let results = {}
    for (let d of all_ids) {
      results[d] = {
        full_winrate:0,
        full_games_total:0,
        full_games:0,
        full_wins:0,
        full_eliminations:0,
        full_time_played:0,
        full_players_saved:0,
        partial_winrate:0,
        partial_games_total:0,
        partial_games:0,
        partial_wins:0,
        partial_eliminations:0,
        partial_time_played:0,
        partial_players_saved:0
      }
    }
    for (let d of results1) {
      results[d._id] = {...results[d._id],
        full_winrate:d.winrate,
        full_games:d.games,
        full_wins:d.wins,
        full_eliminations:d.Eliminations,
        full_time_played:d["Time Played"],
        full_players_saved:d["Players Saved"],
      }
    }
    for (let d of results2) {
        results[d._id] = {...results[d._id],
        partial_winrate:d.winrate,
        partial_games_total:d.games_total,
        partial_games:d.games,
        partial_wins:d.wins,
        partial_eliminations:d.Eliminations,
        partial_time_played:d["Time Played"],
        partial_players_saved:d["Players Saved"],
      }
    }
    const all_heroes = results['All Heroes']

    for (let k of Object.keys(results)) {
      const d = results[k]
      results[k] = {
        ...d,
        all_games: d.full_games + d.partial_games,
        all_wins: d.full_wins + d.partial_wins,
        all_eliminations: d.full_eliminations + d.partial_eliminations,
        all_time_played: d.full_time_played + d.partial_time_played,
        all_players_saved: d.full_players_saved + d.partial_players_saved
      }
    }
     console.log(all_heroes)
    for (let k of Object.keys(results)) {
      const d = results[k]
      console.log(d.all_games)
      d.winrate = d.all_wins / d.all_games
      d.full_game_rate = d.full_games / (d.full_games + d.partial_games_total)
      d.partial_game_rate = d.partial_games_total? d.partial_games / d.partial_games_total : 0
      d.id = k
      d.pick_rate = d.all_games / all_heroes.full_games
      d.elim_rate = ((d.all_eliminations / d.all_time_played) * 60 * 10).toFixed(1)
      d.save_rate = ((d.all_players_saved / d.all_time_played) * 60 * 10).toFixed(1)
      d.elims_per_game = (d.all_eliminations / d.all_games).toFixed(1)
      d.saves_per_game = (d.all_players_saved / d.all_games).toFixed(1)
      d.time_per_game = (d.all_time_played / d.all_games).toFixed(1)
      d.damage_rate = (d.all_damage / d.all_time_played).toFixed(1)
    }

    delete results['All Heroes']
    const final_results = Object.values(results)
    console.log(final_results)

    return final_results
  }

  const forDisplay = (data) => {
    data.forEach(d => {
      for (const [key, value] of Object.entries(d)) {
        if (typeof(value) == 'number') {
          d[key] = (value * 100).toFixed(1)  + '%'
        }
      }
    })
    return data
  }

  let selected=0

  let dataTable = [{
    size:"short",
    title:"Pick/Win",
    description:"I know this is what you will argue over, so here it is",
    headers:[
      { key: 'id', value: 'Name' }, 
      { key:'winrate', value:'Winrate' },
      { key:'pick_rate', value:'Pickrate'},
      { key:'elim_rate', value:'Elims per 10 minutes' },
      { key:'save_rate', value:'Saved per 10 minutes' },
      { key:'elims_per_game', value:'Elims per game'},
      { key:'saves_per_game', value:'Saves per game'},
    ]
  },{
    size:"short",
    title:"Full Games Vs Partual Games",
    description:"People switch when they are losing to counter, or when they are being countered, so it should be unsupring that games where a hero is only played for part of a game, they tend to do worse",
    headers:[
      { key: 'id', value: 'name' }, 
      { key:'full_game_rate', value:'% of games they played the whole game' },
      { key:'partial_game_rate', value:'% of the game they played, when playing a partial game'},
      { key:'full_winrate', value:'Win rate for whole games' },
      { key:'partial_winrate', value:'Win rate for part games' },
    ]
  },{
    size:"short",
    title:"Elims Damage Etc",
    description:"Remember you virtually heal all the damage someone would have done when you kill them",
    headers:[
      { key: 'id', value: 'name' },
      { key:'elim_rate', value:'Elims per 10 minutes' },
      { key:'elims_per_game', value:'Elims per game'},
      { key:'full_winrate', value:'Win rate for whole games' },
      { key:'partial_winrate', value:'Win rate for part games' },
    ]
  }

]

</script>

<style>
  :root {
    color:#eeeeee;
  }
</style>
  
  <div>
    <Filter pipeline={match1} let:data={p_results1} process={cleaner}>
    <Filter pipeline={match2} let:data={p_results2} process={cleaner}>
      <Tabs bind:selected>
        <Tab label="Pick/Win" />
        <Tab label="Full games vs Partual Games" />
        <Tab label="Elims, Damage, Etc" />
        <div slot="content">
          <TabContent>
            {#await combine(Promise.all([p_results1,p_results2]))}
              <DataTableSkeleton {...dataTable[0]} rows={30} />
            {:then data}
              <DataTable sortable 
                {...dataTable[0]}
                rows={forDisplay(data)}
              />
            {/await}
          </TabContent>
          <TabContent>
            {#await combine(Promise.all([p_results1,p_results2]))}
              <DataTableSkeleton {...dataTable[1]} rows={30} />
            {:then data}
              <DataTable sortable 
                {...dataTable[1]}
                rows={forDisplay(data)} 
              />
            {/await}
          </TabContent>
          <TabContent>
            {#await combine(Promise.all([p_results1,p_results2]))}
              <DataTableSkeleton {...dataTable[2]} rows={30} />
            {:then data}
              <DataTable sortable 
                {...dataTable[2]}
                rows={forDisplay(data)} 
              />
              {/await}
            </TabContent>
        </div>
      </Tabs>

    </Filter>
    </Filter>

  </div>