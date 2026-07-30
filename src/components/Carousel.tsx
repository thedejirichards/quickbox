import { useState, useEffect } from 'react';

const slides = [
  {
    image: '/Image carosel-1.jpg',
    alt: 'Workspace overview',
    header: 'Fantastic loan offerings, just for you',
    subtext: 'You can get that dream car with our Vehicle Finance loan offering. Sign up to find out how. Terms and Conditions apply.',
  },
  {
    image: '/Image carosel-2.jpg',
    alt: 'Team collaboration',
    header: 'Finance your dreams with a Vehicle Finance Loan',
    subtext: 'You can get that dream car with our Vehicle Finance loan offering. Sign up to find out how. Terms and Conditions apply.',
  },
  {
    image: '/image carosel-3.jpg',
    alt: 'Business analytics',
    header: 'Device Finance is here for you',
    subtext: 'Explore our Device Finance loan and get access to over 20,000 new gadgets and devices. Sign up and start exploring.',
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="carousel">
      <div className="carousel-images">
        {slides.map((slide, i) => (
          <div key={slide.image} className={`carousel-slide ${i === current ? 'active' : ''}`}>
            <img
              src={slide.image}
              alt={slide.alt}
              className="carousel-image"
            />
            <div className="carousel-overlay" />
            <div className="carousel-content">
              <h2 className="carousel-header">{slide.header}</h2>
              <p className="carousel-subtext">{slide.subtext}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
