<script>
    import { signinUser } from "../firebase";
    import {fireEvent,EVENTS} from "../EventManager";
    import Button from "../utility/Button.svelte";
    import Input from "../utility/Input.svelte";

    let user = {
        email:"",
        name:""
    }

    const handleChange = (e) => {
        user[e.target.name] = e.target.value;
    }

    const onSignIn = () => {
        
        const email = user.email;
        const password = user.password;

        if(email && password){
            fireEvent(EVENTS.SHOW_SPINNER,{});
            signinUser(email,password)
            .then (res => {
                fireEvent(EVENTS.HIDE_SPINNER,{});
            })
            .catch(err => {
                fireEvent(EVENTS.HIDE_SPINNER,{});
            });
        }
    }

</script>

<style>

    .container{
        margin: 0;
        padding: 0;
        height: 100vh;
    }

    .right{
        width: 30%;
        height: 100%;
        background-color: var(--secondary-color);
    }

    .left{
        width: 70%;
        height: 100%;
    }

    .app-header{
        padding: 1.5em 1em;
    }

    .right header{
        padding: 1.5em 1em;
    }

    .app-footer{
        padding: 1.5em 1em;
    }

    .title {
        font-family: normal;
        font-size: 1.75em;
        color: var(--primary-color);
    }

    .sub-title{
        font-size: 1rem;
        color: white;
    }

    .logo {
        width: 8em;
        margin: 0 5px;
    }

    .form-container{
        height: 100vh;
    }

    .form {
        padding: 0 3rem;
        width: 25%;
    }

    .highlight{
        color: var(--secondary-color);
    }

    .home{
        width: 95%;
        height: 95%;
    }

    .form{
        width: 100%;
        height: 100%;
    }

    .sub-container{
        width: 100%;
    }

    .illustration-container{
        height: 80%;
    }
    
    .dev-name{
        padding: 0.25rem 0.5rem;
        background: white;
        border-radius: 5px;
    }

    

</style>

<div class="flex flex-row container">
    
        <div class="left">
            <header class="app-header flex justify-space-between align-center">
                <span class="app-name flex align-center text-bold text-primary">
                    <img class="logo" src="./logo.svg" alt="worklist"/>
                </span>
            </header>
            
            <div class="illustration-container flex justify-center flex-row align-center grow">
                <div class="flex justify-center flex-column align-center tagline-container">
                    <img class="home" src="./login.svg" alt="worklist"/>    
                </div>
            </div>
    
            
        </div>

        <div class="right">
            <div class="form-container flex justify-center flex-column login-form">
                <header class="flex align-center justify-end">
                    <Button label="Donate" type="danger"/>
                </header>
                <div class="sub-container grow flex justify-center flex-row">
                    <div class="form form-right flex justify-center flex-column">
                        <span class="title flex align-center text-bold text-primary">
                            Welcome to worklist
                        </span>
                        <br/>
                        <span class="sub-title flex align-center text-primary">
                            Please sign-in to your account and start the adventure
                        </span>
                        <br/>
                        <br/>
                        <Input data_type="field" name="email" type="email" label="Email" label_class="light" hasLabel onChange={handleChange}/>
                        <br/>
                        <Input data_type="field" name="password" type="password" label="Password" label_class="light" hasLabel onChange={handleChange}/>
                        <br/>
                        <Button onClick={onSignIn} label="Login" type="primary"/>
                    </div>
                </div>
                <footer class="app-footer flex justify-end align-center bg-transparent">
                    <span class="dev-name text-bold highlight text-underline">Made with ❤️ by Suban Khoja</span>
                </footer>
            </div>
           
        </div>
       
</div>