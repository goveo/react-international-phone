import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import './App.css';

function App() {
  const [phone, setPhone] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1>Basic example</h1>
      <h2>Client side rendering</h2>
      <p>Phone: {phone}</p>
      <PhoneInput value={phone} onChange={setPhone} />
    </div>
  );
}

export default App;
