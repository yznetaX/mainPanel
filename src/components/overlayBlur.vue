<template>
    <div>
        <v-overlay absolute color="transparent" :value="showBlurOverlay"></v-overlay>
    </div>
</template>
<script>
export default {
    props:{
        showBlurOverlay: {
            type: Boolean
        }
    },
    data() {
        return {
            
        }
    },
}
</script>