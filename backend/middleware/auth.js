const jwt=require('jsonwebtoken');const User=require('../models/User');
async function protect(req,res,next){try{const header=req.headers.authorization;if(!header?.startsWith('Bearer '))return res.status(401).json({message:'Please sign in to continue'});const decoded=jwt.verify(header.split(' ')[1],process.env.JWT_SECRET);const user=await User.findById(decoded.id);if(!user)return res.status(401).json({message:'Account no longer exists'});req.user=user;next();}catch(e){return res.status(401).json({message:'Invalid or expired session'});}}
function adminOnly(req,res,next){if(req.user?.role!=='admin')return res.status(403).json({message:'Administrator access required'});next();}
module.exports={protect,adminOnly};
