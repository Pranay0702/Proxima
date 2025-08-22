import  {Navigate, Route, Routes} from 'react-router-dom'
import Register from './pages/register/register.tsx';
import Login from './pages/login/login.tsx';
import Home from './pages/home/home.tsx';
import LoginGuard from './shared/guards/loginGuard.tsx';
import AuthGuard from './shared/guards/authGurard.tsx';
import Network from './pages/network/network.tsx';
import Profile from './pages/profile/profile.tsx';

function App() {
  const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('currentUser');

  return (
    <Routes>
      <Route path='/' element={
        isLoggedIn
          ?<Navigate to="/home" replace/>
          :<Navigate to="/login" replace/>
      } />

      <Route path = '/register' element=
      {
        <LoginGuard>
          <Register/>
        </LoginGuard>
      }/>

      <Route path = '/login' element=
      {
        <LoginGuard>
          <Login/>
        </LoginGuard>
      }/>

      <Route path = '/home' element={
        <AuthGuard>
          <Home/>
        </AuthGuard>
      } />

      <Route path = '/network' element={
        <AuthGuard>
          <Network/>
        </AuthGuard>
      } />

      <Route path='/profile' element={
        <AuthGuard>
          <Profile/>
        </AuthGuard>
      }/>


    </Routes>
  );
}

export default App;
