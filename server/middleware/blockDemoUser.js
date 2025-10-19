const blockDemoUser =(req,res,next)=>{
    if(req.user.isDemo === true)
{
  return res.json({message: "Not available in demo version"})

}
next()
}
export default blockDemoUser