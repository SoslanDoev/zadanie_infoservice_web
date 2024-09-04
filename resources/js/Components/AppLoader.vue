<template>
    <div class="app__loader">
    </div>
</template>

<style>
    .app__loader {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        background-color: var(--clr-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 500;
    }
    .app__loader::before {
        content: "";
        width: 100px;
        height: 100px;
        border: 5px solid var(--clr-text);
        border-radius: 50%;
        border-left-color: transparent;
        animation: anim_border 2s linear infinite;
    }
    @keyframes anim_border {
        0% { transform: rotate(0); }
        100% { transform: rotate(360deg); }
    }
</style>