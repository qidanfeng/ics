<template>
    <div>
      <iframe id="docFrame" name="docFrame" title="helpDoc" ref="printPop" width="100%" height="100%" frameborder=no
              border=0  marginwidth=0  marginheight=0
              :style="{width:width,height:height}" />
    </div>
</template>

<script>
  export default {
    name: 'helpDoc',
    data() {
      return {
        width: '100%',
        height: '800px',
      }
    },
    activated() {
      document.getElementById('docFrame').contentWindow.location.reload(true);
      window.open('https://web.gfscold.com/doc/ics/#/','docFrame')
      window.open('','docFrame')
      this.height=(document.documentElement.clientHeight - this.navBarHeight - 10)+'px';
    },
    mounted() {
      let that =this;

      window.onresize = function() {
        that.$set(that,"height",(document.documentElement.clientHeight- that.navBarHeight - 10)+'px');
      }
    },
    methods:{


    }
  }


</script>

<style>

</style>
