<template>
  <div >
        <svg-icon class-name="doc-icon" icon-class="helpDoc" @click.stop="click" />
  </div>

</template>

<script>

export default {
  name: 'HelpDoc',
  data() {
    return {

    }
  },
  methods: {
    click() {
      this.$router.push({name: 'helpDoc'});
    },

  }
}
</script>

<style lang="scss" scoped>
.doc-icon {
  cursor: pointer;
  font-size: 20px;
  vertical-align: middle;
}
</style>
