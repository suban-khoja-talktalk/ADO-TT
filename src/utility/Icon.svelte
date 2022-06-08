<script>
    export let type;
    export let selected = true;
    export let OnClick
</script>

<span class="icon flex justify-center align-center pointer {selected ? type  :''}" on:click={OnClick}>
    <slot />
</span>

<style>

    .icon{
        padding: .3rem;
        color: white;
        border-radius: 4px;
    }

    .primary{
        background-color: var(--btn-primary-color);
    }

    .danger{
        background-color: var(--danger-color);
    }
    
    .warning{
        background-color: var(--warning-color);
    }

    .shaded-white{
        padding: 0.7rem;
        background-color: #f8f8f830;
    }

</style>

