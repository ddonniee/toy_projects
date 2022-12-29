import React from "react";
import {Cookie} from 'react-cookie'

const cookies = new Cookie();

export const getCookie = (token) =>{
    return cookies.get(token)
}