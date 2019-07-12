import React, { Fragment } from 'react'
import Button from '@material-ui/core/Button'

export interface HelloProps {
  compiler: string
  framework: string
}

export const Hello = (props: HelloProps) => (
	<Fragment>
		<h1>Hello from {props.compiler} and {props.framework}!</h1>
    <Button variant='contained' color='primary'>
      Primary
    </Button>
	</Fragment>
)
