/**
 * user service 
 */
const db = require('../bin/database/db')
var cryptUtil = require('../bin/util/cryptUtil')

function signUp(opts, done) {
    let result = {
        status: false
    }
    let {
        userName,
        passWord,
        nickName,
        orgId,
        sex,
        email,
        mobilePhone,
        telePhone
    } = opts
    let userId = cryptUtil.guid()
    let userTable = db.table('user')
    userTable.find({
        username: userName
    }).then(data => {
        if (data && data.length && data.length > 0) {
            return Promise.reject('此用户名已被占用！');
        }
    }).then(() => {
        return userTable.add({
            userid: userId,
            username: userName,
            password: passWord,
            nickname: nickName,
            orgid: orgId,
            sex: sex,
            email: email,
            mobilephone: mobilePhone,
            telephone: telePhone
        })
    }).then(data => {
        result.status = true
        done(result)
    }).catch(error => {
        result.message = error && typeof error === 'string' ? error : '系统错误！'
        done(result)
    })
}

function signIn(opts, done) {
    let result = {
        status: false
    }
    let {
        userName,
        passWord
    } = opts
    let userTable = db.table('user')
    userTable.findOne({
        username: userName
    }).then(data => {
        if (!data || !data.length || data.length === 0) {
            return Promise.reject('用户不存在！')
        }
        if (data[0].password !== passWord) {
            return Promise.reject('密码错误！')
        }
        result.status = true
        let userId = data.userId
        let token = cryptUtil.encodeToken(userId)
        result.token = token
        done(result)
    }).catch(error => {
        result.message = error && typeof error === 'string' ? error : '系统错误！'
        done(result)
    })
}

function userInfo(opts, done) {
    let result = {
        status: false
    }
    let {
        userId
    } = opts
    let userTable = db.table('user')
    userTable.findOne({
        userId
    }).then(data => {
        result.status = true
        result.data = data
        done(data)
    }).catch(err => {
        result.message = '系统错误！'
        done(result)
    })
}
function updatePassword(userId,opts,done){
    let result = {
        status: false
    }
    let {newPwd} = opts
    let userTable = db.table('user')
    userTable.update({userId},{password:newPwd}).then(result=>{
        result.status=true
        done(result)
    }).catch(err=>{
        result.message='系统错误！'
        done(result)
    })
}
module.exports = {
    signUp,
    signIn,
    userInfo,
    updatePassword
}