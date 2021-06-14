import React from 'react'
import './notifications.css'

export const showErrMsg = (msg) => {
    return <div className="errMsg">{msg}</div>
}

export const showErrMsgElev = (msg) => {
    return <div className="errMsgElev">{msg}</div>
}

export const showSuccessMsg = (msg) => {
    return <div className="successMsg">{msg}</div>
}

export const showSuccessMsgElev = (msg) => {
    return <div className="successMsgElev">{msg}</div>
}
