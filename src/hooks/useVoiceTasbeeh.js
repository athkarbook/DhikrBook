import { useState, useEffect } from 'react';

export function useVoiceTasbeeh() {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setSpeechSupported(true);
    }

    return () => {
      window.isIntentionallyListening = false;
      if (window.recognition) {
        window.recognition.stop();
      }
    };
  }, []);

  const toggleVoiceTasbeeh = () => {
    if (!speechSupported) return;

    if (isListening) {
      window.isIntentionallyListening = false;
      setIsListening(false);
      if (window.recognition) window.recognition.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!window.recognition) {
      window.recognition = new SpeechRecognition();
      window.recognition.lang = 'ar-SA';
      window.recognition.continuous = true;
      window.recognition.interimResults = false;

      window.recognition.onstart = () => setIsListening(true);

      window.recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript.trim();

        if (transcript.length === 0) return;

        const tasbeehBtn = document.getElementById('hidden-tasbeeh-btn');
        const isTasbeehModalOpen = !!document.getElementById('tasbeeh-modal-container');

        const dhikrKeywords = ['الله', 'سبحان', 'حمد', 'إله', 'اله', 'اكبر', 'أكبر', 'استغفر', 'أستغفر', 'اللهم', 'رب', 'نبي', 'رسول', 'حول', 'قوة', 'بسم', 'أعوذ', 'اعوذ', 'تبارك', 'تعالى', 'عز', 'كريم', 'عظيم'];

        const transcriptWords = transcript.split(' ');
        const containsDhikr = transcriptWords.some(tw =>
          tw.length >= 2 && dhikrKeywords.some(keyword => tw.includes(keyword))
        );

        if (isTasbeehModalOpen) {
          if (containsDhikr || transcript.length > 5) {
            tasbeehBtn?.click();
          }
          return;
        }

        const uncompletedCards = Array.from(document.querySelectorAll('.dhikr-card:not(.completed)'));
        if (uncompletedCards.length === 0) {
          if (containsDhikr) tasbeehBtn?.click();
          return;
        }

        const visibleCards = uncompletedCards.filter(card => {
          const rect = card.getBoundingClientRect();
          return rect.top < window.innerHeight - 100 && rect.bottom > 100;
        });
        const targetCard = visibleCards.length > 0 ? visibleCards[0] : uncompletedCards[0];

        window.voiceState = window.voiceState || {};
        if (!window.voiceState[targetCard.id]) {
          window.voiceState[targetCard.id] = [];
        }

        const normalizeArabic = (text) => {
          return text
            .replace(/[\u064B-\u065F\u0670]/g, '')
            .replace(/[أإآ]/g, 'ا')
            .replace(/ة/g, 'ه')
            .replace(/ى/g, 'ي')
            .replace(/[^\u0621-\u064A\s]/g, '')
            .trim();
        };

        const spokenWords = normalizeArabic(transcript).split(/\s+/).filter(w => w.length >= 2);
        window.voiceState[targetCard.id].push(...spokenWords);

        const pElem = targetCard.querySelector('p');
        const cardText = pElem ? pElem.innerText : '';
        const cardWords = normalizeArabic(cardText).split(/\s+/).filter(w => w.length >= 2);

        if (cardWords.length === 0) return;

        let shouldIncrement = false;
        const stopWords = ['الله', 'اللهم', 'لا', 'الا', 'هو', 'في', 'من', 'على', 'ما', 'وما', 'له', 'ان', 'انا', 'يا', 'ولا', 'الذي', 'التي', 'بين', 'عنده', 'بما', 'هذا', 'هذه', 'كان', 'كنت', 'وان'];

        if (cardWords.length <= 6) {
          const requiredShort = Math.ceil(cardWords.length * 0.5);
          let matches = 0;
          for (const w of cardWords) {
            if (spokenWords.includes(w)) matches++;
          }
          if (matches >= requiredShort) {
            shouldIncrement = true;
          }
        } else {
          const uniqueCardWords = [...new Set(cardWords)];
          const uniqueSpoken = [...new Set(window.voiceState[targetCard.id])];
          const specificCardWords = uniqueCardWords.filter(w => !stopWords.includes(w));

          let distinctMatches = 0;
          for (const w of specificCardWords) {
            if (uniqueSpoken.includes(w)) {
              distinctMatches++;
            }
          }

          const requiredMatches = Math.max(3, Math.floor(specificCardWords.length * 0.25));
          const endIndex = Math.floor(cardWords.length * 0.70);
          const startWords = cardWords.slice(0, endIndex);
          const endWords = cardWords.slice(endIndex);

          const specificEndWords = [...new Set(endWords)].filter(w =>
            !stopWords.includes(w) && !startWords.includes(w)
          );

          const requiredEndMatches = specificEndWords.length > 0 ? Math.max(1, Math.ceil(specificEndWords.length * 0.40)) : 0;
          const endMatches = specificEndWords.filter(w => uniqueSpoken.includes(w)).length;
          const hasReachedEnd = specificEndWords.length === 0 || endMatches >= requiredEndMatches;

          if (distinctMatches >= Math.min(requiredMatches, specificCardWords.length) && hasReachedEnd) {
            shouldIncrement = true;
          }
        }

        if (shouldIncrement) {
          const btn = targetCard.querySelector('button.dhikr-increment-btn');
          if (btn) {
            btn.click();
            window.voiceState[targetCard.id] = [];

            setTimeout(() => {
              const isCompletedNow = targetCard.classList.contains('completed');
              let elementToScroll = targetCard;

              if (isCompletedNow) {
                const nextUncompleted = document.querySelector('.dhikr-card:not(.completed)');
                if (nextUncompleted) {
                  elementToScroll = nextUncompleted;
                }
              }

              const rect = elementToScroll.getBoundingClientRect();
              const isFullyVisible = (rect.top >= 100) && (rect.bottom <= window.innerHeight - 50);

              if (!isFullyVisible) {
                elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 200);
          }
        }
      };

      window.recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          setIsListening(false);
          window.isIntentionallyListening = false;
        }
      };

      window.recognition.onend = () => {
        if (window.isIntentionallyListening) {
          try { window.recognition.start(); } catch (e) { }
        } else {
          setIsListening(false);
        }
      };
    }

    window.isIntentionallyListening = true;
    try {
      window.recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  return { isListening, speechSupported, toggleVoiceTasbeeh };
}
