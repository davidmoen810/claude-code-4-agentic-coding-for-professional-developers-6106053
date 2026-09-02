import Arrow from './icons/Arrow';
import { buttonStyle } from './InterfaceStyles';
function Modals({ member, handleClose, handleChange }) {
  return (
    (member &&
      <dialog open>
        <article>
          <header style={{ height: '2.4rem' }}>
            <button
              aria-label="close"
              rel="prev"
              onClick={handleClose}
            ></button>
          </header>
          <hgroup>
            <div className="member-detail">
              <img src={`images/${member.slug}.svg`} alt={member.name} />
              <hgroup>
                <h1>{member.name}</h1>
                <p>{member.bio}</p>
              </hgroup>
            </div>
          </hgroup>
          <footer style={{ display: 'flex', justifyContent: 'space-between' }}>
            <a href="#" style={buttonStyle} role="button"
              onClick={() => { handleChange(Number(member.id) - 1) }}
            ><Arrow /></a>
            <a href="#" style={buttonStyle} role="button"
              onClick={() => { handleChange(Number(member.id) + 1) }}
            ><Arrow flip={true} /></a>
          </footer>
        </article>
      </dialog>
    )
  )
}

export default Modals;