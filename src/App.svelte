<script>
	import './app.css';
    import PocketBase from 'pocketbase';
    import { Card, Button, Label, Input, Checkbox } from "flowbite-svelte";
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

<Card class="p-4 sm:p-6 md:p-8">
    <form class="flex flex-col space-y-6" action="/dashboard/">
        <h3>Login</h3>
        <Label class="space-y-2">
            <span>Email</span>
            <Input type="email" name="email" placeholder="user@email.com" required />
        </Label>
        <Label class="space-y-2">
            <span>Password</span>
            <Input type="password" name="password" placeholder="•••••" required />
        </Label>
        <Button class="w-full" type="submit">Login</Button>
        <button class="w-full" on:click={github}>Login With GitHub</button>
    </form>
</Card>

