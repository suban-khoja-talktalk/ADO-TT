<script>
	import { AUTH } from "./firebase";
	import LoginPage from "./Pages/LoginPage.svelte";
	import AppPage from "./Pages/AppPage.svelte";
	import GeneralTasksPage from "./Pages/GeneralTasksPage.svelte";
	import Navigation from "./Navigation.svelte";
	import AllTasksPage from "./Pages/AllTasksPage.svelte";
	import AllComponentsPage from "./Pages/AllComponentsPage.svelte";
	import LoadSpinner from "./utility/LoadSpinner.svelte";
	import ProcessSpinner from "./utility/ProcessSpinner.svelte";
    import {registerListener , unregisterListener, fireEvent, EVENTS} from './EventManager';
	import { onDestroy, onMount } from "svelte";

	let currentUser;
	let isProcessing = false;
	let showInitLoad = true;
	let view;
	let all_tasks = [];
	let all_components = [];

	const showSpinner = () =>  {
    	isProcessing = true;
		isProcessing = isProcessing;
	}

	const hideSpinner = () =>  {
    	isProcessing = false;
		isProcessing = isProcessing;
	}

	AUTH.onAuthStateChanged((user) => {
		if (user && user.uid) {
			currentUser = user;
		} else {
			currentUser = null;
		}
		setTimeout(() => {
			showInitLoad = false;
		}, 500);
	});

	const getViewType = () => {
		if(!window.localStorage.getItem('WORKLIST')){
			let WORKLIST = {
				view : "LISTS"
			}
			window.localStorage.setItem('WORKLIST',JSON.stringify(WORKLIST));
		}

		let WORKLIST = JSON.parse(window.localStorage.getItem('WORKLIST'));
		return WORKLIST.view;
	}

	const getNewViewData = (_view) => {
		fireEvent(EVENTS.GET_VIEW_DATA,{
			new_view : _view,
			current_view : view
		});
	}

	const changeView = (_data) => {
		if(_data.view === "ALLTASKS"){
			all_tasks = _data.data;
			all_components = [];
		}else if(_data.view === "ALLCOMPONENTS"){
			all_tasks = [];
			all_components = _data.data;
		}
		view = _data.view;
	}

	onMount(() => {
		registerListener(EVENTS.SHOW_SPINNER,showSpinner);
		registerListener(EVENTS.HIDE_SPINNER,hideSpinner);
		registerListener(EVENTS.SELECT_VIEW,getNewViewData);
		registerListener(EVENTS.SEND_VIEW_DATA,changeView);
		view = getViewType();
	});

	onDestroy ( () => {
		unregisterListener(EVENTS.SHOW_SPINNER,showSpinner);
		unregisterListener(EVENTS.HIDE_SPINNER,hideSpinner);
		/* **** */
		// unregisterListener(EVENTS.SELECT_VIEW,getNewViewData);
		// unregisterListener(EVENTS.SEND_VIEW_DATA,changeView);
	})

</script>

<main>
	<ProcessSpinner show={isProcessing}/>
	<LoadSpinner show={showInitLoad}/>
	
	{#if !showInitLoad}
		{#if currentUser}
			<Navigation currentView={view}/>
			{#if view == "ALLTASKS"}	
				<AllTasksPage tasks={all_tasks}/>
				{:else if view == "ALLCOMPONENTS"}
				<AllComponentsPage components={all_components}/>
				{:else if view == "GENERALTASKS"}
				<GeneralTasksPage />
				{:else}
				<AppPage/>
			{/if}
			{:else}
			<LoginPage />
		{/if}
	{/if}
</main>
