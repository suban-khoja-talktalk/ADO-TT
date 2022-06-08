<script>

    import Button from "../utility/Button.svelte";
    import { fireEvent,EVENTS } from "../EventManager";
    
    export let header;
    export let OnSave;
    export let showSave = true;
    export let showActions = true;
    export let saveLabel = "Save";
    export let _popup_name;

    const fireClosePopupEvent = () => {
        fireEvent(EVENTS.CLOSE_POPUP,_popup_name);
    }
    
    export let OnClose = fireClosePopupEvent;

</script>
<div class="modal-backdrop fixed"></div>
<div class="modal-container fixed flex justify-center align-center bg-transparent">
    <div class="modal">
        <header class="modal-header flex justify-space-between">
            <h3>{header}</h3>
            <svg on:click={OnClose} xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer">
                <line data-v-6b93e4ba="" x1="18" y1="6" x2="6" y2="18"></line>
                <line data-v-6b93e4ba="" x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </header>
        <div class="modal-body">
            <slot/>
        </div>
        {#if showActions}
            <footer class="modal-footer flex flex-end align-center">
                {#if showSave}
                    <Button onClick={OnSave} label={saveLabel} type="primary"/>
                {/if}
            </footer>    
        {/if}
    </div>
</div>

<style>

    .modal-backdrop{
        height: 100vh;
        width: 100vw;
        left: 0;
        top: 0;
        background: #242a38;
        opacity: .75;
        z-index: 3;
    }

    .modal-container{
        height: 100vh;
        width: 100vw;
        left: 0;
        top: 0;
        z-index: 5;
    }

    .modal{
        width: 40vw;
        height: auto;
        background-color: var(--secondary-color);
        z-index: 9;
    }

    .modal-header{
        background-color: var(--quaternary-color);
        padding: 1rem;
        color: var(--text-secondary-color);
    }

    .modal-header > h3{
        font-size: 1.07rem;
        margin: 0;
    }

    .modal-body{
        padding: 1.5rem;
    }

    .modal-footer{
        padding: 1rem;
        border-top:  1px solid rgba(34,41,47,.05);
        background-color: var(--secondary-color);
        border-color: var(--border-secondary-color);
    }

</style>
