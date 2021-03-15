<script>
  import {
    Grid,
    Row,
    Column,
    Tabs,
    TabContent,
    Tab,
    Select,
    SelectItem,
  } from "carbon-components-svelte";

  import { getContext } from "svelte";

  const { carbon_theme } = getContext("Theme");
</script>

<Row>
  <Column noGutter>
    Hey there, this is RobotWizards server comms test for OWLViewer. 
    If you go to stats and it seems to work, then hey, go us :)<br>
    There is a lot wrong, like losing sort orders on selecting different time ranges<br>
    The tabs around by map being missing, and the hero drops downs also being gone.<br>
    But that is because this is running the simplifilied query system, which we are optimizing<br>
    Once that is completed, I'll merge back in everything else.<br>
    <br>
    Thanks to the Winkyface council, and the overwatch chill discord, and the now defunct overwatch datascience server.<br>
    Big thanks to the overwatch forums, since hey, without you it wouldn't have happened.
    <br>
    <br>
    HUGE thanks to DataVentures in Stats New Zealand. Wouldn't have happened without your support.
  </Column>
</Row>
