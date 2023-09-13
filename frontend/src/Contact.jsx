const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Formularz wysłany poprawnie!");
  };

  return (
    <div>
      <p>Nowy formularz kontaktowy</p>
      <form onSubmit={handleSubmit}>
        <input type="email" required placeholder="twój@email.pl" />
        <textarea placeholder="Wpisz wiadomość"></textarea>
        <div>
          <input type="checkbox" id="consent" name="consent" />
          <label htmlFor="consent">Zgoda na przetwarzanie danych</label>
        </div>
        <button type="submit">Wyślij</button>
      </form>
    </div>
  );
};

export default Contact;
