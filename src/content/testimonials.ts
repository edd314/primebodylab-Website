import {z} from 'zod';
import {testimonialSchema, type Testimonial} from './schema';

/**
 * English quotes are reproduced exactly as they appear on primebodylab.de.
 * Two of them contain errors on the live site — see docs/client-questions.md.
 * They are NOT silently corrected here: these are real clients' words and
 * changing them is Eddie's call, not ours.
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
    id: 'dr-verena',
    author: 'Dr. Verena',
    rating: 5,
    quote: {
      de: 'Normalerweise leide ich unter chronischer Migräne. Nach der Arbeit mit Eddie haben die Migräneanfälle nachgelassen und ich spüre eine enorme Erleichterung. Eddie ist unkompliziert, hört aktiv zu und geht auf Gespräche ein. Ich bin wirklich froh, mit ihm zu arbeiten.',
      en: 'I usually experience chronic migraines, however after working with Eddie the migraines reduced and i have tremendous relief. Eddie is easy to work with, an active listener and comprehends conversations. I am truly happy to be working with him.',
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
    id: 'dr-moritz',
    author: 'Dr. Moritz',
    rating: 4,
    quote: {
      de: 'Eddie hat ein Gespür für muskuläre Verspannungen und seine Leidenschaft für seine Arbeit ist wirklich erfrischend. Ich hatte schon viele Therapeuten, aber keinen wie ihn.',
      en: 'Eddie has a sense for muscle tension and his passion for what he does is really refreshing. I have had many therapist in the past but none like him.',
    },
  },
];

export const testimonials = z.array(testimonialSchema).parse(data);
