import React from 'react';
import {motion} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import styles from './signup.module.scss';
import Button from '../Button';
import Input from '../Input';
import Modal from '../Modal';
import {useRouter} from 'next/router';
import { isEmail, isEmpty } from 'validator';
export default function LogIn(props){
    const API = process.env.NEXT_PUBLIC_API;
    const router = useRouter();
    const [formData, setFormData] = React.useState(
        {
            email: '',
            password: '',
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
            const res = await fetch('http://localhost:4000/user/sign-up', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            const response = await res.json();
            console.log(response);
            if(response.message==='Success'){
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
                return;
            }
            throw new Error(response.message);
        }
        catch(error){
            console.log(error);
            let err = "Something went wrong :(";
            if(error.message === 'Email Error'){
                err = "This email already exists.";
                setFormData(()=>  ({fname: '',lname: '',email:'',password:'',cpassword:''}));
            }
            setFormState((currentState)=>(
                {
                    ...currentState,
                    sending:false,
                    formError: err,
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
                    placeholder='enter your first name'
                    value= {formData.fname}
                    handleChange={handleChange}
                    error={formState.fnameError}
                />
                <Input 
                    type='text'
                    name='lname'
                    domName='Last Name'
                    placeholder='enter your last name'
                    value= {formData.lname}
                    handleChange={handleChange}
                    error={formState.lnameError}
                />
                <Input 
                    type='email'
                    name='email'
                    domName='Email'
                    placeholder='enter your email'
                    value= {formData.email}
                    handleChange={handleChange}
                    error={formState.emailError}
                />
                <Input 
                    type='password'
                    name='password'
                    domName='Password'
                    placeholder='enter a password'
                    value= {formData.password}
                    handleChange={handleChange}
                    error={formState.passwordError}
                />
                <Input 
                    type='password'
                    name='cpassword'
                    domName='Confirm Password'
                    placeholder='confirm password'
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
                {formState.signUpError===true && <p className={styles.formError}>{formState.formError}</p>}
            </div>
            <Modal open={formState.signedUp} closeModal={closeModal}>
                <Lottie
                    options={successLottie}
                />
                <div className={styles.modalContent}>
                    <h1>Welcome Onboard!</h1>
                    <Button 
                        text="Log in"
                        icon={faRightToBracket}
                        handleLoading={()=>router.push('/log-in')}
                        loading={false}
                        class='default'
                    />
                    <br/>
                    <br/>
                </div>
            </Modal>
        </div>
    );
}