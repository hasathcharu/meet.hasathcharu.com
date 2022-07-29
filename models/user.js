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
            if(update){
                if(result[0].affectedRows == 0){
                    throw new Error();
                }
            }
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
    static assignLink(user_id,link_id){
        return db.execute(
            "INSERT INTO assign (user_id,link_id) VALUES (?,?)",
            [user_id,link_id]
        );
    }
    static unAssignLink(user_id,link_id){
        return db.execute(
            "DELETE FROM assign where user_id = ? and link_id = ?",
            [user_id,link_id]
        );
    }
    static findById(id){
        return db.execute(
            "SELECT fname,lname,email,user_id,isAdmin,adminConfirmed,firstTime FROM user where user_id = ?",
            [id]
        ).then(result=>{
            if(result[0].length!=0){
                return result[0][0];
            }
            return "Fail";
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
            "SELECT fname,lname,email,user_id,isAdmin,adminConfirmed,firstTime FROM user where email = ? and password = ?",
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
    static getAssignedLinks(user_id){
        return db.execute(
            "SELECT user_id,link_id,topic,url,status,start_time,end_time FROM assign NATURAL JOIN zoom_link WHERE user_id = ?",
            [user_id]
        );
    }
    static getUnassignedLinks(user_id,search=null){
        if(search){
            return db.execute(
                "SELECT link_id, topic, url, status, start_time,end_time FROM zoom_link WHERE link_id NOT IN (SELECT link_id FROM assign where user_id = ?) and topic LIKE '%?%';"
                [user_id,search]
            );
        }
        return db.execute(
            "SELECT link_id, topic, url, status, start_time, end_time FROM zoom_link WHERE link_id NOT IN (SELECT link_id FROM assign WHERE user_id = ?)",
            [user_id]
        );
    }
    removeFirstTimeFlag(){
        return db.execute(
            "UPDATE user set firstTime = 0 WHERE email = ?",
            [this.email]
        );
    }
    static getNumOfUnapprovedUsers(){
        return db.execute(
            "SELECT COUNT(*) as C FROM user WHERE adminConfirmed=0"
        )
        .then((result)=>{
            return  result[0][0].C;
        });
    }
    static getNumOfApprovedUsers(){
        return db.execute(
            "SELECT COUNT(*) as C FROM user WHERE adminConfirmed=1"
        )
        .then((result)=>{
            return  result[0][0].C;
        });
    }
    static getUsers(approved){
        return db.execute(
            "SELECT  fname,lname,email,user_id FROM user WHERE adminConfirmed=?",
            [approved]
        )
        .then((result)=>{
            return  result[0];
        });
    }
    static approveUser(user_id){
        return db.execute(
            "UPDATE user SET adminConfirmed=1 where user_id = ?",
            [user_id]
        );
    }
}

