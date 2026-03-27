import { Star } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

const HotelCard = ({ hotel }) => {
  if (!hotel) return null;

  return (
    <Link to="#">
      <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition'>
        
        {/* Image */}
        <div className='h-40 bg-gray-200 relative'>
          <img 
            src={'/private.png'} 
            alt={hotel.hotelName} 
            className='h-full w-full object-cover' 
          />

          {/* Rating */}
          <div className='absolute top-3 right-3 bg-white px-2 py-1 rounded-md shadow-sm text-xs font-bold flex items-center'>
            <Star className='w-3 h-3 text-yellow-400 mr-1 fill-yellow-400' />
            {hotel.rating || "4.5"}
          </div>
        </div>

        {/* Content */}
        <div className='p-5'>
          <span className='text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 block'>
            Where you'll stay
          </span>

          <p className='text-xs text-gray-500 mt-1 mb-2 line-clamp-1'>
            📍 {hotel.hotelAddress}
          </p>

          <p className='text-sm mt-1 mb-2 line-clamp-3'>
            {hotel.description}
          </p>

          <div className='flex justify-between items-center mt-auto pt-3'>
            <div>
              <h5>
               {hotel?.priceRange ? hotel.priceRange.split(' p')[0] : "₹2000"}
              </h5>
              <span className='text-[10px] text-gray-500 font-normal uppercase'>
                est per night
              </span>
            </div>

            <Button variant='destructive'>View Deal</Button>
          </div>
        </div>

      </div>
    </Link>
  )
}

export default HotelCard;