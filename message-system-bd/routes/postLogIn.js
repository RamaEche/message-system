const ValidateUserRegistredByUserName = require('../controllers/ValidateUserRegistredByUserName.js')
const createToken = require('../controllers/createToken.js');

const logIn = async (req, res)=>{
  try{
    if(!(req.body && req.body.UserName && req.body.Password &&
      req.body.UserName.length >= 4 && req.body.UserName.length <= 15 &&
      req.body.Password.length >= 5 && req.body.Password.length <= 20 )){
      throw new Error('{ "ok":false, "status":400, "err":"invalidInputs"}')
    }

    const validateUser = await ValidateUserRegistredByUserName(req.body.UserName, req.body.Password)
    if(validateUser.state){
      const token = createToken({UserID:validateUser.UserID})
      res.status(200).json({ok:true, token:token});
    }else{
      throw new Error('{ "ok":false, "status":401, "err":"invalidCredentials"}')
    }
  }catch(err){
    console.error(err)
    try{
      err=JSON.parse(err.message)
      res.status(err.status || 400).json(err)
    }catch{
      res.status(500).json({ok:false, state:500, msg:"Internal Server Error"})
    }
  }
}
module.exports = logIn;