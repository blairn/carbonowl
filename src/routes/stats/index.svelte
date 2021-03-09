<script>
import {Row, Column} from "carbon-components-svelte";
import MainTable from "../../components/charts/MainTable.svelte";
import Timeline from "../../components/charts/Timeline.svelte";
import Crossfilter from "../../components/query/Crossfilter.svelte";
</script>

  <Crossfilter db='overwatch' collection='processed'>
    <Row>
      <Column noGutter>
        <Timeline/>
      </Column>
    </Row>
    <Row>
      <Column noGutter>
        <MainTable/>
      </Column>
    </Row>
  </Crossfilter>  
