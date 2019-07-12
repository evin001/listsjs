import React from 'react'
import { WithStyles, withStyles } from '@material-ui/styles'

const styles = {
  root: {
    width: '800px',
    margin: '0 auto'
  }
}

interface RootProps extends WithStyles<typeof styles> {}

const Root = ({ classes }: RootProps) => (
	<div className={classes.root}>hello</div>
)

export default withStyles(styles)(Root)
