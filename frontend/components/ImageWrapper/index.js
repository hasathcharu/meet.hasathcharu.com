import React from 'react';
import Image from 'next/image';
export default function ImageWrapper(props){
    if(props.priority===true){
        return(
            <div style={{position:'relative',width:props.width?props.width:'100%',height:props.height?props.height:'100%'}}>
                <Image 
                    
                    src={props.src}
                    alt={props.alt}
                    name={props.name}
                    onLoadingComplete = {props.onLoad}
                    layout="fill"
                    objectFit={props.objectFit}
                    className={props.className}
                    styles={{width:props.width?props.width:'100%',height:props.height?props.height:'100%'}}
                    priority
                />
            </div>
        );
    }
    return(
        <div style={{position:'relative',width:props.width?props.width:'100%',height:props.height?props.height:'100%'}}>
            <Image 
                
                src={props.src}
                alt={props.alt}
                name={props.name}
                onLoadingComplete = {props.onLoad}
                layout="fill"
                objectFit={props.objectFit}
                className={props.className}
                styles={{width:props.width?props.width:'100%',height:props.height?props.height:'100%'}}
            />
        </div>
    );
}