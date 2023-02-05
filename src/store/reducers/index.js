import {combineReducers} from 'redux'

import user from './user'
import chat from './chats'
import messages from './messages'
import chatImages from './chatImages'
import profileImages from './profileImages'
import requests from './requests'
import attachment from './attachment'

const reducers = combineReducers({
    user,
    chat,
    messages,
    chatImages,
    profileImages,
    requests,
    attachment
})

export default reducers