<script>
    import '/src/app.css';
    import Header from "/src/lib/Header.svelte"
    import PocketBase from 'pocketbase';
    import { onMount } from 'svelte';
    import { Card, Label, Select, Button } from 'flowbite-svelte'

    const pb = new PocketBase('https://database.hornethub.xyz/');

    let distance = $state("");
    let volume = $state("");

    let distanceUnits = [
        { value: "mi", name: "Miles" },
        { value: "km", name: "Kilometers" }
    ];
    let volumeUnites = [
        { value: "ga", name: "Gallons"},
        { value: "lt", name: "Liters/Litres"}
    ]

    async function submit(event) {
        event.preventDefault();
        let km = false;
        let ltrs = false;
        if (distance === "km") {
            km = true;
        }
        if (volume === "lt") {
            ltrs = true;
        }
        let body = {
            km,
            ltrs
        }

        await pb.collection('users').update(pb.authStore.record.id, body);
        window.location.href = '/dashboard/'
    }

    onMount(async () => {
        const kilometer = await pb.collection('kilometers').getOne(pb.authStore.record.id)
        if (!kilometer) {
            distance = "mi"
        }
    })

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
<br>
<main class="card">
    <Card class="p-4 sm:p-6 md:p-8 border">
        <form class="flex flex-col space-y-6" action="/dashboard/" onsubmit={submit}>
            <h3 class="text-center">Settings</h3>
            <Label class="space-y-2">
                <span>Miles or Kilometers?</span>
                <Select class="mt-2" items={distanceUnits} bind:value={distance} required />
            </Label>
            <Label class="space-y-2">
                <span>Gallons or Liters (Litres)?</span>
                <Select class="mt-2" items={volumeUnites} bind:value={volume} required />
            </Label>
            <Button class="w-full" type="submit">Update Settings</Button>
        </form>
    </Card>
</main>