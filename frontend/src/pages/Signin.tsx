
import Quote from '../components/Quote'
import Auth from '../components/Auth'

const Signin = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2'>
    
    <div className='hidden lg:block'>
    <Quote/>
    </div>
    <div>
        <Auth type="signin"/>
    </div>
    </div>
  )
}

export default Signin