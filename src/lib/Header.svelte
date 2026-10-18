<script>
    import {Navbar, NavLi, NavHamburger, NavUl, NavBrand } from 'flowbite-svelte';
    import PocketBase from "pocketbase";
    const pb = new PocketBase('http://localhost:8090/');
    async function logout() {
        pb.authStore.clear()
        window.location.assign("/");
        console.log(pb.authStore.isValid.valueOf())
    }
</script>

<div class="relative px-8">
    <Navbar class="sticky inset-s-0 top-0 z-20 w-full px-2 py-2.5 sm:px-4 navbar">
        <NavBrand href="/">
            <img src="/favicon.svg" class="me-3 h-6 sm:h-9" alt="Car Icon" />
            <span class="self-center text-xl font-semibold whitespace-nowrap">Car Data Logger</span>
        </NavBrand>
        <NavHamburger />
        {#if pb.authStore.isValid}
            <NavUl >
                {#if window.location.pathname !== "/dashboard/"}
                    <NavLi href="/dashboard/" class="header">Dashboard</NavLi>
                {/if}
                {#if window.location.pathname !== "/settings/"}
                    <NavLi href="/settings/" class="header">Settings</NavLi>
                {/if}
                <NavLi href="/" onclick={logout} class="header">Log Out</NavLi>
            </NavUl>
        {:else}
            <NavUl >
                <NavLi href="/" class="header">Log In</NavLi>
                <NavLi href="/signup/" class="header">Sign Up</NavLi>
            </NavUl>
        {/if}
    </Navbar>
</div>