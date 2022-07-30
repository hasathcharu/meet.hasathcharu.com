import {Formatter,Validator, ErrorHandler, Input, PasswordInput, showLoadingAnimation, showSuccessModal, removeLoadingAnimation,fadeIn, floatIn} from "./form.js?version=2";

class Form{
    dom;
    inputs;
    validated = 1;
    constructor(formId){
        this.dom=document.getElementById(formId);
        this.dom.addEventListener("submit",(event)=>{
            event.preventDefault();
            if(!this.validateAll()){
                return false;
            }
            const submitButton = document.getElementById("submit");
            const submitButtonText = submitButton.textContent;
            showLoadingAnimation(submitButton);
            $.post("/user/sign-up",{
                fname: this.inputs.fname.getDom().value,
                lname: this.inputs.lname.getDom().value,
                password: this.inputs.password.getDom().value,
                email: this.inputs.email.getDom().value,
            },
            (result)=>{
                if(result=="Success"){
                    ErrorHandler.removeCurrentMessage(submitButton);
                    removeLoadingAnimation(submitButton,submitButtonText);
                    showSuccessModal(this.inputs.fname.getDom().value);
                }
                else if(result=="Email Error"){
                    ErrorHandler.removeCurrentMessage(submitButton);
                    removeLoadingAnimation(submitButton,submitButtonText);
                    ErrorHandler.printErrorForm("Email already exists",submitButton);
                }
                else{
                    ErrorHandler.removeCurrentMessage(submitButton);
                    removeLoadingAnimation(submitButton,submitButtonText);
                    ErrorHandler.printErrorForm("Something went wrong",submitButton);
                }
            });
            return true;
        });
    }
    setInputs(inputs){
        this.inputs = inputs;
    }
    validateAll(){
        this.validated = 1;
        for(const input in this.inputs){
            this.inputs[input].runChecks();
            this.validated *= this.inputs[input].hasPassed();
        }
        return this.validated;
    }
}


const signupForm=new Form('signup-form');
const inputs = {
    fname: new Input('fname'),
    lname: new Input('lname'),
    email: new Input('email'),
    cpassword: new Input('cpassword'),
}
inputs['password'] = new PasswordInput('password',inputs.cpassword);

signupForm.setInputs(inputs);

inputs.fname.addCheck(Validator.conformsLength,{max:30,min:0});
inputs.fname.addFormat(Formatter.trim);
inputs.fname.addFormat(Formatter.capitalize);

inputs.lname.addCheck(Validator.conformsLength,{max:30,min:0});
inputs.lname.addFormat(Formatter.trim);
inputs.lname.addFormat(Formatter.capitalize);

inputs.email.addCheck(Validator.conformsLength,{max:320,min:0});
inputs.email.addCheck(Validator.validEmail);

inputs.password.addCheck(Validator.conformsLength, {min:8});
inputs.password.addCheck(Validator.hasNumbers);

inputs.cpassword.addCheck(Validator.conformsLength,{min:8,max:null});
inputs.cpassword.addCheck(Validator.passwordMatch,{refer:inputs.password.getDom()});
