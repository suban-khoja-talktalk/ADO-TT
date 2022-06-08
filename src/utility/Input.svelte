<script>

    export let hasLabel = false;
    export let type;
    export let name;
    export let label;
    export let placeholder;
    export let onChange;
    export let onKeyUp;
    export let value = "";
    export let width_class;
    export let label_class = 'light';
    export let classes;
    export let data_field;
    export let options;
    export let data_type
    export let readOnly;
    export let Required;
</script>

{#if hasLabel}
    <label class="{label_class}" for={name}>{label}{Required ? ' *' : ''}</label>  
{/if}

{#if type === 'select'}
    <select class="column flex grow border-bottom-primary text-primary {classes} {width_class} border-box text-center pointer border-box justify-center status-column" {value} {name} on:change={onChange} data-type={data_type} data-field={data_field} disabled={readOnly}>
        {#each options as status}
            <option value={status} class="option bg-white text-primary">{status}</option>
        {/each}
    </select>
    {:else if type === "text-long"}
        <textarea class="border-primary text-primary border-box bg-white {width_class}" rows="10" on:change={onChange} data-type={data_type} data-field={data_field} {value} readonly={readOnly}></textarea>
    {:else}
        <input class="{classes} border-box {width_class}" {type} {name} on:change={onChange} on:keyup={onKeyUp} {value} {placeholder} data-type={data_type} data-field={data_field} readonly={readOnly}/>
{/if}


<style>

    input{
        padding: 0.5em;
        outline: none;
        border : none;
    }

    label {
        margin-bottom: 0.25rem;
        color: #d0d2d6;
        font-size: .857rem;
    }

    .width-half{
        width: 50%;
    }

    .width-full{
        width: 100%;
    }

    label.dark{
        color: var(--text-primary-color);
    }
    
    label.light{
        color: var(--text-secondary-color);
    }

    input[type="text"]{
        border: none;
        outline: none;
        color: var(--text-secondary-color);
    }

    input[type="date"]{
        border: none;
        outline: none;
        flex-shrink: 0.75;
        color: var(--text-secondary-color);
    }

    ::-webkit-calendar-picker-indicator {
        filter: invert(1);
    }

    select{
        border: none;
        outline: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
        text-overflow: '';
    }

    input[data-type="field"][type="text"]{
        border: 1px solid var(--border-primary-color);
        background-color: var(--secondary-color);
        color : var(--text-tertiary-color);
        border-radius: .357rem;
    }

    input[data-type="field"][type="email"]{
        border: 1px solid var(--border-primary-color);
        background-color: var(--secondary-color);
        color : var(--text-tertiary-color);
        border-radius: .357rem;
    }

    input[data-type="field"][type="password"]{
        border: 1px solid var(--border-primary-color);
        background-color: var(--secondary-color);
        color : var(--text-tertiary-color);
        border-radius: .357rem;
    }

    input[data-type="field"][type="date"]{
        border: 1px solid var(--border-primary-color);
        background-color: var(--secondary-color);
        color : var(--text-tertiary-color);
        border-radius: .357rem;
    }

    textarea[data-type="field"]{
        border: 1px solid var(--border-primary-color);
        background-color: var(--secondary-color);
        color : var(--text-tertiary-color);
        border-radius: .357rem;
    }

    select[data-type="field"]{
        border-radius: .357rem;
    }

    select:disabled {
        opacity: 1;
    }

    input:-internal-autofill-selected {
        border: 1px solid var(--border-primary-color) !important;
        background-color: var(--secondary-color) !important;
        color : var(--text-tertiary-color) !important;
        border-radius: .357rem !important;
    }

    label.has-error{
        color: #ea5455 !important;
    }

    input.has-error{
        background-color: #ea545520 !important;
        border-color: #ea5455 !important;
    }

</style>