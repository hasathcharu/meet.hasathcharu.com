const sha512 = require('js-sha512').sha512;
const db = require('../utils/database');

module.exports = class User{
    constructor(user_id=null){
        if(user_id){
            this.id = user_id;
        }
    }
    setPassword(password){
        this.password = sha512(password);
    }
    setUserId(userId){
        this.id = userId;
    }
    setFname(fname){
        this.fname = fname;
    }
    setLname(lname){
        this.lname = lname;
    }
    setEmail(email){
        this.email = email;
    }
    setIsAdmin(isAdmin){
        this.isAdmin = isAdmin;
    }
    setAdminConfirmed(adminConfirmed){
        this.adminConfirmed = adminConfirmed;
    }
    setfirstTime(firstTime){
        this.firstTime = firstTime;
    }
    setTheme(theme){
        this.theme = theme;
    }
    setPassChangeTime(time){
        this.passChangeTime = time;
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
    assignLink(link_id){
        return db.execute(
            "INSERT INTO assign (user_id,link_id) VALUES (?,?)",
            [this.id,link_id]
        )
        .then(result=>{
            if(result[0].affectedRows == 1){
                return "Success";
            }
        })
        .catch(err=>{
            if(err.code == "ER_DUP_ENTRY"){
                return "Already Assigned";
            }
            return "Fail";
        });
    }
    unAssignLink(link_id){
        return db.execute(
            "DELETE FROM assign where user_id = ? and link_id = ?",
            [this.id,link_id]
        )
        .then(result=>{
            if(result[0].affectedRows == 1){
                return "Success";
            }
            return "Already Unassigned";
        })
        .catch(err=>{
            console.log(err);
            return "Fail";
        });
    }
    static findById(id){
        return db.execute(
            "SELECT fname,lname,email,user_id,isAdmin,adminConfirmed,firstTime,theme,UNIX_TIMESTAMP(passchangetime) as passchangetime FROM user where user_id = ?",
            [id]
        ).then(result=>{
            if(result[0].length!=0){
                const data =  result[0][0];
                const user = new User();
                user.setFname(data.fname);
                user.setLname(data.lname);
                user.setEmail(data.email);
                user.setUserId(data.user_id);
                user.setIsAdmin(data.isAdmin);
                user.setAdminConfirmed(data.adminConfirmed);
                user.setfirstTime(data.firstTime);
                user.setTheme(data.theme);
                user.setPassChangeTime(data.passchangetime);
                return user;
            }
            return "Fail";
        });
    }
    deleteById(){
        return db.execute(
            "DELETE FROM user where user_id = ?",
            [this.id]
        );
    }
    authenticate(){
        return db.execute(
            "SELECT user_id,email FROM user where email = ? and password = ?",
            [this.email, this.password]
        );
    }
    changePassword(pass){
        const password = sha512(pass);
        return db.execute(
            "UPDATE user set password = ?, passchangetime = CURRENT_TIMESTAMP where user_id = ?",
            [password,this.id]
        );
    }
    getAssignedLinks(){
        return db.execute(
            "SELECT user_id,link_id,topic,url,pwd,status,TIMESTAMPDIFF(minute,start_time,current_timestamp) AS smin,TIMESTAMPDIFF(minute,end_time,current_timestamp) AS emin FROM assign NATURAL JOIN zoom_link WHERE user_id = ? ORDER BY status DESC",
            [this.id]
        );
    }
    getIfAnyOtherLive(){
        return db.execute(
            "SELECT sum(status) as S FROM zoom_link WHERE link_id NOT IN (SELECT link_id FROM assign WHERE user_id = ?)",
            [this.id]
        ).then((result)=>{
            return  result[0][0].S;
        });
    }
    getUnassignedLinks(search=null){
        if(search){
            return db.execute(
                "SELECT link_id, topic, url, status, start_time,end_time FROM zoom_link WHERE link_id NOT IN (SELECT link_id FROM assign where user_id = ?) and topic LIKE '%?%';"
                [this.id,search]
            );
        }
        return db.execute(
            "SELECT link_id, topic, url, status, start_time, end_time FROM zoom_link WHERE link_id NOT IN (SELECT link_id FROM assign WHERE user_id = ?)",
            [this.id]
        );
    }
    checkAssigned(link_id){
        return db.execute(
            "SELECT count(link_id) as C FROM assign WHERE user_id = ? and link_id = ?",
            [this.id,link_id]
        ).then((result)=>{
            return  result[0][0].C;
        });
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
    saveTheme(){
        return db.execute(
            "UPDATE user SET theme = ? WHERE user_id = ?",
            [this.theme,this.id]
        );
    }
}

