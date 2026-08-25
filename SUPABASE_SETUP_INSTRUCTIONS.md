# Craftifyy Database & Storage Setup Instructions

Follow these simple steps in your Supabase dashboard to set up your database tables, seed products, promotional offers, and configuration buckets:

## 1. Run the Database & Storage Setup SQL
1. Open the [Supabase Dashboard](https://supabase.com/).
2. Select your project **`nzaithqyfmuhkyuqmjvg`**.
3. In the left-hand navigation bar, click on **SQL Editor** (the `>_` icon).
4. Click **New Query**.
5. Copy the entire contents of the local file **[SUPABASE_SETUP.sql](file:///c:/Users/HI/Desktop/little-love-crafts/SUPABASE_SETUP.sql)**.
6. Paste the query into the editor window and click the **Run** button at the bottom-right.
   *(This SQL creates the profiles, products, reviews, offers tables, default seed listings, is_admin security definers, RLS policies, the product-images bucket, and its storage upload policies).*

---

## 2. Register Your Owner Account
1. Open your local website: **[http://localhost:8000/index.html](http://localhost:8000/index.html)**.
2. Navigate to **Login / Register** page.
3. Click the **Register** tab and sign up a new account using your desired **Owner Mobile Number** (e.g. `7892510154`) and a secure password.

---

## 3. Promote Your Profile to Administrator
1. In your **Supabase Dashboard**, click on the **SQL Editor** again.
2. Click **New Query**.
3. Run the following update query (replace `YOUR_PHONE_NUMBER` with the mobile number you just registered, e.g. `7892510154`):
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE phone = 'YOUR_PHONE_NUMBER';
   ```
4. Click **Run**. Your account now has full Owner privileges.

---

## 4. Test the Owner Dashboard Access
1. Return to your browser and log out of the storefront if you are logged in.
2. Navigate directly to the Owner Login portal: **[http://localhost:8000/admin/login.html](http://localhost:8000/admin/login.html)**.
3. Log in with your newly promoted administrative credentials.
4. You will be successfully redirected to the **Owner Dashboard** where you can live test adding, editing, or deleting products, uploading product photos, and creating promotional discount offers directly in your Supabase database.
