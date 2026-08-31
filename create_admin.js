import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, ...val] = line.split('=');
    if (key) {
      env[key.trim()] = val.join('=').trim();
    }
  }
});

const url = env['SUPABASE_URL'];
const key = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!url || !key) {
  console.error("Missing URL or key");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

async function run() {
  const email = "bm3595352@gmail.com";
  const password = "Tahirmustafa.1";

  // Check if user exists
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("Error listing users:", listError.message);
  } else {
    const existing = users.users.find(u => u.email === email);
    if (existing) {
      console.log("Admin user already exists. Updating password...");
      const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, { password, email_confirm: true });
      if (updateError) {
        console.error("Failed to update password:", updateError.message);
      } else {
        console.log("Password updated successfully.");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
      }
      return;
    }
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("Failed to create admin:", error.message);
  } else {
    console.log("Admin user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  }
}

run();
