import { Fragment, createElement, lazy, useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Importujemy nasz nowy ekran w sposób pozwalający wydzielić go podczas budowania do oddzielnego pliku .js
const ContactForm = lazy(() => import("./Contact"));

// Tworzymy mapę wskazującą na klasę elementu, na którym powinien pojawić się nasz formularz. W przyszłości możemy dodać tutaj kolejne komponenty.
const classToComponentMap = new Map([["contact-form-root", ContactForm]]);

const Mounter = () => {
  // Stan pozwalający wymusić przerenderowanie komponentu i zamontowanie naszych ekranów
  const [, setForceRerender] = useState("");

  // Efekt uruchamiający się przy zamontowaniu komponentu Mounter
  useEffect(() => {
    // Konfiguracja MutationObserver, obserwujemy zmiany elementu i jego wszystkich elementów podrzędnych
    const config = {
      childList: true,
      subtree: true,
    };

    // Funkcja wykonująca się w momencie wykrycia przez MutationObserver zmian w obserwowanym elemencie
    const callback = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          for (const selectorClass of classToComponentMap.keys()) {
            const observedElements = document.querySelectorAll(
              `.${selectorClass}`
            );

            if (observedElements) {
              setForceRerender(new Date().toISOString());
            }
          }
        }
      }
    };

    // Zainicjowanie nowego MutationObservera
    const observer = new MutationObserver(callback);

    // Uruchomienie obserwacji body strony
    observer.observe(document.body, config);

    return () => {
      // Sprzątanie po odmontowaniu komponentu Mounter
      observer.disconnect();
    };
  }, []);

  // Zebranie wszystkich punktów montowania naszych komponentów, w tym przypadku będzie to tylko <div class="contact-form-root"></div>
  const elementsToMount = Array.from(classToComponentMap.keys()).map(
    (selectorClass) =>
      Array.from(document.querySelectorAll(`.${selectorClass}`))
  );

  // Renderowanie naszych widoków. Dzięki zastosowaniu `createPortal` zamiast `createRoot` nasze
  // widoki pozostają w tym samym drzewie Reactowym co umożliwia w przyszłości stosowanie np. kontekstów
  return elementsToMount.flat().map((el, index) => {
    return createPortal(
      <Fragment key={index}>
        {createElement(classToComponentMap.get(el.className))}
      </Fragment>,
      el
    );
  });
};

export default Mounter;
