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
            $.post("/user/change-password",{
                password: this.inputs.password.getDom().value,
                opassword: this.inputs.opassword.getDom().value,
            },
            (result)=>{
                for (const input in this.inputs){
                    this.inputs[input].getDom().value = "";
                }
                if(result=="Success"){
                    ErrorHandler.removeCurrentMessage(submitButton);
                    removeLoadingAnimation(submitButton,submitButtonText);
                    showSuccessModal(user.fname,1);
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
    opassword: new Input('opassword'),
    cpassword: new Input('cpassword'),
}
inputs['password'] = new PasswordInput('password',inputs.cpassword);

signupForm.setInputs(inputs);

inputs.opassword.addCheck(Validator.conformsLength, {min:8});

inputs.password.addCheck(Validator.conformsLength, {min:8});
inputs.password.addCheck(Validator.hasNumbers);

inputs.cpassword.addCheck(Validator.passwordMatch,{refer:inputs.password.getDom()});
inputs.cpassword.addCheck(Validator.conformsLength,{min:8,max:null});
