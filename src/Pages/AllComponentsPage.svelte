<script>
    import { onDestroy, onMount } from "svelte";
    import Input from "../utility/Input.svelte";
    import Button from "../utility/Button.svelte";
    import Popup from "../utility/Popup.svelte";
    import Icon from "../utility/Icon.svelte";
    import Component from "../Component.svelte";
    import { AUTH } from "../firebase";
    import { exportListComponentsCallout } from "../api";
    import {fireEvent, registerListener , unregisterListener,EVENTS} from '../EventManager';
    import { getComponentTypeClass,COMPONENT_COLUMN, COMPONENT_TYPE_LIST} from "../constants";
    
    export let components = [];
    let hasFilterApplied = false;
    let showFilter = false;
    let filtered_components = [];
    const POPUP = {
        VIEW_COMPONENT : false
    }

    const processClosePopup = (_popup) => {
        POPUP[_popup] = false;   
    }

    let component_filter = {
        component_start_date : "",
        component_end_date : "",
    } 

    let selected_component;

    const processOpenComponentPopup = (component_id) => {
        selected_component = components.filter(component => component.component_id === component_id)[0];
        POPUP.VIEW_COMPONENT = true;
    }

    const handleFilterChange = (e) => {
        component_filter[e.target.dataset.field] = e.target.value;
    }

    const applyFilter = () => {
        if(component_filter.component_start_date && component_filter.component_end_date){
            const component_start_date = new Date(component_filter.component_start_date);
            const component_end_date = new Date(component_filter.component_end_date);
            if( component_end_date - component_start_date >= 0){
                hasFilterApplied = true;
                filtered_components = [];
                for(let component of components){
                    const component_date = new Date(component.component_date);
                    if( component_date <= component_end_date && component_date >= component_start_date ){
                        filtered_components.push(component);
                    }
                }
                filtered_components = filtered_components;
            }
        }
    }

    const clearFilter = () => {
        filtered_components = components;
        filtered_components = filtered_components;
        hasFilterApplied = false;
    }

    const toggleFilter = () => {
        showFilter = !showFilter;
    }

    const exportComponents = () => {
        const data = JSON.stringify(filtered_components);
        const file_name = 'AllComponents '+new Date()+'.csv';
        fireEvent(EVENTS.SHOW_SPINNER,{});
        exportListComponentsCallout(
            AUTH.currentUser.uid,
            file_name,
            data  
        ).then(res => {
            const exportURL = URL.createObjectURL(res);
            const aTag = document.createElement("a");
            document.body.appendChild(aTag);
            aTag.style = "display: none";
            aTag.href = exportURL;
            aTag.download = file_name;
            aTag.click();
            window.URL.revokeObjectURL(exportURL);
            document.body.removeChild(aTag);
            fireEvent(EVENTS.HIDE_SPINNER,{});
        }) 
        .catch(err => {
            fireEvent(EVENTS.HIDE_SPINNER,{});
            console.error(err);
        });
    }

    onMount( () => {
        registerListener(EVENTS.OPEN_VIEW_COMPONENT_POPUP,processOpenComponentPopup);
        registerListener(EVENTS.CLOSE_POPUP,processClosePopup);
        filtered_components = components;
    });

    onDestroy(()=>{
        unregisterListener(EVENTS.OPEN_VIEW_COMPONENT_POPUP,processOpenComponentPopup);
        unregisterListener(EVENTS.CLOSE_POPUP,processClosePopup);
    })

</script>
<div class="app-container flex align-center flex-column">
    {#if components && components.length}
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
                        <Input data_type="field" label="Start Date" hasLabel width_class="width-full" type="date" classes="bg-transparent" value={component_filter.component_start_date} onChange={handleFilterChange} data_field="component_start_date" />
                    </div>
                    <div class="flex flex-column form-column grow">
                        <Input data_type="field" label="End Date" hasLabel width_class="width-full" type="date" classes="bg-transparent" value={component_filter.component_end_date} onChange={handleFilterChange} data_field="component_end_date" />
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
            <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            <span class="task-title"> Components </span>
        </div>
        <div class="flex align-center">
            {#if filtered_components && filtered_components.length}
                <Icon type="danger" OnClick={exportComponents}>
                    <svg data-v-9a6e255c="" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download">
                        <path data-v-9a6e255c="" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline data-v-9a6e255c="" points="7 10 12 15 17 10"></polyline><line data-v-9a6e255c="" x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </Icon>&nbsp;&nbsp;
            {/if}
        </div>
        
    </div>
    
    {#if filtered_components && filtered_components.length}
        <div class="task-container flex justify-start align-center grow flex-column">
            <li class="columns flex justify-space-between align-center text-white text-bold">
                {#each COMPONENT_COLUMN as column}
                    {#if column.show_in_list}
                        <span class="column flex grow justify-center grow border-box text-bold {column.key}">{ column.show_header ? column.label : ''}</span>    
                    {/if}
                {/each}
            </li>
            {#each filtered_components as component}
                <Component {component} actions={['VIEW']}/>    
            {/each}
        </div>
        {:else}
        <div role="alert" aria-live="polite" aria-atomic="true" class="alert alert-primary" data-v-aa799a9e="">
            <div class="alert-body box-border">
                <span>No Components.</span>
            </div>
        </div>
    {/if}
    
</div>

{#if POPUP.VIEW_COMPONENT}
    <Popup header="New Component" _popup_name="VIEW_COMPONENT" showActions={false}>
        <div class="flex flex-column justify-center">
            <div class="flex form-row">
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Name" hasLabel width_class="width-full" type="text" classes="bg-transparent" value={selected_component.component_name} data_field="component_name" readOnly/>
                </div>
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Type" hasLabel width_class="width-full" type="select" classes="bg-transparent {getComponentTypeClass(selected_component.component_type)}" value={selected_component.component_type} data_field="component_type" options={COMPONENT_TYPE_LIST} readOnly/>
                </div>
            </div>
            <div class="flex form-row">
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Version" hasLabel width_class="width-full" type="text" classes="bg-transparent" value={selected_component.component_version} data_field="component_version" readOnly/>
                </div>
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Parent Component (if any)" hasLabel width_class="width-full" type="text" classes="bg-transparent" value={selected_component.component_parent_name} data_field="component_parent_name" readOnly/>
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

    .task-header , .task-container,.filter-container{
        width : 80%
    }

    .filter-container{
        box-shadow: 0 4px 24px 0 rgb(34 41 47 / 24%);
        border-radius: 5px;
    }

    .task-header{
        border-bottom: 1px solid var(--border-tertiary-color);
        margin: 2vh 0 5px 0;
        padding: 8px 0;
        color : var(--primary-color);
    }

    .task-title{
        font-size: 1.5rem;
        color: var(--primary-color);
    }

    .form-title{
        font-size: 1.25rem;
        color: var(--primary-color);
    }

    .columns{
        width: 100%;
        list-style: none;
    }

    .form-header{
        padding: 1rem 1rem 0 1rem;
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

</style>