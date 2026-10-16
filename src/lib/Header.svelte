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
<div class="grid place-items-center">
<Navbar class="navbar">
    <NavHamburger />
    <NavUl>
        {#if pb.authStore.isValid}
            <NavUl >
                {#if window.location.pathname !== "/dashboard/"}
                    <NavLi href="/dashboard/" class="header">Dashboard</NavLi>
                {/if}
                <NavLi href="/" onclick={logout} class="header">Log Out</NavLi>
            </NavUl>
        {:else}
            <NavUl >
                <NavLi href="/" class="header">Log In</NavLi>
                <NavLi href="/signup/" class="header">Sign Up</NavLi>
            </NavUl>
        {/if}
    </NavUl>
</Navbar>
</div>