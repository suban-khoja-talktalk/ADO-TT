<script>

    export let label;
    export let onClick;
    export let type;

</script>


<button class="pointer text-bold border-box" data-type={type} on:click={onClick}>{label}</button>

<style>
    button{
        border: none;
        outline: none;
        padding: 0.5rem 2rem;
        border-radius: 4px;
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        font-size: 1rem;
    }

    button[data-type="primary"]{
        background-color: var(--btn-primary-color);
        border : 2px solid var(--btn-primary-color);
        color: white;
    }

    button[data-type="secondary"]{
        background-color: var(--btn-secondary-color);
        border : 2px solid var(--btn-secondary-color);
        color: white;
    }

    button[data-type="warning"]{
        background-color: var(--warning-color);
        border : 2px solid var(--warning-color);
        color: white;
    }

    button[data-type="danger"]{
        background-color: var(--danger-color);
        border : 2px solid var(--danger-color);
        color: white;
    }

    button[data-type="success"]{
        background-color: var(--success-color);
        border : 2px solid var(--success-color);
        color: white;
    }

    button[data-type="link primary"]{
        color: var(--btn-primary-color);
        text-decoration: underline;
        font-weight: 600;
        padding: 0;
        background-color: transparent;
    }
    
</style>