import {z} from 'zod';
import {testimonialSchema, type Testimonial} from './schema';

/**
 * tom-steggemen and michael-oatah: English is the client's original wording
 * (reproduced verbatim, including phrasing that reads slightly informally),
 * German is our translation.
 *
 * tchime-josh and roberto-b: German is the client's original Google review
 * (reproduced verbatim), English is our translation — the reverse of above.
 *
 * Grammar/wording is never silently corrected either direction: these are
 * real clients' words, and changing them is Eddie's call, not ours.
 *
 * Dr. Verena and Dr. Moritz were removed at Eddie's request pending their
 * actual Google review text — do not re-add from git history without it.
 */
const data: Testimonial[] = [
  {
    id: 'tom-steggemen',
    author: 'Tom Steggemen',
    rating: 5,
    quote: {
      de: 'Ich trainiere jetzt seit etwa drei Jahren mit Eddie. Am Anfang schaffte ich keinen einzigen Liegestütz, heute schaffe ich 30 am Stück. Ich habe wirklich viel von ihm gelernt und bin sehr dankbar.',
      en: 'I have been training with Eddie for about 3 years now. Started off being able to perform no pushups, now I can do 30 pushups in one go. Really learnt a lot from him and I am truly grateful.',
    },
  },
  {
    id: 'michael-oatah',
    author: 'Michael Oatah',
    rating: 4,
    quote: {
      de: 'Ich wollte schon immer einen Trainer, der mir Neues zeigt und mich über meine Grenzen hinaus fordert. Eddie hat nicht nur das getan — sein Ansatz und seine Leidenschaft für seine Arbeit sind inspirierend.',
      en: 'I’ve always wanted a trainer who will show me new things and push me beyond my threshold. Eddie didn’t just do that, his approach and passion for what he does is inspirational.',
    },
  },
  {
    id: 'tchime-josh',
    author: 'Tchime Josh',
    rating: 5,
    quote: {
      de: 'Ich nur empfehlen.',
      en: 'Can only recommend.',
    },
  },
  {
    id: 'roberto-b',
    author: 'Roberto B.',
    rating: 5,
    quote: {
      de: 'Es war super!!!! Eddie ist ein toller Masseur.',
      en: 'It was great!!!! Eddie is a fantastic massage therapist.',
    },
  },
];

export const testimonials = z.array(testimonialSchema).parse(data);
