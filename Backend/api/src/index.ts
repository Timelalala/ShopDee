import  Express  from "express"; 

const app = Express();
const PORT = 4000;

app.get('/',
        (req,res)=>{
            res.send('Hello word!!');
});

app.listen(PORT,
    ()=> {
        console.log(`server is runnning at http://localhost:${PORT}`);
    });
