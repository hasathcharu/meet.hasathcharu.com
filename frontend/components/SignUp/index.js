import React from 'react';
import {motion} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './signup.module.scss';
import Button from '../Button';
import Input from '../Input';
import { isEmail, isEmpty, isLength, matches } from 'validator';
export default function SignUp(props){
    const [formData, setFormData] = React.useState(
        {
            fname: '',
            lname: '',
            email: '',
            password: '',
            cpassword: '',
        }
    );
    const [formState, setFormState] = React.useState(
        {
            sending:false,
            fnameError: '',
            lnameError: '',
            emailError:'',
            passwordError:'',
            cpasswordError:'',
            formError: '',
            signUpError: false,
            signedUp: false,
        }
    );
    async function handleSending(){
        setFormState((currentState)=>(
            {
                ...currentState,
                sending:true, 
                fnameError: '',
                lnameError: '',
                emailError:'',
                passwordError:'',
                cpasswordError:'',
                formError: '',
                signUpError: false,
            }));
        let invalid = 0;
        if(!isLength(formData.fname.trim(),{min:0,max:30})){
            setFormState((currentState)=>({...currentState, fnameError:'Shouldn\'t be more than 30 characters.'}));
            invalid = 1;
        }
        if(isEmpty(formData.fname.trim())){
            setFormState((currentState)=>({...currentState, fnameError:'First name cannot be empty'}));
            invalid = 1;
        }
        if(!isLength(formData.lname.trim(),{min:0,max:30})){
            setFormState((currentState)=>({...currentState, lnameError:'Shouldn\'t be more than 30 characters.'}));
            invalid = 1;
        }
        if(isEmpty(formData.lname.trim())){
            setFormState((currentState)=>({...currentState, lnameError:'Last name cannot be empty'}));
            invalid = 1;
        }
        if(!isEmail(formData.email.trim())){
            setFormState((currentState)=>({...currentState, emailError:'Invalid email'}));
            invalid = 1;
        }
        if(isEmpty(formData.email.trim())){
            setFormState((currentState)=>({...currentState, emailError:'Email cannot be empty'}));
            invalid = 1;
        }
        if(!matches(formData.password.trim(),/\d/)){
            setFormState((currentState)=>({...currentState, passwordError:'Should contain at least one number'}));
            invalid = 1;
        }
        if(!isLength(formData.password.trim(),{min:8})){
            setFormState((currentState)=>({...currentState, passwordError:'Should be more than 8 characters'}));
            invalid = 1;
        }
        if(isEmpty(formData.password.trim())){
            setFormState((currentState)=>({...currentState, passwordError:'Password cannot be empty'}));
            invalid = 1;
        }
        if(formData.password.trim()!==formData.cpassword.trim()){
            setFormState((currentState)=>({...currentState, cpasswordError:'Passwords do not match'}));
            invalid = 1;
        }
        if(isEmpty(formData.cpassword.trim())){
            setFormState((currentState)=>({...currentState, cpasswordError:'Password cannot be empty'}));
            invalid = 1;
        }
        if(invalid){
            setFormState((currentState)=>({...currentState,sending:false,}));
            return;
        }
        try{
            const data = {
                'fname': formData.fname.trim(),
                'lname': formData.lname.trim(),
                'email': formData.email.trim(),
                'password': formData.password.trim(),
            }
            const res = await fetch('/user/sign-up', 
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            const response = await res.text();
            if(response==='Success'){
                setFormState((currentState)=>(
                    {
                        ...currentState,
                        sending:false,
                        formError: '', 
                        signUpError: false,
                        signedUp:true,
                    }
                ));
                setFormData(()=>  ({fname: '',lname: '',email:'',password:'',cpassword:''}));
                setTimeout(()=>{
                    setFormState((currentState)=>({...currentState, signedUp:false }));
                },3000);
                return;
            }else{
                throw new Error('Fail');
            }
        }
        catch(error){
            setFormState((currentState)=>(
                {
                    ...currentState,
                    sending:false,
                    formError: 'Something went wrong :(',
                    signUpError: true,
                    signedUp:false }
                ));
        };
    }
    function handleChange(e){
        const {name,value} = e.target;
        setFormData(prevFormData=>{
            return {
                ...prevFormData,
                [name]:value
            }
        })
    }
    return(
        <div className={styles.signUp}>
            <h1>Sign Up</h1>
            <div className={styles.signUpArea}>
                <Input 
                    type='text'
                    name='fname'
                    domName='First Name'
                    placeholder='Enter your first name'
                    value= {formData.fname}
                    handleChange={handleChange}
                    error={formState.fnameError}
                />
                <Input 
                    type='text'
                    name='lname'
                    domName='Last Name'
                    placeholder='Enter your last name'
                    value= {formData.lname}
                    handleChange={handleChange}
                    error={formState.lnameError}
                />
                <Input 
                    type='email'
                    name='email'
                    domName='Email'
                    placeholder='Enter your email'
                    value= {formData.email}
                    handleChange={handleChange}
                    error={formState.emailError}
                />
                <Input 
                    type='password'
                    name='password'
                    domName='Password'
                    placeholder='Enter a password'
                    value= {formData.password}
                    handleChange={handleChange}
                    error={formState.passwordError}
                />
                <Input 
                    type='password'
                    name='cpassword'
                    domName='Confirm Password'
                    placeholder='Confirm password'
                    value= {formData.cpassword}
                    handleChange={handleChange}
                    error={formState.cpasswordError}
                />
                <br/>
                <Button
                    icon={faUserPlus}
                    class='default'
                    text='Sign Up'
                    loading={formState.sending}
                    handleLoading = {handleSending}
                />
                {formState.sendError===true && <p className={styles.formError}>{formState.formError}</p>}
                {formState.sendError===false && formState.sent===true && <p className={styles.formMessage}>It's sent!</p>}
            </div>
        </div>
    );
}