<script>
    import { onMount , onDestroy} from "svelte";
    import {getUserDataCallout , createListCallout, updateListCallout ,deleteListCallout , createTaskCallout , updateTaskCallout , deleteTaskCallout , createComponentCallout , updateComponentCallout , deleteComponentCallout } from '../api';
    import { AUTH } from "../firebase";
    import Input from "../utility/Input.svelte";
    import Popup from "../utility/Popup.svelte";
    import {registerListener , unregisterListener, EVENTS, fireEvent} from '../EventManager';
    import Sidebar from "../Sidebar.svelte";
    import Container from "../Container.svelte";
    import { LIST_STATUS, getStatusClass,getComponentTypeClass, TASK_STATUS , COMPONENT_TYPE_LIST , DEFAULTS} from "../constants";

    let store = [];
    let lists = [];
    const POPUP = {
        NEW_LIST : false,
        EDIT_LIST : false,
        NEW_TASK : false,
        EDIT_TASK : false,
        NEW_COMPONENT : false,
        EDIT_COMPONENT : false
    }

    const processClosePopup = (_popup) => {
        if(_popup == 'EDIT_LIST'){
            selected_list = JSON.parse(JSON.stringify(backup_selected_list));
        }
        POPUP[_popup] = false; 
    }
    
    let selected_list;
    let backup_selected_list;

    let new_list = {
        list_name : "",
        list_start_date : "",
        list_end_date : "",
        list_status : DEFAULTS.LIST_STATUS,
        list_description : ""
    };

    let list_fields = {
        list_name : true,
        list_start_date : true,
        list_end_date : true
    }

    const handleNewListChange = (e) => {
        new_list[e.target.dataset.field] = e.target.value;
    }

    const handleExistingListChange = (e) => {
        selected_list[e.target.dataset.field] = e.target.value;
    }

    const processOpenNewListPopup = () => {
        list_fields = {
            list_name : true,
            list_start_date : true,
            list_end_date : true
        }
        POPUP.NEW_LIST = true;
    }

    const processSelectListEvent = (list_id) => {
        list_fields = {
            list_name : true,
            list_start_date : true,
            list_end_date : true
        }
        selected_list = store.filter(list => list.list_id == list_id)[0];
    }

    const processEditListPopup = () => {
        backup_selected_list = JSON.parse(JSON.stringify(selected_list));
        POPUP.EDIT_LIST = true;
    }

    const saveNewList = () => {
        if(!new_list.list_name){
            list_fields.list_name = false;
            return;
        }else{
            list_fields.list_name = true;
        }
        

        if(new_list.list_status === "In Progress"){
            if(!new_list.list_start_date){
                list_fields.list_start_date = false;
                return;
            }else{
                list_fields.list_start_date = true;
            }
        }

        if(new_list.list_status === "Completed"){
            if(!new_list.list_start_date){
                list_fields.list_start_date = false;
                return;
            }else{
                list_fields.list_start_date = true;
            }
            if(!new_list.list_end_date){
                list_fields.list_end_date = false;
                return;
            }else{
                list_fields.list_end_date = true;
            }
        }

        if(new_list.list_start_date && new_list.list_end_date){
            let start_date = new Date(new_list.list_start_date);
            let end_date = new Date(new_list.list_end_date);
            if(end_date - start_date < 0){
                list_fields.list_end_date = false;
                list_fields.list_start_date = false;
                return;
            }else{
                list_fields.list_end_date = true;
                list_fields.list_start_date = true;
            }
        }

        
        fireEvent(EVENTS.SHOW_SPINNER,{});
        createListCallout(
            AUTH.currentUser.uid,
            new_list.list_name,
            JSON.stringify({
                description : new_list.list_description,
                status : new_list.list_status,
                start_date : new_list.list_start_date,
                end_date : new_list.list_end_date
            })
        )
        .then(res => {
            store.push({
                list_id:res.list_id,
                list_name : res.list_name,
                list_start_date : res.list_start_date,
                list_end_date : res.list_end_date,
                list_description : res.list_description,
                list_status : res.list_status,
                list_task_root_id : res.list_task_root_id,
                list_component_root_id : res.list_component_root_id,
                list_tasks : [],
                list_components : []
            });
            lists.push({
                list_id : res.list_id,
                list_name : res.list_name
            });
            new_list = {
                list_name : "",
                list_start_date : "",
                list_end_date : "",
                list_status : "Not Started",
                list_description : ""
            };
            store = store;
            lists = lists;
            fireEvent(EVENTS.HIDE_SPINNER,{});
            fireEvent(EVENTS.CLOSE_POPUP,'NEW_LIST');
        }) 
        .catch(err => {
            fireEvent(EVENTS.HIDE_SPINNER,{});
            console.error(err);
        });
    }

    const updateList = () => {
        if(!selected_list.list_name){
            list_fields.list_name = false;
            return;
        }else{
            list_fields.list_name = true;
        }
        

        if(selected_list.list_status === "In Progress"){
            if(!selected_list.list_start_date){
                list_fields.list_start_date = false;
                return;
            }else{
                list_fields.list_start_date = true;
            }
        }

        if(selected_list.list_status === "Completed"){
            if(!selected_list.list_start_date){
                list_fields.list_start_date = false;
                return;
            }else{
                list_fields.list_start_date = true;
            }
            if(!selected_list.list_end_date){
                list_fields.list_end_date = false;
                return;
            }else{
                list_fields.list_end_date = true;
            }
        }

        if(selected_list.list_start_date && selected_list.list_end_date){
            let start_date = new Date(selected_list.list_start_date);
            let end_date = new Date(selected_list.list_end_date);
            if(end_date - start_date < 0){
                list_fields.list_end_date = false;
                list_fields.list_start_date = false;
                return;
            }else{
                list_fields.list_end_date = true;
                list_fields.list_start_date = true;
            }
        }

        fireEvent(EVENTS.SHOW_SPINNER,{});
        updateListCallout(
            AUTH.currentUser.uid,
            selected_list.list_id,
            selected_list.list_name,
            JSON.stringify({
                description : selected_list.list_description,
                status : selected_list.list_status,
                start_date : selected_list.list_start_date,
                end_date : selected_list.list_end_date
            })
        )
        .then(res => {
            for(let i=0;i<lists.length;i++){
                if(lists[i].list_id === selected_list.list_id){
                    lists[i].list_name = selected_list.list_name;
                }
            }
            backup_selected_list = JSON.parse(JSON.stringify(selected_list));
            store = store;
            fireEvent(EVENTS.HIDE_SPINNER,{});
            fireEvent(EVENTS.CLOSE_POPUP,'EDIT_LIST');
        })
        .catch(err => {
            fireEvent(EVENTS.HIDE_SPINNER,{});
        });
    }

    function processDeleteList () {
        let sure = window.confirm(`Are you sure you want to delete ${selected_list.list_name} ?`);
        if(!sure) return;
        fireEvent(EVENTS.SHOW_SPINNER,{});
        deleteListCallout(
            AUTH.currentUser.uid,
            selected_list.list_id
        )
        .then(res => {
            for(let i=0;i<lists.length;i++){
                if(lists[i].list_id === selected_list.list_id){
                    lists.splice(i,1);
                }
            }
            selected_list = null;
            backup_selected_list = null;
            store = store;
            fireEvent(EVENTS.HIDE_SPINNER,{});
        })
        .catch(err => {
            fireEvent(EVENTS.HIDE_SPINNER,{});
        });

    }

    let selected_task;
    let backup_selected_task;

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

    const handleNewTaskChange = (e) => {
        new_task[e.target.dataset.field] = e.target.value;
    }

    const handleExistingTaskChange = (e) => {
        selected_task[e.target.dataset.field] = e.target.value;
    }

    const processOpenTaskPopup = () => {
        task_fields = {
            task_name : true,
            task_start_date : true,
            task_end_date : true
        }
        POPUP.NEW_TASK = true;
    }

    const processEditTaskPopup = (task_id) => {
        for(let i=0;i<selected_list.list_tasks.length;i++){
            if(selected_list.list_tasks[i].task_id === task_id){
                selected_task = JSON.parse(JSON.stringify(selected_list.list_tasks[i]));
                backup_selected_task = JSON.parse(JSON.stringify(selected_list.list_tasks[i]));
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
        createTaskCallout(
            AUTH.currentUser.uid,
            new_task.task_name,
            JSON.stringify({
                description : new_task.task_description,
                status : new_task.task_status,
                start_date : new_task.task_start_date,
                end_date : new_task.task_end_date
            }),
            selected_list.list_task_root_id
        )
        .then(res => {
            selected_list.list_tasks.push({
                task_id:res.task_id,
                task_name : res.task_name,
                task_start_date : res.task_start_date,
                task_end_date : res.task_end_date,
                task_description : res.task_description,
                task_status : res.task_status
            });

            const selected_list_index = store.findIndex(list => list.list_id === selected_list.list_id);

            store.splice(selected_list_index,1,selected_list);
            new_task = {
                task_name : "",
                task_start_date : "",
                task_end_date : "",
                task_status : DEFAULTS.TASK_STATUS,
                task_description : ""
            };
            selected_list = selected_list;
            store = store;
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
        updateTaskCallout(
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

            const selected_task_index = selected_list.list_tasks.findIndex(task => task.task_id === selected_task.task_id);
            selected_list.list_tasks.splice(selected_task_index,1,selected_task);
            
            selected_list = selected_list;

            const selected_list_index = store.findIndex(list => list.list_id === selected_list.list_id);
            store.splice(selected_list_index,1,selected_list);
            
            store = store;

            fireEvent(EVENTS.HIDE_SPINNER,{});
            fireEvent(EVENTS.CLOSE_POPUP,'EDIT_TASK');
        })
        .catch(err => {
            fireEvent(EVENTS.HIDE_SPINNER,{});
        });
    }

    const processDeleteTask = (task_id) => {
        if(selected_list.list_tasks.filter(task => task.task_id == task_id).length){
            let sure = window.confirm(`Are you sure you want to delete the task?`);
            if(!sure) return;
            fireEvent(EVENTS.SHOW_SPINNER,{});
            deleteTaskCallout(
                AUTH.currentUser.uid,
                task_id
            )
            .then(res => {
                for(let i=0;i<selected_list.list_tasks.length;i++){
                    if(selected_list.list_tasks[i].task_id === task_id){
                        selected_list.list_tasks.splice(i,1);
                    }
                }
                selected_list = selected_list;
                store = store;
                fireEvent(EVENTS.HIDE_SPINNER,{});
            })
            .catch(err => {
                fireEvent(EVENTS.HIDE_SPINNER,{});
            });
        }
    }

    let selected_component;
    let backup_selected_component;

    let new_component = {
        component_name : "",
        component_type : DEFAULTS.COMPONENT_TYPE,
        component_version : "",
        component_parent_name : "",
        component_date : ""
    };

    let component_fields = {
        component_name : true,
        component_date : true,
        component_version : true
    }

    const handleNewComponentChange = (e) => {
        new_component[e.target.dataset.field] = e.target.value;
    }

    const handleExistingComponentChange = (e) => {
        selected_component[e.target.dataset.field] = e.target.value;
    }

    const processOpenComponentPopup = () => {
        component_fields = {
            component_name : true,
            component_date : true,
            component_version : true
        }
        POPUP.NEW_COMPONENT = true;
    }
    
    const processEditComponentPopup = (component_id) => {
        for(let i=0;i<selected_list.list_components.length;i++){
            if(selected_list.list_components[i].component_id === component_id){
                selected_component = JSON.parse(JSON.stringify(selected_list.list_components[i]));
                backup_selected_component = JSON.parse(JSON.stringify(selected_list.list_components[i]));
            }
        }
        component_fields = {
            component_name : true,
            component_date : true,
            component_version : true
        }
        POPUP.EDIT_COMPONENT = true;
    }

    const saveNewComponent = () => {
        if(!new_component.component_name){
            component_fields.component_name = false;
            return;
        }else{
            component_fields.component_name = true;
        }
        if(!new_component.component_date){
            component_fields.component_date = false;
            return;
        }else{
            component_fields.component_date = true;
        }

        if(new_component.component_type === "Omniscript" || new_component.component_type === "Integration Procedure" || new_component.component_type === "Flow"){
            if(!new_component.component_version){
                component_fields.component_version = false;
                return;
            }else{
                component_fields.component_version = true;
            }
        }else{
            component_fields.component_version = true;
        }

        fireEvent(EVENTS.SHOW_SPINNER,{});
        createComponentCallout(
            AUTH.currentUser.uid,
            new_component.component_name,
            JSON.stringify({
                type : new_component.component_type,
                version : new_component.component_version,
                parent_component : new_component.component_parent_name,
                date : new_component.component_date
            }),
            selected_list.list_component_root_id
        )
        .then(res => {
            selected_list.list_components.push({
                component_id:res.component_id,
                component_name : res.component_name,
                component_type : res.component_type,
                component_version : res.component_version,
                component_parent_name : res.component_parent_name,
                component_date : res.component_date,
            });

            const selected_list_index = store.findIndex(list => list.list_id === selected_list.list_id);
            store.splice(selected_list_index,1,selected_list);

            new_component = {
                component_name : "",
                component_type : DEFAULTS.COMPONENT_TYPE,
                component_version : "",
                component_parent_name : "",
                component_date : ""
            };

            selected_list = selected_list;
            store = store;
            fireEvent(EVENTS.HIDE_SPINNER,{});
            fireEvent(EVENTS.CLOSE_POPUP,'NEW_COMPONENT');
        })
        .catch(err => {
            fireEvent(EVENTS.HIDE_SPINNER,{});
        });
    }

    const updateComponent = () => {
        if(!selected_component.component_name){
            component_fields.component_name = false;
            return;
        }else{
            component_fields.component_name = true;
        }
        if(!selected_component.component_date){
            component_fields.component_date = false;
            return;
        }else{
            component_fields.component_date = true;
        }

        if(selected_component.component_type === "Omniscript" || selected_component.component_type === "Integration Procedure" || selected_component.component_type === "Flow"){
            if(!selected_component.component_version){
                component_fields.component_version = false;
                return;
            }else{
                component_fields.component_version = true;
            }
        }else{
            component_fields.component_version = true;
        }

        fireEvent(EVENTS.SHOW_SPINNER,{});
        updateComponentCallout(
            AUTH.currentUser.uid,
            selected_component.component_id,
            selected_component.component_name,
            JSON.stringify({
                type : selected_component.component_type,
                version : selected_component.component_version,
                parent_component : selected_component.component_parent_name,
                date : selected_component.component_date
            })
        )
        .then(res => {
            selected_component = selected_component;
            backup_selected_component = JSON.parse(JSON.stringify(selected_component));

            const selected_component_index = selected_list.list_components.findIndex(component => component.component_id === selected_component.component_id);
            selected_list.list_components.splice(selected_component_index,1,selected_component);
            
            selected_list = selected_list;

            const selected_list_index = store.findIndex(list => list.list_id === selected_list.list_id);
            store.splice(selected_list_index,1,selected_list);
            
            store = store;

            fireEvent(EVENTS.HIDE_SPINNER,{});
            fireEvent(EVENTS.CLOSE_POPUP,'EDIT_COMPONENT');
        })
        .catch(err => {
            fireEvent(EVENTS.HIDE_SPINNER,{});
        });
    }

    const processDeleteComponent = (component_id) => {
        if(selected_list.list_components.filter(component => component.component_id == component_id).length){
            let sure = window.confirm(`Are you sure you want to delete the component?`) ;
            if(!sure) return;
            fireEvent(EVENTS.SHOW_SPINNER,{});
            deleteComponentCallout(
                AUTH.currentUser.uid,
                component_id
            )
            .then(res => {
                for(let i=0;i<selected_list.list_components.length;i++){
                    if(selected_list.list_components[i].component_id === component_id){
                        selected_list.list_components.splice(i,1);
                    }
                }
                selected_list = selected_list;
                store = store;
                fireEvent(EVENTS.HIDE_SPINNER,{});
            })
            .catch(err => {
                fireEvent(EVENTS.HIDE_SPINNER,{});
            });
        }
    }
    
    const processViewData = ({new_view,current_view}) => {
        if(new_view === "ALLTASKS"){
            let tasks = [];
            if(store && store.length){
                store.forEach(list => {
                    if(list.list_tasks && list.list_tasks.length){
                        tasks.push(...list.list_tasks)
                    }
                })
            }
            fireEvent(EVENTS.SEND_VIEW_DATA,{
                view : new_view,
                data : tasks
            });
        }else if(new_view === "ALLCOMPONENTS"){
            let components = [];
            if(store && store.length){
                store.forEach(list => {
                    if(list.list_components && list.list_components.length){
                        components.push(...list.list_components)
                    }
                })
            }
            fireEvent(EVENTS.SEND_VIEW_DATA,{
                view : new_view,
                data : components
            });
        }else{
            fireEvent(EVENTS.SEND_VIEW_DATA,{
                view : new_view,
                data : null
            });
        }
    }

    onMount( () => {
        
        registerListener(EVENTS.SELECT_LIST,processSelectListEvent);
        registerListener(EVENTS.OPEN_NEW_LIST_POPUP,processOpenNewListPopup);
        registerListener(EVENTS.OPEN_EDIT_LIST_POPUP,processEditListPopup);
        registerListener(EVENTS.DELETE_LIST,processDeleteList);

        registerListener(EVENTS.OPEN_NEW_TASK_POPUP,processOpenTaskPopup);
        registerListener(EVENTS.OPEN_EDIT_TASK_POPUP,processEditTaskPopup);
        registerListener(EVENTS.DELETE_TASK,processDeleteTask);

        registerListener(EVENTS.OPEN_NEW_COMPONENT_POPUP,processOpenComponentPopup);
        registerListener(EVENTS.OPEN_EDIT_COMPONENT_POPUP,processEditComponentPopup);
        registerListener(EVENTS.DELETE_COMPONENET,processDeleteComponent);

        registerListener(EVENTS.CLOSE_POPUP,processClosePopup);
        registerListener(EVENTS.GET_VIEW_DATA,processViewData);
        
        fireEvent(EVENTS.SHOW_SPINNER,{});

        getUserDataCallout(AUTH.currentUser.uid)
        .then(res => {
            if(res && res.data && res.data.length){
                store = res.data;
                for(let i=0;i<store.length;i++){
                    lists.push({
                        list_id : store[i].list_id,
                        list_name : store[i].list_name
                    });
                }
                lists = lists;
                store = store;
                fireEvent(EVENTS.HIDE_SPINNER,{});
            }else{
                fireEvent(EVENTS.HIDE_SPINNER,{});
            }
        })
        .catch(err => {
            fireEvent(EVENTS.HIDE_SPINNER,{});
        })
    });

    onDestroy( () => {
        unregisterListener(EVENTS.SELECT_LIST,processSelectListEvent);
        unregisterListener(EVENTS.OPEN_NEW_LIST_POPUP,processOpenNewListPopup);
        unregisterListener(EVENTS.OPEN_EDIT_LIST_POPUP,processEditListPopup);
        unregisterListener(EVENTS.DELETE_LIST,processDeleteList);

        unregisterListener(EVENTS.OPEN_NEW_TASK_POPUP,processOpenTaskPopup);
        unregisterListener(EVENTS.OPEN_EDIT_TASK_POPUP,processEditTaskPopup);
        unregisterListener(EVENTS.DELETE_TASK,processDeleteTask);

        unregisterListener(EVENTS.OPEN_NEW_COMPONENT_POPUP,processOpenComponentPopup);
        unregisterListener(EVENTS.OPEN_EDIT_COMPONENT_POPUP,processEditComponentPopup);
        unregisterListener(EVENTS.DELETE_COMPONENET,processDeleteComponent);

        unregisterListener(EVENTS.CLOSE_POPUP,processClosePopup);
    })
</script>

<div class="app-container flex align-center flex-column">
    <Sidebar {lists} selected_list_id={selected_list?.list_id}/>
    {#if selected_list}
        <Container {selected_list}/>
    {/if}
</div>

{#if POPUP.NEW_LIST}
    <Popup header="New User Story" _popup_name="NEW_LIST" OnSave={saveNewList}>
        <div class="flex flex-column justify-center">

            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input label_class={list_fields.list_name ? '' : 'has-error'} data_type="field" label="Name" hasLabel width_class="width-full" type="text" classes="bg-transparent {list_fields.list_name ? '' : 'has-error'}" value={new_list.list_name} onChange={handleNewListChange} data_field="list_name" Required/>
                </div>
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Status" hasLabel width_class="width-full" type="select" classes={getStatusClass(new_list.list_status)} value={new_list.list_status} onChange={handleNewListChange} data_field="list_status" options={LIST_STATUS} Required/>
                </div>
                
            </div>
            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input label_class={list_fields.list_start_date ? '' : 'has-error'} data_type="field" label="Start Date" hasLabel width_class="width-full" type="date" classes="bg-transparent {list_fields.list_start_date ? '' : 'has-error'}" value={new_list.list_start_date} onChange={handleNewListChange} data_field="list_start_date" Required={new_list.list_status == "In Progress" || new_list.list_status == "Completed" }/>
                </div>
                
                <div class="flex flex-column form-column grow">
                    <Input label_class={list_fields.list_end_date ? '' : 'has-error'} data_type="field" label="End Date" hasLabel width_class="width-full" type="date" classes="bg-transparent {list_fields.list_end_date ? '' : 'has-error'}" value={new_list.list_end_date} onChange={handleNewListChange} data_field="list_end_date" Required={new_list.list_status == "Completed"}/>
                </div>
                
            </div>
            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Description" hasLabel width_class="width-full" type="text-long" classes="bg-transparent" value={new_list.list_description} onChange={handleNewListChange} data_field="list_description" />
                </div>
                
            </div>
            
        </div>
    </Popup>
{/if}

{#if POPUP.EDIT_LIST}
    <Popup header="Edit User Story" _popup_name="EDIT_LIST" OnSave={updateList}>
        <div class="flex flex-column justify-center">

            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input label_class={list_fields.list_name ? '' : 'has-error'} data_type="field" label="Name" hasLabel width_class="width-full" type="text" classes="bg-transparent {list_fields.list_name ? '' : 'has-error'}" value={selected_list.list_name} onChange={handleExistingListChange} data_field="list_name" Required/>
                </div>
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Status" hasLabel width_class="width-full" type="select" classes={getStatusClass(selected_list.list_status)} value={selected_list.list_status} onChange={handleExistingListChange} data_field="list_status" options={LIST_STATUS} Required/>
                </div>
                
            </div>
            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input label_class={list_fields.list_start_date ? '' : 'has-error'} data_type="field" label="Start Date" hasLabel width_class="width-full" type="date" classes="bg-transparent {list_fields.list_start_date ? '' : 'has-error'}" value={selected_list.list_start_date} onChange={handleExistingListChange} data_field="list_start_date" Required={selected_list.list_status == "In Progress" || selected_list.list_status == "Completed"}/>
                </div>
                
                <div class="flex flex-column form-column grow">
                    <Input label_class={list_fields.list_end_date ? '' : 'has-error'} data_type="field" label="End Date" hasLabel width_class="width-full" type="date" classes="bg-transparent {list_fields.list_end_date ? '' : 'has-error'}" value={selected_list.list_end_date} onChange={handleExistingListChange} data_field="list_end_date" Required={selected_list.list_status == "Completed"}/>
                </div>
                
            </div>
            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Description" hasLabel width_class="width-full" type="text-long" classes="bg-transparent" value={selected_list.list_description} onChange={handleExistingListChange} data_field="list_description" />
                </div>
                
            </div>
            
        </div>
    </Popup>
{/if}

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
                    <Input label_class={task_fields.task_start_date ? '' : 'has-error'} data_type="field" label="Start Date" hasLabel width_class="width-full" type="date" classes="bg-transparent {task_fields.task_start_date ? '' : 'has-error'}" value={selected_task.task_start_date} onChange={handleExistingTaskChange} data_field="task_start_date" Required={selected_task.task_status == "In Progress"  || selected_task.task_status == "Completed"}/>
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

{#if POPUP.NEW_COMPONENT}
    <Popup header="New Component" _popup_name="NEW_COMPONENT" OnSave={saveNewComponent}>
        <div class="flex flex-column justify-center">
            <div class="flex form-row">
                <div class="flex flex-column form-column grow">
                    <Input label_class={component_fields.component_name ? '' : 'has-error'} data_type="field" label="Name" hasLabel width_class="width-full" type="text" classes="bg-transparent {component_fields.component_name ? '' : 'has-error'}" value={new_component.component_name} onChange={handleNewComponentChange} data_field="component_name" Required/>
                </div>
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Type" hasLabel width_class="width-full" type="select" classes="bg-transparent Component-Type {getComponentTypeClass(new_component.component_type)}" value={new_component.component_type} onChange={handleNewComponentChange} data_field="component_type" options={COMPONENT_TYPE_LIST} Required/>
                </div>
            </div>
            <div class="flex form-row">
                <div class="flex flex-column form-column grow">
                    <Input label_class={component_fields.component_date ? '' : 'has-error'} data_type="field" label="Date" hasLabel width_class="width-full" type="date" classes="bg-transparent {component_fields.component_date ? '' : 'has-error'}" value={new_component.component_date} onChange={handleNewComponentChange} data_field="component_date" Required/>
                </div>
                <div class="flex flex-column form-column grow">
                    <Input label_class={component_fields.component_version ? '' : 'has-error'} data_type="field" label="Version" hasLabel width_class="width-full" type="text" classes="bg-transparent {component_fields.component_version ? '' : 'has-error'}" value={new_component.component_version} onChange={handleNewComponentChange} data_field="component_version" Required={new_component.component_type === "Omniscript" || new_component.component_type === "Integration Procedure" || new_component.component_type === "Flow"}/>
                </div>
            </div>
            <div class="flex form-row">
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Parent Component (if any)" hasLabel width_class="width-full" type="text" classes="bg-transparent" value={new_component.component_parent_name} onChange={handleNewComponentChange} data_field="component_parent_name" />
                </div>
            </div>
        </div>
    </Popup>
{/if}

{#if POPUP.EDIT_COMPONENT}
    <Popup header="Edit Component" _popup_name="EDIT_COMPONENT" OnSave={updateComponent}>
        <div class="flex flex-column justify-center">

            <div class="flex form-row">
                <div class="flex flex-column form-column grow">
                    <Input label_class={component_fields.component_name ? '' : 'has-error'} data_type="field" label="Name" hasLabel width_class="width-full" type="text" classes="bg-transparent {component_fields.component_name ? '' : 'has-error'}" value={selected_component.component_name} onChange={handleExistingComponentChange} data_field="component_name" Required/>
                </div>
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Type" hasLabel width_class="width-full" type="select" classes="bg-transparent Component-Type {getComponentTypeClass(selected_component.component_type)}" value={selected_component.component_type} onChange={handleExistingComponentChange} data_field="component_type" options={COMPONENT_TYPE_LIST} Required/>
                </div>
                
            </div>
            <div class="flex form-row">

                <div class="flex flex-column form-column grow">
                    <Input label_class={component_fields.component_date ? '' : 'has-error'} data_type="field" label="Date" hasLabel width_class="width-full" type="date" classes="bg-transparent {component_fields.component_date ? '' : 'has-error'}" value={selected_component.component_date} onChange={handleExistingComponentChange} data_field="component_date" Required/>
                </div>
                <div class="flex flex-column form-column grow">
                    <Input label_class={component_fields.component_version ? '' : 'has-error'} data_type="field" label="Version" hasLabel width_class="width-full" type="text" classes="bg-transparent {component_fields.component_version ? '' : 'has-error'}" value={selected_component.component_version} onChange={handleExistingComponentChange} data_field="component_version" Required={selected_component.component_type === "Omniscript" || selected_component.component_type === "Integration Procedure" || selected_component.component_type === "Flow"}/>
                </div>
                
            </div>
            <div class="flex form-row">
                <div class="flex flex-column form-column grow">
                    <Input data_type="field" label="Parent Component (if any)" hasLabel width_class="width-full" type="text" classes="bg-transparent" value={selected_component.component_parent_name} onChange={handleExistingComponentChange} data_field="component_parent_name" />
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
    }

    .form-row{
        padding: 1rem 0;
    }

    .form-column{
        padding: 0 1rem;
        width: 50%;
    }

</style>