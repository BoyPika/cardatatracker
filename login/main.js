import { mount } from 'svelte'
import '/src/app.css'
import LogIn from './LogIn.svelte'

const app = mount(LogIn, {
  target: document.getElementById('app'),
})

export default app
