import  {Navigate, Route, Routes} from 'react-router-dom'
import Register from './pages/register/register.tsx';
import Login from './pages/login/login.tsx';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/login" replace/>} />
      <Route path = '/register' element={<Register/>}/>
      <Route path = '/login' element={<Login/>}/>
    </Routes>
  );
}

export default App;
