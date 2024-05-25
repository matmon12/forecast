<template>
    <div class="spinner">
        <i-svg-spinners:clock/>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.spinner{
background-color: #404040b0;
position: absolute;
inset: 0;
border-radius: 20px;
display: flex;
align-items: center;
justify-content: center;
svg{
    font-size: 60px;
}
}
</style>