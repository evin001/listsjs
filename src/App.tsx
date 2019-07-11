import React from 'react'
import { Hello } from './components/Hello'
import injectSheet from './styles/reset'

const App = () => (
	<Hello compiler='TypeScript' framework='React' />
)

export default injectSheet(App)
