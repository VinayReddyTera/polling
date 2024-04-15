const userDB = require('../model/users');
const userService = {}

userService.login=(data)=>{
  return userDB.checkLoginUser(data).then((userData)=>{
      if(userData.status == 200){
        return userDB.checkPassword(data).then((authData)=>{
            return authData
        })
      }
      else{
        return userData
      }
  })
}

userService.register=(data)=>{
    return userDB.checkLoginUser(data).then((userData)=>{
        if(userData.status == 204 && userData.data == "User Doesn't Exist"){
            return userDB.register(data).then((isCreated)=>{
                return isCreated
            })
        }
        else{
          if(userData.status == 200){
            let res = {
              status : 204,
              data : "User already exists, try logging in!"
            }
            return res
          }
          return userData
        }
    })
}

userService.setupData=(data)=>{
  return userDB.setupData().then((data)=>{
    return data
  })
}

userService.sendMail=(payload)=>{
  let transporter = nodemailer.createTransport({
      service : 'gmail',
      auth : {
          user : process.env.mailId,
          pass : process.env.pass
      }
  });

  let mailOptions = {
      from : process.env.mailId,
      to : payload.email,
      subject : payload.subject,
      cc : payload?.cc,
      html : payload.body
  }

  transporter.sendMail(mailOptions,(error,info)=>{
      if(error){
          console.log(error)
      }
      else{
          // console.log('Email sent : '+info.response);
          console.log('ok')
      }
  })
}

module.exports = userService