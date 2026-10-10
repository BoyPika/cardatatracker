<script>
	import '/src/app.css';
    import PocketBase from 'pocketbase';
    import {onMount} from 'svelte';

    let oilItems = {};

    const pb = new PocketBase('http://127.0.0.1:8090');
    async function retrieveOilData() {
        try {
            const oilData = await pb.collection('oil').getOne(pb.authStore.record.id);
            console.log(oilData);

            oilItems = oilData.oilChanges;

            console.log(oilItems);

        } catch (e) {
            console.error(e);
        }
    }

    onMount(() => {
        retrieveOilData();
    })

</script>

<table>
{#each Object.entries(oilItems) as [date, item]}
    <tbody>
    <tr><td>Date Changed: {date}</td></tr>
    <tr><td>Mileage at Time of Change: {item.mileage}</td></tr>
    <tr><td>Type of Oil: {item.type}</td></tr>
    <tr><td>Quarts Added: {item.qtrs}</td></tr>
    </tbody>
{/each}
</table>