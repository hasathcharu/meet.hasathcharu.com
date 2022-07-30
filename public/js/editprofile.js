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
            $.post("/user/edit",{
                fname: this.inputs.fname.getDom().value,
                lname: this.inputs.lname.getDom().value,
                email: this.inputs.email.getDom().value,
                user_id: user.user_id,
            },
            (result)=>{
                if(result=="Success"){
                    ErrorHandler.removeCurrentMessage(submitButton);
                    removeLoadingAnimation(submitButton,submitButtonText);
                    showSuccessModal(this.inputs.fname.getDom().value,1);
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
}

signupForm.setInputs(inputs);

inputs.fname.addCheck(Validator.conformsLength,{max:30,min:0});
inputs.fname.addFormat(Formatter.trim);
inputs.fname.addFormat(Formatter.capitalize);

inputs.lname.addCheck(Validator.conformsLength,{max:30,min:0});
inputs.lname.addFormat(Formatter.trim);
inputs.lname.addFormat(Formatter.capitalize);

inputs.email.addCheck(Validator.conformsLength,{max:320,min:0});
inputs.email.addCheck(Validator.validEmail);


