<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <svg
      :class="{'is-active':isActive}"
      class="hamburger"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
    >
      <path d="M672.757869 550.62896H195.293694c-21.181973 0-38.373139-17.191166-38.373138-38.373139s17.191166-38.373139 38.373138-38.373139h477.464175c21.181973 0 38.373139 17.191166 38.373139 38.373139 0 21.079644-17.191166 38.373139-38.373139 38.373139zM828.706306 289.998601h-633.412612c-21.181973 0-38.373139-17.191166-38.373138-38.373139s17.191166-38.373139 38.373138-38.373139h633.412612c21.181973 0 38.373139 17.191166 38.373138 38.373139s-17.191166 38.373139-38.373138 38.373139zM512 810.747677H195.293694c-21.181973 0-38.373139-17.191166-38.373138-38.373139s17.191166-38.373139 38.373138-38.373139h316.706306c21.181973 0 38.373139 17.191166 38.373139 38.373139 0 21.284301-17.191166 38.373139-38.373139 38.373139z" p-id="5342" fill="#888" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
