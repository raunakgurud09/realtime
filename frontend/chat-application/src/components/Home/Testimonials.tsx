import { BookIcon } from 'lucide-react'
import MaxContainer from '../Common/MaxContainer'

const blogs = [{
  title: 'Mastering the Art of Real-Time Communication',
  date: 'Jan 13, 2024',
  readTime: '12',
  link: 'https://raunakgurud.hashnode.dev/websockets-unlocked-mastering-the-art-of-real-time-communication',
  intro: 'An Introduction to websockets and building chat-app using websockets with Socket.io, Node.js, and Next.JS · Hey there! 🌟 Ready to dive into the exciting...',
  img: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1705129128112/3d7964fd-c2a7-4ebf-895b-d041603fde46.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp'
},
{
  title: ' Mastering scale of websockets',
  date: 'Jan 26, 20244',
  readTime: '7',
  link: 'https://raunakgurud.hashnode.dev/mastering-scale-of-websockets',
  intro: 'Scaling strategies for creating reliable robust chat-applications using Redis and kafka · Intro Hey there! 🌟 Ready to dive into the exciting world of...',
  img: 'https://cdn.hashnode.com/res/hashnode/image/upload/v1706250809017/553359e8-8dd5-4390-ae47-2974ae5f6898.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp'
},
]

export default function Testimonials() {
  return (
    <MaxContainer>
      <div className='my-20 w-full h-fit'>
        <h3 className='text-5xl text-center mb-20'>Blogs</h3>
        <div className='flex flex-col gap-8  items-center justify-center'>
          {blogs.map((blog, idx) => {
            return <BlogCard key={idx} {...blog} />
          })}
        </div>
      </div>
    </MaxContainer>
  )
}

const BlogCard = ({ title, date, link, readTime, intro, img }: any) => {
  return (
    <a href={link} target='_blank' className='text-white w-[80%] flex cursor-pointer hover:border p-4 rounded-xl'>
      <div className='w-full flex flex-col gap-4'>
        <h3 className='text-4xl font-bold w-[85%]'>{title}</h3>
        <div className='flex gap-8'>
          <p>{date}</p>
          <p className='flex items-center justify-center gap-1'> <BookIcon size={16} />{readTime} min read</p>
        </div>
        <p>{intro}</p>
      </div>
      <div className='w-[60%]'>
        <img
          src={img}
          alt="blog-image"
          className='rounded-lg'
        />
      </div>
    </a>
  )
}