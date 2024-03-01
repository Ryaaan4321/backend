const moduleExport = {
    async Test(req, res){
        res.status(200).json({message:"test"});
    }
}
export default moduleExport;