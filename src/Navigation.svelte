<script>
    import { EVENTS , fireEvent } from "./EventManager";
    import Icon from "./utility/Icon.svelte";
    import {signoutUser} from "./firebase";

    export let currentView;

    const sendChangeView = (view) => {
        fireEvent(EVENTS.SELECT_VIEW,view);
    } 

</script>

<main>
    <div class="navigation fixed">
        <div class="header">
            <div class="flex align-center justify-space-between logo-container text-center">
                <img class="navigation-logo" src="./favicon.png" alt="worklist"/>
            </div>
        </div>
        <div class="content">
            <ul class="flex flex-column justify-space-between list-container">
                <li class="flex flex-column align-center justify-center list-actions border-box relative">
                    <Icon type="shaded-white" selected={currentView === "LISTS"} OnClick={ () => {sendChangeView('LISTS')}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={currentView === "LISTS" ? "20px" : "25px" } height={currentView === "LISTS" ? "20px" : "25px" } viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="align-center feather feather-file-text svelte-zcrwnl">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </Icon>
                    &nbsp;&nbsp;
                    <Icon type="shaded-white" selected={currentView === "ALLTASKS"} OnClick={ () => {sendChangeView('ALLTASKS')}}>
                        <svg data-v-1134b199="" xmlns="http://www.w3.org/2000/svg" width={currentView === "ALLTASKS" ? "20px" : "25px" } height={currentView === "ALLTASKS" ? "20px" : "25px" } viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-vd6hsc">
                            <polyline data-v-1134b199="" points="9 11 12 14 22 4"></polyline>
                            <path data-v-1134b199="" d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                    </Icon>
                    &nbsp;&nbsp;
                    <Icon type="shaded-white" selected={currentView === "ALLCOMPONENTS"} OnClick={ () => {sendChangeView('ALLCOMPONENTS')}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={currentView === "ALLCOMPONENTS" ? "20px" : "25px" } height={currentView === "ALLCOMPONENTS" ? "20px" : "25px" } viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-vd6hsc">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                            <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                    </Icon>
                    &nbsp;&nbsp;
                    <Icon type="shaded-white" selected={currentView === "GENERALTASKS"} OnClick={ () => {sendChangeView('GENERALTASKS')}}>
                        <svg data-v-32017d0f="" xmlns="http://www.w3.org/2000/svg" width={currentView === "GENERALTASKS" ? "20px" : "25px" } height={currentView === "GENERALTASKS" ? "20px" : "25px" } viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-50 feather feather-database text-success"><ellipse data-v-32017d0f="" cx="12" cy="5" rx="9" ry="3"></ellipse><path data-v-32017d0f="" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path data-v-32017d0f="" d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
                    </Icon>
                    
                </li>
                <li class="flex flex-column align-center justify-center list-actions border-box relative">
                    <Icon type="danger" OnClick={signoutUser}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-50 feather feather-log-out">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </Icon>
                </li>
            </ul>
        </div>
    </div>
</main>

<style>

    .navigation{
        width: 5.25rem;
        background-color: #7367f01f;
        height: 100%;
        z-index: 2;
        left: 0;
        box-shadow: 0 0 15px 0 rgb(34 41 47 / 5%);
    }

    .navigation .header{
        height: 3.3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
    }

    .list-actions{
        padding: .3rem;
    }

    .navigation .content{
        height: calc(100% - 2.45rem);
    }

    .navigation .list-container{
        padding: 0;
        list-style: none;
        height: 85vh;
    }

    .list-item{
        white-space : nowrap;
        color: var(--text-secondary-color);
        line-height: 1.45;
        padding: 0.25rem 0;
    }

    .list-item .item-content{
        padding: 10px 15px 10px 15px;
        margin: 0 15px;
        width: 100%;
        border-radius: 5px;
        overflow: hidden;
    }

    .item-name{
        overflow: hidden;
        text-overflow: ellipsis;
        width: 90%;
    }

    .list-logo{
        margin-right: 8px;
    }

    .navigation-logo {
        width: 2.3em;
    }

    .item-content:hover{
        background-color: var(--quaternary-color);
    }

    .item-content.active{
        background : var(--primary-color);
    }

    ul{
        margin: 0;
    }


</style>