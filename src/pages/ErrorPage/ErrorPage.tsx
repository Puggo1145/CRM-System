import { Link } from 'react-router-dom'

import './ErrorPage.css'

import errorImg from '../../static/ErrorPage/404-Error.svg'

export default function ErrorPage() {
  return (
    <div className="errorPage-wrapper">
        <img src={errorImg} />
        <h3>您访问的页面不存在</h3>
        <Link className='errorPage-backBtn' to="/">返回</Link>
    </div>
  )
}
