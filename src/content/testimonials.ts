import {z} from 'zod';
import {testimonialSchema, type Testimonial} from './schema';

/**
 * English is the client's original wording (reproduced verbatim, including
 * informal phrasing), German is our translation:
 *   tom-steggemen, michael-oatah, angelika-steiber, katherina-wintrich, moritz,
 *   beijing-sweetheart, promise-igba
 *
 * German is the client's original Google review (reproduced verbatim),
 * English is our translation — the reverse of above:
 *   tchime-josh, roberto-b, bianca-ozunu, verena-schmuckermeier,
 *   sam-azura, denise-gunesch-zelch, stefanie-oberndofer,
 *   charlotte-kleinschrot, kathrin
 *
 * Grammar/wording is never silently corrected either direction: these are
 * real clients' words, and changing them is Eddie's call, not ours.
 *
 * bianca-ozunu is intentionally much longer than the others (her real
 * review, reproduced in full) — this will make her card taller than its
 * grid neighbor. Flagged to Eddie; trim only if he asks.
 *
 * moritz and verena-schmuckermeier are the actual Google reviews for the
 * "Dr. Moritz"/"Dr. Verena" testimonials removed earlier pending real text —
 * this is that resolution. No "Dr." title: Eddie gave plain names this time.
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
  {
    id: 'bianca-ozunu',
    author: 'Bianca Ozunu',
    rating: 5,
    quote: {
      de: 'Ich kenne Eddie seit mittlerweile fast zwei Jahren und bin seitdem bei ihm in Behandlung (mobile Experience). Aufgrund meiner beruflichen Tätigkeit litt ich unter starken Rückenproblemen mit wiederkehrenden Hexenschüssen und chronischen Schmerzen.\n\nSchon nach Beginn der Therapie haben meine Beschwerden deutlich nachgelassen, und die Hexenschüsse sind nie wieder zurückgekommen. Doch das Beeindruckendste passierte in einer der Sitzungen: Nach einer gezielten Behandlung waren meine Rückenschmerzen vollständig verschwunden – und sind bis heute nicht zurückgekehrt! Ich führe die Therapie weiterhin prophylaktisch fort, aber dieses Erlebnis hat mich nachhaltig beeindruckt.\n\nWas Eddie besonders macht, ist sein ganzheitlicher Ansatz. Er behandelt nicht einfach Symptome, sondern sucht nach der eigentlichen Ursache und passt jede Behandlung individuell an. In meinem Fall hat er durch eine gezielte Lymphdrainage am Bein und die Aktivierung bestimmter Punkte eine Wirkung bis in den unteren Rücken erzielt – mit einem Ergebnis, das ich nie für möglich gehalten hätte.\n\nEddie, DANKE! Du bist mein Held! ❤️',
      en: 'I have known Eddie for almost two years now and have been his client ever since (mobile experience). Because of my job, I suffered from severe back problems with recurring acute lumbago and chronic pain.\n\nSoon after starting therapy, my symptoms noticeably improved, and the acute lumbago never came back. But the most impressive part happened during one of the sessions: after a targeted treatment, my back pain disappeared completely — and it hasn’t returned to this day! I still continue the therapy as a preventive measure, but that experience left a lasting impression on me.\n\nWhat makes Eddie special is his holistic approach. He doesn’t just treat symptoms — he looks for the actual cause and tailors every treatment individually. In my case, through targeted lymphatic drainage on my leg and activating specific points, he achieved an effect reaching all the way to my lower back — with a result I never thought possible.\n\nEddie, THANK YOU! You are my hero! ❤️',
    },
  },
  {
    id: 'angelika-steiber',
    author: 'Angelika Steiber',
    rating: 5,
    quote: {
      de: 'Es war einfach perfekt 🙏🏽 die beste Massage und aktive Dehnung.',
      en: 'It was just perfect 🙏🏽 best massage and active stretching.',
    },
  },
  {
    id: 'katherina-wintrich',
    author: 'Katherina Wintrich',
    rating: 5,
    quote: {
      de: 'Ich gehe jetzt seit über einem Jahr zu Eddie, und er ist unglaublich professionell. Es ist ehrlich gesagt meine liebste Stunde der Woche! Ich fühle mich danach jedes Mal großartig. Jede Sitzung wird komplett auf das abgestimmt, was mein Körper und meine Muskeln an diesem Tag brauchen, was einen großen Unterschied macht. Ich kann ihn nur wärmstens empfehlen! Mittlerweile gehen auch mehrere meiner Freundinnen zu ihm, und jede Einzelne war beeindruckt.',
      en: "I've been seeing Eddie for over a year now, and he's incredibly professional. It's honestly my favorite hour of the week! I always leave feeling amazing. Every session is completely tailored to what my body and muscles need that day, which makes such a difference. I can't recommend him enough! In the meantime, several of my friends have started going to him as well, and every single one has been impressed.",
    },
  },
  {
    id: 'moritz',
    author: 'Moritz',
    rating: 5,
    quote: {
      de: 'Sehr empfehlenswerter Service! Eddie ist der Beste!',
      en: 'Highly recommended service! Eddi is the best!',
    },
  },
  {
    id: 'verena-schmuckermeier',
    author: 'Verena Schmuckermeier',
    rating: 5,
    quote: {
      de: 'Eddie ist der beste Masseur, den wir je hatten, sehr einfühlsam und gleichzeitig super kraftvoll. Wir haben schon das zweite Abonnement bei ihm.',
      en: "Eddie is the best massage therapist we've ever had — very attentive and incredibly powerful at the same time. We're already on our second package with him.",
    },
  },
  {
    id: 'beijing-sweetheart',
    author: 'Beijing Sweetheart',
    rating: 5,
    quote: {
      en: "Eddie is an amazing professional. From the moment you enter his workplace, you can see everything is well thought. The first time I went to see him, I had very strong contractures in both my upper and lower back, and I was so surprised by how quickly he was able to identify the exact areas that were causing me pain.\n\nI left feeling much lighter and after a few more sessions the pain was gone. He really puts in all his energy and effort in every session. You can tell he's in the fitness industry and has been through injuries himself because of his practical and deep understanding of how the body works.\n\nEddie actually pays attention to what your body needs and creates a very calm, professional and comfortable atmosphere.\n\nThank you so much for your amazing work Eddie.",
      de: 'Eddie ist ein herausragender Profi. Schon beim Betreten seines Arbeitsplatzes merkt man, wie durchdacht alles ist. Beim ersten Mal hatte ich sehr starke Verspannungen im oberen und unteren Rücken, und ich war überrascht, wie schnell er genau die Stellen gefunden hat, die die Schmerzen verursacht haben.\n\nIch bin danach viel leichter rausgegangen, und nach ein paar weiteren Sitzungen waren die Schmerzen komplett weg. Er gibt in jeder Sitzung wirklich seine volle Energie und Hingabe. Man merkt, dass er aus der Fitnessbranche kommt und selbst Verletzungen durchgemacht hat – das zeigt sich in seinem praktischen und tiefen Verständnis für den Körper.\n\nEddie geht wirklich darauf ein, was der Körper gerade braucht, und schafft eine sehr ruhige, professionelle und angenehme Atmosphäre.\n\nVielen Dank für deine großartige Arbeit, Eddie.',
    },
  },
  {
    id: 'promise-igba',
    author: 'Promise Igba',
    rating: 5,
    quote: {
      en: 'Exceptional service. Definitely coming back!!',
      de: 'Außergewöhnlicher Service. Komme auf jeden Fall wieder!!',
    },
  },
  {
    id: 'sam-azura',
    author: 'Sam Azura',
    rating: 5,
    quote: {
      de: 'Ich kann Eddie wirklich von Herzen weiterempfehlen. Ich bin wegen meiner Rückenschmerzen zu ihm gekommen und habe durch seine Sportmassagen, gezielte Übungen und seine große Kompetenz schnell eine deutliche Verbesserung gespürt.\nBesonders schätze ich seine empathische Art und seine positive Energie, man fühlt sich bei ihm sehr gut aufgehoben. Auch als Personal Trainer und Ernährungsspezialist hat er mir geholfen, dem ganzheitlichen Coaching, meinen allgemeinen Gesundheitszustand sichtbar zu verbessern.\nVielen Dank, Eddie, für die professionelle und motivierende Unterstützung!🙏',
      en: "I can genuinely recommend Eddie from the bottom of my heart. I came to him because of my back pain, and thanks to his sports massages, targeted exercises, and great expertise, I felt a clear improvement quickly.\nWhat I especially appreciate is his empathetic manner and positive energy — you feel really well looked after with him. As a personal trainer and nutrition specialist too, he's helped me visibly improve my overall health through holistic coaching.\nThank you, Eddie, for the professional and motivating support!🙏",
    },
  },
  {
    id: 'denise-gunesch-zelch',
    author: 'Denise Gunesch Zelch',
    rating: 5,
    quote: {
      de: 'Ich hatte eine brasilianische Lymphmassage bei Eddie und bin begeistert! Sehr professionelle Technik, angenehme Atmosphäre und direkt danach ein tolles, leichtes Körpergefühl. Absolute Empfehlung – ich komme definitiv wieder!',
      en: "I had a Brazilian lymphatic massage with Eddie and I'm thrilled! Very professional technique, a pleasant atmosphere, and right afterward a wonderful, light feeling in my body. Highly recommend — I'll definitely be back!",
    },
  },
  {
    id: 'stefanie-oberndofer',
    author: 'Stefanie Oberndofer',
    rating: 5,
    quote: {
      de: 'Mit einem Tennisarm und massiven Blockaden im gesamten Rücken und Schulterbereich durfte ich heute eine sehr professionelle Massage sowie Beratung erhalten.\nDa meine Probleme aus Sportverletzungen einhergehen, ging Eddie genau auf die Problemstellen ein und hat mir mit seinem Wissen erklärt wie es zu diesen Verletzungen kommt, was ich verbessern kann und wie mein Training der Verletzung angepasst zu zurückkehrendem Erfolg führen wird. Zudem habe ich noch eine Lymphmassage der Beine bekommen weil sich etwas Wasser eingelagert hat.\nDa Eddie selber Sportler ist, hat er nochmal ein anderes Hintergrundwissen und überzeugt mit seinem Einfülvermögen und seiner Professionalität.\nIch werde nun regelmäßig in Behandlung gehen. Ich kann Ihn wärmstens empfehlen.\nDie Atmosphäre war ebenfalls sehr angenehm. Eine kleiner Wellness Ausflug mit großer Wirkung.',
      en: "With tennis elbow and severe blockages throughout my back and shoulder area, I got a very professional massage and consultation today.\nSince my problems stem from sports injuries, Eddie addressed the problem areas precisely and used his knowledge to explain how these injuries happen, what I can improve, and how adapting my training to the injury will lead to a return to form. I also got a lymphatic massage on my legs, since some water had built up.\nSince Eddie is an athlete himself, he brings a different kind of background knowledge and is convincing with his empathy and professionalism.\nI'll now be going for regular treatment. I can wholeheartedly recommend him.\nThe atmosphere was also very pleasant. A little wellness getaway with a big effect.",
    },
  },
  {
    id: 'charlotte-kleinschrot',
    author: 'Charlotte Kleinschrot',
    rating: 5,
    quote: {
      de: 'Ich habe schon mehrfach bei Eddie Massagen und Lymphdrainagen gebucht und die Ergebnisse sind einfach eine 12/10! Egal, ob es eine Verspannung im Schulterbereich ist oder Wassereinlagerungen, ich spüre sowohl ein direktes Ergebnis als auch eine nachhaltige Wirkung. Eddie’s Offenheit & grundlegend sympathische Art ist super angenehm und lässt einen direkt wohlfühlen und zur Ruhe kommen.\nIch habe selbst eine hochschwangere Freundin zu ihm geschickt, die ebenfalls begeistert ist und nun einen Masseur ihres Vertrauens gefunden hat ;)\nEs ist außerdem sehr unkompliziert mit Eddie einen Termin zu vereinbaren und er macht alles möglich!\nExperience ⭐️⭐️⭐️⭐️⭐️',
      en: "I've booked massages and lymphatic drainage with Eddie multiple times now, and the results are simply a 12/10! Whether it's tension in the shoulder area or water retention, I feel both an immediate result and a lasting effect. Eddie's openness and genuinely likeable manner are super pleasant and let you feel at ease and relaxed right away.\nI even sent a heavily pregnant friend to him, who was equally thrilled and has now found a massage therapist she trusts ;)\nIt's also very easy to arrange an appointment with Eddie, and he makes anything possible!\nExperience ⭐️⭐️⭐️⭐️⭐️",
    },
  },
  {
    id: 'kathrin',
    author: 'Kathrin',
    rating: 5,
    quote: {
      de: 'Eddie arbeitet sehr professionell und macht auch Hausbesuche. Ich bin ca. seit einem Jahr bei ihm für eine Massage 1x im Monat. Meine Nackenschmerzen sind seitdem deutlich besser geworden. Bei jeder anderen Massage zb bei der Thai Massage hatte ich nie das Gefühl, dass sie wirklich in die Tiefe geht und entlastet. Bei Eddie ist das ganz anders. Die Massage ist sehr intensiv und er findet die richtigen Schmerzpunkte. Ich gehe seitdem nirgendwo anders mehr zur Massage.',
      en: "Eddie works very professionally and also does home visits. I've been seeing him for a massage once a month for about a year now. My neck pain has gotten noticeably better since then. With every other massage, like Thai massage, I never felt like it really went deep enough to actually relieve anything. With Eddie it's completely different. The massage is very intense and he finds the right pressure points. I haven't gone anywhere else for a massage since.",
    },
  },
];

export const testimonials = z.array(testimonialSchema).parse(data);
