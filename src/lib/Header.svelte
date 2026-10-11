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
<Navbar>
    <NavHamburger />
    <NavUl>
        {#if pb.authStore.isValid}
            <NavUl >
                <NavLi href="/dashboard/">Dashboard</NavLi>
                <NavLi href="/login/" onclick={logout}>Log Out</NavLi>
            </NavUl>
        {:else}
            <NavUl >
                <NavLi href="/login/">Log In</NavLi>
                <NavLi href="/signup/">Sign Up</NavLi>
            </NavUl>
        {/if}
    </NavUl>
</Navbar>