<script>
	import '/src/app.css';
    import PocketBase from 'pocketbase';
    import Header from '/src/lib/Header.svelte';
    import { onMount } from 'svelte';
    import { Button, Modal, Label, Input, Datepicker } from "flowbite-svelte";
    import { TrashBinOutline } from "flowbite-svelte-icons";

    let oilItems = $state({});
    let gasItems = $state({});
    let customItems = $state({});

    let oilModal = $state(false);
    let gasModal = $state(false);
    let customModal = $state(false);

    let gallon = $state([]);
    let miles = $state([]);
    let lastIndex = $state(-1);

    let error = $state("");

    let date = $state(new Date());
    let mileage = $state();
    let type = $state("");
    let qrts = $state();
    let gallons = $state();
    let customItem = $state("");
    let customDescription = $state("");

    let distance = $state("");
    let volume = $state("");
    let economy = $state("");
    let quarts = $state("");

    const pb = new PocketBase('https://database.hornethub.xyz/');
    async function retrieveData() {
        try {
            const oilData = await pb.collection('oil').getOne(pb.authStore.record.id);
            const gasData = await pb.collection('gas').getOne(pb.authStore.record.id);
            const customData = await pb.collection('custom').getOne(pb.authStore.record.id);
            const kilometer = await pb.collection('kilometers').getOne(pb.authStore.record.id);
            const liters = await pb.collection('liters').getOne(pb.authStore.record.id);
            const eco = await pb.collection('economy').getOne(pb.authStore.record.id);
            const qrts = await pb.collection('quarts').getOne(pb.authStore.record.id);
            oilItems = oilData.oil;
            gasItems = gasData.gas;
            customItems = customData.custom;
            distance = String(kilometer.km);
            volume = String(liters.ltrs);
            economy = String(eco.eco);
            quarts = String(qrts.volume);
        } catch (e) {
            console.error(e);
        }
    }

    async function updateOilData(event) {
        event.preventDefault();

        const oilData = await pb.collection('oil').getOne(pb.authStore.record.id);
        const oilDate = (Date.parse(date) / 1000);

        let oil = oilData.oil = Object.assign({}, oilData.oil, {
            [oilDate]: {
                "mileage": mileage,
                "qtrs": qrts,
                "type": type
            }
        })

        let body = {
            oil
        }

        await pb.collection('users').update(pb.authStore.record.id, body)

        window.location.reload();
    }

    async function updateGasData(event) {
        event.preventDefault();

        const gasData = await pb.collection('gas').getOne(pb.authStore.record.id);
        const gasDate = (Date.parse(date) / 1000);

        let gas = gasData.gas = Object.assign({}, gasData.gas, {
            [gasDate]: {
                "gallons": parseFloat(gallons),
                "mileage": mileage
            }
        })

        let body = {
            gas
        }

        await pb.collection('users').update(pb.authStore.record.id, body)

        window.location.reload();
    }

    async function updateCustomData(event) {
        event.preventDefault();

        const customData = await pb.collection('custom').getOne(pb.authStore.record.id);
        const customDate = (Date.parse(date) / 1000);

        let custom = customData.custom = Object.assign({}, customData.custom, {
            [customDate]: {
                "item": customItem,
                "description": customDescription,
                "mileage": mileage
            }
        })

        let body = {
            custom
        }

        await pb.collection('users').update(pb.authStore.record.id, body);

        window.location.reload();
    }

    async function deleteOilRow(date) {
        const oilData = await pb.collection('oil').getOne(pb.authStore.record.id)
        delete oilData.oil[date];
        await pb.collection('users').update(pb.authStore.record.id, oilData)
        window.location.reload();
    }

    async function deleteGasRow(date) {
        const gasData = await pb.collection('gas').getOne(pb.authStore.record.id)
        delete gasData.gas[date];
        await pb.collection('users').update(pb.authStore.record.id, gasData)
        window.location.reload();
    }

    async function deleteCustomRow(date) {
        const customData = await pb.collection('custom').getOne(pb.authStore.record.id)
        delete customData.custom[date];
        await pb.collection('users').update(pb.authStore.record.id, customData)
        window.location.reload();
    }

    onMount(async () => {
        if (!pb.authStore.isValid) {
            window.location.href = "/";
        }
        await retrieveData();
        const gasData = await pb.collection('gas').getOne(pb.authStore.record.id)
        for (const [date, item] of Object.entries(gasData.gas).reverse()){
            gallon.push(item.gallons)
            miles.push(item.mileage)
            lastIndex++
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
<table>
    <thead>
        <tr>
            <th colspan="5">Oil Changes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>Date</th>
            {#if distance === "0"}
                <th>Mileage</th>
            {:else if distance === "1"}
                <th>Kilometers</th>
            {/if}
            <th>Type</th>
            {#if quarts === "0"}
                <th>Quarts</th>
            {:else if quarts === "1"}
                <th>Liters</th>
            {/if}
            <th></th>
        </tr>
    </tbody>
{#each Object.entries(oilItems).reverse() as [date, item]}
    <tbody>
        <tr>
            <td>{new Date(date * 1000).toLocaleDateString()}</td>
            <td>{item.mileage}</td>
            <td>{item.type}</td>
            <td>{item.qtrs}</td>
            <td onclick={() => deleteOilRow(date)}><TrashBinOutline class="delete"/></td>
        </tr>
    </tbody>
{/each}
</table>

<div class="grid place-items-center">
<Button class="cursor-pointer" onclick={() => (oilModal = true)}>Add Oil Change</Button>
</div>

<br>

<table>
    <thead>
        <tr>
            <th colspan="5">Gas</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>Date</th>
            {#if distance === "0"}
                <th>Mileage</th>
            {:else if distance === "1"}
                <th>Kilometers</th>
            {/if}
            {#if volume === "0"}
                <th>Gallons</th>
            {:else if volume === "1"}
                <th>Liters</th>
            {/if}
            {#if distance ==="0"}
                {#if volume === "0"}
                    {#if economy === "0"}
                        <th>MPG</th>
                    {:else if economy === "1"}
                        <th>gal/100mi</th>
                    {/if}
                {:else if volume === "1"}
                    {#if economy === "0"}
                        <th>mi/L</th>
                    {:else if economy === "1"}
                        <th>L/100mi</th>
                    {/if}
                {/if}
            {:else if distance === "1"}
                {#if volume === "0"}
                    {#if economy === "0"}
                        <th>km/gal</th>
                    {:else if economy === "1"}
                        <th>gal/100km</th>
                    {/if}
                {:else if volume === "1"}
                    {#if economy === "0"}
                        <th>km/L</th>
                    {:else if economy === "1"}
                        <th>L/100km</th>
                    {/if}
                {/if}
            {/if}
            <th></th>
        </tr>
    </tbody>
    {#each Object.entries(gasItems).reverse() as [date, item], index}
        <tbody>
            <tr>
                <td>{new Date(date * 1000).toLocaleDateString()}</td>
                <td>{item.mileage}</td>
                <td>{item.gallons}</td>
                <td>{#if index !== lastIndex}
                    {((miles[index]-miles[index+1])/gallon[index+1]).toFixed(2)}
                    {/if}</td>
                <td onclick={() => deleteGasRow(date)}><TrashBinOutline class="delete"/></td>
            </tr>
        </tbody>
    {/each}
</table>

<div class="grid place-items-center">
    <Button class="cursor-pointer" onclick={() => (gasModal = true)}>Add Gas Trip</Button>
</div>

<br>

<table>
    <thead>
        <tr>
            <th colspan="5">Custom Data</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>Date</th>
            <th>Mileage</th>
            <th>Item</th>
            <th>Description</th>
            <th></th>
        </tr>
    </tbody>
    {#each Object.entries(customItems).reverse() as [date, item]}
        <tbody>
            <tr>
                <td>{new Date(date * 1000).toLocaleDateString()}</td>
                <td>{item.mileage}</td>
                <td>{item.item}</td>
                <td>{item.description}</td>
                <td onclick={() => deleteCustomRow(date)}><TrashBinOutline class="delete"/></td>
            </tr>
        </tbody>
    {/each}
</table>

<div class="grid place-items-center">
    <Button class="cursor-pointer" onclick={() => (customModal = true)}>Add Custom Service</Button>
</div>

<Modal title="Submit Oil Change" form bind:open={oilModal}>
    <form onsubmit={updateOilData} id="oilForm" >
        {#if error}
            <Label color="red">{error}</Label>
        {/if}
        <Label class="space-y-2">
            <span>Date</span>
            <Datepicker bind:value={date}/>
        </Label>
        <Label class="space-y-2">
            <span>Mileage</span>
            <Input type="number" name="mileage" bind:value={mileage} required />
        </Label>
        <Label class="space-y-2">
            <span>Oil Type</span>
            <Input type="text" name="type" bind:value={type} required />
        </Label>
        <Label class="space-y-2">
            <span>Quarts</span>
            <Input type="number" name="qrts" bind:value={qrts} required />
        </Label>
        <Button type="submit">Submit</Button>
    </form>
</Modal>

<Modal title="Submit Gas Trip" form bind:open={gasModal}>
    <form onsubmit={updateGasData} id="gasForm" >
        {#if error}
            <Label color="red">{error}</Label>
        {/if}
        <Label class="space-y-2">
            <span>Date</span>
            <Datepicker bind:value={date}/>
        </Label>
        <Label class="space-y-2">
            <span>Mileage</span>
            <Input type="number" name="mileage" bind:value={mileage} required />
        </Label>
        <Label class="space-y-2">
            <span>Gallons</span>
            <Input type="text" name="type" bind:value={gallons} required />
        </Label>
        <Button type="submit">Submit</Button>
    </form>
</Modal>

<Modal title="Submit Custom Data" form bind:open={customModal}>
    <form onsubmit={updateCustomData}>
        {#if error}
            <Label color="red">{error}</Label>
        {/if}
        <Label class="space-y-2">
            <span>Date</span>
            <Datepicker bind:value={date}/>
        </Label>
        <Label class="space-y-2">
            <span>Mileage</span>
            <Input type="number" name="mileage" bind:value={mileage} required />
        </Label>
        <Label class="space-y-2">
            <span>Service Done</span>
            <Input type="text" name="customItem" bind:value={customItem} required />
        </Label>
        <Label class="space-y-2">
            <span>Description of Service Done</span>
            <Input type="text" name="customDescription" bind:value={customDescription} />
        </Label>
        <Button type="submit">Submit</Button>
    </form>
</Modal>