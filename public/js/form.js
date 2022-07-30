
export class Validator{
    static emailRegex =   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    static numRegex = /\d/;
    static alphaNumRegex =  /^[A-Za-z0-9]*$/;
    static letterRegex = /^[A-Za-z]+$/;
    static spacesRegex = /\s/;

    static validate(checks){
        for (const check of checks){
            if (!check()){
                return false;
            }
        }
        return true;
    }

    static conformsLength(input,options={max:null,min:0}){
        if(!input.value){
            ErrorHandler.printError("This field cannot be empty", input);
            return false;
        }
        if(options.max){
            if(input.value.length<options.min || input.value.length>options.max){
                if(options.min==0){
                    ErrorHandler.printError(`Shouldn't be more than ${options.max} charactors`,input);
                }else{
                    ErrorHandler.printError(`Must be between ${options.min} and ${options.max} charactors`,input);
                }
                return false;
            }
        }
        else{
            if(options.min!=0 && input.value.length<options.min){
                ErrorHandler.printError(`Shouldn't be less than ${options.min} charactors`,input);
                return false;
            }
        }
        return true;
    }

    static hasPattern(regex,string){
       if (string.match(regex)){
           return true;
       }
       return false;
    }

    static hasOnlyLetters(input){
        if(Validator.hasPattern(Validator.letterRegex,input.value)){
            return true;
        }
        ErrorHandler.printError("You can only use letters",input);
        return false;
    }

    static hasNumbers(input){
        if(Validator.hasPattern(Validator.numRegex,input.value)){
            return true;
        }
        ErrorHandler.printError("You should have atleast one number",input);
        return false;
    }

    static validEmail(input){
        if(Validator.hasPattern(Validator.emailRegex,input.value)){
            return true;
        }
        ErrorHandler.printError("Invalid email",input);
        return false;
    }

    static hasOnlyAlphaNum(input){
        if(Validator.hasPattern(Validator.alphaNumRegex,input.value)){
            return true;
        }
        ErrorHandler.printError("Should only contain letters and numbers",input);
        return false;
    }

    static hasNoSpaces(input){
        input.value = input.value.trim();
        if(Validator.hasPattern(Validator.spacesRegex,input.value)){
            ErrorHandler.printError("Should not contain spaces",input);
            return false;
        }
        return true;
    }

    static validDOB(input){
        if((new Date(input.value).getTime() - Date.now())>0){
            ErrorHandler.printError("Invalid birthdate",input)
            return false;
        }
        return true;
    }

    static passwordMatch(input,options){
        if(options.refer.value==input.value){
            return true;
        }
        ErrorHandler.printError("Passwords do not match",input);
        return false;
    }
}
export class Formatter{
    static format(formats){
        for (const format of formats){
            format();
        }
    }
    static trim(input){
        input.value = input.value.trim();
    }
    static capitalize(input){
        input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
    }
    static convertToLowerCase(input){
        input.value = input.value.toLowerCase();
    }
    static calDob(input,options){
            let age = Date.now() - new Date(input.value).getTime();
            age = new Date(age);
            age = age.getUTCFullYear();
            age = Math.abs(age-1970);
            options.element.value=age+" years";
    }
}
export class ErrorHandler{
    static removeCurrentMessage(input){
        if(input.nextElementSibling){
            if(input.nextElementSibling.classList.contains("validation")){
                    input.nextElementSibling.remove();
                    input.classList.remove("validateError");
            }
        }
    }
    static printError(errorMessage,inputElement){
        this.removeCurrentMessage(inputElement);
        let message=document.createElement("span");
        inputElement.classList.add("validateError");
        message.classList.add("validation");
        message.innerHTML="<i class='fas fa-arrow-circle-up'></i> "+errorMessage;
        inputElement.after(message);
    }
    static printErrorForm(errorMessage,inputElement){
        this.removeCurrentMessage(inputElement);
        let messageContainer=document.createElement("div");
        let message = document.createElement("span");
        inputElement.classList.add("validateError");
        message.classList.add("red-message");
        messageContainer.classList.add("validation");
        message.innerHTML=errorMessage;
        messageContainer.append(document.createElement("br"));
        messageContainer.append(document.createElement("br"));
        messageContainer.append(message);
        inputElement.after(messageContainer);
    }
}
export class Input{
    dom;
    checks = [];
    passed = 1;
    formats = [];
    constructor(elementId){
        this.dom=document.getElementById(elementId);
        this.focusOutEvent();
    }
    focusOutEvent(){
        this.dom.addEventListener("focusout",()=>{
            ErrorHandler.removeCurrentMessage(this.dom);
            if(this.checks){
                this.runChecks();
            }
            if(this.formats && this.passed){
                this.runFormats();
            }
        });
    }
    runChecks(){
        this.passed=Validator.validate(this.checks);
    }
    addCheck(check,options=null){
        if(!options)
            this.checks.push(check.bind(this,this.dom));
        else{
            this.checks.push(check.bind(this,this.dom,options));
        }
    }
    addFormat(format,options=null){
        if(!options)
            this.formats.push(format.bind(this,this.dom));
        else{
            this.formats.push(format.bind(this,this.dom,options));
        }
    }
    runFormats(){
        Formatter.format(this.formats);
    }
    hasPassed(){
        return this.passed;
    }
    getDom(){
        return this.dom;
    }
}
export class PasswordInput extends Input{
    cpass;
    constructor(elementId,cpass){
        super(elementId);
        this.cpass = cpass;
    }
    focusOutEvent(){
        this.dom.addEventListener("focusout",()=>{
            ErrorHandler.removeCurrentMessage(this.dom);
            if(this.checks){
                this.runChecks();
            }
            if(this.formats && this.passed){
                this.runFormats();
            }
            if(this.cpass.getDom().value!=""){
                this.cpass.runChecks();
        }
        });
    }
}
export function showLoadingAnimation(element){
    const width = element.offsetWidth;
    element.style.width = width+"px";
    element.innerHTML = "<div class='loader-btn-container'><span class='loader-btn'></span><div>";
    return;
}
export function removeLoadingAnimation(element,text){
    element.style.width = "auto";
    element.innerHTML = text;
    return;
}
export function showSuccessModal(name,edit=0){
    const modalElement = document.createElement("div");
    modalElement.className = "modal";
    const modalTemplate = document.getElementById("modal-template");
    const modalContent = document.importNode(modalTemplate.content, true);
    if(edit==0){
        modalContent.querySelector(".modal-text").innerHTML = "<h2>Welcome Onboard "+name+"!</h2>";
    }
    if(edit==1){
        modalContent.querySelector(".modal-text").innerHTML = "<h2>All good "+name+"!</h2>";
    }
    if(edit==2){
        modalContent.querySelector(".modal-text").innerHTML = "<h2>Account Deleted</h2>";
    }
    modalElement.append(modalContent);
    document.body.querySelector("main").append(modalElement);
    fadeIn(modalElement,{display:"grid"});
    floatIn(modalElement.querySelector(".modal-content"),{display:"grid",animationId:"player"});
}

//generalized "jquery like" light weight animation functions developed by myself with high reusability and customizability using args object parameter


export function fadeIn(element,args = {}){//options is an object that will contain easing property
    const defaults = {easing:"ease",display:"block"};
    const options = {...defaults,...args};
    element.style.opacity = 0;
    element.style.display = options.display;
    element.style.transition= `opacity 1s ${options.easing}`;
    setTimeout(()=>{
        element.style.opacity="1";
    },1);
}

export function floatIn(element,args = {}){//options is an object that contains margin,duration, and easing and animationId properties
    const defaults = {animationId:null,margin:4,duration:500,easing:"ease",display:"block"};
    const options = {...defaults,...args};
    element.style.marginTop = options.margin+'rem';
    element.style.opacity = 0;
    element.style.display = options.display;
    element.style.transition= `opacity ${options.duration/1000}s ${options.easing},margin ${options.duration/1000}s ${options.easing}`;
    setTimeout(()=>{
        element.style.opacity="1";
        element.style.marginTop = "0";
    },1);
    if(options.animationId){
        setTimeout(()=>{
            const animation = document.getElementById(options.animationId);
            animation.play();
            //play method is defined in Lottie.js external library for lottie files.
        },options.duration);
    }
}