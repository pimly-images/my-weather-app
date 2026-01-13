import { useState, useEffect } from 'react'

function App() {
  const [city, setCity] = useState('Tokyo');
  const [weather, setWeather] = useState(null);
  const [tomorrow, setTomorrow] = useState(null); 
  const [inputValue, setInputValue] = useState('');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const cities = [
    { name: 'Tokyo', label: '東京', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
    { name: 'Osaka', label: '大阪', img: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80' },
    { name: 'Nagoya', label: '名古屋', img: 'https://images.unsplash.com/photo-1674923207459-98ed5a4dcd06?w=1600&auto=format&fit=crop&q=60' },
    { name: 'Sapporo', label: '札幌', img: 'https://images.unsplash.com/photo-1572420780547-8fbb45c82f0a?w=1600&auto=format&fit=crop&q=60' },
    { name: 'Fukuoka', label: '福岡', img: 'https://images.unsplash.com/photo-1750519422241-fdcccf199799?w=1600&auto=format&fit=crop&q=60' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue) {
      setCity(inputValue);
      setInputValue('');
    }
  };

  useEffect(() => {
    setWeather(null);
    setTomorrow(null); 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`)
      .then(res => res.json())
      .then(data => setWeather(data));
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ja`)
      .then(res => res.json())
      .then(data => {
        if (data.list && data.list.length > 8) setTomorrow(data.list[8]);
      });
  }, [city, API_KEY]);

  if (!weather || !weather.weather) return <div style={{ textAlign: 'center', marginTop: '50px' }}>読み込み中...</div>;

  const temp = weather.main.temp;
  const windSpeed = weather.wind.speed;
  const currentCityData = cities.find(c => c.name === city);
  const bgImage = currentCityData ? currentCityData.img : "";

let advice = "";
  let emoji = "";
  if (temp <= 5) { 
    advice = "極寒！ダウンとマフラー必須！"; 
    emoji = "❄️"; 
  } else if (temp <= 10) { 
    advice = "かなり寒い。厚手のコートを着よう。"; 
    emoji = "🧥"; 
  } else if (temp <= 15) { 
    advice = "肌寒いね。トレンチコートやジャケットを。"; 
    emoji = "🧥"; 
  } else if (temp <= 25) { 
    advice = "過ごしやすい陽気。長袖やカーディガンでOK。"; 
    emoji = "👕"; 
  } else { 
    advice = "暑い！半袖で涼しく過ごしてね。"; 
    emoji = "☀️"; 
  }

  const weatherMain = weather.weather[0].main;
  let rainAdvice = "";
  if (weatherMain === "Rain" || weatherMain === "Drizzle") rainAdvice = " ☔️ 雨が降っているよ。傘を忘れずに！";

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: '100vh', width: '100vw', backgroundColor: '#87CEEB', // skyblue
      margin: 0, padding: '20px', boxSizing: 'border-box'
    }}>
      <div style={{ 
        width: '100%', maxWidth: '500px', textAlign: 'center',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center', color: 'white',
        padding: '40px 20px', borderRadius: '30px', 
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        fontFamily: 'sans-serif'
      }}>
        <h1>お天気アドバイス</h1>      

        <div style={{ marginBottom: '10px' }}>
          {cities.map((c) => (
            <button key={c.name} onClick={() => setCity(c.name)} style={{ 
              margin: '5px', padding: '10px 15px', cursor: 'pointer', borderRadius: '8px', 
              border: '1px solid rgba(255,255,255,0.5)', 
              background: city === c.name ? '#ff6b6b' : 'rgba(0,0,0,0.5)',
              color: 'white', fontWeight: 'bold'
            }}>
              {c.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
          <input
            type="text" value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="他の都市を英語で入力..."
            style={{ padding: '10px', borderRadius: '5px 0 0 5px', border: 'none', width: '180px', outline: 'none' }}
          />
          <button type="submit" style={{ 
            padding: '10px 20px', borderRadius: '0 5px 5px 0', border: 'none', 
            backgroundColor: '#333', color: 'white', cursor: 'pointer', fontWeight: 'bold' 
          }}>
            検索
          </button>
        </form>

        <div style={{ background: 'rgba(255,255,255,0.85)', padding: '30px', borderRadius: '20px', color: '#333' }}>
          <h2>{weather.name}</h2>
          <div style={{ fontSize: '80px' }}>{emoji}</div>
          <div style={{ fontSize: '50px', fontWeight: 'bold' }}>{Math.round(temp)}℃</div>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff6b6b' }}>{advice}</p>
          
          {/* マフラーボタン（10度以下のとき） */}
  {temp <= 10 && (
    <div style={{ marginTop: '20px', padding: '15px', border: '2px dashed #007bff', borderRadius: '15px', backgroundColor: 'rgba(0, 123, 255, 0.1)' }}>
      <p style={{ color: '#0056b3', fontWeight: 'bold', marginBottom: '10px' }}>
        {temp <= 5 ? "マフラーとダウンで防寒を！" : "マフラーがあると安心な寒さです。"}
      </p>
      <a href={`https://www.amazon.co.jp/s?k=マフラー&tag=Pimly-22`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#007bff', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Amazonで探す 🧣</a>
    </div>
  )}

  {/* ★新設：厚手のコートボタン（5度〜12度くらいの時） */}
  {temp > 5 && temp <= 12 && (
    <div style={{ marginTop: '20px', padding: '15px', border: '2px dashed #4b4b4b', borderRadius: '15px', backgroundColor: 'rgba(75, 75, 75, 0.1)' }}>
      <p style={{ color: '#333', fontWeight: 'bold', marginBottom: '10px' }}>そろそろ厚手のコートの出番です！</p>
      <a href={`https://www.amazon.co.jp/s?k=厚手+コート+レディース&tag=Pimly-22`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#4b4b4b', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>コートをチェック 🧥</a>
    </div>
  )}
        </div>

        {tomorrow && (
          <div style={{ background: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '20px', marginTop: '20px', color: 'white' }}>
            <h3 style={{ margin: '0' }}>明日の予報</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {Math.round(tomorrow.main.temp)}°C / {tomorrow.weather[0].description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App