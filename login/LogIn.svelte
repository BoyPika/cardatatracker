<script>
    import '/src/app.css';
    import PocketBase from 'pocketbase';
    import { Card, Button, Label, Input, Checkbox } from "flowbite-svelte";
    import Header from '/src/lib/Header.svelte'
    const pb = new PocketBase('http://localhost:8090/')
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
</script>
<Header />
<main class="card">
<Card class="p-4 sm:p-6 md:p-8 border">
    <form class="flex flex-col space-y-6" action="/dashboard/">
        <h3 class="text-center">Login</h3>
        <Label class="space-y-2">
            <span>Email</span>
            <Input type="email" name="email" placeholder="user@email.com" />
        </Label>
        <Label class="space-y-2">
            <span>Password</span>
            <Input type="password" name="password" placeholder="•••••" />
        </Label>
        <Button class="text-left">Create Account</Button>
        <Button class="text-right">Forgot Password</Button>
        <Button class="w-full" type="submit">Login</Button>
    </form>
    <button class="w-full" on:click={github}>Login With GitHub</button>
</Card>
    </main>

