import { useState, useEffect, ChangeEvent, FormEvent, MouseEvent } from 'react';
import { NavLink, Outlet } from 'react-router-dom'
import '../styles/3.1_Assets_Detail.css'

import { mockAssets } from '../assets/mockAssets'

function AssetsDetail() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [asset, setAsset] = useState(mockAssets[0]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        /*axios.post(
                "https://api.imgflip.com/caption_image",
                {
                    form: {
                        template_id: '181913649',
                        username: 'USERNAME',
                        password: 'PASSWORD',
                        text0: 'text0',
                        text1: 'text1',
                    },
                }
            )
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });*/
        setUsername('');
        setPassword('');
    }

    function handleChangeUsername(event: ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
    }
  
    function handleChangePassword(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    return (
        <>
        <div id='asset-container'>
            <div className='header'>
                <div> 
                    <span className='title'>{asset.name}</span>
                    <span>by <NavLink to='/user/1'>TD_USER</NavLink></span>
                </div>
                <span className='licence'>{asset.licence}</span>
            </div>
            <br/>
            <div className='description'>
                <span>TD_LONGDESCRIPTION</span>
            </div>
            <br/>
            <div className='description'>
                <span><span className='kokans'>{asset.kokans}</span> TD_VALUE</span>
            </div>
            <br/>
            <span>Created: TD_DATE</span>
            <br/>
            <br/>
            <span>Tags: {asset.type.map(item => <span className='tag'>{item}</span>)}</span>
        </div>
        </>
    )
  }
  
  export default AssetsDetail
  