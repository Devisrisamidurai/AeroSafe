# Authentication Testing Guide

This guide will help you verify that the JWT authentication system is working correctly.

## Prerequisites

1. **Database Setup**
   - Run the SQL script: `backend/AeroSafeBackend/Database/aerosafe_schema.sql`
   - Update `appsettings.json` with your MySQL connection string if needed

2. **Backend Running**
   - Start the backend: `cd backend/AeroSafeBackend && dotnet run`
   - Backend should be running on `http://localhost:5121`
   - Swagger UI should be accessible at `http://localhost:5121/swagger/index.html`

3. **Frontend Running**
   - Start the frontend: `cd frontend/aerosafe-frontend && npm run dev`
   - Frontend should be running on `http://localhost:5173`

---

## Testing Steps

### Test 1: Admin Signup

1. **Via Frontend:**
   - Go to `http://localhost:5173`
   - Click "Create Admin Account"
   - Fill in the form:
     - Name: `John Admin`
     - Email: `admin@aerosafe.com`
     - Admin ID: `AS-ADM-001`
     - Password: `Admin123!`
     - Confirm Password: `Admin123!`
   - Click "Signup"
   - You should be redirected to `/verify` page showing authentication success

2. **Verify in Database:**
   ```sql
   USE aerosafe;
   SELECT * FROM admins WHERE email = 'admin@aerosafe.com';
   ```
   - You should see the admin record with hashed password

3. **Verify JWT Token:**
   - Open browser DevTools (F12)
   - Go to Application/Storage → Local Storage
   - Check for `token` key - should contain a JWT token
   - Check for `user` key - should contain user info as JSON

### Test 2: Admin Login

1. **Via Frontend:**
   - Go to `http://localhost:5173/login`
   - Select Role: `Admin`
   - Enter:
     - Email: `admin@aerosafe.com`
     - Password: `Admin123!`
   - Click "Login"
   - You should be redirected to `/verify` page

2. **Verify Token:**
   - The `/verify` page should show:
     - User information from localStorage
     - JWT token verification from backend
     - Both should match

### Test 3: Pilot Signup

1. **Via Frontend:**
   - Go to `http://localhost:5173/pilot-signup`
   - Fill in the form:
     - Name: `Jane Pilot`
     - Email: `pilot@aerosafe.com`
     - Pilot ID: `AS-PLT-001`
     - Password: `Pilot123!`
     - Confirm Password: `Pilot123!`
   - Click "Signup"
   - You should be redirected to `/verify` page

2. **Verify in Database:**
   ```sql
   USE aerosafe;
   SELECT * FROM pilots WHERE email = 'pilot@aerosafe.com';
   ```
   - You should see the pilot record with hashed password

### Test 4: Pilot Login

1. **Via Frontend:**
   - Go to `http://localhost:5173/login`
   - Select Role: `Pilot`
   - Enter:
     - Email: `pilot@aerosafe.com`
     - Password: `Pilot123!`
   - Click "Login"
   - You should be redirected to `/verify` page

### Test 5: JWT Token Verification (Backend API)

1. **Get Token from localStorage:**
   - After login, open DevTools → Application → Local Storage
   - Copy the `token` value

2. **Test via Swagger:**
   - Go to `http://localhost:5121/swagger/index.html`
   - Find `GET /api/auth/verify`
   - Click "Try it out"
   - Click "Authorize" button at the top
   - Enter: `Bearer <your-token-here>` (replace with actual token)
   - Click "Authorize" then "Close"
   - Click "Execute"
   - You should get a 200 response with user information

3. **Test via cURL:**
   ```bash
   curl -X GET "http://localhost:5121/api/auth/verify" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json"
   ```

### Test 6: Invalid Credentials

1. **Wrong Password:**
   - Try logging in with wrong password
   - Should show error: "Invalid email or password"

2. **Wrong Email:**
   - Try logging in with non-existent email
   - Should show error: "Invalid email or password"

3. **Wrong Role:**
   - Signup as Admin, try to login as Pilot (or vice versa)
   - Should show error: "Invalid email or password"

### Test 7: Duplicate Signup

1. **Try to signup with same email:**
   - Attempt to create another account with `admin@aerosafe.com`
   - Should show error: "Email already registered"

2. **Try to signup with same ID:**
   - Attempt to create another admin with `AS-ADM-001`
   - Should show error: "Admin ID already exists"

### Test 8: Token Expiration (Optional)

1. **Check Token Expiry:**
   - JWT tokens are set to expire in 24 hours (1440 minutes)
   - You can decode the token at `https://jwt.io` to see expiration time

---

## Verification Checklist

After completing all tests, verify:

- [ ] Admin signup stores data in `admins` table
- [ ] Pilot signup stores data in `pilots` table
- [ ] Passwords are hashed (not stored in plain text)
- [ ] JWT token is generated on signup
- [ ] JWT token is generated on login
- [ ] Token is stored in localStorage
- [ ] User info is stored in localStorage
- [ ] Login works with correct credentials
- [ ] Login fails with wrong credentials
- [ ] `/api/auth/verify` endpoint validates JWT token
- [ ] Token contains correct user information
- [ ] Role-based authentication works
- [ ] Duplicate email signup is prevented
- [ ] Duplicate ID signup is prevented

---

## Expected Database State

After running all tests, your database should have:

```sql
-- Check admins
SELECT id, admin_uid, full_name, email, created_at FROM admins;

-- Check pilots  
SELECT id, pilot_uid, full_name, email, fatigue_flag, created_at FROM pilots;
```

Both tables should have records with:
- Hashed passwords (not visible plain text)
- Unique emails
- Unique UIDs
- Timestamps

---

## Troubleshooting

### Issue: "JWT Key not configured"
- **Solution:** Check `appsettings.json` has `Jwt:Key` set

### Issue: "Connection string error"
- **Solution:** Update `appsettings.json` with correct MySQL credentials

### Issue: "CORS error"
- **Solution:** Ensure backend CORS allows `http://localhost:5173`

### Issue: "404 on API calls"
- **Solution:** Check backend is running on port 5121 and frontend API URL is correct

### Issue: "Token verification fails"
- **Solution:** Check token hasn't expired, and JWT secret matches in backend

---

## Success Indicators

✅ **Authentication is working correctly if:**
1. Signup creates records in database with hashed passwords
2. Login generates valid JWT tokens
3. Tokens can be verified by backend
4. User information is correctly stored and retrieved
5. Role-based access is enforced
6. Invalid credentials are rejected
7. Duplicate signups are prevented

---

## Next Steps

Once authentication is verified:
1. Create Admin Dashboard (`/admin-dashboard`)
2. Create Pilot Dashboard (`/pilot-dashboard`)
3. Implement protected routes
4. Add logout functionality
5. Add token refresh mechanism (optional)

