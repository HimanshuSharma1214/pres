import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
       <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
          {/* {left section} */}
           <div>
              <img className='mb-5 w-40' src={assets.logo}/>
              <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus repellendus velit distinctio quaerat praesentium hic eius beatae quas fugit aperiam, molestiae, odio magnam. Velit adipisci recusandae porro. Corrupti perspiciatis veritatis labore dolor? Eligendi vitae officia possimus harum sed labore totam nesciunt, neque eos facere cumque. Dolores, dolorem! Culpa, suscipit impedit.</p>
           </div>
           {/* center */}
           <div>
              <p className='text-xl font-medium mb-5'>COMPANY</p>
              <ul className='flex flex-col gap-2 text-gray-600'>
                <li>Home</li>
                <li>About Us</li>
                <li>Contact us</li>
                <li>Privacy policy</li>
              </ul>
           </div>
           {/* {right} */}
           <div>
               <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
               <ul className='flex flex-col gap-2 text-gray-600'>
                  <li>+1-212-456-789</li>
                  <li>shimanshu@gmail.com</li>
               </ul>
           </div>
       </div>
       <div>
            <hr/>
            <p className='py-5 text-medium text-center'>Copyright 2024 @ Prescripto.com - All Right Reserved.</p>
       </div>
    </div>
  )
}

export default Footer
