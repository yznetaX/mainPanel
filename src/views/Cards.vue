<template id="cards">
    <div class="cards">
        <keep-alive>
            <cards />
        </keep-alive>
    </div>
</template>
<script>
import cards from '../components/cards'
import checkSessionCards from '../mixins/httpHandler'
export default {
    components: {
        cards,
    },
    data() {
        return {
            sessionId: 'session_id',
        }
    },
    methods: {
    },
    mixins: [checkSessionCards]
}
</script>