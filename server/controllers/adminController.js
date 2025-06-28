import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const adminLogin = async(req,res)=>{

 try{
      const email = req.body.email;
       const password = req.body.password;

    // Demo Login Check
  if (email === "demo@blog.com" && password ==="demo123") {
    const token = jwt.sign({ email, isDemo: true }, process.env.JWT_SECRET);
    return res.json({ success: true, token });
  }

  // Real Admin Login Check
  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ email, isDemo: false }, process.env.JWT_SECRET);
  res.json({ success: true, token });

} catch (error) {
  res.json({ success: false, message: error.message });
}
}



   

   
