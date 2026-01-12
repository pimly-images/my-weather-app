import { useState, useEffect } from 'react'

function App() {
  // 表示する都市を管理する（初期値は Tokyo）
  const [city, setCity] = useState('Tokyo');
  const [weather, setWeather] = useState(null);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // ← 自分のキーが入っているか確認！

  // 五大都市のリスト
const cities = [
    { name: 'Tokyo', label: '東京', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80' },
    { name: 'Osaka', label: '大阪', img: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80' },
    { name: 'Nagoya', label: '名古屋', img: 'https://images.unsplash.com/photo-1674923207459-98ed5a4dcd06?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8JUU1JTkwJThEJUU1JThGJUE0JUU1JUIxJThCfGVufDB8fDB8fHwwauto=format&fit=crop&w=800&q=80' },
    { name: 'Sapporo', label: '札幌', img: 'hhttps://images.unsplash.com/photo-1572420780547-8fbb45c82f0a?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JUU2JTlDJUFEJUU1JUI5JThDfGVufDB8fDB8fHww?auto=format&fit=crop&w=800&q=80' },
    { name: 'Fukuoka', label: '福岡', img: 'https://images.unsplash.com/photo-1750519422241-fdcccf199799?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8JUU1JThEJTlBJUU1JUE0JTlBfGVufDB8fDB8fHww?auto=format&fit=crop&w=800&q=80' },
  ];

 useEffect(() => {
    setWeather(null);
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ja`)
      .then(res => res.json())
      .then(data => setWeather(data));
  }, [city]);

  if (!weather) return <div style={{ textAlign: 'center', marginTop: '50px' }}>読み込み中...</div>;

  // --- 1. データの取り出し ---
  const temp = weather.main.temp;
  const windSpeed = weather.wind.speed;
  const currentCityData = cities.find(c => c.name === city);
  const bgImage = currentCityData ? currentCityData.img : "";

  // --- 2. 服装と風のアドバイス判定 ---
  let advice = "";
  let emoji = "";
  if (temp <= 5) { advice = "極寒！ダウンとマフラー必須！"; emoji = "❄️"; }
  else if (temp <= 15) { advice = "寒いね。厚手のコートを着よう。"; emoji = "🧥"; }
  else if (temp <= 25) { advice = "過ごしやすい陽気。長袖でOK。"; emoji = "👕"; }
  else { advice = "暑い！半袖で涼しく過ごしてね。"; emoji = "☀️"; }

  let windAdvice = "";
  if (windSpeed > 8) { windAdvice = "⚠️ 風が強い！飛ばされないように！"; }
  else if (windSpeed > 4) { windAdvice = "🍃 風があるから、体感はもっと寒いかも。"; }
  // --- 2.5 雨の判定を追加 ---
  let rainAdvice = "";
  const weatherMain = weather.weather[0].main; // 「Rain」や「Clear」などの状態

  if (weatherMain === "Rain" || weatherMain === "Drizzle") {
    rainAdvice = " ☔️ 雨が降っているよ。傘を忘れずに！";
  } else if (weatherMain === "Thunderstorm") {
    rainAdvice = " ⚡️ 雷雨だよ！頑丈な傘か、雨宿りが必要かも。";
  } else if (weatherMain === "Snow") {
    rainAdvice = " ☃️ 雪だね！滑りにくい靴と傘を準備して。";
  }

  // --- 3. 画面の表示 ---
  return (
    <div style={{ 
      padding: '40px', textAlign: 'center', minHeight: '100vh',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${bgImage})`,
      backgroundSize: 'cover', backgroundPosition: 'center', color: 'white'
    }}>
      <h1>お天気アドバイザー</h1>

      <div style={{ marginBottom: '20px' }}>
        {cities.map((c) => (
          <button key={c.name} onClick={() => setCity(c.name)} style={{ margin: '5px', padding: '10px 15px', cursor: 'pointer' }}>
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ background: 'rgba(255,255,255,0.85)', padding: '30px', borderRadius: '20px', color: '#333', maxWidth: '500px', margin: '0 auto' }}>
        <h2>{weather.name}</h2>
        <div style={{ fontSize: '80px' }}>{emoji}</div>
        <div style={{ fontSize: '50px', fontWeight: 'bold' }}>{temp}℃</div>
        <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff6b6b' }}>{advice}</p>
        
        {/* 風のアドバイスがあれば表示 */}
        {windAdvice && <p style={{ color: '#007bff', fontWeight: 'bold' }}>{windAdvice}</p>}

{/* --- マフラー（寒い時）のアドバイスとボタン --- */}
{temp <= 10 && (
  <div style={{ marginTop: '20px', padding: '15px', border: '2px dashed #007bff', borderRadius: '15px', backgroundColor: 'rgba(0, 123, 255, 0.1)' }}>
    <p style={{ color: '#0056b3', fontWeight: 'bold', marginBottom: '10px' }}>
      寒いです！マフラーで首元を温めましょう。
    </p>
    <a 
      href={`https://www.amazon.co.jp/s?k=マフラー+レディース+メンズ&tag=Pimly-22`} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        display: 'inline-block',
        backgroundColor: '#007bff', // 寒いので青系のボタン
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      Amazonでマフラーを探す 🧣
    </a>
  </div>
)}

        {/* --- true && を rainAdvice && に戻す --- */}
        {rainAdvice && (
          <div style={{ marginTop: '20px', padding: '15px', border: '2px dashed #FF9900', borderRadius: '15px', backgroundColor: 'rgba(255, 153, 0, 0.1)' }}>
            <p style={{ color: '#d35400', fontWeight: 'bold', marginBottom: '10px' }}>
              {rainAdvice}
            </p>
            <a 
              href={`https://www.amazon.co.jp/s?k=折りたたみ傘&tag=Pimly-22`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#FF9900',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              Amazonで傘を探す ☔️
            </a>
          </div>
        )}

        <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px', fontSize: '14px', color: '#666' }}>
          <p>風速：{windSpeed} m/s | 空：{weather.weather[0].description}</p>
        </div>
      </div>
    </div>
  )
}

export default App