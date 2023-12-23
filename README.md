# **Blog Application Backend**

### **Live Link: https://my-blog-website-zeta.vercel.app**

### **Backend Live Link: https://my-blog-onq714b0x-mdminhazulislamkhan.vercel.app**

### **Frontend Github: https://github.com/MDMinhazulIslamKhan/blog_website_frontend**

---

---

### **Requirement analysis - [_click here_](https://docs.google.com/document/d/18lfhoclTCBnQt0ibAPOQ6LJ0iFZRzJxIETWWBo5Ix4c/edit?usp=drive_link)**

### **ER Diagram - [_click here_](https://drive.google.com/file/d/1sVKRqWiRZs-2v5SxnttlzjSkPEfe0vba/view?usp=drive_link)**

---

## Used Technology

- TypeScript
- NodeJs
  - ExpressJs
- MongoDB
  - Mongoose
- Zod
- Jsonwebtoken
- Bcrypt
- Cors
- Cookie-parser
- Dotenv
- Ts-node-dev
- Http-status
- ESLint
- Prettier
- Lint-staged
- Husky

## Frontend Technology

- TypeScript
- NextJs
- Redux
  - Redux Toolkit
- Axios
- React-quill
- React Hook form
  - Hook Form Resolvers
- Yup
- Tailwind
- Jwt-decode
- ESLint

## Functional Requirement

- Open

  - Sign up
  - Login
  - View all blogs with pagination and searching
  - View blog details

- User

  - See profile
  - Update profile
  - Change password
  - Create blog
  - Update blog
  - Delete blog
  - Like on blog
  - Remove like
  - Comment on blog
  - Delete own comment
  - Replay on comment
  - Delete own replay

## API Endpoints

- Auth route

  - /auth/signup (post)
  - /auth/login (post)
  - /auth/profile (get)
  - /auth/profile (patch)
  - /auth/change-password (patch)

- Blog route

  - /blog (post) ⇒ (for create blog)
  - /blog/:id (patch) ⇒ (for update blog)
  - /blog/:id (delete) ⇒ (for delete blog)
  - /blog (get) ⇒ (for getting all blogs with pagination and filtering)
  - /blog/:id (get) ⇒ (for getting blog details)
  - /blog/like/:id (post) ⇒ (for like on a blog)
  - /blog/remove-like/:id (delete) ⇒ (for remove like from a blog)
  - /blog/:blogId/comment (post) ⇒ (for comment on a blog)
  - /blog/:blogId/comment/:commentId (patch) ⇒ (for update own comment)
  - /blog/:blogId/comment/:commentId (delete) ⇒ (for delete own comment)
  - /blog/:blogId/comment/:commentId/replay (post) ⇒ (for replay on a comment)
  - /blog/:blogId/comment/:commentId/replay/:replayId (patch) ⇒ (for update own replay)
  - /blog/:blogId/comment/:commentId/replay/:replayId (delete) ⇒ (for delete own replay)
