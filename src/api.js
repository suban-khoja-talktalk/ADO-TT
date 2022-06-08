import { API } from "./constants";

export const getUserDataCallout = (user_id) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.getUserData,{
        method : 'POST',
        body : JSON.stringify({
            user_id
        })
    })
    .then(res => res.json())
    .catch(err => {
        console.error('getUserDataCallout : ',err);
    });
};

export const getUserGeneralTasksCallout = (user_id) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.getUserGeneralTasks,{
        method : 'POST',
        body : JSON.stringify({
            user_id
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('getUserGeneralTasksCallout : ',err);
    });
};

export const createListCallout = (user_id,list_name,list_detail) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.createList,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            list_name,
            list_detail
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('createListCallout : ',err);
    });
};

export const updateListCallout = (user_id,list_id,list_name,list_detail) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.updateList,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            list_id,
            list_name,
            list_detail
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('updateListCallout : ',err);
    });
};

export const deleteListCallout = (user_id,list_id) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.deleteList,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            list_id
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('deleteListCallout : ',err);
    });
};

export const createTaskCallout = (user_id,task_name,task_detail,list_task_root_id) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.createTask,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            task_name,
            task_detail,
            list_task_root_id
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('createTaskCallout : ',err);
    });
};

export const updateTaskCallout = (user_id,task_id,task_name,task_detail) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.updateTask,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            task_id,
            task_name,
            task_detail
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('updateTaskCallout : ',err);
    });
};

export const deleteTaskCallout = (user_id,task_id) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.deleteTask,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            task_id
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('deleteTaskCallout : ',err);
    });
};

export const createGeneralTaskCallout = (user_id,task_name,task_detail) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.createGeneralTask,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            task_name,
            task_detail
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('createTaskCallout : ',err);
    });
};

export const updateGeneralTaskCallout = (user_id,task_id,task_name,task_detail) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.updateGeneralTask,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            task_id,
            task_name,
            task_detail
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('updateGeneralTaskCallout : ',err);
    });
};

export const deleteGeneralTaskCallout = (user_id,task_id) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.deleteGeneralTask,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            task_id
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('deleteGeneralTaskCallout : ',err);
    });
};

export const deleteGeneralBulkTaskCallout = (user_id,task_ids) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.deleteBulkGeneralTask,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            task_ids
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('deleteGeneralBulkTaskCallout : ',err);
    });
};

export const createComponentCallout = (user_id,component_name,component_detail,list_component_root_id) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.createComponent,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            component_name,
            component_detail,
            list_component_root_id
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('createComponentCallout : ',err);
    });
};

export const updateComponentCallout = (user_id,component_id,component_name,component_detail) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.updateComponent,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            component_id,
            component_name,
            component_detail
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('updateComponentCallout : ',err);
    });
};

export const deleteComponentCallout = (user_id,component_id) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.deleteComponent,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            component_id
        })
    }).then(res => res.json())
    .catch(err => {
        console.error('deleteComponentCallout : ',err);
    });
};


export const exportListComponentsCallout = (user_id,file_name,data) => {
    return fetch(API.BASE_ENDPOINT+API.ENDPOINTS.exportListComponents,{
        method : 'POST',
        body : JSON.stringify({
            user_id,
            file_name,
            data
        })
    }).then(res => res.blob())
    .catch(err => {
        console.error('exportListComponentsCallout : ',err);
    });
};




