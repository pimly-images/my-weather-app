import { useState, useEffect } from 'react'

function App() {
  const [city, setCity] = useState('Tokyo');
  const [weather, setWeather] = useState(null);
  const [tomorrow, setTomorrow] = useState(null); 
  const [dayAfterTomorrow, setDayAfterTomorrow] = useState(null); // ★明後日用を追加
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
    setDayAfterTomorrow(null); // ★リセット

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`)
      .then(res => res.json())
      .then(data => setWeather(data));

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ja`)
      .then(res => res.json())
      .then(data => {
        if (data.list) {
          if (data.list.length > 8) setTomorrow(data.list[8]); // 約24時間後
          if (data.list.length > 16) setDayAfterTomorrow(data.list[16]); // 約48時間後
        }
      });
  }, [city, API_KEY]);

  if (!weather || !weather.weather) return <div style={{ textAlign: 'center', marginTop: '50px' }}>読み込み中...</div>;

  const temp = weather.main.temp;
  const currentCityData = cities.find(c => c.name === city);
  const bgImage = currentCityData ? currentCityData.img : "";

  let advice = "";
  let emoji = "";
  if (temp <= 5) { advice = "極寒！ダウンとマフラー必須！"; emoji = "❄️"; }
  else if (temp <= 10) { advice = "かなり寒い。厚手のコートを。"; emoji = "🧥"; }
  else if (temp <= 15) { advice = "肌寒いね。ジャケットが必要。"; emoji = "🧥"; }
  else if (temp <= 25) { advice = "過ごしやすい陽気。長袖でOK。"; emoji = "👕"; }
  else if (temp <= 30) { advice = "暑い！半袖で涼しく過ごしてね。"; emoji = "🏖️"; }
  else { advice = "暑い！熱中症に気をつけてね！"; emoji = "☀️"; }

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: '100vh', width: '100vw', backgroundColor: '#87CEEB', 
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
        <h1 style={{ fontSize: '16px', marginBottom: '20px' }}>お天気といっしょ</h1>      

        {/* 都市ボタン */}
        <div style={{ marginBottom: '10px' }}>
          {cities.map((c) => (
            <button key={c.name} onClick={() => setCity(c.name)} style={{ 
              margin: '3px', padding: '8px 12px', cursor: 'pointer', borderRadius: '8px', 
              border: '1px solid rgba(255,255,255,0.5)', 
              background: city === c.name ? '#ff6b6b' : 'rgba(0,0,0,0.5)',
              color: 'white', fontWeight: 'bold', fontSize: '12px'
            }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* 検索窓 */}
        <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
          <input
            type="text" value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="調べたい都市名を英語で入力..."
            style={{ padding: '10px', borderRadius: '5px 0 0 5px', border: 'none', width: '150px', outline: 'none' }}
          />
          <button type="submit" style={{ 
            padding: '10px 15px', borderRadius: '0 5px 5px 0', border: 'none', 
            backgroundColor: '#333', color: 'white', cursor: 'pointer', fontWeight: 'bold' 
          }}>検索</button>
        </form>

        {/* 現在の天気 */}
        <div style={{ background: 'rgba(255,255,255,0.85)', padding: '25px', borderRadius: '20px', color: '#333' }}>
          <h2 style={{ margin: '0', fontSize: '20px' }}>{weather.name}</h2>
          <div style={{ fontSize: '60px' }}>{emoji}</div>
          <div style={{ fontSize: '40px', fontWeight: 'bold' }}>{Math.round(temp)}℃</div>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff6b6b', margin: '10px 0' }}>{advice}</p>
          
          {/* おすすめアイテムボタン */}
          {temp <= 10 && (
            <div style={{ marginTop: '10px', padding: '10px', border: '2px dashed #007bff', borderRadius: '12px', backgroundColor: 'rgba(0, 123, 255, 0.05)' }}>
              <a href="https://www.amazon.co.jp/s?k=マフラー&tag=Pimly-22" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>マフラーを探す 🧣</a>
            </div>
          )}
          {temp > 5 && temp <= 12 && (
            <div style={{ marginTop: '10px', padding: '10px', border: '2px dashed #4b4b4b', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.05)' }}>
              <a href="https://www.amazon.co.jp/s?k=厚手+コート&tag=Pimly-22" target="_blank" rel="noopener noreferrer" style={{ color: '#333', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>厚手のコートを探す 🧥</a>
            </div>
          )}
          {/* ★新設：日焼け止めボタン（25度〜30度の時） */}
{temp >= 25 && temp <= 30 && (
  <div style={{ 
    marginTop: '10px', 
    padding: '10px', 
    border: '2px dashed #ffa502', 
    borderRadius: '12px', 
    backgroundColor: 'rgba(255, 165, 2, 0.05)' 
  }}>
    <p style={{ color: '#e67e22', fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>
      日差しが強くなってきましたね 🧴
    </p>
    <a 
      href="https://www.amazon.co.jp/s?k=日焼け止め+最強&tag=Pimly-22" 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{ 
        color: '#ffa502', 
        textDecoration: 'none', 
        fontWeight: 'bold', 
        fontSize: '14px' 
      }}
    >
      日焼け止めをチェック 🧴
    </a>
  </div>
)}

         {/* ★新設：ハンディファンボタン（25度〜30度の時） */}
{temp >= 28 && temp <= 32 && (
  <div style={{ 
    marginTop: '10px', 
    padding: '10px', 
    border: '2px dashed #ffa502', 
    borderRadius: '12px', 
    backgroundColor: 'rgba(255, 165, 2, 0.05)' 
  }}>
    <p style={{ color: '#e67e22', fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>
      真夏日です 🧊
    </p>
    <a 
      href="https://www.amazon.co.jp/s?k=ハンディファン+最強&tag=Pimly-22" 
      target="_blank" 
      rel="noopener noreferrer" 
      style={{ 
        color: '#ffa502', 
        textDecoration: 'none', 
        fontWeight: 'bold', 
        fontSize: '14px' 
      }}
    >
      ハンディファンをチェック 🧴
    </a>
  </div>
)}
        </div>

        {/* ★3日分予報エリア（横並び） */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          {tomorrow && (
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '15px', color: 'white' }}>
              <p style={{ margin: '0', fontSize: '12px', opacity: 0.8 }}>明日</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>{Math.round(tomorrow.main.temp)}°C</p>
              <p style={{ fontSize: '10px' }}>{tomorrow.weather[0].description}</p>
            </div>
          )}
          {dayAfterTomorrow && (
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '15px', color: 'white' }}>
              <p style={{ margin: '0', fontSize: '12px', opacity: 0.8 }}>明後日</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>{Math.round(dayAfterTomorrow.main.temp)}°C</p>
              <p style={{ fontSize: '10px' }}>{dayAfterTomorrow.weather[0].description}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default App