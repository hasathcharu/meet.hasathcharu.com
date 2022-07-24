const sha512 = require('js-sha512').sha512;
const db = require('../utils/database');

module.exports = class User{
    constructor(fname,lname,email){
        this.fname = fname;
        this.lname = lname;  
        this.email = email;
    }
    setPassword(password){
        this.password = sha512(password);
    }
    setUserId(userId){
        this.id = userId;
    }
    save(update=0){
        let emailQuery = "SELECT user_id FROM user where email = ?";
        let emailQueryArray = [this.email];
        if(update){
            emailQuery = "SELECT user_id FROM user where email = ? and user_id != ?";
            emailQueryArray.push(this.id)
        }
        return db.execute(
            emailQuery,
            emailQueryArray
        )
        .then((result)=>{
            if(result[0].length==0){
                if(update){
                    return db.execute(
                        "UPDATE user set fname = ?, lname = ?, email = ? where user_id = ?",
                        [this.fname,this.lname,this.email,this.id]
                    );
                }
                return db.execute(
                    "INSERT INTO user (fname,lname,email,password) VALUES (?,?,?,?)",
                    [this.fname,this.lname,this.email,this.password]
                );
            }else{
                throw new Error ("Email Error");
            }
        })
        .then((result)=>{
            return "Success";
        })
        .catch((err)=> {
            if(err.message=="Email Error"){
                return "Email Error";
            }
            else{
                return "Fail";
            }
        });
    }
    static findById(id){
        return db.execute(
            "SELECT fname,lname,email,user_id,admin,adminConfirmed FROM user where user_id = ?",
            [id]
        ).then(result=>{
            return result[0][0];
        });
    }
    static deleteById(id){
        return db.execute(
            "DELETE FROM user where user_id = ?",
            [id]
        );
    }
    static authenticate(email, pass){
        const password = sha512(pass);
        return db.execute(
            "SELECT fname,lname,email,user_id,admin,adminConfirmed FROM user where email = ? and password = ?",
            [email, password]
        );
    }
    static changePassword(pass,id){
        const password = sha512(pass);
        return db.execute(
            "UPDATE user set password = ? where user_id = ?",
            [password,id]
        );
    }
}

