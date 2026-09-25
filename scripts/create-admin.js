// Run in a terminal: node scripts/create-admin.js admin
// Password never appears in the command line, source files or output.
const {validUsername, makePasswordRecord} = require('../lib/stats-auth');
const name = (process.argv[2] || '').toLowerCase();
if (!validUsername(name) || !process.stdin.isTTY) {
  console.error('วิธีใช้: node scripts/create-admin.js admin (เปิดใน Terminal)');
  process.exit(1);
}
let password = '';
process.stdout.write('ตั้งรหัสผ่านแอดมิน (อย่างน้อย 12 ตัวอักษร): ');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', char => {
  if (char === '\u0003') { process.stdout.write('\n'); process.exit(130); }
  if (char === '\r' || char === '\n') {
    process.stdin.setRawMode(false);
    process.stdout.write('\n');
    try {
      const record = makePasswordRecord(password);
      console.log(`สร้างโหนดใน Realtime Database ที่ kcSmartAdminUsers/${name} แล้ววาง JSON นี้:`);
      console.log(JSON.stringify(record, null, 2));
      process.exit(0);
    } catch (error) { console.error(error.message); process.exit(1); }
  }
  else if (char === '\u007f' || char === '\b') password = password.slice(0, -1);
  else password += char;
});
