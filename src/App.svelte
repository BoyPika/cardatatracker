<script>
	import './app.css';
    import PocketBase from 'pocketbase';
    const pb = new PocketBase('https://pocketbase-silver-bush-2390.fly.dev/')
    function github() {
        pb.collection('users').authWithOAuth2({
            provider: 'github'
        }).then((authdata) => {
            console.log(authdata);
        })
    }
</script>

<button on:click={github}>sdfsd</button>