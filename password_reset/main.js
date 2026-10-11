import { mount } from 'svelte'
import '/src/app.css'
import PasswordReset from './PasswordReset.svelte'

const app = mount(PasswordReset, {
    target: document.getElementById('app'),
})

export default app