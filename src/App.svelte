<script>
	import './app.css';
    import PocketBase from 'pocketbase';
    import { Card, Button, Label, Input, Checkbox } from "flowbite-svelte";
    import Header from './lib/Header.svelte'
    const pb = new PocketBase('https://database.hornethub.xyz/')

    let email = $state();
    let password = $state();

    function github() {
        pb.collection('users').authWithOAuth2({
            provider: 'github'
        }).then((authdata) => {
            console.log(authdata);
            if (authdata.token != null) {
                window.location.href = "/dashboard/";
            }
        })
    }

    async function submit(event) {
        event.preventDefault();
        await pb.collection('users').authWithPassword(email, password);
        if (pb.authStore.isValid) {
            window.location.href = "/dashboard/";
        }
    }

    function forgotPassword() {
        window.location.href = "/password_reset/";
    }

    if (
        localStorage.getItem('color-theme') === 'dark' ||
        (!('color-theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

</script>
<Header />
<main class="card">
<Card class="p-4 sm:p-6 md:p-8 border">
    <form class="flex flex-col space-y-6" action="/dashboard/" onsubmit={submit} >
        <h3 class="text-center">Login</h3>
        <Label class="space-y-2">
            <span>Email</span>
            <Input type="email" name="email" placeholder="user@email.com" bind:value={email} />
        </Label>
        <Label class="space-y-2">
            <span>Password</span>
            <Input type="password" name="password" placeholder="•••••" bind:value={password} />
        </Label>
        <Button class="text-right" onclick={forgotPassword}>Forgot Password</Button>
        <Button class="w-full" type="submit">Login</Button>
    </form>
    <br>
    <Button class="w-full" onclick={github}>Login With GitHub</Button>
</Card>
    </main>

