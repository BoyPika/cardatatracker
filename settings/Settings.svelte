<script>
    import '/src/app.css';
    import Header from "/src/lib/Header.svelte"
    import PocketBase from 'pocketbase';
    import { onMount } from 'svelte';
    import { Card, Label, Radio, Button } from 'flowbite-svelte'

    const pb = new PocketBase('https://database.hornethub.xyz/');

    let distance = $state("");
    let volume = $state("");
    let economy = $state("");
    let quarts = $state("");

    async function submit(event) {
        event.preventDefault();
        let body = {
            "km": Number(distance),
            "ltrs": Number(volume),
            "eco": Number(economy),
            "volume": Number(quarts)
        }

        await pb.collection('users').update(pb.authStore.record.id, body);
        window.location.href = '/dashboard/'
    }

    onMount(async () => {
        const kilometer = await pb.collection('kilometers').getOne(pb.authStore.record.id)
        const liters = await pb.collection('liters').getOne(pb.authStore.record.id);
        const eco = await pb.collection('economy').getOne(pb.authStore.record.id);
        const qrts = await pb.collection('quarts').getOne(pb.authStore.record.id);
        distance = String(kilometer.km);
        volume = String(liters.ltrs)
        economy = String(eco.eco)
        quarts = String(qrts.volume)
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
                <span>How would you prefer to measure oil quantity?</span>
                <Radio value="0" bind:group={quarts}>Quarts</Radio>
                <Radio value="1" bind:group={quarts}>Liters</Radio>
            </Label>
            <Label class="space-y-2">
                <span>What unit of distance do you prefer?</span>
                <Radio value="0" bind:group={distance}>Miles</Radio>
                <Radio value="1" bind:group={distance}>Kilometers</Radio>
            </Label>
            <Label class="space-y-2">
                <span>What unit of volume do you prefer?</span>
                <Radio value="0" bind:group={volume}>Gallons</Radio>
                <Radio value="1" bind:group={volume}>Liters</Radio>
            </Label>
            {#if volume === "1" && distance === "1"}
                <Label class="space-y-2">
                    <span>How do you want fuel economy measured?</span>
                    <Radio value="0" bind:group={economy}>Kilometers per Liter (km/L)</Radio>
                    <Radio value="1" bind:group={economy}>Liters per 100 Kilometers (L/100km)</Radio>
                </Label>
            {:else if volume === "0" && distance === "1"}
                <Label class="space-y-2">
                    <span>How do you want fuel economy measured?</span>
                    <Radio value="0" bind:group={economy}>Kilometers per Gallon (km/gal)</Radio>
                    <Radio value="1" bind:group={economy}>Gallons per 100 Kilometers (gal/100km)</Radio>
                </Label>
            {:else if volume === "1" && distance === "0"}
                <Label class="space-y-2">
                    <span>How do you want fuel economy measured?</span>
                    <Radio value="0" bind:group={economy}>Miles per Liter (mi/L)</Radio>
                    <Radio value="1" bind:group={economy}>Liters per 100 Miles (L/100mi)</Radio>
                </Label>
            {:else if volume === "0" && distance === "0"}
                <Label class="space-y-2">
                    <span>How do you want fuel economy measured?</span>
                    <Radio value="0" bind:group={economy}>Miles per Gallon (mpg)</Radio>
                    <Radio value="1" bind:group={economy}>Gallons per 100 Miles (gal/100mi)</Radio>
                </Label>
            {/if}
            <Button class="w-full" type="submit">Update Settings</Button>
        </form>
    </Card>
</main>