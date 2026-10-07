const { Pool } = require('pg');
const crypto = require('node:crypto');
const { promisify } = require('node:util');
const scrypt = promisify(crypto.scrypt);
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
async function hash(password) { const salt = crypto.randomBytes(16).toString('hex'); return salt + ':' + (await scrypt(password, salt, 64)).toString('hex'); }
async function verify(password, saved) { const [salt, hex] = saved.split(':'); const actual = await scrypt(password, salt, 64); return crypto.timingSafeEqual(actual, Buffer.from(hex, 'hex')); }
const publicUser = u => ({ id: u.id, fullName: u.name, name: u.name, email: u.email, role: u.role, active: u.active, createdAt: u.created_at });
const product = p => ({ id:p.id,name:p.name,description:p.description,price:Number(p.price),stock:p.stock,imageUrl:p.image_url,categoryId:p.category_id,category:{id:p.category_id,name:p.category_name},createdAt:p.created_at,sold:p.sold });
const productSelect = 'SELECT p.*, c.name category_name FROM sfaxstore.products p JOIN sfaxstore.categories c ON c.id=p.category_id';
async function orders(db, userId) {
 const rows = (await db.query('SELECT o.*, u.name full_name,u.email,u.role FROM sfaxstore.orders o JOIN sfaxstore.users u ON u.id=o.user_id '+(userId?'WHERE o.user_id=$1 ':'')+'ORDER BY o.created_at DESC',userId?[userId]:[])).rows;
 const items = (await db.query('SELECT i.*,p.name,p.image_url FROM sfaxstore.order_items i JOIN sfaxstore.products p ON p.id=i.product_id')).rows;
 return rows.map(o=>({id:o.id,userId:o.user_id,user:{id:o.user_id,fullName:o.full_name,email:o.email,role:o.role},totalAmount:Number(o.total),status:o.status,createdAt:o.created_at,shippingInfo:o.shipping,items:items.filter(i=>i.order_id===o.id).map(i=>({id:i.id,productId:i.product_id,product:{id:i.product_id,name:i.name,imageUrl:i.image_url},quantity:i.quantity,unitPrice:Number(i.unit_price)}))}));
}
module.exports = async (req,res) => {
 res.setHeader('Cache-Control','no-store');
 try {
  if (!process.env.DATABASE_URL) fail(503,'Database configuration is missing.');
  const url = new URL(req.url,'http://localhost');
  const parts = (url.searchParams.get('path') || url.pathname.replace(/^\/api\/?/,'')).split('/').filter(Boolean);
  const [resource, rawId, action] = parts; const id = Number(rawId); const method=req.method;
  let body=req.body || {}; if(typeof body==='string') body=JSON.parse(body);
  const token=(req.headers.authorization||'').replace(/^Bearer /,'');
  const current = token ? (await pool.query('SELECT u.* FROM sfaxstore.sessions s JOIN sfaxstore.users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now() AND u.active=true',[crypto.createHash('sha256').update(token).digest('hex')])).rows[0] : null;
  const requireUser=()=>{if(!current) fail(401,'Please sign in.');};
  const admin=()=>{requireUser();if(current.role!=='ADMIN')fail(403,'Administrator access required.');};
  if(resource==='auth') {
   const address=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0];
   const bucket=crypto.createHash('sha256').update(address).digest('hex')+':'+Math.floor(Date.now()/900000);
   const attempts=(await pool.query('INSERT INTO sfaxstore.auth_limits(bucket,attempts) VALUES($1,1) ON CONFLICT(bucket) DO UPDATE SET attempts=sfaxstore.auth_limits.attempts+1 RETURNING attempts',[bucket])).rows[0].attempts;
   if(attempts>30)fail(429,'Too many attempts. Please try again in 15 minutes.');
   if(method!=='POST')fail(405,'Method not allowed.');
   const email=String(body.email||'').trim().toLowerCase(), password=String(body.password||''); let user;
   if(rawId==='register') {
    if(!String(body.name||'').trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<8||password.length>128)fail(400,'Enter a name, valid email and password of 8 to 128 characters.');
    user=(await pool.query('INSERT INTO sfaxstore.users(name,email,password_hash) VALUES($1,$2,$3) RETURNING *',[String(body.name).trim().slice(0,120),email,await hash(password)])).rows[0];
   } else if(rawId==='login') {
    user=(await pool.query('SELECT * FROM sfaxstore.users WHERE email=$1',[email])).rows[0];
    if(!user || !user.active || password.length>128 || !(await verify(password,user.password_hash)))fail(401,'Invalid email or password.');
   } else fail(404,'Not found.');
   const session=crypto.randomBytes(32).toString('hex');
   await pool.query('INSERT INTO sfaxstore.sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval \'7 days\')',[crypto.createHash('sha256').update(session).digest('hex'),user.id]);
   return res.status(200).json({success:true,message:'Success',user:publicUser(user),token:session});
  }
  if(resource==='categories') {
   if(method==='GET')return res.json((await pool.query('SELECT c.*,count(p.id)::int "productsCount" FROM sfaxstore.categories c LEFT JOIN sfaxstore.products p ON p.category_id=c.id GROUP BY c.id ORDER BY c.id')).rows);
   admin(); if(method==='POST'||method==='PUT') { if(!String(body.name||'').trim())fail(400,'Category name is required.'); const values=[body.name,body.description||''];const q=method==='POST'?'INSERT INTO sfaxstore.categories(name,description) VALUES($1,$2) RETURNING *':'UPDATE sfaxstore.categories SET name=$1,description=$2 WHERE id=$3 RETURNING *';if(method==='PUT')values.push(id);return res.json((await pool.query(q,values)).rows[0]); }
   if(method==='DELETE'){await pool.query('DELETE FROM sfaxstore.categories WHERE id=$1',[id]);return res.status(204).end();}
  }
  if(resource==='products') {
   if(method==='GET'){ const params=[],conditions=[];if(id){params.push(id);conditions.push('p.id=$'+params.length);}if(url.searchParams.get('search')){params.push('%'+url.searchParams.get('search')+'%');conditions.push('(p.name ILIKE $'+params.length+' OR p.description ILIKE $'+params.length+')');}if(Number(url.searchParams.get('categoryId'))){params.push(Number(url.searchParams.get('categoryId')));conditions.push('p.category_id=$'+params.length);} const rows=(await pool.query(productSelect+(conditions.length?' WHERE '+conditions.join(' AND '):'')+' ORDER BY p.id',params)).rows.map(product);if(id&&!rows.length)fail(404,'Product not found.');return res.json(id?rows[0]:rows); }
   admin();if(method==='POST'||method==='PUT'){if(!String(body.name||'').trim()||!Number.isFinite(Number(body.price))||Number(body.price)<0||!Number.isInteger(Number(body.stock))||Number(body.stock)<0||!/^https:\/\//.test(body.imageUrl||'')&&!/^\/api\/images\//.test(body.imageUrl||''))fail(400,'Invalid product fields.');const values=[body.name,body.description||'',Number(body.price),Number(body.stock),body.imageUrl,Number(body.categoryId)];let result;if(method==='POST')result=await pool.query('INSERT INTO sfaxstore.products(name,description,price,stock,image_url,category_id) VALUES($1,$2,$3,$4,$5,$6) RETURNING id',values);else {values.push(id);result=await pool.query('UPDATE sfaxstore.products SET name=$1,description=$2,price=$3,stock=$4,image_url=$5,category_id=$6 WHERE id=$7 RETURNING id',values);}if(!result.rows.length)fail(404,'Product not found.');return res.json(product((await pool.query(productSelect+' WHERE p.id=$1',[result.rows[0].id])).rows[0]));}
   if(method==='DELETE'){await pool.query('DELETE FROM sfaxstore.products WHERE id=$1',[id]);return res.status(204).end();}
  }
  if(resource==='images') {
   if(method==='GET'){const row=(await pool.query('SELECT * FROM sfaxstore.images WHERE id=$1',[rawId])).rows[0];if(!row)fail(404,'Image not found.');res.setHeader('Content-Type',row.mime);res.setHeader('Cache-Control','public,max-age=31536000,immutable');return res.send(row.content);}
   admin();if(method==='POST'){const data=String(body.data||'');if(data.length>2800000)fail(400,'Image maximum: 2 MB.');const match=data.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);if(!match)fail(400,'Choose a PNG, JPEG or WebP image.');const content=Buffer.from(match[2],'base64');if(content.length>2*1024*1024)fail(400,'Image maximum: 2 MB.');const mime=match[1];const valid=mime==='image/png'?content.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):mime==='image/jpeg'?content[0]===255&&content[1]===216:content.toString('ascii',0,4)==='RIFF'&&content.toString('ascii',8,12)==='WEBP';if(!valid)fail(400,'Invalid image.');const imageId=crypto.randomUUID();await pool.query('INSERT INTO sfaxstore.images(id,mime,content) VALUES($1,$2,$3)',[imageId,mime,content]);return res.json({url:'/api/images/'+imageId});}
  }
  if(resource==='users') {admin();if(method==='GET')return res.json((await pool.query('SELECT * FROM sfaxstore.users ORDER BY id')).rows.map(publicUser));if(current.id===id)fail(400,'You cannot change your own administrative access.');if(method==='DELETE'){await pool.query('DELETE FROM sfaxstore.users WHERE id=$1',[id]);return res.status(204).end();}if(method==='PUT'){let query;if(action==='role'){if(!['ADMIN','USER'].includes(body.role))fail(400,'Invalid role.');query=await pool.query('UPDATE sfaxstore.users SET role=$1 WHERE id=$2 RETURNING *',[body.role,id]);}else if(action==='active')query=await pool.query('UPDATE sfaxstore.users SET active=NOT active WHERE id=$1 RETURNING *',[id]);else fail(404,'Not found.');if(!query.rows[0])fail(404,'User not found.');return res.json(publicUser(query.rows[0]));}}
  if(resource==='orders') {
   requireUser();if(method==='GET'){const rows=await orders(pool,current.role==='ADMIN'?null:current.id);const row=id?rows.find(o=>o.id===id):rows;if(id&&!row)fail(404,'Order not found.');return res.json(row);}
   if(method==='POST') {
    if(!Array.isArray(body.items)||!body.items.length||body.items.length>100)fail(400,'Your cart is empty or too large.');
    if(!body.shippingInfo || !['fullName','email','phone','address','city','zipCode','country'].every(key=>typeof body.shippingInfo[key]==='string'&&body.shippingInfo[key].trim().length>0&&body.shippingInfo[key].length<=250))fail(400,'Complete your shipping details.');
    if(Number(body.giftCardDiscount)>0)fail(400,'Online gift-card payment is not configured.');
    const quantities=new Map();for(const item of body.items){if(!Number.isInteger(Number(item.productId))||!Number.isInteger(Number(item.quantity))||item.quantity<1||item.quantity>1000)fail(400,'Invalid quantity.');quantities.set(Number(item.productId),(quantities.get(Number(item.productId))||0)+Number(item.quantity));}
    const db=await pool.connect();try{await db.query('BEGIN');let subtotal=0;const entries=[];for(const productId of [...quantities.keys()].sort((a,b)=>a-b)){const p=(await db.query('SELECT * FROM sfaxstore.products WHERE id=$1 FOR UPDATE',[productId])).rows[0];const quantity=quantities.get(productId);if(!p||p.stock<quantity)fail(409,'Insufficient stock.');subtotal+=Math.round(Number(p.price)*100)*quantity;entries.push({p,quantity});}
    const total=(subtotal+Math.round(subtotal*0.08)+(subtotal<10000?999:0))/100;
    const row=(await db.query('INSERT INTO sfaxstore.orders(user_id,total,shipping) VALUES($1,$2,$3) RETURNING *',[current.id,total,body.shippingInfo?JSON.stringify(body.shippingInfo):null])).rows[0];
    for(const {p,quantity} of entries){await db.query('INSERT INTO sfaxstore.order_items(order_id,product_id,quantity,unit_price) VALUES($1,$2,$3,$4)',[row.id,p.id,quantity,p.price]);await db.query('UPDATE sfaxstore.products SET stock=stock-$1,sold=sold+$1 WHERE id=$2',[quantity,p.id]);}
    await db.query('COMMIT');return res.status(201).json({id:row.id,userId:current.id,totalAmount:total,status:row.status,createdAt:row.created_at});
    }catch(error){await db.query('ROLLBACK');throw error;}finally{db.release();}
   }
   if(method==='PUT'&&action==='status'){admin();if(!['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'].includes(body.status))fail(400,'Invalid status.');const db=await pool.connect();try{await db.query('BEGIN');const old=(await db.query('SELECT * FROM sfaxstore.orders WHERE id=$1 FOR UPDATE',[id])).rows[0];if(!old)fail(404,'Order not found.');if(old.status==='CANCELLED'&&body.status!=='CANCELLED')fail(400,'Cancelled orders cannot be reopened.');if(old.status!=='CANCELLED'&&body.status==='CANCELLED')await db.query('UPDATE sfaxstore.products p SET stock=p.stock+i.quantity,sold=p.sold-i.quantity FROM sfaxstore.order_items i WHERE i.order_id=$1 AND p.id=i.product_id',[id]);await db.query('UPDATE sfaxstore.orders SET status=$1 WHERE id=$2',[body.status,id]);await db.query('COMMIT');return res.json((await orders(pool)).find(o=>o.id===id));}catch(e){await db.query('ROLLBACK');throw e;}finally{db.release();}}
  }
  if(resource==='dashboard'){admin();const products=(await pool.query(productSelect)).rows.map(product),allOrders=await orders(pool);const categories=(await pool.query('SELECT * FROM sfaxstore.categories')).rows;const months=Array.from({length:6},(_,i)=>{const d=new Date();d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()-5+i);return d.toISOString().slice(0,7);});const good=allOrders.filter(o=>o.status!=='CANCELLED');if(rawId==='stats')return res.json({totalProducts:products.length,totalCategories:categories.length,totalOrders:allOrders.length,totalUsers:Number((await pool.query('SELECT count(*) FROM sfaxstore.users')).rows[0].count),totalRevenue:good.reduce((a,o)=>a+o.totalAmount,0),monthlyOrders:allOrders.filter(o=>new Date(o.createdAt).toISOString().slice(0,7)===months[5]).length,lowStockProducts:products.filter(p=>p.stock<=5).length,topProducts:products.sort((a,b)=>b.sold-a.sold).slice(0,5),recentOrders:allOrders.slice(0,5)});if(rawId==='orders-by-month'||rawId==='revenue')return res.json(months.map(label=>({label,value:(rawId==='revenue'?good:allOrders).filter(o=>new Date(o.createdAt).toISOString().slice(0,7)===label).reduce((n,o)=>n+(rawId==='revenue'?o.totalAmount:1),0)})));if(rawId==='products-by-category')return res.json(categories.map(c=>({category:c.name,value:products.filter(p=>p.categoryId===c.id).length})));if(rawId==='orders-by-status')return res.json(['PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'].map(category=>({category,value:allOrders.filter(o=>o.status===category).length})));}
  fail(404,'Not found.');
 } catch(error){if(error.code==='23505')return res.status(409).json({message:'This email or item already exists.'});if(error.code==='23503')return res.status(400).json({message:'This item is referenced by another record.'});console.error('API error',error.code||error.status||'internal');res.status(error.status||500).json({message:error.status?error.message:'The server could not complete this request.'});}
};
