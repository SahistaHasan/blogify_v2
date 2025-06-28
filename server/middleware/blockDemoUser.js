const blockDemoUser =(req,res,next)=>{
    if(req.user?.isDemo)
{
  return res.json({message: "Not available in demo version"})

}
next()
}
export default blockDemoUser