import {Formatter,Validator, ErrorHandler, Input, PasswordInput, showLoadingAnimation, showSuccessModal, removeLoadingAnimation,fadeIn, floatIn} from "./form.js?version=2";

class Form{
    dom;
    inputs;
    validated = 1;
    constructor(formId){
        this.dom=document.getElementById(formId);
        this.dom.addEventListener("submit",(event)=>{
            event.preventDefault();
            const submitButton = document.getElementById("submit");
            const submitButtonText = submitButton.textContent;
            showLoadingAnimation(submitButton);
            $.post("/admin/users/delete/"+user.user_id,{
                user_id: user.user_id,
            },
            (result)=>{
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

