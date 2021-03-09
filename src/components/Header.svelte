<script>
  export let segment = undefined;

  import {
    Header,
    HeaderUtilities,
    HeaderGlobalAction,
    HeaderNav,
    HeaderNavItem,
    Toggle
  } from "carbon-components-svelte";
  import { getContext } from "svelte";
  const { carbon_theme } = getContext("Theme");

  let theme = false
  $: $carbon_theme = theme?"g10":"g90"

</script>

<Header company="RobotWizard's" platformName="Owl Viewer" href="/">
  <HeaderNav>
    <HeaderNavItem text="Basic Stats" href='/stats'/>
  </HeaderNav>
  <HeaderUtilities>
    <HeaderGlobalAction>
      <Toggle labelA="Dark" labelB="Light" bind:toggled={theme}/>
    </HeaderGlobalAction>
  </HeaderUtilities>
</Header>
