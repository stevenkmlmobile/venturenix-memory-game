import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const initialCards = [
    { id: 1, src: '/img/animal1.jpg', pair: 'a' },
    { id: 2, src: '/img/animal2.jpg', pair: 'b' },
    { id: 3, src: '/img/animal3.jpg', pair: 'c' },
    { id: 4, src: '/img/animal4.jpg', pair: 'd' },
    { id: 5, src: '/img/animal5.jpg', pair: 'e' },
    { id: 6, src: '/img/animal6.jpg', pair: 'f' },
    { id: 7, src: '/img/animal1.jpg', pair: 'a' },
    { id: 8, src: '/img/animal2.jpg', pair: 'b' },
    { id: 9, src: '/img/animal3.jpg', pair: 'c' },
    { id: 10, src: '/img/animal4.jpg', pair: 'd' },
    { id: 11, src: '/img/animal5.jpg', pair: 'e' },
    { id: 12, src: '/img/animal6.jpg', pair: 'f' },
  ];

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Initialize and shuffle cards
  const initializeGame = () => {
    const shuffled = [...initialCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setAttempts(0);
    setSuccesses(0);
  };

  // Preload all images
  useEffect(() => {
    const imagesToLoad = [
      '/img/animal1.jpg',
      '/img/animal2.jpg',
      '/img/animal3.jpg',
      '/img/animal4.jpg',
      '/img/animal5.jpg',
      '/img/animal6.jpg',
    ];

    let loadedCount = 0;
    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imagesToLoad.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === imagesToLoad.length) {
          setImagesLoaded(true);
        }
      };
      img.src = src;
    });
  }, []);

  // Initialize game when images are loaded
  useEffect(() => {
    if (imagesLoaded) {
      initializeGame();
    }
  }, [imagesLoaded]);

  // Handle card flip
  const handleCardClick = (index) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length >= 2) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const isMatch = cards[first].pair === cards[second].pair;

      if (isMatch) {
        // Match found
        setMatched([...matched, first, second]);
        setSuccesses(successes + 1);
        setAttempts(attempts + 1);
        setFlipped([]);
      } else {
        // No match - flip back after 1000ms
        setAttempts(attempts + 1);
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const newGame = () => {
    initializeGame();
  };

  if (!imagesLoaded) {
    return (
      <div className="app">
        <div className="loading">Loading images...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Venturenix LAB Memory Game</h1>

        <div className="stats-bar">
          <div className="stat">
            <span className="stat-label">成功配對次數:</span>
            <span className="stat-value">{successes}</span>
          </div>
          <div className="stat">
            <span className="stat-label">嘗試配對次數:</span>
            <span className="stat-value">{attempts}</span>
          </div>
          <button className="new-game-btn" onClick={newGame}>
            新遊戲
          </button>
        </div>

        <div className="grid">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''} ${matched.includes(index) ? 'matched' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <span>Venturenix LAB</span>
                </div>
                <div className="card-back">
                  <img src={card.src} alt="card" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
