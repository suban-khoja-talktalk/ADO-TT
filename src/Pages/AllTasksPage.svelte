<script>
    import { onDestroy, onMount } from "svelte";
    import { TASK_COLUMN } from "../constants";
    import Input from "../utility/Input.svelte";
    import Button from "../utility/Button.svelte";
    import Popup from "../utility/Popup.svelte";
    import Icon from "../utility/Icon.svelte";
    import Task from "../Task.svelte";
    import {registerListener , unregisterListener, EVENTS} from '../EventManager';
    import { getStatusClass, TASK_STATUS} from "../constants";

    export let tasks = [];
    let filtered_tasks = [];
    let hasFilterApplied = false;
    let showFilter = false;
    let task_filter = {
        status : ""
    }
    const POPUP = {
        VIEW_TASK : false
    }

    const processClosePopup = (_popup) => {
        POPUP[_popup] = false;   
    }

    let selected_task;

    const processOpenTaskPopup = (task_id) => {
        selected_task = tasks.filter(task => task.task_id === task_id)[0];
        POPUP.VIEW_TASK = true;
    }

    const applyFilter = () => {
        if(task_filter.status){
            hasFilterApplied = true;
            filtered_tasks = tasks.filter(task => task.task_status === task_filter.status);
            filtered_tasks = filtered_tasks;
        }
    }

    const handleFilterChange = (e) => {
        task_filter[e.target.dataset.field] = e.target.value;
    }

    const clearFilter = () => {
        filtered_tasks = tasks;
        filtered_tasks = filtered_tasks;
        hasFilterApplied = false;
        task_filter.status = "";
    }

    const toggleFilter = () => {
        showFilter = !showFilter;
    }
    
    onMount( () => {
        registerListener(EVENTS.OPEN_VIEW_TASK_POPUP,processOpenTaskPopup);
        registerListener(EVENTS.CLOSE_POPUP,processClosePopup);
        filtered_tasks = tasks;
    });

    onDestroy (()=> {
        unregisterListener(EVENTS.OPEN_VIEW_TASK_POPUP,processOpenTaskPopup);
        unregisterListener(EVENTS.CLOSE_POPUP,processClosePopup);
    })

</script>

<div class="app-container flex align-center flex-column">
    {#if tasks && tasks.length}
        <div class="filter-container relative {showFilter ? 'show-filter-class' : 'hide-filter-class'}">
            <div class="filter-toggle flex justify-end">
                {#if !showFilter}
                    <Icon type="primary" OnClick={toggleFilter}>
                        <svg xmlns='http://www.w3.org/2000/svg' fill="currentcolor" viewBox='0 0 24 24' width='24' height='24'>
                            <path d="M21 3H5a1 1 0 0 0-1 1v2.59c0 .523.213 1.037.583 1.407L10 13.414V21a1.001 1.001 0 0 0 1.447.895l4-2c.339-.17.553-.516.553-.895v-5.586l5.417-5.417c.37-.37.583-.884.583-1.407V4a1 1 0 0 0-1-1zm-6.707 9.293A.996.996 0 0 0 14 13v5.382l-2 1V13a.996.996 0 0 0-.293-.707L6 6.59V5h14.001l.002 1.583-5.71 5.71z"></path>
                        </svg>
                    </Icon>
                    {:else}
                    <Icon type="primary" OnClick={toggleFilter}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer">
                            <line data-v-6b93e4ba="" x1="18" y1="6" x2="6" y2="18"></line>
                            <line data-v-6b93e4ba="" x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </Icon>
                {/if}
            </div>
            {#if showFilter}
                <div class="flex form-header">
                    <div class="form-title">Filters</div>
                </div>
                <div class="flex form-row">
                    <div class="flex flex-column form-column grow">
                        <Input data_type="field" label="Status" width_class="width-hald" type="select" classes={getStatusClass(task_filter.status)} value={task_filter.status} onChange={handleFilterChange} data_field="status" options={TASK_STATUS}/>
                    </div>
                    
                    <div class="flex form-column align-end justify-start">
                        <Button onClick={applyFilter} label="Apply" type="primary"/>
                        {#if hasFilterApplied}
                        &nbsp;&nbsp;
                        <Button onClick={clearFilter} label="Clear" type="danger"/>
                        {/if}
                    </div>
                </div>
            {/if}
        </div>
    {/if}
    

    <div class="task-header flex align-center justify-space-between">
        <div class="flex align-center">
            <svg data-v-1134b199="" xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <polyline data-v-1134b199="" points="9 11 12 14 22 4"></polyline>
                <path data-v-1134b199="" d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            <span class="task-title"> Tasks </span>
        </div>
    </div>

    {#if filtered_tasks && filtered_tasks.length}
        <div class="task-container flex justify-start align-center grow flex-column">
            <li class="columns flex justify-end align-center text-white text-bold">
                <div class="flex justify-center aggregator-container">
                    <span class="flex align-center justify-center badge grow badge-not-started">{filtered_tasks.filter(task => task.task_status === "Not Started").length}</span>
                    <span class="flex align-center justify-center badge grow badge-in-progress">{filtered_tasks.filter(task => task.task_status === "In Progress").length}</span>
                    <span class="flex align-center justify-center badge grow badge-completed">{filtered_tasks.filter(task => task.task_status === "Completed").length}</span>
                </div>
            </li>
            <li class="columns flex justify-space-between align-center text-white text-bold">
                {#each TASK_COLUMN as column}
                    {#if column.show_in_list}
                        <span class="column flex justify-center grow border-box text-bold {column.key}">{ column.show_header ? column.label : ''}</span>    
                    {/if}
                {/each}
            </li>
            {#each filtered_tasks as task}
                <Task {task} actions={['VIEW']}/>    
            {/each}
        </div>
        {:else}
        <div role="alert" aria-live="polite" aria-atomic="true" class="alert alert-primary" data-v-aa799a9e="">
            <div class="alert-body box-border">
                <span>No Tasks.</span>
            </div>
        </div>
    {/if}
</div>

{#if POPUP.VIEW_TASK}
    <Popup header="New Task" _popup_name="VIEW_TASK" showActions={false}>
        <div class="flex flex-column justify-center">

            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Name" hasLabel width_class="width-full" type="text" classes="bg-transparent" value={selected_task.task_name} data_field="task_name" readOnly/>
                </div>
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Status" hasLabel width_class="width-full" type="select" classes={getStatusClass(selected_task.task_status)} value={selected_task.task_status} data_field="task_status" options={TASK_STATUS} readOnly/>
                </div>
                
            </div>
            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Start Date" hasLabel width_class="width-full" type="date" classes="bg-transparent" value={selected_task.task_start_date} data_field="task_start_date" readOnly/>
                </div>
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="End Date" hasLabel width_class="width-full" type="date" classes="bg-transparent" value={selected_task.task_end_date} data_field="task_end_date" readOnly/>
                </div>
                
            </div>
            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Description" hasLabel width_class="width-full" type="text-long" classes="bg-transparent" value={selected_task.task_description} data_field="task_description" readOnly/>
                </div>
                
            </div>
            
        </div>
    </Popup>
{/if}

<style>

    .app-container{
        margin:0;
        padding: 0;
        height: 100vh;
        width: 95vw;
        margin-left: 5vw;
    }

    .task-header , .task-container{
        width : 80%
    }

    .task-header{
        border-bottom: 1px solid var(--border-tertiary-color);
        margin: 5vh 0 5px 0;
        padding: 8px 0;
        color : var(--primary-color);
    }

    .task-title{
        font-size: 1.5rem;
        color: var(--primary-color);
    }

    .columns{
        width: 100%;
        list-style: none;
    }

    .form-row{
        padding: 1rem 0;
    }

    .form-column{
        padding: 0 1rem;
        width: 50%;
    }

    .column{
        padding: 0.5rem;
    }

    .task_name{
        width: 55%;
    }

    .task_start_date,.task_end_date{
        width: 15%;
    }

    .task_status{
        width: 15%;
    }

    .column:first-of-type{
        border-left: 0;
    }

    .column:last-of-type{
        border-right: 0;
    }

    .action-container{
        width: 10%;
    }
    
    .task-note{
        width: 100%;
    }

    .icon{
        color: var(--primary-color);
        font-weight: 400;
    }

    .task-header .icon{
        margin-right : 5px;
    }

    .alert{
        background-color: rgba(115,103,240,.12);
        border: none;
        padding: 0;
        border-radius: 0.3rem;
        color : var(--primary-color);
        width: 80%;
    }

    .alert-body{
        padding: .71rem 1rem;
    }

    .bullet{
        width: .714rem;
        height: .714rem;
        border-radius: 50%;
    }

    .filter-container{
        width : 80%
    }

    .filter-container{
        box-shadow: 0 4px 24px 0 rgb(34 41 47 / 24%);
        border-radius: 5px;
    }

    .form-title{
        font-size: 1.25rem;
        color: var(--primary-color);
    }

    .form-header{
        padding: 1rem 1rem 0 1rem;
    }

    .filter-toggle{
        padding : .5rem;
        right : 0;
    }

    .show-filter-class{
        background-color: #7367f01f;
        margin-top: 5vh;
    }

    .hide-filter-class{
        margin-bottom: 0vh;
    }

    .aggregator-container{
        width: 15%;
    }

    .aggregator-container{
        height: 40px;
    }

</style>