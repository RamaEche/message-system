require("dotenv").config();

const jwt = require("jsonwebtoken");
const Users = require("../models/Users.js");

async function validateToken(req, res){
	try{
		let token;
		if(req.authorization){
			token = req.authorization.split(" ")[1];
		}else if(req.headers["authorization"]){
			token = req.headers["authorization"].split(" ")[1];

			if (!token) {
				return res.status(401).json({ err: "Undefined token." });
			}
		}else if (req.cookies){
			token = req.cookies.Authorization;
			console.log(token);
		}else{
			return res.status(403).json({ err: "Auth null." });
		}
	
		let ret = "next";
		await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
			if(req.authorization){ //WebSocket.
				if (err) {
					ret = new Error("Error");
				}
				try{
					ret = await Users.findById(decoded.UserID).exec();
				}
				catch(err){
					ret = new Error("Error");
				}
			}else if(req.headers["authorization"]){ //Json y formData.
				if (err) {
					ret = res.status(403).json({ err: "Invalid token." });
				}
				try{req.user = await Users.findById(decoded.UserID).exec();}
				catch(err){
					ret = res.status(403).json({ error: "Valid Token But invalid user." });
				}
			}else if (req.cookies){ //
				if (err) {
					ret = res.status(403).json({ err: "Invalid token." });
				}
				try{req.user = await Users.findById(decoded.UserID).exec();}
				catch(err){
					ret = res.status(403).json({ error: "Valid Token But invalid user." });
				}
			}else{ //No auth.
				if (err) {
					ret = res.status(403).json({ err: "Invalid token." });
				}
				try{req.user = await Users.findById(decoded.UserID).exec();}
				catch(err){
					if(res) ret = res.status(403).json({ error: "Valid Token But invalid user." });
					console.error(err);
				}
			}
		});
		return ret;
	}catch(err){
		try{
			const errorMessage = JSON.parse(err.message);
			res.status(errorMessage.status || 400).json(errorMessage);
		}catch{
			res.status(500).json({ok:false, state:500, msg:"internalServerError"});
		}
	}
}

async function validateTokenMW(req, res, next){
	const resp = await validateToken(req, res);
	if(resp == "next"){
		next();
	}
}

module.exports = {validateToken, validateTokenMW};