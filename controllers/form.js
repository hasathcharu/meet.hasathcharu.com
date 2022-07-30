// module.exports = class Validator{
//     // static emailRegex =  new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i);
//     static numRegex = new RegExp(/\d/);
//     static alphaNumRegex = new RegExp(/^[A-Za-z0-9]*$/);
//     static letterRegex = new RegExp(/^[A-Za-z]+$/);
//     static spacesRegex = new RegExp(/\s/);

//     static validate(checks){
//         for (const check of checks){
//             if (!check){
//                 return false;
//             }
//         }
//         return true;
//     }

//     static conformsLength(input,options={max:null,min:0}){
//         if(!input){
//             return false;
//         }
//         if(options.max){
//             if(input.length<options.min || input.length>options.max){
//                 return false;
//             }
//         }
//         else{
//             if(options.min!=0 && input.length<options.min){
//                 return false;
//             }
//         }
//         return true;
//     }

//     static hasPattern(regex,string){
//        if (string.match(regex)){
//            return true;
//        }
//        return false;
//     }

//     static hasOnlyLetters(input){
//         if(Validator.hasPattern(Validator.letterRegex,input)){
//             return true;
//         }
//         return false;
//     }

//     static hasNumbers(input){
//         if(Validator.hasPattern(Validator.numRegex,input)){
//             return true;
//         }
//         return false;
//     }

//     static validEmail(input){
//         if(Validator.hasPattern(Validator.emailRegex,input)){
//             return true;
//         }
//         return false;
//     }

//     static hasOnlyAlphaNum(input){
//         if(Validator.hasPattern(Validator.alphaNumRegex,input)){
//             return true;
//         }
//         return false;
//     }

//     static hasNoSpaces(input){
//         input = input.trim();
//         if(Validator.hasPattern(Validator.spacesRegex,input)){
//             return false;
//         }
//         return true;
//     }
// }




