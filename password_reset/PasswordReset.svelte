<script>
    import '/src/app.css';
    import PocketBase from 'pocketbase';
    import { Card, Button, Label, Input, Alert } from "flowbite-svelte";
    import Header from '/src/lib/Header.svelte'
    const pb = new PocketBase('https://database.hornethub.xyz')

    let email = $state();
    let alert = $state(false);

    async function submit(event) {
        event.preventDefault();
        await pb.collection('users').requestPasswordReset(email);
        alert = true

    }

    document.documentElement.classList.add('dark');

</script>

<Header />
<main class="card">
    <Card class="p-4 sm:p-6 md:p-8 border">
        <form class="flex flex-col space-y-6" action="/" onsubmit={submit} >
            <h3 class="text-center">Password Reset</h3>
            <Label class="space-y-2">
                <span>Email</span>
                <Input type="email" name="email" placeholder="user@example.com" bind:value={email} />
            </Label>
            <Button class="w-full" type="submit" href="/reset_password/">Reset Password</Button>
        </form>
    </Card>
</main>

{#if alert}
    <Alert color="orange">Please Check Your Email For Your Reset Link</Alert>
{/if}