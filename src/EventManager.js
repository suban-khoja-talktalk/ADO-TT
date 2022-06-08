const events = {};

const EVENTS = {
    SHOW_SPINNER : 'SHOW_SPINNER',
    HIDE_SPINNER : 'HIDE_SPINNER',
    
    SELECT_VIEW : "SELECT_VIEW",
    GET_VIEW_DATA : "GET_VIEW_DATA",
    SEND_VIEW_DATA : "SEND_VIEW_DATA",

    SELECT_LIST : "SELECT_LIST",
    OPEN_NEW_LIST_POPUP : "OPEN_NEW_LIST_POPUP",
    OPEN_EDIT_LIST_POPUP : "OPEN_EDIT_LIST_POPUP",
    DELETE_LIST : "DELETE_LIST",

    SELECT_TASK : "SELECT_TASK",
    OPEN_NEW_TASK_POPUP : "OPEN_NEW_TASK_POPUP",
    OPEN_VIEW_TASK_POPUP : "OPEN_VIEW_TASK_POPUP",
    OPEN_EDIT_TASK_POPUP : "OPEN_EDIT_TASK_POPUP",
    DELETE_TASK : "DELETE_TASK",
    
    OPEN_NEW_COMPONENT_POPUP : "OPEN_NEW_COMPONENT_POPUP",
    OPEN_VIEW_COMPONENT_POPUP : "OPEN_VIEW_COMPONENT_POPUP",
    OPEN_EDIT_COMPONENT_POPUP : "OPEN_EDIT_COMPONENT_POPUP",
    DELETE_COMPONENET : "DELETE_COMPONENET",

    CLOSE_POPUP : "CLOSE_POPUP"
}

Object.freeze(EVENTS);

const registerListener = (eventName, callback) => {
    if(!eventName || !callback) return;
    try {
        if (!events[eventName]) {
            events[eventName] = [];
        }
        
        const duplicate = events[eventName].find((listener) => {
            return listener.callback == callback;
        });

        if (!duplicate) {
            events[eventName].push({ callback});
        }
    } catch (error) {
        console.error('@error : ',error)
    }

};

const unregisterListener = (eventName, callback) => {
    try {
        if (events[eventName]) {
            events[eventName] = events[eventName].filter(cb => cb.callback != callback);
        }
    } catch (error) {
        console.error('@error : ',error)
    }
  };
 
const fireEvent = (eventName, payload) => {
    if (events[eventName]) {
        const listeners = events[eventName];
        listeners.forEach((listener) => {       
            try {
                listener.callback.call(this,payload);
            } catch (error) {
                console.error('@eventName : ',eventName) &&
                console.error('@listener : ',listener) &&
                console.error('@payload : ',payload) &&
                console.error('@error : ',error)
            }
        });
    }
};

export {
    registerListener,
    unregisterListener,
    fireEvent,
    EVENTS
};
 