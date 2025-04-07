import React from 'react'
import Header from '../components/Header'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const Contact = () => {
  // You'll need to replace this with your actual Google Maps API key
  const googleMapsApiKey = "AIzaSyBnfPzI2CsID6qiooFJ3FO7v1g4tl68qnc"

  // Business location coordinates
  const businessLocation = {
    lat: 37.7749,
    lng: -122.4194
  }

  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-[#FFAD33] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white text-center">Contact Us</h1>
          <p className="mt-4 text-xl text-slate-200 text-center">
            We're here to help with your rental needs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Google Map Section */}
          <div className="bg-white shadow-md rounded-lg p-6 md:order-2">
            <h2 className="text-2xl font-semibold mb-6">Our Location</h2>

            {/* Google Map integration */}
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={businessLocation}
                zoom={14}
              >
                <Marker position={businessLocation} />
              </GoogleMap>
            </LoadScript>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800">Address</h3>
              <p className="mt-2 text-gray-600">
                123 Rental Plaza<br />
                San Francisco, CA 94107
              </p>
            </div>

            <p className="mt-4 text-gray-600">
              Our main office and showroom is conveniently located in downtown San Francisco,
              with easy access to public transportation and nearby parking.
            </p>
          </div>

          {/* Contact Information with Numbers */}
          <div className="md:order-1">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>

            <div className="space-y-8">
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-medium text-gray-800">Rental Sales</h3>
                <p className="mt-2 text-gray-600">Need help choosing the right equipment?</p>
                <div className="mt-3 flex items-center">
                  <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+14155551234" className="ml-3 text-lg font-semibold text-blue-600 hover:underline">(415) 555-1234</a>
                </div>
                <p className="mt-2 text-sm text-gray-500">Available Mon-Fri: 9AM - 6PM</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <h3 className="text-xl font-medium text-gray-800">Customer Support</h3>
                <p className="mt-2 text-gray-600">Having issues with your rental?</p>
                <div className="mt-3 flex items-center">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+14155555678" className="ml-3 text-lg font-semibold text-green-600 hover:underline">(415) 555-5678</a>
                </div>
                <p className="mt-2 text-sm text-gray-500">Available 24/7 for emergencies</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-xl font-medium text-gray-800">Corporate Rentals</h3>
                <p className="mt-2 text-gray-600">Need bulk rentals for your business?</p>
                <div className="mt-3 flex items-center">
                  <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+14155559876" className="ml-3 text-lg font-semibold text-purple-600 hover:underline">(415) 555-9876</a>
                </div>
                <p className="mt-2 text-sm text-gray-500">Available Mon-Fri: 9AM - 5PM</p>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500">
                <h3 className="text-xl font-medium text-gray-800">Equipment Returns</h3>
                <p className="mt-2 text-gray-600">Schedule returns and receive refunds</p>
                <div className="mt-3 flex items-center">
                  <svg className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+14155554321" className="ml-3 text-lg font-semibold text-amber-600 hover:underline">(415) 555-4321</a>
                </div>
                <p className="mt-2 text-sm text-gray-500">Available Mon-Sat: 8AM - 7PM</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800">Email Us</h3>
              <p className="mt-2 text-gray-600">
                General Inquiries: <a href="mailto:info@rentalco.com" className="text-blue-600 hover:underline">info@rentalco.com</a>
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-800">Business Hours</h3>
              <p className="mt-2 text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday: 10:00 AM - 4:00 PM<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">Why Choose Our Rental Service</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Available Items</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">50+</div>
              <div className="text-gray-600">Locations Nationwide</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact