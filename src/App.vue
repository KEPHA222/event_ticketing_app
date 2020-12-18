<template>
  <v-app>
    <v-content>
      <Event />
    </v-content>
  </v-app>
</template>

<script>
import Event from './components/Event';

export default {
  name: 'App',

  components: {
    Event,
  },

  data: () => ({
    //
  }),
};
</script>
