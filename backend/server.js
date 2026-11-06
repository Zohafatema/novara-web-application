require('dotenv').config();
const express=require('express');
const cors=require('cors');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit');
const connectDB=require('./config/db');

const app=express();
app.use(helmet());
app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'}));
app.use(express.json({limit:'1mb'}));
app.use('/api/auth',rateLimit({windowMs:15*60*1000,max:100,standardHeaders:true,legacyHeaders:false}));
app.get('/api/health',(req,res)=>res.json({success:true,message:'NOVARA API is running'}));
app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/products',require('./routes/productRoutes'));
app.use('/api/orders',require('./routes/orderRoutes'));
app.use('/api/admin',require('./routes/adminRoutes'));
app.use('/api/wishlist',require('./routes/wishlistRoutes'));
app.use('/api/coupons',require('./routes/couponRoutes'));
app.use('/api/shop',require('./routes/shop')); // <-- YE NAYI LINE JODI HAI
app.use((req,res)=>res.status(404).json({message:'API route not found'}));
app.use((err,req,res,next)=>{console.error(err);const status=err.name==='ValidationError'?400:err.code===11000?409:500;res.status(status).json({message:status===500?'Server error. Please try again.':err.message});});
const PORT=process.env.PORT||5000;
connectDB().then(()=>app.listen(PORT,'0.0.0.0',()=>console.log(`NOVARA API listening on ${PORT}`))).catch(err=>{console.error('Database connection failed:',err.message);process.exit(1)});