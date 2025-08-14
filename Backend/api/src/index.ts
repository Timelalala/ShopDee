//1.import necessary modules
import  Express  from "express"; 
import cors from 'cors';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';

import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

dotenv.config();
import jwt from 'jsonwebtoken'

//2.configuration
const app = Express();
const PORT = process.env.PORT||4000;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';  // กำหนด secret key สำหรับ JWT ;
//3.middleware
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

app.post('/plus',(req,res)=>{
    let{x,y}= req.body;
    x = parseInt(x);
    y = parseInt(y);
    let z= x+y;
    res.send({'status':true,'result':z});
});

app.post('/circleArea',(req,res)=>{
    let {radius} = req.body;
    radius = parseFloat(radius);
    let area = Math.PI * radius * radius;
    res.send({'status':true,'result':area});
});


app.get('/',
  (req,res)=>{
res.send('Hello word!!');
});
// Interface for JWT payload

interface JwtPayload {

 custID: number;

 username: string;

 positionID?: number;

}


// Function to validate JWT token

function validateToken(req: Request, res: Response, next: NextFunction) {

 const token = req.headers['authorization']?.split(' ')[1];

 if (!token) return res.status(401).json({ message: 'Access denied' });


 try {

  const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

  (req as any).user = decoded;

  next();

 } catch (err) {

  res.status(403).json({ message: 'Invalid token' });

 }

}
//Image Profile API
app.get('/api/customer/image/:filename', (req: Request, res: Response) => {
 const filepath = path.join(__dirname, '../assets', 'customer', req.params.filename);
 res.sendFile(filepath);
});




// CREATE - เพิ่มลูกค้าใหม่

app.post('/api/customer', async (req, res) => {

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

// READ - ดึงลูกค้าทั้งหมด

app.get('/api/customer', async (req, res) => {

  try {

    const sql = `SELECT * FROM customer`;

    const customers = await query(sql);

    res.json({

status: true,

message: 'Customers fetched successfully',

data: customers

    });

  } catch (err) {

    res.status(500).json({

status: false,

message: 'Failed to fetch customers'

    });

  }

});

// READ (by ID) - ดึงลูกค้ารายเดียว
app.get('/api/customer/:custID', async (req, res) => {

  try {

    const { custID } = req.params;

    const sql = `SELECT * FROM customer WHERE custID = ?`;

    const results = await query(sql, [custID]);

    if (results.length === 0) {

res.status(404).json({

  status: false,

  message: 'Customer not found'

});

    } else {

res.json({

  status: true,

  message: 'Customer fetched successfully',

  data: results[0]

});

    }

  } catch (err) {

    res.status(500).json({

status: false,

message: 'Failed to fetch customer'

    });

  }

});
23

23

// UPDATE - แก้ไขลูกค้า

app.put('/api/customer/:custID', async (req, res) => {

  try {

    const { custID } = req.params;

    const { username, password, firstName, lastName } = req.body;

    const sql = `

UPDATE customer

SET username = ?, password = ?, firstName = ?, lastName = ?

WHERE custID = ?

    `;

    const result = await query(sql, [username, password, firstName, lastName, custID]);

    if (result.affectedRows === 0) {

res.status(404).json({

  status: false,

  message: 'Customer not found'

});

    } else {

res.json({

  status: true,

  message: 'Customer updated successfully'

});

    }

  } catch (err) {

    res.status(500).json({

status: false,

message: 'Failed to update customer'

    });

  }

});
// DELETE - ลบลูกค้า

app.delete('/api/customer/:custID', async (req, res) => {

  try {

    const { custID } = req.params;

    const sql = `DELETE FROM customer WHERE custID = ?`;

    const result = await query(sql, [custID]);

    if (result.affectedRows === 0) {

res.status(404).json({

  status: false,

  message: 'Customer not found'

});

    } else {

res.json({

  status: true,

  message: 'Customer deleted successfully'

});

    }

  } catch (err) {

    res.status(500).json({

status: false,

message: 'Failed to delete customer'

    });

  }

});

// Register

app.post('/api/register', [

 body('username').isString().notEmpty().withMessage('Username is required'),

 body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),

 body('firstName').isString().notEmpty().withMessage('First name is required'),

 body('lastName').isString().notEmpty().withMessage('Last name is required')

], async (req: Request, res: Response, next: NextFunction) => {

 const errors = validationResult(req);

 if (!errors.isEmpty()) {

  return res.status(400).send({ message: 'Validation errors', errors: errors.array(), status: false });

 }


 const { username, password, firstName, lastName } = req.body;

 try {

  const existingUser = await query("SELECT * FROM customer WHERE username=?", [username]);

  if (existingUser.length > 0) {

   return res.status(409).send({ message: 'Username already exists', status: false });

  }


  const salt = await bcrypt.genSalt(10);

  const password_hash = await bcrypt.hash(password, salt);


  await query('INSERT INTO customer (username, password, firstName, lastName) VALUES (?, ?, ?, ?)',

   [username, password_hash, firstName, lastName]);


  res.send({ message: 'Registration successful', status: true });

 } catch (err) {

  next(err);

 }

});
// Login 

app.post('/api/login', [

 body('username').isString().notEmpty().withMessage('Username is required'),

 body('password').isString().notEmpty().withMessage('Password is required')

], async (req: Request, res: Response, next: NextFunction) => {

 const errors = validationResult(req);

 if (!errors.isEmpty()) {

  return res.status(400).send({ message: 'Validation errors', errors: errors.array(), status: false });

 }


 const { username, password } = req.body;

 try {

  const customer = await query("SELECT * FROM customer WHERE username=? AND isActive = 1", [username]);

  if (customer.length === 0) {

   return res.status(401).send({ message: 'Invalid username or password', status: false });

  }


  const isPasswordValid = bcrypt.compareSync(password, customer[0].password);

  if (!isPasswordValid) {

   return res.status(401).send({ message: 'Invalid username or password', status: false });

  }


  const token = jwt.sign({ custID: customer[0].custID, username: customer[0].username }, SECRET_KEY, { expiresIn: '1h' });

  res.send({ custID: customer[0].custID, username, email: customer[0].email, token, message: 'Login successful', status: true });

 } catch (err) {

  next(err);

 }

});
// User Profile

app.get('/api/profile/:id', validateToken, async (req: Request, res: Response, next: NextFunction) => {

  const custID = req.params.id;

  const user = (req as any).user as JwtPayload;

  if (Number(custID) !== user.custID) {

    return res.status(403).send({ message: 'Access denied', status: false });

  }


  try {

    const customer = await query(`

      SELECT custID, username, firstName, lastName, address, mobilePhone, gender, email, imageFile,

             IF(birthdate IS NOT NULL, DATE_FORMAT(birthdate, '%Y-%m-%d'), NULL) AS birthdate

      FROM customer 

      WHERE custID = ? AND isActive = 1`, [custID]);


    if (customer.length === 0) {

      return res.status(404).send({ message: 'Customer not found', status: false });

    }


    res.send({ ...customer[0], message: 'Success', status: true });

  } catch (err) {

    next(err);

  }

})

//start server
app.listen(PORT,
    ()=> {
  console.log(`server is runnning at http://localhost:${PORT}`);
    });
