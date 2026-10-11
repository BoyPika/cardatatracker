<script>
	import '/src/app.css';
    import PocketBase from 'pocketbase';
    import Header from '/src/lib/Header.svelte'
    import {onMount} from 'svelte';
    import { Button, Modal, Label, Input, Datepicker } from "flowbite-svelte";

    let oilItems = $state({});
    let gasItems = $state({});
    let oilModal = $state(false);
    let gasModal = $state(false);
    let error = $state("");

    let date = $state(new Date());
    let mileage = $state();
    let type = $state("");
    let qrts = $state();
    let gallons = $state();

    const pb = new PocketBase('https://database.hornethub.xyz/');
    async function retrieveData() {
        try {
            const oilData = await pb.collection('oil').getOne(pb.authStore.record.id);
            const gasData = await pb.collection('gas').getOne(pb.authStore.record.id);
            console.log(oilData);
            console.log(gasData);
            oilItems = oilData.oil;
            gasItems = gasData.gas;
            console.log(oilItems);
            console.log(gasItems);

        } catch (e) {
            console.error(e);
        }
    }

    async function updateGasData(event) {
        event.preventDefault();
        const gasData = await pb.collection('gas').getOne(pb.authStore.record.id);
        const lastMileage = await pb.collection('gasLastMileage').getOne(pb.authStore.record.id);
        const gasDate = Math.floor(Date.now(date) / 1000)
        const mpg = ((mileage - lastMileage.gasLastMileage) / parseFloat(gallons)).toFixed(2);
        console.log(lastMileage.gasLastMileage);
        console.log(gasDate)

        let gas = gasData.gas = Object.assign({}, gasData.gas, {
            [gasDate]: {
                "gallons": parseFloat(gallons),
                "lastMileage": lastMileage.gasLastMileage,
                "mileage": mileage,
                "mpg": parseFloat(mpg)
            }
        })

        let body = {
            gas,
            "gasLastMileage": mileage
        }

        console.log(body);

        await pb.collection('users').update(pb.authStore.record.id, body)
    }

    async function updateOilData(event) {
        event.preventDefault();
        const oilData = await pb.collection('oil').getOne(pb.authStore.record.id);
        const oilDate = Math.floor(Date.parse(date) / 1000)
        console.log(oilDate);

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

        console.log(body);

        await pb.collection('users').update(pb.authStore.record.id, body)
    }

    onMount(() => {
        retrieveData();
        if (!pb.authStore.isValid) {
            window.location.href = "/";
        }
    })

    document.documentElement.classList.add('dark');

</script>

<Header />

<table>
    <thead>
    <tr>
        <th colspan="4">Oil Changes</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th>Date</th>
        <th>Mileage</th>
        <th>Type</th>
        <th>Quarts</th>
    </tr>
    </tbody>
{#each Object.entries(oilItems).reverse() as [date, item]}
    <tbody>
    <tr><td>{new Date(date * 1000).toLocaleDateString()}</td>
    <td>{item.mileage}</td>
    <td>{item.type}</td>
    <td>{item.qtrs}</td></tr>
    </tbody>
{/each}
</table>

<div class="grid place-items-center">
<Button class="cursor-pointer" onclick={() => (oilModal = true)}>Add Oil Change</Button>
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


<br>

<table>
    <thead>
    <tr>
        <th colspan="4">Gas</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <th>Date</th>
        <th>Mileage</th>
        <th>Gallons</th>
        <th>MPG</th>
    </tr>
    </tbody>
    {#each Object.entries(gasItems).reverse() as [date, item]}
        <tbody>
        <tr><td>{new Date(date * 1000).toLocaleDateString()}</td>
            <td>{item.mileage}</td>
            <td>{item.gallons}</td>
            <td>{item.mpg}</td></tr>
        </tbody>
    {/each}
</table>

<div class="grid place-items-center">
    <Button class="cursor-pointer" onclick={() => (gasModal = true)}>Add Gas Trip</Button>
</div>
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