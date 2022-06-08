<script>

    import { fireEvent, EVENTS } from "./EventManager";
    import { COMPONENT_TYPE_LIST , COMPONENT_COLUMN ,getComponentTypeClass } from "./constants";
    import Input from "./utility/Input.svelte";
    import Icon from "./utility/Icon.svelte";
    export let component;
    export let actions = [];

    const sendOpenComponentDetailEvent = () => {
        fireEvent(EVENTS.OPEN_EDIT_COMPONENT_POPUP,component.component_id);
    }

    const sendDeleteComponentDetailEvent = () => {
        fireEvent(EVENTS.DELETE_COMPONENET,component.component_id);
    }
    
    const sendViewComponentDetailEvent = () => {
        fireEvent(EVENTS.OPEN_VIEW_COMPONENT_POPUP,component.component_id);
    }

</script>

<li class="columns flex justify-space-between align-center border-box">

    <span class="column flex grow justify-center border-box text-bold pointer component_name justify-start align-center">
        <Input label="Name"  width_class="width-full" type="text" classes="bg-transparent" value={component.component_name} data_field="component_name" readOnly/>
        <span class="row-actions">
            {#if actions.includes('EDIT')}
                <Icon type="warning" OnClick={sendOpenComponentDetailEvent}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-75 feather feather-edit-2">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                </Icon>
                &nbsp;&nbsp;
            {/if}
            {#if actions.includes('DELETE')}
                <Icon type="danger" OnClick={sendDeleteComponentDetailEvent}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-75 feather feather-trash">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </Icon>
            {/if}
            {#if actions.includes('VIEW')}
                <Icon type="warning" OnClick={sendViewComponentDetailEvent}>
                    <svg data-v-9a6e255c="" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="invoice-row-5036-preview-icon" class="mx-1 feather feather-eye" style="">
                        <path data-v-9a6e255c="" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle data-v-9a6e255c="" cx="12" cy="12" r="3"></circle>
                    </svg>
                </Icon>
                &nbsp;&nbsp;
            {/if}
            
        </span>

    </span>
    <span class="column flex grow justify-center border-box text-bold pointer component_version  justify-center align-center">
        <Input label="Version" width_class="width-full" type="text" classes="bg-transparent text-center" value={component.component_version} data_field="component_version" readOnly/>
    </span>
    <span class="column flex grow justify-center border-box text-bold pointer component_date  justify-center align-center">
        <Input label="Version" width_class="width-full" type="text" classes="bg-transparent text-center" value={component.component_date} data_field="component_version" readOnly/>
    </span>
    <span class="column flex grow justify-center border-box text-bold pointer component_parent_name  justify-center align-center">
        <Input label="Parent Component (if any)" width_class="width-full" type="text" classes="bg-transparent text-center" value={component.component_parent_name} data_field="component_parent_name" readOnly/>
    </span>
    <span class="column flex grow justify-center border-box text-bold pointer component_type justify-center align-stretch">
        <Input label="Type" width_class="width-full" type="select" classes="bg-transparent text-center Component-Type {getComponentTypeClass(component.component_type)}" value={component.component_type} data_field="component_type" options={COMPONENT_TYPE_LIST} readOnly/>
    </span>
         
</li>

<style>

    .columns{
        width: 100%;
        list-style: none;
        background-color: var(--secondary-color);
        margin-bottom: 4px;
        color: var(--text-secondary-color);
        padding-left: 1rem;
        box-shadow: 0 4px 24px 0 rgb(34 41 47 / 24%);
        border-radius: 4px;
    }

    .column{
        height: 40px;
    }

    .row-actions{
        padding: 0 1rem;
        display: none;
    }

    li.columns:hover .row-actions{
        display: inherit;
    }


</style>