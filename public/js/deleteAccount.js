import {Formatter,Validator, ErrorHandler, Input, PasswordInput, showLoadingAnimation, showSuccessModal, removeLoadingAnimation,fadeIn, floatIn} from "./form.js?version=3";

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
            $.post("/user/delete",{
                password: this.inputs.password.getDom().value,
            },
            (result)=>{
                for (const input in this.inputs){
                    this.inputs[input].getDom().value = "";
                }
                if(result=="Success"){
                    ErrorHandler.removeCurrentMessage(submitButton);
                    removeLoadingAnimation(submitButton,submitButtonText);
                    showSuccessModal(user.fname,2);
                }
                else if(result=="Auth Error"){
                    ErrorHandler.removeCurrentMessage(submitButton);
                    removeLoadingAnimation(submitButton,submitButtonText);
                    ErrorHandler.printErrorForm("Invalid Credentials",submitButton);
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
    password: new Input('password'),
}

signupForm.setInputs(inputs);


inputs.password.addCheck(Validator.conformsLength, {min:8});

