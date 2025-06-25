import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useSelector, useDispatch } from 'react-redux'
import { Snackbar as MuiSnackbar, SnackbarContent } from '@mui/material'
const Snackbar = () => {
  const dispatch = useDispatch()
  const snackbarState = useSelector((state: any) => state.snackbar)
  const handleClose = () => {
    dispatch({ type: 'CLOSE_SNACKBAR' })
  }
  return (
    <MuiSnackbar
      onClose={handleClose}
      autoHideDuration={3000}
      open={snackbarState.open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <SnackbarContent
        sx={{
          backgroundColor: snackbarState.color,
        }}
        message={snackbarState.message}
        action={
          <React.Fragment>
            <CloseIcon onClick={handleClose} />
          </React.Fragment>
        }
      />
    </MuiSnackbar>
  )
}
export default Snackbar
