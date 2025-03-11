import "../../../css/ui/Accordion_js.css";
const Accordion = (sections = []) => {
  const container = document.createElement('div');
  container.className = 'accordion';

  sections.forEach(({ title, content }) => {
    const section = document.createElement('div');
    section.className = 'accordion-section';

    const header = document.createElement('div');
    header.className = 'accordion-header';
    header.textContent = title;

    const abody = document.createElement('div');
    abody.className = 'accordion-body';
    abody.style.display = 'none';
    abody.innerHTML = content;
    // abody.appendChild(content);

    header.addEventListener('click', () => {
      const isVisible = abody.style.display === 'block';
      abody.style.display = isVisible ? 'none' : 'block';
    });

    section.appendChild(header);
    section.appendChild(abody);
    container.appendChild(section);
  });

  return container;
};

export default Accordion;
export { Accordion };
