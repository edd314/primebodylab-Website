import {videoIntroSchema, type VideoIntro} from './schema';

const data: VideoIntro = {
  src: '/videos/home-intro-reel.mp4',
  poster: '/images/home-intro-poster.jpg',
  alt: {
    de: 'Eddie bei einer Nacken- und Schulterbehandlung sowie einer Lymphdrainage',
    en: 'Eddie performing a neck and shoulder treatment and a lymphatic drainage session',
  },
  eyebrow: {
    de: 'Einblick',
    en: 'See it for yourself',
  },
  heading: {
    de: 'So fühlt sich eine Behandlung an',
    en: 'See what a session actually looks like',
  },
  body: {
    de: 'Ein kurzer Einblick in eine echte Behandlung — mit Ton.',
    en: 'A short look at a real session — with sound on.',
  },
  playLabel: {
    de: 'Video abspielen',
    en: 'Play video',
  },
};

export const videoIntro = videoIntroSchema.parse(data);
