'use client'

import React from 'react'
import { GiShipWheel } from "react-icons/gi";
import { FaHotel, FaUserShield } from "react-icons/fa6";
import { PiSunHorizonBold } from "react-icons/pi";
import Link from 'next/link'
import { useAppSelector } from '@/app/hooks'
import { RootState } from '@/app/lib/store'

const Cards = () => {
  const user = useAppSelector((state: RootState) => state.auth.user)
  const isSuperAdmin = Array.isArray(user?.roles) && user.roles.includes('super-admin')

  const cards = [
    {
      id: 1,
      path: '/listHotels',
      title: 'Hotels',
      description: 'Availibility and prices for hotels around the world',
      icon: <FaHotel />,
    },
    {
      id: 2,
      path: '/listCruises',
      title: 'Cruises',
      description: 'Availibility and prices for cruises around the world',
      icon: <GiShipWheel />,
    },
    {
      id: 3,
      path: '/activities',
      title: 'Activities',
      description: 'Availibility and prices for activities in Ecuador',
      icon: <PiSunHorizonBold />,
    },
    {
      id: 5,
      path: '/cruises/availability',
      title: 'Cruises Availability',
      description: 'Availability and prices for cruises',
      icon: <GiShipWheel />,
  
    },
    ...(isSuperAdmin ? [{
      id: 4,
      path: '/listUsers',
      title: 'Users',
      description: 'Users of the system',
      icon: <FaUserShield />,
    }] : [])
  ]

  return (
    <div className='w-full'>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-1 lg:grid-cols-3'>
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.path}
            className='p-4 bg-white rounded-lg shadow-md text-center hover:shadow-lg transition-shadow'
          >
            <div className='flex items-center justify-center w-16 h-16 mx-auto mb-4 text-white bg-indigo-500 rounded-full'>
              {card.icon}
            </div>
            <h2 className='text-xl font-semibold'>{card.title}</h2>
            <p className='mt-2 text-gray-600'>{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Cards
