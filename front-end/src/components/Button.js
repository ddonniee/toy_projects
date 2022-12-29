import React from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";
export default function Button(props) {
    const {title, url} = props;
    return(
        <ButtonStyle>
            <div className="buttonWrapper">
                <Link to={url}><label htmlFor="createBtn"><input type="button" className='createBtn' name='createBtn'/>{title}</label></Link>
            </div>
        </ButtonStyle>
    )
}

const ButtonStyle = styled.div`
    .buttonWrapper {
        display: flex;  position: absolute; left: 90%; top: 3%;
    }
    .createBtn {
        display: none;
    }
    label {
        width: 100px; height: 50px; background-color: black; color: white; display:table-cell;  text-align: center; vertical-align:middle; border-radius: 10px;
    }
`