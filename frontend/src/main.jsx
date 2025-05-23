import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'typeface-poppins';
import Landing from './screens/client/Landing/Landing.jsx'
import SignUp from './screens/client/SignUp/SignUp.jsx'
import Login from './screens/client/LogIn/Login.jsx'
import ViewProducts from './screens/client/ViewProducts/ViewProducts.jsx'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Contact from './screens/client/Contact/Contact.jsx';
import RentNow from './screens/client/RentNow/RentNow.jsx';
import ProductDetails from './screens/client/ProductDetails/ProductDetails.jsx';
import Dashboard from './screens/admin/Dashboard.jsx';
import Orders from './screens/admin/Orders.jsx';
import MyOrders from './screens/client/MyOrder/MyOrders.jsx';
import UserProfile from './screens/client/Profile/Profile.jsx';
import CartPage from './screens/client/Cart/Cart';
import RentNowMultiple from './screens/client/RentNow/RentNowMultiple.jsx';
import Notification from './screens/client/Notification/Notification.jsx';
import AdminNotification from './screens/admin/AdminNotification.jsx';
import UserList from './screens/admin/UserList.jsx';
import ForgotPassword from './screens/client/LogIn/ForgotPassword.jsx';

// const role = "client"//admin

import ProtectedRoute from './ProtectedRoutes.jsx';

// const role = localStorage.getItem("role") // You should get this from context or state ideally
// const token = localStorage.getItem("token") // You should get this from context or state ideally


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="contact" element={<Contact />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />

          {/* CLIENT Routes */}

           <Route path="home" element={
            <ProtectedRoute allowedRoles={['customer']} >
              <Landing /></ProtectedRoute>
          } />
           <Route path="products" element={
            <ProtectedRoute allowedRoles={['customer']} >
              <ViewProducts /></ProtectedRoute>
          } />
           <Route path="buyproduct/:id" element={
            <ProtectedRoute allowedRoles={['customer']} >
              <RentNow /></ProtectedRoute>
          } />
           <Route path="/rent-now/multi" element={
            <ProtectedRoute allowedRoles={['customer']} >
              <RentNowMultiple /></ProtectedRoute>
          } />
           <Route path="product/:productId" element={
            <ProtectedRoute allowedRoles={['customer']} >
              <ProductDetails /></ProtectedRoute>
          } />

          <Route path="myorders" element={
            <ProtectedRoute allowedRoles={['customer']} >
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path="myprofile" element={
            <ProtectedRoute allowedRoles={['customer']} >
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="cart" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="notification" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Notification />
            </ProtectedRoute>
          } />

          {/* ADMIN Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['admin']} >
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute allowedRoles={['admin']} >
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="adminnotification" element={
            <ProtectedRoute allowedRoles={['admin']} >
              <AdminNotification />
            </ProtectedRoute>
          } />
          <Route path="allusers" element={
            <ProtectedRoute allowedRoles={['admin']} >
              <UserList />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  </StrictMode>
);
