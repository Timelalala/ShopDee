//1.import necessary modules
import  Express  from "express"; 
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

//2.configuration
const app = Express();
const PORT = 4000;

app.use(Express.json());
app.use(Express.urlencoded({extended:true}));
app.use(cors());

//Mysql connection
const db = mysql.createConnection({

 host: process.env.DB_HOST,

 user: process.env.DB_USER,

 password: process.env.DB_PASSWORD,

 database: process.env.DB_NAME,

 port: Number(process.env.DB_PORT)

});

db.connect();
//3.Define API Endpoints
function query(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}


app.get('/',
        (req,res)=>{
            res.send('Hello word!!');
});
// CREATE - เพิ่มลูกค้าใหม่

app.post('/api/customer', 
    async (req, res) => {

 try {

        const { username, password, firstName, lastName } = req.body;

        const sql = `

        INSERT INTO customer (username, password, firstName, lastName)

        VALUES (?, ?, ?, ?)

        `;

  const result = await query(sql, [username, password, firstName, lastName]);

  res.json({

   status: true,

   message: 'Customer created successfully'

  });

 } catch (err) {

  res.status(500).json({

   status: false,

   message: 'Failed to create customer'

  });

 }

});

//start server
app.listen(PORT,
    ()=> {
        console.log(`server is runnning at http://localhost:${PORT}`);
    });
