
export const APP_NAME = 'onelist';

const API = {
    BASE_ENDPOINT : 'https://worklist1-developer-edition.ap27.force.com/services/apexrest/api/v1/',
    ENDPOINTS : {
        "getUserData" : 'getUserData',
        "getUserGeneralTasks" : 'getUserGeneralTasks',
        "createList" : "createList",
        "updateList" : "updateList",
        "deleteList" : "deleteList",
        "createTask" : "createTask",
        "updateTask" : "updateTask",
        "deleteTask" : "deleteTask",
        "createGeneralTask" : "createGeneralTask",
        "updateGeneralTask" : "updateGeneralTask",
        "deleteGeneralTask" : "deleteGeneralTask",
        "deleteBulkGeneralTask" : "deleteBulkGeneralTask",
        "createComponent" : "createComponent",
        "updateComponent" : "updateComponent",
        "deleteComponent" : "deleteComponent",
        "exportListComponents":"exportListComponents"
    }
};

const DEFAULTS = {
    LIST_STATUS : "Not Started",
    TASK_STATUS : "Not Started",
    COMPONENT_TYPE : "Apex Class"
}

const LIST_STATUS = [
    "Not Started",
    "In Progress",
    "Completed",
];

const TASK_STATUS = [
    "Not Started",
    "In Progress",
    "Completed",
];

const COMPONENT_TYPE_LIST = [
    "Apex Class",
    "LWC",
    "Omniscript",
    "Integration Procedure",
    "Dataraptor",
    "Custom Field",
    "Page Layout",
    "Lightning Record Type",
    "Custom Button",
    "Flow",
    "Email Template",
    "Email Alert"
];

const TASK_COLUMN = [
    {
        label : "Name",
        key : "task_name",
        show_in_list : true,
        show_in_detail : true,
        show_header : false,
        allow_inline_edit : false,
        field_type : "text"
    },
    {
        label : "Start Date",
        key : "task_start_date",
        show_in_list : true,
        show_in_detail : false,
        show_header : true,
        allow_inline_edit : true,
        field_type : "date"
    },
    {
        label : "End Date",
        key : "task_end_date",
        show_in_list : true,
        show_in_detail : false,
        show_header : true,
        allow_inline_edit : true,
        field_type : "date"
    },
    {
        label : "Status",
        key : "task_status",
        show_in_list : true,
        show_in_detail : false,
        show_header : true,
        allow_inline_edit : true,
        field_type : "select"
    },
    {
        label : "Notes",
        key : "task_note",
        show_in_list : false,
        show_in_detail : true,
        show_header : false,
        allow_inline_edit : false,
        field_type : "text-long"
    }
];

const COMPONENT_COLUMN = [
    {
        label : "Name",
        key : "component_name",
        show_in_list : true,
        show_in_detail : true,
        show_header : false,
        allow_inline_edit : false,
        field_type : "text"
    },
    {
        label : "Version",
        key : "component_version",
        show_in_list : true,
        show_in_detail : false,
        show_header : true,
        allow_inline_edit : true,
        field_type : "text"
    },
    {
        label : "Date",
        key : "component_date",
        show_in_list : true,
        show_in_detail : false,
        show_header : true,
        allow_inline_edit : true,
        field_type : "text"
    },
    {
        label : "Parent Component",
        key : "component_parent_name",
        show_in_list : true,
        show_in_detail : true,
        show_header : true,
        allow_inline_edit : true,
        field_type : "text"
    },
    {
        label : "Type",
        key : "component_type",
        show_in_list : true,
        show_in_detail : false,
        show_header : true,
        allow_inline_edit : true,
        field_type : "select"
    }
];

const LIST_COLUMN = [
    {
        label : "Name",
        key : "list_name",
        show_in_list : true,
        show_in_detail : true,
        show_header : false,
        allow_inline_edit : false,
        field_type : "text"
    },
    {
        label : "Start Date",
        key : "list_start_date",
        show_in_list : false,
        show_in_detail : true,
        show_header : false,
        allow_inline_edit : true,
        field_type : "date"
    },
    {
        label : "End Date",
        key : "list_end_date",
        show_in_list : false,
        show_in_detail : true,
        show_header : false,
        allow_inline_edit : true,
        field_type : "date"
    },
    {
        label : "Status",
        key : "list_status",
        show_in_list : false,
        show_in_detail : true,
        show_header : false,
        allow_inline_edit : false,
        field_type : "select"
    },
    {
        label : "Description",
        key : "list_description",
        show_in_list : false,
        show_in_detail : true,
        show_header : false,
        allow_inline_edit : false,
        field_type : "text-long"
    }
];

const getStatusClass = (_status) => {
    if(!_status) return '';
    return _status.replace(' ','-');
}

const getComponentTypeClass = (_type) => {
    if(!_type) return '';
    return _type.replace(' ','-');
}

const getBulletClass = (_status) => {
    if(!_status) return '';
    return 'Bullet-'+_status.replace(' ','-');
}

const encoding_decoding = (str,key) => {
    let enc = "";
    let encodedKey = "";
    // make sure that input is string
    str = str.toString();
    for (let i = 0; i < key.length; i++) {
        encodedKey += key.charCodeAt(i);
    }
    encodedKey = ""+encodedKey;
    encodedKey = encodedKey.substr(0,10);
    for (let i = 0; i < str.length; i++) {
        // create block
        const a = str.charCodeAt(i);
        // bitwise XOR
        const b = a ^ encodedKey;
        enc = enc + String.fromCharCode(b);
    }
    return enc;
}   


Object.freeze(API);
Object.freeze(LIST_STATUS);
Object.freeze(TASK_STATUS);
Object.freeze(TASK_COLUMN);
Object.freeze(LIST_COLUMN);
Object.freeze(COMPONENT_TYPE_LIST);
Object.freeze(COMPONENT_COLUMN);
Object.freeze(DEFAULTS);

export {
    API,
    LIST_STATUS,
    TASK_COLUMN,
    TASK_STATUS,
    COMPONENT_COLUMN,
    LIST_COLUMN,
    COMPONENT_TYPE_LIST,
    DEFAULTS,
    getStatusClass,
    getComponentTypeClass,
    getBulletClass
};


