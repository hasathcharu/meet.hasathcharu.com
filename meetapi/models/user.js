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
    async save(update=0){
        try{
            let emailQuery = "SELECT user_id FROM user where email = ?";
            let emailQueryArray = [this.email];
            if(update){
                emailQuery = "SELECT user_id FROM user where email = ? and user_id != ?";
                emailQueryArray.push(this.id)
            }
            const result = await db.execute(
                                emailQuery,
                                emailQueryArray
                            );
            if(result[0]?.length!=0)
                throw new Error("Email Error");
            let saved;
            if(update){
                saved = await db.execute(
                                "UPDATE user set fname = ?, lname = ?, email = ? where user_id = ?",
                                [this.fname,this.lname,this.email,this.id]
                            );
            }else{
                saved = await db.execute(
                                "INSERT INTO user (fname,lname,email,password) VALUES (?,?,?,?)",
                                [this.fname,this.lname,this.email,this.password]
                            );
            }
            if(saved[0]?.affectedRows==1)
                return 'Success';
            throw new Error();
        }
        catch(err){
            if(err.message=='Email Error')
                return 'Email Error';
            return 'Fail';
        }
    }
    async assignLink(link_id){
        try{
            const result = await db.execute(
                "INSERT INTO assign (user_id,link_id) VALUES (?,?)",
                [this.id,link_id]
            );
            if (result?.[0].affectedRows == 1)
                return "Success";
            throw new Error();
        }
        catch(err){
            if(err?.code == "ER_NO_REFERENCED_ROW_2")
                return "Not Found";
            if(err?.code == "ER_DUP_ENTRY"){
                return "Already Assigned";
            }
            return "Fail";
        }
    }
    async unAssignLink(link_id){
        try{
            const result = await db.execute(
                "DELETE FROM assign where user_id = ? and link_id = ?",
                [this.id,link_id]
            );
            if(result[0]?.affectedRows == 1)
                return "Success";
            return "Already Unassigned";
        }
        catch{
            return "Fail";
        }
    }
    static async findById(id){
        try{
            const result = await db.execute(
                "SELECT fname,lname,email,user_id,isAdmin,adminConfirmed,firstTime,theme,UNIX_TIMESTAMP(passchangetime) as passchangetime FROM user where user_id = ?",
                [id]
            )
            if(result[0]?.length!=0){
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
            throw new Error();
        }
        catch{
            return "Fail";
        }
    }
    async deleteById(){
        try{
            const result = await db.execute(
                "DELETE FROM user where user_id = ?",
                [this.id]
            );
            if(result[0]?.affectedRows==1)
                return "Success";
            throw new Error();
        }
        catch{
            return "Fail";
        }
    }
    async authenticate(){
        try{
            const result = await db.execute(
                "SELECT user_id,email FROM user where email = ? and password = ?",
                [this.email, this.password]
            );
            if(result[0]?.length==1)
                return result[0][0];
            return 'Failed Auth';
        }
        catch(error){
            return 'Fail';
        }
    }
    async changePassword(pass){
        const password = sha512(pass);
        try{
            const result =  await db.execute(
                                "UPDATE user set password = ?, passchangetime = CURRENT_TIMESTAMP where user_id = ?",
                                [password,this.id]
                            );
            if(result[0]?.affectedRows==1)
                return "Success";
            throw new Error();
        }
        catch{
            return "Fail";
        }
    }
    async getAssignedLinks(){
        try{
            const result = await db.execute(
                                "SELECT user_id,link_id,topic,url,pwd,status,TIMESTAMPDIFF(minute,start_time,current_timestamp) AS smin,TIMESTAMPDIFF(minute,end_time,current_timestamp) AS emin FROM assign NATURAL JOIN zoom_link WHERE user_id = ? ORDER BY status DESC",
                                [this.id]
                            );
            return result;
        }
        catch{
            return "Fail";
        }
    }
    async getUnassignedLinks(search=null){
        let query = "SELECT link_id, topic, url, status, start_time, end_time FROM zoom_link WHERE link_id NOT IN (SELECT link_id FROM assign WHERE user_id = ?)";
        const queryArray = [this.id];
        if(search){
            queryArray.push(search);
            query = "SELECT link_id, topic, url, status, start_time,end_time FROM zoom_link WHERE link_id NOT IN (SELECT link_id FROM assign where user_id = ?) and topic LIKE '%?%';";
        }
        try{
            const result = await db.execute(
                                query,
                                queryArray
                            );
            return result;
        }
        catch{
            return "Fail";
        }

    }
    async getIfAnyOtherLive(){
        try{
            const result = await db.execute(
                                "SELECT sum(status) as S FROM zoom_link WHERE link_id NOT IN (SELECT link_id FROM assign WHERE user_id = ?)",
                                [this.id]
                            );
            if(result[0][0].S!== undefined)
                return result[0][0].S;
            throw new Error();
        }
        catch{
            return "Fail";
        }
    }
    async checkAssigned(link_id){
        try{
            const result = await db.execute(
                "SELECT count(link_id) as C FROM assign WHERE user_id = ? and link_id = ?",
                [this.id,link_id]
            )
            if(result[0][0].C!== undefined)
                return result[0][0].C;
            throw new Error();
        }catch{
            return "Fail";
        }
    }
    async removeFirstTimeFlag(){
        try{
            const result = await db.execute(
                                "UPDATE user set firstTime = 0 WHERE email = ?",
                                [this.email]
                            );
            if(result[0]?.affectedRows==1){
                return "Success";
            }
            throw new Error();
        }
        catch{
            return "Fail";
        }
    }
    static async getNumOfUnapprovedUsers(){
        try{
            const result = await db.execute(
                                "SELECT COUNT(*) as C FROM user WHERE adminConfirmed=0"
                            );
            if(result[0][0].C!== undefined)
                return result[0][0].C;
            throw new Error();
        }
        catch{
            return "Fail";
        }
    }
    static async getNumOfApprovedUsers(){
        try{
            const result = await db.execute(
                "SELECT COUNT(*) as C FROM user WHERE adminConfirmed=1"
            );
            if(result[0][0].C!== undefined)
                return result[0][0].C;
            throw new Error();
        }
        catch{
            return "Fail";
        }
    }
    static async getUsers(approved){
        try{
            const result = db.execute(
                "SELECT  fname,lname,email,user_id FROM user WHERE adminConfirmed=?",
                [approved]
            );
            if(result[0])
                return result[0];
            throw new Error;
        }
        catch{
            return "Fail";
        }

    }
    static approveUser(user_id){
        try{        
            const result = db.execute(
                                "UPDATE user SET adminConfirmed=1 where user_id = ?",
                                [user_id]
                            );
            if(result[0]?.affectedRows==1)
                return "Success";
            throw new Error();
        }
        catch{
            return "Fail";
        }

    }
    saveTheme(){
        try{
            const result =  db.execute(
                "UPDATE user SET theme = ? WHERE user_id = ?",
                [this.theme,this.id]
            );
            if(result[0]?.affectedRows==1)
                return "Success";
            throw new Error();
        }
        catch{
            return "Fail";
        }
    }
}

