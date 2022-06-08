<script>

    import { fireEvent, EVENTS } from "./EventManager";
    import { TASK_STATUS ,getStatusClass } from "./constants";
    import Input from "./utility/Input.svelte";
    import Icon from "./utility/Icon.svelte";
    
    export let task;
    export let actions = [];
    export let allowSelection = false;

    let isSelected = false;

    const sendOpenTaskDetailEvent = () => {
        fireEvent(EVENTS.OPEN_EDIT_TASK_POPUP,task.task_id);
    }

    const sendDeleteTaskDetailEvent = () => {
        fireEvent(EVENTS.DELETE_TASK,task.task_id);
    }

    const sendViewTaskDetailEvent = () => {
        fireEvent(EVENTS.OPEN_VIEW_TASK_POPUP,task.task_id);
    }

    const onSelect = (evt) => {
        isSelected = evt.target.checked;
        fireEvent(EVENTS.SELECT_TASK,{
            task_id : task.task_id,
            isSelected
        });
    }
    
</script>

<li class="columns flex justify-space-between align-center border-box {isSelected ? 'selected' : ''}">
    
    <span class="column flex justify-center border-box text-bold pointer task_name justify-start align-center">
        {#if allowSelection}
            <div class="custom-checkbox-container {isSelected ? 'show' : ''}">
                <input type="checkbox" class="custom-control-input" id="_{task.task_id}" checked={isSelected} on:change={onSelect}>
                <label class="custom-control-label" for="_{task.task_id}"></label>
            </div>
        {/if}
        
        <Input label="Name" width_class="width-full" type="text" classes="bg-transparent" value={task.task_name} data_field="task_name" readOnly/>
        
        <span class="row-actions">
            {#if actions.includes('EDIT')}
                <Icon type="warning" OnClick={sendOpenTaskDetailEvent}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-75 feather feather-edit-2">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                </Icon>
                &nbsp;&nbsp;
            {/if}
            {#if actions.includes('DELETE')}
                <Icon type="danger" OnClick={sendDeleteTaskDetailEvent}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-75 feather feather-trash">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </Icon>
                &nbsp;&nbsp;
            {/if}
            {#if actions.includes('VIEW')}
                <Icon type="warning" OnClick={sendViewTaskDetailEvent}>
                    <svg data-v-9a6e255c="" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="invoice-row-5036-preview-icon" class="mx-1 feather feather-eye" style="">
                        <path data-v-9a6e255c="" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle data-v-9a6e255c="" cx="12" cy="12" r="3"></circle>
                    </svg>
                </Icon>
                &nbsp;&nbsp;
            {/if}
            
            
        </span>
    </span>
    <span class="column flex justify-center border-box text-bold pointer task_start_date justify-center align-center">
        <Input  label="Start Date" width_class="width-full" type="text" classes="bg-transparent text-center" value={task.task_start_date} data_field="task_start_date" readOnly/>
    </span>
    <span class="column flex justify-center border-box text-bold pointer task_end_date justify-center align-center">
        <Input  label="End Date" width_class="width-full" type="text" classes="bg-transparent text-center" value={task.task_end_date} data_field="task_end_date" readOnly/>
    </span>
    <span class="column flex justify-center border-box text-bold pointer task_status justify-center align-stretch">
        <Input  label="Status" width_class="width-full" type="select" classes={getStatusClass(task.task_status)} value={task.task_status} data_field="task_status" options={TASK_STATUS} readOnly/>
    </span>
            
</li>

<style>

    .columns{
        width: 100%;
        list-style: none;
        background-color: var(--secondary-color);
        margin-bottom: 4px;
        color: var(--secondary-color);
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

    li.columns:hover .custom-checkbox-container{
        display: inherit;
    }

    .custom-checkbox-container.show{
        display: inherit !important;
    }

    .columns.selected{
        background-color: #7367f01f !important;
        border : 2px solid var(--primary-color) !important;
    }

    .custom-checkbox-container{
        position: relative;
        z-index: 1;
        display: none;
        min-height: 1.45rem;
        cursor: pointer;
        margin-right: 1.5rem;
    }

    .custom-control-input{
        width: 1.285rem;
        height: 1.285rem;
        left: 0;
        box-sizing: border-box;
        margin: 0;
        position: absolute;
        z-index: -1;
        opacity: 0;
    }

    .custom-control-label{
        font-size: 1rem;
        position: static;
        color: #d0d2d6;
        margin-bottom: 0;
        vertical-align: top;
    }

    .custom-control-label:before {
        background-color: #283046;
        border-color: #404656;
        left: 0;
        border-radius: 3px;
        width: 18px;
        height: 18px;
        top: 0.07rem;
        border: 1px solid #d8d6de;
        position: absolute;
        display: block;
        pointer-events: none;
        content: "";
    }

    .custom-control-label:after{
        left: 0;
        background-size: 57%;
        width: 18px;
        height: 18px;
        top: 0.07rem;
        background: no-repeat 50%/50% 50%;
        position: absolute;
        display: block;
        content: "";
    }
    
    .custom-control-input:checked~.custom-control-label:before{
        box-shadow: 0 2px 4px 0 rgba(115,103,240,.4)!important;
        border-color: #7367f0 !important;
        background-color: #7367f0 !important;
    }

    .custom-control-input:checked~.custom-control-label:after {
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9.5 7.5'%3E%3Cpolyline points='0.75 4.35 4.18 6.75 8.75 0.75' style='fill:none;stroke:%23fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.5px'/%3E%3C/svg%3E");
    }

</style>