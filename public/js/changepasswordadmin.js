import {Formatter,Validator, ErrorHandler, Input, PasswordInput, showLoadingAnimation, showSuccessModal, removeLoadingAnimation,fadeIn, floatIn} from "./form.js";

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
            $.post("/admin/users/change-password/"+user.user_id,{
                password: this.inputs.password.getDom().value,
                user_id: user.user_id,
            },
            (result)=>{
                for (const input in this.inputs){
                    this.inputs[input].getDom().value = "";
                }
                if(result=="Success"){
                    ErrorHandler.removeCurrentMessage(submitButton);
                    removeLoadingAnimation(submitButton,submitButtonText);
                    window.location.href = ("/admin/users");
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
    cpassword: new Input('cpassword'),
}
inputs['password'] = new PasswordInput('password',inputs.cpassword);

signupForm.setInputs(inputs);


inputs.password.addCheck(Validator.conformsLength, {min:8});
inputs.password.addCheck(Validator.hasNumbers);

inputs.cpassword.addCheck(Validator.passwordMatch,{refer:inputs.password.getDom()});
inputs.cpassword.addCheck(Validator.conformsLength,{min:8,max:null});
