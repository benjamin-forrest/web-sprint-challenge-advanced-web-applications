import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate('/') }
  const redirectToArticles = () => { navigate('/articles') }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    window.localStorage?.removeItem('token')
    // and a message saying "Goodbye!" should be set in its proper state.
    setMessage("Goodbye!")
    // In any case, we should redirect the browser back to the login screen,
    redirectToLogin()
    // using the helper above.
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('')
    setSpinnerOn(true)
    // and launch a request to the proper endpoint.
    axios.post(loginUrl, {username, password})
      .then(res => {
        window.localStorage.setItem('token', res.data.token)
        setMessage(res.data.message)
        redirectToArticles()
        setSpinnerOn(false)
      })
      .catch(err =>{
        console.error(err)
      })
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage('')
    setSpinnerOn(true)
    // and launch an authenticated request to the proper endpoint.
    axiosWithAuth().get(articlesUrl)
      .then(res =>{
        setArticles(res.data.articles)
        setMessage(res.data.message)
      })
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    .catch(err=>{
      err.res.status === 401 ? redirectToLogin() : console.error(err)
    })
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    .finally(() =>{
      setSpinnerOn(false)
    })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    setSpinnerOn(true)
    axiosWithAuth().post(articlesUrl, article)
    .then(res=>{
      setArticles([...articles, res.data.article])
      setMessage(res.data.message)
    })
    .catch(err=>{
      err.res.status === 401 ? redirectToLogin() : console.error(err) 
    })
    .finally(() =>{
      setSpinnerOn(false)
    })
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    setSpinnerOn(true)
    axiosWithAuth().put(`${articlesUrl}/${article_id}`, article)
    .then(res => {
    })
    .catch(err => {
      err.res.status === 401 ? redirectToLogin() : console.error(err)
    })
    .finally(() => {
      setSpinnerOn(false)
    })
    // You got this!
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setSpinnerOn(true)
    axiosWithAuth().delete(`${articlesUrl}/${article_id}`)
      .then(res => {
        setArticles(articles.filter(article => article.article_id !== article_id))
        setMessage(res.data.message)
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm currentArticle={articles.find(article => article.article_id === currentArticleId)} postArticle={postArticle} updateArticle={updateArticle} setCurrentArticleId={setCurrentArticleId}/>
              <Articles articles={articles} getArticles={getArticles} setCurrentArticleId={setCurrentArticleId} currentArticleId={currentArticleId} deleteArticle={deleteArticle}/>
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}
