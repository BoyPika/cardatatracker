<script>
	import '/src/app.css';
    import PocketBase from 'pocketbase';
    import Header from '/src/lib/Header.svelte';
    import { onMount } from 'svelte';
    import { Button, Modal, Label, Input, Datepicker, Accordion, AccordionItem } from "flowbite-svelte";
    import { TrashBinOutline } from "flowbite-svelte-icons";

    let oilItems = $state({});
    let gasItems = $state({});
    let customItems = $state({});

    let oilModal = $state(false);
    let gasModal = $state(false);
    let customModal = $state(false);
    let addCarModal = $state(false);

    let carGallons = $state([[]]);
    let carMiles = $state([[]]);
    let carsData = $state([]);
    let lastIndex = $state(-1);

    let error = $state("");

    let date = $state(new Date());
    let mileage = $state();
    let type = $state("");
    let qrts = $state();
    let gallons = $state();
    let customItem = $state("");
    let customDescription = $state("");
    let carNickname = $state("");
    let activeCar = $state(0);

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
            const car = await pb.collection('cars').getOne(pb.authStore.record.id);
            oilItems = oilData.oil;
            gasItems = gasData.gas;
            customItems = customData.custom;
            distance = String(kilometer.km);
            volume = String(liters.ltrs);
            economy = String(eco.eco);
            quarts = String(qrts.volume);
            carsData = car.cars;
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
                "type": type,
                "car": activeCar
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
                "mileage": mileage,
                "car": activeCar
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
                "mileage": mileage,
                "car": activeCar
            }
        })

        let body = {
            custom
        }

        await pb.collection('users').update(pb.authStore.record.id, body);

        window.location.reload();
    }

    async function updateCarData(event) {
        event.preventDefault();

        const carData = await pb.collection('cars').getOne(pb.authStore.record.id);
        const carDate = Math.floor(Date.now()/1000)

        console.log(carData);

        let cars = carData.cars = Object.assign({}, carData.cars, {
            [carDate]: {
                "nickname": carNickname
            }
        })

        let body = {
            cars
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

    async function deleteCar(index) {
        const carData = await pb.collection('cars').getOne(pb.authStore.record.id);
        delete carData.cars[index];
        await pb.collection('users').update(pb.authStore.record.id, carData)
        window.location.reload();
    }

    function getCarGasEntries(index) {
        return Object.entries(gasItems)
            .filter(([_, gasItem]) => String(gasItem.car) === String(index))
            .sort((a, b) => b[0] - a[0]);
    }

    onMount(async () => {
        if (!pb.authStore.isValid) {
            window.location.href = "/";
        }
        await retrieveData();
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

<Accordion>
    {#each Object.entries(carsData) as [index, item]}
        {#if true}
            <AccordionItem>
                {#snippet header()}{item.nickname}{/snippet}
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
                        {#if String(item.car) === index}
                            <tbody>
                            <tr>
                                <td>{new Date(date * 1000).toLocaleDateString()}</td>
                                <td>{Number(item.mileage).toLocaleString()}</td>
                                <td>{item.type}</td>
                                <td>{item.qtrs.toLocaleString()}</td>
                                <td onclick={() => deleteOilRow(date)}><TrashBinOutline class="delete"/></td>
                            </tr>
                            </tbody>
                        {/if}
                    {/each}
                </table>

                <div class="grid place-items-center">
                    <Button class="cursor-pointer" onclick={() => {
                        (oilModal = true)
                        activeCar = index
                    }}>Add Oil Change</Button>
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
                    {#each getCarGasEntries(index) as [date, item], gasIndex}
                        {@const carGasEntries = getCarGasEntries(index)}
                        {#if String(item.car) === index}
                            <tbody>
                            <tr>
                                <td>{new Date(date * 1000).toLocaleDateString()}</td>
                                <td>{Number(item.mileage).toLocaleString()}</td>
                                <td>{Number(item.gallons).toLocaleString()}</td>
                                <td>
                                    {#if gasIndex < carGasEntries.length - 1}
                                        {@const prevItem = carGasEntries[gasIndex + 1][1]}
                                        {@const milesDiff = item.mileage - prevItem.mileage}
                                        {#if milesDiff > 0}
                                            {#if economy === "0"}
                                                {(milesDiff / prevItem.gallons).toFixed(2)}
                                            {:else}
                                                {((prevItem.gallons / milesDiff) * 100).toFixed(2)}
                                            {/if}
                                        {/if}
                                    {/if}
                                </td>
                                <td onclick={() => deleteGasRow(date)}><TrashBinOutline class="delete"/></td>
                            </tr>
                            </tbody>
                        {/if}
                    {/each}
                </table>

                <div class="grid place-items-center">
                    <Button class="cursor-pointer" onclick={() => {
                        (gasModal = true)
                        activeCar = index
                    }}>Add Gas Trip</Button>
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
                        {#if distance === "0"}
                            <th>Mileage</th>
                        {:else if distance === "1"}
                            <th>Kilometers</th>
                        {/if}
                        <th>Item</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                    </tbody>
                    {#each Object.entries(customItems).reverse() as [date, item]}
                        {#if String(item.car) === index}
                            <tbody>
                            <tr>
                                <td>{new Date(date * 1000).toLocaleDateString()}</td>
                                <td>{Number(item.mileage).toLocaleString()}</td>
                                <td>{item.item}</td>
                                <td>{item.description}</td>
                                <td onclick={() => deleteCustomRow(date)}><TrashBinOutline class="delete"/></td>
                            </tr>
                            </tbody>
                        {/if}
                    {/each}
                </table>

                <div class="grid place-items-center">
                    <Button class="cursor-pointer" onclick={() => {
                        (customModal = true)
                        activeCar = index
                    }}>Add Custom Service</Button>
                </div>
                <br>
                <br>
                <dir class="grid place-items-center">
                <Button class="cursor-pointer" onclick={() => (deleteCar(index))}>Delete Car (THIS IS IRREVERSIBLE)</Button>
                </dir>
            </AccordionItem>
        {/if}
    {/each}
</Accordion>

<br>

<div class="grid place-items-center">
    <Button class="cursor-pointer" onclick={() => (addCarModal = true)}>Add a Car</Button>
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
            {#if distance === "0"}
                <span>Mileage</span>
            {:else if distance === "1"}
                <span>Kilometers</span>
            {/if}
            <Input type="number" name="mileage" bind:value={mileage} required />
        </Label>
        <Label class="space-y-2">
            <span>Oil Type</span>
            <Input type="text" name="type" bind:value={type} required />
        </Label>
        <Label class="space-y-2">
            {#if quarts === "0"}
                <span>Quarts</span>
            {:else if quarts === "1"}
                <span>Liters</span>
            {/if}
            <Input type="number" name="qrts" bind:value={qrts} required />
        </Label>
        <br>
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
            {#if distance === "0"}
                <span>Mileage</span>
            {:else if distance === "1"}
                <span>Kilometers</span>
            {/if}
            <Input type="number" name="mileage" bind:value={mileage} required />
        </Label>
        <Label class="space-y-2">
            {#if volume === "0"}
                <span>Gallons</span>
            {:else if volume === "1"}
                <span>Liters</span>
            {/if}
            <Input type="text" name="type" bind:value={gallons} required />
        </Label>
        <br>
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
            {#if distance === "0"}
                <span>Mileage</span>
            {:else if distance === "1"}
                <span>Kilometers</span>
            {/if}
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
        <br>
        <Button type="submit">Submit</Button>
    </form>
</Modal>

<Modal title="Add Car" form bind:open={addCarModal}>
    <form onsubmit={updateCarData}>
        {#if error}
            <Label color="red">{error}</Label>
        {/if}
        <Label class="space-y-2">
            <span>Car Name</span>
            <Input type="text" name="carNickname" bind:value={carNickname} required />
        </Label>
        <br>
        <Button type="submit">Submit</Button>
    </form>
</Modal>