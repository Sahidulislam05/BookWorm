# 📚 BookWorm - Personal Reading Tracker

A full-stack book recommendation and reading tracker application built with Next.js 16, TypeScript, Express, and MongoDB.

## ✨ Features

### User Features

- 📖 **Personal Library Management** - Organize books into Want to Read, Currently Reading, and Read shelves
- 📊 **Reading Progress Tracking** - Track pages read and reading progress
- ⭐ **Book Reviews & Ratings** - Write and share book reviews
- 🎯 **Reading Goals** - Set and track annual reading goals
- 📈 **Reading Statistics** - Visualize reading habits with interactive charts
- 💡 **Personalized Recommendations** - Get book recommendations based on reading history
- 🎥 **Tutorial Videos** - Watch curated book-related YouTube tutorials
- 👥 **Social Features** - Follow other readers and see their activity

### Admin Features

- 📚 **Book Management** - Add, edit, and delete books with cover image uploads
- 🏷️ **Genre Management** - Create and manage book categories
- 👥 **User Management** - Manage users and assign admin roles
- ✅ **Review Moderation** - Approve or reject user-submitted reviews
- 🎥 **Tutorial Management** - Add and manage YouTube video links
- 📊 **Analytics Dashboard** - View platform statistics and insights

## 🚀 Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Beautiful UI components
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Hook Form** - Form handling

### Backend

- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Cloudinary** - Image upload and storage
- **Bcrypt** - Password hashing

## 📦 Installation

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Backend Setup

1. Clone the repository and navigate to backend:

```bash
cd bookworm-backend
npm install
```

2. Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
```

3. Run the server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend:

```bash
cd bookworm-frontend
npm install
```

2. Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 🔐 Default Credentials

After seeding or creating users:

**Admin:**

- Email: admin@bookworm.com
- Password: admin123

**User:**

- Email: user@bookworm.com
- Password: user123

## 📁 Project Structure

```
bookworm-backend/
├── models/          # Mongoose schemas
├── routes/          # API routes
├── controllers/     # Route controllers
├── middleware/      # Auth & error handling
├── config/          # DB & Cloudinary config
└── server.js        # Entry point

bookworm-frontend/
├── src/
│   ├── app/             # Next.js pages
│   ├── components/      # React components
│   ├── context/         # Auth context
│   ├── lib/             # Utilities & API client
│   └── types/           # TypeScript types
```

## 🎨 Key Features Implementation

### Authentication

- JWT-based authentication
- Token stored in both cookies and localStorage
- Protected routes with role-based access control

### Image Upload

- Cloudinary integration for book covers and profile photos
- Automatic image optimization

### Recommendations Algorithm

- Based on user's reading history
- Considers favorite genres, ratings, and popular books
- Fallback for new users with limited data

### Charts & Statistics

- Genre breakdown (Doughnut chart)
- Monthly reading progress (Line chart)
- Books per genre (Bar chart)
- Reading goal progress tracker

## 🌐 Deployment

### Backend (Railway/Render)

1. Set environment variables
2. Deploy from GitHub repository
3. Update FRONTEND_URL to production URL

### Frontend (Vercel)

1. Import GitHub repository
2. Set environment variables
3. Deploy

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Books

- `GET /api/books` - Get all books (with filters)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin)
- `PUT /api/books/:id` - Update book (Admin)
- `DELETE /api/books/:id` - Delete book (Admin)

### Library

- `GET /api/library` - Get user's library
- `POST /api/library` - Add book to shelf
- `PUT /api/library/:id` - Update shelf/progress
- `DELETE /api/library/:id` - Remove from shelf

### Reviews

- `GET /api/reviews` - Get all reviews (Admin)
- `GET /api/reviews/book/:id` - Get book reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id/status` - Update review status (Admin)
- `DELETE /api/reviews/:id` - Delete review (Admin)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Sahidul Islam**

## 🙏 Acknowledgments

- Shadcn/UI for beautiful components
- Cloudinary for image hosting
- Chart.js for data visualization
