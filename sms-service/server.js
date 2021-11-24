const username = 'username';
const password = 'password';
const api = new MelipayamakApi(username,password);
const sms = api.sms();
const to = '09123456789';
const from = '5000...';
const text = 'تست وب سرویس ملی پیامک';
sms.send(to,from,text).then(res=>{
//RecId or Error Number
}).catch(err=>{
//
})