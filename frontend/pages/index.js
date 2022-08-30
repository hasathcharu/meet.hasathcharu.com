import React from 'react';
import Head from 'next/head';
import {useCookies} from 'react-cookie';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;
import Hero from '../components/Hero';
import Header from '../components/Header';
import {motion} from 'framer-motion';

export default function Home() {
    const [cookies,setCookie] = useCookies();
    if(!cookies.theme){
        setCookie('theme','dark',{maxAge: 864000, path: '/'});
    }
    function handleTheme(){
        setCookie('theme',(cookies.theme==='light'? 'dark':'light'),{maxAge: 864000, path: '/'});
    }
    React.useEffect(()=>{
        if(!cookies.theme){
            document.documentElement.className='dark';
        }
        else{
            document.documentElement.className=cookies.theme;
        }
        
    }, [cookies.theme]);
    const inView = {
        hidden:{
            opacity:0,
            y:200
        },
        enter:{
            opacity:1,
            y:0,
            transition:{
                duration:1,
                type:'spring',
            }
        }
    }
    return (
        <div className="App">
            <Head>
                <meta name="theme-color" content="#22cc9d" />
                <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
                <title>Haritha's Meetings</title>
                <meta property="og:title" content="Haritha Hasathcharu" />
                <meta property="og:description" content="Haritha's Meetings Portal" />
                <meta property="og:image" content="https://hasathcharu.com/embed.png" />
                <meta property="og:url" content="https://hasathcharu.com" />
                <meta property="og:type" content="website"/>
                <meta name="description" content="Haritha's Meetings Portal"/> 
            </Head>
            <Header 
                handleTheme={handleTheme}
                theme = {cookies.theme}
            />
            <motion.section                
                className='hero-section' 
            >
                <Hero />
            </motion.section>
            <section className='footer'>
                &copy; Haritha Hasathcharu
            </section>
        </div>
    );
}
