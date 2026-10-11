<script>
	import '/src/app.css';
    import PocketBase from 'pocketbase';
    import Header from '/src/lib/Header.svelte'
    import {onMount} from 'svelte';

    let oilItems = {};
    let gasItems = {};

    const pb = new PocketBase('http://127.0.0.1:8090');
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

    async function updateGasData() {
        const gasData = await pb.collection('gas').getOne(pb.authStore.record.id);
        const lastMileage = gasData.gasLastMileage
        const date = Math.floor(Date.parse() / 1000)

        let gas = gasData.gas = Object.assign({}, gasData.gas, {
            date: {
                "gallons": 15,
                "lastMileage": lastMileage,
                "mileage": 2500
            }
        })

        let body = {
            gas,
            "gasLastMileage": 2500
        }

        console.log(body);

        await pb.collection('users').update(pb.authStore.record.id, body)
    }

    onMount(() => {
        retrieveData();
    })

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
{#each Object.entries(oilItems) as [date, item]}
    <tbody>
    <tr><td>{new Date(date * 1000).toLocaleDateString()}</td>
    <td>{item.mileage}</td>
    <td>{item.type}</td>
    <td>{item.qtrs}</td></tr>
    </tbody>
{/each}
</table>

<button class="cursor-pointer">Add Oil Change</button>

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
    {#each Object.entries(gasItems) as [date, item]}
        <tbody>
        <tr><td>{new Date(date * 1000).toLocaleDateString()}</td>
            <td>{item.mileage}</td>
            <td>{item.gallons}</td>
            <td>{(((item.mileage)-(item.lastMileage))/(item.lastGallons)).toFixed(2)}</td></tr>
        </tbody>
    {/each}
</table>

<button class="cursor-pointer" on:click={updateGasData}>Add Gas Trip</button>