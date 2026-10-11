import { mount } from 'svelte'
import '/src/app.css'
import SignUp from './SignUp.svelte'

const app = mount(SignUp, {
  target: document.getElementById('app'),
})

export default app
