import React from 'react'
import Skeleton , {SkeletonTheme} from 'react-loading-skeleton'

const SkeletonMoviecard = () => {
  return (
    <div>
      <SkeletonTheme baseColor="#313131" highlightColor="#525252" >
        <div className=' shadow-lg bg-background2 h-fit p-5 rounded-md mx-1 ' >
                <Skeleton height={320} className='rounded-lg my-3' />
                <div className=" flex justify-center items-center">
                    <Skeleton height={25} width={250} count={2} className='rounded-lg my-2' />
                </div>
                <div className="flex justify-center items-center">
                <Skeleton height={50} width={250} className='rounded-lg mt-2' />
                </div>
        </div>
      </SkeletonTheme>
    </div>
  )
}

export default SkeletonMoviecard
