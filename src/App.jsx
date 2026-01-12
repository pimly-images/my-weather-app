import { useState, useEffect } from 'react'

function App() {
  const [city, setCity] = useState('Tokyo');
  const [weather, setWeather] = useState(null);
  // 【修正】明日の予報を保存する箱を追加
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
  e.preventDefault(); // 画面のリロードを防ぐ
  if (inputValue) {
    setCity(inputValue); // 入力された文字を都市名としてセット
    setInputValue('');   // 検索窓を空にする
  }
};

  useEffect(() => {
    setWeather(null);
    setTomorrow(null); 

    // 今日の天気
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`)
      .then(res => res.json())
      .then(data => setWeather(data));

    // 明日の予報
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ja`)
      .then(res => res.json())
      .then(data => {
        if (data.list) setTomorrow(data.list[8]); // 約24時間後
      });
  }, [city, API_KEY]);

  if (!weather) return <div style={{ textAlign: 'center', marginTop: '50px' }}>読み込み中...</div>;

  const temp = weather.main.temp;
  const windSpeed = weather.wind.speed;
  const currentCityData = cities.find(c => c.name === city);
  const bgImage = currentCityData ? currentCityData.img : "";

  let advice = "";
  let emoji = "";
  if (temp <= 5) { advice = "極寒！ダウンとマフラー必須！"; emoji = "❄️"; }
  else if (temp <= 15) { advice = "寒いね。厚手のコートを着よう。"; emoji = "🧥"; }
  else if (temp <= 25) { advice = "過ごしやすい陽気。長袖でOK。"; emoji = "👕"; }
  else { advice = "暑い！半袖で涼しく過ごしてね。"; emoji = "☀️"; }

  let windAdvice = "";
  if (windSpeed > 8) { windAdvice = "⚠️ 風が強い！飛ばされないように！"; }
  else if (windSpeed > 4) { windAdvice = "🍃 風があるから、体感はもっと寒いかも。"; }

  let rainAdvice = "";
  const weatherMain = weather.weather[0].main;
  if (weatherMain === "Rain" || weatherMain === "Drizzle") { rainAdvice = " ☔️ 雨が降っているよ。傘を忘れずに！"; }
  else if (weatherMain === "Thunderstorm") { rainAdvice = " ⚡️ 雷雨だよ！頑丈な傘か、雨宿りが必要かも。"; }
  else if (weatherMain === "Snow") { rainAdvice = " ☃️ 雪だね！滑りにくい靴と傘を準備して。"; }

  return (
    <div style={{ 
      display: 'flex',           // センター配置のための魔法
      justifyContent: 'center',  // 横方向の真ん中
      alignItems: 'center',      // 縦方向の真ん中
      minHeight: '100vh',        // 画面の高さ一杯に広げる
      backgroundColor: '#f0f2f5', // 画面全体の背景色（薄いグレー）
      padding: '20px'
    }}>
      {/* これが「本体」のカード */}
      <div style={{ 
        width: '100%',
        maxWidth: '500px',        // アプリの最大幅
        textAlign: 'center',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '40px 20px',
        borderRadius: '30px',     // 角丸を強めに
        border: '1px solid rgba(255, 255, 255, 0.3)', // 薄い色のボーダー
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',    // ふわっと浮かせる影
        fontFamily: 'sans-serif'
      }}>
        <h1>お天気アドバイザー</h1>
        
        {/* --- ここから下に、今までのボタンや検索窓が続きます --- */}
      <h1>お天気アドバイス</h1>      

{/* 都市ボタンのリスト */}
      <div style={{ marginBottom: '10px' }}>
        {cities.map((c) => (
          <button key={c.name} onClick={() => setCity(c.name)} style={{ margin: '5px', padding: '10px 15px', cursor: 'pointer', borderRadius: '5px', border: 'none', background: city === c.name ? '#ff6b6b' : 'white' }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* ★★★ ここに追加！検索窓 ★★★ */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="他の都市を英語で入力..."
          style={{
            padding: '10px',
            borderRadius: '5px 0 0 5px',
            border: 'none',
            width: '180px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            borderRadius: '0 5px 5px 0',
            border: 'none',
            backgroundColor: '#333',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          検索
        </button>
      </form>

      <div style={{ background: 'rgba(255,255,255,0.85)', padding: '30px', borderRadius: '20px', color: '#333', maxWidth: '500px', margin: '0 auto' }}>
        <h2>{weather.name}（現在）</h2>
        <div style={{ fontSize: '80px' }}>{emoji}</div>
        <div style={{ fontSize: '50px', fontWeight: 'bold' }}>{Math.round(temp)}℃</div>
        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff6b6b' }}>{advice}</p>
        
        {windAdvice && <p style={{ color: '#007bff', fontWeight: 'bold' }}>{windAdvice}</p>}

        {/* マフラーボタン（今日） */}
        {temp <= 10 && (
          <div style={{ marginTop: '20px', padding: '15px', border: '2px dashed #007bff', borderRadius: '15px', backgroundColor: 'rgba(0, 123, 255, 0.1)' }}>
            <p style={{ color: '#0056b3', fontWeight: 'bold', marginBottom: '10px' }}>寒いです！マフラーをしましょう。</p>
            <a href={`https://www.amazon.co.jp/s?k=マフラー&tag=Pimly-22`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#007bff', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Amazonで探す 🧣</a>
          </div>
        )}

        {/* 傘ボタン（今日） */}
        {rainAdvice && (
          <div style={{ marginTop: '20px', padding: '15px', border: '2px dashed #FF9900', borderRadius: '15px', backgroundColor: 'rgba(255, 153, 0, 0.1)' }}>
            <p style={{ color: '#d35400', fontWeight: 'bold', marginBottom: '10px' }}>{rainAdvice}</p>
            <a href={`https://www.amazon.co.jp/s?k=折りたたみ傘&tag=Pimly-22`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#FF9900', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Amazonで探す ☔️</a>
          </div>
        )}

        {/* --- 暑い時（25度以上）のボタン --- */}
        {temp >= 25 && (
          <div style={{ marginTop: '20px', padding: '15px', border: '2px dashed #ff4757', borderRadius: '15px', backgroundColor: 'rgba(255, 71, 87, 0.1)' }}>
            <p style={{ color: '#ee5253', fontWeight: 'bold', marginBottom: '10px' }}>
              暑くなってきましたね！熱中症対策を忘れずに ☀️
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <a 
                href={`https://www.amazon.co.jp/s?k=ハンディファン&tag=Pimly-22`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#ff4757', color: 'white', padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'
                }}
              >
                ハンディファン ❄️
              </a>
              <a 
                href={`https://www.amazon.co.jp/s?k=日焼け止め&tag=Pimly-22`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#ffa502', color: 'white', padding: '10px 15px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px'
                }}
              >
                日焼け止め 🧴
              </a>
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px', fontSize: '14px', color: '#666' }}>
          <p>風速：{windSpeed} m/s | 空：{weather.weather[0].description}</p>
        </div>
      </div>

      {/* --- 明日の予報エリア --- */}
      {tomorrow && (
        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '20px', maxWidth: '500px', margin: '20px auto', color: 'white' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>明日の予報</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {Math.round(tomorrow.main.temp)}°C / {tomorrow.weather[0].description}
          </p>
          
          {tomorrow.main.temp <= 10 && (
            <div style={{ marginTop: '10px', borderTop: '1px solid #555', paddingTop: '10px' }}>
              <p>🧣 明日は冷え込みます。準備はお済みですか？</p>
              <a href={`https://www.amazon.co.jp/s?k=マフラー&tag=Pimly-22`} target="_blank" rel="noopener noreferrer" style={{ color: '#FF9900', fontWeight: 'bold', textDecoration: 'none' }}>
                Amazonでマフラーをチェック
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App