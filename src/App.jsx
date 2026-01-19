import { useState, useEffect } from 'react'

function App() {
  const [city, setCity] = useState('Tokyo');
  const [weather, setWeather] = useState(null);
  const [tomorrow, setTomorrow] = useState(null); 
  const [dayAfterTomorrow, setDayAfterTomorrow] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const cities = [
    { name: 'Tokyo', label: '東京', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
    { name: 'Osaka', label: '大阪', img: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80' },
    { name: 'Nagoya', label: '名古屋', img: 'https://images.unsplash.com/photo-1674923207459-98ed5a4dcd06?w=1600&auto=format&fit=crop&q=60' },
    { name: 'Sapporo', label: '札幌', img: 'https://images.unsplash.com/photo-1572420780547-8fbb45c82f0a?w=1600&auto=format&fit=crop&q=60' },
    { name: 'Fukuoka', label: '福岡', img: 'https://images.unsplash.com/photo-1750519422241-fdcccf199799?w=1600&auto=format&fit=crop&q=60' },
    { name: 'New York', label: 'New York', img: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1600&auto=format&fit=crop&q=60' },
    { name: 'Mawsynram', label: 'Māwsynrām', img: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1752&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=1600&auto=format&fit=crop&q=60' },
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
    setDayAfterTomorrow(null);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`)
      .then(res => res.json())
      .then(data => setWeather(data));

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ja`)
      .then(res => res.json())
      .then(data => {
        if (data.list) {
          if (data.list.length > 8) setTomorrow(data.list[8]);
          if (data.list.length > 16) setDayAfterTomorrow(data.list[16]);
        }
      });
  }, [city, API_KEY]);

  if (!weather || !weather.weather) return <div style={{ textAlign: 'center', marginTop: '50px' }}>読み込み中...</div>;

  const temp = weather.main.temp;
  const windSpeed = weather.wind.speed; // 今の風速
  const weatherMain = weather.weather[0].main; // 今の天気
  const currentCityData = cities.find(c => c.name === city);
  const bgImage = currentCityData ? currentCityData.img : "";

  // --- 気温アドバイス ---
  let advice = "";
  let emoji = "";
  if (temp <= 0) { advice = "極寒！カイロと熱燗で暖まろう！"; emoji = "❄️"; }
  else if (temp <= 5) { advice = "極寒！ダウンとマフラー必須！"; emoji = "❄️"; }
  else if (temp <= 10) { advice = "かなり寒い。厚手のコートを。"; emoji = "🧥"; }
  else if (temp <= 15) { advice = "肌寒いね。ジャケットが必要。"; emoji = "🧥"; }
  else if (temp <= 25) { advice = "過ごしやすい陽気。長袖でOK。"; emoji = "👕"; }
  else if (temp <= 30) { advice = "暑い！半袖で涼しく過ごしてね。"; emoji = "🏖️"; }
  else { advice = "暑い！熱中症に気をつけてね！"; emoji = "☀️"; }

  // --- 風のアドバイス (復活!) ---
  let windAdvice = "";
  if (windSpeed > 8) windAdvice = "⚠️ 風が強い！飛ばされないように！";
  else if (windSpeed > 4) windAdvice = "🍃 風があるから、体感はもっと寒いかも。";

  // --- 雨・雪・雷のアドバイス (復活!) ---
  let rainAdvice = "";
  if (weatherMain === "Rain" || weatherMain === "Drizzle") rainAdvice = "☔️ 雨だよ。傘を忘れずに！";
  else if (weatherMain === "Thunderstorm") rainAdvice = "⚡️ 雷雨！頑丈な傘か雨宿りを。";
  else if (weatherMain === "Snow") rainAdvice = "☃️ 雪だね。滑らない靴で出かけて。";

  return (
    
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: '100vh', width: '100vw', backgroundColor: '#87CEEB', 
      margin: 0, padding: '20px', boxSizing: 'border-box'
    }}>

<div style={{ display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center',}}>

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

        <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
          <input
            type="text" value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="都市名を英語で入力..."
            style={{ padding: '10px', borderRadius: '5px 0 0 5px', border: 'none', width: '180px', outline: 'none' }}
          />
          <button type="submit" style={{ 
            padding: '10px 15px', borderRadius: '0 5px 5px 0', border: 'none', 
            backgroundColor: '#333', color: 'white', cursor: 'pointer', fontWeight: 'bold' 
          }}>検索</button>
        </form>

        <div style={{ background: 'rgba(255,255,255,0.85)', padding: '25px', borderRadius: '20px', color: '#333' }}>
          <h2 style={{ margin: '0', fontSize: '20px' }}>{weather.name}</h2>
          <div style={{ fontSize: '60px' }}>{emoji}</div>
          <div style={{ fontSize: '40px', fontWeight: 'bold' }}>{Math.round(temp)}℃</div>
          
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff6b6b', margin: '5px 0' }}>{advice}</p>
          
          {/* 風のアドバイス表示 */}
          {windAdvice && <p style={{ color: '#007bff', fontSize: '14px', fontWeight: 'bold', margin: '5px 0' }}>{windAdvice}</p>}
          
          {/* 雨・雪・雷のアドバイス表示 */}
          {rainAdvice && <p style={{ color: '#d35400', fontSize: '14px', fontWeight: 'bold', margin: '5px 0' }}>{rainAdvice}</p>}
          
          <p style={{ fontSize: '12px', color: '#666' }}>風速: {windSpeed} m/s | {weather.weather[0].description}</p>

          {/* Amazonリンクボタン（以前と同様） */}
           {temp <= 0 && (
  <>
    <div style={{ marginTop: '10px', padding: '10px', border: '2px dashed #ff4757', borderRadius: '12px', backgroundColor: 'rgba(255, 71, 87, 0.05)' }}>
      <a href="https://www.amazon.co.jp/s?k=カイロ&tag=Pimly-22" target="_blank" rel="noopener noreferrer" style={{ color: '#ff4757', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>カイロで指先を温めて 🔥</a>
    </div>
    <div style={{ marginTop: '10px', padding: '10px', border: '2px dashed #007bff', borderRadius: '12px' }}>
      <a href="https://www.amazon.co.jp/s?k=熱燗+セット&tag=Pimly-22" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>今夜は熱燗で一杯 🍶</a>
    </div>
  </>
)}
          {temp > 1 && temp <= 10 && (
            <div style={{ marginTop: '10px', padding: '10px', border: '2px dashed #007bff', borderRadius: '12px' }}>
              <a href="https://www.amazon.co.jp/s?k=マフラー&tag=Pimly-22" target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>マフラーを探す 🧣</a>
            </div>
          )}
          {(weatherMain === "Rain" || weatherMain === "Drizzle") && (
            <div style={{ marginTop: '10px', padding: '10px', border: '2px dashed #FF9900', borderRadius: '12px' }}>
              <a href="https://www.amazon.co.jp/s?k=折りたたみ傘&tag=Pimly-22" target="_blank" rel="noopener noreferrer" style={{ color: '#FF9900', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>傘をチェック ☔️</a>
            </div>
          )}
        </div>

        {/* 予報エリア (風速を追加!) */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          {tomorrow && (
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '15px', color: 'white' }}>
              <p style={{ margin: '0', fontSize: '12px', opacity: 0.8 }}>明日</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>{Math.round(tomorrow.main.temp)}°C</p>
              <p style={{ fontSize: '10px' }}>{tomorrow.weather[0].description}</p>
              <p style={{ fontSize: '10px', marginTop: '5px', color: '#87CEEB' }}>💨 {tomorrow.wind.speed}m/s</p>
            </div>
          )}
          {dayAfterTomorrow && (
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '15px', color: 'white' }}>
              <p style={{ margin: '0', fontSize: '12px', opacity: 0.8 }}>明後日</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>{Math.round(dayAfterTomorrow.main.temp)}°C</p>
              <p style={{ fontSize: '10px' }}>{dayAfterTomorrow.weather[0].description}</p>
              <p style={{ fontSize: '10px', marginTop: '5px', color: '#87CEEB' }}>💨 {dayAfterTomorrow.wind.speed}m/s</p>
            </div>
          )}
        </div>
      </div>

<div style={{ width:'60%',
  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  padding: '15px', 
  borderRadius: '10px', 
  margin: '20px 0', 
  fontSize: '14px', 
  textAlign: 'left',
  lineHeight: '1.6'
}}>
  <h2 style={{ fontSize: '16px', margin: '0 0 10px 0' }}>💡 このアプリについて</h2>
  <p>
    「お天気といっしょ」は、単なる気温だけでなく、<b>風速1m/sにつき体感温度が1度下がる</b>という気象学的な視点を取り入れた服装アドバイスアプリです。<br />
    「予報では暖かそうだったのに、風が強くて寒かった…」そんな失敗をなくすために、OpenWeatherMapの最新データから最適な服装を提案します。
  </p>
</div>
{/* フッター：プライバシーポリシーへのリンク */}
<div style={{ 
  marginTop: '40px', 
  paddingBottom: '30px', 
  textAlign: 'center', 
  color: 'white', 
  opacity: 0.7,
 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  gap: '10px' 
}}>
  <p style={{ fontSize: '10px', margin: 0 }}>
    Data provided by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>OpenWeatherMap</a>
  </p>
  
  <div style={{ display: 'flex', gap: '15px' }}>
    <a href="/clothing.html" style={{ color: 'white', fontSize: '12px', textDecoration: 'underline' }}>
      服装の目安
    </a>
    <a href="/privacy.html" style={{ color: 'white', fontSize: '12px', textDecoration: 'underline' }}>
      プライバシーポリシー
    </a>
  </div>
</div>

</div>

    </div>
  )
}

export default App