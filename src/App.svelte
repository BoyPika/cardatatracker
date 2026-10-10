<script>
	import './app.css';
    import PocketBase from 'pocketbase';
    const pb = new PocketBase('http://localhost:8090/')
    function github() {
        pb.collection('users').authWithOAuth2({
            provider: 'github'
        }).then((authdata) => {
            console.log(authdata);
            if (authdata.token != null) {
                window.location.href = "/dashboard/";
            }
        })
    }
</script>

<button on:click={github}>sdfsd</button>