<script>
	import '/src/app.css';
    import PocketBase from 'pocketbase';
    const pb = new PocketBase('https://database.hornethub.xyz/');
    import {Button, Card, Input, Label, Alert} from "flowbite-svelte";
    import Header from '/src/lib/Header.svelte'

    let email = $state();
    let password = $state();
    let alertStatus = $state(false);
    let error = $state("");

    function submit(event) {
        event.preventDefault();
        if (password.length < 8) {
            alertStatus = true
            error = "Password must be at least 8 characters";
        } else {
            signup()
        }
    }

    function closeAlert() {
        alertStatus = false
    }

    async function signup() {
        let body = "{\"email\": \"" + email + "\", \"emailVisibility\": false, \"password\": \"" + password +"\",\"passwordConfirm\": \"" + password + "\"}";
        console.log(body);

        await pb.collection('users').create(body)
        await pb.collection('users').authWithPassword(email, password);
        if (pb.authStore.isValid) {
            window.location.href = "/dashboard/";
        }
    }

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
        <form class="flex flex-col space-y-6" action="/dashboard/" onsubmit={submit}>
            <h3 class="text-center">Sign Up</h3>
            <Label class="space-y-2">
                <span>Email</span>
                <Input type="email" name="email" placeholder="user@email.com" bind:value={email} />
            </Label>
            <Label class="space-y-2">
                <span>Password</span>
                <Input type="password" name="password" placeholder="•••••" bind:value={password} />
            </Label>
            <Button class="w-full" type="submit">Login</Button>
        </form>
        <br>
        <Button class="w-full" onclick={github}>Sign Up With GitHub</Button>
    </Card>
    <Alert color="red" dismissable onclick={closeAlert} bind:alertStatus>{error}</Alert>
</main>