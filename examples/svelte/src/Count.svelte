<script>
  import { initialCount } from './lib'
  import ShowCount from './lib/ShowCount.svelte'

  export let count = initialCount

  function increment() {
    count++
  }

  function decrement() {
    count--
  }
</script>

<button id="decr" on:click={decrement}>--</button>
<ShowCount {count} />
<button id="incr" on:click={increment}>++</button>
