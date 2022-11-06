import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import AddGame from './AddGame';
import DatePicker from './DatePicker';
import EditGame from './EditGame';
import GameDate from './GameDate';
import Header from './Header';
import Main from './Main';
import Rating from './Rating';
import style from './App.module.css';

function App() {
  return (
    <BrowserRouter>
      <div className={style.App}>
        <Header />
        <div className={style.body}>
          <Routes>
            <Route index element={<Main />} />
            <Route path="game">
              <Route path="add" element={<AddGame />} />
              <Route path="edit/:id" element={<EditGame />} />
              <Route path="calendar" element={<DatePicker />} />
              <Route path="date/:date" element={<GameDate />} />
            </Route>
            <Route path="rating" element={<Rating />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
