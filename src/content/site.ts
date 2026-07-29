import {siteSchema, type Site} from './schema';

const data: Site = {
  ownerName: 'Eddie Ekanem',
  phone: '+49 176 83248394',
  phoneHref: 'tel:+4917683248394',
  email: 'book_primebodylab@proton.me',
  whatsapp: 'https://wa.me/4917683248394',
  street: 'Hans-Kohlman-str',
  postcode: '85276',
  city: 'Pfaffenhofen',
  country: 'DE',
  taxId: '154/214/50789',
  socials: {
    instagram: 'https://www.instagram.com/prime.body.lab/',
    tiktok: 'https://www.tiktok.com/@primebodylab_',
    facebook: 'https://www.facebook.com/primebodylab',
  },
  qualifications: {
    de: [
      'Zertifizierter Personal Trainer',
      'Zertifizierter Sportmasseur',
      'Zertifizierter Stretch-Spezialist',
    ],
    en: [
      'Certified Personal Trainer',
      'Certified Sports Massage Therapist',
      'Certified Assisted Stretch Specialist',
    ],
  },
};

export const site = siteSchema.parse(data);
