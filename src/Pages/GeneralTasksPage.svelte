<script>
    import { onDestroy, onMount } from "svelte";
    import { TASK_COLUMN } from "../constants";
    import { AUTH } from "../firebase";
    import Input from "../utility/Input.svelte";
    import Popup from "../utility/Popup.svelte";
    import Button from "../utility/Button.svelte";
    import Icon from "../utility/Icon.svelte";
    import Task from "../Task.svelte";
    import {registerListener , unregisterListener,fireEvent , EVENTS} from '../EventManager';
    import { getStatusClass, TASK_STATUS , DEFAULTS} from "../constants";
    import {getUserGeneralTasksCallout,createGeneralTaskCallout,updateGeneralTaskCallout,deleteGeneralTaskCallout,deleteGeneralBulkTaskCallout} from "../api";

    export let tasks = [];
    let filtered_tasks;
    const POPUP = {
        NEW_TASK : false,
        EDIT_TASK : false
    }

    let selected_tasks = [];

    const processClosePopup = (_popup) => {
        POPUP[_popup] = false;   
    }

    const openNewTaskPopup = () => {
        task_fields = {
            task_name : true,
            task_start_date : true,
            task_end_date : true
        }
        POPUP.NEW_TASK = true;
    }

    let selected_task;
    let backup_selected_task;
    let hasFilterApplied = false;
    let showFilter = false;
    
    let new_task = {
        task_name : "",
        task_start_date : "",
        task_end_date : "",
        task_status : DEFAULTS.TASK_STATUS,
        task_description : ""
    };

    let task_fields = {
        task_name : true,
        task_start_date : true,
        task_end_date : true
    }
    
    let task_filter = {
        status : ""
    }

    const handleNewTaskChange = (e) => {
        new_task[e.target.dataset.field] = e.target.value;
    }

    const handleExistingTaskChange = (e) => {
        selected_task[e.target.dataset.field] = e.target.value;
    }

    const processEditTaskPopup = (task_id) => {
        for(let i=0;i<tasks.length;i++){
            if(tasks[i].task_id === task_id){
                selected_task = JSON.parse(JSON.stringify(tasks[i]));
                backup_selected_task = JSON.parse(JSON.stringify(tasks[i]));
            }
        }
        task_fields = {
            task_name : true,
            task_start_date : true,
            task_end_date : true
        }
        POPUP.EDIT_TASK = true;
    }

    const saveNewTask = () => {

        if(!new_task.task_name){
            task_fields.task_name = false;
            return;
        }else{
            task_fields.task_name = true;
        }

        if(new_task.task_status === "Completed"){
            if(!new_task.task_start_date){
                task_fields.task_start_date = false;
                return;
            }else{
                task_fields.task_start_date = true;
            }
            if(!new_task.task_end_date){
                task_fields.task_end_date = false;
                return;
            }else{
                task_fields.task_end_date = true;
            }
        }

        if(new_task.task_status === "In Progress"){
            if(!new_task.task_start_date){
                task_fields.task_start_date = false;
                return;
            }else{
                task_fields.task_start_date = true;
            }
        }

        if(new_task.task_start_date && new_task.task_end_date){
            let start_date = new Date(new_task.task_start_date);
            let end_date = new Date(new_task.task_end_date);
            if(end_date - start_date < 0){
                task_fields.task_end_date = false;
                task_fields.task_start_date = false;
                return;
            }else{
                task_fields.task_end_date = true;
                task_fields.task_start_date = true;
            }
        }

        fireEvent(EVENTS.SHOW_SPINNER,{});
        createGeneralTaskCallout(
            AUTH.currentUser.uid,
            new_task.task_name,
            JSON.stringify({
                description : new_task.task_description,
                status : new_task.task_status,
                start_date : new_task.task_start_date,
                end_date : new_task.task_end_date
            })
        )
        .then(res => {
            tasks.push({
                task_id:res.task_id,
                task_name : res.task_name,
                task_start_date : res.task_start_date,
                task_end_date : res.task_end_date,
                task_description : res.task_description,
                task_status : res.task_status
            });
            tasks = tasks;
            filtered_tasks = tasks;
            filtered_tasks = filtered_tasks;
            new_task = {
                task_name : "",
                task_start_date : "",
                task_end_date : "",
                task_status : DEFAULTS.TASK_STATUS,
                task_description : ""
            };
            
            fireEvent(EVENTS.HIDE_SPINNER,{});
            fireEvent(EVENTS.CLOSE_POPUP,'NEW_TASK');
        })
        .catch(err => {
            fireEvent(EVENTS.HIDE_SPINNER,{});
        });
    }

    const updateTask = () => {
        if(!selected_task.task_name){
            task_fields.task_name = false;
            return;
        }else{
            task_fields.task_name = true;
        }

        if(selected_task.task_status === "Completed"){
            if(!selected_task.task_start_date){
                task_fields.task_start_date = false;
                return;
            }else{
                task_fields.task_start_date = true;
            }
            if(!selected_task.task_end_date){
                task_fields.task_end_date = false;
                return;
            }else{
                task_fields.task_end_date = true;
            }
        }

        if(selected_task.task_status === "In Progress"){
            if(!selected_task.task_start_date){
                task_fields.task_start_date = false;
                return;
            }else{
                task_fields.task_start_date = true;
            }
        }

        if(selected_task.task_start_date && selected_task.task_end_date){
            let start_date = new Date(selected_task.task_start_date);
            let end_date = new Date(selected_task.task_end_date);
            if(end_date - start_date < 0){
                task_fields.task_end_date = false;
                task_fields.task_start_date = false;
                return;
            }else{
                task_fields.task_end_date = true;
                task_fields.task_start_date = true;
            }
        }
        fireEvent(EVENTS.SHOW_SPINNER,{});
        updateGeneralTaskCallout(
            AUTH.currentUser.uid,
            selected_task.task_id,
            selected_task.task_name,
            JSON.stringify({
                description : selected_task.task_description,
                status : selected_task.task_status,
                start_date : selected_task.task_start_date,
                end_date : selected_task.task_end_date
            })
        )
        .then(res => {
            selected_task = selected_task;
            backup_selected_task = JSON.parse(JSON.stringify(selected_task));

            const selected_task_index = tasks.findIndex(task => task.task_id === selected_task.task_id);
            tasks.splice(selected_task_index,1,selected_task);
            
            tasks = tasks;
            filtered_tasks = tasks;
            filtered_tasks = filtered_tasks;
            fireEvent(EVENTS.HIDE_SPINNER,{});
            fireEvent(EVENTS.CLOSE_POPUP,'EDIT_TASK');
        })
        .catch(err => {
            fireEvent(EVENTS.HIDE_SPINNER,{});
        });
    }

    const processDeleteTask = (task_id) => {
        if(tasks.filter(task => task.task_id == task_id).length){
            let sure = window.confirm(`Are you sure you want to delete the task?`);
            if(!sure) return;
            fireEvent(EVENTS.SHOW_SPINNER,{});
            deleteGeneralTaskCallout(
                AUTH.currentUser.uid,
                task_id
            )
            .then(res => {
                tasks = tasks.filter(task => task.task_id !== task_id);
                filtered_tasks = tasks;
                filtered_tasks = filtered_tasks;
                fireEvent(EVENTS.HIDE_SPINNER,{});
            })
            .catch(err => {
                fireEvent(EVENTS.HIDE_SPINNER,{});
            });
        }
    }

    const processSelectTask = ({task_id,isSelected}) => {
        if(isSelected) selected_tasks.push(task_id);
        if(!isSelected) selected_tasks = selected_tasks.filter(taskId => taskId !== task_id);
        selected_tasks = selected_tasks;
    }

    const applyFilter = () => {
        if(task_filter.status){
            hasFilterApplied = true;
            filtered_tasks = tasks.filter(task => task.task_status === task_filter.status);
            filtered_tasks = filtered_tasks;
        }
    }

    const deleteBulkTasks = () => {
        
        if(selected_tasks && selected_tasks){
            if(selected_tasks.length === 1){
                processDeleteTask(selected_tasks[0]);
            }else{
                let sure = window.confirm(`Are you sure you want to delete the tasks?`);
                if(!sure) return;
                deleteGeneralBulkTaskCallout(
                    AUTH.currentUser.uid,
                    selected_tasks
                )
                .then(res => {
                    console.log('1',tasks.length);
                    tasks = tasks.filter(task => !selected_tasks.includes(task.task_id));
                    console.log('2',tasks.length);
                    filtered_tasks = tasks;
                    console.log('3',filtered_tasks.length);
                    filtered_tasks = filtered_tasks;
                    console.log('4',filtered_tasks.length);
                    selected_tasks = [];
                    selected_tasks = selected_tasks;
                    fireEvent(EVENTS.HIDE_SPINNER,{});
                })
                .catch(err => {
                    fireEvent(EVENTS.HIDE_SPINNER,{});
                });
            }
            
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
        registerListener(EVENTS.OPEN_EDIT_TASK_POPUP,processEditTaskPopup);
        registerListener(EVENTS.DELETE_TASK,processDeleteTask);
        registerListener(EVENTS.CLOSE_POPUP,processClosePopup);
        registerListener(EVENTS.SELECT_TASK,processSelectTask);
        fireEvent(EVENTS.SHOW_SPINNER,{});
        getUserGeneralTasksCallout(AUTH.currentUser.uid)
        .then(res => {
            tasks = res.data;
            filtered_tasks = tasks;
            fireEvent(EVENTS.HIDE_SPINNER,{});
        })
        .catch(err => {
            fireEvent(EVENTS.HIDE_SPINNER,{});
        });
        filtered_tasks = tasks;
    });

    onDestroy(()=>{
        unregisterListener(EVENTS.OPEN_EDIT_TASK_POPUP,processEditTaskPopup);
        unregisterListener(EVENTS.DELETE_TASK,processDeleteTask);
        unregisterListener(EVENTS.CLOSE_POPUP,processClosePopup);
        unregisterListener(EVENTS.SELECT_TASK,processSelectTask);
    })

</script>

<div class="app-container flex align-center flex-column">
    
    {#if selected_tasks.length == 0 && tasks && tasks.length}
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
        {#if selected_tasks.length == 0}
            <Icon type="primary" OnClick={openNewTaskPopup}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus">
                    <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </Icon>
        {/if}
    </div>

    {#if filtered_tasks && filtered_tasks.length}
        <div class="task-container flex justify-start align-center grow flex-column">
            {#if selected_tasks && selected_tasks.length}
                <li class="columns flex justify-end align-center table-actions">
                    <Button type="danger" label="Delete {selected_tasks.length} task{selected_tasks.length>1 ? 's' : ''}" onClick={deleteBulkTasks}></Button>
                </li>
            {/if}
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
                <Task {task} actions={['EDIT','DELETE']} allowSelection isSelected={selected_tasks.includes(task.task_id)}/>    
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

{#if POPUP.NEW_TASK}
    <Popup header="New Task" _popup_name="NEW_TASK" OnSave={saveNewTask}>
        <div class="flex flex-column justify-center">

            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input label_class={task_fields.task_name ? '' : 'has-error'} data_type="field" label="Name" hasLabel width_class="width-full" type="text" classes="bg-transparent {task_fields.task_name ? '' : 'has-error'}" value={new_task.task_name} onChange={handleNewTaskChange} data_field="task_name" Required/>
                </div>
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Status" hasLabel width_class="width-full" type="select" classes={getStatusClass(new_task.task_status)} value={new_task.task_status} onChange={handleNewTaskChange} data_field="task_status" options={TASK_STATUS} Required/>
                </div>
                
            </div>
            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input label_class={task_fields.task_start_date ? '' : 'has-error'} data_type="field" label="Start Date" hasLabel width_class="width-full" type="date" classes="bg-transparent {task_fields.task_start_date ? '' : 'has-error'}" value={new_task.task_start_date} onChange={handleNewTaskChange} data_field="task_start_date" Required={new_task.task_status == "In Progress" || new_task.task_status == "Completed"}/>
                </div>
                
                <div class="flex flex-column form-column grow">
                    <Input label_class={task_fields.task_end_date ? '' : 'has-error'} data_type="field" label="End Date" hasLabel width_class="width-full" type="date" classes="bg-transparent {task_fields.task_end_date ? '' : 'has-error'}" value={new_task.task_end_date} onChange={handleNewTaskChange} data_field="task_end_date" Required={new_task.task_status == "Completed"}/>
                </div>
                
            </div>
            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Description" hasLabel width_class="width-full" type="text-long" classes="bg-transparent" value={new_task.task_description} onChange={handleNewTaskChange} data_field="task_description" />
                </div>
                
            </div>
            
        </div>
    </Popup>
{/if}

{#if POPUP.EDIT_TASK}
    <Popup header="Edit Task" _popup_name="EDIT_TASK" OnSave={updateTask}>
        <div class="flex flex-column justify-center">

            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input label_class={task_fields.task_name ? '' : 'has-error'} data_type="field" label="Name" hasLabel width_class="width-full" type="text" classes="bg-transparent {task_fields.task_name ? '' : 'has-error'}" value={selected_task.task_name} onChange={handleExistingTaskChange} data_field="task_name" Required/>
                </div>
                
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Status" hasLabel width_class="width-full" type="select" classes={getStatusClass(selected_task.task_status)} value={selected_task.task_status} onChange={handleExistingTaskChange} data_field="task_status" options={TASK_STATUS} Required/>
                </div>
                
            </div>
            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input label_class={task_fields.task_start_date ? '' : 'has-error'} data_type="field" label="Start Date" hasLabel width_class="width-full" type="date" classes="bg-transparent {task_fields.task_start_date ? '' : 'has-error'}" value={selected_task.task_start_date} onChange={handleExistingTaskChange} data_field="task_start_date" Required={selected_task.task_status == "In Progress" || selected_task.task_status == "Completed"}/>
                </div>
                
                <div class="flex flex-column form-column grow">
                    <Input label_class={task_fields.task_end_date ? '' : 'has-error'} data_type="field" label="End Date" hasLabel width_class="width-full" type="date" classes="bg-transparent {task_fields.task_end_date ? '' : 'has-error'}" value={selected_task.task_end_date} onChange={handleExistingTaskChange} data_field="task_end_date" Required={selected_task.task_status == "Completed"}/>
                </div>
                
            </div>
            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Description" hasLabel width_class="width-full" type="text-long" classes="bg-transparent" value={selected_task.task_description} onChange={handleExistingTaskChange} data_field="task_description" />
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
        /* margin-top: 5vh; */
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

    .table-actions{
        margin: .25rem 0;
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